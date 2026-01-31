'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/ThemeToggle';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

interface Barber {
  _id: string;
  name: string;
  shopName?: string;
  shopAddress?: string;
  profileImage?: string;
  rating: number;
  totalReviews: number;
  skills: string[];
  services: Array<{ name: string; price: number; duration: number; description?: string }>;
  workingHours?: Array<{ day: string; startTime: string; endTime: string; isAvailable: boolean }>;
}

interface Slot {
  time: string;
  display: string;
}

const DAY_LABELS: Record<string, string> = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export default function BarberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { isAuthenticated } = useAuthStore();

  const [barber, setBarber] = useState<Barber | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingBarber, setLoadingBarber] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [selectedService, setSelectedService] = useState<Barber['services'][0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState('');
  const [bookSuccess, setBookSuccess] = useState(false);

  const fetchBarber = useCallback(async () => {
    setLoadingBarber(true);
    try {
      const res = await api.get(`/barbers/${id}`);
      if (res.data.success) setBarber(res.data.data.barber);
      else setBarber(null);
    } catch {
      toast.error('Barber not found');
      setBarber(null);
    } finally {
      setLoadingBarber(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchBarber();
  }, [id, fetchBarber]);

  useEffect(() => {
    if (!id || !selectedDate) {
      setSlots([]);
      return;
    }
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    setLoadingSlots(true);
    api
      .get('/appointments/availability', { params: { barberId: id, date: dateStr } })
      .then((res) => {
        if (res.data.success) setSlots(res.data.data?.slots || []);
        else setSlots([]);
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [id, selectedDate]);

  const handleBook = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/barbers/${id}`);
      return;
    }
    if (!selectedService || !selectedSlot || !barber) {
      toast.error('Please select service, date and time');
      return;
    }
    setBooking(true);
    try {
      const appointmentDate = new Date(selectedSlot.time);
      await api.post('/appointments', {
        barberId: barber._id,
        service: {
          name: selectedService.name,
          duration: selectedService.duration,
          price: selectedService.price,
        },
        appointmentDate: appointmentDate.toISOString(),
        notes: notes.trim() || undefined,
      });
      setBookSuccess(true);
      toast.success('Booking confirmed!');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error(msg || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  const dateOptions = Array.from({ length: 14 }, (_, i) => addDays(startOfDay(new Date()), i));

  if (loadingBarber) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <Link href="/barbers" className="text-xl font-bold text-forest dark:text-gold-light">BarberApp</Link>
            <ThemeToggle />
          </div>
        </nav>
        <div className="container mx-auto px-4 py-16 text-center text-[var(--text-muted)]">Loading barber...</div>
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <Link href="/barbers" className="text-xl font-bold text-forest dark:text-gold-light">BarberApp</Link>
            <ThemeToggle />
          </div>
        </nav>
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-[var(--text-secondary)] mb-4">Barber not found.</p>
          <Link href="/barbers" className="text-forest dark:text-gold font-medium hover:underline">Back to barbers</Link>
        </div>
      </div>
    );
  }

  if (bookSuccess) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur">
          <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <Link href="/barbers" className="text-xl font-bold text-forest dark:text-gold-light">BarberApp</Link>
            <ThemeToggle />
          </div>
        </nav>
        <div className="container mx-auto px-4 py-16 text-center max-w-md mx-auto">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Booking confirmed</h1>
            <p className="text-[var(--text-secondary)] text-sm mb-6">
              Your appointment with {barber.name} is set for {selectedDate && format(selectedDate, 'PPP')} at {selectedSlot?.display}.
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-6 py-3 bg-forest dark:bg-gold text-white font-medium rounded-lg hover:opacity-90"
            >
              View my appointments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/barbers" className="text-xl font-bold text-forest dark:text-gold-light">BarberApp</Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-forest/10 dark:bg-gold/10 flex items-center justify-center text-2xl font-semibold text-forest dark:text-gold shrink-0">
            {barber.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{barber.name}</h1>
            {barber.shopName && <p className="text-[var(--text-secondary)]">{barber.shopName}</p>}
            {barber.shopAddress && <p className="text-sm text-[var(--text-muted)]">{barber.shopAddress}</p>}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-amber-500">★</span>
              <span className="font-medium text-[var(--text-primary)]">{(barber.rating || 0).toFixed(1)}</span>
              <span className="text-sm text-[var(--text-muted)]">({barber.totalReviews ?? 0} reviews)</span>
            </div>
            {barber.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {barber.skills.map((s, i) => (
                  <span key={i} className="px-2 py-1 bg-forest/10 dark:bg-gold/10 text-forest dark:text-gold text-xs rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            )}
            {isAuthenticated && (
              <Link
                href={`/chat?barberId=${barber._id}`}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 border border-forest dark:border-gold text-forest dark:text-gold font-medium rounded-lg hover:bg-forest/5 dark:hover:bg-gold/10 transition-colors"
              >
                Message barber
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Services</h2>
              {!barber.services?.length ? (
                <p className="text-sm text-[var(--text-muted)]">No services listed.</p>
              ) : (
                <ul className="space-y-3">
                  {barber.services.map((svc, i) => (
                    <li key={i}>
                      <button
                        type="button"
                        onClick={() => setSelectedService(svc)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                          selectedService?.name === svc.name
                            ? 'border-forest dark:border-gold bg-forest/5 dark:bg-gold/10 text-forest dark:text-gold'
                            : 'border-[var(--border)] hover:bg-[var(--bg-tertiary)]'
                        }`}
                      >
                        <span className="font-medium text-[var(--text-primary)]">{svc.name}</span>
                        <span className="block text-sm text-[var(--text-muted)]">
                          {svc.duration} min · ${svc.price}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Date & time</h2>
              <p className="text-sm text-[var(--text-muted)] mb-3">Select a date</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {dateOptions.map((d) => {
                  const isSelected = selectedDate && format(d, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        isSelected
                          ? 'bg-forest dark:bg-gold text-white'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:opacity-90'
                      }`}
                    >
                      {format(d, 'EEE')} {format(d, 'd')}
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-2">Available times</p>
              {loadingSlots ? (
                <p className="text-sm text-[var(--text-muted)]">Loading slots...</p>
              ) : !selectedDate ? (
                <p className="text-sm text-[var(--text-muted)]">Pick a date first.</p>
              ) : slots.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)]">No slots available this day.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => {
                    const isSelected = selectedSlot?.time === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          isSelected
                            ? 'bg-forest dark:bg-gold text-white'
                            : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:opacity-90'
                        }`}
                      >
                        {slot.display}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special requests..."
                rows={2}
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] resize-none"
              />
            </section>

            <button
              type="button"
              onClick={handleBook}
              disabled={!selectedService || !selectedSlot || booking}
              className="w-full py-4 bg-forest dark:bg-gold text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {booking ? 'Booking...' : isAuthenticated ? 'Confirm booking' : 'Sign in to book'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
