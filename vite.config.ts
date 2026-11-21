import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// No GitHub Pages o site fica em /tapi-onde/.
export default defineConfig({
  base: "/tapi-onde/",
  server: { port: 8080 },
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
