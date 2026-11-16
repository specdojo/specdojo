---
specdojo:
  id: prj-0001:xer-t-glossary-gl-common-080-20261111t192405z-c86f51b7
  type: exec-result
  task_id: T-GLOSSARY-gl-common-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-common-080/T-GLOSSARY-gl-common-080-20261111T192405Z-c86f51b7/plan.md
  started_at: "2026-11-11T19:24:06.256Z"
  completed_at: "2026-11-11T19:35:43.277Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - gl-common
  condense_records:
    - location: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:158 tm-result.definition
      category: repetition
      action: delete
      reason: '「（実行記録の構成要素）」を削除。同じ所属関係は直下の category: tm-exec-log に保持され、実施内容・変更成果物・検証結果・残課題という固有の定義は維持した。'
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:164 tm-event.definition
      category: repetition
      action: delete
      reason: '「（実行記録の構成要素）」を削除。所属関係は category: tm-exec-log に保持され、タスクや成果物の状態遷移の記録という意味は維持した。'
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:169 tm-evidence.definition
      category: repetition
      action: delete
      reason: '「（実行記録の構成要素）」を削除。所属関係は category: tm-exec-log に保持され、実行の過程や結果を裏付ける記録という意味は維持した。'
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:174 tm-trial.definition
      category: repetition
      action: delete
      reason: '「（実行記録の構成要素）」を削除。所属関係は category: tm-exec-log に保持され、タスク実行時の試行錯誤の過程という意味は維持した。'
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:179 tm-grade.definition
      category: repetition
      action: delete
      reason: '「（評価結果の構成要素）」を削除。所属関係は category: tm-evaluation に保持され、品質や適合性の総合的な評価判定という意味は維持した。'
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:184 tm-finding.definition
      category: repetition
      action: delete
      reason: '「（評価結果の構成要素）」を削除。所属関係は category: tm-evaluation に保持され、評価で発見した改善点や問題点という意味は維持した。'
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:89,146 tm-schedule.notes / tm-exec-log.notes
      category: repetition
      action: retain
      reason: 計画と実行状態の正本の区別は、各用語を参照する際の責務判断に必要なため、両側の説明を保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:78,118 tm-register.notes / tm-document-maturity.notes
      category: repetition
      action: retain
      reason: 登録簿の処理状態と文書成熟度の区別は状態管理の制約として必要。完了日時と保留の区別、人間による ready 昇格の条件も保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:104 tm-plan.notes
      category: canonical-restatement
      action: retain
      reason: 進め方と対象成果物・実践の型の参照元との関係を短く示す記述であり、形式的な条件は複写せず schema を正本としているため保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:13,61,131,136,146,152 各 notes の「単一の英語名を持たない。」
      category: repetition
      action: retain
      reason: 用語ごとに英語名を持たないことを明示する情報であり、英語名フィールドの欠落だけでは未記入と区別できないため保持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 用語集（共通） `gl-common.yaml` の冗長さを整理しました。
- 具体的には、`tm-result`、`tm-event`、`tm-evidence`、`tm-trial`、`tm-grade`、`tm-finding` の 6 つの定義から、分類（`category`）と重複する括弧書きの説明を削除しました。
- 一方で、計画と実行状態の区別や、登録簿の処理状態と文書成熟度の区別など、責務判断や制約として必要な情報は保持しています。
- 全 30 用語の必須情報と `schema` 参照関係を維持した状態で、表現を簡潔化しました。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml`: 6 つの用語定義から、分類 (`category`) と重複する括弧書きを削除し、冗長さを整理しました。

## 3. 申し送り

- 適用外の検証: `node packages/docs-lint/bin/specdojo-docs-lint.js markdownlint`（executor が変更したのは YAML 1ファイルのみで、Markdown の変更がないため。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイルおよび既存 plan・result を変更していないため。）
- 適用外の検証: `npm run validate:catalog`（成果物の変更は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下の変更がないため。）

## 4. 進め方と実践の型の適用

対象文書内で繰り返し記述されている情報を洗い出し、意味を変えずに不要な表現を `delete`（削除）することで簡潔化しました。判断に要る背景や制約については `retain`（保持）し、情報の欠落を防いでいます。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:158 tm-result.definition` | `repetition` | `delete` | `「（実行記録の構成要素）」を削除。同じ所属関係は直下の category: tm-exec-log に保持され、実施内容・変更成果物・検証結果・残課題という固有の定義は維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:164 tm-event.definition` | `repetition` | `delete` | `「（実行記録の構成要素）」を削除。所属関係は category: tm-exec-log に保持され、タスクや成果物の状態遷移の記録という意味は維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:169 tm-evidence.definition` | `repetition` | `delete` | `「（実行記録の構成要素）」を削除。所属関係は category: tm-exec-log に保持され、実行の過程や結果を裏付ける記録という意味は維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:174 tm-trial.definition` | `repetition` | `delete` | `「（実行記録の構成要素）」を削除。所属関係は category: tm-exec-log に保持され、タスク実行時の試行錯誤の過程という意味は維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:179 tm-grade.definition` | `repetition` | `delete` | `「（評価結果の構成要素）」を削除。所属関係は category: tm-evaluation に保持され、品質や適合性の総合的な評価判定という意味は維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:184 tm-finding.definition` | `repetition` | `delete` | `「（評価結果の構成要素）」を削除。所属関係は category: tm-evaluation に保持され、評価で発見した改善点や問題点という意味は維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:89,146 tm-schedule.notes / tm-exec-log.notes` | `repetition` | `retain` | `計画と実行状態の正本の区別は、各用語を参照する際の責務判断に必要なため、両側の説明を保持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:78,118 tm-register.notes / tm-document-maturity.notes` | `repetition` | `retain` | `登録簿の処理状態と文書成熟度の区別は状態管理の制約として必要。完了日時と保留の区別、人間による ready 昇格の条件も保持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:104 tm-plan.notes` | `canonical-restatement` | `retain` | `進め方と対象成果物・実践の型の参照元との関係を短く示す記述であり、形式的な条件は複写せず schema を正本としているため保持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml:13,61,131,136,146,152 各 notes の「単一の英語名を持たない。」` | `repetition` | `retain` | `用語ごとに英語名を持たないことを明示する情報であり、英語名フィールドの欠落だけでは未記入と区別できないため保持した。` | `document` |
