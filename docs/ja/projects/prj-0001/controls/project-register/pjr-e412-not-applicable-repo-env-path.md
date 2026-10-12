---
specdojo:
  id: prj-0001:pjr-e412-not-applicable-repo-env-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T06:06:37Z"
  due_on: "2026-10-31"
---

# PJR-E412 SPECDOJO_REPO_* で指定したプロダクトリポジトリのコマンドを not_applicable の判定が認識しない

## 1. 課題内容

runner は agent に `SPECDOJO_REPO_<NAME>` でプロダクトリポジトリの場所を渡すが、not_applicable の判定（productRepoCommand）は --prefix `<repo>` と `<repo>`:`<path>` しか認識しない。$SPECDOJO_REPO_SPECDOJO_LP/... のコマンドがプロジェクトリポジトリの package.json で判定され、正しい not_applicable が却下されて run が止まる

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
