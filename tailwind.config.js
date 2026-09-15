/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Roboto Condensed"', 'Roboto', 'sans-serif'],
        condensed: ['"Roboto Condensed"', 'Roboto', 'sans-serif'],
        heading: ['"Roboto Condensed"', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-onion': '0 0 25px -5px rgba(155, 32, 62, 0.25)',
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
      colors: {
        // Red Onion spectrum: deep purplish ruby, wine, velvety garnet
        onion: {
          50: '#FDF2F4',
          100: '#FCE7EB',
          200: '#F9D1D9',
          300: '#F3AAB8',
          400: '#E7738B',
          500: '#D54465',
          600: '#BC284B',
          700: '#9B1D3C', // Royal Red Onion
          800: '#811B35', // Deep Cabernet Wine
          900: '#6D1A30', // Rich Garnet
          950: '#3D0917', // Obsidian Red
        },
        // Papery dry onion skin / shallot bronze / champagne gold
        papery: {
          50: '#FDFBF7',
          100: '#F8F3EA',
          200: '#EFE3CE',
          300: '#E2CDA7',
          400: '#D2B079',
          500: '#BF9351',
          600: '#A3763A',
          700: '#835B2E',
          800: '#6B4928',
          900: '#583D23',
        },
        gold: {
          50: '#FDFCF7',
          100: '#FAF6E6',
          200: '#F4ECC7',
          300: '#ECDD9E',
          400: '#E0C76C',
          500: '#D4AF37', // Burnished Metallic Gold
          600: '#BA9227',
          700: '#946E1D',
          800: '#7A581C',
          900: '#67491C',
        },
      },
    },
  },
  plugins: [],
}
