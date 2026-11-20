# Life Timeline

A personal timeline of your life, from your birth year at the bottom to the current year at the top.
Each memory is a dot: milestones, highs, lows and everyday moments, with optional Google Photos links.
A new year appears automatically on Jan 1 (in your `TIMEZONE`).

Everything runs on free tiers: **Next.js on Vercel (Hobby)**, **Neon Postgres (Free)**, **Google sign-in via Auth.js**.

## Pages

| URL | What it shows |
|---|---|
| `/` | Whole life: one row per year, newest on top, dots placed by date |
| `/year/2018` | One year: months, newest first, with each memory listed |
| `/event/12` | One memory: text, mood, tags, photo links (open in a new tab) |
| `/new`, `/event/12/edit` | Add / edit (owner only) |

Dates can be fuzzy: leave **Month** or **Day** as "not sure" and the memory is stored as
"Sometime in 2009" or "June 2012" and drawn as a hollow ring.

## One-time setup

### 1. Neon database
1. Create a free project at https://neon.tech.
2. Copy the **pooled connection string**.

### 2. Google sign-in
1. Go to https://console.cloud.google.com → create a project.
2. **APIs & Services → OAuth consent screen**: External, add your own Gmail as a test user.
3. **Credentials → Create credentials → OAuth client ID → Web application**, with these redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<your-app>.vercel.app/api/auth/callback/google` (add after the first deploy)
4. Copy the Client ID and Client secret.

### 3. Local env
```powershell
Copy-Item .env.example .env.local
npx auth secret        # writes AUTH_SECRET into .env.local
```
Fill in the rest of `.env.local` (database URL, birth date, your Gmail as `OWNER_EMAIL`, Google ID/secret).

### 4. Create tables and run
```powershell
npm run db:migrate
npm run dev
```
Open http://localhost:3000, sign in, and click **+ Add memory**.

### 5. Deploy to Vercel
1. Push this folder to a GitHub repo, then import it at https://vercel.com/new.
2. Add every variable from `.env.local` under **Settings → Environment Variables**.
3. Deploy, then add the Vercel URL's callback to Google (step 2.3).

## Privacy

- Only the Google account in `OWNER_EMAIL` can sign in or edit.
- `PUBLIC_VIEW="false"` (default) means only you can read the timeline. Set it to `"true"` to let anyone with the link read it.
- Search engines are asked not to index the site.
- For photos, use Google Photos **share links** (Share → Create link). They open in any browser
  regardless of which Google account is signed in, but anyone who has the link can see those photos.

## Backups

Neon's free tier keeps only a short restore history. Export from time to time from the Neon console
(SQL Editor → `SELECT * FROM events;` → download), or with `pg_dump` and your connection string.
