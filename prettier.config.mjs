/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  printWidth: 100,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  tailwindFunctions: ["clsx", "cn", "twMerge"],
  trailingComma: "all",
};

export default config;
