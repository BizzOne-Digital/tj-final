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

## Admin portal (`/admin`)

Sign in at `/admin/login`. Everything below updates the live site as soon as you press Save.

| Screen | What it edits |
| --- | --- |
| Page Content | Headings, text, links and pictures on every page (home, about, contact, information, sponsorship, gear store, Central PA Lions, gallery, standings/scores/playoffs/awards results, header and footer, ...). Anything left unchanged keeps its built-in text. |
| Schedules | League schedule posters (3/4 and 5/6) shown on Schedules and the Information Hub. |
| Schools & Coaches | Per school: name, program link, coaches, team photo, schedule posters. |
| News / FAQ / Leadership | Create, edit, hide and delete items (cover images and photos supported). |
| League & Brand | Contact details, fees, logos, announcement bar, season, streaming link. |
| Forms & Documents, Registrations, Contact Inbox | Existing league operations screens. |
| My Account | Change your own password. |

### Images (serverless-safe)

Uploads never touch the disk. `POST /api/upload` (admin only; jpeg/png/webp/gif, max 8MB, folders `products | gallery | pages | misc`) stores the file in MongoDB (`StoredUpload`) and returns `/api/uploads/<folder>/<filename>`, served with immutable caching by `GET /api/uploads/[folder]/[filename]`. Only the URL is saved on content. Replacing or removing an image deletes the old upload unless something else still uses it. Legacy `/uploads/...` URLs render a placeholder. Vercel limits request bodies to about 4.5MB, so the upload field shrinks larger photos in the browser before sending.

### Creating / resetting the admin login

```bash
# .env needs MONGODB_URI (and AUTH_SECRET) set first
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=a-strong-password npm run create-admin:reset
```

Then sign in and change the password under **My Account**. Sign-in is limited to 10 attempts per email per 15 minutes.

### Adding editable text to a page

Add the field to `src/lib/cms/registry.ts` (key, label, kind, default) and read it in the page with `const cms = await getCms(); cms.text("page.field")`. `npm test` fails if a page uses a key that is not registered.
