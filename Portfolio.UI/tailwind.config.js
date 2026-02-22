/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/components/**/*.{html,ts}",
  ],
  theme: {
    extend: {
       colors: {
        primary: {
          DEFAULT: '#f20d0d', // Match the Stitch custom color
          foreground: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}
