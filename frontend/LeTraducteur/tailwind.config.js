/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: 'navy',
      },
      minHeight: { // This should be here, not under colors
        '80vh': '80vh',
      },
      fontFamily: {
        'permanent-marker': ['"Permanent Marker"', 'cursive'],
        'dosis': ['"Dosis"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
