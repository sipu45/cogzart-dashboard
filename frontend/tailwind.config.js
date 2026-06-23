/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef3ee",
          100: "#fde3d1",
          200: "#fbc3a3",
          300: "#f89a6b",
          400: "#f46830",
          500: "#f14d18",
          600: "#e2340d",
          700: "#bb240d",
          800: "#951f13",
          900: "#781d13",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
