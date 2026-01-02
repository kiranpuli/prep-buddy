import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: 'rgba(255, 255, 255, 0.08)',
        'surface-strong': 'rgba(255, 255, 255, 0.16)',
        midnight: '#0b1623',
        aurora: '#5b8def',
        'aurora-soft': '#9fb9ff',
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro Text"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 20px 45px -20px rgba(15, 23, 42, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
