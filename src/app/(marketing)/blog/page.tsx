import Link from 'next/link';
import type { Metadata } from 'next';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { POSTS } from './_data';

export const metadata: Metadata = {
  title: 'Blog & Strategie — SuperFunded',
  description: 'Strategii de pariuri sportive, bankroll management, analiză cote și ghiduri pentru pickeri funded.',
};

export default function BlogIndex() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full mb-4"
            style={{ background: '#fff1f2', color: 'var(--red)' }}>
            Blog
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            Strategie & insights
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
            Ghiduri detaliate, breakdown-uri de match-uri și framework-uri de bankroll management — direct de la pickeri funded.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {POSTS.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl"
              style={{ background: 'white', border: '1px solid var(--border)' }}>
              <div className="aspect-[16/9] flex items-center justify-center text-7xl"
                style={{ background: `linear-gradient(135deg, ${post.color}22, ${post.color}05)` }}>
                <span aria-hidden>{post.emoji}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span className="font-bold tracking-widest uppercase" style={{ color: post.color }}>{post.category}</span>
                  <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{post.readMin} min</span>
                </div>
                <h2 className="text-xl font-extrabold mb-2 group-hover:text-[var(--red)] transition-colors"
                  style={{ color: 'var(--text)' }}>
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--red)' }}>
                  Citește <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
