/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        carbon: '#050506',
        surface: '#0B0B0D',
        bone: '#F4F3EF',
        ash: '#8E8E93',
        zinc: '#52525B',
        signal: {
          lime: '#C4F82A',
          vermilion: '#FF3B1D',
        },
      },
    },
  },
  plugins: [],
}
