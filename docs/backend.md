# NEBULINT Backend Structure

## Recommended Production Stack

- Frontend and API routes: Next.js on Vercel.
- Database: Supabase Postgres.
- Form intake: `POST /api/inquiries`, inserting into `public.project_inquiries`.
- Career intake: `POST /api/careers`, inserting into `public.career_applications`.
- Admin console: `/admin`, protected by Supabase-backed admin credentials and a signed session cookie.
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
   - `ADMIN_SESSION_SECRET`
4. Deploy to Vercel.

The service role key stays server-side only. Do not expose it in client components.

## Admin Usage

## Local Demo Admin

For local testing before Supabase is configured, `.env.local` can include:

```env
DEV_ADMIN_EMAIL=admin@nebulint.local
DEV_ADMIN_PASSWORD=NebulintAdmin123!
ADMIN_SESSION_SECRET=local-demo-session-secret
```

When `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are absent and `NODE_ENV` is not `production`, `/admin` accepts those demo credentials and returns sample inquiries, applications, roles, and work items. This demo path is disabled in production.

First create the admin credential table and login function:

1. Run `supabase/admin-auth.sql` in the Supabase SQL editor.
2. Generate credential SQL locally:

```bash
npm run admin:credentials -- admin@nebulint.com "Use-A-Strong-Password" "NEBULINT Admin"
```

3. Copy the generated SQL into the Supabase SQL editor and run it.

Then open `/admin`, sign in with the email and password, and manage:

- Client project inquiries and their review status.
- Career applications and their review status.
- Open roles shown on the careers page.
- Case studies shown on the home page.

Public pages use professional fallback content if Supabase is not configured yet.

`ADMIN_TOKEN` is still supported as an emergency legacy header token, but normal admin usage should use Supabase credentials.
