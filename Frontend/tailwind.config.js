/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors from CLAUDE.md specification
        background: '#FAFAFA',
        'user-bubble': '#3B82F6', // blue-500
        'bot-bubble': '#F3F4F6', // gray-100
        text: '#111827', // gray-900
      },
      fontFamily: {
        'sans': ['system-ui', 'sans-serif'],
      },
      maxWidth: {
        'chat': '800px', // Custom max-width for chat container
      }
    },
  },
  plugins: [],
}