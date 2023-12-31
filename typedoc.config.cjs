// @ts-check

const fs = require("fs");
const path = require("path");

/**
 *
 * @param {string} root
 * @returns
 */
function listFiles(root) {
  return fs
    .readdirSync(root)
    .map((entry) => path.join(root, entry))
    .filter((entry) => fs.statSync(entry).isFile());
}

/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: [
    ...listFiles("src"),
    ...listFiles("src/util"),
    ...listFiles("src/util/graphic"),
  ],
  basePath: "src",
  navigationLinks: {
    Github: "https://github.com/Narazaka/verseengine-modules",
    Example:
      "https://github.com/Narazaka/verseengine-modules/blob/master/examples/src/main.ts",
  },
};
