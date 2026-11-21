---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-itc-sample-050-20261121t142207z-be88803e
  type: exec-result
  task_id: T-KATA-WAVE-3-itc-sample-050
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-itc-sample-050/T-KATA-WAVE-3-itc-sample-050-20261121T142207Z-be88803e/plan.md
  started_at: "2026-11-21T14:22:20.652Z"
  completed_at: "2026-11-21T14:32:57.251Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:itc-sample
    - specdojo:itc-sample
---

# Edit Result

## 1. 実施内容

- 既存の `docs/ja/specdojo/samples/itc-sample.md` を、共通サンプル文脈である「駄菓子屋きぬや販売管理システム」の具体的な結合単位（`itc-sales-checkout`）の完成例として全面改訂しました。
- Rulebook で定められた必須 6 章構成（1. 概要 〜 6. テスト観点とケース）を遵守し、抽象的な説明から、具体的な業務・技術・テストケースを含む実例へと昇華させました。
- 各 `finding` （F001〜F023）に対応する形で、結合境界、依存関係、トレース表（`trace_key`）、および `case_id`・条件・期待値・観測点・証跡を備えたケース表（6 行）を整備しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-sample.md`: 駄菓子屋の販売管理システムにおける `itc-sales-checkout`（販売登録から在庫減算・つけ残高更新までの結合）を題材とした完成例として改訂。Rulebook に基づく 6 章構成を整備し、結合境界、技術的依存、トレース表、および詳細なテストケース（`case_id` 付き）を追加して、実案件のテスト実装に利用可能な粒度まで厚くしました。

## 3. 申し送り

- F018 のうち `title` は frontmatter への追加を見送った。`.github/instructions/markdown.instructions.md` が frontmatter に `title:` を書くことを禁止し、H1 を正とするため。再評価で同じ指摘が出た場合は grade の判定根拠側の見直しを検討する。
- F002/F005/F022（未解決事項）は、rulebook に未解決事項の章がなく sample-authoring-standard が独自章を禁じるため、章を削除した。論点は「結合境界/依存/環境前提」の `_ASSUMPTION_`（分離レベル、判断者は ARC、PJR は itc-index 側へ集約）と、概要の ready 化条件（QE が確認し PO へ諮る）へ移した。
- rulebook 変更案: itc-rulebook の「全体方針」にある `_UNDECIDED_` の「sample は本文要件の見出し構成・`trace_key`・条件・ケース表へ未整合」の記述は、本改訂で解消したので削除できる（`recipe`・`template` の要否の部分は残す）。
- rulebook 変更案: `perspective_key` 宣言行の書式（インラインコードで囲むか、素のテキストか）を rulebook で明示するとよい。本 sample では `perspective_key: &lt;key&gt;` をインラインコードの1行で書いた。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/itc-sample.md のみで、plan/result/PJR 個票などの履歴蓄積ファイルを変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがないため）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/ 配下の sample のみで、docs/ja/projects/ 配下の成果物に変更が及ばないため）

## 4. 進め方と実践の型の適用

Rulebook の `itc-rulebook` に従い、sample の目的である「完成例の提示」を達成するため、抽象的な説明を削除し、特定の業務（販売登録〜在庫減算〜つけ残高更新）に特化した具体的な記述へと書き換えました。執筆にあたっては `sample-authoring-standard` を正とし、`finding` で指摘された検証可能性、トレーサビリティ（`trace_key`）、およびテスト実装のしやすさ（`case_id` / 期待値 / 観測点）を担保する構成を採用しました。
