# Updating to pail v4

This is a feature release. New: edit existing items, multi-season tags + date ranges, category color dots, randomize tab, and Wisconsin State Fair fixes for "Blackhawks" misspelling (you can fix that yourself in edit mode).

## Step 1 — Run the migration in Supabase

1. Open your Supabase project → **SQL Editor** → **New query**
2. Open the `MIGRATION.sql` file from this zip
3. Copy the entire contents and paste into the SQL Editor
4. Click **Run**

The migration:
- Adds new columns: `seasons` (text array), `date_start`, `date_end`
- Migrates any existing single time_window value into the seasons array
- Cleans up any old status names (`dreaming` → `someday`, etc.)
- Cleans up any old "fair" category → "road"
- **Conditionally seeds** the bucket list from your screenshots — but ONLY if the `items` table is currently empty. If you have any items in the table, the seed does nothing. Safe to run.

You should see "Success. No rows returned." (the DO block doesn't return rows even when it inserts).

## Step 2 — Replace files in GitHub

1. Download this zip and unzip it
2. In your GitHub repo, click **Add file** → **Upload files**
3. Drag every file from the unzipped `pail/` folder into GitHub
4. GitHub will ask about overwrites — accept all
5. Commit changes

Vercel auto-deploys in ~2 minutes.

## What's new

### Edit existing items
Tap any item → tap the **edit** button in the top-right of the detail modal. Now you can change the title, category, season tags, date range, and notes. (Status changes still work in read mode without entering edit mode.)

### Multi-season tags
When adding/editing an item, you can now select multiple seasons (e.g., "summer + fall" for something that works either time). Pure visibility tool for the Board view filter.

### Optional specific date range
Below the season tags is a **+ specific date / range** button. Tap it to add a precise date or date range — useful for festivals, friend's weddings, touring shows, etc. When set, the item shows in every month its date range covers in the Timeline view.

### 8 distinct category colors
Each category now has a small colored dot before the title:
- 🟢 sage — Neighborhoods
- 🟪 mauve — Museums
- 🟠 terracotta — Sports
- 🔵 dusty blue — Road Trips
- 🟡 ochre — Seasonal
- 🔴 muted red — Food & Drink
- 🟣 violet — Shows
- 🟤 brass — Just Because

Dots also appear in the category filter pills, the Roll multi-select, and the timeline rows.

### Roll tab (NEW — 2nd tab)
A whole new tab for picking what to do when you can't decide. The tab bar is now: **Board · Roll · Timeline · Memories**.

The Roll tab:
- Pre-populates category checkboxes from your current Board filter
- Shows count of eligible items in the pool
- "Roll the pail" runs a slot-machine animation cycling through random titles
- Lands on a final pick with a flap-board reveal
- Three buttons after reveal: **Re-roll**, **Mark Soon**, **View Item**
- Excludes items already marked "done"

### Header padding
Added more breathing room above the "Chicago, before we go" tagline.

## What hasn't changed

- Env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Storage bucket name (`memories`)
- PWA manifest, icon, palette, fonts
- All your existing items and memories

## Notes

- The old single `time_window` column is still in the schema but no longer used by the UI — kept for backward compatibility. The migration writes the new `seasons` array based on it for existing rows.
- Items where seasons is `[]` AND date_start is null show as "any time" in the Board view, and appear in the "anytime · no window" section at the bottom of the Timeline view.
- Date ranges are inclusive on both ends. A single-date item is just date_start with date_end equal to it.
- "Mark Soon" from the Roll tab updates the item's status without opening the detail modal — fast path for "okay, let's actually do this one this week."

## What's next (ideas for v5)

- Edit on the item detail modal could include status change (currently those are separate)
- "Unmark" a done item (rare but might come up)
- Save Roll history ("things we rolled but didn't pick")
- Streak counter on the Roll tab
- Real attribution display ("added by you · marked done by [her]")
- A "wedding" or "trip" style template that adds multiple items at once
