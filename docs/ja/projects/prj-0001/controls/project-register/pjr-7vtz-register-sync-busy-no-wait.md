---
specdojo:
  id: prj-0001:pjr-7vtz-register-sync-busy-no-wait
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-27T12:32:07Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-86RK
---

# PJR-7VTZ 専用ブランチが使用中だと、exec のイベントの書き込みが待たずに失敗する

## 1. 課題内容

inRegisterBranchSync が使用中ならすぐ例外を投げるため、register の記帳と重なった exec refresh が worktree の用意の段で失敗し、run が waiting になる

## 2. 入力

- 2026-11-27 の PJR-86RK の 2 回目で、worktree の用意の exec refresh が「Register branch project/prj-0001/register is busy; retry the schedule operation.」で失敗し、run が waiting になった。同じ時刻にオーケストレーターが PJR-G5DY の close を register ... --commit で記帳していた
- エラーは src/shared/register-branch.ts の inRegisterBranchSync が tryAcquirePoolSlot で枠を取れないときに投げる。非同期の inRegisterBranch は CrossProcessMutex で待つ

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
