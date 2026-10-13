---
specdojo:
  id: prj-0001:pjr-ca0s-docs-site-output-in-node-modules
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-13T14:33:33Z"
  due_on: null
---

# PJR-CA0S docs-site のビルド結果が node_modules の中へ出力される

## 1. 課題内容

@specdojo/docs-site 0.2.0 は outDir と cacheDir を package の中（node_modules/@specdojo/docs-site/.vitepress/dist）に置くため、利用者はビルドしたサイトを見つけにくく、npm ci で消える。README にも出力先の記載がない

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
