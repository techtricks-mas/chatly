/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        heading: "#11175D",
        para: "#C3C5D7",
        primary: "#051E34",
        themes: "#16A34D",
      },
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        opensans: ["Open Sans", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
};

