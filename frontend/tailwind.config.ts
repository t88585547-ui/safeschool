import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#F4F7F6',
          100: '#E6EEEC',
          200: '#C9D9D5',
          300: '#9BB5B0',
          400: '#6B8C87',
          500: '#3F6661',
          600: '#24524D',
          700: '#1A3F3B',
          800: '#142E2C',
          900: '#122826',
          950: '#0A1615',
        },
        primary: {
          DEFAULT: '#1A3F3B',
          50: '#F4F7F6',
          100: '#E6EEEC',
          200: '#C9D9D5',
          300: '#9BB5B0',
          400: '#6B8C87',
          500: '#3F6661',
          600: '#24524D',
          700: '#122826',
          800: '#142E2C',
          900: '#0A1615',
        },
        background: '#F6F7F6',
        surface: '#FFFFFF',
        border: '#D7E2DF',
        'text-primary': '#122826',
        'text-secondary': '#5C716D',
        alert: {
          critical: '#122826',
          warning: '#24524D',
          safe: '#1A3F3B',
        },
        command: {
          bg: '#0E1F1D',
          surface: 'rgba(18, 40, 38, 0.88)',
          border: 'rgba(201, 217, 213, 0.16)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'IBM Plex Sans Thai', 'sans-serif'],
        display: ['var(--font-display)', 'Noto Serif Thai', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(18, 40, 38, 0.04), 0 12px 32px rgba(18, 40, 38, 0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sos-pulse': 'sos-pulse 1.8s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        glow: 'glow 2s ease-in-out infinite',
        bob: 'bob 2s ease-in-out infinite',
      },
      keyframes: {
        'sos-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(18, 40, 38, 0.35)' },
          '50%': { boxShadow: '0 0 0 18px rgba(18, 40, 38, 0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
