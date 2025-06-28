'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarInset, SidebarProvider } from '@/features/igrp/components/ui/sidebar';
import { AppSidebar } from '@/features/igrp/components/app-sidebar';
import { Header } from '@/features/igrp/components/header';

interface MainLayoutProps {
  children: React.ReactNode;
  sidebarOpen?: boolean;
}

export function MainLayout({ sidebarOpen, children }: MainLayoutProps) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();

  const handleFetchError = useCallback(
    (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.status === 401) {
        router.push('/logout');
      }
    },
    [router],
  );

  useEffect(() => {
    window.addEventListener('fetchError', handleFetchError);
    return () => window.removeEventListener('fetchError', handleFetchError);
  }, [handleFetchError]);

  const showBreadcrumbs = pathname !== `/${locale}`;

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider
        defaultOpen={sidebarOpen}
        style={{ '--sidebar-width': 'calc(var(--spacing) * 58) ' } as React.CSSProperties}
      >
        <AppSidebar />
        <SidebarInset>
          <Header showBreadcrumbs={showBreadcrumbs} />
          <main className="flex flex-col flex-1 px-6 lg:px-10 py-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}
