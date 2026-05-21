create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.verify_admin_login(admin_email text, admin_password text)
returns table(email text, name text)
language sql
security definer
set search_path = public
as $$
  select admin_users.email, admin_users.name
  from public.admin_users
  where lower(admin_users.email) = lower(admin_email)
    and admin_users.is_active = true
    and admin_users.password_hash = crypt(admin_password, admin_users.password_hash)
  limit 1;
$$;

revoke all on function public.verify_admin_login(text, text) from public;
revoke all on function public.verify_admin_login(text, text) from anon;
revoke all on function public.verify_admin_login(text, text) from authenticated;

-- The Next.js API calls this function with SUPABASE_SERVICE_ROLE_KEY.
