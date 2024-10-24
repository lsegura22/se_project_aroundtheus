module.exports = {
  plugins: [
    require("autoprefixer"), // Automatically adds vendor prefixes to your CSS for browser compatibility
    require("cssnano")({ preset: "default" }), // Minifies the CSS for production builds
  ],
};
