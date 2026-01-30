'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/ThemeToggle';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await api.post('/users/login', data);
      const { user, token } = response.data.data;
      setAuth(user, token);
      toast.success('Login successful!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-brand-lg shadow-brand-lg p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-xl font-bold text-forest dark:text-gold-light">BarberApp</Link>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-6 mb-2">Welcome back</h1>
            <p className="text-sm text-[var(--text-secondary)]">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-brand-md text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-forest/50 dark:focus:ring-gold/50"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Password</label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-brand-md text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-forest/50 dark:focus:ring-gold/50"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-forest dark:bg-gold text-white font-semibold rounded-brand-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-forest dark:text-gold font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
