import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// @ts-expect-error: vite-plugin-eslint types mismatch
import eslint from "vite-plugin-eslint";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
