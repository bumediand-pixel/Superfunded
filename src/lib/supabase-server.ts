/**
 * Server-side Supabase clients. NEVER import this from a client component.
 *
 * - createServerSupabase() → standard server-side client; reads/writes cookies
 *   via Next.js's `cookies()`. Use in server components, route handlers,
 *   and proxy.ts.
 * - createAdminClient() → privileged service-role client. Bypasses RLS. Only
 *   use when you genuinely need admin powers and have validated the request
 *   came from an authorized source.
 */
import { createServerClient } from '@supabase/ssr';
import { createClient as _createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server components can't mutate cookies; safely ignore — proxy/route
            // handlers will refresh on next request.
          }
        },
      },
    }
  );
}

export function createAdminClient() {
  return _createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export const supabaseAdmin = createAdminClient;
