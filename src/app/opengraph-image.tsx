/**
 * Dynamic Open Graph image — renders the homepage social card as PNG via
 * @vercel/og. Twitter/LinkedIn/FB choke on SVG OG; this guarantees a clean
 * 1200×630 PNG that all platforms accept.
 *
 * Next.js auto-discovers `app/opengraph-image.{tsx,jpg,png}` and wires the
 * generated PNG into the homepage's <meta property="og:image">. Per-route
 * variants live in their respective folders.
 */
import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'TheSuperFunded — pick-uri cu capitalul nostru';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
          padding: '60px',
          fontFamily: 'system-ui, sans-serif',
        }}>
        {/* Logo lockup row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* Brand mark — inline SVG */}
          <svg width="140" height="140" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#0a0a0a" />
            <path d="M16 16 H46 V24 H26 V30 H18 Z" fill="#ffffff" />
            <path d="M48 48 H18 V40 H38 V34 H46 Z" fill="#ffffff" />
            <path d="M14 42 L50 18 L53 24 L17 48 Z" fill="#E63946" />
          </svg>
          {/* Wordmark */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, color: '#0a0a0a' }}>THE</span>
            <span style={{ fontSize: 44, fontWeight: 900, color: '#0a0a0a', letterSpacing: -1 }}>
              SUPER<span style={{ color: '#E63946' }}>FUNDED</span>
            </span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 60 }}>
          <span style={{ fontSize: 110, fontWeight: 900, color: '#0a0a0a', letterSpacing: -3, lineHeight: 1 }}>Pick-uri cu</span>
          <span style={{ fontSize: 110, fontWeight: 900, color: '#E63946', letterSpacing: -3, lineHeight: 1, marginTop: 8 }}>capitalul nostru.</span>
        </div>

        {/* Subhead */}
        <span style={{ fontSize: 26, fontWeight: 500, color: '#475569', marginTop: 32 }}>
          Cont finanțat până la €50.000 · Profit split 80% · Retrageri 24-48h
        </span>

        {/* Footer row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'auto' }}>
          <div style={{ display: 'flex', padding: '10px 22px', borderRadius: 9999, background: '#ffffff', border: '2px solid #E63946' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#E63946' }}>9 SPORTURI</span>
          </div>
          <div style={{ display: 'flex', padding: '10px 22px', borderRadius: 9999, background: '#0a0a0a' }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>SPLIT 80%</span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#64748b', marginLeft: 'auto', fontFamily: 'monospace' }}>
            thesuperfunded.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
