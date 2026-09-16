/** @type {import('tailwindcss').Config} */
module.exports = {
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
        primary: {
          DEFAULT: '#16a34a',
          light: '#dcfce7',
          dark: '#15803d',
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
