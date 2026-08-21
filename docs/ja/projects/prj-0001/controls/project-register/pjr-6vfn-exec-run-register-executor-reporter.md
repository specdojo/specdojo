---
specdojo:
  id: prj-0001:pjr-6vfn-exec-run-register-executor-reporter
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: ARC
  registered_at: "2026-08-20T13:30:02Z"
  due_on: "2026-08-31"
  conclusion: "agent exited with non-zero code: runner validation `test-integration`（`npm run test:integration`）が failed（exit 1）。runner 検証が failed の場合は complete を返せない。"
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

| No  | 作業                                                                                            | 担当 | 状態 | メモ                                                                                             |
| --- | ----------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------ |
| 1   | 再開の CLI 形と対象 run の特定方法を決める                                                      | ARC  | done | `exec run --register --worktree --resume` を採用。対象は worktree に残る最新 run                 |
| 2   | `pipeline-state.json` と `evidence.json` から reporter 再開に必要な入力を復元する               | ARC  | done | state に `artifacts`（plan / result 参照）を追加。旧 run は result ファイル名から復元            |
| 3   | reporter 段のみを実行し、成功時に commit・merge・register review まで通常経路と同じ後処理を行う | ARC  | done | `runRegisterReporterStage` と `finalizeRegisterWorktreeRun` を通常実行と共有                     |
| 4   | 対象 run 不在、executor 未完了、再開の再失敗の扱いを実装する                                    | ARC  | done | 拒否時は register も worktree も変更しない。再失敗時は worktree 保持のまま waiting               |
| 5   | executor 成功後の全体再実行に警告または保護を入れる                                             | ARC  | done | `discardStaleExecWorktree` の手前で中断し、`--resume` / `--force-restart` を促す                 |
| 6   | unit test / integration test を追加する                                                         | ARC  | done | `tests/src/exec-register-resume.test.ts` と `tests/src/exec-register-resume.integration.test.ts` |
| 7   | コマンドリファレンスと exec 運用ガイドを更新する                                                | ARC  | done | コマンドリファレンスへオプションと例、exec 運用ガイドへ `register実行のreporter再開` を追加      |

## 4. 対応結果

`exec run --register --worktree --resume` を追加し、executor が成功したまま reporter だけが失敗した run を、worktree と executor の未コミット成果を保持したまま reporter 段から再開できるようにした。

- 対象 run の特定と入力復元は `src/exec-register-resume.ts` に切り出し、worktree に残る run の `pipeline-state.json` と `evidence.json` から最新 run を選ぶ。最新 run が再開条件を満たさない場合は古い run へ遡らず、理由を返して終了する。
- reporter 段（`runRegisterReporterStage`）と統合・状態遷移（`finalizeRegisterWorktreeRun`）を通常実行と共有し、再開経路に後処理の分岐を二重に持たせていない。
- `pipeline-state.json` に任意項目 `artifacts`（plan / result の参照）を追加した。これを持たない旧 run は、worktree の result ファイル名から stem を復元して再開できる。
- executor が成功した run が残っている項目の全体再実行は、worktree 破棄の手前で中断する。破棄してやり直す場合は `--force-restart` を明示する。
- 検証は `tests/src/exec-register-resume.test.ts`（run 選択・入力復元・reporter 解決）と `tests/src/exec-register-resume.integration.test.ts`（再開成功、再実行拒否、worktree 不在時の拒否、オプション検証）で行う。

初回 run では親検証 `npm run test:integration` が failed となり、項目は waiting で止まった。原因は実装ではなく追加した integration テストの独立性の欠陥（worktree 基準パスを既定の共有パスに任せ、reporter 失敗経路で残る worktree を後片付けしていない。既存 E2E と同じ項目 ID を使用）であり、orchestrator が fixture ごとの専用基準ディレクトリ指定・後片付け・項目 ID の変更を適用した。修正後は `npm run test:integration` を連続 2 回実行して全件成功し、共有パスに残骸が残らないことを確認している。

残課題は次のとおり。

- in-place 実行（`--worktree` なし）の再開は未対応。executor の変更が作業ツリーに残り、ID 単位 commit の対象判別ができないため、現状は明示的に拒否している。
- 再開の並列実行は通常実行と同じ枠組みで動くが、複数項目の同時再開は検証していない。

## 5. 関連ドキュメント

- 事象が発生した run: [[prj-0001:pjr-strg-deterministic-dct-strategy-generation|PJR-STRG DCTとsch-strategyの決定論的ジェネレーター実装]]
- 手動対応の経緯を記録した result: [[prj-0001:xer-pjr-strg-20260818t230101z-0889|PJR-STRG Edit Result]]
- 同じ run から派生した課題: [[prj-0001:pjr-cmyx-exec-dist-parent-validations|PJR-CMYX exec 実行が古い dist ビルドを使い設定済み parent_validations が実行されない]]
- 実装箇所: `src/exec-run.ts` の `runRegisterAgentPipeline`、`src/exec-worktree-ops.ts` の `discardStaleExecWorktree`
- 手順の記載先: [[specdojo:command-reference|コマンドリファレンス]]、[[specdojo:exec-operation-guide|exec 運用ガイド]]
