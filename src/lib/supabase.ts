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

export interface Item {
  id: string;
  title: string;
  category: Category;
  // Multi-season tags array (replaces single time_window). May be empty for "any time".
  seasons: Season[];
  // Optional specific date range (overrides seasons in timeline view if set)
  date_start: string | null;  // ISO date 'YYYY-MM-DD'
  date_end: string | null;    // ISO date 'YYYY-MM-DD'
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
  { code: 'neighborhood', label: 'neighborhoods', short: 'NBHD', color: '#7B9F8C' }, // sage green
  { code: 'museum',       label: 'museums',       short: 'MUSE', color: '#A88BB0' }, // dusty mauve
  { code: 'sport',        label: 'sports',        short: 'SPRT', color: '#C77B5C' }, // terracotta
  { code: 'road',         label: 'road trips',    short: 'ROAD', color: '#8AA4C2' }, // dusty blue
  { code: 'seasonal',     label: 'seasonal',      short: 'SEAS', color: '#D4A657' }, // warm ochre
  { code: 'food',         label: 'food & drink',  short: 'FOOD', color: '#B85C5C' }, // muted red
  { code: 'show',         label: 'shows',         short: 'SHOW', color: '#9B7EC8' }, // soft violet
  { code: 'just',         label: 'just because',  short: 'JUST', color: '#C8A97E' }  // brass (matches accent)
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

// Helper: human-readable label for an item's time window
export function timeWindowLabel(item: Pick<Item, 'seasons' | 'date_start' | 'date_end'>): string {
  if (item.date_start && item.date_end) {
    const start = new Date(item.date_start + 'T00:00:00');
    const end = new Date(item.date_end + 'T00:00:00');
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (item.date_start === item.date_end) {
      return fmt(start).toLowerCase();
    }
    if (sameMonth) {
      return `${start.toLocaleDateString('en-US', { month: 'short' }).toLowerCase()} ${start.getDate()}–${end.getDate()}`;
    }
    return `${fmt(start)} – ${fmt(end)}`.toLowerCase();
  }
  if (item.date_start) {
    return new Date(item.date_start + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toLowerCase();
  }
  if (!item.seasons || item.seasons.length === 0) return 'any time';
  if (item.seasons.length === 1) return item.seasons[0];
  if (item.seasons.length === 4) return 'all year';
  return item.seasons.join(' · ');
}

// Helper: month indices (0-11) covered by an item's time window. For timeline view.
export function itemCoversMonth(item: Item, year: number, month: number): boolean {
  // If specific date range, check overlap with this month
  if (item.date_start) {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const start = new Date(item.date_start + 'T00:00:00');
    const end = item.date_end ? new Date(item.date_end + 'T00:00:00') : start;
    return start <= monthEnd && end >= monthStart;
  }
  // If seasons, check membership
  if (item.seasons && item.seasons.length > 0) {
    const SEASON_MONTHS: Record<Season, number[]> = {
      spring: [2, 3, 4],
      summer: [5, 6, 7],
      fall:   [8, 9, 10],
      winter: [11, 0, 1]
    };
    return item.seasons.some(s => SEASON_MONTHS[s].includes(month));
  }
  return false;
}
