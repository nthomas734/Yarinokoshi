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
      {/* Pail-Die Hybrid mark — die with bucket handle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 12,
          animation: 'fadeIn 0.6s ease-out'
        }}
      >
        <svg
          viewBox="0 0 50 50"
          width="52"
          height="52"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="pail"
        >
          {/* Bucket handle arching above */}
          <path
            d="M 13 16 Q 13 8, 25 8 Q 37 8, 37 16"
            fill="none"
            stroke={theme.brass}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Die body */}
          <rect
            x="11" y="17" width="28" height="26" rx="4"
            fill="none"
            stroke={theme.brass}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {/* 5 pips */}
          <circle cx="18" cy="24" r="1.8" fill={theme.brass} />
          <circle cx="32" cy="24" r="1.8" fill={theme.brass} />
          <circle cx="25" cy="30" r="1.8" fill={theme.brass} />
          <circle cx="18" cy="36" r="1.8" fill={theme.brass} />
          <circle cx="32" cy="36" r="1.8" fill={theme.brass} />
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
