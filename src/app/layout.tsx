import type { Metadata } from 'next';
import { Manrope, Lexend, Libre_Baskerville } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { MeshBackground } from '@/components/MeshBackground';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const lexend = Lexend({
  variable: '--font-lexend',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const baskerville = Libre_Baskerville({
  variable: '--font-baskerville',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Lingoura AI — AI-Powered English Fluency Platform',
    template: '%s | Lingoura AI',
  },
  description:
    'Master English fluency with AI-powered speaking, listening, reading, and writing practice. Tailored IELTS preparation.',
  icons: {
    icon: [
      { url: '/logo-icon.png?v=3', type: 'image/png' },
      { url: '/logo-icon.png?v=3', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/logo-icon.png?v=3',
    apple: '/logo-icon.png?v=3',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${lexend.variable} ${baskerville.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface transition-colors duration-300">
        <Providers>
          <MeshBackground />
          {children}
        </Providers>
      </body>
    </html>
  );
}
