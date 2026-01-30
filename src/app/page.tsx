'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-forest dark:text-gold-light">BarberApp</span>
              <span className="text-xs font-medium text-[var(--text-muted)] hidden sm:inline">Premium Grooming</span>
            </Link>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Link
                href="/login"
                className="px-4 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:text-forest dark:hover:text-gold transition-colors rounded-brand-md"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 bg-forest dark:bg-gold text-white font-medium text-sm rounded-brand-md hover:opacity-90 transition-opacity shadow-brand-md"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="container mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <p className="text-sm font-medium tracking-wide text-gold dark:text-gold-light uppercase mb-4">AI-Powered Grooming</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
            Your Perfect Cut,
            <br />
            <span className="text-forest dark:text-gold-light">One Tap Away</span>
          </h1>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
            Try before you cut with AR, book instantly with smart suggestions, and get personalized hair care — all in one premium app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-forest dark:bg-gold text-white font-semibold rounded-brand-lg hover:opacity-90 transition-opacity shadow-brand-lg"
            >
              Get Started
            </Link>
            <Link
              href="/barbers"
              className="px-8 py-4 border-2 border-forest dark:border-gold text-forest dark:text-gold font-semibold rounded-brand-lg hover:bg-forest/5 dark:hover:bg-gold/10 transition-colors"
            >
              Browse Barbers
            </Link>
          </div>
        </div>

        {/* Try Before You Cut */}
        <section className="mt-24 sm:mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4">Try Before You Cut</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Live face preview for hairstyles, beard styles, and hair color. See the result before you book — then share your look.
              </p>
              <ul className="space-y-3 text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  Before/After slider
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  Social share
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                  Save favorite styles
                </li>
              </ul>
              <Link
                href="/register"
                className="inline-block mt-6 px-6 py-3 bg-forest/10 dark:bg-gold/10 text-forest dark:text-gold font-medium rounded-brand-md hover:bg-forest/20 dark:hover:bg-gold/20 transition-colors"
              >
                Try it free →
              </Link>
            </div>
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-brand-lg p-8 shadow-brand-lg aspect-[4/3] flex items-center justify-center">
              <div className="text-center text-[var(--text-muted)]">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-4xl">👤</div>
                <p className="text-sm">AR preview placeholder</p>
                <p className="text-xs mt-1">Upload a selfie to see your new look</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {[
            { title: 'One-Tap Booking', desc: 'AI recommends best barber, time, and shows wait time. Book in seconds.', icon: '⚡' },
            { title: 'Hair Growth & Care AI', desc: 'Personalized tips, product recommendations, and optional progress selfies.', icon: '🌿' },
            { title: 'Loyalty & VIP', desc: 'Style streaks, VIP levels, birthday rewards. Get more every visit.', icon: '⭐' },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-brand-lg p-6 sm:p-8 shadow-brand-md hover:shadow-brand-lg transition-shadow"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="mt-24 text-center py-16 px-6 bg-forest/5 dark:bg-gold/5 border border-[var(--border)] rounded-brand-lg">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Ready for a premium cut?</h2>
          <p className="text-[var(--text-secondary)] mb-6">Join thousands of customers who book smarter.</p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-forest dark:bg-gold text-white font-semibold rounded-brand-lg hover:opacity-90 transition-opacity"
          >
            Create free account
          </Link>
        </section>
      </main>
    </div>
  );
}
