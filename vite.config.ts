import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import * as fs from "fs";
import * as path from "path";

function listFiles(root) {
  return fs
    .readdirSync(root)
    .map((entry) => path.join(root, entry))
    .filter((entry) => fs.statSync(entry).isFile());
}

function toMap(files: string[], base: string) {
  const map: { [file: string]: string } = {};
  for (const file of files) {
    const target = path.relative(base, file).replace(/\.\w+$/, "");
    map[target] = file;
  }
  return map;
}

export default defineConfig({
  build: {
    lib: {
      entry: {
        ...toMap(listFiles("src"), "src"),
        ...toMap(listFiles("src/util"), "src"),
      },
      name: "verseengineModules",
      formats: ["es"],
    },
    minify: false,
  },
  plugins: [dts(), externalizeDeps()],
});
