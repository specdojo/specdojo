---
specdojo:
  id: prj-0001:pjr-979n-delegated-validation-block
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-06T10:25:34Z"
  due_on: null
---

# PJR-979N executor が親 runner へ委ねた検証を runner が通しても block される

## 1. 課題内容

deriveReporterFacts は executor の passed 以外の検証を一律に失敗とみなす。codex が sandbox で実行できない検証を not_run（親 runner へ委譲）と記録し、runner が同じコマンドを実行して passed になっても block される。PJR-27Y0 で発生。

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
