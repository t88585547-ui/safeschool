import type { Metadata } from 'next';
import { IBM_Plex_Sans_Thai, Noto_Serif_Thai } from 'next/font/google';
import './globals.css';

const sans = IBM_Plex_Sans_Thai({
  subsets: ['latin', 'thai'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Noto_Serif_Thai({
  subsets: ['latin', 'thai'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SafeSchool | แจ้งเหตุและติดตามความปลอดภัยในโรงเรียน',
  description:
    'ระบบแจ้งเหตุ จุดเสี่ยง และติดตามการแก้ไขภายในสถานศึกษา ใช้งานได้ทั้งนักเรียน ครู และเจ้าหน้าที่',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen bg-background font-sans text-ink-900 antialiased selection:bg-ink-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
