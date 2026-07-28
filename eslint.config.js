import eslint from "@eslint/js"
import tseslint from "@typescript-eslint/eslint-plugin"
import tsparser from "@typescript-eslint/parser"

export default [
  {
    ignores: [
      "public/**",
      "node_modules/**",
      ".quartz-cache/**",
      "quartz/**",
      "**/*.js",
      "**/*.mjs",
      "**/*.d.ts",
    ],
  },
  eslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        Buffer: "readonly",
        document: "readonly",
        window: "readonly",
        navigator: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // TypeScript resolves identifiers against its own libs ("DOM" is in
      // tsconfig), so `tsc --noEmit` already catches genuinely undefined names.
      // Leaving no-undef on just means re-declaring every DOM type by hand and
      // getting false positives (HTMLElement, KeyboardEvent, …) when we don't.
      // Disabling it for TS is the typescript-eslint recommendation.
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]
