/**
 * Admin guard. A user is admin if their Supabase email is in `ADMIN_EMAILS`
 * (comma-separated). Keep this list short and ideally use a separate auth strategy
 * for production (Supabase RLS or a dedicated `is_admin` flag on the user row).
 */
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function requireAdmin() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const allowed = (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? '')
    .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

  if (!allowed.includes(user.email.toLowerCase())) return null;
  return user;
}
