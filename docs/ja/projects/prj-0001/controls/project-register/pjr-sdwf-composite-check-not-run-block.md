---
specdojo:
  id: prj-0001:pjr-sdwf-composite-check-not-run-block
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-07T21:32:21Z"
  due_on: null
---

# PJR-SDWF executor が npm run check を not_run とすると、中身が通っていても block される

## 1. 課題内容

executor が npm run check を「親 runner の検証と重複する」として not_run と記録すると、runner は check という合成コマンドを実行しないため、中身（typecheck・lint・schema・test など）が runner と executor の検証ですべて通っていても block する。PJR-EZAF と PJR-WPR3 で発生。check の中身を展開して判定する。

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
