---
specdojo:
  id: prj-0001:pjr-c44h-plan-frontmatter-name-yaml-escape
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T13:53:49Z"
---

# PJR-C44H plan の frontmatter の name に個票の H1 のエスケープが残り YAML が不正になる

## 1. 課題内容

個票の H1 は Markdown 整形でアスタリスクなどが \* にエスケープされる。plan 生成がこれをダブルクォートの YAML 文字列へそのまま入れるため、不正なエスケープとなり VitePress の docs:build が失敗した（PJR-Y06Y の plan）

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
