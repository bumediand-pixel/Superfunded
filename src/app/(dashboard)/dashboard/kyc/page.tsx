import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import KYCWidget from '@/components/KYCWidget';
import { ShieldCheck } from 'lucide-react';

export default async function KYCPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* */ }
        },
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Verificare identitate</h1>
        <p className="text-white/40 text-sm mt-1">Necesar pentru retragerea profiturilor</p>
      </div>

      <div className="rounded-xl p-4 mb-6 flex gap-3"
        style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
        <ShieldCheck className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-yellow-200 font-bold mb-1">De ce KYC?</p>
          <p className="text-white/70 leading-relaxed">
            Conform reglementărilor anti-spălare bani (Legea 129/2019, FATF), trebuie să-ți verificăm identitatea înainte de prima retragere. Procesul durează 2-3 minute.
          </p>
        </div>
      </div>

      <KYCWidget userId={user?.id ?? ''} />
    </div>
  );
}
