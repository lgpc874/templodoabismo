/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cinzel': ['Cinzel Decorative', 'serif'],
        'garamond': ['EB Garamond', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            opacity: '0.8',
            filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))',
          },
          '50%': { 
            opacity: '1',
            filter: 'drop-shadow(0 0 30px rgba(251, 191, 36, 0.8))',
          },
        },
      },
    },
  },
  plugins: [],
}