create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

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

create table if not exists public.admin_login_attempts (
  email text primary key,
  attempts integer not null default 0,
  window_started_at timestamptz not null default now()
);
alter table public.admin_login_attempts enable row level security;
revoke all on public.admin_login_attempts from anon, authenticated;

create or replace function public.verify_admin_login(admin_email text, admin_password text)
returns table(email text, name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_email text := lower(trim(admin_email));
  attempt_count integer;
begin
  -- Serialize attempts per email so parallel requests cannot bypass the limit.
  perform pg_advisory_xact_lock(hashtext(normalized_email));
  delete from public.admin_login_attempts where window_started_at < now() - interval '15 minutes';
  select attempts into attempt_count from public.admin_login_attempts a where a.email = normalized_email;
  if coalesce(attempt_count, 0) >= 10 then return; end if;

  return query select u.email, u.name from public.admin_users u
    where lower(u.email) = normalized_email and u.is_active = true
      and u.password_hash = extensions.crypt(admin_password, u.password_hash)
    limit 1;
  if found then
    delete from public.admin_login_attempts a where a.email = normalized_email;
  else
    insert into public.admin_login_attempts as a (email, attempts) values (normalized_email, 1)
      on conflict on constraint admin_login_attempts_pkey do update set attempts = a.attempts + 1;
  end if;
end;
$$;

revoke all on function public.verify_admin_login(text, text) from public;
revoke all on function public.verify_admin_login(text, text) from anon;
revoke all on function public.verify_admin_login(text, text) from authenticated;
grant execute on function public.verify_admin_login(text, text) to service_role;

-- The Next.js API calls this function with SUPABASE_SERVICE_ROLE_KEY.
