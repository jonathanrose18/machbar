import { Geist } from 'next/font/google';

import './globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} antialiased p-4`}>{children}</body>
    </html>
  );
}
