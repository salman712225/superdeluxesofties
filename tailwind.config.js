/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FFF9F2',
          200: '#FFF4E6', // Vanilla cream base
          300: '#FDECD2',
          400: '#F6DEC0',
          border: '#EED9C4',
        },
        chocolate: {
          DEFAULT: '#512D25',
          dark: '#3B1E17',
          darker: '#2E1610',
          light: '#724338',
          text: '#251714',
          muted: '#705D55',
        },
        strawberry: {
          DEFAULT: '#E51D35',
          hover: '#C9162C',
          light: '#FCE7EB',
          pink: '#F6B9C9',
        },
        mango: {
          DEFAULT: '#F5C85B',
          dark: '#DFAB33',
          light: '#FEF4DC',
        },
      },
      fontFamily: {
        display: ['Fredoka', 'Baloo 2', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'Inter', 'system-ui', 'sans-serif'],
        script: ['Dancing Script', 'Satisfy', 'cursive'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(81, 45, 37, 0.08), 0 2px 6px -1px rgba(81, 45, 37, 0.04)',
        'medium': '0 10px 30px -4px rgba(81, 45, 37, 0.12), 0 4px 10px -2px rgba(81, 45, 37, 0.06)',
        'floating': '0 20px 40px -10px rgba(81, 45, 37, 0.18)',
        'glow-red': '0 8px 25px -4px rgba(229, 29, 53, 0.35)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.75rem',
      },
      animation: {
        'float-slow': 'float 5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        },
      },
    },
  },
  plugins: [],
};
