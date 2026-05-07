import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, key, {
  auth: { persistSession: false }
});

export type Status = 'someday' | 'planned' | 'soon' | 'done';
export type Category =
  | 'neighborhood'
  | 'museum'
  | 'sport'
  | 'road'
  | 'seasonal'
  | 'food'
  | 'show'
  | 'just';

export type Season = 'spring' | 'summer' | 'fall' | 'winter';
export type Month =
  | 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun'
  | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';

export interface Item {
  id: string;
  title: string;
  category: Category;
  // Time window — three optional, combinable mechanisms:
  seasons: Season[];          // multi-select tags
  months: Month[];             // specific month(s) — most precise
  date_start: string | null;   // optional specific date range start
  date_end: string | null;     // optional specific date range end
  // Legacy field — still in DB for back-compat, no longer driven by UI
  time_window: string;
  status: Status;
  notes: string | null;
  added_by: string | null;
  completed_by: string | null;
  completed_at: string | null;
  memory_photo: string | null;
  memory_note: string | null;
  created_at: string;
}

export const CATEGORIES: { code: Category; label: string; short: string; color: string }[] = [
  { code: 'neighborhood', label: 'neighborhoods', short: 'NBHD', color: '#7B9F8C' },
  { code: 'museum',       label: 'museums',       short: 'MUSE', color: '#A88BB0' },
  { code: 'sport',        label: 'sports',        short: 'SPRT', color: '#C77B5C' },
  { code: 'road',         label: 'road trips',    short: 'ROAD', color: '#8AA4C2' },
  { code: 'seasonal',     label: 'seasonal',      short: 'SEAS', color: '#D4A657' },
  { code: 'food',         label: 'food & drink',  short: 'FOOD', color: '#B85C5C' },
  { code: 'show',         label: 'shows',         short: 'SHOW', color: '#9B7EC8' },
  { code: 'just',         label: 'just because',  short: 'JUST', color: '#C8A97E' }
];

export const STATUS_LABELS: Record<Status, string> = {
  someday: 'someday',
  planned: 'planned',
  soon:    'soon',
  done:    'done ✓'
};

export const STATUS_ORDER: Status[] = ['soon', 'planned', 'someday', 'done'];

export const SEASONS: { code: Season; label: string }[] = [
  { code: 'spring', label: 'spring' },
  { code: 'summer', label: 'summer' },
  { code: 'fall',   label: 'fall' },
  { code: 'winter', label: 'winter' }
];

export const MONTHS: { code: Month; label: string; short: string; index: number }[] = [
  { code: 'jan', label: 'jan', short: 'JAN', index: 0 },
  { code: 'feb', label: 'feb', short: 'FEB', index: 1 },
  { code: 'mar', label: 'mar', short: 'MAR', index: 2 },
  { code: 'apr', label: 'apr', short: 'APR', index: 3 },
  { code: 'may', label: 'may', short: 'MAY', index: 4 },
  { code: 'jun', label: 'jun', short: 'JUN', index: 5 },
  { code: 'jul', label: 'jul', short: 'JUL', index: 6 },
  { code: 'aug', label: 'aug', short: 'AUG', index: 7 },
  { code: 'sep', label: 'sep', short: 'SEP', index: 8 },
  { code: 'oct', label: 'oct', short: 'OCT', index: 9 },
  { code: 'nov', label: 'nov', short: 'NOV', index: 10 },
  { code: 'dec', label: 'dec', short: 'DEC', index: 11 }
];

const SEASON_MONTH_INDICES: Record<Season, number[]> = {
  spring: [2, 3, 4],
  summer: [5, 6, 7],
  fall:   [8, 9, 10],
  winter: [11, 0, 1]
};

const MONTH_INDEX: Record<Month, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

// Human-readable label for an item's time window
export function timeWindowLabel(item: Pick<Item, 'seasons' | 'months' | 'date_start' | 'date_end'>): string {
  // 1. Specific date range wins
  if (item.date_start && item.date_end) {
    const start = new Date(item.date_start + 'T00:00:00');
    const end = new Date(item.date_end + 'T00:00:00');
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (item.date_start === item.date_end) {
      return fmt(start).toLowerCase();
    }
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    if (sameMonth) {
      return `${start.toLocaleDateString('en-US', { month: 'short' }).toLowerCase()} ${start.getDate()}–${end.getDate()}`;
    }
    return `${fmt(start)} – ${fmt(end)}`.toLowerCase();
  }
  if (item.date_start) {
    return new Date(item.date_start + 'T00:00:00')
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      .toLowerCase();
  }
  // 2. Specific months
  if (item.months && item.months.length > 0) {
    if (item.months.length === 1) return `${item.months[0]} only`;
    if (item.months.length === 2) return `${item.months[0]} · ${item.months[1]}`;
    return `${item.months.length} months`;
  }
  // 3. Seasons
  if (item.seasons && item.seasons.length > 0) {
    if (item.seasons.length === 1) return item.seasons[0];
    if (item.seasons.length === 4) return 'all year';
    return item.seasons.join(' · ');
  }
  // 4. Default
  return 'any time';
}

// Does item cover the given (year, month=0-11)?
// Uses date range if present, else months, else seasons.
export function itemCoversMonth(
  item: Pick<Item, 'seasons' | 'months' | 'date_start' | 'date_end'>,
  year: number,
  month: number
): boolean {
  if (item.date_start) {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const start = new Date(item.date_start + 'T00:00:00');
    const end = item.date_end ? new Date(item.date_end + 'T00:00:00') : start;
    return start <= monthEnd && end >= monthStart;
  }
  if (item.months && item.months.length > 0) {
    return item.months.some(m => MONTH_INDEX[m] === month);
  }
  if (item.seasons && item.seasons.length > 0) {
    return item.seasons.some(s => SEASON_MONTH_INDICES[s].includes(month));
  }
  return false;
}

// Returns the precision priority for timeline placement:
// "exact" (date range) → show in every covered month
// "month" (specific months) → show in every matching month
// "season" (seasons only) → show in next upcoming matching month, then roll forward
export function timelineMode(item: Pick<Item, 'seasons' | 'months' | 'date_start'>): 'exact' | 'month' | 'season' | 'any' {
  if (item.date_start) return 'exact';
  if (item.months && item.months.length > 0) return 'month';
  if (item.seasons && item.seasons.length > 0) return 'season';
  return 'any';
}
