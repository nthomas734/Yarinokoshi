# pail — Setup Guide (fresh deploy)

> If you're upgrading an existing pail/yarinokoshi, see [UPDATE.md](./UPDATE.md) instead.

About 15 minutes end-to-end.

## What you'll do

1. Create a new GitHub repo and upload these files
2. Create a new Supabase project and run `MIGRATION.sql`
3. Deploy to Vercel and add 2 environment variables
4. Install on phones as a PWA

---

## Step 1 — GitHub

1. Go to https://github.com/new
2. Repo name: `pail`
3. Make it Private
4. Click **Create repository**
5. On the empty repo page, click **uploading an existing file**
6. Drag every file from this zip into GitHub. Drag the **contents** of the unzipped folder, not the outer folder itself. You should see `package.json`, `next.config.js`, `src/`, `public/` etc. at the repo root.
7. Scroll down → **Commit changes**

---

## Step 2 — Supabase

1. Go to https://supabase.com/dashboard and click **New project**
2. Name it `pail`
3. Pick a strong database password
4. Region: closest to you
5. Click **Create new project** and wait ~2 minutes

### Run the schema + seed

1. Click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open `MIGRATION.sql` from this zip, copy the entire contents
4. Paste into the SQL Editor
5. Click **Run**

For a fresh project this will:
- Create the new schema columns (seasons, date_start, date_end)
- Seed the bucket list with all the Chicago items from my screenshots

You should see "Success. No rows returned."

### Set up photo storage

1. Click **Storage** in the left sidebar
2. Click **New bucket**
3. Name: `memories`
4. Toggle **Public bucket** ON
5. Click **Create bucket**

Then add an INSERT policy:
1. Click into the `memories` bucket → **Policies** tab
2. **New policy** → **For full customization**
3. Name: `anon can upload`
4. Allowed operation: **INSERT**
5. Target roles: leave as `public`
6. WITH CHECK expression: `true`
7. **Review** → **Save policy**

### Get your keys

1. Click **Project Settings** (gear icon)
2. Click **API Keys** in the sub-menu
3. Copy:
   - **Project URL** — bare URL like `https://abc123.supabase.co` (NOT the REST endpoint with `/rest/v1/`)
   - **anon public** key — long string starting with `eyJ`

---

## Step 3 — Vercel

1. Go to https://vercel.com/new
2. Import your `pail` GitHub repo
3. **Critical:** make sure Framework Preset = **Next.js** before deploying
4. Expand **Environment Variables**:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | (Project URL — bare, no `/rest/v1/`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (anon public key) |

5. Click **Deploy**
6. Wait ~2 minutes

---

## Step 4 — Install as PWA on phones

### iPhone
1. Open the Vercel URL in **Safari**
2. **If you see 404:** turn off iCloud Private Relay (Settings → [your name] → iCloud → Private Relay → off)
3. Tap share → **Add to Home Screen** → **Add**

### Android
1. Open in Chrome → menu → **Add to Home screen**

---

## Optional — Tag who's adding what

Open the browser console once on a phone and run:

```javascript
localStorage.setItem('pail_user', 'nathan')
```

Or for your wife's phone:
```javascript
localStorage.setItem('pail_user', 'her_name')
```

Attribution is stored but not shown in the UI by default.

---

## Common gotchas

- **404 NOT_FOUND on Vercel:** Framework Preset wasn't set to Next.js. Fix in Settings → General, then redeploy.
- **"INVALID PATH SPECIFIED":** You pasted the REST endpoint URL into `NEXT_PUBLIC_SUPABASE_URL`. Use the bare URL.
- **Page 404s on iPhone but works on desktop:** iCloud Private Relay. Toggle it off.
- **Photos won't upload:** Check the `memories` bucket exists, is public, has the INSERT policy.
- **Seed didn't run:** The seed only runs if items table is empty. To force a re-seed, manually delete all rows in items first, then re-run MIGRATION.sql.
