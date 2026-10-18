---
specdojo:
  id: prj-0001:pjr-6ef8-npm-init-placeholder-test-script
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T12:45:37Z"
  derived_from:
    - PJR-Z104
---

# PJR-6EF8 npm init の仮の test script があると not_applicable が退けられて最初の実行が止まる

## 1. 課題内容

npm init -y は package.json に test の仮の script（echo "Error: no test specified" && exit 1）を入れる。LP の手順どおりに作ったリポジトリで 0.4.0 の tarball を試すと、executor は npm test を not_applicable と報告したが、runner は test の script があるため当てはまると判定して退け、executor validation failed or not run: npm test で waiting にした（2026-10-18）。LP の手順で導入した利用者は全員がここで止まる

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
