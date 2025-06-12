/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: {
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
        },
        primary: {
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        white: {
          pure: "#ffffff",
        },
        black: {
          pure: "#000000",
        },
          table: {
          header: '#f8fafc',
          hover: '#f1f5f9',
          border: '#e2e8f0',
        }

      },
        spacing: {
        'table-cell': '1rem 1.5rem',
      },
      // Add custom border styles
      borderWidth: {
        'table': '1px',
      },
         fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
