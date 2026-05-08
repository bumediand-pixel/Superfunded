/**
 * Browser-side Supabase client only. Server-side helpers live in
 * `@/lib/supabase-server` so we don't accidentally pull `next/headers` into a
 * client bundle (Turbopack refuses to compile that mix).
 *
 * History: this used to be `@supabase/supabase-js` which writes the session to
 * localStorage. The dashboard uses `@supabase/ssr`'s server client which reads
 * cookies, so logging in succeeded but `/dashboard` immediately bounced back
 * to /autentificare/login because the server saw an anonymous request.
 * Switching to `createBrowserClient` puts the session in cookies — server side
 * sees it, redirect works, sessions persist across reloads.
 */
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const supabase = createClient;
