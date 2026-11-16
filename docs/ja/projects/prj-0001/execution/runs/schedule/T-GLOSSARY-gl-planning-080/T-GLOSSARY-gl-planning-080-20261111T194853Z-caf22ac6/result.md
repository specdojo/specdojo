---
specdojo:
  id: prj-0001:xer-t-glossary-gl-planning-080-20261111t194853z-caf22ac6
  type: exec-result
  task_id: T-GLOSSARY-gl-planning-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-planning-080/T-GLOSSARY-gl-planning-080-20261111T194853Z-caf22ac6/plan.md
  started_at: "2026-11-11T19:48:54.453Z"
  completed_at: "2026-11-11T19:59:53.082Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - gl-planning
  condense_records:
    - location: docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:65 / tm-track の notes
      category: repetition
      action: delete
      reason: ドメインとトラックの説明の反復を削除した。分類と計画単位の違いは各用語の定義に残り、CLI 対応・生成入力・直接編集の禁止・実行状態の正本も維持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:83 / tm-planning-dependency の notes
      category: repetition
      action: delete
      reason: 実装エビデンス参照が依存を作らないという重複文を削除した。同じ制約は tm-implementation-evidence-ref の notes に残り、依存の各フィールドとの対応も維持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:142 / tm-phase-gate の notes
      category: repetition
      action: delete
      reason: 対象全体の足並みをそろえるという定義の言い換えを削除した。群の待ち合わせは definition に残り、`after_phase_sets` との対応と人間の承認作業を別に計画する条件も維持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:151 / tm-cross-deliverable-pass の notes
      category: repetition
      action: delete
      reason: 成果物ごとに作業を複製しないという重複説明を削除した。群全体で一つのタスクとする定義、配置関係、`scope`、agent 実行時のパイプライン利用と schema 参照は維持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:47 / tm-deliverable-kind の notes
      category: canonical-restatement
      action: retain
      reason: 種別値と業務上の区分の対応、作業対象の配置先・完了条件、通常の戦略での選択対象は判断に必要。詳細条件を複製せず schema に委ねているため保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:92 / tm-phase の notes
      category: canonical-restatement
      action: retain
      reason: 実行方式・編集とレビュー・進め方の区別、および agent の段とパイプラインの関係は参照に必要。組合せの詳細は schema を正本としているため保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:101 / tm-phase-set の notes
      category: canonical-restatement
      action: retain
      reason: 段の組の定義・選択・未指定時の既定適用は利用判断に必要。単数・複数の指定方法と優先関係は schema 参照に留めているため保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:158 / tm-initial-completion の notes
      category: canonical-restatement
      action: retain
      reason: 反復時の指定と `completed_through` 省略時の意味は完了範囲の判断に必要。実行中の状態記録との区別と、表記・指定条件の schema 参照を含めて保持した。
      cause:
        type: document
    - location: docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:167 / tm-task-intent の notes
      category: canonical-restatement
      action: retain
      reason: 作業意図と `kata_target`・`bootstrap_scope` の関係は技術参照に必要。追加項目の要否を列挙せず schema に委ねているため保持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 用語集（計画）の冗長さを整理するため、`docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml` における重複記述4か所を削除しました。
- 定義や制約、条件付きの関係性、および正本への参照などの必須情報は維持したまま、言い換えや反復を整理しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml`: `tm-track`、`tm-planning-dependency`、`tm-phase-gate`、`tm-cross-deliverable-pass` の各 `notes` フィールドにあった重複記述を削除し、冗長さを解消しました。

## 3. 申し送り

- 適用外の検証: `npx markdownlint docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml`（変更対象は YAML のみで、Markdown を変更していない。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票や既存の plan・result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更対象は docs/ja/product/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）

## 4. 進め方と実践の型の適用

対象文書を精査し、定義や完了条件などの必須情報を保持しつつ、反復（`repetition`）や正本の再掲（`canonical-restatement`）を判定。不要な重複箇所を削除（`delete`）し、判断に必要な情報は保持（`retain`）することで、内容を変えずに簡潔な記述に整理しました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:65 / tm-track の notes` | `repetition` | `delete` | `ドメインとトラックの説明の反復を削除した。分類と計画単位の違いは各用語の定義に残り、CLI 対応・生成入力・直接編集の禁止・実行状態の正本も維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:83 / tm-planning-dependency の notes` | `repetition` | `delete` | `実装エビデンス参照が依存を作らないという重複文を削除した。同じ制約は tm-implementation-evidence-ref の notes に残り、依存の各フィールドとの対応も維持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:142 / tm-phase-gate の notes` | `repetition` | `delete` | ``対象全体の足並みをそろえるという定義の言い換えを削除した。群の待ち合わせは definition に残り、`after_phase_sets` との対応と人間の承認作業を別に計画する条件も維持した。`` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:151 / tm-cross-deliverable-pass の notes` | `repetition` | `delete` | ``成果物ごとに作業を複製しないという重複説明を削除した。群全体で一つのタスクとする定義、配置関係、`scope`、agent 実行時のパイプライン利用と schema 参照は維持した。`` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:47 / tm-deliverable-kind の notes` | `canonical-restatement` | `retain` | `種別値と業務上の区分の対応、作業対象の配置先・完了条件、通常の戦略での選択対象は判断に必要。詳細条件を複製せず schema に委ねているため保持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:92 / tm-phase の notes` | `canonical-restatement` | `retain` | `実行方式・編集とレビュー・進め方の区別、および agent の段とパイプラインの関係は参照に必要。組合せの詳細は schema を正本としているため保持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:101 / tm-phase-set の notes` | `canonical-restatement` | `retain` | `段の組の定義・選択・未指定時の既定適用は利用判断に必要。単数・複数の指定方法と優先関係は schema 参照に留めているため保持した。` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:158 / tm-initial-completion の notes` | `canonical-restatement` | `retain` | ``反復時の指定と `completed_through` 省略時の意味は完了範囲の判断に必要。実行中の状態記録との区別と、表記・指定条件の schema 参照を含めて保持した。`` | `document` |
| `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml:167 / tm-task-intent の notes` | `canonical-restatement` | `retain` | ``作業意図と `kata_target`・`bootstrap_scope` の関係は技術参照に必要。追加項目の要否を列挙せず schema に委ねているため保持した。`` | `document` |
