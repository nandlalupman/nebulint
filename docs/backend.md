# NEBULINT Backend Structure

## Recommended Production Stack

- Frontend and API routes: Next.js on Vercel.
- Database: Supabase Postgres.
- Form intake: `POST /api/inquiries`, inserting into `public.project_inquiries`.
- Career intake: `POST /api/careers`, inserting into `public.career_applications`.
- Admin console: `/admin`, protected by `ADMIN_TOKEN`.
- Editable content: `public.open_roles` and `public.case_studies`, managed from `/admin`.
- File uploads later: Supabase Storage for technical briefs, diagrams, datasets, and NDA packets.
- Email notifications later: Resend or Postmark from the API route after a successful insert.
- Auth upgrade later: Supabase Auth with organization roles, replacing the simple deployment token.
- Observability: Vercel Analytics plus Sentry for route errors and client exceptions.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Add these environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_TOKEN`
4. Deploy to Vercel.

The service role key stays server-side only. Do not expose it in client components.

## Admin Usage

Open `/admin`, enter the value of `ADMIN_TOKEN`, then manage:

- Client project inquiries and their review status.
- Career applications and their review status.
- Open roles shown on the careers page.
- Case studies shown on the home page.

Public pages use professional fallback content if Supabase is not configured yet.
