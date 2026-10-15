---
specdojo:
  id: prj-0001:pjr-tmaw-result-frontmatter-block-reason-yaml
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-15T14:58:16Z"
  due_on: null
---

# PJR-TMAW result の frontmatter の block_reason に改行があると不正な YAML になる

## 1. 課題内容

exec-results.ts が frontmatter を文字列の連結で書き、block_reason を二重引用符で囲むだけのため、改行を含む理由の 2 行目以降が字下げされず YAML として不正になる。js-yaml 4 は読めたが 5 では deficient indentation で失敗し、3 件の過去の result が lint:fm で落ちる

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
