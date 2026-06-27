import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  eslintConfigPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "build/**",
    "content/**",
    "next-env.d.ts",
    "out/**",
  ]),
  {
    plugins: {
      perfectionist: perfectionist,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "perfectionist/sort-arrays": [
        "warn",
        {
          order: "asc",
          type: "natural",
          useConfigurationIf: {},
        },
      ],
      "perfectionist/sort-objects": [
        "warn",
        {
          customGroups: [
            {
              elementNamePattern: "^(id|title)$",
              groupName: "priority",
            },
          ],
          groups: ["priority", "unknown"],
          order: "asc",
          type: "natural",
        },
      ],
      "simple-import-sort/exports": "error",
      "simple-import-sort/imports": "error",
    },
  },
]);

export default eslintConfig;
