# Updating to pail v4.1

Patch release. Three fixes:
1. **New app icon** — Pail-Die Hybrid (the same icon used for the Roll tab, now the brand mark too). The previous skyline-with-handle was reading as the Sleeping Beauty Castle.
2. **Months are back** — alongside season tags and date ranges. Pick the precision you want for each item.
3. **Timeline year header bands** — `── 2026 ──` and `── 2027 ──` divider rows so "MAY 26" no longer reads as "May 26th."

Also fixes the bug where v4 placed seasonal items in incorrect months (Indiana Dunes appearing in May instead of August, etc.) — caused by the v4 migration auto-converting old time_window strings into season tags.

## Step 1 — Run the migration

1. Open Supabase → **SQL Editor** → **New query**
2. Open `MIGRATION.sql` from this zip → copy contents → paste → **Run**

This:
- Adds the new `months` text array column
- Moves the 5 seed items that were tagged "summer" but were originally "aug only" (Wisconsin State Fair, Air & Water Show, Mackinac Island, Indiana Dunes, Camping Trip) into `months = ['aug']` instead, with seasons cleared
- Lincoln Park Beavers stays as `summer` (it really is anytime in summer)
- Idempotent — safe to run multiple times

After running, those items will correctly appear in AUG 2026 and AUG 2027 in the Timeline view.

## Step 2 — Replace files in GitHub

1. Download this zip and unzip it
2. **Important**: in your GitHub repo, delete these old icon files first so the new ones land cleanly:
   - `public/icon.svg`
   - `public/icon-192.png`
   - `public/icon-512.png`
   - `public/apple-touch-icon.png`
3. Click **Add file** → **Upload files**
4. Drag every file from the unzipped folder into GitHub
5. Accept overwrites
6. Commit

Vercel deploys in ~2 min.

## Step 3 — Update home screen icon (iPhone)

Since the app icon image changed, you'll want to refresh the icon on your home screen:

1. Long-press the existing pail icon on your home screen → Remove App → Delete from Home Screen
2. Open Safari, go to your URL
3. Hard-refresh (close tab + reopen)
4. Share → Add to Home Screen
5. The new Pail-Die icon will install

## What's new in v4.1

### App icon swap
The brand mark is now the Pail-Die Hybrid: a die wearing a bucket handle. Same mark as the Roll tab — unifies the app's identity around its most fun feature. The previous skyline icon was inadvertently reading as the Disneyland castle silhouette.

### Specific months as a third time-window option
When you add or edit an item, you now have three combinable time-window options:
- **Season tags** (spring/summer/fall/winter) — multi-select
- **+ specific month(s)** (jan-dec) — multi-select grid hidden behind a +/- toggle
- **+ specific date / range** — for events with known dates (festivals, weddings, touring shows)

You don't need to pick one — they stack. An item can be tagged `summer` AND `aug only` if you want both signals.

### Precision determines timeline behavior
Items now appear in the Timeline based on their most precise tag:
- **Date range** → shows in every month the range covers
- **Specific month(s)** → shows in every matching month (Wisconsin State Fair appears in BOTH AUG 2026 and AUG 2027)
- **Seasons only** → shows in only the next upcoming matching month, then rolls forward
- **Nothing** → shows in the "anytime · no window" section at the bottom

This is what the Timeline was supposed to do all along — month-tagged items show in their actual month each year.

### Timeline year bands
Big `── 2026 ──` and `── 2027 ──` divider rows separate the years. Each month within a year shows just `MAY`, `JUN`, etc. — no more "MAY 26" looking like a date.

## What hasn't changed

- Env vars
- Storage bucket
- Roll tab, edit mode, category color dots, all v4 features
- All your existing items and memories
- Palette, fonts, layout

## Notes on the data fix

The migration's UPDATE statement is conditional — it only changes items that match all three criteria:
- Title in the specific list (Wisconsin State Fair, etc.)
- Have no months set yet
- Have 'summer' in their seasons

This means if you've already manually edited any of those items to have months set, the migration leaves them alone. Safe.
