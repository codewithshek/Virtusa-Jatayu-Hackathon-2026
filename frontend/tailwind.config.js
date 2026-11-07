/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Tight"', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"Inter Tight"', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'Times New Roman', 'serif'],
        script: ['"Pinyon Script"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        void: '#000000',
        parchment: '#f7f7ee',
        ink: '#292919',
        dusk: '#1c004f',
        signal: '#7126ff',
        'signal-soft': '#8051ff',
        stone: '#dcdcd0',
        mist: '#cfcfd5',
        muted: '#909083',
        lead: '#5c5c4e',
      },
      screens: {
        '3xl': '1680px',
      },
      opacity: {
        12: '0.12',
        15: '0.15',
        18: '0.18',
        22: '0.22',
        35: '0.35',
        45: '0.45',
        55: '0.55',
        65: '0.65',
        85: '0.85',
      },
    },
  },
  plugins: [],
}
