/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0F1B2D",
          light: "#16273F",
        },
        graphite: "#1C2430",
        steel: "#2E5077",
        gold: "#B08D57",
        surface: "#F7F8FA",
        border: "#E2E5EA",
      },
      fontFamily: {
        display: ["'Source Serif 4'", "serif"],
        sans: ["'IBM Plex Sans'", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
      },
    },
  },
  plugins: [],
};
