import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Calendar, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { POSTS } from '../_data';

export function generateStaticParams() {
  return POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS.find(p => p.slug === slug);
  if (!post) return { title: 'Articol negăsit' };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find(p => p.slug === slug);
  if (!post) notFound();

  const html = renderMarkdown(post.body);

  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: 'var(--bg-alt)' }}>
      <article className="max-w-2xl mx-auto px-4 sm:px-6">
        <Link href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold mb-6 transition-colors"
          style={{ color: 'var(--text-muted)' }}>
          <ChevronLeft className="w-4 h-4" />
          Toate articolele
        </Link>

        <div className="flex items-center gap-3 text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          <span className="font-bold tracking-widest uppercase" style={{ color: post.color }}>{post.category}</span>
          <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
          <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{post.readMin} min citit</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6" style={{ color: 'var(--text)' }}>
          {post.title}
        </h1>

        <div className="aspect-[16/8] flex items-center justify-center text-9xl mb-8 rounded-3xl"
          style={{ background: `linear-gradient(135deg, ${post.color}22, ${post.color}05)` }}>
          <span aria-hidden>{post.emoji}</span>
        </div>

        <div
          className="prose-sf"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-12 p-6 rounded-2xl text-center"
          style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
          <h3 className="text-xl font-extrabold mb-2" style={{ color: 'var(--text)' }}>Pune teoria în practică</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
            Cumpără un challenge cu €19 și începe să pickezi cu banii noștri.
          </p>
          <Link href="/planuri"
            className="inline-flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl"
            style={{ background: 'var(--red)', color: 'white', boxShadow: '0 8px 24px rgba(230,57,70,0.32)' }}>
            Vezi planurile →
          </Link>
        </div>
      </article>

      <style>{`
        .prose-sf { color: var(--text); font-size: 16px; line-height: 1.75; }
        .prose-sf h1 { font-size: 2rem; font-weight: 800; margin: 1.5em 0 0.5em; color: var(--text); }
        .prose-sf h2 { font-size: 1.5rem; font-weight: 800; margin: 1.5em 0 0.5em; color: var(--text); }
        .prose-sf h3 { font-size: 1.25rem; font-weight: 700; margin: 1.25em 0 0.4em; color: var(--text); }
        .prose-sf p { margin: 0.75em 0; color: var(--text-muted); }
        .prose-sf strong { color: var(--text); }
        .prose-sf a { color: var(--red); font-weight: 600; text-decoration: underline; text-underline-offset: 3px; }
        .prose-sf code { background: var(--bg-alt2); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 14px; }
        .prose-sf pre { background: var(--bg-alt2); padding: 16px; border-radius: 12px; overflow-x: auto; margin: 1em 0; }
        .prose-sf pre code { background: transparent; padding: 0; }
        .prose-sf table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .prose-sf th, .prose-sf td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; font-size: 14px; }
        .prose-sf th { background: var(--bg-alt2); font-weight: 700; }
        .prose-sf ul, .prose-sf ol { margin: 0.75em 0; padding-left: 1.5em; color: var(--text-muted); }
        .prose-sf li { margin: 0.3em 0; }
      `}</style>
    </main>
  );
}

// Minimal markdown→HTML for our static blog posts
function renderMarkdown(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let inCode = false;
  let inTable = false;
  let inList = false;

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = (s: string) =>
    s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  for (const line of lines) {
    if (line.startsWith('```')) {
      if (inCode) { out.push('</code></pre>'); inCode = false; }
      else { out.push('<pre><code>'); inCode = true; }
      continue;
    }
    if (inCode) { out.push(esc(line)); continue; }

    if (line.startsWith('| ')) {
      if (!inTable) { out.push('<table>'); inTable = true; }
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      if (cells.every(c => /^-+$/.test(c.replace(/:/g, '')))) continue;
      const tag = out[out.length - 1]?.includes('<table>') ? 'th' : 'td';
      out.push(`<tr>${cells.map(c => `<${tag}>${inline(esc(c))}</${tag}>`).join('')}</tr>`);
      continue;
    } else if (inTable) {
      out.push('</table>');
      inTable = false;
    }

    if (line.startsWith('- ')) {
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push(`<li>${inline(esc(line.slice(2)))}</li>`);
      continue;
    } else if (inList && line.trim() === '') {
      out.push('</ul>');
      inList = false;
      continue;
    }

    if (line.startsWith('### ')) out.push(`<h3>${inline(esc(line.slice(4)))}</h3>`);
    else if (line.startsWith('## ')) out.push(`<h2>${inline(esc(line.slice(3)))}</h2>`);
    else if (line.startsWith('# ')) out.push(`<h1>${inline(esc(line.slice(2)))}</h1>`);
    else if (line.trim()) out.push(`<p>${inline(esc(line))}</p>`);
  }
  if (inList) out.push('</ul>');
  if (inTable) out.push('</table>');
  if (inCode) out.push('</code></pre>');
  return out.join('\n');
}
