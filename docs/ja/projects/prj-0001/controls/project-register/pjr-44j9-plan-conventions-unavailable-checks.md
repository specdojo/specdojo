---
specdojo:
  id: prj-0001:pjr-44j9-plan-conventions-unavailable-checks
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-08T14:21:59Z"
  due_on: null
---

# PJR-44J9 exec plan の共通規約が、新しい利用者の環境で実行できない検査を求める

## 1. 課題内容

公開物での実地の確認（2026-10-08）で、init で作った新しいリポジトリで exec run を流すと、作業は済んだのに executor の検証の失敗で waiting になった。共通規約（xep-common-conventions-template.md）が、Markdown の変更に npx markdownlint（SpecDojo の依存ではない）を、docs/ja/projects/ 配下の変更に specdojo catalog validate（catalog_path がないと実行できない）を一律に求めるため。

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
