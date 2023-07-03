module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
  ],
  plugins: ["@typescript-eslint", "import"],
  ignorePatterns: ["dist/*"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      process.env.NODE_ENV === "production" ? "error" : "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-namespace": "error",
    "import/order": [
      "error",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "type",
        ],
        alphabetize: {
          order: "asc",
        },
        "newlines-between": "never", // Add this line to enforce newlines between import groups
      },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"], // Add this line to specify the file extensions for imports
      },
    },
  },
};
