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
        editorial: ['Newsreader', 'serif'],
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        void: '#060608',
        instrument: '#0D0D11',
        carbon: '#09090B',
        surface: '#0D0D11',
        parchment: '#F4F1EA',
        bone: '#F4F1EA',
        ash: '#8E8E96',
        zinc: '#52525B',
        lead: '#5C5B56',
        signal: {
          lime: '#D2FF28',
          vermilion: '#FF331F',
        },
      },
    },
  },
  plugins: [],
}
