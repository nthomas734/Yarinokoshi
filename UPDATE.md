# Updating to pail (v3)

This is a rebranding of the existing yarinokoshi app. New name, new logo, new wordmark — but the data and Supabase setup are unchanged.

You can either:
1. **Replace the existing GitHub repo** (faster — keeps the same Vercel project and URL)
2. **Create a new GitHub repo** (cleaner — but you'll get a new URL and need to add the env vars again)

I'd recommend option 1 unless you want a clean break.

## Option 1: Replace files in existing repo (recommended)

1. Download this zip and unzip it
2. In your existing yarinokoshi GitHub repo, delete the following files first (so the new ones land cleanly):
   - `public/icon-192.png`
   - `public/icon-512.png`
   - (don't delete anything else — overwrites are fine)
3. Click **Add file** → **Upload files**
4. Drag every file from the unzipped `pail/` folder into GitHub
5. GitHub will warn about overwrites — accept all
6. Commit changes

Vercel will auto-deploy in ~2 minutes. **You don't need to touch Supabase or env vars** — the database is the same.

After it deploys:
- Open `yarinokoshi.vercel.app` (your existing URL still works)
- The new logo, name, and tagline will appear
- Your existing items are preserved

## Optional: rename the Vercel project / URL

If you want the URL to actually say `pail.vercel.app`:

1. In Vercel → your project → Settings → General → scroll to "Project Name"
2. Change it from `yarinokoshi` to `pail`
3. Save
4. Settings → Domains → claim `pail.vercel.app` if available (it might be taken)
5. The old `yarinokoshi.vercel.app` will still work as an alias

This is purely cosmetic. The app works fine on either URL.

## Optional: rename the GitHub repo

1. GitHub repo → Settings → scroll down → Rename repository to `pail`
2. Vercel will detect the new repo name automatically and reconnect

## Rehome the icon on your phone

Since the icon image changed:
1. On your phone, delete the existing yarinokoshi home screen icon (long-press → Remove App)
2. Open Safari, go to your URL
3. Share → Add to Home Screen
4. The new pail logo (Chicago skyline with handle) will appear on your home screen

## What changed

- **Name:** yarinokoshi → pail
- **Logo:** Hand-drawn brass-line Chicago skyline with bucket handle arching above (sister to daizu's bean mark)
- **Wordmark:** "やり残し / yarinokoshi" → "pail" in Fraunces serif
- **Tagline:** "things left to do" → "chicago, before we go"
- **Empty states:** removed Japanese kanji (空, 始, 記), replaced with brass-line pail illustrations
- **Copy:** "add to the bucket" → "add to the pail", "the bucket is empty" → "the pail is empty", etc.
- **localStorage key:** `yarinokoshi_user` → `pail_user` (if you set one of these for attribution, you'll need to set it again — see SETUP.md)
- **Removed:** Noto Serif JP font dependency

## What didn't change

- Supabase schema, env vars, storage bucket
- Categories, statuses, time windows
- All your existing items and memories
- Filter behavior, timeline behavior, add-another flow
- Aubergine/brass palette
- Bottom tab bar + swipe navigation
- Subtle countdown to San Diego

## What's not in this update (could come later)

- A real domain (`pail.app` etc.)
- Splash screen with logo animation on PWA launch
- Logo flip-in animation on first load (similar to daizu's Japanese-to-English flip)
- Attribution display in UI
