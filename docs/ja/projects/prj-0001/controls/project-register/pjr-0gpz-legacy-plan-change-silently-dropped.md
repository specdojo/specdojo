---
specdojo:
  id: prj-0001:pjr-0gpz-legacy-plan-change-silently-dropped
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: hard
  registered_at: "2026-11-28T14:42:44Z"
---

# PJR-0GPZ 旧い置き場の plan・result への変更が commit の範囲から黙って外され、run が成功で終わる

## 1. 課題内容

worktree の統合で exec/plans・exec/results の変更が除外されても範囲の外として報告されず、run が success で終わって worktree も消えるため、executor の成果が黙って失われる

## 2. 入力

- 起票の元は prj-0002 の PJR-TC7V。prj-0001 の同期ブランチの設定が prj-0002 を知らず --from で指せないため、ここに書く。
- 2026-11-28 の prj-0002 の PJR-TC7V の run（pjr-tc7v-20261128T143432Z-b41e58b6）で観測した。executor は exec/plans の pjr-9tsg の plan の 1 行を直したが、統合の commit 3a222eaf6d に含まれず、run は success・transition=review で終わり、worktree も片付けられた。
- src/exec/worktree-ops-commit.ts の partitionCommitTargets は、isCommitTargetPath で除外したパスのうち isRunRecordPath（runs/ 配下）に当たるものだけを outOfScope に入れて報告する。isPlanOrResultRecord が当たる旧い置き場（exec/plans・exec/results）の変更は、報告されずに捨てられる（specdojo-orchestrator がコードで確かめた）。
- 同じ項目の 1 回前の試行では、runs/ 配下の別の run の plan.md の変更は commit-scope: integration blocked として正しく止まった。

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
