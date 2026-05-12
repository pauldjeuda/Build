/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        /* ── Page background ── */
        canvas:    '#F1F5F9',
        parchment: '#F8FAFC',

        /* ── Brand accent (blue) ── */
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },

        /* ── "gold" remapped → blue (backward compat for page files) ── */
        gold: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
        },

        /* ── Neutrals (slate) ── */
        obsidian: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
      },
      borderRadius: {
        '2xl': '0.75rem',
        '3xl': '1rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'xs':         '0 1px 2px 0 rgba(0,0,0,0.05)',
        'sm':         '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card':       '0 1px 3px 0 rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.05)',
        'modal':      '0 20px 48px -8px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
        'topbar':     '0 1px 0 0 #E2E8F0',
        'sidebar':    '1px 0 0 0 #E2E8F0',
        'btn':        '0 1px 2px 0 rgba(0,0,0,0.08)',
        'btn-hover':  '0 2px 6px 0 rgba(37,99,235,0.25)',
        /* keep legacy names */
        'gold':       '0 4px 12px 0 rgba(37,99,235,0.22)',
      },
      animation: {
        'fade-in':   'fadeIn 0.15s ease-out both',
        'slide-up':  'slideUp 0.2s cubic-bezier(0.16,1,0.3,1) both',
        'slide-left':'slideLeft 0.22s cubic-bezier(0.16,1,0.3,1) both',
        'slide-down':'slideDown 0.2s cubic-bezier(0.16,1,0.3,1) both',
        'shimmer':   'shimmer 1.6s infinite linear',
        'count-up':  'countUp 0.5s ease-out both',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' },                                 to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(10px)' },  to: { opacity: '1', transform: 'translateY(0)' } },
        slideLeft: { from: { opacity: '0', transform: 'translateX(-16px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        countUp:   { from: { opacity: '0', transform: 'translateY(6px)' },   to: { opacity: '1', transform: 'translateY(0)' } },
        pulseDot:  { '0%, 100%': { opacity: '1', transform: 'scale(1)' },    '50%': { opacity: '0.5', transform: 'scale(1.5)' } },
      },
    },
  },
  plugins: [],
};
