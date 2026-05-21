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

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role text not null,
  portfolio text,
  statement text not null,
  source text default 'careers_page',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.open_roles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text,
  department text,
  location text default 'Remote / Hybrid',
  type text default 'Engineering',
  sort_order integer default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,
  category text,
  image_url text,
  sort_order integer default 100,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text unique not null,
  setting_value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_sessions (
  token text primary key,
  email text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists project_inquiries_created_at_idx
  on public.project_inquiries (created_at desc);

create index if not exists career_applications_created_at_idx
  on public.career_applications (created_at desc);

create index if not exists open_roles_sort_order_idx
  on public.open_roles (sort_order asc);

create index if not exists case_studies_sort_order_idx
  on public.case_studies (sort_order asc);

create index if not exists admin_sessions_expires_at_idx
  on public.admin_sessions (expires_at asc);

alter table public.project_inquiries enable row level security;
alter table public.career_applications enable row level security;
alter table public.open_roles enable row level security;
alter table public.case_studies enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_sessions enable row level security;

-- The website writes through a Vercel server route using SUPABASE_SERVICE_ROLE_KEY.
-- Keep direct browser inserts disabled unless you intentionally add a public policy.

insert into public.open_roles (title, summary, department, location, type, sort_order)
values
  ('Computer Vision Engineer', 'Detection, tracking, segmentation, edge analytics, and industrial monitoring systems.', 'Applied AI', 'Remote / Hybrid', 'Engineering', 10),
  ('Robotics Systems Engineer', 'ROS-compatible control layers, telemetry loops, robotics dashboards, and autonomy interfaces.', 'Robotics', 'Remote / Hybrid', 'Engineering', 20),
  ('AI/ML Engineer', 'Model evaluation, inference services, data pipelines, and production ML infrastructure.', 'Machine Learning', 'Remote / Hybrid', 'Engineering', 30),
  ('Full Stack Platform Engineer', 'Operational dashboards, product workflows, admin systems, APIs, and real-time interfaces.', 'Platform', 'Remote / Hybrid', 'Engineering', 40),
  ('Research Engineer', 'Applied experimentation with measurable reliability, latency, and deployment outcomes.', 'R&D', 'Remote / Hybrid', 'Research', 50),
  ('Backend Systems Engineer', 'APIs, queues, databases, observability, deployment automation, and secure service boundaries.', 'Infrastructure', 'Remote / Hybrid', 'Engineering', 60)
on conflict do nothing;

insert into public.case_studies (title, summary, category, sort_order)
values
  ('Autonomous Monitoring Platform', 'Live infrastructure telemetry, model-backed anomaly detection, alerting, and operator dashboards.', 'Operations', 10),
  ('Industrial Vision Intelligence', 'Computer vision pipelines for detection, tracking, inspection, and real-time facility analytics.', 'Computer Vision', 20),
  ('Robotics Command Interface', 'ROS-compatible control surfaces, fleet telemetry, safety states, and hardware-system communication.', 'Robotics', 30),
  ('Predictive Infrastructure Engine', 'Forecasting, queue health, capacity signals, automated escalation, and reliability analytics.', 'Infrastructure', 40),
  ('Smart Factory Intelligence Platform', 'Machine-state monitoring, production insights, robotics coordination, and automation triggers.', 'Industrial AI', 50),
  ('Real-Time Analytics Network', 'Streaming data architecture, live dashboards, data quality checks, and distributed processing.', 'Data Systems', 60)
on conflict do nothing;
