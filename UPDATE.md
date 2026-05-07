# Updating to v2

This is a refinement, not a rebuild. Drop in the new files, run one tiny SQL migration, and you're done.

## Step 1 — Migrate existing items in Supabase

You probably have a few test items in your `items` table with the old status names (`dreaming`, `scheduled`, etc.). Those won't render correctly with the new code. One-time fix:

1. Go to your Supabase project → **SQL Editor** → **New query**
2. Paste and run:

```sql
-- Migrate old status names to new ones
update items set status = 'someday' where status = 'dreaming';
update items set status = 'planned' where status = 'scheduled';
update items set status = 'soon'    where status = 'boarding';
update items set status = 'done'    where status = 'departed';

-- Migrate old "fair" category (now folded into "road")
update items set category = 'road' where category = 'fair';

-- Update the default for new rows
alter table items alter column status set default 'someday';
```

You should see "Success" with a count of updated rows.

## Step 2 — Replace files in GitHub

This zip contains the same file structure as v1, with edits to:
- `src/lib/supabase.ts` — new status types, removed "fair" category
- `src/lib/theme.ts` — renamed status color tokens
- `src/components/BoardView.tsx` — added second filter strip (seasons), new statuses
- `src/components/TimelineView.tsx` — items now show in only the next upcoming month (no duplicates)
- `src/components/MemoriesView.tsx` — uses 'done' instead of 'departed'
- `src/components/ItemDetailModal.tsx` — new status names throughout
- `src/components/AddItemModal.tsx` — new "+ add another" button, bucket-themed wording
- `SETUP.md`, `README.md` — updated documentation

**Easiest approach:** in your GitHub repo, navigate into each changed file, click the pencil icon, replace its entire contents with the file from this zip, commit. Or:

**Even easier:** delete the entire `src/` folder in GitHub (open it, click the dropdown next to "Add file" → there's no folder delete — so do it via individual files). Actually, easiest is:

1. Download this zip, unzip it
2. In your GitHub repo, click **Add file** → **Upload files**
3. Drag every file from the unzipped `yarinokoshi/` folder in
4. GitHub will ask "you're overwriting these files, continue?" — yes
5. Commit changes

Vercel auto-deploys from `main` in ~2 min.

## What's new in v2

- **Status names:** dreaming → planned → soon → done (was: dreaming → scheduled → boarding → departed)
- **Filter strip 2:** filter the board by season (any time / spring / summer / fall / winter) on top of category
- **State Fairs category removed** — fold these into Road Trips or Seasonal
- **Timeline:** an item with a "JUL" window now shows only in the *next* upcoming July, not in every July through 2027. Once that month passes, it rolls forward.
- **+ Add another:** the add modal now has three buttons — Close, + Add Another (saves and clears form, keeps modal open), and + Add & Done. Category and time window are kept between adds since you're often adding similar items in a batch.
- **Bucket-themed wording** throughout: "add to the bucket", "the bucket is empty", etc.

## What hasn't changed

- Env vars (still `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Supabase schema columns (only the default value of `status` changed)
- Storage bucket name (`memories`)
- PWA manifest, icons, palette, fonts

You don't need to redeploy manually — Vercel will see the new commits to `main` and deploy automatically. Just hard-refresh the app on your phone after ~2 minutes.
