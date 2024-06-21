const { addDynamicIconSelectors } = require('@iconify/tailwind');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-dark' : '#6F4E37',
        'theme-medium' : '#A67B5B',
        'theme-semiLight' : '#ECB176',
        'theme-light' : '#FED8B1',
        'theme-extraLight' : '#efdbcdb4'
      },
      screens : {
        semiMd : "850px",
        miniMd : "700px",
        semiBase : "610px",
        semiSm : "510px",
        semiXs : "400px"
      },
      fontSize : {
        semiXs : "0.65rem",
        semiSm : "0.75rem",
        semiMd : "0.9rem"
      }
    },
  },
  plugins: [
    addDynamicIconSelectors(),
  ],
}

