import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

const sharedRules = {
  "prefer-const": "error",
  eqeqeq: ["error", "always"],
  "@typescript-eslint/consistent-type-imports": [
    "error",
    { prefer: "type-imports", fixStyle: "inline-type-imports" },
  ],
  "@typescript-eslint/no-unused-vars": [
    "error",
    { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
  ],
};

export default tseslint.config(
  { ignores: ["dist/**", "node_modules/**", "**/*.d.ts"] },

  // src + tests
  {
    files: ["src/**/*.ts", "tests/**/*.ts"],
    extends: tseslint.configs.recommended,
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.test.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: sharedRules,
  },

  // tools/docs
  {
    files: ["tools/docs/src/**/*.ts"],
    extends: tseslint.configs.recommended,
    languageOptions: {
      parserOptions: {
        project: "./tools/docs/tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: sharedRules,
  },

  // tools/e2e (on-demand scripts run via tsx; no typed project needed)
  {
    files: ["tools/e2e/**/*.ts"],
    extends: tseslint.configs.recommended,
    rules: sharedRules,
  },

  // Prettier compatibility — disables formatting rules that conflict
  prettierConfig,
);
