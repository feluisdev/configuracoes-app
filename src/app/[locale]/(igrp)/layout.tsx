'use client';

import { useSession, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import { IGRPToaster } from '@igrp/igrp-framework-react-design-system';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { SidebarInset, SidebarProvider } from '@/features/igrp/components/ui/sidebar';
import { AppSidebar } from '@/features/igrp/components/app-sidebar';
import { Header } from '@/features/igrp/components/header';
import { ReactQueryProvider } from '@/features/igrp/providers/react-query-provider';

export default function LocaleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const defaultOpen = Cookies.get('sidebar_state') === 'true';
  const [hasMounted, setHasMounted] = useState(false);

  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      if (process.env.NODE_ENV === 'production') {
        const encodedPath = encodeURIComponent(pathname || '/');
        console.warn("Session is unauthenticated. Redirecting to login.");
        router.push(`/login?callbackUrl=${encodedPath}`);
      }
    },
  });

  const logoutPage = process.env.NEXT_PUBLIC_LOGOUT || '';

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      if (status === "loading") return;

      if (!session || session.error === "RefreshAccessTokenError") {
        console.warn("Invalid session or refresh error, signing out...");
        signOut({ callbackUrl: logoutPage });
      }
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.expiresAt) {
      const msUntilExpiry = session.expiresAt * 1000 - Date.now() - 1000;
      if (msUntilExpiry > 0) {
        const timeout = setTimeout(() => {
          console.warn("Access token expired. Signing out automatically.");
          signOut({ callbackUrl: "/login" });
        }, msUntilExpiry);

        return () => clearTimeout(timeout);
      } else {
        console.warn("Access token already expired. Signing out.");
        signOut({ callbackUrl: "/login" });
      }
    }
  }, [session]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const showBreadcrumbs = pathname !== `/${locale}`;

  return (
    <>
      <ReactQueryProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <SidebarInset>
            <Header showBreadcrumbs={showBreadcrumbs} />
            <main className='flex flex-col flex-1 px-6 lg:px-10 py-8'>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </ReactQueryProvider>
      <IGRPToaster richColors />
    </>
  );
}
