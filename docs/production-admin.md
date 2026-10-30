# Production & Wholesale Availability — setup and operations

The homepage `#production` section lists live-bird batches that are **available
for wholesale now** and **upcoming** batches still in the sheds. Content comes
from Supabase and is managed at `/admin/production`. There are no prices, cart,
checkout or customer accounts. Every enquiry goes to the farm by WhatsApp or
phone.

## How it fits together

| Piece | Where |
|---|---|
| Schema, RLS, storage bucket and policies | `supabase/migrations/20261030000000_production_wholesale.sql` |
| Public data loading | `app/lib/production/queries.ts` (anon key, public views only) |
| Homepage section | `app/components/production/*` |
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

Copy `.env.example` to `.env.local` for local development, and set the same two variables in Vercel (Project → Settings → Environment Variables, for Production and Preview):

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, e.g. `https://abcd.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (or set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the legacy anon key) |

The service-role/secret key is **not used anywhere**. Do not add it.

If the variables are missing, the site still builds and the Production section shows its "call the farm" empty states.

## 5. Deploy

Push to the branch Vercel deploys from. The homepage is statically rendered and refreshed:

- immediately (on the next visit) after any admin change, through `revalidatePath("/")` in the Server Actions, and
- at least every 5 minutes (`export const revalidate = 300`), so date-based rules apply even when nobody edits anything. Example: an available batch whose sale window ended yesterday drops off.

## Using the admin panel

- **New batch** → saved as a **draft** (never public until you click *Publish to website*).
- **Status:** *Upcoming* (being raised, dates shown as estimates), *Available* (ready now), *Sold out* and *Archived* (both hidden from the site). *Sold out* takes effect immediately.
- **Needs review:** the dashboard flags *available* batches whose sale window has ended (they are already hidden from the site) and *upcoming* batches whose estimated date has passed (the site shows "timing being confirmed").
- **Quantities:** "Total birds" is internal only. "Available birds" is public only when *Show available quantity* is ticked.
- **Media:** upload videos and images (progress shown), or paste an https link. YouTube links get a privacy-friendly click-to-play embed, direct `.mp4` links play inline, and anything else opens in a new tab. Per item: caption, recording date, reorder, *Make main video* / *Make cover*, poster image for videos, remove.
- All dates are Bangladesh calendar dates; timestamps are shown in Asia/Dhaka time.

### Preparing videos

The bucket accepts files up to **50 MB** (the Supabase free-tier per-file cap). Phone footage should be compressed first. 720p H.264 MP4 at ~2 Mbps is about 15 MB per minute and plays everywhere:

```bash
ffmpeg -i input.mov -vf "scale=-2:720" -c:v libx264 -preset slow -crf 26 -c:a aac -b:a 96k -movflags +faststart output.mp4
```

`+faststart` lets playback begin before the whole file downloads. Visitors download nothing until they press play: cards show a poster facade, and the `<video>` element is only created on click.

Add a **poster** image to each uploaded video for a proper thumbnail. Without one, the batch's cover image is used, and failing that a neutral panel. A video with a poster and recording date is also published as `VideoObject` structured data.

## Local development with a full Supabase stack

Needs Docker.

```bash
npx supabase@latest start -x studio,imgproxy,edge-runtime,logflare,vector,realtime,supavisor,mailpit,postgres-meta
```

`supabase start` prints a local URL and publishable key. Put them in `.env.local`, create a user with the local Auth admin API or Studio, insert it into `admin_users` as above, then run `bun dev`. `npx supabase@latest db reset` re-applies the migration from scratch.
