import { defineConfig } from "vite";

export default defineConfig({
  root: __dirname,
  resolve: {
    alias: [
      { find: "verseengine-modules", replacement: `${__dirname}/../src/` },
    ],
  },
  assetsInclude: ["**/*.wasm"],
});
