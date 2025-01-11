const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        greenLight: '#CCD5AE',
        greenPale: '#E9EDC9',
        cream: '#FEFAE0',
        peach: '#FAEDCD',
        orange: '#D4A373',
      },
      fontFamily: {
        funnel: ['Funnel Display', ...fontFamily.sans],
        noto: ['Noto Serif', ...fontFamily.serif],
      },
    },
  },
  plugins: [],
};