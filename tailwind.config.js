/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#fbf7ed',
          100: '#f7edcf',
          200: '#eed99e',
          300: '#e5c56d',
          400: '#d4af37',
          500: '#c19a2e',
          600: '#a07d24',
          700: '#7d611c',
          800: '#5a4615',
          900: '#3d2f0e',
        },
        ember: {
          50: '#fef3ed',
          100: '#fde0cd',
          200: '#fbc59a',
          300: '#f79a5c',
          400: '#f5732e',
          500: '#e8551a',
          600: '#c43f12',
          700: '#9c2f10',
          800: '#742812',
          900: '#4f1c0d',
        },
        frost: {
          50: '#eef6fb',
          100: '#d3e9f5',
          200: '#a9d3eb',
          300: '#6fb5dc',
          400: '#3f93c8',
          500: '#2a76a8',
          600: '#1f5a85',
          700: '#1a4769',
          800: '#163a55',
          900: '#0f2940',
        },
        dark: {
          50: '#3a3a3e',
          100: '#2e2e32',
          200: '#252528',
          300: '#1e1e21',
          400: '#181819',
          500: '#131314',
          600: '#0f0f10',
          700: '#0c0c0d',
          800: '#080809',
          900: '#050506',
        },
      },
      backgroundImage: {
        'parchment': "linear-gradient(135deg, #2a2418 0%, #1a1612 100%)",
        'gold-gradient': "linear-gradient(135deg, #e5c56d 0%, #d4af37 50%, #a07d24 100%)",
        'ember-gradient': "linear-gradient(135deg, #f5732e 0%, #e8551a 50%, #c43f12 100%)",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
