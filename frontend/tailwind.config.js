import scrollbarHide from 'tailwind-scrollbar-hide';


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
        brand: {
          red: "#E10600",
          blue: "#38A9FF",
          blueLight : "rgba(56, 169, 255, 0.25)",
          redLight: "#FFE7E7",
          greenLight: "#E8FFF6",
          gray: "#6B7280",
          dark: "#111827",
          border: "#D1D5DB",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
        innerSm: "3px 1px 7.5px 3px rgba(0,0,0,0.25)",
      },
      borderRadius: {
        xl: "0.75rem",
      },
    },
  },
   plugins: [scrollbarHide],

}

