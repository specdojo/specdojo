---
specdojo:
  id: prj-0001:pjr-n9jc-docs-site-mermaid-error-tolerance
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-27T14:12:43Z"
  derived_from:
    - PJR-EVAE
---

# PJR-N9JC Mermaid の構文エラーで docs:dev と docs:build が止まる

## 1. 課題内容

@specdojo/docs-site の gen-mermaid-svg.ts は、ファイルがない場合以外の図の生成のエラーを投げ直すため、1 つの図の構文エラーで dev サーバーとビルドが止まる。エラーの図を警告して飛ばし、ほかのページを表示できるようにする。ビルドで失敗として扱うかは対応時に決める。

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
