/** @type {import('tailwindcss').Config} */
module.exports = {
  // **IMPORTANTE**: Ajusta esta ruta para incluir todos tus archivos .tsx
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

