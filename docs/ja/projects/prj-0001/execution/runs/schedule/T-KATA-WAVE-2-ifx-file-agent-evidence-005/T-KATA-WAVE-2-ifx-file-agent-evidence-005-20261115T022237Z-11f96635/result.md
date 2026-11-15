---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-ifx-file-agent-evidence-005-20261115t022237z-11f96635
  type: exec-result
  task_id: T-KATA-WAVE-2-ifx-file-agent-evidence-005
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-2-ifx-file-agent-evidence-005/T-KATA-WAVE-2-ifx-file-agent-evidence-005-20261115T022237Z-11f96635/plan.md
  started_at: "2026-11-15T02:22:40.164Z"
  completed_at: "2026-11-15T04:20:36.312Z"
  agent: flash-high-executor
  execution: agent
  approach: bootstrap
  targets:
    - ifx-file-agent-evidence
    - specdojo:ifx-file-rulebook
    - specdojo:ifx-file-sample
---

# Edit Result

## 1. 実施内容

- 外部ファイル連携仕様（`ifx-file-agent-evidence.yaml`）および、その実践の型である `ifx-file-rulebook.md` と `ifx-file-sample.md` の初期整備を完了しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/ifx-file-rulebook.md`: 外部ファイル連携仕様の構造、必須項目、禁止事項、判定基準を一般化した規定として整理し、recipe および template は `not-needed` と宣言しました。
- `docs/ja/specdojo/samples/ifx-file-sample.md`: 粒度、文体、表の書き方が伝わる最小の完成例として整備しました。
- `docs/ja/product/020-external-interface-specs/ifx-file-agent-evidence.yaml`: executor の agent が書き runner が読む `evidence.json` と `pipeline-state.json` の受け渡し（置き場所、命名、形式、必須項目、書き手と読み手、失敗時の扱い）を定義しました。

## 3. 申し送り

- recipe および template は、YAML 1 ファイルの外部ファイル連携仕様書であり、構造・必須項目・失敗時の扱いが rulebook と sample で十分に伝わるため、独立した手順書および雛形ファイルは不要と判断し not-needed と宣言しました。
- ifx-file-agent-evidence.yaml は SpecDojo パイプライン実行における executor / runner 間の evidence.json および pipeline-state.json の連携契約を定義しています。実装正本は src/exec/evidence.ts および src/exec/pipeline-state.ts です。未確定の技術判断は ARC が行い、ready への昇格は PO が判断します。
- 適用外の検証: `npm run validate:history-links`（No history files or plan/result files changed by executor）
- 適用外の検証: `npm run validate:catalog`（Deliverable changes are outside docs/ja/projects/）

## 4. 進め方と実践の型の適用

bootstrap アプローチに基づき、成果物本体と実践の型（rulebook, sample）を一貫した一組として作成・整備しました。recipe と template については、rulebook と sample で十分な基準が示されており、単一の YAML ファイルというシンプルな構造であるため、独立した定義は不要と判断し `not-needed` と宣言しました。
