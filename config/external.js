// should be the root of this repo
const cwd = process.cwd();

module.exports = {
  context: cwd,
  entry: "./external/index.js",
  output: {
    libraryTarget: "umd",
    library: "External",
    path: `${cwd}/docs/_shared`,
    filename: "external.js"
  }
};
