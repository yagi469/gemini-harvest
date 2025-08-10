'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { jaJP } from '@clerk/localizations';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      localization={jaJP}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder'}
    >
      {children}
    </ClerkProvider>
  );
}
