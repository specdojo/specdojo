---
specdojo:
  id: prj-0001:pjr-rkhr-schedule-resume-from-executor
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
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

- `exec resume --task <task-id> --resume-from executor` で、pipeline のタスクを executor の段からやり直せる。対象は、executor が成功して reporter の段で `blocked` になったタスクと、`doing` のまま中断したタスクとする。残っている worktree と前の試行の変更をそのまま引き継ぎ、executor の試行回数を 1 増やして、executor・reporter・統合の順に進める。`blocked` から再開するときは、状態遷移のイベントを記録する
- executor は worktree にある plan を読む。止まった後に worktree の plan を直してから再開すると、直した plan が使われる
- 再開できない場合（統合の段で止まっている、executor が成功していない、pipeline ではないタスク、`--resume-from` に `executor` 以外を渡した）は、理由を示して止まる。オプションの名前と制約は `exec run --register` の `--resume-from` とそろえる。共通にできる処理は `src/exec/register-resume.ts` と共有し、重複させない
- 単体テストと、実際の worktree を使う統合テストで、上の 3 項目を確かめる
- `docs/ja/specdojo/guides/exec-operation-guide.md` の「blockedタスクの復帰」の表と、`docs/ja/specdojo/references/command-reference.md` に追記する。plan を直して再開するときは、result に経緯を残す手順を書く。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証が通る
- 統合の後に、orchestrator が止まっている `T-DATA-FLOW-USAGE-cdfd-overview-010` で実際に使い、動作を確かめる（executor の作業ではない）

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | exec resume に --resume-from executor を足す   | DEV  | open | -    |
| 2   | 単体テストと統合テストを足す                   | DEV  | open | -    |
| 3   | ガイド・コマンドリファレンス・CHANGELOG に書く | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:exec-operation-guide]]
- [[specdojo:command-reference]]
