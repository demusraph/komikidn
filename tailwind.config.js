/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        komik: {
          bg: '#161616',
          darker: '#111111',
          card: '#222222',
          cardHover: '#2a2a2a',
          border: '#2d2d2d',
          borderLight: '#383838',
          blue: '#0084ff',
          blueHover: '#0070db',
          blueLight: '#00a2ff',
          text: '#ffffff',
          muted: '#8e8e8e',
          subtext: '#b3b3b3',
          badgeRed: '#e53e3e',
          badgeGreen: '#38a169',
          badgeOrange: '#dd6b20',
          badgePurple: '#805ad5',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
