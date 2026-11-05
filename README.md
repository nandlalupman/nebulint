# NEBULINT

Next.js company website with a Supabase-backed admin panel, campaigns, internship/employment verification, careers and project inquiries.

## Start locally

```sh
npm ci
# Copy .env.example to .env.local and fill in your server-side Supabase values.
npm run dev
```

Apply the database setup/migrations and create an admin as described in [the backend guide](docs/backend.md).

Public pages: `/`, `/about`, `/services`, `/careers`, `/contact`, `/campaigns`, `/campaigns/[id]`, `/verify`. Administration: `/admin`.

```sh
npm run lint
npm run build
npm run test:integration
```

Production deployment continues to use the repository's existing Vercel setup. Database migrations must be applied before deployment.
