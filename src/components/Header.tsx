'use client';

import { theme } from '@/lib/theme';

export function Header() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '36px 16px 22px',
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
          {/* Row 1: checkmark + line */}
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
          {/* Row 2: bullet + line */}
          <circle cx="30" cy="50" r="2.5" fill={theme.brass} opacity="0.5" />
          <line
            x1="46" y1="50" x2="78" y2="50"
            stroke={theme.brass}
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          {/* Row 3: bullet + line */}
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
          lineHeight: 1
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
          textTransform: 'uppercase'
        }}
      >
        — chicago, before we go —
      </div>
    </div>
  );
}
