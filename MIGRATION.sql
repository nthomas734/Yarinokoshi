-- =====================================================
-- pail v4 — schema migration + conditional seed
-- =====================================================
-- Run this entire block in Supabase SQL Editor.
-- Safe to run on an existing yarinokoshi/pail database.
-- The seed at the bottom only inserts if the table is empty.

-- ----- SCHEMA UPDATES -----

-- Add new columns for v4 time window model
alter table items add column if not exists seasons text[] default '{}';
alter table items add column if not exists date_start date;
alter table items add column if not exists date_end date;

-- Migrate existing time_window values to the new seasons array
-- (only updates rows where seasons is empty AND time_window has a useful value)
update items
set seasons = case
  when time_window in ('spring', 'summer', 'fall', 'winter')
    then array[time_window]
  when time_window in ('mar', 'apr', 'may') then array['spring']
  when time_window in ('jun', 'jul', 'aug') then array['summer']
  when time_window in ('sep', 'oct', 'nov') then array['fall']
  when time_window in ('dec', 'jan', 'feb') then array['winter']
  else '{}'
end
where (seasons is null or array_length(seasons, 1) is null)
  and time_window is not null
  and time_window != 'any';

-- Drop the old "fair" category if it still exists (fold into road)
update items set category = 'road' where category = 'fair';

-- Migrate any old status names just in case
update items set status = 'someday' where status = 'dreaming';
update items set status = 'planned' where status = 'scheduled';
update items set status = 'soon'    where status = 'boarding';
update items set status = 'done'    where status = 'departed';

-- Update default for new rows
alter table items alter column status set default 'someday';

-- ----- CONDITIONAL SEED -----
-- Only inserts seed items if the items table is currently empty.
-- This means:
--   * Fresh deploy → seeds the full bucket list
--   * Existing data → does nothing, your items are safe
do $$
begin
  if (select count(*) from items) = 0 then
    insert into items (title, category, seasons, time_window, status, notes) values
      -- Just because
      ('Lincoln Park Beavers', 'just', array['summer'], 'any', 'someday', null),

      -- Shows
      ('Blues at Buddy Guy''s', 'show', array[]::text[], 'any', 'someday', null),
      ('Jazz at Green Mill', 'show', array[]::text[], 'any', 'someday', null),

      -- Road trips & seasonal events
      ('Air & Water Show', 'seasonal', array['summer'], 'any', 'someday', null),
      ('Camping Trip', 'road', array['summer'], 'any', 'someday', null),
      ('Indiana Dunes', 'road', array['summer'], 'any', 'someday', null),
      ('Mackinac Island', 'road', array['summer'], 'any', 'someday', null),
      ('Wisconsin State Fair', 'road', array['summer'], 'any', 'someday', null),

      -- Sports
      ('Cubs vs White Sox', 'sport', array[]::text[], 'any', 'someday', null),
      ('Northwestern Game', 'sport', array[]::text[], 'any', 'someday', null),
      ('Bulls Game', 'sport', array[]::text[], 'any', 'someday', null),
      ('Blackhawks Game', 'sport', array[]::text[], 'any', 'someday', null),
      ('White Sox Game', 'sport', array[]::text[], 'any', 'someday', null),

      -- Museums
      ('Stony Island Arts Bank', 'museum', array[]::text[], 'any', 'someday', null),
      ('Oriental Institute', 'museum', array[]::text[], 'any', 'someday', null),
      ('Smart Museum', 'museum', array[]::text[], 'any', 'someday', null),
      ('National Museum of Mexican Art', 'museum', array[]::text[], 'any', 'someday', null),
      ('Money Museum', 'museum', array[]::text[], 'any', 'someday', null),
      ('Driehaus Museum', 'museum', array[]::text[], 'any', 'someday', null),

      -- Neighborhoods
      ('Jefferson Park', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('South Shore', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Little Village', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Edgewater', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Pullman', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Beverly', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Rogers Park', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Avondale', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Humboldt Park', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Albany Park', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Andersonville', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Bronzeville', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Bridgeport', 'neighborhood', array[]::text[], 'any', 'someday', null),
      ('Pilsen', 'neighborhood', array[]::text[], 'any', 'someday', null);
  end if;
end $$;
