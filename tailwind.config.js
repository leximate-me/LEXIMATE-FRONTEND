/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        opendyslexic: ['OpenDyslexic', 'sans-serif'],
      },
      letterSpacing: {
        'normal-wide': '0.1em', // Un espaciado ligeramente mayor
        'more-wide': '0.20em',  // Un valor recomendado
        'very-wide': '0.25em',  // El valor que ya tenías
      },
    },
  },
  daisyui: {  
    themes: [
      {
        mytheme: {
          primary: '#fef195', // Usando el color 'yellow'
          secondary: '#ff6b92', // Usando el color 'pink'
          accent: '#61cec3', // Usando el color 'teal'
          neutral: '#6b93d6', // Usando el color 'blue'
          'base-100': '#FCFCF8',
        },
      },
    ],
  },
  plugins: [daisyui],
};
