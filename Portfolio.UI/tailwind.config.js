/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./src/components/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f20d0d',
          foreground: '#ffffff',
        },
      },
      keyframes: {
        'skeleton-loading': {
          '0%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-250px * 5))' },
        },
      },
      animation: {
        'skeleton-loading': 'skeleton-loading 1.4s ease infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.8s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addUtilities }) {
      addBase({
        'html.light body': {
          backgroundColor: '#f4f4f5',
          color: '#18181b',
        },
        'html.light nav': {
          backgroundColor: 'rgba(255, 255, 255, 0.92) !important',
          borderBottomColor: '#e4e4e7 !important',
          color: '#18181b',
        },
        '[dir="rtl"]': {
          fontFamily: "'Tajawal', 'Inter', sans-serif",
        }
      });

      addUtilities({
        '.bg-grid-white': {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        },
        '.skeleton': {
          background: 'linear-gradient(90deg, rgba(39,39,42,0.4) 25%, rgba(63,63,70,0.5) 37%, rgba(39,39,42,0.4) 63%)',
          backgroundSize: '400% 100%',
          animation: 'skeleton-loading 1.4s ease infinite',
        },
        'html.light .skeleton': {
          background: 'linear-gradient(90deg, rgba(228, 228, 231, 0.6) 25%, rgba(212, 212, 216, 0.8) 37%, rgba(228, 228, 231, 0.6) 63%) !important',
          backgroundSize: '400% 100% !important',
        },
        // Direct Light Mode Overrides for utility classes to replace the hardcoded CSS in styles.css
        'html.light .bg-zinc-950, html.light .bg-zinc-950\\/40, html.light .bg-zinc-950\\/80': {
          backgroundColor: '#ffffff !important',
        },
        'html.light .bg-zinc-900, html.light .bg-zinc-900\\/40, html.light .bg-zinc-900\\/50, html.light .bg-zinc-900\\/60': {
          backgroundColor: '#f4f4f5 !important',
        },
        'html.light .border-zinc-900, html.light .border-zinc-800': {
          borderColor: '#d4d4d8 !important',
        },
        'html.light .text-zinc-400': {
          color: '#52525b !important',
        },
        'html.light .text-zinc-500': {
          color: '#71717a !important',
        },
        'html.light .text-zinc-600': {
          color: '#52525b !important',
        },
        'html.light .text-white': {
          color: '#18181b !important',
        },
      });
    }),
  ],
}

