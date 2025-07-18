/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "Arial", "sans-serif"],
      },
      animation: {
        'bounce-slow': 'bounce 2.5s infinite',
      },
    },
  },
  plugins: [],
}; 