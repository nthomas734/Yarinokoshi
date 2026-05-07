'use client';

import { useEffect, useMemo, useState } from 'react';
import { theme } from '@/lib/theme';
import {
  CATEGORIES,
  type Category,
  type Item
} from '@/lib/supabase';
import { FlapText } from './FlapText';

interface RollViewProps {
  items: Item[];
  initialCategoryFilter: 'all' | Category;
  onSelect: (item: Item) => void;
  onMarkSoon: (item: Item) => Promise<void>;
}

export function RollView({ items, initialCategoryFilter, onSelect, onMarkSoon }: RollViewProps) {
  // Selected categories - pre-populated from board's current category filter
  const [selectedCats, setSelectedCats] = useState<Set<Category>>(() => {
    if (initialCategoryFilter === 'all') {
      return new Set(CATEGORIES.map(c => c.code));
    }
    return new Set([initialCategoryFilter]);
  });

  // Roll state
  type RollPhase = 'idle' | 'rolling' | 'revealed';
  const [phase, setPhase] = useState<RollPhase>('idle');
  const [pickedItem, setPickedItem] = useState<Item | null>(null);
  const [scrambleText, setScrambleText] = useState<string>('');
  const [marking, setMarking] = useState(false);

  // Pool of eligible items (selected categories, not done)
  const pool = useMemo(
    () => items.filter(i =>
      i.status !== 'done' &&
      selectedCats.has(i.category)
    ),
    [items, selectedCats]
  );

  function toggleCategory(cat: Category) {
    setSelectedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
    // Reset roll state when filters change
    if (phase !== 'idle') {
      setPhase('idle');
      setPickedItem(null);
    }
  }

  function selectAll() {
    setSelectedCats(new Set(CATEGORIES.map(c => c.code)));
    if (phase !== 'idle') {
      setPhase('idle');
      setPickedItem(null);
    }
  }

  function selectNone() {
    setSelectedCats(new Set());
    if (phase !== 'idle') {
      setPhase('idle');
      setPickedItem(null);
    }
  }

  async function roll() {
    if (pool.length === 0) return;
    setPhase('rolling');
    setPickedItem(null);

    // Cycle through several random titles for the slot-machine feel
    const cycles = 8;
    const cycleDuration = 90;
    for (let i = 0; i < cycles; i++) {
      const random = pool[Math.floor(Math.random() * pool.length)];
      setScrambleText(random.title);
      await sleep(cycleDuration);
    }

    // Final pick
    const final = pool[Math.floor(Math.random() * pool.length)];
    setScrambleText(final.title);
    setPickedItem(final);
    setPhase('revealed');
  }

  async function handleMarkSoon() {
    if (!pickedItem) return;
    setMarking(true);
    await onMarkSoon(pickedItem);
    setMarking(false);
    // Update local picked state to reflect change
    setPickedItem({ ...pickedItem, status: 'soon' });
  }

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out', paddingBottom: 20 }}>
      {/* Header */}
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
        — pick something to do —
      </div>

      {/* Category multi-select */}
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 8,
            padding: '0 2px'
          }}
        >
          <div
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 9,
              letterSpacing: '0.2em',
              color: theme.brass,
              opacity: 0.65,
              textTransform: 'uppercase'
            }}
          >
            roll from
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={selectAll}
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 9,
                letterSpacing: '0.15em',
                color: theme.brass,
                opacity: 0.8,
                textTransform: 'uppercase',
                background: 'transparent',
                border: 'none',
                padding: 0
              }}
            >
              all
            </button>
            <span style={{ color: theme.dim, fontSize: 9 }}>·</span>
            <button
              onClick={selectNone}
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 9,
                letterSpacing: '0.15em',
                color: theme.brass,
                opacity: 0.8,
                textTransform: 'uppercase',
                background: 'transparent',
                border: 'none',
                padding: 0
              }}
            >
              none
            </button>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 6
          }}
        >
          {CATEGORIES.map(c => {
            const active = selectedCats.has(c.code);
            const count = items.filter(i => i.category === c.code && i.status !== 'done').length;
            return (
              <button
                key={c.code}
                onClick={() => toggleCategory(c.code)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 12px',
                  background: active ? 'rgba(200, 169, 126, 0.12)' : theme.surface,
                  border: `1px solid ${active ? theme.brass : theme.dimmer}`,
                  borderRadius: 4,
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.08em',
                  color: active ? theme.cream : theme.dim,
                  textTransform: 'uppercase',
                  textAlign: 'left'
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: c.color,
                    opacity: active ? 1 : 0.4,
                    flexShrink: 0
                  }}
                />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.label}
                </span>
                <span style={{ opacity: 0.6, fontSize: 9 }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pool size indicator */}
      <div
        style={{
          textAlign: 'center',
          fontFamily: "'Geist Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.18em',
          color: theme.dim,
          textTransform: 'uppercase',
          marginBottom: 14
        }}
      >
        {pool.length === 0
          ? 'pick at least one category'
          : `${pool.length} option${pool.length === 1 ? '' : 's'} in the pail`}
      </div>

      {/* Reveal panel */}
      <div
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
          padding: '36px 18px',
          borderRadius: 4,
          marginBottom: 16,
          minHeight: 130,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          border: `1px solid rgba(0,0,0,0.4)`,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.4)',
          position: 'relative'
        }}
      >
        {phase === 'idle' && (
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              fontSize: 18,
              color: theme.dim,
              fontStyle: 'italic'
            }}
          >
            the pail is waiting
          </div>
        )}
        {phase === 'rolling' && (
          <div
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: theme.cream,
              textTransform: 'uppercase',
              opacity: 0.85
            }}
          >
            {scrambleText}
          </div>
        )}
        {phase === 'revealed' && pickedItem && (
          <>
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 8,
                letterSpacing: '0.25em',
                color: theme.brass,
                textTransform: 'uppercase',
                marginBottom: 10,
                opacity: 0.75
              }}
            >
              the pail picked
            </div>
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '0.06em',
                color: theme.cream,
                textTransform: 'uppercase',
                lineHeight: 1.3
              }}
            >
              <FlapText
                text={pickedItem.title}
                cyclesPerChar={4}
                cycleSpeed={40}
                staggerPerChar={20}
              />
            </div>
            {/* Show category color indicator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 10,
                fontFamily: "'Geist Mono', monospace",
                fontSize: 9,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: theme.brass,
                opacity: 0.7
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: CATEGORIES.find(c => c.code === pickedItem.category)?.color ?? theme.brass
                }}
              />
              {CATEGORIES.find(c => c.code === pickedItem.category)?.label ?? pickedItem.category}
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      {phase === 'idle' && (
        <button
          onClick={roll}
          disabled={pool.length === 0}
          style={{
            width: '100%',
            padding: '16px 0',
            background: pool.length === 0 ? theme.surface : theme.brass,
            color: pool.length === 0 ? theme.dim : theme.board,
            border: pool.length === 0 ? `1px solid ${theme.dimmer}` : 'none',
            borderRadius: 4,
            fontFamily: "'Geist Mono', monospace",
            fontSize: 12,
            letterSpacing: '0.2em',
            fontWeight: 700,
            textTransform: 'uppercase',
            opacity: pool.length === 0 ? 0.5 : 1
          }}
        >
          roll the pail
        </button>
      )}

      {phase === 'rolling' && (
        <div
          style={{
            textAlign: 'center',
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.2em',
            color: theme.brass,
            opacity: 0.7,
            textTransform: 'uppercase',
            padding: '14px 0'
          }}
        >
          rolling…
        </div>
      )}

      {phase === 'revealed' && pickedItem && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          <button
            onClick={roll}
            style={{
              padding: '14px 0',
              background: 'transparent',
              color: theme.brass,
              border: `1px solid ${theme.brass}`,
              borderRadius: 3,
              fontFamily: "'Geist Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 600
            }}
          >
            re-roll
          </button>
          <button
            onClick={handleMarkSoon}
            disabled={marking || pickedItem.status === 'soon'}
            style={{
              padding: '14px 0',
              background: pickedItem.status === 'soon' ? theme.surface : theme.soon,
              color: pickedItem.status === 'soon' ? theme.dim : theme.board,
              border: 'none',
              borderRadius: 3,
              fontFamily: "'Geist Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              opacity: marking ? 0.5 : 1
            }}
          >
            {marking ? '…' : pickedItem.status === 'soon' ? 'is soon' : 'mark soon'}
          </button>
          <button
            onClick={() => onSelect(pickedItem)}
            style={{
              padding: '14px 0',
              background: theme.brass,
              color: theme.board,
              border: 'none',
              borderRadius: 3,
              fontFamily: "'Geist Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700
            }}
          >
            view item
          </button>
        </div>
      )}
    </div>
  );
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
