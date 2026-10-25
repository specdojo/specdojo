// 成功した Prettier が先に出る、description を step 名に使った lefthook の出力。
export const MARKDOWN_HOOK_ERROR = "docs/plan.md:21:1 error MD036/no-emphasis-as-heading";
export const MARKDOWN_HOOK_FAILURE = [
  "╭──────────────────────────────────────────╮",
  "│ 🥊 lefthook  v2.1.15   hook:  pre-commit │",
  "╰──────────────────────────────────────────╯",
  "┃ format documentation and configuration ❯",
  "Checking formatting...",
  "All matched files use Prettier code style!",
  "┃ lint Markdown documentation ❯",
  "docs/plan.md 12ms (unchanged)",
  MARKDOWN_HOOK_ERROR,
  "docs/plan.md:22:1 error MD029/ol-prefix",
  "exit status 1",
  "summary: (done in 1.23 seconds)",
  "✔️ format documentation and configuration (0.29 seconds)",
  "🥊 lint Markdown documentation (0.94 seconds)",
].join("\n");
