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
        'sans': ['var(--font-sans)'],
        'arabic': ['var(--font-arabic)'],
      },
      colors: {
        // Core theme colors using CSS variables
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        
        // Primary theme (red)
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        
        // Secondary theme (zinc)
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        
        // Muted theme (subtle backgrounds/text)
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        
        // Card theme
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        
        // Border theme
        border: 'hsl(var(--border))',
        
        // Destructive theme (for errors/destructive actions)
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        full: '9999px',
      },
      keyframes: {
        // Only keep animations that are actually used
        'skeleton-loading': {
          '0%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        modalEnter: {
          from: { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'skeleton-loading': 'skeleton-loading 1.4s ease infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'modal-enter': 'modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities }) {
      // ============================================
      // BASE STYLES - Essential global styles
      // ============================================
      addBase({
        // CSS Variables Integration
        '*': {
          borderColor: 'hsl(var(--border))',
        },
        'body': {
          color: 'hsl(var(--foreground))',
          fontFamily: 'var(--font-sans)',
          transition: 'background-color var(--duration-normal), color var(--duration-normal)',
          backgroundImage: `
            radial-gradient(circle, hsl(var(--grid-dot)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--background)), hsl(var(--background)))
          `,
          backgroundSize: '20px 20px, 100% 100%',
          backgroundPosition: '0 0, 0 0',
          backgroundAttachment: 'fixed, scroll',
        },
        
        // RTL Support
        '[dir="rtl"]': {
          fontFamily: 'var(--font-arabic)',
        },
        
        // Global Scrollbar Styles
        '::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '::-webkit-scrollbar-track': {
          backgroundColor: 'hsl(var(--muted))',
          borderRadius: '9999px',
        },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'hsl(var(--muted-foreground))',
          borderRadius: '9999px',
          border: '2px solid transparent',
          backgroundClip: 'content-box',
          transition: 'background-color var(--duration-fast)',
        },
        '::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'hsl(var(--primary))',
        },
        
        // Selection Styles
        '::selection': {
          backgroundColor: 'hsl(var(--primary) / 0.3)',
          color: 'hsl(var(--primary-foreground))',
        },
        
        // Focus Styles
        ':focus-visible': {
          outline: '2px solid hsl(var(--primary))',
          outlineOffset: '2px',
        },
      });

      // ============================================
      // COMPONENTS - Only essential component classes
      // ============================================
      addComponents({
        // Modal Components
        '.modal-overlay': {
          '@apply fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in': {},
        },
        '.modal-content': {
          '@apply relative bg-card text-card-foreground rounded-lg border border-border shadow-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-modal-enter': {},
        },
        
        // Card Component
        '.theme-card': {
          '@apply bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6': {},
        },
        
        // Button Component
        '.theme-button': {
          '@apply bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        
        // Button Secondary Variant
        '.theme-button-secondary': {
          '@apply bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border rounded-md px-4 py-2 font-medium transition-colors': {},
        },
        
        // Input Component
        '.theme-input': {
          '@apply bg-background text-foreground border border-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        
        // Badge Component
        '.theme-badge': {
          '@apply bg-secondary text-secondary-foreground border border-border rounded-full px-3 py-1 text-sm font-medium': {},
        },
        
        // Badge Primary Variant
        '.theme-badge-primary': {
          '@apply bg-primary text-primary-foreground border border-primary rounded-full px-3 py-1 text-sm font-medium': {},
        },
      });

      // ============================================
      // UTILITIES - Only essential utility classes
      // ============================================
      addUtilities({
        // Theme transition utilities
        '.animate-theme-transition': {
          transition: 'background-color var(--duration-normal), color var(--duration-normal), border-color var(--duration-normal)',
        },
        
        '.animate-theme-transition-colors': {
          transition: 'background-color var(--duration-normal), color var(--duration-normal), border-color var(--duration-normal), fill var(--duration-normal), stroke var(--duration-normal)',
        },
        
        // Skeleton Loading
        '.skeleton': {
          background: 'linear-gradient(90deg, hsl(var(--muted) / 0.4) 25%, hsl(var(--muted-foreground) / 0.5) 37%, hsl(var(--muted) / 0.4) 63%)',
          backgroundSize: '400% 100%',
          animation: 'skeleton-loading 1.4s ease infinite',
        },
        
        // Text gradient utility
        '.text-gradient-primary': {
          background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--primary) / 0.8))',
          backgroundClip: 'text',
          color: 'transparent',
        },
        
        // Glass effect utility
        '.glass-effect': {
          backgroundColor: 'hsl(var(--background) / 0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid hsl(var(--border) / 0.2)',
        },
      });
    }),
  ],
}