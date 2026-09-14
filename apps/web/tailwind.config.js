/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#070b14",
          900: "#0b1329",
          850: "#0f1a36",
          800: "#142144",
          750: "#1a2952",
          700: "#223568",
          600: "#2f4687",
          500: "#415ea6",
        },
        teal: {
          950: "#042f2e",
          900: "#134e4a",
          800: "#115e59",
          700: "#0f766e",
          600: "#0d9488",
          500: "#14b8a6",
          400: "#2dd4bf",
          300: "#5eead4",
          200: "#99f6e4",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        rose: {
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
      },
      boxShadow: {
        "glow-teal": "0 0 25px -5px rgba(45, 212, 191, 0.35)",
        "glow-rose": "0 0 25px -5px rgba(244, 63, 94, 0.35)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "card": "0 10px 30px -10px rgba(7, 11, 20, 0.8)",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.03)" },
        },
        "ripple": {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "ripple": "ripple 2.5s cubic-bezier(0, 0.2, 0.8, 1) infinite",
      },
    },
  },
  plugins: [],
};
