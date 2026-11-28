---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-itc-sample-080-20261121t150540z-9a09bab1
  type: exec-result
  task_id: T-KATA-WAVE-3-itc-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-itc-sample-080/T-KATA-WAVE-3-itc-sample-080-20261121T150540Z-9a09bab1/plan.md
  started_at: "2026-11-21T15:05:41.908Z"
  completed_at: "2026-11-21T15:10:48.245Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:itc-sample
  condense_records:
    - location: '## 3. 対象外 / receipt-print の項目の末尾の文'
      category: table-prose
      action: delete
      reason: 「本 term では印刷を成功 Stub に固定し、会計記録への影響だけを見る」は、「結合境界/依存/環境前提」の依存の表の receipt-print 行（Stub（成功を返す）、印刷結果を期待値に含めない）と同じ説明。表に決定が残っているため意味を保てる
      cause:
        type: document
    - location: '## 1. 概要 / 第2段落（役割分担と ready 化の手順）'
      category: canonical-restatement
      action: retain
      reason: この sample の担当者と、ready 化の前に満たす条件（証跡がテストコードと CI run へ辿れること）を示す固有の内容で、共通運用の再掲ではない
      cause:
        type: document
    - location: '## 2. 責務 / 各項目の具体値（例: 在庫5→3個）'
      category: repetition
      action: retain
      reason: rulebook の記述ガイド「責務（結合として保証）」が、観測できる成果を添えるよう求めているため
      cause:
        type: document
    - location: '## 4. 結合境界/依存/環境前提 / 観測点の項目'
      category: repetition
      action: retain
      reason: rulebook の記述ガイドが観測点の整理を認めており、対象全体の観測点のまとめとしてケース表の判断を助けるため
      cause:
        type: document
    - location: '## 6. テスト観点とケース / 各ケース表の境界/依存の列'
      category: repetition
      action: retain
      reason: 表の 1 行が 1 テストで、各行に書く必須の列のため
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書 `docs/ja/specdojo/samples/itc-sample.md` において、冗長な記述の整理を行いました。
- 「## 3. 対象外 / receipt-print の項目の末尾の文」における、依存の表（`receipt-print` 行）と重複していた「Stub 固定」に関する説明を削除しました。
- その他の候補（概要の役割分担、責務の具体値、観測点のまとめ、ケース表の列）については、判断に必要であると判断し、保持（`retain`）しました。
- `prettier` および `markdownlint` による静的検査に合格しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-sample.md`: 「## 3. 対象外 / receipt-print の項目の末尾の文」における、依存の表と同じ内容であった Stub 固定に関する冗長な説明を削除しました。

## 3. 申し送り

- npm run docs:build は未実行。sample 記述ルールの最終チェック項目だが plan の検査に含まれないため、必要なら別に実行して確認する。

## 4. 進め方と実践の型の適用

既存の 1 文書の中の冗長さを削り、意味を保ったまま $ ext{delete}$、$ ext{merge}$、$ ext{reference}$ を用いて整理しました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `## 3. 対象外 / receipt-print の項目の末尾の文` | `table-prose` | `delete` | `「本 term では印刷を成功 Stub に固定し、会計記録への影響だけを見る」は、「結合境界/依存/環境前提」の依存の表の receipt-print 行（Stub（成功を返す）、印刷結果を期待値に含めない）と同じ説明。表に決定が残っているため意味を保てる` | `document` |
| `## 1. 概要 / 第2段落（役割分担と ready 化の手順）` | `canonical-restatement` | `retain` | `この sample の担当者と、ready 化の前に満たす条件（証跡がテストコードと CI run へ辿れること）を示す固有の内容で、共通運用の再掲ではない` | `document` |
| `## 2. 責務 / 各項目の具体値（例: 在庫5→3個）` | `repetition` | `retain` | `rulebook の記述ガイド「責務（結合として保証）」が、観測できる成果を添えるよう求めているため` | `document` |
| `## 4. 結合境界/依存/環境前提 / 観測点の項目` | `repetition` | `retain` | `rulebook の記述ガイドが観測点の整理を認めており、対象全体の観測点のまとめとしてケース表の判断を助けるため` | `document` |
| `## 6. テスト観点とケース / 各ケース表の境界/依存の列` | `repetition` | `retain` | `表の 1 行が 1 テストで、各行に書く必須の列のため` | `document` |
