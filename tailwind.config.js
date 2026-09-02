/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        shopify: {
          canvas: '#000000',
          'canvas-elevated': '#0a0e17',
          surface: '#131b26',
          'surface-hover': '#1b2636',
          'surface-elevated-dark': '#1e2c31',
          aloe: '#c1fbd4',
          'aloe-hover': '#a8f7c1',
          pistachio: '#d4f9e0',
          ink: '#000000',
          'on-dark': '#ffffff',
          'shade-30': '#d4d4d8',
          'shade-40': '#a1a1aa',
          'shade-50': '#71717a',
          'shade-60': '#52525b',
          'shade-70': '#27272a',
          'hairline-dark': 'rgba(255, 255, 255, 0.08)',
          'hairline-hover': 'rgba(193, 251, 212, 0.4)',
          'link-cool': '#9dabad',
          'link-mint': '#99b3ad',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Neue Haas Grotesk Display', 'Inter Display', 'Helvetica', 'Arial', 'sans-serif']
      },
      borderRadius: {
        pill: '9999px',
        card: '16px',
        photo: '20px',
      },
      boxShadow: {
        'shopify-sheen': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'shopify-aloe': '0 10px 25px -5px rgba(193, 251, 212, 0.15)',
        'shopify-card': '0 0 0 1px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.5)',
        'shopify-elevated': '0 0 0 1px rgba(255,255,255,0.12), 0 8px 30px rgba(0,0,0,0.7)',
      }
    },
  },
  plugins: [],
};
