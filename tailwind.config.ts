import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Chewy"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#F0F9FF',
          text: '#2B2D42',
        },
        card: {
          pink: '#FFC8DD',
          yellow: '#FFFAA0',
          blue: '#A2D2FF',
          purple: '#CDB4DB',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
