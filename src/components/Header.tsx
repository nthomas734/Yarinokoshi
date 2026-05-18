'use client';

import { useEffect, useState } from 'react';
import { theme, daysToSanDiego } from '@/lib/theme';

export function Header() {
  const [days, setDays] = useState<number>(daysToSanDiego());

  // Refresh countdown hourly (component is likely mounted for whole session)
  useEffect(() => {
    const interval = setInterval(() => setDays(daysToSanDiego()), 60_000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '36px 16px 26px',
        position: 'relative'
      }}
    >
      {/* Checklist mark */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 14,
          animation: 'fadeIn 0.6s ease-out'
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="56"
          height="56"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="pail"
        >
          <path
            d="M 22 30 L 28 36 L 38 24"
            fill="none"
            stroke={theme.brass}
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="46" y1="30" x2="78" y2="30"
            stroke={theme.brass}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="30" cy="50" r="2.5" fill={theme.brass} opacity="0.5" />
          <line
            x1="46" y1="50" x2="78" y2="50"
            stroke={theme.brass}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <circle cx="30" cy="70" r="2.5" fill={theme.brass} opacity="0.5" />
          <line
            x1="46" y1="70" x2="78" y2="70"
            stroke={theme.brass}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <div
        style={{
          fontFamily: "'Fraunces', serif",
          fontWeight: 300,
          fontSize: 30,
          letterSpacing: '-0.01em',
          color: theme.cream,
          lineHeight: 1,
          animation: 'fadeIn 0.7s ease-out 0.2s both'
        }}
      >
        pail
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.2em',
          color: theme.brass,
          opacity: 0.6,
          marginTop: 8,
          textTransform: 'uppercase',
          animation: 'fadeIn 0.8s ease-out 0.4s both'
        }}
      >
        — chicago, before we go —
      </div>

      {/* Countdown — eyebrow + figure, the meaningful number */}
      <div
        style={{
          maxWidth: 240,
          margin: '22px auto 0',
          paddingTop: 16,
          borderTop: `1px dashed ${theme.dimmer}`,
          animation: 'fadeIn 1s ease-out 0.7s both'
        }}
      >
        <div
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.2em',
            color: theme.brass,
            opacity: 0.55,
            textTransform: 'uppercase',
            marginBottom: 4
          }}
        >
          {days > 0 ? 'until san diego' : 'san diego, today'}
        </div>
        {days > 0 && (
          <div
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 300,
              fontSize: 26,
              letterSpacing: '-0.01em',
              color: theme.brass,
              lineHeight: 1.1
            }}
          >
            {days} {days === 1 ? 'day' : 'days'}
          </div>
        )}
      </div>
    </div>
  );
}
