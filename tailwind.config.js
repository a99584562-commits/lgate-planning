/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        ink: {
          900: '#101813',
          700: '#2a3a30',
          500: '#5b6b60',
          400: '#8a978d',
          300: '#b8c2ba',
        },
        leaf: {
          900: '#0c3d2a',
          800: '#0f5236',
          700: '#15603f',
          600: '#1a7a4f',
          500: '#22995f',
          100: '#e3f2e9',
          50: '#f1f8f4',
        },
        paper: '#f7f6f2',
        line: '#e6e4dc',
      },
    },
  },
  plugins: [],
}
