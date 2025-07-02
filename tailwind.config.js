/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Pretendard',
          'ui-sans-serif',
          'system-ui',
          'Apple SD Gothic Neo',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}

