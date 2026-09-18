# Shallot

A mobile-first Thai restaurant starter built with Next.js App Router, React, TypeScript, and Supabase, ready to import into Vercel. The design pairs expressive serif typography with purple, papaya, lilac, and lime. Copy is grounded in the supplied story of Pim; no business facts have been invented.

This is a local starter, not a live restaurant website. It does not create accounts, publish a deployment, send email, process orders, or confirm catering bookings. The existing files in the parent Attachments project are untouched.

## Run locally

Use Node.js 22 or 24 LTS and pnpm 11.19.0. With Corepack available, run `corepack enable` followed by `corepack prepare pnpm@11.19.0 --activate`. Alternatively install that pnpm version with your existing package manager.

```sh
cd shallot
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

On PowerShell, replace `cp` with `Copy-Item .env.example .env.local`. Open the localhost URL printed by Next.js. No credentials are needed: the menu uses clearly labeled placeholders and the inquiry form is disabled. Fonts and hero artwork are served locally.

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm start
```

`pnpm-workspace.yaml` explicitly allows the build scripts for esbuild, unrs-resolver, and sharp. The lockfile records the resolved package versions. `pnpm test` checks validation, consent, honeypot handling, exact origin matching, and safe external links. Lint runs separately from the production build.

## Where to edit

| Content | File |
| --- | --- |
| Address, phone, hours, map and ordering links | `src/lib/restaurant.ts` |
| Story, owner section, gallery placeholders | `src/app/page.tsx` |
| Colors, typography, responsive layout | `src/app/globals.css` |
| SEO title, description, preview indexing | `src/app/layout.tsx` |
| Menu loading and graceful fallback | `src/lib/menu.ts` |
| Inquiry validation and API | `src/lib/inquiry.ts`, `src/app/api/inquiries/route.ts` |
| Database schema and access rules | `supabase/migrations/202609160001_initial.sql` |

Replace gallery and owner placeholders with approved restaurant photography, using Next.js `Image`, descriptive alt text, explicit dimensions, and appropriate `sizes`. The original generated hero is concept artwork, visibly labeled as such; it is not a photograph or a promise of a menu item. See `docs/ASSETS.md` and `docs/BRAND_STORY.md`.

The order button leads to ordering information until a real HTTPS link is configured. Directions are only linked after a confirmed HTTPS map URL is added. No fake phone numbers, prices, map destinations, hours, testimonials, or links are included. The three menu cards are editorial layout placeholders, not confirmed menu categories.

## Supabase setup

1. Create a project in the restaurant-owned Supabase account.
2. In SQL Editor, run `supabase/migrations/202609160001_initial.sql` once. Alternatively, initialize/link a Supabase CLI project and use `supabase db push`; do not reapply a migration already run manually. The migration creates the menu, private inquiries, and the rate-limited submission function. It deliberately seeds no fabricated menu items.
3. Copy the project URL and publishable key from project settings into `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in `.env.local`. These values are used by server components. A legacy anon key also works in the publishable-key variable.
4. In Supabase Table Editor, add real rows to `menu_items`: `name`, `description`, `category`, `price`, `currency`, `dietary_labels`, `sort_order`, and `published`. Verify the currency (schema default: USD) rather than assuming it matches the business. Null prices are visibly marked as missing. Only `published = true` rows appear. Lower sort order comes first; category order follows its first item. Page requests load the current menu, so edits appear on refresh.
5. Owners edit through Supabase Dashboard access. This starter deliberately has no public administration route. Normal visitor and authenticated API roles cannot modify the menu. Assign dashboard access only to trusted staff; if adding a web admin later, implement explicit owner authorization before granting write permissions.

### Enable contact and catering inquiries

Leave inquiries disabled until the schema, production origin, operational process, and spam protections are ready.

1. Put a Supabase secret key (or legacy service-role key) in `SUPABASE_SECRET_KEY`. **Never prefix it with `NEXT_PUBLIC_`, include it in browser code, or commit it.** It bypasses row-level security and stays in a module guarded by `server-only`.
2. Set `SITE_URL` to the exact public origin visitors use, e.g. your eventual HTTPS domain. Local testing uses `http://localhost:3000`. Only exact matching browser origins can submit. Vercel preview deployments need their own matching `SITE_URL` if you intentionally enable submissions there; otherwise keep preview submissions disabled.
3. Generate a long random `INQUIRY_RATE_LIMIT_SALT` (for example, with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`) and store it as a server environment variable.
4. Set `INQUIRIES_ENABLED=true` and restart/redeploy.
5. Submit a test inquiry and verify it in Supabase Table Editor → `inquiries`. Check invalid submissions and rate limiting, then delete test data. Staff review and update `status` there. No email notification is installed; establish a routine to check the inbox or add an approved notification provider separately.

The server validates input, requires consent, checks origin and JSON type, caps request bodies at 16 KiB, rejects honeypot content, and calls a service-only database function. A transaction lock enforces five accepted submissions per hashed IP per hour across Vercel instances. Raw IPs are not stored. On Vercel the code uses the platform-controlled `x-vercel-forwarded-for` header; on local/non-Vercel hosts all requests share a single local limit. Review trusted proxy handling before moving to another host. Same-origin checks and the honeypot are not complete bot protection: configure Vercel Firewall rate limiting/bot protection before enabling the public form, and add a CAPTCHA if abuse warrants it.

Inquiry rows have RLS enabled and no visitor policies; anon/authenticated roles have no inquiry table privileges or submission-function access. The secret key alone invokes the function. Restrict staff access and choose a retention period; periodically delete inquiries no longer needed. The form explains its use of contact details and asks visitors not to include sensitive information. Have the owner approve a privacy notice suitable for the business before launch.

## GitHub

Create an empty repository in the restaurant-owned GitHub account. From **inside the `shallot` folder**, initialize a separate repository, review the files, then push:

```sh
git init
git add .
git status
git commit -m "Build Shallot restaurant starter"
git branch -M main
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git push -u origin main
```

Replace the angle-bracket placeholder before running. `.gitignore` excludes `.env.local`, all other secret env files, dependencies, and build output; `.env.example` contains empty safe defaults. Do not include the unrelated parent site or `node_modules`. Review staged changes before committing. No repository or remote has been created by this starter.

## Vercel

1. Import that GitHub repository into the restaurant-owned Vercel account.
2. Select Next.js. If the repository is the `shallot` folder, use its root. If you intentionally committed a parent repository, set Root Directory to `shallot`.
3. Use Node.js 22 or 24 LTS, build command `pnpm build`, and Next.js's default output directory. Add the Vercel project environment variable `ENABLE_EXPERIMENTAL_COREPACK=1` so Corepack uses the pinned pnpm 11.19.0 in `packageManager`; do not rely on automatic lockfile detection for this newer pnpm version. Leave the install command on automatic detection with Corepack enabled, or use `corepack pnpm install --frozen-lockfile` as the explicit override. Confirm the pnpm version in the deployment log.
4. For a safe initial preview, leave all Supabase keys blank, use `PREVIEW_MODE=true`, and `INQUIRIES_ENABLED=false`. The app builds without database access.
5. For connected deployments, add the `.env.example` variables in Project Settings → Environment Variables. Choose Production/Preview scopes deliberately. Never use production inquiry credentials in untrusted preview builds. Add the matching `SITE_URL` for the production origin.
6. Deploy, check the site on mobile and desktop, and verify the real menu and form against the database. Configure the domain and DNS in Vercel. After changing domains, update `SITE_URL` and redeploy.
7. Once the owner approves all real details, photographs, menu/prices, ordering links, and privacy wording, set `PREVIEW_MODE=false` and redeploy to remove the preview banner and allow indexing. This flag does not automatically populate content or enable inquiries.

The app requires the Next.js server runtime: use Vercel's Next.js support, not a static export. Environment changes require a new deployment. GitHub pushes will trigger new deployments after the integration is connected.

## Launch review

- Confirm the spelling **Shallot**, all business details, currency, menu prices, dietary claims, photos, and copy with Pim.
- Replace every `to be added` / `coming soon` placeholder and check the order and map destinations.
- Test menu draft visibility and anonymous database permissions against the actual Supabase project.
- Test successful submission, validation, persistence, failure, and throttling against the actual connected database. Configure monitoring and staff inquiry review.
- Review at narrow phone widths, keyboard-only navigation, 200% text zoom, and reduced motion. Check actual image loading and domain redirects.
- Keep `PREVIEW_MODE=true` until approval. No fabricated LocalBusiness structured data is emitted; add it only with verified address and hours.

## References

- [Next.js installation and supported runtime](https://nextjs.org/docs/app/getting-started/installation)
- [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Vercel package managers](https://vercel.com/docs/package-managers)
- [Vercel request headers](https://vercel.com/docs/headers/request-headers)
