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
      fontFamily: {
        'sans': ['"Share Tech"', 'sans-serif'],
        'share-tech': ['"Share Tech"', 'sans-serif'],
        'changa': ['Changa', 'sans-serif'],
      },
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
        modalEnter: {
          from: { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        notificationFadeInUp: {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'skeleton-loading': 'skeleton-loading 1.4s ease infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.8s ease-out forwards',
        'marquee': 'marquee 30s linear infinite',
        'modal-enter': 'modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'notification-fade-in-up': 'notificationFadeInUp 0.2s ease-out',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addUtilities, addComponents }) {
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
          fontFamily: "'Changa', 'Inter', sans-serif",
        },
        /* Global Scrollbar */
        '::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: 'theme("colors.zinc.100")',
          borderRadius: '9999px',
        },
        'html.dark ::-webkit-scrollbar-track': {
          backgroundColor: 'theme("colors.zinc.800")',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'theme("colors.zinc.300")',
          borderRadius: '9999px',
          borderWidth: '2px',
          borderColor: 'transparent',
          backgroundClip: 'content-box',
          transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '150ms',
        },
        'html.dark ::-webkit-scrollbar-thumb': {
          backgroundColor: 'theme("colors.zinc.600")',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'theme("colors.red.500")',
        },
      });

      addComponents({
        '.modal-overlay': {
          '@apply fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in': {},
        },
        '.modal-content': {
          '@apply relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter': {},
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(248, 113, 113, 0.4)', // red-400/40
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'theme("colors.red.500")',
        },
        '.notification-scrollbar::-webkit-scrollbar': {
          width: '6px',
        },
        '.notification-scrollbar::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '.notification-scrollbar::-webkit-scrollbar-thumb': {
          background: '#d4d4d8',
          borderRadius: '3px',
        },
        'html.dark .notification-scrollbar::-webkit-scrollbar-thumb': {
          background: '#3f3f46',
        },
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

