module.exports = {
  // Use the PostCSS wrapper package for Tailwind (newer Tailwind/PostCSS integration)
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ],
}
