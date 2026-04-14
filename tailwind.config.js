/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        surface: '#0a0a0a',
        surface2: '#111111',
        accentGreen: '#ffffff',
        accentBlue: '#ffffff',
        text: '#ffffff',
        muted: '#b3b3b3',
        danger: '#ffffff',
      },
      fontFamily: {
        heading: ['Syne', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '16px',
      },
      boxShadow: {
        card: '0 12px 30px rgba(0, 0, 0, 0.45)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.35)' },
        },
        slideGlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
        slideGlow: 'slideGlow 0.35s ease-out forwards',
      },
    },
  },
  plugins: [],
}

