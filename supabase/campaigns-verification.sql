-- Run after schema.sql. Safe to re-run; does not change existing records.
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) between 1 and 200),
  summary text not null,
  details text not null,
  category text,
  image_url text,
  start_date date,
  end_date date,
  cta_label text,
  cta_url text,
  sort_order integer not null default 100,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or start_date is null or end_date >= start_date)
);

create table if not exists public.verification_records (
  id uuid primary key default gen_random_uuid(),
  verification_code text unique not null check (verification_code ~ '^[A-Z0-9][A-Z0-9-]{5,79}$'),
  full_name text not null,
  record_type text not null check (record_type in ('internship', 'employment', 'association')),
  role text not null,
  department text,
  start_date date not null,
  end_date date,
  status text not null default 'active' check (status in ('active', 'completed', 'revoked')),
  description text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

create index if not exists campaigns_display_idx on public.campaigns (is_active, sort_order, created_at desc);
create index if not exists verification_records_created_idx on public.verification_records (created_at desc);
alter table public.campaigns enable row level security;
alter table public.verification_records enable row level security;
revoke all on public.campaigns, public.verification_records from anon, authenticated;
grant all on public.campaigns, public.verification_records to service_role;

-- Public images, server-only writes. No browser write policy is created.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
