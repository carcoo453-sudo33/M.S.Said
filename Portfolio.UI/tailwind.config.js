/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
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
      },
      animation: {
        'skeleton-loading': 'skeleton-loading 1.4s ease infinite',
      },
    },
  },
  plugins: [
    plugin(function ({ addBase, addUtilities }) {
      // CSS custom properties on :root
      addBase({
        ':root': {
          '--foreground-rgb': '255, 255, 255',
          '--background-start-rgb': '0, 0, 0',
          '--background-end-rgb': '0, 0, 0',
        },
      });

      // .skeleton utility
      addUtilities({
        '.skeleton': {
          background:
            'linear-gradient(90deg, rgba(39,39,42,0.4) 25%, rgba(63,63,70,0.5) 37%, rgba(39,39,42,0.4) 63%)',
          backgroundSize: '400% 100%',
          animation: 'skeleton-loading 1.4s ease infinite',
        },
      });
    }),
  ],
}

