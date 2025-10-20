/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
    },
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        },
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0,0,0,0.04), 0 1px 3px 0 rgba(0,0,0,0.1)',
        elevate: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
      },
      borderRadius: {
        xl: '0.875rem',
      },
      backgroundImage: theme => ({
        'card-gradient': 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 100%)',
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
