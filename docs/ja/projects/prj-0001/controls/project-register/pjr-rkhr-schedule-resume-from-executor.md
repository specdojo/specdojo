---
specdojo:
  id: prj-0001:pjr-rkhr-schedule-resume-from-executor
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-01T11:13:16Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GEZN
---

# PJR-RKHR schedule のタスクでも executor からやり直せるようにする

## 1. 概要

exec resume に --resume-from executor を足し、reporter の段で blocked になった、または doing のまま中断した pipeline のタスクを、残った worktree と変更を引き継いで executor からやり直せるようにする。worktree の plan を直してから再開すると、直した plan を使う

## 2. 入力

- schedule のタスク T-DATA-FLOW-USAGE-cdfd-overview-010 が、executor の未完了の報告で reporter の段の blocked になった。worktree の plan に追加の指示を足して executor からやり直したいが、--resume-from executor は exec run --register にしかなく、exec resume --task は reporter から再開するだけである（2026-11-01）
- 登録簿の側の実装は src/exec/register-resume.ts の resumeFrom（executorTarget に前の試行の変更を引き継ぐ）と src/exec/run/register-command.ts のオプションの検査にある
- 利用者は、試行を exec release で破棄するのではなく、schedule でも --resume-from executor を使えるように直す方針を選んだ（2026-11-01）

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
