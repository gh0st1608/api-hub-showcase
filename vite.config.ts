import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@domain": path.resolve(__dirname, "./src/domain"),
      "@application": path.resolve(__dirname, "./src/application"),
      "@presentation": path.resolve(__dirname, "./src/presentation"),
      "@infrastructure": path.resolve(__dirname, "./src/infrastructure"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/samples": {
        target: "http://localhost:3001",
        changeOrigin: true,
        bypass(req) {
          if (req.headers["accept"]?.includes("text/html")) {
            return "/index.html";
          }
        },
      },
      "/projects": {
        target: "http://localhost:3001",
        changeOrigin: true,
        bypass(req) {
          if (req.headers["accept"]?.includes("text/html")) {
            return "/index.html";
          }
        },
      },
    },
  },
});
