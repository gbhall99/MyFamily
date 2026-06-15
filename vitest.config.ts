import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  resolve: {
    // RN components import from "react-native"; under test we render them via
    // react-native-web into jsdom so we can assert real accessibility roles.
    alias: { "react-native": "react-native-web" },
  },
  test: {
    include: ["packages/*/test/**/*.test.ts", "packages/*/test/**/*.test.tsx", "apps/web/test/**/*.test.tsx"],
    environment: "node", // render tests opt into jsdom via a per-file directive
    setupFiles: ["./vitest.setup.ts"],
  },
});
