/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(221, 83%, 58%)',
          light:   'hsl(221, 83%, 68%)',
          dark:    'hsl(221, 83%, 48%)',
        },
        income: {
          DEFAULT: 'hsl(142, 71%, 45%)',
          light:   'hsl(142, 71%, 55%)',
        },
        expense: {
          DEFAULT: 'hsl(0, 84%, 60%)',
          light:   'hsl(0, 84%, 70%)',
        },
        warning:  { DEFAULT: 'hsl(38, 92%, 55%)' },
        info:     { DEFAULT: 'hsl(199, 89%, 48%)' },
        violet:   { DEFAULT: 'hsl(262, 83%, 65%)' },
        sidebar:  {
          DEFAULT: 'hsl(222, 47%, 11%)',
          dark:    'hsl(222, 50%, 7%)',
        },
        dark: {
          bg:      'hsl(222, 47%, 8%)',
          card:    'hsl(222, 42%, 12%)',
          'card-hover': 'hsl(222, 40%, 15%)',
          border:  'hsl(222, 30%, 20%)',
          input:   'hsl(222, 40%, 15%)',
          secondary: 'hsl(222, 40%, 11%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        primary: '0 4px 20px hsla(221, 83%, 58%, 0.3)',
        income:  '0 4px 20px hsla(142, 71%, 45%, 0.25)',
        expense: '0 4px 20px hsla(0, 84%, 60%, 0.25)',
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeSlideDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        skeletonPulse: {
          '0%, 100%': { backgroundPosition: '200% center' },
          '50%':      { backgroundPosition: '-200% center' },
        },
      },
      animation: {
        'fade-in':         'fadeIn 200ms ease both',
        'fade-slide-up':   'fadeSlideUp 300ms cubic-bezier(0.4,0,0.2,1) both',
        'fade-slide-down': 'fadeSlideDown 200ms ease both',
        'scale-in':        'scaleIn 200ms ease both',
        'skeleton':        'skeletonPulse 1.8s ease-in-out infinite',
        'spin-fast':       'spin 0.6s linear infinite',
      },
    },
  },
  plugins: [],
};
