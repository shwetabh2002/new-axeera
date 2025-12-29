import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0b',
};

export const metadata: Metadata = {
  title: 'Axeera | We craft digital experiences',
  description: 'We architect complex digital experiences with precision and purpose. Engineering systems that scale, perform, and inspire.',
  keywords: ['digital agency', 'web development', 'system design', 'UX', 'engineering'],
  authors: [{ name: 'Axeera' }],
  openGraph: {
    title: 'Axeera | Engineering Digital Systems',
    description: 'We architect complex digital experiences with precision and purpose.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Axeera',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axeera | Engineering Digital Systems',
    description: 'We architect complex digital experiences with precision and purpose.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="lenis">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
