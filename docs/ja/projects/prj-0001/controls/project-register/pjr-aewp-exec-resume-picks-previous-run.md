---
specdojo:
  id: prj-0001:pjr-aewp-exec-resume-picks-previous-run
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-27T12:33:45Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-86RK
---

# PJR-AEWP worktree の用意で止まった run の --resume が、統合済みの前の run の統合をやり直す

## 1. 課題内容

同じ項目に統合済みの前の run があると、用意の段で止まった新しい run を --resume したとき、前の run の状態を拾って統合の段から再開し、executor が動かないまま統合に失敗する

## 2. 入力

- 2026-11-27 の PJR-86RK: 1 回目の run（pjr-86rk-20261127T105508Z-a3432ad6）は統合済み。2 回目の run（pjr-86rk-20261127T122100Z-b1757966）は worktree の用意で止まり、plan と result だけがあった
- exec run --register PJR-86RK --worktree --resume は「Syncing integration targets before integrate resume」として 1 回目の run の pipeline-state を使い、親の検証の後、統合の commit が index-build（生成した登録簿の索引がない）で失敗して waiting になった。develop の作業ツリーと index は汚れなかった

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
