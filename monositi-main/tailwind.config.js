/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // adjust according to your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        mrdafoe: ['"Mr Dafoe"', 'cursive'],
      },
      colors: {
        theme: {
          primary: "#D70000",
          secondary: "#E9E6A4",
        },
      },
    },
  },
  plugins: [],
}

