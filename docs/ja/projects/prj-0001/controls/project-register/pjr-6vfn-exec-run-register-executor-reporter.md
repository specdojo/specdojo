---
specdojo:
  id: prj-0001:pjr-6vfn-exec-run-register-executor-reporter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: ARC
  registered_at: "2026-08-20T13:30:02Z"
  due_on: "2026-08-31"
---

# PJR-6VFN exec run --register で executor 成功後に reporter だけを再開できるようにする

## 1. 概要

register 由来の exec 実行には resume の概念が無く、reporter が rate limit などで失敗すると、タスク全体を再実行するしかない。再実行は discardStaleExecWorktree により worktree と exec ブランチを強制削除するため、executor が生成した未コミットの成果を失う。一方で pipeline-state.json には stage 別の状態が、evidence.json には executor の変更一覧・検証結果・final message が残っており、reporter の再開に必要な入力は揃っている。executor が succeeded の run を検出し、reporter 段だけを再実行して result 記入から統合・register 遷移までを完了できるようにする。

## 2. 完了条件

- executor が `succeeded` で reporter が未完了（`rate_limited` / `failed`）の run を、worktree と executor の未コミット成果を破棄せずに再開できる。
- 再開は reporter 段だけを実行し、executor を再実行しない。
- 再開は対象 run の `pipeline-state.json` と `evidence.json` を入力とし、result の記入と status 更新、成果物の commit、統合ブランチへの merge、register の review 遷移まで、通常の成功経路と同じ結果になる。
- 対象 run が存在しない場合や executor が `succeeded` でない場合は、worktree の削除などの破壊的操作を行わず、理由を示して終了する。
- 再開が再び rate limit で失敗した場合は、worktree と executor の成果を保持したまま waiting へ戻り、再度の再開ができる。
- executor 成功後にタスク全体を再実行しようとした場合、未コミット成果を失うことへの警告または保護が働く。
- reporter 再開、executor 未完了時の拒否、再開の再失敗、既存 worktree の再利用を検証する unit test / integration test が追加されている。
- 再開手順がコマンドリファレンスと exec 運用ガイドに記載されている。

## 3. 作業内容

| No  | 作業                                                                                            | 担当 | 状態 | メモ                                                                                       |
| --- | ----------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------ |
| 1   | 再開の CLI 形と対象 run の特定方法を決める                                                      | ARC  | open | `exec resume --register <PJR-ID>` と `exec run --register --resume` のどちらにするかを含む |
| 2   | `pipeline-state.json` と `evidence.json` から reporter 再開に必要な入力を復元する               | ARC  | open | plan prompt、evidence、result パス、worktree の対応付けを確認する                          |
| 3   | reporter 段のみを実行し、成功時に commit・merge・register review まで通常経路と同じ後処理を行う | ARC  | open | 成功経路の処理を再利用し、分岐を二重に持たない                                             |
| 4   | 対象 run 不在、executor 未完了、再開の再失敗の扱いを実装する                                    | ARC  | open | いずれの場合も破壊的操作を行わない                                                         |
| 5   | executor 成功後の全体再実行に警告または保護を入れる                                             | ARC  | open | `discardStaleExecWorktree` が未コミット成果を破棄する経路が対象                            |
| 6   | unit test / integration test を追加する                                                         | ARC  | open | 再開、拒否、再失敗、worktree 再利用を検証する                                              |
| 7   | コマンドリファレンスと exec 運用ガイドを更新する                                                | ARC  | open | 再開手順と、再実行との使い分けを記載する                                                   |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 事象が発生した run: [[prj-0001:pjr-strg-deterministic-dct-strategy-generation|PJR-STRG DCTとsch-strategyの決定論的ジェネレーター実装]]
- 手動対応の経緯を記録した result: [[prj-0001:xer-pjr-strg-20260818t230101z-0889|PJR-STRG Edit Result]]
- 同じ run から派生した課題: [[prj-0001:pjr-cmyx-exec-dist-parent-validations|PJR-CMYX exec 実行が古い dist ビルドを使い設定済み parent_validations が実行されない]]
- 実装箇所: `src/exec-run.ts` の `runRegisterAgentPipeline`、`src/exec-worktree-ops.ts` の `discardStaleExecWorktree`
- 手順の記載先: [[specdojo:command-reference|コマンドリファレンス]]、[[specdojo:exec-operation-guide|exec 運用ガイド]]
