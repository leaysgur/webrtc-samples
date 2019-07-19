const fs = require("fs");

// should be the root of this repo
const cwd = process.cwd();
const pages = fs.readdirSync(`${cwd}/docs`).filter(entry => {
  // ignore _shared
  if (entry.startsWith("_")) return false;
  // ignore not directory
  if (entry.includes(".")) return false;
  return true;
});
const pagesHasMain = pages.filter(page =>
  fs.readdirSync(`${cwd}/docs/${page}`).includes("main.js")
);

module.exports = pagesHasMain.map(page => ({
  context: cwd,
  entry: `./docs/${page}/main.js`,
  output: {
    path: `${cwd}/docs/${page}`,
    filename: "bundle.js"
  }
}));
