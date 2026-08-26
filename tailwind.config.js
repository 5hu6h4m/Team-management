/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#080808',
          surface: '#111111',
          card: '#151515',
          cardHover: '#1a1a1a',
          border: '#252525',
          borderLight: '#333333',
        },
        red: {
          ecell: '#B11226',
          bright: '#D61F36',
          dark: '#850C1B',
          glow: 'rgba(177, 18, 38, 0.15)',
        },
        zinc: {
          850: '#1e1e24',
          950: '#0c0c0e',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'drawer': '-10px 0 30px rgba(0, 0, 0, 0.8)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.4)',
        'red-glow': '0 0 20px rgba(214, 31, 54, 0.25)',
      }
    },
  },
  plugins: [],
}
