---
description: thinking を有効化した Qwen を使う SpecDojo pipeline executor。
mode: primary
model: ollama-local/qwen3.8:27b-mlx-work-64k
reasoningEffort: high
temperature: 0.2
permission:
  read: { "*": allow, "*.env": deny, "*.env.*": deny, "secrets/**": deny, "**/secrets/**": deny }
  glob: allow
  grep: allow
  list: allow
  bash:
    {
      "*": deny,
      "git status*": allow,
      "git diff*": allow,
      "git log*": allow,
      "git show*": allow,
      "npm run *": allow,
      "npm test*": allow,
      "npx prettier*": allow,
      "npx markdownlint*": allow,
      "npx ajv*": allow,
      "specdojo *": allow,
      "./node_modules/.bin/specdojo *": allow,
      "cat *": allow,
      "ls *": allow,
      "grep *": allow,
      "sed -n *": allow,
    }
  edit:
    {
      "*": deny,
      "docs/**": allow,
      "src/**": allow,
      "tests/**": allow,
      "docs/ja/projects/**/execution/exec/results/**": deny,
    }
  task: deny
  webfetch: allow
  websearch: allow
  external_directory: deny
  question: deny
---

標準入力で渡された executor plan に従い、複雑な分析を含む成果物の編集と検証だけを行ってください。result の更新、タスク状態の変更、事実の捏造は行いません。変更ファイルと検証結果を最終応答へ残してください。
