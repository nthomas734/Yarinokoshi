-- =====================================================
-- pail v4.1 — schema migration + data fix
-- =====================================================
-- Run this entire block in Supabase SQL Editor.
-- Safe to run multiple times.

-- ----- SCHEMA -----

-- Add the new months column (text array of 3-letter codes: 'jan', 'feb', etc.)
alter table items add column if not exists months text[] default '{}';

-- Make sure prior columns exist too (in case anyone is jumping from v3 → v4.1)
alter table items add column if not exists seasons text[] default '{}';
alter table items add column if not exists date_start date;
alter table items add column if not exists date_end date;

-- ----- DATA FIX FOR v4 SEED ITEMS -----
-- v4's seed assigned 'summer' as a season tag to items that were originally
-- "aug only" or similar. That made them roll into the next-summer-month
-- bucket instead of the correct month. v4.1 fixes by moving them to months.

-- The summer bucket-list items originally tagged as "aug only" or summer-month-specific:
update items set
  months = array['aug'],
  seasons = '{}'
where title in (
  'Wisconsin State Fair',
  'Air & Water Show',
  'Mackinac Island',
  'Indiana Dunes',
  'Camping Trip'
)
and (months is null or array_length(months, 1) is null)
and 'summer' = any(coalesce(seasons, '{}'::text[]));

-- Lincoln Park Beavers — keep as 'summer' season tag (no specific month)
-- (no change needed, but documenting intent)

-- ----- HOUSEKEEPING (idempotent, safe to re-run) -----
update items set status = 'someday' where status = 'dreaming';
update items set status = 'planned' where status = 'scheduled';
update items set status = 'soon'    where status = 'boarding';
update items set status = 'done'    where status = 'departed';
update items set category = 'road' where category = 'fair';
alter table items alter column status set default 'someday';

-- Ensure nullable columns have proper defaults for future inserts
alter table items alter column seasons set default '{}';
alter table items alter column months set default '{}';
