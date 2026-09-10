/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Palette derived from the foundation's own 80G letterhead: deep forest
      // green on cream paper. See DESIGN.md for the verified contrast table.
      colors: {
        pf: {
          forest: '#1B4332',
          moss: '#2D6A4F',
          sage: '#E8EFE7',
          cream: '#FAF7F0',
          ink: '#1C1917',
          muted: '#57534E',
          border: '#E3DDD0',
          marigold: '#9A3412',
        },
      },
      fontFamily: {
        display: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
