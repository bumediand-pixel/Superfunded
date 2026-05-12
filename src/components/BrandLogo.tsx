/**
 * Brand mark — official SuperFunded identity.
 *
 *   ┌────┐  THE
 *   │ S/ │  SUPERFUNDED
 *   └────┘   (SUPER white, FUNDED red)
 *
 * Hexagon containing a stylized "S" mark with a red diagonal accent.
 * Wordmark is a two-line lockup: small "THE" eyebrow + bold "SUPERFUNDED" below
 * with the SUPER half white/dark and FUNDED half red.
 *
 *   <BrandLogo size={32} />                       → just the hex icon
 *   <BrandLogo size={28} text />                  → icon + wordmark (dark theme)
 *   <BrandLogo size={28} text variant="light" />  → light theme (for white bg)
 */
import React from 'react';

type Props = {
  /** Icon edge length in px */
  size?: number;
  /** Render the "THE SUPERFUNDED" wordmark lockup next to the icon */
  text?: boolean;
  /** Light = SUPER text reads dark on white bg; Dark = SUPER reads white on dark bg */
  variant?: 'light' | 'dark';
  className?: string;
};

const RED = '#E63946';

export default function BrandLogo({ size = 32, text = false, variant = 'dark', className = '' }: Props) {
  const superColor = variant === 'light' ? '#0a0a0a' : '#ffffff';
  const ruleColor  = variant === 'light' ? '#0a0a0a' : '#ffffff';
  const eyebrowColor = variant === 'light' ? '#0a0a0a' : '#ffffff';

  // Wordmark scales relative to the icon size so the lockup stays balanced.
  const wordSize    = size * 0.78;
  const eyebrowSize = size * 0.34;

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {/* Matches /public/favicon.svg + /src/app/icon.svg exactly — single
          source of truth for the brand mark across browser tab, Google
          snippet, OG cards, and in-page usage. */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SuperFunded"
        role="img">
        {/* Rounded dark tile */}
        <rect width="64" height="64" rx="14" fill={variant === 'light' ? '#0a0a0a' : '#0a0a0a'} />
        {/* Upper S hook */}
        <path d="M16 16 H46 V24 H26 V30 H18 Z" fill="#ffffff" />
        {/* Lower S hook (mirrored) */}
        <path d="M48 48 H18 V40 H38 V34 H46 Z" fill="#ffffff" />
        {/* Red diagonal wedge slicing through the centre */}
        <path d="M14 42 L50 18 L53 24 L17 48 Z" fill={RED} />
      </svg>

      {text && (
        <span className="inline-flex items-center gap-3">
          {/* Vertical divider */}
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              width: 1,
              height: size * 0.95,
              background: ruleColor,
              opacity: 0.7,
            }}
          />
          {/* Two-line wordmark lockup */}
          <span className="flex flex-col leading-none">
            <span
              style={{
                fontSize: eyebrowSize,
                color: eyebrowColor,
                fontWeight: 700,
                letterSpacing: '0.18em',
                marginBottom: eyebrowSize * 0.35,
              }}>
              THE
            </span>
            <span
              style={{
                fontSize: wordSize,
                fontWeight: 900,
                letterSpacing: '-0.01em',
                lineHeight: 0.9,
              }}>
              <span style={{ color: superColor }}>SUPER</span>
              <span style={{ color: RED }}>FUNDED</span>
            </span>
          </span>
        </span>
      )}
    </span>
  );
}
