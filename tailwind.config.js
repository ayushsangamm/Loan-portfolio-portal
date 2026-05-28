/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom sleek brand colors - rich slate, professional corporate blues
        brand: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0dbe9',
          300: '#a6bcd8',
          400: '#7599c2',
          500: '#5079a8',
          600: '#3d5e87',
          700: '#324c6e',
          800: '#2a3f5a',
          900: '#26364b',
          950: '#192332',
        },
        accent: {
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          indigo: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.03)',
        'premium-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
