import '@/assets/globals.css';

import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getLocale, getMessages, setRequestLocale } from 'next-intl/server';
import { serverSession } from '@/actions/(igrp)/auth';
import { ActiveThemeProvider } from '@/features/igrp/providers/active-theme';
import { ThemeProvider } from '@/features/igrp/providers/theme-provider';
import { SessionProvider } from '@/features/igrp/providers/session-provider';
import { routing } from '@/i18n/routing';
import { META_THEME_COLORS } from '@/hooks/use-meta-color';
import { fontVariables } from '@/lib/fonts';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'IGRP',
  description: 'IGRP',
  icons: { icon: '/igrp/logo-no-text.png' },
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  let session

  if (process.env.NODE_ENV === 'production') {
    try {
      session = await serverSession()
    } catch (error) {
      console.error("Failed to get session in layout:", error)
      session = null
    }
  } else {
    session = null
  }

  return (
    <html lang={locale} suppressHydrationWarning>      
      <body
        className={cn(
          'bg-background overscroll-none h-screen font-sans antialiased',
          activeThemeValue && `theme-${activeThemeValue}`,
          isScaled && 'theme-scaled',
          fontVariables,
        )}
      >
        <SessionProvider session={session}>
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              enableColorScheme
            >
              <ActiveThemeProvider initialTheme={activeThemeValue}>
                {children}
              </ActiveThemeProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
