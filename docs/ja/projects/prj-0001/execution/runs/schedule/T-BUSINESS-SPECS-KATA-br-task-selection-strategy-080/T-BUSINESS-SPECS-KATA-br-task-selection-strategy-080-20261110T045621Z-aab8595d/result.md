---
specdojo:
  id: prj-0001:xer-t-business-specs-kata-br-task-selection-strategy-080-20261110t045621z-aab8595d
  type: exec-result
  task_id: T-BUSINESS-SPECS-KATA-br-task-selection-strategy-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-BUSINESS-SPECS-KATA-br-task-selection-strategy-080/T-BUSINESS-SPECS-KATA-br-task-selection-strategy-080-20261110T045621Z-aab8595d/plan.md
  started_at: "2026-11-10T04:56:22.871Z"
  completed_at: "2026-11-10T06:19:56.036Z"
  agent: sol-executor
  execution: agent
  approach: condense
  targets:
    - br-task-selection-strategy
  condense_records:
    - location: 1. 概要／前提「frontmatter の `based_on` は依存関係の宣言」
      category: canonical-restatement
      action: delete
      reason: メタ情報の説明は br-rulebook 4章にあり、対象の依存関係自体は frontmatter に残る。先行仕様が未作成である注意も維持した。
      cause:
        type: document
    - location: 1. 概要／前提「適用場面と対象外の境界は同仕様の作成後に照合する」
      category: repetition
      action: reference
      reason: 境界が仮置きである注意と U-01 への参照に集約。照合時点、依頼先、必要な根拠は6章の U-01 と承認条件に残る。
      cause:
        type: document
    - location: 3.1.6. Ready 一覧の派生ビューを使う経路／未作成・破損時の説明
      category: repetition
      action: merge
      reason: 参照不能の説明と代替順位との区別を一文に統合。未作成・破損時は E-04 とし、E-02 へ切り替えない意味を維持した。
      cause:
        type: document
    - location: 3.2. 判定例／表の前の欠損・ID比較の具体例
      category: repetition
      action: reference
      reason: 重複する具体例を U-05・U-06 への参照に置換。具体的な比較対象と下流への影響は6章に残し、判断後に期待結果を確定する条件も維持した。
      cause:
        type: document
    - location: 4. 出力／次の着手タスク行と直後の候補なしの説明
      category: table-prose
      action: merge
      reason: 候補なしが E-03 の正常な対象なしであることを出力表へ集約。本文には E-01・E-04 の選択失敗との区別を残した。
      cause:
        type: document
    - location: 4. 出力／表の後の E-02 と U-07 の説明
      category: repetition
      action: delete
      reason: 工程計算不能時の代替順位は3.1.4と例外表に、競合条件の優先順位が未決であることは5章末尾と U-07 に残るため、出力章での再掲を削除した。
      cause:
        type: document
    - location: 3.2. 判定例／例1〜9
      category: table-prose
      action: retain
      reason: 規則から導く具体的な入力と期待結果は、QE のテスト設計と DEV の比較規則の確認に必要であり、説明文の単なる反復ではない。
      cause:
        type: document
    - location: 5. 例外 / 異常系／E-01〜E-04
      category: repetition
      action: retain
      reason: 判定規則と重なる条件も、継続可否・回復担当・利用者の次の行動を対応させるために必要。代替順位、正常な対象なし、選択失敗の区別を維持した。
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- ビジネスルール（タスク選択戦略）の文書において、正本の再掲や重複した説明箇所を整理しました。
- 具体的には、メタ情報の再掲を削除し、境界確認や判定例の重複記述を参照形式へ置き換え、出力章の冗長な説明を表へ集約するなどして、意味と必須情報を維持しつつ簡潔化を行いました。
- 一方で、テスト設計や実装参照に不可欠な判定例（例1〜9）および例外定義（E-01〜E-04）は保持しています。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/030-business-model/br-task-selection-strategy.md`: 重複記述の削除、参照への置き換え、および説明文の集約による冗長さの整理を実施しました。

## 3. 申し送り

- recipe は境界・欠損・競合条件を具体化する作成手順として必要、template は必須6章と入力・判定例・例外・未決事項の記入構造として必要と判断した。rulebook frontmatter には既に `specdojo:br-recipe` と `specdojo:br-template` が宣言されており、既存宣言を維持する。Kata は編集していない。
- 既存の未決事項 U-01〜U-07 は判断依頼先・判断時点・下流への影響とともに保持した。該当範囲の実装・受入条件の確定には、本文に記載された先行仕様との照合と業務判断が必要。
- recipe は境界・欠損・競合条件を具体化する作成手順として必要、template は必須6章と入力・判定例・例外・未決事項の記入構造として必要と判断した。rulebook frontmatter には既に specdojo:br-recipe と specdojo:br-template が宣言されており、既存宣言を維持する。Kata は編集していない。
- 適用外の検証: `npm run validate:schema:file`（変更対象は Markdown 文書のみで、変更した YAML ファイルがない。）
- 適用外の検証: `npm run validate:catalog`（成果物の変更は docs/ja/product/ 配下のみで、executor は docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（executor は履歴ファイル、plan、result を変更していない。）

## 4. 進め方と実践の型の適用

condense

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| ``1. 概要／前提「frontmatter の `based_on` は依存関係の宣言」`` | `canonical-restatement` | `delete` | `メタ情報の説明は br-rulebook 4章にあり、対象の依存関係自体は frontmatter に残る。先行仕様が未作成である注意も維持した。` | `document` |
| `1. 概要／前提「適用場面と対象外の境界は同仕様の作成後に照合する」` | `repetition` | `reference` | `境界が仮置きである注意と U-01 への参照に集約。照合時点、依頼先、必要な根拠は6章の U-01 と承認条件に残る。` | `document` |
| `3.1.6. Ready 一覧の派生ビューを使う経路／未作成・破損時の説明` | `repetition` | `merge` | `参照不能の説明と代替順位との区別を一文に統合。未作成・破損時は E-04 とし、E-02 へ切り替えない意味を維持した。` | `document` |
| `3.2. 判定例／表の前の欠損・ID比較の具体例` | `repetition` | `reference` | `重複する具体例を U-05・U-06 への参照に置換。具体的な比較対象と下流への影響は6章に残し、判断後に期待結果を確定する条件も維持した。` | `document` |
| `4. 出力／次の着手タスク行と直後の候補なしの説明` | `table-prose` | `merge` | `候補なしが E-03 の正常な対象なしであることを出力表へ集約。本文には E-01・E-04 の選択失敗との区別を残した。` | `document` |
| `4. 出力／表の後の E-02 と U-07 の説明` | `repetition` | `delete` | `工程計算不能時の代替順位は3.1.4と例外表に、競合条件の優先順位が未決であることは5章末尾と U-07 に残るため、出力章での再掲を削除した。` | `document` |
| `3.2. 判定例／例1〜9` | `table-prose` | `retain` | `規則から導く具体的な入力と期待結果は、QE のテスト設計と DEV の比較規則の確認に必要であり、説明文の単なる反復ではない。` | `document` |
| `5. 例外 / 異常系／E-01〜E-04` | `repetition` | `retain` | `判定規則と重なる条件も、継続可否・回復担当・利用者の次の行動を対応させるために必要。代替順位、正常な対象なし、選択失敗の区別を維持した。` | `document` |
