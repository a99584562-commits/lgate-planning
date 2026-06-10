/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // тело — нейтральный гротеск с хорошей кириллицей
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        // заголовки — узкий индустриальный (эхо фирменного DIN у LG Seeds)
        display: ['Oswald', 'Inter', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#101813',
          700: '#2a3a30',
          500: '#5b6b60',
          400: '#8a978d',
          300: '#b8c2ba',
        },
        // Фирменный красный LG Seeds — primary акцент
        brand: {
          50: '#fff1f3',
          100: '#ffe0e5',
          200: '#ffc4cd',
          500: '#e3002d',
          600: '#c70028',
          700: '#a30021',
          900: '#5e0015',
        },
        // Зелёный — только для успеха/«сошлось»/«утверждено»
        leaf: {
          900: '#0c3d2a',
          800: '#0f5236',
          700: '#15603f',
          600: '#1a7a4f',
          500: '#22995f',
          100: '#e3f2e9',
          50: '#f1f8f4',
        },
        paper: '#f6f6f4',
        line: '#e6e4dc',
      },
    },
  },
  plugins: [],
}
