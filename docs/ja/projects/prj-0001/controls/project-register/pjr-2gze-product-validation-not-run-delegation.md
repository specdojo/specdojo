---
specdojo:
  id: prj-0001:pjr-2gze-product-validation-not-run-delegation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T15:00:34Z"
---

# PJR-2GZE プロダクトリポジトリの検証を not_run の委譲先として満たせない

## 1. 課題内容

executor が not_run と記録したプロダクトリポジトリの検証（例: npm --prefix specdojo-lp run build）は、runner がプロジェクト側で同じコマンドを通した場合しか満たされず、repo 指定の親検証でも解消できないため run が必ず止まる

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
