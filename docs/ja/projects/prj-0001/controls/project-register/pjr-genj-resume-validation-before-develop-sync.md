---
specdojo:
  id: prj-0001:pjr-genj-resume-validation-before-develop-sync
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-01T04:30:54Z"
---

# PJR-GENJ reporter 段からの再開で develop を取り込む前に親検証を実行する

## 1. 課題内容

exec run --resume で reporter 段から再開すると、統合先ブランチの最新を worktree へ取り込む前に親検証を実行する。統合先で直した不具合が反映されず、同じ失敗を繰り返す。親検証の前に取り込むか、取り込み後に検証し直す

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
