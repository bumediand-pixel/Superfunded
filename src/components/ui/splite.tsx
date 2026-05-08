'use client';
import { Suspense, lazy, Component, ReactNode, useEffect, useState } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

/**
 * Hook returns true on viewports that should render the heavy 3D scene.
 * Below 1024px we keep the cheap CSS fallback to save ~500KB JS + ~30 fps GPU draws on mobile.
 */
function useDesktop(): boolean {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    setDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return desktop;
}

interface SplineSceneProps {
  scene: string;
  className?: string;
}

class SplineErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() { return { error: true }; }
  render() { return this.state.error ? this.props.fallback : this.props.children; }
}

function SplineFallback({ className }: { className?: string }) {
  return (
    <div className={`${className ?? ''} flex items-center justify-center relative`}>
      {/* Decorative orb stack */}
      <div className="relative w-72 h-72">
        <div className="absolute inset-0 rounded-full opacity-20 animate-pulse"
          style={{ background: 'radial-gradient(circle, #E63946 0%, transparent 70%)' }} />
        <div className="absolute inset-8 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #C9A84C 0%, transparent 60%)', animation: 'pulse 3s ease-in-out infinite 0.5s' }} />
        <div className="absolute inset-16 rounded-full border"
          style={{ borderColor: 'rgba(201,168,76,0.3)', animation: 'spin 12s linear infinite' }} />
        <div className="absolute inset-20 rounded-full border"
          style={{ borderColor: 'rgba(230,57,70,0.2)', animation: 'spin 8s linear infinite reverse' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-bodoni text-6xl font-bold" style={{ color: 'var(--gold)', textShadow: '0 0 40px rgba(201,168,76,0.4)' }}>
            SF
          </div>
        </div>
      </div>
    </div>
  );
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const desktop = useDesktop();
  const fallback = <SplineFallback className={className} />;

  // Mobile / reduced-motion → render the static CSS fallback only.
  if (!desktop) return fallback;

  return (
    <SplineErrorBoundary fallback={fallback}>
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Spline scene={scene} className={className} />
      </Suspense>
    </SplineErrorBoundary>
  );
}
