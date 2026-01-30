'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function ThemeScript() {
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored === 'dark' || (!stored && prefersDark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeScript />
      {children}
      <Toaster position="top-right" toastOptions={{ className: 'rounded-brand-md' }} />
    </>
  );
}
