/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 120,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "auto",
  plugins: ["prettier-plugin-tailwindcss"],
};
