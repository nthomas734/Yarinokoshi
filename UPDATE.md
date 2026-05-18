# Updating to pail v5 — visual refresh

A pure visual refresh. No database migration. No feature changes. Just palette + logo.

## What changed

- **Palette:** aubergine + brass → **muted Cubs blue + cream-gold**
  - Background: `#1A2D52` (was `#2A1F2E`)
  - Primary accent: `#D6B97D` (was `#C8A97E`)
  - Surface/cards: `#0E1F3D` (was `#1A1A1A`)
- **App icon:** Pail-Die Hybrid → **Checklist** (three rows, first with a check, others with bullets)
- **In-header logo:** Pail-Die → Checklist (same mark as the app icon)
- **Roll tab icon:** Simplified from Pail-Die to a plain die (the bucket-handle was orphaned without the brand tying it back)
- **Category color dots:** Re-tuned to harmonize with the blue background
  - Museums: dusty mauve → warmer rose-mauve
  - Sports: muted terracotta → brighter terracotta
  - Road trips: dusty blue → teal-aqua (separates from the new bg)
  - Food: muted red → coral-red
  - Shows: violet → softer lavender
  - Just because: brass → cream-gold (matches new accent)

## Why

The aubergine + brass was giving "Crown Royal velvet bag" energy. The muted Cubs blue keeps it Chicago-themed without being on-the-nose, and the cream-gold accent stays in the same metallic-warm family as brass while being distinct enough to feel like its own thing.

Slate-and-blush is being saved for a future app.

## What didn't change

- All data, items, memories
- Supabase schema (no migration needed)
- Env vars
- Storage bucket
- Tab structure (Board / Roll / Timeline / Memories)
- Status flow (someday → planned → soon → done)
- Categories list, multi-season tags, months, date ranges
- Edit mode, Roll tab behavior, Timeline year bands
- Fonts, layout, animations, copy

## Deploy steps

### Step 1 — Delete old icon files in GitHub

Before uploading the new files, delete these in GitHub so the new ones land cleanly:
- `public/icon.svg`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/apple-touch-icon.png`

### Step 2 — Upload the new files

1. Download this zip and unzip it
2. In your GitHub repo, **Add file → Upload files**
3. Drag every file from the unzipped folder
4. Accept overwrites
5. Commit

Vercel auto-deploys in ~2 min.

### Step 3 — Refresh the home screen icon (iPhone)

1. Long-press the existing pail icon → Remove App → Delete from Home Screen
2. Open Safari, go to your URL, hard-refresh (close tab + reopen)
3. Share → Add to Home Screen
4. The new checklist icon will install

## Notes

- The token name `theme.brass` is preserved throughout the codebase but now points to `#D6B97D` (the new cream-gold). This kept the refactor surgical — no component-level changes were needed for the color swap, just an updated value in `theme.ts`.
- The new accent works well with the existing status sage-green for "done" — no need to retune statuses.
- "Roll the pail" copy in the Roll tab still works since the app is still named pail; the wordmark and tagline are unchanged.

## What's next

The next time we update pail, candidates queued up:
- Real attribution display ("added by you · done by [her]")
- Streak counter on Roll
- Saved Roll history
- A printable export when San Diego gets close

The next app (when you start one) gets the slate-and-blush palette I showed.
