---
specdojo:
  id: prj-0001:pjr-ns8y-parent-validation-build-format-ids
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T06:06:51Z"
  due_on: "2026-10-31"
---

# PJR-NS8Y parent_validations の許可リストにプロダクトリポジトリ向けの build と format の ID がない

## 1. 課題内容

parent_validations の { id, repo } でプロダクトリポジトリの検証を親 runner に任せられるが、許可リストは validate-schema・typecheck・test-unit・test-integration・lint-ts・lint-fm・lint-md だけで、build や format:check がない。agent の sandbox では npm を実行できないため、プロダクトリポジトリのビルドと整形の検査は毎回人が確認している

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
