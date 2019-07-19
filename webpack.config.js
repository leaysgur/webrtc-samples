module.exports = {
  // mode: "production",
  mode: "development",
  entry: "./src/index.js",
  output: {
    libraryTarget: "umd",
    library: "Signaling",
    path: `${__dirname}/docs/js`,
    filename: "signaling.js"
  }
};
