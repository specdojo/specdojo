---
specdojo:
  id: prj-0001:pjr-rx14-night-register-env-leak
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  registered_at: "2026-11-10T21:29:34Z"
---

# PJR-RX14 夜間の register の実行の環境が、子の run の統合テストに漏れて落とす

## 1. 課題内容

rtn-night-approved-register（orchestrator night）が job の worktree の中から各項目の exec run を起動すると、子の run の親の検証で job-worktree.integration.test.ts の merge の commit の親が 1 つになり落ちる。同じテストは通常の環境では 13 件すべて通る。夜間の実行の環境の何が漏れているかを特定し、子の run を通常と同じ環境で動かす

## 2. 入力

- 2026-11-11 0:00 の夜間の実行で、PJR-7ZZR と PJR-99NS の 2 件が親の検証 test-integration で落ち、`max_consecutive_failures` 2 で残り 6 件が流れなかった。落ちたのは tests/src/exec/job-worktree.integration.test.ts の 5 件（expected [ '' ] to have a length of 2 but got 1 など、git log -1 --pretty=%P の親の数）。
- 子の run の worktree は /workspaces/specdojo-workspace/worktrees/worktrees/prj-0001-PJR-7ZZR のように job の worktree の下に入れ子になっていた。git の設定や環境変数（`GIT_*` など）が漏れている可能性がある。
- 直るまで rtn-night-approved-register は止めておく（orchestrator の案）。

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
