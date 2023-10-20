/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx", "./index.html"],
  theme: {
    extend: {
      colors: {
        bg: "hsl( var(--color-bg) / <alpha-value>)",
        container: "hsl( var(--color-container) / <alpha-value>)",
        green: "hsl( var(--color-green) / <alpha-value>)",
        red: "hsl( var(--color-red) / <alpha-value>)",
        orange: "hsl( var(--color-orange) / <alpha-value>)",
        yellow: "hsl( var(--color-yellow) / <alpha-value>)",
        title: "hsl( var(--color-title) / <alpha-value>)",
        paragraph: "hsl( var(--color-text) / <alpha-value>)",
        placeholder: "hsl( var(--color-placeholder) / <alpha-value>)",
      },
      fontFamily: {
        jetBrains: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
