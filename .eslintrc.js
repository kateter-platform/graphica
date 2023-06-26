module.exports = defineESLint = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:@typescript-eslint/recommended"],
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["dist/*"],
  rules: {
    "@typescript-eslint/no-unused-vars":
      process.env.NODE_ENV === "production" ? "error" : "warn",
    "@typescript-eslint/no-namespace": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
