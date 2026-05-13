create table if not exists public.project_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  project_type text not null,
  timeline text,
  environment text,
  brief text not null,
  source text default 'website',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists project_inquiries_created_at_idx
  on public.project_inquiries (created_at desc);

alter table public.project_inquiries enable row level security;

-- The website writes through a Vercel server route using SUPABASE_SERVICE_ROLE_KEY.
-- Keep direct browser inserts disabled unless you intentionally add a public policy.
