import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import KYCWidget from '@/components/KYCWidget';

export default async function KYCPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Verificare KYC</h1>
        <p className="text-white/40 mt-1">Verificare identitate obligatorie pentru retrageri</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
          <p className="text-yellow-400 text-sm">
            <strong>De ce este necesar KYC?</strong> Conform reglementărilor anti-spălare bani (AML), toți bettori finanțați trebuie să-și verifice identitatea înainte de prima retragere.
          </p>
        </div>
        <KYCWidget userId={user?.id ?? ''} />
      </div>
    </div>
  );
}
