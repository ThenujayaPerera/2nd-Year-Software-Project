/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2596be",
        secondary: "#1a6d8a",
        accent: "#b32b95",
        koko: "#00d1b2",
        success: "#22c55e",
        warning: "#ffd932",
        error: "#dc2626",
        light: "#f8fafc",
        dark: "#0f172a",
      },
      boxShadow: {
        'card': '0 2px 8px rgba(37, 150, 190, 0.1)',
        'hover': '0 8px 24px rgba(37, 150, 190, 0.2)',
        'glow': '0 0 40px rgba(37, 150, 190, 0.25)',
      },
      fontFamily: {
        sans: ['Poppins', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
