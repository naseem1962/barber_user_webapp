import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'BarberApp — Premium AI-Powered Grooming',
  description: 'Book the best barbers, try styles with AI, and get personalized recommendations. Luxury grooming, one tap away.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased bg-[var(--bg-primary)] text-[var(--text-primary)]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
