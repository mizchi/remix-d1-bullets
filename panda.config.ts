import { defineConfig } from "@pandacss/dev"

export default defineConfig({
  preflight: false,
  outExtension: 'js',
  include: ["./app/**/*.{js,jsx,ts,tsx}"],
  exclude: [],
  theme: {
    extend: {}
  },
  outdir: "styled-system",
})