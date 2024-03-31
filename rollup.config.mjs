import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: [
    {
      sourcemap: true,
      file: "dist/bundle.js",
      format: "cjs",
      plugins: [terser()],
    },
    {
      sourcemap: true,
      file: "dist/bundle.min.js",
      format: "es",
      plugins: [terser()],
    },
  ],
};
