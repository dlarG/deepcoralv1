import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss(), react(), tsconfigPaths()],
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import tsconfigPaths from "vite-tsconfig-paths";

// export default defineConfig({
//   plugins: [react(), tsconfigPaths()],
//   define: {
//     global: 'globalThis',
//   },
//   resolve: {
//     alias: {
//       buffer: 'buffer',
//       process: 'process/browser',
//     }
//   },
//   optimizeDeps: {
//     include: ['buffer', 'process']
//   }
// });