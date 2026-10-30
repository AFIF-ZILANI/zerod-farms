# Production & Wholesale Availability — setup and operations

The homepage `#production` section lists live-bird batches that are **available
for wholesale now** and **upcoming** batches still in the sheds. Every published
batch also has a permanent, shareable page at `/production/<BATCH-CODE>`, for
example `https://farms.zerod.bd/production/BATCH-001`. Content comes
from Supabase and is managed at `/admin/production`. There are no prices, cart,
checkout or customer accounts. Every enquiry goes to the farm by WhatsApp or
phone.

## How it fits together

| Piece | Where |
|---|---|
| Schema, RLS, storage bucket and policies | `supabase/migrations/20261030000000_production_wholesale.sql` |
| Public data loading | `app/lib/production/queries.ts` (anon key, public views only) |
| Homepage section | `app/components/production/*` (cards, video facade, share menu) |
| Batch pages | `app/production/[code]/page.tsx` (+ `not-found.tsx`, `error.tsx`), rendering `BatchDetail` |
| Admin preview of a batch page | `app/admin/production/[id]/preview/page.tsx` |
| Media URLs | `app/media/[id]/route.ts`: checks the batch is published, then 302s to a 1-hour signed URL |
| Admin auth gate | `proxy.ts` (session refresh + redirect), `app/lib/supabase/admin-auth.ts` (allowlist check) |
| Admin UI + Server Actions | `app/admin/**` |

Security model, enforced in the database and not only in the UI:

- `production_batches` / `production_media`: RLS allows **admins only** (`public.is_admin()`). The `anon` role has no table privileges at all.
- Visitors read two views, `public_production_batches` and `public_production_media`. They return **published + upcoming/available** rows only, hide `available_birds` unless *Show quantity* is on, and never expose `total_birds`, storage paths or draft data.
- Storage bucket `production-media` is **private**. Anonymous visitors can only sign URLs for objects that belong to a currently published batch. Unpublishing or marking a batch sold out cuts access within about 5 minutes (the redirect cache time), and existing signed URLs expire within an hour.
- Admins are an explicit allowlist (`public.admin_users`). There is no self-service path into it.

## 1. Create the Supabase project

1. Create a project at <https://supabase.com/dashboard> (region: Singapore `ap-southeast-1` is closest to Bangladesh).
2. **Disable public sign-ups:** Authentication → Sign In / Providers → turn **off** "Allow new users to sign up". Leave the **Email** provider itself **enabled**: turning that off blocks admin password login.
3. Optional but recommended: Authentication → URL Configuration → set **Site URL** to the production domain.

## 2. Apply the migration

Either paste `supabase/migrations/20261030000000_production_wholesale.sql` into **SQL Editor → New query** and run it, or use the CLI:

```bash
npx supabase@latest login
```

```bash
npx supabase@latest link --project-ref <your-project-ref>
```

```bash
npx supabase@latest db push
```

This creates the tables, enums, triggers, views, RLS policies, the private `production-media` bucket (50 MB per-file limit; MP4/WebM/MOV/JPG/PNG/WebP only) and the storage policies.

## 3. Create the first administrator

1. Authentication → Users → **Add user → Create new user**. Enter the admin's email and a strong password, and tick **Auto Confirm User**.
2. SQL Editor, run (replace the email):

   ```sql
   insert into public.admin_users (user_id, email)
   select id, email from auth.users where email = 'owner@example.com';
   ```

3. Sign in at `https://<your-domain>/admin/login`.

To add more admins, repeat both steps. To revoke access:

```sql
delete from public.admin_users where email = 'person@example.com';
```

A signed-in account that is not on the allowlist sees "not an authorised administrator" and RLS rejects every write it attempts.

## 4. Environment variables

Copy `.env.example` to `.env.local` for local development, and set the same variables in Vercel (Project → Settings → Environment Variables, for Production and Preview):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, e.g. `https://abcd.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (or set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the legacy anon key) |
| `NEXT_PUBLIC_SITE_URL` | Optional. Public origin for canonical URLs, the sitemap and shared batch links. Defaults to `https://farms.zerod.bd` |
| `SUPABASE_SECRET_KEY` | **Server-only.** Secret key (`sb_secret_…`; or set `SUPABASE_SERVICE_ROLE_KEY` to the legacy service_role key). Used only by the nightly video clean-up. Production environment only. |
| `CRON_SECRET` | **Server-only.** Random string (`openssl rand -hex 32`) that authorises the clean-up job. Vercel Cron sends it automatically. |

The secret key bypasses RLS. It is read in exactly one place, `app/lib/supabase/service.ts`, which is marked `server-only`, so importing it from browser code fails the build. Never give it a `NEXT_PUBLIC_` name. Everything else in the app still runs with the publishable key plus RLS.

If the variables are missing, the site still builds and the Production section shows its "call the farm" empty states.

## 5. Deploy

Push to the branch Vercel deploys from. The homepage, the batch pages and the sitemap are statically rendered and refreshed:

- on the next visit after any admin change, through `revalidatePath` in the Server Actions, and
- at least every 60 seconds (`export const revalidate = 60`), so date-based rules apply even when nobody edits anything. Example: an available batch whose sale window ended yesterday drops off. This interval also caps a rare ISR race: a regeneration that was already running when you saved can cache the old data, for up to a minute.

## Using the admin panel

- **New batch** → saved as a **draft** (never public until you click *Publish to website*).
- **Status:** *Upcoming* (being raised, dates shown as estimates), *Available* (ready now), *Sold out* and *Archived* (both hidden from the site). *Sold out* takes effect immediately.
- **Needs review:** the dashboard flags *available* batches whose sale window has ended (they are already hidden from the site) and *upcoming* batches whose estimated date has passed (the site shows "timing being confirmed").
- **Quantities:** "Total birds" is internal only. "Available birds" is public only when *Show available quantity* is ticked.
- **Media:** upload videos and images (progress shown), or paste an https link. YouTube links get a privacy-friendly click-to-play embed, direct `.mp4` links play inline, and anything else opens in a new tab. Per item: caption, recording date, reorder, *Make main video* / *Make cover*, poster image for videos, remove.
- **Replace** swaps the file behind a video or image and keeps its caption, date, position and main/cover status. Link items can also be edited. Replacing a video regenerates its poster.
- **Posters** are generated automatically from about 1 second into each uploaded video. To pick a better one, pause the admin preview on the frame you want and click **Use current frame as poster**, or upload an image. If a browser can't decode a file (some iPhone HEVC `.mov` files on Chrome), the upload still succeeds and the item shows a note asking for a manual poster.
- Everything here works on a **published** batch too. New videos, replacements and reordering go live on the homepage and the batch's shared link without republishing.
- All dates are Bangladesh calendar dates; timestamps are shown in Asia/Dhaka time.

## Video retention (automatic deletion)

Uploaded videos are stored only for the **sale window plus 2 days** (Bangladesh dates):

- If a sale window ends on 10 Nov, its videos are kept through 12 Nov and deleted from 13 Nov.
- Posters are deleted with their videos. **Photos and external links (YouTube…) are kept.** They cost little or nothing to store.
- Batches **without a sale window end are never purged**. Set one, or remove videos yourself.
- Extending the sale window before the deletion date keeps the videos. Changing the rule is a single constant, `VIDEO_RETENTION_DAYS_AFTER_WINDOW` in `app/lib/production/retention.ts`.

How it runs:

- **Nightly job:** `vercel.json` schedules `GET /api/cron/purge-expired-media` daily at 21:00 UTC (03:00 in Bangladesh). It needs `SUPABASE_SECRET_KEY` and `CRON_SECRET` in the Vercel **Production** environment, and Vercel only runs cron jobs on production deployments. On the Hobby plan, Vercel may run it at any point within that hour.
- **Admin panel:** each batch shows "Uploaded videos are kept until …". Rows due for deletion are flagged, and the dashboard shows a **Remove now** button when anything is past retention. That button works even before the nightly job is set up.
- Files are deleted before database rows. If storage fails, the rows stay and the next run retries, so nothing is orphaned silently.

Deletion is permanent. Download any footage you want to keep before the date shown.

To run the job by hand, for example after deploying:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://farms.zerod.bd/api/cron/purge-expired-media
```

## Batch pages and sharing

- URL: `/production/<CODE>`. Codes are stored uppercase, and lowercase links redirect to the canonical URL. While a batch is **published, its code is locked**, because buyers may already have the link. Unpublish it first if you must rename it.
- A page is public only while the batch is published **and** upcoming/available **and** (if available) inside its sale window. Otherwise the link shows "This batch is no longer listed" with links to current stock and WhatsApp, and returns HTTP 404. Its media URLs stop working too.
- **Preview page** (in the batch's Publishing panel) shows the page exactly as buyers will see it, for drafts too, visible only to signed-in admins.
- **Share Batch** is on every homepage card, every batch page (plus a fixed Enquire/Share bar on mobile) and the admin Publishing panel (once the batch is live). It offers:
  - **Share via…**: the device's native share sheet (Web Share API), shown only where supported.
  - **Share on WhatsApp**: opens WhatsApp with a pre-written wholesale update (batch, breed, availability, link). The sender picks the chat.
  - **Copy link**: copies the batch URL, with a "Link copied" confirmation.
- Link previews (WhatsApp, Facebook…) use the batch's main video poster or cover image. Pages also include `BreadcrumbList` and `VideoObject` structured data and are listed in `/sitemap.xml`.

### Preparing videos

The bucket accepts files up to **50 MB** (the Supabase free-tier per-file cap). Phone footage should be compressed first. 720p H.264 MP4 at ~2 Mbps is about 15 MB per minute and plays everywhere:

```bash
ffmpeg -i input.mov -vf "scale=-2:720" -c:v libx264 -preset slow -crf 26 -c:a aac -b:a 96k -movflags +faststart output.mp4
```

`+faststart` lets playback begin before the whole file downloads. Visitors download nothing until they press play: cards and batch pages show poster facades, the `<video>` element is only created on tap, and starting one video unmounts any other, so only one streams at a time. Storage serves byte ranges, so mobile browsers can seek without downloading the whole file.

Add a **poster** image to each uploaded video for a proper thumbnail. Without one, the batch's cover image is used, and failing that a neutral panel. A video with a poster and recording date is also published as `VideoObject` structured data.

## Local development with a full Supabase stack

Needs Docker.

```bash
npx supabase@latest start -x studio,imgproxy,edge-runtime,logflare,vector,realtime,supavisor,mailpit,postgres-meta
```

`supabase start` prints a local URL and publishable key. Put them in `.env.local`, create a user with the local Auth admin API or Studio, insert it into `admin_users` as above, then run `bun dev`. `npx supabase@latest db reset` re-applies the migration from scratch.
