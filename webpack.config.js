const path = require("path");

module.exports = {
  entry: [
    "./js/server.js",
    "./js/customError.js",
    "./js/debounce.js",
    "./js/card.js",
    "./js/filter.js",
    "./js/map.js",
    "./js/pin.js",
    "./js/form.js",
    "./js/photo.js",
    "./js/moving.js",
    "./js/main.js",
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname),
    iife: true
  },
  devtool: false
};
