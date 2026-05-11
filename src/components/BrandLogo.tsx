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
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="SuperFunded"
        role="img">
        {/* Hexagonal frame */}
        <polygon
          points="32,3 57,17 57,47 32,61 7,47 7,17"
          fill="none"
          stroke={superColor}
          strokeWidth="4"
          strokeLinejoin="miter"
        />
        {/* Upper hook of the S — angular bracket opening right */}
        <path
          d="M20 17 L44 17 L44 23 L28 23 L28 31 L20 31 Z"
          fill={superColor}
        />
        {/* Lower hook of the S — angular bracket opening left */}
        <path
          d="M44 47 L20 47 L20 41 L36 41 L36 33 L44 33 Z"
          fill={superColor}
        />
        {/* Red diagonal accent slashing through the centre */}
        <path
          d="M19 38 L45 22 L48 28 L22 44 Z"
          fill={RED}
        />
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
