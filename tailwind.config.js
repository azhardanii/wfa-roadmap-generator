/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          50: '#F2F7F4',
          100: '#E1EFE8',
          200: '#C2DFD2',
          300: '#94C7B3',
          400: '#5FA88E',
          500: '#3D8C71',
          600: '#2A7058',
          700: '#215947',
          800: '#1B4739',
          900: '#163B30',
          950: '#0C221B',
        },
        moss: {
          50: '#f6f7f6',
          100: '#e3e8e5',
          200: '#c7d3cb',
          300: '#a3b7a9',
          400: '#7d9885',
          500: '#617d69',
          600: '#4c6352',
          700: '#3d4e41',
          800: '#334036',
          900: '#2c362f',
          950: '#161c18',
        },
        surface: {
          50: '#FAFCFB',
          100: '#F4F7F5',
          200: '#EAF0EC',
          300: '#DEE6E1',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(12, 34, 27, 0.05), 0 2px 6px -1px rgba(12, 34, 27, 0.03)',
        'card': '0 10px 30px -4px rgba(12, 34, 27, 0.06), 0 4px 10px -2px rgba(12, 34, 27, 0.03)',
        'float': '0 20px 40px -10px rgba(12, 34, 27, 0.12), 0 8px 16px -4px rgba(12, 34, 27, 0.06)',
        'glow': '0 0 25px -3px rgba(61, 140, 113, 0.25)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.88', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}

