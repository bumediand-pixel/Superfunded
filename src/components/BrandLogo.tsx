import React from 'react';

type Props = {
  size?: number;
  text?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
};

const RED = '#E63946';

export default function BrandLogo({ size = 32, text = false, variant = 'dark', className = '' }: Props) {
  const superColor = variant === 'light' ? '#0a0a0a' : '#ffffff';
  const ruleColor  = variant === 'light' ? '#0a0a0a' : '#ffffff';
  const eyebrowColor = variant === 'light' ? '#0a0a0a' : '#ffffff';

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
        <rect width="64" height="64" rx="14" fill="#0a0a0a" />
        <path d="M16 16 H46 V24 H26 V30 H18 Z" fill="#ffffff" />
        <path d="M48 48 H18 V40 H38 V34 H46 Z" fill="#ffffff" />
        <path d="M14 42 L50 18 L53 24 L17 48 Z" fill={RED} />
      </svg>

      {text && (
        <span className="inline-flex items-center gap-3">
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
