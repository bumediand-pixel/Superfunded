/**
 * Brand mark used everywhere — sidebar, header, footer, marketing nav.
 * Geometric stacked-arrow icon + wordmark variants.
 *
 * <BrandLogo size={32} />            → just the icon
 * <BrandLogo size={28} text />       → icon + "SuperFunded" wordmark
 * <BrandLogo size={28} text variant="light" /> → light theme (dark text)
 */
import React from 'react';

type Props = {
  /** Icon edge length in px */
  size?: number;
  /** Render the "SuperFunded" wordmark next to the icon */
  text?: boolean;
  /** Light = dark text (white bg); Dark = white text (dark bg) */
  variant?: 'light' | 'dark';
  className?: string;
};

export default function BrandLogo({ size = 28, text = false, variant = 'dark', className = '' }: Props) {
  const textColor = variant === 'light' ? '#0a0a0a' : '#ffffff';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size} height={size} viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg" aria-label="SuperFunded">
        <defs>
          <linearGradient id="bl-red" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff4654" />
            <stop offset="100%" stopColor="#b11626" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="#0a0a0a" />
        <rect x="18" y="40" width="28" height="6" rx="3" fill="#3a0e15" />
        <rect x="18" y="30" width="28" height="6" rx="3" fill="url(#bl-red)" />
        <rect x="18" y="20" width="28" height="6" rx="3" fill="#ff8a93" />
        <path d="M32 12 L38 18 L26 18 Z" fill="#ffffff" />
      </svg>
      {text && (
        <span className="font-extrabold tracking-tight" style={{ color: textColor, fontSize: size * 0.62 }}>
          Super<span style={{ color: '#e63946' }}>Funded</span>
        </span>
      )}
    </span>
  );
}
