/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0c4635",
        secondary: "#98ff9a",
        tertiary: "#4285f4",
        base: "#f7f7f7",
        green: {
          base: "#56bd64",
          bright: "#37e64f"
        },
        accent: "#edca11"
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
