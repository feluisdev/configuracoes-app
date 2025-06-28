'use client';

import { SessionProvider as NextSessionProvider, SessionProviderProps } from 'next-auth/react';

export function SessionProvider(props: SessionProviderProps) {
  return (
    <NextSessionProvider {...props} refetchInterval={4 * 60}>
      {props.children}
    </NextSessionProvider>
  );
}
