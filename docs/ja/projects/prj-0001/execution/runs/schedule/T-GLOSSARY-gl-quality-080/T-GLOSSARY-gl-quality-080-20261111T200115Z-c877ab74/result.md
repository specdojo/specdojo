---
specdojo:
  id: prj-0001:xer-t-glossary-gl-quality-080-20261111t200115z-c877ab74
  type: exec-result
  task_id: T-GLOSSARY-gl-quality-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-quality-080/T-GLOSSARY-gl-quality-080-20261111T200115Z-c877ab74/plan.md
  started_at: "2026-11-11T20:01:16.169Z"
  completed_at: "2026-11-11T20:12:05.088Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - gl-quality
  condense_records:
    - location: docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml:121、tm-grade-score の notes「カテゴリ別・観点別の点数も記録する」
      category: repetition
      action: delete
      reason: 同項の定義が観点別・カテゴリ別・文書全体の点数を示し、カテゴリ別の記録は tm-review-category、観点別の記録は tm-grade-level に明記されている。重複節を削除し、`score` の整数範囲、合格点・重みの参照先、点数だけで完了・確定を判断しない制約は維持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml:8,16、gl-common を正本とするコメントと成果物評価の補足
      category: repetition
      action: retain
      reason: 冒頭コメントは文書の責務境界を示し、用語の補足は出力の grade・finding の定義へ直接案内する。用語単独で参照した場合にも正本へ到達できるため保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml:137、tm-review-verdict の notes
      category: canonical-restatement
      action: retain
      reason: 6種類の判定語彙と意味は、品質判定との区別と schema 項目の参照に必要。選択条件は既にガイドを正本として参照しており、条件の再掲には広げず保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml:153、tm-finding-cause の notes
      category: canonical-restatement
      action: retain
      reason: 省略時の扱いと、原因が実践の型の場合に種類・原因箇所の根拠を要する制約は改善先の判断に必要。`kind`・`location` との対応と schema 正本への参照を保持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 用語集（評価とレビュー）`gl-quality.yaml` の冗長さを整理しました。
- `tm-grade-score` の `notes` 内で、他の用語（`tm-review-category`, `tm-grade-level`）に明記されている記述と重複していた「カテゴリ別・観点別の点数も記録する」という一文を削除し、簡潔化しました。
- 文書の責務境界を示す冒頭コメントや、判定上の制約、`schema` 正本への参照など、必須情報の維持に必要な箇所は保持しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml`: 品質評価点 `tm-grade-score` の `notes` から、他項目と重複する記録に関する記述を削除し、冗長さを整理しました。

## 3. 申し送り

- 適用外の検証: `npx markdownlint`（executor の変更は YAML 文書のみで、Markdown ファイルは変更していない。）
- 適用外の検証: `node --import tsx tools/catalog-validate-if-configured.mjs`（変更対象は docs/ja/product/ 配下で、docs/ja/projects/ 配下の成果物は変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票・既存 plan・result などの履歴ファイルを変更していない。）

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml:121、tm-grade-score の notes「カテゴリ別・観点別の点数も記録する」` | `repetition` | `delete` | ``同項の定義が観点別・カテゴリ別・文書全体の点数を示し、カテゴリ別の記録は tm-review-category、観点別の記録は tm-grade-level に明記されている。重複節を削除し、`score` の整数範囲、合格点・重みの参照先、点数だけで完了・確定を判断しない制約は維持した。`` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml:8,16、gl-common を正本とするコメントと成果物評価の補足` | `repetition` | `retain` | `冒頭コメントは文書の責務境界を示し、用語の補足は出力の grade・finding の定義へ直接案内する。用語単独で参照した場合にも正本へ到達できるため保持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml:137、tm-review-verdict の notes` | `canonical-restatement` | `retain` | `6種類の判定語彙と意味は、品質判定との区別と schema 項目の参照に必要。選択条件は既にガイドを正本として参照しており、条件の再掲には広げず保持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-quality.yaml:153、tm-finding-cause の notes` | `canonical-restatement` | `retain` | ``省略時の扱いと、原因が実践の型の場合に種類・原因箇所の根拠を要する制約は改善先の判断に必要。`kind`・`location` との対応と schema 正本への参照を保持した。`` | `document` |
