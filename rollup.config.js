/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const alias = require("@rollup/plugin-alias");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const typescript = require("@rollup/plugin-typescript");
const copy = require("rollup-plugin-copy");
const nodeBuiltins = require("rollup-plugin-node-builtins");

module.exports = {
  input: "src/index.ts",
  output: {
    file: "dist/graphica.js",
    format: "umd",
    name: "Graphica",
    sourcemap: true,
    globals: {
      'typeof self !== "undefined" ? self : this': "this",
    },
  },
  plugins: [
    typescript(),
    resolve({
      preferBuiltins: false,
    }),
    commonjs(),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    nodeBuiltins(),
    copy({
      targets: [
        {
          src: "node_modules/three/examples/jsm/**/*",
          dest: "dist/jsm",
        },
      ],
    }),
    alias({
      entries: [
        {
          find: "three/examples/jsm",
          replacement: path.resolve(
            __dirname,
            "node_modules/three/examples/jsm"
          ),
        },
      ],
    }),
  ],
};
