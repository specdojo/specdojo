---
specdojo:
  id: prj-0001:pjr-3m8s-exec-result-frontmatter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-10T03:23:11Z"
  due_on: "2026-08-31"
---

# PJR-3M8S exec完了ガードがresultのfrontmatter破壊を検出できない

## 1. 課題内容

`downgradeUnfilledResult`/`isResultUnfilled` は result 本文の `_TODO_` 残存有無のみを検証し、result frontmatter の必須フィールド（`id`/`task_id`/`project_id`/`agent`/`approach`/`targets` 等）の欠落・改変を検出しない。ローカルモデル等が `_TODO_` を消しつつ frontmatter を独自形式へ書き換えた場合、success として扱われ commit/merge/complete まで進んでしまう（`T-DATA-FLOW-cdfd-agent-config-operation-070` で実際に発生）。frontmatter 必須フィールドの非空・scaffold 値との一致検証を追加する。

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
