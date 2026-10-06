/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // WattWise Brand Colors
        'watt-blue': {
          DEFAULT: '#2f5cd1',
          light: '#65b3eb',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#2f5cd1',
          600: '#2548a8',
          700: '#1e3a8a',
        },
        'watt-yellow': {
          DEFAULT: '#f1ba45',
          light: '#f8da51',
          50: '#fefce8',
          100: '#fef9c3',
          400: '#f8da51',
          500: '#f1ba45',
          600: '#d99f2a',
        },
        'watt-green': {
          DEFAULT: '#72aa7c',
          light: '#b2cf69',
          dark: '#4f8a5b',
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#b2cf69',
          500: '#72aa7c',
          600: '#4f8a5b',
          700: '#3d6b47',
        },
        primary: {
          DEFAULT: '#2f5cd1',
          light: '#dbeafe',
          dark: '#2548a8',
        },
        blue: {
          DEFAULT: '#2563eb',
          light: '#dbeafe',
          dark: '#1d4ed8',
        },
        surface: '#f8fafc',
        card: '#ffffff',
        border: '#e2e8f0',
        muted: '#64748b',
        warning: '#f59e0b',
        danger: {
          DEFAULT: '#ef4444',
          light: '#fee2e2',
        },
      },
    },
  },
  plugins: [],
}
