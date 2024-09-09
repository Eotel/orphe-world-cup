const path = require("node:path");

module.exports = {
  entry: {
    app: "./js/main.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    clean: true,
    filename: "./js/main.js",
  },
};
