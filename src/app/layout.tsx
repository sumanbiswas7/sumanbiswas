import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, DM_Sans, DM_Mono } from 'next/font/google';
import '@/styles/globals.scss';
import { GameProvider } from '@/context/GameContext';
import GameTerminal from '@/components/GameTerminal/GameTerminal';

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800'],
  variable: '--font-bricolage',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'Suman Biswas — Fullstack Engineer',
  description: 'Fullstack Engineer building modern, impactful products. TypeScript is my main tool, but I use whatever fits best. Outside of code — football, photography, and the mountains. Real Madrid is part of who I am. Based in India.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <GameProvider>
          {children}
          <GameTerminal />
        </GameProvider>
      </body>
    </html>
  );
}
