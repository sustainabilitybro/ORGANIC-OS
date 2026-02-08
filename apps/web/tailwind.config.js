/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Earthy, organic color palette for dark mode
        background: {
          primary: '#0a0f0d',      // Deep forest green-black
          secondary: '#141a16',    // Dark moss
          tertiary: '#1e2621',     // Sage dark
        },
        surface: {
          primary: '#1a221d',       // Dark surface
          secondary: '#242e29',     // Lighter surface
          elevated: '#2d3a35',      // Elevated card
        },
        accent: {
          primary: '#7cb398',      // Sage green
          secondary: '#a8d4c0',   // Light mint
          tertiary: '#5a8f74',     // Forest accent
          warm: '#d4a574',         // Earthy warm
        },
        text: {
          primary: '#e8ede9',      // Off-white
          secondary: '#a3b3ab',    // Muted green-grey
          muted: '#6b7c74',        // Very muted
        },
        status: {
          success: '#7cb398',
          warning: '#d4a574',
          error: '#c97b7b',
          info: '#7ba3c9',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
