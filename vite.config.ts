import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import WindiCSS from "vite-plugin-windicss"
import { resolve } from "path"
import removeConsole from "vite-plugin-remove-console";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), WindiCSS(), removeConsole()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueConsoleFeed",
      // the proper extensions will be added
      fileName: "index",
      formats: ["cjs", "es", "iife", "umd"]
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue"
        }
      }
    }
  }
})
