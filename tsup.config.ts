import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["./src/logic/Encode.ts", "./src/logic/Table.ts","./src/logic/Group.ts"],
  splitting: true,
  format: ["cjs", "esm"],
  target: "es6",
  dts: true,
  metafile: false,
  env: {
    NODE_ENV: "production"
  },
  treeshake: true
})
