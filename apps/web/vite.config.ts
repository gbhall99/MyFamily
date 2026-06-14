import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The web companion renders the same react-native components as the native app,
// via react-native-web. Alias + jsx-in-deps config is the standard RNW + Vite setup.
export default defineConfig({
  plugins: [react()],
  define: { __DEV__: "false", "process.env.NODE_ENV": '"production"' },
  resolve: {
    alias: { "react-native": "react-native-web" },
    extensions: [".web.tsx", ".web.ts", ".web.jsx", ".web.js", ".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  optimizeDeps: {
    esbuildOptions: { resolveExtensions: [".web.js", ".js", ".ts", ".jsx", ".tsx"], loader: { ".js": "jsx" } },
  },
});
