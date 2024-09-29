/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#F8F40C',

          secondary: '#cccc03',

          accent: '#00c700',

          neutral: '#020f02',

          'base-100': '#FCFCF8',

          info: '#00fdff',

          success: '#36ba00',

          warning: '#d37700',

          error: '#ff3249',
        },
      },
    ],
  },
  plugins: [daisyui],
};
