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
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(100px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-100px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
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
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
      // ============================================
      // BASE STYLES - Global element styles
      // ============================================
      addBase({
        // Light Mode Base
        'html.light body': {
          backgroundColor: '#f4f4f5',
          color: '#18181b',
        },
        'html.light nav': {
          backgroundColor: 'rgba(255, 255, 255, 0.92) !important',
          borderBottomColor: '#e4e4e7 !important',
          color: '#18181b',
        },
        
        // Light Mode Background Overrides (non-hover states only)
        'html.light .bg-zinc-950:not(:hover)': {
          backgroundColor: '#ffffff',
        },
        'html.light .bg-zinc-900:not(:hover)': {
          backgroundColor: '#f4f4f5',
        },
        'html.light .bg-zinc-900\\/40:not(:hover)': {
          backgroundColor: 'rgba(244, 244, 245, 0.4)',
        },
        'html.light .bg-zinc-900\\/50:not(:hover)': {
          backgroundColor: 'rgba(244, 244, 245, 0.5)',
        },
        
        // Light Mode Border Overrides (non-hover states only)
        'html.light .border-zinc-900:not(:hover)': {
          borderColor: '#d4d4d8',
        },
        'html.light .border-zinc-800:not(:hover):not(.hover\\:border-red-600)': {
          borderColor: '#e4e4e7',
        },
        
        // Light Mode Text Overrides
        'html.light .text-zinc-400:not(:hover):not(.group-hover\\:text-red-600)': {
          color: '#71717a',
        },
        'html.light .text-zinc-500:not(:hover)': {
          color: '#71717a',
        },
        'html.light .text-zinc-600:not(:hover)': {
          color: '#52525b',
        },
        'html.light .text-white:not(:hover):not(.group-hover\\:text-white)': {
          color: '#18181b',
        },
        
        // RTL Support
        '[dir="rtl"]': {
          fontFamily: "'Changa', 'Inter', sans-serif",
        },
        
        // Global Scrollbar Styles
        '::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: '#e4e4e7',
          borderRadius: '9999px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: '#a1a1aa',
          borderRadius: '9999px',
          border: '2px solid transparent',
          backgroundClip: 'content-box',
          transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#ef4444',
        },
        
        // Dark Mode Scrollbar
        'html.dark ::-webkit-scrollbar-track': {
          backgroundColor: '#27272a',
        },
        'html.dark ::-webkit-scrollbar-thumb': {
          backgroundColor: '#52525b',
        },
        
        // Dropdown Styles
        'select': {
          backgroundImage: 'none',
          cursor: 'pointer',
        },
        'select option': {
          padding: '12px 16px',
          backgroundColor: '#ffffff',
          color: '#18181b',
          fontWeight: '400',
          fontSize: '14px',
          lineHeight: '1.5',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        },
        'select option:hover': {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          fontWeight: '500',
        },
        'select option:checked, select option:focus': {
          backgroundColor: '#dc2626',
          color: '#ffffff',
          fontWeight: '600',
        },
        
        // Dark Mode Dropdown
        'html.dark select option': {
          backgroundColor: '#27272a',
          color: '#fafafa',
        },
        'html.dark select option:hover': {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
        },
        'html.dark select option:checked, html.dark select option:focus': {
          backgroundColor: '#dc2626',
          color: '#ffffff',
        },
        
        // Dropdown Scrollbar
        'select::-webkit-scrollbar': {
          width: '8px',
        },
        'select::-webkit-scrollbar-track': {
          background: '#f4f4f5',
          borderRadius: '4px',
        },
        'select::-webkit-scrollbar-thumb': {
          background: '#dc2626',
          borderRadius: '4px',
        },
        'select::-webkit-scrollbar-thumb:hover': {
          background: '#991b1b',
        },
        
        // Dark Mode Dropdown Scrollbar
        'html.dark select::-webkit-scrollbar-track': {
          background: '#27272a',
        },
      });

      // ============================================
      // COMPONENTS - Reusable component classes
      // ============================================
      addComponents({
        // Modal Components
        '.modal-overlay': {
          '@apply fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in': {},
        },
        '.modal-content': {
          '@apply relative bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter': {},
        },
        
        // Custom Scrollbar Component
        '.custom-scrollbar::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(248, 113, 113, 0.4)',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#ef4444',
        },
        
        // Notification Scrollbar Component
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

      // ============================================
      // UTILITIES - Helper classes
      // ============================================
      addUtilities({
        // Background Utilities
        '.bg-grid-white': {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' fill='%23fff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        },
        
        // Skeleton Loading
        '.skeleton': {
          background: 'linear-gradient(90deg, rgba(39,39,42,0.4) 25%, rgba(63,63,70,0.5) 37%, rgba(39,39,42,0.4) 63%)',
          backgroundSize: '400% 100%',
          animation: 'skeleton-loading 1.4s ease infinite',
        },
        'html.light .skeleton': {
          background: 'linear-gradient(90deg, rgba(228, 228, 231, 0.6) 25%, rgba(212, 212, 216, 0.8) 37%, rgba(228, 228, 231, 0.6) 63%)',
          backgroundSize: '400% 100%',
        },
      });
    }),
  ],
}

