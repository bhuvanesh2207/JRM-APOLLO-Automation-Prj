/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1abc9c',
        secondary: '#ff9800',
      },
      boxShadow: {
        'login-card': '0 35px 70px rgba(50, 50, 93, 0.2), 0 15px 35px rgba(0,0,0,0.15)'
      }
    },
  },
  plugins: [],
};
