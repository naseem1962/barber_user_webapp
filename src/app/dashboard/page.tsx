'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Appointment {
  _id: string;
  barber: { name: string; shopName?: string; profileImage?: string };
  service: { name: string; price: number };
  appointmentDate: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, _hasHydrated } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchAppointments();
  }, [_hasHydrated, isAuthenticated, router]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/user');
      setAppointments(response.data.data?.appointments || []);
    } catch {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  if (!_hasHydrated || !isAuthenticated || !user) return null;

  const upcoming = appointments.filter((a) => a.status === 'pending' || a.status === 'confirmed');

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-xl font-bold text-forest dark:text-gold-light">
              BarberApp
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <span className="text-sm text-[var(--text-secondary)] hidden sm:inline">Welcome, {user.name}</span>
              <button
                onClick={() => { logout(); router.push('/'); }}
                className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-brand-lg p-6 shadow-brand-md">
            <p className="text-sm font-medium text-[var(--text-muted)] mb-1">Loyalty points</p>
            <p className="text-2xl font-bold text-forest dark:text-gold-light">{user.loyaltyPoints ?? 0}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-brand-lg p-6 shadow-brand-md">
            <p className="text-sm font-medium text-[var(--text-muted)] mb-1">Level</p>
            <p className="text-2xl font-bold text-forest dark:text-gold-light capitalize">{user.loyaltyLevel || 'Bronze'}</p>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-brand-lg p-6 shadow-brand-md">
            <p className="text-sm font-medium text-[var(--text-muted)] mb-1">Upcoming</p>
            <p className="text-2xl font-bold text-forest dark:text-gold-light">{upcoming.length}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { href: '/barbers', icon: '🔍', title: 'Find barbers', desc: 'Browse & book' },
            { href: '/barbers', icon: '🤖', title: 'AI style', desc: 'Recommendations' },
            { href: '/barbers', icon: '📱', title: 'Try style', desc: 'Before you cut' },
            { href: '/chat', icon: '💬', title: 'Messages', desc: 'Chat with barbers' },
          ].map((a) => (
            <Link
              key={a.href + a.title}
              href={a.href}
              className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-brand-lg p-5 hover:shadow-brand-md transition-shadow"
            >
              <span className="text-2xl block mb-2">{a.icon}</span>
              <h3 className="font-semibold text-[var(--text-primary)]">{a.title}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>

        {/* Appointments */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-brand-lg shadow-brand-md overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">My appointments</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-[var(--text-muted)]">Loading...</div>
          ) : appointments.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              No appointments yet.{' '}
              <Link href="/barbers" className="text-forest dark:text-gold font-medium hover:underline">Book one</Link>
            </div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {appointments.map((apt) => (
                <li key={apt._id} className="px-6 py-4 hover:bg-[var(--bg-tertiary)]/50">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">{apt.barber.name}</h3>
                      {apt.barber.shopName && (
                        <p className="text-sm text-[var(--text-secondary)]">{apt.barber.shopName}</p>
                      )}
                      <p className="text-sm text-[var(--text-muted)] mt-1">
                        {apt.service.name} · ${apt.service.price}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {new Date(apt.appointmentDate).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : apt.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
