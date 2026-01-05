/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Cherry Reds
        cherry: {
          ripe: '#C41E3A',
          dark: '#8B0000',
          bright: '#DC143C',
          light: '#FF6B6B',
          blush: '#FFB3BA',
        },
        // Stem & Leaf Greens
        stem: {
          DEFAULT: '#228B22',
          light: '#32CD32',
          dark: '#006400',
        },
        // Backgrounds - Cherry Tree at Night
        bark: {
          dark: '#1A0A0A',
          medium: '#2D1515',
          light: '#3D2020',
        },
        // Status Colors
        status: {
          ripe: '#C41E3A',
          growing: '#FFB347',
          picked: '#32CD32',
          rotten: '#4A0404',
        },
        // Accents
        cream: '#FFF8DC',
        gold: '#FFD700',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Nunito', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        accent: ['Pacifico', 'cursive'],
      },
      backgroundImage: {
        'cherry-gradient': 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
        'cherry-shine': 'linear-gradient(135deg, #FF6B6B 0%, #C41E3A 50%, #8B0000 100%)',
        'cherry-glow': 'radial-gradient(circle, #FF6B6B 0%, #C41E3A 70%)',
        'bark-gradient': 'linear-gradient(180deg, #1A0A0A 0%, #2D1515 50%, #1A0A0A 100%)',
      },
      boxShadow: {
        'cherry': '0 4px 14px 0 rgba(196, 30, 58, 0.39)',
        'cherry-lg': '0 10px 40px 0 rgba(196, 30, 58, 0.5)',
        'cherry-glow': '0 0 20px rgba(196, 30, 58, 0.6), 0 0 40px rgba(196, 30, 58, 0.4)',
        'inner-cherry': 'inset 0 2px 4px 0 rgba(139, 0, 0, 0.3)',
      },
      animation: {
        'cherry-bounce': 'cherry-bounce 0.5s ease-in-out',
        'stem-sway': 'stem-sway 3s ease-in-out infinite',
        'leaf-flutter': 'leaf-flutter 2s ease-in-out infinite',
        'ripeness-pulse': 'ripeness-pulse 2s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'juice-drip': 'juice-drip 1.5s ease-in-out infinite',
        'shine-sweep': 'shine-sweep 3s infinite',
        'fade-in': 'fade-in 0.4s ease-out forwards',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'count-up': 'count-up 2s ease-out forwards',
      },
      keyframes: {
        'cherry-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'stem-sway': {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '75%': { transform: 'rotate(-3deg)' },
        },
        'leaf-flutter': {
          '0%, 100%': { transform: 'rotate(-30deg) scale(1)' },
          '50%': { transform: 'rotate(-25deg) scale(1.05)' },
        },
        'ripeness-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px #C41E3A, 0 0 10px #C41E3A' },
          '50%': { boxShadow: '0 0 15px #C41E3A, 0 0 30px #C41E3A, 0 0 45px #FF6B6B' },
        },
        'heartbeat': {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.15)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.1)' },
          '60%': { transform: 'scale(1)' },
        },
        'juice-drip': {
          '0%': { height: '0', opacity: '0' },
          '50%': { height: '20px', opacity: '1' },
          '100%': { height: '0', opacity: '0', transform: 'translateY(30px)' },
        },
        'shine-sweep': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
