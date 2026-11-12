/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        cartoon: ['"Titan One"', 'Fredoka', 'cursive', 'sans-serif'],
        display: ['Fredoka', 'cursive', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: { ink: '#1e1b4b' },
      borderWidth: { 3: '3px' },
    },
  },
  plugins: [],
};
