# Updating to pail v6 — header refresh

A small patch. No database migration, no schema change, no env var change. Two files touched.

## What changed

- **Countdown moved into the header.** Was a low-opacity footer at the bottom-right of every tab. Now lives prominently in the Header with the canonical kura typographic stack: small monospace eyebrow (`UNTIL SAN DIEGO`) above a big serif figure (`211 days`).
- **Header reveal cascade.** Logo → wordmark → tagline → countdown each fade in with a 200ms stagger. The whole header takes about 1.7 seconds to fully appear on first paint. Reads as a curtain rising.
- **Deadline updated to December 15, 2026.** Was September 30, 2027. The number is now ~7 months out, which makes the countdown actually pointed.
- **Post-deadline graceful state.** If the countdown ever hits zero, the figure hides and the eyebrow changes to `SAN DIEGO, TODAY`. Doesn't render as a broken "0 days" forever.

## What didn't change

- All data, items, memories
- Supabase schema (no migration needed)
- Env vars
- Tab structure, status flow, categories
- Logo, palette, fonts
- Everything else

## Deploy

1. Download the zip, unzip it
2. In your GitHub repo: **Add file → Upload files**
3. Drag every file from the unzipped folder
4. Accept overwrites
5. Commit

Vercel auto-deploys in ~2 min. PWA picks up the new build automatically — no need to remove and reinstall the home-screen icon since the icon files didn't change.

## What's next

This is the first of four planned polish passes:

- **v6 (this patch)** — header & countdown ✓
- **v7** — loading screen with a bucket-overflowing or list-unraveling animation (mockups first)
- **v8** — motion polish: completion celebration when an item gets marked done, cross-fade tab transitions, richer Roll reveal
- **v9** — Memories section rework (mockups first)

## Patch Notes

- Countdown promoted from low-opacity footer to a prominent line in the Header with eyebrow + figure typography
- Deadline updated from 9/30/2027 to 12/15/2026
- Header elements now stagger-fade in on first paint (logo → wordmark → tagline → countdown)
- Bottom-of-tab countdown footer removed (was redundant)
- Post-deadline state handled gracefully — eyebrow changes to "san diego, today" and the figure hides instead of stuck at "0 days"
