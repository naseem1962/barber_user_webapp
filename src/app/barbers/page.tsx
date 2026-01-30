'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Barber {
  _id: string;
  name: string;
  shopName?: string;
  profileImage?: string;
  rating: number;
  totalReviews: number;
  skills: string[];
  services: Array<{ name: string; price: number; duration: number }>;
}

export default function BarbersPage() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const response = await api.get('/barbers/all');
      setBarbers(response.data.data?.barbers || []);
    } catch {
      toast.error('Failed to fetch barbers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-forest dark:text-gold-light">BarberApp</Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Find your barber</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">AI recommends best barber, time & wait — one-tap booking</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-[var(--text-muted)]">Loading barbers...</div>
        ) : barbers.length === 0 ? (
          <div className="text-center py-16 text-[var(--text-secondary)]">No barbers available yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map((barber) => (
              <Link
                key={barber._id}
                href={`/barbers/${barber._id}`}
                className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-brand-lg p-6 shadow-brand-md hover:shadow-brand-lg transition-shadow block"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-forest/10 dark:bg-gold/10 flex items-center justify-center text-lg font-semibold text-forest dark:text-gold shrink-0">
                    {barber.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)]">{barber.name}</h3>
                    {barber.shopName && (
                      <p className="text-sm text-[var(--text-secondary)]">{barber.shopName}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-amber-500">★</span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {(barber.rating || 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-[var(--text-muted)]">
                        ({barber.totalReviews ?? 0} reviews)
                      </span>
                    </div>
                    {barber.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {barber.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-forest/10 dark:bg-gold/10 text-forest dark:text-gold text-xs rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
