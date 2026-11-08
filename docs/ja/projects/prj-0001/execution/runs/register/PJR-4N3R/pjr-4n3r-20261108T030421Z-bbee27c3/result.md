---
specdojo:
  id: prj-0001:xer-pjr-4n3r-20261108t030421z-bbee27c3
  type: exec-result
  task_id: PJR-4N3R
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-4N3R/pjr-4n3r-20261108T030421Z-bbee27c3/plan.md
  started_at: "2026-11-08T03:04:35.735Z"
  completed_at: "2026-11-08T03:28:37.965Z"
  agent: flash-high-executor
  approach: rulebook-maintenance
  targets:
    - specdojo:ifx-cmd-rulebook
---

# Edit Result

## 1. 実施内容

- 外部 I/F（コマンド）の型について、引数・オプションの表を廃止し、正本（コマンドリファレンス）を参照して入出力の約束に絞るルールへ改訂しました。
- これに伴い、`schema`、`recipe`、`sample`、`template`、および `CHANGELOG.md` を同期しました。
- 新しい schema では、正本参照のための `command.reference` プロパティや、ファイル入出力のための `files` プロパティ、および「副作用」を定義する `side_effects` を追加し、後方互換性を維持しています。

## 2. 変更ファイル

- `CHANGELOG.md`: 型の変更に関する記述を追加しました。
- `docs/ja/specdojo/recipes/ifx-cmd-recipe.md`: 新しい引数定義のルールに合わせて更新しました。
- `docs/ja/specdojo/references/deliverables-reference.md`: 関連する参照情報を更新しました。
- `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md`: 引数・オプションの表を持たず、正本を参照して入出力の約束に絞る新しい規則を記述しました。
- `docs/ja/specdojo/samples/ifx-cmd-sample.yaml`: 新しい規則に基づいたサンプルデータに更新しました。
- `docs/ja/specdojo/templates/ifx-cmd-template.yaml`: 新しい規則に基づいたテンプレートファイルを更新しました。
- `docs/specdojo/schemas/v1/ifx-cmd.schema.yaml`: 引数定義の optional 化、`command.reference` の追加、`files` プロパティ、`side_effects` プロパティ、および `rate_limit` カテゴリの追加を行いました。

## 3. 申し送り

- schema 変更の有無と理由: `docs/specdojo/schemas/v1/ifx-cmd.schema.yaml` を変更しました。新規則で引数・オプション表を廃止し正本参照 (`command.reference`) へ一本化するため、ルートの `required` から `arguments` を除外（optional 化）し、正本参照プロパティ `command.reference` を追加しました。また、入出力の約束のうち「渡すファイル」「作るファイル」を定義する `files` プロパティ (`inputs`, `outputs`) および `$defs/FileContract` を追加し、「副作用」を定義する `side_effects` プロパティを追加しました。さらに終了カテゴリに `rate_limit` を追加し（finding `F006` 解消）、先頭メタ項目に `supersedes` を追加しました（finding `F003` 解消）。従来の引数定義や `positional` / `config` を含む既存文書も引き続き検査を通過する後方互換性を完全に維持しています。
- executor が決定した内容と理由（PJR-RZ9Q への判断材料）: (1) 正本参照先 (`command.reference`) はルートではなく `command` オブジェクト内に配置しました（コマンド実行体定義としてのコンテキストを統一し `based_on` と区別するため）。(2) 「作るファイル」「渡すファイル」はルートキー `files` 配下に `inputs` / `outputs` 配列として配置しました（`streams` と明確に分離し、ファイル入出力のないコマンドでの省略を容易にするため）。(3) 「副作用」はルートキー `side_effects` （および `execution.side_effects`）として配置し、既存の `execution.idempotency` と組み合わせる規則としました。(4) 終了カテゴリに `rate_limit` を追加しました（AI provider CLI 等で頻発するレート制限を `transient_failure` と区別するため）。(5) `arguments` は rulebook・sample・template では廃止しましたが、schema 上は optional として残し後方互換性を担保しました。
- schema 変更の有無と理由: docs/specdojo/schemas/v1/ifx-cmd.schema.yaml を変更しました。新規則で引数・オプション表を廃止し正本参照（command.reference）へ一本化するため、ルートの required から arguments を除外（optional 化）し、正本参照プロパティ command.reference を追加しました。また、入出力の約束のうち「渡すファイル」「作るファイル」を定義する files プロパティ（inputs, outputs）および $defs/FileContract を追加し、「副作用」を定義する `side_effects` プロパティを追加しました。さらに終了カテゴリに `rate_limit` を追加し（finding F006 解消）、先頭メタ項目に supersedes を追加しました（finding F003 解消）。従来の引数定義や positional / config を含む既存文書も引き続き検査を通過する後方互換性を完全に維持しています。
- executor が決定した内容と理由（PJR-RZ9Q への判断材料）: (1) 正本参照先（command.reference）はルートではなく command オブジェクト内に配置しました（コマンド実行体定義としてのコンテキストを統一し `based_on` と区別するため）。(2) 「作るファイル」「渡すファイル」はルートキー files 配下に inputs / outputs 配列として配置しました（ストリーム streams と明確に分離し、ファイル入出力のないコマンドでの省略を容易にするため）。(3) 「副作用」はルートキー `side_effects`（および `execution.side_effects`）として配置し、既存の execution.idempotency（冪等性保証条件）と組み合わせて記述する規則としました。(4) 終了カテゴリに `rate_limit` を追加しました（AI provider CLI や外部 API ラッパー CLI で頻発するレート制限を `transient_failure` と区別して再試行制御するため）。(5) arguments は rulebook・sample・template では廃止しましたが schema 上は optional として残し後方互換性を担保しました。

## 4. 進め方と実践の型の適用

外部 I/F（コマンド）の型において、引数やオプションの詳細はコマンドリファレンス（正本）に委ね、仕様書には「入出力の約束（渡すもの・作るもの・終了コード・副作用）」を記述する方針で rulebook および関連資産を整備しました。
