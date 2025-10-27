/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0b132b',
          light: '#1c2541',
          dark: '#050a1a',
        },
        sky: {
          DEFAULT: '#a3d5ff',
          light: '#c5e5ff',
          dark: '#7bb8e8',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#f0d264',
          dark: '#b8941f',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'navy-lg': '0 10px 40px -10px rgba(11, 19, 43, 0.5)',
        'sky-glow': '0 0 20px rgba(163, 213, 255, 0.5)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.5)',
      },
      backgroundImage: {
        'gradient-navy-sky': 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #a3d5ff 100%)',
        'gradient-gold': 'linear-gradient(135deg, #d4af37 0%, #f0d264 100%)',
      },
    },
  },
  plugins: [],
};
