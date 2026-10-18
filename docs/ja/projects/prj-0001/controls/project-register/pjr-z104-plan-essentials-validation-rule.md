---
specdojo:
  id: prj-0001:pjr-z104-plan-essentials-validation-rule
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T12:23:00Z"
  derived_from:
    - PJR-2219
---

# PJR-Z104 plan の要点に検査の扱いがなく、新しいリポジトリの最初の実行が止まる

## 1. 課題内容

2219 で plan の共通の規約を参照へ改めた後、plan の本文に残す要点に検査の扱い（当てはまる検査を流し、当てはまらない検査は not_applicable と理由を報告する）が入っていない。0.4.0 の tarball を空のリポジトリへ入れて exec run --register --worktree を流すと、executor（sonnet-executor）は参照先を読まずに command none・not_run と報告し、runner は executor validation failed or not run で waiting にした（2026-10-18）。0.3.1 では同じ手順で通っていた

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
