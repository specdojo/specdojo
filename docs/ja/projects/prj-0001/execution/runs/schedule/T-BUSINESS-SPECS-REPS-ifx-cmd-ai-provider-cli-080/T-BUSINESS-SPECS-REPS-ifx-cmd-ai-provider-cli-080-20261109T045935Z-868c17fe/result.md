---
specdojo:
  id: prj-0001:xer-t-business-specs-reps-ifx-cmd-ai-provider-cli-080-20261109t045935z-868c17fe
  type: exec-result
  task_id: T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-080/T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-080-20261109T045935Z-868c17fe/plan.md
  started_at: "2026-11-09T04:59:37.293Z"
  completed_at: "2026-11-09T05:32:20.376Z"
  agent: qwen-executor
  execution: agent
  approach: condense
  targets:
    - ifx-cmd-ai-provider-cli
  condense_records:
    - location: command.executable の前コメント『provider ごとに実行可能ファイルが異なるため、command_template の先頭要素を正本とする。』と executable 内括弧（claude / codex / copilot / opencode / agy）、および command.purpose 内の括弧列挙（Claude Code / Codex CLI / GitHub Copilot CLI / opencode / Antigravity CLI）
      category: repetition
      action: merge
      reason: 同一の provider 列挙が 3 箇所（executable・purpose・authentication.injection.names）に反復。command_template が正本（command.reference に明記済み）のため、executable は『providers.<provider>.command_template の先頭要素（provider 一覧は command_template の鍵を正本とする）』へ統合し、purpose の括弧を削除して列挙を正本への参照へ置換。制約（provider ごとに実行ファイルが異なる・command_template の先頭要素が実行ファイル）は保持
      cause:
        type: kata
        kind: recipe
        location: ifx-cmd-recipe.md §6.1 command と 正本の参照（引数・オプションの再掲排除、正本参照に一本化）
    - location: authentication.injection.names の『各 provider CLI のログインプロファイル（claude / codex / copilot / opencode / agy）』（約105行目）
      category: repetition
      action: retain
      reason: cli_profile 機構の注入対象名として独立した意味を持つ（rulebook §6.5 認証注入、secret_source/log_policy と連動）。正本への参照に置換すると注入名が不明確になり判断情報が失われるため保持
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 外部コマンド連携仕様（AI provider CLI）における冗長さの整理を実施しました。
- 具体的には、`command` ブロック内で 3 箇所にわたり反復されていた provider 名リストを、正本である `command_template` の鍵への参照に一本化し、重複を排除しました。
- 一方で、`authentication.injection.names` における列挙は、認証注入の対象名として独立した意味を持つため保持しています。
- 修正後、schema バリデーションおよび `prettier` による整形を確認済みであり、実行契約や入出力の約束、エラー処理に関する必須情報は維持されています。

## 2. 変更ファイル

- `docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml`: `command.executable` の前コメント、`executable` 内の括弧、および `command.purpose` 内の provider 名列挙を削除・統合し、正本である `command_template` への参照に置換することで冗長さを整理しました。

## 3. 申し送り

- 生成ミラー generated/ifx-cmd-ai-provider-cli.md は runner が再生成するため未編集（正本 yaml のみ変更）

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `command.executable の前コメント『provider ごとに実行可能ファイルが異なるため、command_template の先頭要素を正本とする。』と executable 内括弧（claude / codex / copilot / opencode / agy）、および command.purpose 内の括弧列挙（Claude Code / Codex CLI / GitHub Copilot CLI / opencode / Antigravity CLI）` | `repetition` | `merge` | `同一の provider 列挙が 3 箇所（executable・purpose・authentication.injection.names）に反復。command_template が正本（command.reference に明記済み）のため、executable は『providers.<provider>.command_template の先頭要素（provider 一覧は command_template の鍵を正本とする）』へ統合し、purpose の括弧を削除して列挙を正本への参照へ置換。制約（provider ごとに実行ファイルが異なる・command_template の先頭要素が実行ファイル）は保持` | `kata:recipe; location=ifx-cmd-recipe.md §6.1 command と 正本の参照（引数・オプションの再掲排除、正本参照に一本化）` |
| `authentication.injection.names の『各 provider CLI のログインプロファイル（claude / codex / copilot / opencode / agy）』（約105行目）` | `repetition` | `retain` | `cli_profile 機構の注入対象名として独立した意味を持つ（rulebook §6.5 認証注入、secret_source/log_policy と連動）。正本への参照に置換すると注入名が不明確になり判断情報が失われるため保持` | `document` |
