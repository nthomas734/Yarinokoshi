'use client';

import { useMemo } from 'react';
import { theme } from '@/lib/theme';
import {
  CATEGORIES,
  itemCoversMonth,
  timelineMode,
  type Item
} from '@/lib/supabase';

interface TimelineViewProps {
  items: Item[];
  onSelect: (item: Item) => void;
}

const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

interface MonthBucket {
  year: number;
  month: number; // 0-11
  label: string;
  items: Item[];
}

export function TimelineView({ items, onSelect }: TimelineViewProps) {
  const buckets = useMemo(() => buildBuckets(items), [items]);
  const anyTimeItems = items.filter(i =>
    timelineMode(i) === 'any' && i.status !== 'done'
  );

  // Group buckets by year for header bands
  const years: { year: number; buckets: MonthBucket[] }[] = useMemo(() => {
    const grouped: Record<number, MonthBucket[]> = {};
    buckets.forEach(b => {
      if (!grouped[b.year]) grouped[b.year] = [];
      grouped[b.year].push(b);
    });
    return Object.keys(grouped)
      .map(y => parseInt(y))
      .sort((a, b) => a - b)
      .map(year => ({ year, buckets: grouped[year] }));
  }, [buckets]);

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out', paddingBottom: 20 }}>
      <div
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.2em',
          color: theme.brass,
          opacity: 0.55,
          textTransform: 'uppercase',
          textAlign: 'center',
          marginBottom: 18,
          paddingBottom: 14,
          borderBottom: `1px dashed ${theme.dimmer}`
        }}
      >
        — now → september 2027 —
      </div>

      {years.map(({ year, buckets: yearBuckets }, yearIdx) => (
        <div key={year}>
          <YearBand year={year} isFirst={yearIdx === 0} />
          {yearBuckets.map((bucket, idx) => (
            <MonthBlock
              key={`${bucket.year}-${bucket.month}`}
              bucket={bucket}
              isFirst={yearIdx === 0 && idx === 0}
              onSelect={onSelect}
            />
          ))}
        </div>
      ))}

      {anyTimeItems.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.2em',
              color: theme.brass,
              opacity: 0.7,
              textTransform: 'uppercase',
              padding: '14px 0 10px',
              borderTop: `1px dashed ${theme.dimmer}`
            }}
          >
            anytime · no window
          </div>
          {anyTimeItems.map(item => (
            <TimelineItem key={item.id} item={item} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}

function YearBand({ year, isFirst }: { year: number; isFirst: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: isFirst ? '0 0 18px' : '24px 0 18px',
        marginTop: isFirst ? 0 : 8
      }}
    >
      <div style={{ flex: 1, height: 1, background: theme.dimmer }} />
      <div
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 300,
          fontSize: 18,
          letterSpacing: '0.04em',
          color: theme.brass,
          padding: '0 4px'
        }}
      >
        {year}
      </div>
      <div style={{ flex: 1, height: 1, background: theme.dimmer }} />
    </div>
  );
}

function buildBuckets(items: Item[]): MonthBucket[] {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(2027, 8, 1); // September 2027

  const buckets: MonthBucket[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    buckets.push({
      year: cursor.getFullYear(),
      month: cursor.getMonth(),
      label: MONTH_NAMES[cursor.getMonth()],
      items: []
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  // Place items based on their precision:
  //  - 'exact' (date range): show in every covered month
  //  - 'month' (specific months tagged): show in every matching month (not just next)
  //  - 'season' (only seasons): show in next upcoming matching month, then roll forward
  //  - 'any': handled separately in the anyTime section
  items.forEach(item => {
    if (item.status === 'done') return;
    const mode = timelineMode(item);

    if (mode === 'exact') {
      buckets.forEach(b => {
        if (itemCoversMonth(item, b.year, b.month)) b.items.push(item);
      });
    } else if (mode === 'month') {
      // Show in every bucket whose month is in the months[] list
      buckets.forEach(b => {
        if (itemCoversMonth(item, b.year, b.month)) b.items.push(item);
      });
    } else if (mode === 'season') {
      // Roll-forward: only the NEXT matching month
      const targetIdx = buckets.findIndex(b => itemCoversMonth(item, b.year, b.month));
      if (targetIdx >= 0) buckets[targetIdx].items.push(item);
    }
  });

  return buckets;
}

function MonthBlock({
  bucket,
  isFirst,
  onSelect
}: {
  bucket: MonthBucket;
  isFirst: boolean;
  onSelect: (item: Item) => void;
}) {
  const empty = bucket.items.length === 0;

  return (
    <div style={{ marginBottom: empty ? 4 : 14 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          padding: empty ? '4px 0' : '10px 0 8px',
          opacity: empty ? 0.4 : 1
        }}
      >
        <div
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: isFirst ? theme.brass : theme.cream
          }}
        >
          {bucket.label}
        </div>
        <div style={{ flex: 1, height: 1, background: theme.dimmer }} />
        <div
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.15em',
            color: theme.dim,
            textTransform: 'uppercase'
          }}
        >
          {bucket.items.length} {bucket.items.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {bucket.items.map(item => (
        <TimelineItem key={`${bucket.year}-${bucket.month}-${item.id}`} item={item} onSelect={onSelect} />
      ))}
    </div>
  );
}

function TimelineItem({ item, onSelect }: { item: Item; onSelect: (item: Item) => void }) {
  const cat = CATEGORIES.find(c => c.code === item.category);
  return (
    <button
      onClick={() => onSelect(item)}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 10,
        padding: '10px 12px',
        marginBottom: 4,
        background: theme.surface,
        borderRadius: 3,
        borderLeft: `2px solid ${theme.planned}`,
        width: '100%',
        textAlign: 'left',
        alignItems: 'center'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: cat?.color ?? theme.brass,
            flexShrink: 0
          }}
        />
        <div
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: theme.tileText,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {item.title}
        </div>
      </div>
      <div
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 8,
          letterSpacing: '0.15em',
          color: theme.brass,
          textTransform: 'uppercase'
        }}
      >
        {cat?.short ?? item.category}
      </div>
    </button>
  );
}
