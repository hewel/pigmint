export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Core brand colors derived from the design
        whalies: {
          bg: "#E0F2FE",        // Very light blue background
          DEFAULT: "#67E8F9",   // Cyan/Electric Blue (Main action buttons)
          dark: "#0E7490",      // Darker Cyan (Borders or active states)
          navy: "#16213E",      // Deep Navy (Used for text and hard borders)
        },
        // Pastel palette used for the NFT cards
        pastel: {
          pink: "#F9A8D4",      // Bubblegum Pink
          yellow: "#FDE047",    // Lemon Yellow
          purple: "#C4B5FD",    // Lavender
          mint: "#6EE7B7",      // Mint Green (Great for your 'PigMint' theme)
          blue: "#7DD3FC",      // Sky Blue
        },
      },
      // Border Radius - The design uses exaggerated rounded corners
      borderRadius: {
        '4xl': '2rem',         // For large cards/containers
        'button': '1.5rem',    // Specifically for the pill-shaped buttons
      },
      // Typography - Suggesting rounded fonts to match the cartoon vibe
      fontFamily: {
        cartoon: ['"Fredoka"', '"Varela Round"', 'sans-serif'], // For Headings
        body: ['"Nunito"', 'sans-serif'], // For Body text
      },
      // Shadows - Key Element: "Hard Shadows" (No blur)
      boxShadow: {
        'cartoon': '0px 4px 0px 0px #16213E',      // Standard hard shadow
        'cartoon-hover': '0px 2px 0px 0px #16213E', // Pressed state (smaller shadow)
        'card': '0px 8px 0px 0px rgba(0,0,0,0.1)',  // Softer hard shadow for cards
      }
    },
  },
  plugins: [],
};
