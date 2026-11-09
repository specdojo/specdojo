---
specdojo:
  id: prj-0001:pjr-z4h8-parallel-review-grade-sidecar-conflict
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-09T13:39:23Z"
  derived_from:
    - PJR-2GD6
---

# PJR-Z4H8 並べて流す review の段が、主の作業ツリーの grade の進み具合のファイルを取り合って統合の前に止まる

## 1. 課題内容

schedule の review の段を --parallel で流すと、ある run の grade が主の作業ツリーの grade/pipeline の進み具合のファイルを書き換え、ほかの run が統合の前に Grade sidecar changed after checkpoint で止まる。grade の agent が権限で失敗した場合にも書き換わる。原因を特定して解消する

## 2. 入力

- 2026-11-09、business-specs-reps の review の段で、ccd-project-planning-090 の grade（opencode の agent）がコマンドの実行を権限で拒まれて失敗し、grade/pipeline/ccd-project-planning-b57132c2f259.json が書き換わった。clis・sf・ifx-cmd の review の 3 件が統合の前にこのファイルの変更を検出して止まった。
- orchestrator がそのファイルを commit した版に戻し、3 件を 1 件ずつ再開した（indie が承認）。ccd の review の grade の agent の権限の問題は未解決。

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
