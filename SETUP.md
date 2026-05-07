# pail — Setup Guide

> If you're upgrading from yarinokoshi, see [UPDATE.md](./UPDATE.md) instead — much shorter.

About 15 minutes end-to-end for a fresh deploy.

## What you'll do

1. Create a new GitHub repo and upload these files
2. Create a new Supabase project and run one SQL script
3. Deploy to Vercel and add 2 environment variables
4. Install on phones as a PWA

---

## Step 1 — GitHub

1. Go to https://github.com/new
2. Repo name: `pail` (or whatever you want)
3. Make it Private
4. Click **Create repository**
5. On the empty repo page, click **uploading an existing file**
6. Drag every file from this zip into GitHub. **Important:** drag the contents, not the outer `pail` folder itself. You should see `package.json`, `next.config.js`, `src/`, `public/` etc. at the repo root.
7. Scroll down → **Commit changes**

---

## Step 2 — Supabase

1. Go to https://supabase.com/dashboard and click **New project**
2. Name it `pail`
3. Pick a strong database password and save it
4. Region: closest to you
5. Click **Create new project** and wait ~2 minutes

### Run the schema

1. Once the project is ready, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste the entire block below and click **Run**:

```sql
-- pail schema
create extension if not exists "uuid-ossp";

create table if not exists items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null,
  time_window text not null default 'any',
  status text not null default 'someday',
  notes text,
  added_by text,
  completed_by text,
  completed_at timestamptz,
  memory_photo text,
  memory_note text,
  created_at timestamptz not null default now()
);

alter table items enable row level security;

create policy "anon can read" on items for select using (true);
create policy "anon can insert" on items for insert with check (true);
create policy "anon can update" on items for update using (true);
create policy "anon can delete" on items for delete using (true);
```

You should see **Success. No rows returned.**

### Set up photo storage

1. Click **Storage** in the left sidebar
2. Click **New bucket**
3. Name: `memories`
4. Toggle **Public bucket** to ON
5. Click **Create bucket**

Then add an upload policy:

1. Click into the `memories` bucket
2. Click **Policies** tab at the top
3. Click **New policy** → **For full customization**
4. Policy name: `anon can upload`
5. Allowed operation: check **INSERT**
6. Target roles: leave as `public`
7. WITH CHECK expression: `true`
8. Click **Review** → **Save policy**

### Get your keys

1. Click **Project Settings** (gear icon, bottom left)
2. Click **API Keys** in the left sub-menu
3. Copy:
   - **Project URL** — should look like `https://abc123xyz.supabase.co` (NOT the REST endpoint with `/rest/v1/` — just the bare URL with no path)
   - **anon public** key — a long string starting with `eyJ`

---

## Step 3 — Vercel

1. Go to https://vercel.com/new
2. Import your `pail` GitHub repo
3. **Critical:** make sure Framework Preset shows **Next.js** before deploying
4. Expand **Environment Variables** and add:

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | (paste Project URL — bare URL, no `/rest/v1/`) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (paste anon public key) |

5. Click **Deploy**
6. Wait ~2 minutes

---

## Step 4 — Install as PWA on phones

### iPhone
1. Open the Vercel URL in **Safari** (not Chrome — only Safari can install PWAs on iOS)
2. **Important on iPhone:** if the page 404s, turn off iCloud Private Relay temporarily (Settings → [your name] → iCloud → Private Relay → off)
3. Tap the share icon
4. Scroll down → **Add to Home Screen**
5. Tap **Add**

### Android
1. Open the URL in Chrome
2. Tap the menu (⋮) → **Add to Home screen** or **Install app**

---

## Optional — Tag who's adding what

The app silently tracks who added/completed each item. To turn this on for a specific phone, open the browser console once on that phone and run:

```javascript
localStorage.setItem('pail_user', 'nathan')
```

Or for your wife's phone:
```javascript
localStorage.setItem('pail_user', 'her_name')
```

This is optional. Attribution is stored but not shown in the UI by default.

---

## Common gotchas

- **404 NOT_FOUND on Vercel after deploy:** Framework Preset wasn't set to Next.js. Fix it in Settings → General → Build & Development Settings, then redeploy.
- **"INVALID PATH SPECIFIED IN REQUEST URL" when adding items:** You pasted the REST endpoint (`https://....supabase.co/rest/v1/`) into `NEXT_PUBLIC_SUPABASE_URL` instead of the bare Project URL. Fix it and redeploy.
- **Page 404s on iPhone but works on desktop:** iCloud Private Relay. Toggle it off.
- **Photos won't upload:** Check that the `memories` bucket exists, is public, and has the INSERT policy described above.

---

## Tech notes

- All status values are stored as plain text strings: `someday`, `planned`, `soon`, `done`
- All categories are stored as plain text: `neighborhood`, `museum`, `sport`, `road`, `seasonal`, `food`, `show`, `just`
- Time windows: `any`, `spring`, `summer`, `fall`, `winter`, or 3-letter month codes (`jan`, `feb`, ...)
- Memory photos are stored in the `memories` Supabase Storage bucket as `{item-id}-{timestamp}.{ext}`
