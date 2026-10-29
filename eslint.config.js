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

const srcFeatureDirectories = [
  "catalog",
  "commands",
  "dashboard",
  "deliverable",
  "devcontainer",
  "docs",
  "exec",
  "grade",
  "job",
  "kata",
  "register",
  "review",
  "routine",
  "schedule",
];
const srcFeatureImportRegex = `^(?:\\.\\./)+(?:${srcFeatureDirectories.join("|")})(?:/|$)|^(?:\\.\\./)+specdojo(?:\\.js)?$`;
const cliImportRegex = "^(?:\\.\\./)+(?:commands(?:/|$)|specdojo(?:\\.js)?$)";
const cliImportPattern = {
  regex: cliImportRegex,
  message: "Feature modules must not import src/commands or src/specdojo.ts.",
};

const featureDirectionRules = [
  {
    files: ["src/register/**/*.ts"],
    forbidden: "exec",
    feature: "register",
  },
  {
    files: ["src/schedule/**/*.ts"],
    forbidden: "exec",
    feature: "schedule",
  },
  {
    files: ["src/job/**/*.ts"],
    forbidden: "exec",
    feature: "job",
  },
  {
    files: ["src/grade/**/*.ts"],
    forbidden: "exec",
    feature: "grade",
  },
  {
    files: ["src/review/**/*.ts"],
    forbidden: "grade",
    feature: "review",
  },
  {
    files: ["src/docs/**/*.ts"],
    forbidden: "catalog",
    feature: "docs",
  },
  {
    files: ["src/schedule/**/*.ts"],
    forbidden: "dashboard",
    feature: "schedule",
  },
];

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
    rules: {
      ...sharedRules,
      // Type-aware: catch un-awaited async calls (e.g. an async scaffold fired without await in a
      // sync command action leaks a promise that can reject after teardown). Requires the typed
      // project above. Only enabled here where parserOptions.project is set (not tools/e2e).
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
    },
  },

  // Keep production modules and functions small enough to review and maintain. These are
  // warnings so existing oversized functions remain visible without blocking development.
  {
    files: ["src/**/*.ts"],
    rules: {
      "max-lines": ["warn", { max: 1000, skipBlankLines: true, skipComments: true }],
      "max-lines-per-function": ["warn", { max: 200, skipBlankLines: true, skipComments: true }],
    },
  },

  // shared is the dependency root: it must not reach into a feature or the CLI entry point.
  {
    files: ["src/shared/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              regex: srcFeatureImportRegex,
              message: "Modules under src/shared must not import other src features.",
            },
          ],
        },
      ],
    },
  },

  // Feature modules must not depend on command wiring or the top-level CLI entry point.
  {
    files: ["src/**/*.ts"],
    ignores: ["src/commands/**/*.ts", "src/shared/**/*.ts", "src/specdojo.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [cliImportPattern],
        },
      ],
    },
  },

  // Direction rules between feature pairs to prevent cycles (PJR-QQKY / PJR-WSET / PJR-Q4CD).
  ...featureDirectionRules.map(({ files, forbidden, feature }) => ({
    files,
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            cliImportPattern,
            {
              regex: `^(?:\\.\\./)+${forbidden}(?:/|$)`,
              message: `Modules under src/${feature} must not import src/${forbidden}.`,
            },
          ],
        },
      ],
    },
  })),

  // packages/docs-lint
  {
    files: ["packages/docs-lint/src/**/*.ts"],
    extends: tseslint.configs.recommended,
    languageOptions: {
      parserOptions: {
        project: "./packages/docs-lint/tsconfig.json",
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
