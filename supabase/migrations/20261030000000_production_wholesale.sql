-- ZeroD Farms — Production & Wholesale Availability
--
-- Public visitors never touch the base tables. They read two views that only
-- expose published, public-facing batches (and nothing the admin has chosen
-- to hide, such as bird quantities). Administrators are an explicit allowlist
-- in public.admin_users; every write is checked against it by RLS.
--
-- No pricing columns exist anywhere, by design: every sale is negotiated
-- directly with the farm.

-- ---------------------------------------------------------------------------
-- Administrators
-- ---------------------------------------------------------------------------

create table public.admin_users (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Allowlist of production administrators. Rows are added manually from the SQL editor; there is no self-service path.';

alter table public.admin_users enable row level security;

-- A signed-in user may see their own row (lets the app confirm admin status).
-- No insert/update/delete policies: only the database owner can grant access.
create policy "admins can read their own allowlist row"
  on public.admin_users for select
  to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Batches
-- ---------------------------------------------------------------------------

create type public.batch_status as enum ('upcoming', 'available', 'sold_out', 'archived');

create table public.production_batches (
  id                       uuid primary key default gen_random_uuid(),
  batch_code               text not null unique
                             check (batch_code ~ '^[A-Za-z0-9][A-Za-z0-9-]{1,31}$'),
  title                    text not null check (length(trim(title)) between 1 and 120),
  breed                    text not null default 'Pakistani Sonali Classic'
                             check (length(trim(breed)) between 1 and 80),
  status                   public.batch_status not null default 'upcoming',
  description              text check (description is null or length(description) <= 2000),
  total_birds              integer check (total_birds is null or total_birds >= 0),
  available_birds          integer check (available_birds is null or available_birds >= 0),
  show_quantity            boolean not null default false,
  minimum_order_quantity   integer check (minimum_order_quantity is null or minimum_order_quantity > 0),
  average_weight_min_kg    numeric(5, 2) check (average_weight_min_kg is null or average_weight_min_kg > 0),
  average_weight_max_kg    numeric(5, 2) check (average_weight_max_kg is null or average_weight_max_kg > 0),
  estimated_available_date date,
  sale_window_start        date,
  sale_window_end          date,
  is_published             boolean not null default false,
  display_order            integer not null default 0,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now(),

  constraint weight_range_order check (
    average_weight_min_kg is null or average_weight_max_kg is null
    or average_weight_min_kg <= average_weight_max_kg
  ),
  constraint sale_window_order check (
    sale_window_start is null or sale_window_end is null
    or sale_window_start <= sale_window_end
  ),
  constraint available_within_total check (
    total_birds is null or available_birds is null or available_birds <= total_birds
  )
);

create index production_batches_public_idx
  on public.production_batches (status, display_order)
  where is_published;

create index production_batches_updated_idx
  on public.production_batches (updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger production_batches_set_updated_at
  before update on public.production_batches
  for each row execute function public.set_updated_at();

alter table public.production_batches enable row level security;

create policy "admins manage batches"
  on public.production_batches for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Media (videos + images, many per batch)
-- ---------------------------------------------------------------------------

create type public.media_type as enum ('video', 'image');

create table public.production_media (
  id            uuid primary key default gen_random_uuid(),
  batch_id      uuid not null references public.production_batches (id) on delete cascade,
  media_type    public.media_type not null,
  -- Exactly one source: an object in the private storage bucket, or an
  -- externally hosted https URL (YouTube, a CDN-hosted MP4, …).
  storage_path  text,
  external_url  text,
  -- Optional poster image for a video, stored alongside it.
  poster_path   text,
  caption       text check (caption is null or length(caption) <= 200),
  recorded_at   date,
  is_primary    boolean not null default false,
  display_order integer not null default 0,
  created_at    timestamptz not null default now(),

  constraint one_source check (num_nonnulls(storage_path, external_url) = 1),
  constraint external_url_https check (external_url is null or external_url ~* '^https://'),
  -- Objects must live under the owning batch's folder; the storage policies
  -- below rely on this to tie each file to a batch.
  constraint storage_path_in_batch_folder check (
    storage_path is null or storage_path like batch_id::text || '/%'
  ),
  constraint poster_path_in_batch_folder check (
    poster_path is null or poster_path like batch_id::text || '/%'
  ),
  constraint poster_only_for_video check (poster_path is null or media_type = 'video')
);

create index production_media_batch_idx
  on public.production_media (batch_id, display_order);

-- One primary video and one primary image (cover) per batch.
create unique index production_media_one_primary_idx
  on public.production_media (batch_id, media_type)
  where is_primary;

-- Media changes count as an availability update for the parent batch, so the
-- public "last updated" date reflects new footage too.
create or replace function public.touch_batch_from_media()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  update public.production_batches
     set updated_at = now()
   where id = coalesce(new.batch_id, old.batch_id);
  return null;
end;
$$;

create trigger production_media_touch_batch
  after insert or update or delete on public.production_media
  for each row execute function public.touch_batch_from_media();

alter table public.production_media enable row level security;

create policy "admins manage media"
  on public.production_media for all
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- Defence in depth: anonymous visitors get no direct table access at all.
revoke all on public.admin_users, public.production_batches, public.production_media from anon;

-- ---------------------------------------------------------------------------
-- Public read surface
-- ---------------------------------------------------------------------------
-- These views run with the owner's rights (security_invoker = false) so they
-- can read past the admin-only RLS above, and they apply the public rules
-- themselves: published only, upcoming/available only, quantities hidden
-- unless the admin opted in. Internal fields (total_birds, is_published,
-- created_at) are not exposed.

create view public.public_production_batches
with (security_invoker = false)
as
select
  b.id,
  b.batch_code,
  b.title,
  b.breed,
  b.status,
  b.description,
  case when b.show_quantity then b.available_birds end as available_birds,
  b.minimum_order_quantity,
  b.average_weight_min_kg,
  b.average_weight_max_kg,
  b.estimated_available_date,
  b.sale_window_start,
  b.sale_window_end,
  b.display_order,
  b.updated_at
from public.production_batches b
where b.is_published
  and b.status in ('upcoming', 'available');

create view public.public_production_media
with (security_invoker = false)
as
select
  m.id,
  m.batch_id,
  m.media_type,
  m.external_url,
  (m.storage_path is not null) as is_stored,
  (m.poster_path is not null) as has_poster,
  m.caption,
  m.recorded_at,
  m.is_primary,
  m.display_order
from public.production_media m
join public.public_production_batches b on b.id = m.batch_id;

revoke all on public.public_production_batches, public.public_production_media from anon, authenticated;
grant select on public.public_production_batches, public.public_production_media to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage: private bucket
-- ---------------------------------------------------------------------------
-- Files are never public by URL. The site hands out short-lived signed URLs,
-- and anonymous signing is only permitted for files that belong to a
-- currently published batch (see is_public_media_object).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'production-media',
  'production-media',
  false,
  52428800, -- 50 MB; compress videos before upload (see docs/production-admin.md)
  array['video/mp4', 'video/webm', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create or replace function public.is_public_media_object(object_name text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
      from public.production_media m
      join public.production_batches b on b.id = m.batch_id
     where b.is_published
       and b.status in ('upcoming', 'available')
       and (m.storage_path = object_name or m.poster_path = object_name)
  );
$$;

revoke all on function public.is_public_media_object(text) from public;
grant execute on function public.is_public_media_object(text) to anon, authenticated;

-- Resolves a public media id to its storage object (or poster), only while
-- the parent batch is published. Used by the site's /media/[id] route, which
-- then signs a short-lived URL. Returns null for anything not public.
create or replace function public.public_media_object_path(media_id uuid, want_poster boolean default false)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select case when want_poster then m.poster_path else m.storage_path end
    from public.production_media m
    join public.production_batches b on b.id = m.batch_id
   where m.id = media_id
     and b.is_published
     and b.status in ('upcoming', 'available');
$$;

revoke all on function public.public_media_object_path(uuid, boolean) from public;
grant execute on function public.public_media_object_path(uuid, boolean) to anon, authenticated;

create policy "public can read published production media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'production-media' and public.is_public_media_object(name));

create policy "admins read production media"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'production-media' and (select public.is_admin()));

create policy "admins upload production media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'production-media' and (select public.is_admin()));

create policy "admins update production media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'production-media' and (select public.is_admin()))
  with check (bucket_id = 'production-media' and (select public.is_admin()));

create policy "admins delete production media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'production-media' and (select public.is_admin()));
