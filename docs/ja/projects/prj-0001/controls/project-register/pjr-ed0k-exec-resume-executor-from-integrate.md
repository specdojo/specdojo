---
specdojo:
  id: prj-0001:pjr-ed0k-exec-resume-executor-from-integrate
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-15T10:47:32Z"
  derived_from:
    - PJR-52EE
  commit_type: feat
  commit_scope: exec
---

# PJR-ED0K 統合の段で止まった schedule のタスクを、executor の段からやり直せるようにする

## 1. 概要

統合の段の失敗から、成果を保ったまま executor の段へ戻して再開する手段を用意する

## 2. 入力

- 2026-11-15、bds-progress-report-005 と ifx-file-agent-evidence-005 が統合の段で止まり、exec resume --resume-from executor が「cannot resume the executor from the integrate stage」で使えなかった。orchestrator が blob から記録を戻し、成果物を手で直して統合をやり直した（PJR-TN43 の D）

## 3. 完了条件

- 統合の段（commit・検査・merge）で止まった schedule のタスクを、worktree の成果を保ったまま executor の段からやり直せる。`exec resume --task <id> --resume-from executor` が「cannot resume the executor from the integrate stage」で断らない。
- やり直すとき、統合の段で stage した変更・run の記録（evidence・pipeline-state・result・ログ）を失わない。失う操作が要る場合は、先に控えるか止める。
- 統合の段の失敗の理由（検査の名前、commit の対象外のパス、merge の失敗など）と次の操作を、block の理由と result に残す。
- 統合の段で止まったタスクに develop の直しを取り込む正規の手段（runner が行う同期）を用意するか、使い方を書く。orchestrator が worktree で `git merge` や `git merge --abort` を流さずに済む。
- 統合の段で止まった場合と、そこから executor の段へ戻す場合を、回帰テストで確かめている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。保護された設定の変更は、変更案を書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ |
| --- | ------------------------------------------------ | ---- | ---- | ---- |
| 1   | 統合の段から executor の段へ戻す再開を足す       | DEV  | open | -    |
| 2   | 成果と記録を保つ扱いと、develop の取り込みを足す | DEV  | open | -    |
| 3   | block の理由と回帰テストを足す                   | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
