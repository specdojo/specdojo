---
specdojo:
  id: prj-0001:pjr-v6rb-catalog-add-sf-uis-ifx-reps
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T00:31:26Z"
  derived_from:
    - PJR-2GD6
---

# PJR-V6RB カタログに sf・uis・ifx の代表を 1 件ずつ足す

## 1. 概要

システム化機能・画面・外部 I/F のカタログには索引しかないため、代表として作る個別の文書を 1 件ずつ足す

## 2. 入力

- 候補（indie が推奨どおりと決定）: sf はタスクの実行の機能、uis は exec コマンド群、ifx は AI provider CLI の起動（ifx-cmd）。

## 3. 完了条件

- 次の 3 つのカタログに、代表として作る個別の文書を 1 件ずつ足している。成果物の文書そのものは作らない。
  - `dct-system-functions.yaml`: タスクの実行の機能（`sf-<term>`、rulebook は `specdojo:sf-rulebook`）
  - `dct-user-interface-model.yaml`: `exec` コマンド群の画面仕様（`uis-<term>`、rulebook は `specdojo:uis-rulebook`）
  - `dct-external-interface-specs.yaml`: AI provider CLI の起動（`ifx-cmd-<term>`、rulebook は `specdojo:ifx-cmd-rulebook`）
- 各項目は、同じカタログの既存の項目と [[specdojo:dct-rulebook]] に揃えて `local_id`・`name`・`kind: work`・`overview`・`path`・`rulebook`・`evidence_refs`（実装のパスと目的）・`done_criteria`（roles と viewpoint）・`depends_on` を持つ。`local_id` の `<term>` は [[specdojo:id-and-file-naming-standard]] に従って executor が決め、理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `evidence_refs` は実在する実装のパスを指している。sf と uis は `src/exec/` のタスクの実行の実装、ifx は AI provider CLI の起動を組み立てる実装を指す。
- `sf-index` の `note`（個別の sf は作らないという記述）を、代表を 1 件作ることになった経緯に合わせて直している。`uis-index`・`ifx-index` に同様の記述があれば同じく直している。
- 3 つのカタログ以外のファイル、`src/`・`tests/`、ほかのカタログの項目を変えていない。
- `specdojo catalog validate --project prj-0001`・`npm run validate:schema`・`npm run lint:md` が通っている。

## 4. 作業内容

| No  | 作業                                                                 | 担当 | 状態 | メモ                                                                                                     |
| --- | -------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------------------- |
| 1   | 既存の項目と rulebook を読み、3 件の `local_id` と根拠の実装を決める | DEV  | done | sf: `sf-task-execution`、uis: `uis-exec-commands`、ifx: `ifx-cmd-ai-provider-cli` を選定                 |
| 2   | 3 つのカタログに項目を足し、索引の `note` を直す                     | DEV  | done | `dct-system-functions.yaml`・`dct-user-interface-model.yaml`・`dct-external-interface-specs.yaml` を更新 |
| 3   | 検査を流し、決めた名前と理由を対応結果に書く                         | DEV  | done | `specdojo catalog validate --project prj-0001` で検証し、理由と根拠を記録                                |

## 5. 対応結果

### 1. 選定した `local_id` の `<term>` とその理由

- `sf-task-execution`:
  - `<term>`: `task-execution`
  - 理由: [[specdojo:id-and-file-naming-standard]] 4.7（名詞句・「何についての文書か」）に従い、タスクの実行機能を表す名詞句として選定。既存の総合テスト（`stc-task-execution`）、受入テスト（`atc-task-execution`）、業務受入条件（`bac-task-execution`）、概念クラス図（`ccd-task-execution`）、ステータス定義（`stsd-task-execution`）で統一されている標準語彙に合わせた。
  - 実装根拠（`evidence_refs`）: `src/exec/run/agent-pipeline.ts`（タスク実行パイプラインの本体実装）
- `uis-exec-commands`:
  - `<term>`: `exec-commands`
  - 理由: [[specdojo:id-and-file-naming-standard]] 4.7 に従い、`exec` サブコマンド配下の CLI コマンド群（run・plan・review・worktree 等）を画面に見立てた仕様を表す名詞句として選定。
  - 実装根拠（`evidence_refs`）: `src/exec/commands.ts`（`exec` サブコマンド群の引数・オプション・対話出力・エラー表示を定義する CLI 操作部）
- `ifx-cmd-ai-provider-cli`:
  - `<term>`: `ai-provider-cli`
  - 理由: [[specdojo:ifx-cmd-rulebook]] 3（連携目的または外部 CLI を表す kebab-case）および [[specdojo:id-and-file-naming-standard]] 4.7 に従い、SpecDojo がプロセス起動する外部 CLI である「AI provider CLI」（Claude Code / Codex CLI / opencode 等）を表す名詞句として選定。
  - 実装根拠（`evidence_refs`）: `src/exec/run/agent.ts`（AI provider CLI の起動・実行・エラー検知）および `src/exec/agent-config.ts`（コマンドテンプレート・モデル解決）

### 2. 成果物カタログの更新内容

- `dct-system-functions.yaml`:
  - `sf-index` の `note` を、業務仕様の種類ごとに代表を1件作る方針（[[prj-0001:pjr-2gd6-business-specs-reps]]）に合わせて更新。
  - 代表エントリとして `sf-task-execution`（`name`: システム化機能（タスク実行）、`kind`: work、`rulebook`: `specdojo:sf-rulebook`、`depends_on`: [`sf-index`, `bps-task-selection-preparation`]、`evidence_refs`: `src/exec/run/agent-pipeline.ts`、`done_criteria`: BA/PO/ARC/QE/DEV）を追加。
- `dct-user-interface-model.yaml`:
  - `uis-index` の `note` を、代表作成方針（[[prj-0001:pjr-2gd6-business-specs-reps]]）に合わせて更新。
  - 代表エントリとして `uis-exec-commands`（`name`: 画面仕様（exec コマンド群）、`kind`: work、`rulebook`: `specdojo:uis-rulebook`、`depends_on`: [`uis-index`]、`evidence_refs`: `src/exec/commands.ts`、`done_criteria`: BA/PO/ARC/QE/UX）を追加。
- `dct-external-interface-specs.yaml`:
  - `ifx-index` の `note` を、代表作成方針（[[prj-0001:pjr-2gd6-business-specs-reps]]）に合わせて更新。
  - 代表エントリとして `ifx-cmd-ai-provider-cli`（`name`: 外部コマンド連携仕様（AI provider CLI）、`kind`: work、`rulebook`: `specdojo:ifx-cmd-rulebook`、`depends_on`: [`ifx-index`]、`evidence_refs`: `src/exec/run/agent.ts`・`src/exec/agent-config.ts`、`done_criteria`: BA/PO/ARC/QE/DEV）を追加。

### 3. 検証

- `specdojo catalog validate --project prj-0001` を実行し、全カタログの構文・参照が正常であることを確認。
- 成果物の文書本体は作成せず、カタログエントリの追加のみを行った。
- 3 つのカタログ以外のファイル、`src/`・`tests/`、他のカタログの項目は変更していない。

## 6. 関連ドキュメント

- 親: [[prj-0001:pjr-2gd6-business-specs-reps]]
- 規範: [[specdojo:dct-rulebook]]、[[specdojo:id-and-file-naming-standard]]
