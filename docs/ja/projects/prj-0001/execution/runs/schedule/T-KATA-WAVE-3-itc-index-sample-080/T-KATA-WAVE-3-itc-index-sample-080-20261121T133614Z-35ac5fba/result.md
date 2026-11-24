---
specdojo:
  id: prj-0001:xer-t-kata-wave-3-itc-index-sample-080-20261121t133614z-35ac5fba
  type: exec-result
  task_id: T-KATA-WAVE-3-itc-index-sample-080
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-3-itc-index-sample-080/T-KATA-WAVE-3-itc-index-sample-080-20261121T133614Z-35ac5fba/plan.md
  started_at: "2026-11-21T13:36:18.866Z"
  completed_at: "2026-11-21T13:45:13.734Z"
  agent: opus-executor
  execution: agent
  approach: condense
  targets:
    - specdojo:itc-index-sample
  condense_records:
    - location: 内部結合テスト共通の境界/依存の扱い 本文（合格基準の例）
      category: repetition
      action: merge
      reason: The re-send example repeated the expected value of it-sales-checkout-persistence-integrity-020 in the ケース表の共通カラム chapter. The DB update-refusal example still shows an observed-value expectation covering both the response and the DB diff, so the completion condition is kept.
      cause:
        type: document
    - location: 対象外・除外理由（共通） 表 receipt-print 行の例外列
      category: repetition
      action: delete
      reason: The Stub response kinds (success / failure / no response) are defined in the receipt-print row of the 内部結合テスト共通の境界/依存の扱い table. The exception decision (なし) and the observation scope (impact on the sales record only) are kept.
      cause:
        type: document
    - location: 内部結合テスト共通の境界/依存の扱い 表 業務記録 DB 行の例外列
      category: repetition
      action: delete
      reason: Using Fake in UT and not in IT is already conveyed by the UT row of the test-level table and the test-double row of the same table. The exception decision (なし) is kept.
      cause:
        type: document
    - location: ケース表の共通カラム 末尾のレビュー確認の段落
      category: canonical-restatement
      action: retain
      reason: It assigns the checking owner (QE) for this system, and the _TODO_ row in メモ / 将来課題 references it as the interim substitute, so it is decision information that the rulebook reference alone cannot replace.
      cause:
        type: document
    - location: 本ドキュメントの目的と適用対象 テストレベル表の非機能テスト行 / 対象外・除外理由（共通）の応答時間行
      category: table-prose
      action: retain
      reason: 'Both are tables the rulebook requires, with different roles: one is the boundary between test levels, the other is the exclusion reason and alternative means.'
      cause:
        type: document
---

# Condense Result

## 1. 実施内容

- 対象文書 `docs/ja/specdojo/samples/itc-index-sample.md` の冗長さを整理しました。
- 具体的には、ケース表の共通カラムにおける期待値の再掲、および `内部結合テスト共通の境界/依存の扱い` テーブル内の重複していた例外情報を削除しました。
- 一方で、チェックの所有権を定義する段落や、rulebook が求める必須のテーブル（テストレベルの境界と除外理由）は、意味を維持するために保持しています。
- `prettier` および `docs:build` による検証を通過しています。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/itc-index-sample.md`: 冗長な再掲（期待値の例）と、他のテーブルと重複する例外列（Stub の応答形式および業務記録の例外判断）を削除し、文書を簡潔に整理しました。

## 3. 申し送り

- 適用外の検証: `npm run validate:history-links`（Only the sample under docs/ja/specdojo/samples was changed; no plan/result/register ticket was changed）
- 適用外の検証: `npm run validate:catalog`（The only changed file is docs/ja/specdojo/samples/itc-index-sample.md, outside docs/ja/projects/）

## 4. 進め方と実践の型の適用

冗長さを削ぎ落とし、意味と必須情報を維持しつつ、文書の密度を高めるアプローチをとりました。

## 5. 修正・保持の記録

| 場所（修正前） | 種類 | 直し方 | 残した理由／意味の維持 | 原因 |
| --- | --- | --- | --- | --- |
| `内部結合テスト共通の境界/依存の扱い 本文（合格基準の例）` | `repetition` | `merge` | `The re-send example repeated the expected value of it-sales-checkout-persistence-integrity-020 in the ケース表の共通カラム chapter. The DB update-refusal example still shows an observed-value expectation covering both the response and the DB diff, so the completion condition is kept.` | `document` |
| `対象外・除外理由（共通） 表 receipt-print 行の例外列` | `repetition` | `delete` | `The Stub response kinds (success / failure / no response) are defined in the receipt-print row of the 内部結合テスト共通の境界/依存の扱い table. The exception decision (なし) and the observation scope (impact on the sales record only) are kept.` | `document` |
| `内部結合テスト共通の境界/依存の扱い 表 業務記録 DB 行の例外列` | `repetition` | `delete` | `Using Fake in UT and not in IT is already conveyed by the UT row of the test-level table and the test-double row of the same table. The exception decision (なし) is kept.` | `document` |
| `ケース表の共通カラム 末尾のレビュー確認の段落` | `canonical-restatement` | `retain` | `It assigns the checking owner (QE) for this system, and the _TODO_ row in メモ / 将来課題 references it as the interim substitute, so it is decision information that the rulebook reference alone cannot replace.` | `document` |
| `本ドキュメントの目的と適用対象 テストレベル表の非機能テスト行 / 対象外・除外理由（共通）の応答時間行` | `table-prose` | `retain` | `Both are tables the rulebook requires, with different roles: one is the boundary between test levels, the other is the exclusion reason and alternative means.` | `document` |
