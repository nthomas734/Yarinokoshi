'use client';

import { theme } from '@/lib/theme';

export function Header() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px 16px 18px',
        position: 'relative'
      }}
    >
      {/* Pail logo — Chicago skyline with bucket handle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 10,
          animation: 'fadeIn 0.6s ease-out'
        }}
      >
        <svg
          viewBox="0 0 200 200"
          width="56"
          height="56"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="pail"
        >
          {/* Bucket handle arching above */}
          <path
            d="M 50 95 Q 50 50, 100 50 Q 150 50, 150 95"
            fill="none"
            stroke={theme.brass}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Chicago skyline silhouette */}
          <path
            d="M 35 155 L 35 120 L 50 120 L 50 100 L 60 100 L 60 120
               L 70 120 L 70 85 L 76 85 L 76 70 L 80 70 L 80 55
               L 82 55 L 82 70 L 86 70 L 86 85 L 92 85 L 92 100
               L 102 100 L 102 75 L 108 75 L 108 60 L 118 60 L 118 75
               L 124 75 L 124 100 L 134 100 L 134 120 L 150 120 L 150 95
               L 162 95 L 162 120 L 175 120 L 175 155 Z"
            fill="none"
            stroke={theme.brass}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Lake horizon */}
          <line
            x1="25"
            y1="170"
            x2="175"
            y2="170"
            stroke={theme.brass}
            strokeWidth="3.5"
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
          opacity: 0.55,
          marginTop: 8,
          textTransform: 'uppercase'
        }}
      >
        — chicago, before we go —
      </div>
    </div>
  );
}
