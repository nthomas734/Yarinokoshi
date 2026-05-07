# pail (v4)

> *chicago, before we go*

A bucket list PWA for me and my wife — Chicago things to finish before we move to San Diego in September 2027.

Sister app to [daizu](https://daizu-henna.vercel.app).

## Stack

- Next.js 15.5.7 (App Router) + React 19.2.1 + TypeScript
- Supabase (Postgres + Storage)
- Vercel
- PWA (iOS + Android home screen install)
- No CSS framework — inline styles with shared theme tokens

## Design

- Aubergine/dusk palette (`#2A1F2E` bg) with brass/cream accents
- Fraunces (display) + Geist Mono (board) + Manrope (body)
- Logo: Chicago skyline as a pail body with a brass-line bucket handle
- Four views: Board · Roll · Timeline · Memories

## Features (v4)

- **Board** — categorized item list with status flap animation, dual filter strips (category + season), category color dots
- **Roll** — random picker with category multi-select, slot-machine reveal animation, mark-soon shortcut
- **Timeline** — 17-month seasonal view, items roll forward into next matching month, date ranges show in every covered month
- **Memories** — photo grid of completed items with notes
- **Edit mode** — full edit on title/category/seasons/dates/notes via the detail modal
- **Multi-season tags + optional date range** — flexible time window model
- **Subtle countdown** to San Diego, bottom of every screen

## Setup

- Fresh deploy: see [SETUP.md](./SETUP.md)
- Updating from a previous version: see [UPDATE.md](./UPDATE.md)
- Schema migration & seed: see [MIGRATION.sql](./MIGRATION.sql)

## Categories

🟢 Neighborhoods · 🟪 Museums · 🟠 Sports · 🔵 Road Trips · 🟡 Seasonal · 🔴 Food & Drink · 🟣 Shows · 🟤 Just Because
