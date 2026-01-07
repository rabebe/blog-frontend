// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        secondary: 'var(--secondary-text)',
        link: 'var(--link-color)',
        card: 'var(--card-bg)',
        cardBorder: 'var(--card-border)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
      },
    },
  },
  darkMode: false, // no dark mode
}
