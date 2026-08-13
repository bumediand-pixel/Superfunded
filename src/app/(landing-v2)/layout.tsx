import type { ReactNode } from 'react';

// Minimal layout for the landing-v2 route group: no Nav/Footer inheritance from
// the (marketing) group, since the new landing renders its own dark header/footer.
export default function LandingV2Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
