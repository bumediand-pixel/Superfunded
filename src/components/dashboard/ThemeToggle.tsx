'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'dark' | 'light';
const STORAGE_KEY = 'sf-dash-theme';

function applyTheme(t: Theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', t);
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    try {
      const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? null;
      if (stored === 'dark' || stored === 'light') {
        setTheme(stored);
        applyTheme(stored);
      }
    } catch { /* localStorage blocked */ }
  }, []);

  const flip = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* blocked */ }
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={isDark ? 'Comută la temă deschisă' : 'Comută la temă întunecată'}
      title={isDark ? 'Comută la temă deschisă' : 'Comută la temă întunecată'}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg cursor-pointer transition-colors"
      style={{
        background: 'var(--dash-input-bg, rgba(255,255,255,0.04))',
        border: '1px solid var(--dash-border, rgba(255,255,255,0.08))',
        color: 'var(--dash-text, #fff)',
      }}>
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
