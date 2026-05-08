import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as _createClient } from '@supabase/supabase-js';

/**
 * Browser-side Supabase client (used in client components).
 * IMPORTANT: uses @supabase/ssr's createBrowserClient so the auth session lands in
 * cookies — not localStorage — which lets the server-side `getUser()` calls in
 * route handlers and server components actually see the logged-in user.
 *
 * Previously this was a plain `@supabase/supabase-js` client that wrote to
 * localStorage. After login the cookies were never set, the server kept
 * thinking the user was anonymous, and `/dashboard` redirected straight back
 * to /autentificare/login — that bug.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Server-side Supabase client. Use in server components, route handlers, etc. */
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
            // Server components can't mutate cookies; safely ignore — middleware/route handlers will refresh.
          }
        },
      },
    }
  );
}

/** Privileged service-role client. Server-only — NEVER import from a client component. */
export function createAdminClient() {
  return _createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export const supabase = createClient;
export const supabaseAdmin = createAdminClient;
