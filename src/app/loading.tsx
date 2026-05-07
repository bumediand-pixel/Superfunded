export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4"
            style={{ borderColor: 'var(--red-soft, #fde8ea)', borderTopColor: 'var(--red)', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          Se încarcă...
        </span>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}
