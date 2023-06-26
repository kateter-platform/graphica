module.exports = defineESLint = {
  parser: "@typescript-eslint/parser",
  extends: [
    "next",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["@typescript-eslint"],
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
