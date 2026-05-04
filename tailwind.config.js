/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fe',
          300: '#a5bbfc',
          400: '#8196f8',
          500: '#6272f3',
          600: '#4c52e7',
          700: '#3f41cc',
          800: '#3438a4',
          900: '#2f3582',
          950: '#1c1f4d',
        },
        film: {
          500: '#e85d4a',
          600: '#d44a37',
        },
        music: {
          500: '#48bb9a',
          600: '#38a882',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
