# P-O Select Elementary Basketball League

Single Next.js 16 application (App Router, TypeScript, Tailwind CSS 4, MongoDB Atlas + Mongoose) for the public league site and admin CMS.

## Quick start

```bash
cd "e:\2sri nokri\tj5"
copy .env.example .env
# Set MONGODB_URI, AUTH_SECRET (32+ random chars), NEXT_PUBLIC_APP_URL

npm install
npm run seed
npm run create-admin
npm run dev
```

- Public site: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  

Without `MONGODB_URI`, **development preview mode** serves read-only seeded copy on the homepage; forms and admin saves return unavailable states.

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run test` | Vitest (fees, standings) |
| `npm run seed` | Idempotent seed (schools, forms, 2026-27 league days) |
| `npm run create-admin` | Create owner account (`ADMIN_EMAIL` / `ADMIN_PASSWORD` or prompts) |

## Environment

See `.env.example`. Optional: Cloudinary (admin uploads), SMTP (contact/registration notifications).

## Deployment

One Vercel project pointing at this folder. Set the same env vars. Use MongoDB Atlas network access for Vercel IPs.

## Content & assets

See `docs/ASSET_MANIFEST.md` for Drive → CMS field mapping. Season poster is committed at `public/brand/season-poster-2026-27.jpg`.

## Admin modules

Dashboard, League & Brand settings, Forms & Documents, Schools, Registrations, Contact inbox, Resources API, Cloudinary signed uploads (when configured).

Extended modules (gallery, games editor, playoffs bracket UI, full page builder) use the same MongoDB models — expand admin routes as needed.
