# NEBULINT Backend Structure

## Recommended Production Stack

- Frontend and API routes: Next.js on Vercel.
- Database: Supabase Postgres.
- Form intake: `POST /api/inquiries`, inserting into `public.project_inquiries`.
- File uploads later: Supabase Storage for technical briefs, diagrams, datasets, and NDA packets.
- Email notifications later: Resend or Postmark from the API route after a successful insert.
- Auth/admin later: Supabase Auth for an internal inquiry review dashboard.
- Observability: Vercel Analytics plus Sentry for route errors and client exceptions.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Add these environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy to Vercel.

The service role key stays server-side only. Do not expose it in client components.
