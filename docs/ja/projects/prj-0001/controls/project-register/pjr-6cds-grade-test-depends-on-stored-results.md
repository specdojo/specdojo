---
specdojo:
  id: prj-0001:pjr-6cds-grade-test-depends-on-stored-results
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-16T22:32:48Z"
  due_on: null
---

# PJR-6CDS grade の単体テストがリポジトリの実際の評価結果に左右される

## 1. 課題内容

tests/src/grade.test.ts の plan の生成のテストが、リポジトリの本物のサンプルと保存済みの評価結果を読む。定期評価で opr-batch-sample の指摘の anchor に見出しが入り、plan に載ったため、2026-10-17 05:00 の kata の Run の review の検証で失敗した。Run を統合すると develop でも失敗する

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
