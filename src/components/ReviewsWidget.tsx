'use client';
import { Star, ThumbsUp } from 'lucide-react';

const REVIEWS = [
  { rating: 5, text: 'Cea mai serioasă firmă de pariuri funded din RO. Plata în 36h, fără hassle.', author: 'Andrei P.', flag: '🇷🇴' },
  { rating: 5, text: 'Calculatoarele Kelly + ROI sunt extrem de utile. Discord activ și serios.', author: 'Marco S.', flag: '🇮🇹' },
  { rating: 5, text: 'Am trecut prin 3 prop-firms. Asta e singura cu suport real în română.', author: 'Cristian B.', flag: '🇷🇴' },
  { rating: 4, text: 'Reset-ul cu 50% off m-a salvat după ce am ratat target-ul faza 2.', author: 'Tom R.', flag: '🇩🇪' },
];

const AGGREGATE = { rating: 4.7, count: 327 };

export default function ReviewsWidget() {
  return (
    <section className="py-16" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Aggregate */}
          <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(15,23,42,0.06)' }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ background: '#00b67a' }}>
                <ThumbsUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-extrabold" style={{ color: 'var(--text)' }}>Excellent</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-5xl font-extrabold" style={{ color: 'var(--text)' }}>{AGGREGATE.rating}</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>/5</span>
            </div>
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" style={{ color: i < Math.floor(AGGREGATE.rating) ? '#00b67a' : '#e2e8f0' }} />
              ))}
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Bazat pe <strong>{AGGREGATE.count}</strong> review-uri verificate.
            </p>
            <p className="text-[10px] mt-3 font-bold tracking-widest uppercase" style={{ color: 'var(--text-subtle)' }}>
              Trustpilot · Google · Discord
            </p>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-3">
            {REVIEWS.map((r, i) => (
              <div key={i} className="rounded-2xl p-5"
                style={{ background: 'white', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: j < r.rating ? '#00b67a' : '#e2e8f0' }} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--text)' }}>"{r.text}"</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span aria-hidden>{r.flag}</span> {r.author} · review verificat
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
