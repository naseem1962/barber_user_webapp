/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        charcoal: '#1a1a1a',
        forest: {
          DEFAULT: '#0f2e1f',
          light: '#1a4d2e',
          dark: '#0a1f14',
        },
        gold: {
          DEFAULT: '#c9a227',
          light: '#d4af37',
          muted: '#b8860b',
        },
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#1a4d2e',
          600: '#0f2e1f',
          700: '#0a1f14',
          800: '#052010',
          900: '#021408',
        },
      },
      borderRadius: {
        'brand-sm': '8px',
        'brand-md': '10px',
        'brand-lg': '12px',
      },
      boxShadow: {
        'brand-sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'brand-md': '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
        'brand-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'brand-gold': '0 0 0 1px rgba(201, 162, 39, 0.2), 0 4px 12px rgba(201, 162, 39, 0.08)',
      },
    },
  },
  plugins: [],
};
