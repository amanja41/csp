import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "ciam-plugins",
      filename: "remoteEntry.js",
      exposes: {
        "./customer-search": "./plugin/customer-search/register.tsx",
        "./customer-timeline": "./plugin/customer-timeline/register.tsx",
      },
      shared: ["react", "react-dom"],
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
