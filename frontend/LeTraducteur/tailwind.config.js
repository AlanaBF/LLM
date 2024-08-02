/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      colors: {
        navy: 'navy',
      },
      fontFamily: {
        'permanent-marker': ['"Permanent Marker"', 'cursive'],
        'dosis': ['"Dosis"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

