# NEBULINT backend and publishing guide

The existing Next.js / Vercel and Supabase architecture is retained. All database and storage writes go through authenticated server routes. `SUPABASE_SERVICE_ROLE_KEY` must stay server-side.

## Setup or upgrade

1. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` for local development and in the Vercel project for production. See `.env.example`.
2. For a new database, run `supabase/schema.sql` in the Supabase SQL editor.
3. Run (or re-run) `supabase/admin-auth.sql`. This grants the server role permission to verify logins and adds a database-backed limit of 10 failed attempts per email in a 15-minute window. Existing admin users are retained.
4. Run `supabase/campaigns-verification.sql` for both new and existing installations. It adds the campaign and verification tables and the public `site-media` image bucket. It does not create any sample people or campaigns.
5. If no admin exists, run `npm run admin:credentials -- admin@example.com "Your-Strong-Password" "Admin Name"` and execute the generated SQL privately. The password must be at least 12 characters. This command prints SQL containing the password: do not commit or share its output.
6. Run `npm ci`, `npm run build`, then `npm start`; use `npm run dev` while editing.
7. Deploy the updated branch through the existing Vercel project after the database migration is applied.

There is no demo login or local persistence fallback. Without Supabase configuration, public static pages remain available, verification and form submission return an availability message, and admin writes cannot succeed.

## Admin workflows

Open `/admin` and sign in. Sessions expire after 12 hours and use HttpOnly, SameSite cookies (Secure in production).

- **Client Inquiries / Career Forms:** review submissions, change review status or delete records.
- **Open Roles:** add, edit, publish/hide or delete roles shown on `/careers`.
- **Our Work:** add/edit case studies and upload or replace their images. Published images now render on the homepage. Hiding all case studies leaves the section empty; sample fallback content is only used when the backend is unavailable.
- **Campaigns:** add a title, summary, full details, category, image, optional dates, optional action button and display order. New campaigns start as drafts. Check **Publish campaign** to publish. Start/end dates use UTC days and the end date is inclusive. Only published campaigns inside their date window appear on `/`, `/campaigns` and `/campaigns/[id]`. The homepage shows the first three by display order; all current campaigns remain accessible on the listing. Hidden, future, expired and deleted detail URLs return 404.
- **Verification:** create a unique certificate/employee/association ID (6–80 uppercase letters, numbers or hyphens), name, association type, role, department, dates, status and approved public details. New records start private. Enable **Allow public verification** only after approving these details for disclosure. `/verify` requires the exact ID, ignoring letter case; there is no public people directory. Record status is explicit and is not inferred from dates. Revoke a public record to show it as no longer valid, or hide it to remove public lookup entirely. Email, phone, addresses and identity documents are not collected by this module.
- **Site Settings:** company information and configured social links update the homepage footer; hero settings update the homepage heading, description and primary button. Other public pages retain their existing page-specific copy. Blank values use the existing defaults. Settings updates use `setting_key` as the upsert conflict target.

## Images and storage

Uploads support JPG, PNG and WebP up to 3 MB. Both MIME type and file signatures are checked. Files receive random names. Admins can also supply an HTTP(S) image URL, replace an image or remove its reference from a record. Broken images show a branded placeholder.

`site-media` is a public bucket: anyone with an image URL can view it, including an image belonging to a draft. Only approved promotional images belong here. No browser write policy is installed. Removing a record or its image reference does not delete the stored object, because another record may use it. Unused files can be removed through Supabase Storage after checking references.

## Validation

- `npm run lint`
- `npm run build`
- `npm run test:integration` (requires a production build)
- `npm audit`

Integration tests start the real production Next.js server against an isolated in-memory Supabase HTTP double. They exercise auth, session expiry, campaign visibility and CRUD, public verification and revocation, upload validation, homepage image rendering, settings upsert, and public form validation. No production database, credentials or uploads are used. These checks do not execute PostgreSQL migrations or establish production database connectivity; run the SQL in Supabase and smoke-test the configured deployment before release.

## Review findings fixed

- Case-study images were saved but never rendered publicly.
- Hiding/deleting all work items incorrectly restored sample work on the homepage.
- Saved site settings were not connected to the homepage, and settings upsert lacked the unique-key conflict target.
- Admin auth could throw before a route handled errors, and malformed cookies could crash requests.
- Admin login RPC lacked an explicit service-role execute grant and had no failed-attempt limit.
- Content updates and public forms accepted invalid values and exposed raw backend errors.
- Passwords were trimmed during login, preventing passwords with intentional surrounding spaces from matching.
- Running base schema seeds repeatedly could create duplicate sample roles and case studies; seeding now skips existing titles.
- The original dependency lock contained security advisories; see the final dependency audit for the installed state.
