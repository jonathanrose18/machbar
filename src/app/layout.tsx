import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import type { Metadata, Viewport } from 'next';

import { Footer } from '@/presenter/components/footer';
import { cn } from '@/presenter/lib/utils';

import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  description:
    'A cleanly architected Todo application built with Next.js — demonstrating how to decouple business logic from frameworks, databases, and UI layers.',
  title: 'machbar - a cleanly architecured todo app',
};

export const viewport: Viewport = {
  initialScale: 1,
  themeColor: '#FFFFFF',
  width: 'device-width',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className='h-full overflow-hidden' lang='en' suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'h-screen overflow-y-auto tracking-tight antialiased dark:from-zinc-900 dark:to-zinc-900 dark:via-black dark:bg-linear-to-bl bg-linear-to-bl from-zinc-200 via-white to-zinc-200 '
        )}
      >
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <div className='flex min-h-screen w-full flex-col'>
            <div className='relative mx-auto w-full max-w-screen-sm flex-1 px-4 py-20'>{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
