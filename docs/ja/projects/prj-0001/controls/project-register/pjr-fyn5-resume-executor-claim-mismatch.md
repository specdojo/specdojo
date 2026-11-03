---
specdojo:
  id: prj-0001:pjr-fyn5-resume-executor-claim-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  difficulty: hard
  owner: ARC
  registered_at: "2026-11-03T12:53:45Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-GQN3
  commit_type: fix
  commit_scope: exec
---

# PJR-FYN5 executor から再開して executor を替えると統合の前に止まる

## 1. 課題内容

exec resume --resume-from executor --executor-by で別の agent に替えても claim が元の agent のまま残り、完了の前の確認で「別の actor が作業中」として止まる

## 2. 入力

- 2026-11-03 に T-DATA-FLOW-UC-REWRITE-cdfd-uc-schedule-020 を opus-executor の claim のまま exec resume --resume-from executor --executor-by sol-executor で再開したところ、executor・親の検証・reporter は通ったが、「completion preflight failed: task is being worked on by another actor: opus-executor」で統合の前に止まった
- その後、--executor-by なしの exec resume --task で再開すると、claim の持ち主の opus-executor で executor から流し直して完了した（2026-11-03）
- 直し方の案: executor を替えて再開するときは claim を新しい agent へ移す（release と claim の event を残す）、または完了の確認で再開時に指定した executor を許す。PJR-RKHR で入れた --resume-from executor の動きに関わる（2026-11-03）

## 3. 影響範囲

| 観点         | 影響                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| スコープ     | `exec resume --resume-from executor` と `--executor-by` で executor を替えたときの claim と、完了の前の確認 |
| スケジュール | executor を替えて再開すると、作業と検証が通ったあとに統合の前で止まり、元の agent で流し直す必要がある      |
| コスト       | 中くらい                                                                                                    |
| 品質         | executor を替えた再開が完了できず、作業がやり直しになる                                                     |
| 関係者       | schedule のタスクを再開する利用者                                                                           |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | executor を替えて再開しても claim は元の agent に残り、完了の前の確認が「別の actor が作業中」として止める                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 対応策   | executor を替えて再開するときは、claim を新しい agent へ移す（release と claim の event を残す）か、完了の前の確認で再開時に指定した executor を許す。どちらにするかを選択肢と理由とともに個票の対応結果に記録して決める                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 依存事項 | PJR-MERV と同じ runner の段に触れるため、PJR-MERV の統合のあとに流す                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 完了条件 | claim の持ち主と違う executor を `--executor-by` に指定して `exec resume --task <id> --resume-from executor` で再開したとき、executor・親の検証・reporter・統合まで通り、完了の event がどの actor で記録されたかが分かることを、統合のテストで確かめている。`--executor-by` を指定しない再開の動きは今と変えない。exec の運用ガイドの再開の節に、executor を替えたときの claim の扱いを書いている。作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流し、親の検証（test-integration を含む）が通る。CHANGELOG は未公開の版の節（Unreleased）に書き、公開済みの版の節を変えない。保護された設定（`.specdojo/**`・`package.json` など）は変えず、必要なら案を個票の対応結果と報告の handoff に書く。未決の点は executor が決め、理由を個票の対応結果に記録する |

## 5. 対応結果

### 方式の選択肢と決定理由

- **選択肢**:
  - **案 A（採用）**: executor 段から再開するときに `--executor-by` で元の claim の持ち主と異なる executor が指定された場合、元の actor による `release` イベントと新しい executor による `claim` イベントを記録して claim を新しい executor へ移し、`PreparedTask.actor` も新しい executor に揃える。
  - **案 B（不採用）**: 完了前の確認（`readCompletionPreflight`）で、再開時に指定した executor を元の claim の持ち主と異なっていても許可する。
- **決定理由**:
  - 統合後の完了処理（`spawnComplete`）および失敗時の中断処理（`spawnBlock`）は、別プロセスの CLI（`specdojo exec complete --by <actor>` / `specdojo exec block --by <actor>`）を起動し、イベントログを畳み込んだ状態の `last_by` と `--by` が一致することを `canCompleteTask` / `canBlockTask` で検査する。案 B のように統合前の `readCompletionPreflight` だけを緩めても、イベントログ上の `last_by` が元の actor のまま残っていると、worktree を統合・削除した直後の `spawnComplete` や中断時の `spawnBlock` が `task is being worked on by another actor` で失敗するほか、並列実行時の `collectBusyActors` でも稼働中の actor を誤認する。
  - 案 A で `release` と `claim` のイベントを記録して `last_by` を新しい executor に移すことで、`readCompletionPreflight`・`exec complete`・`exec block`・`collectBusyActors` のすべてでイベントログの状態（`state: "doing"`、`last_by: <新しい executor>`）が一貫し、`complete` イベントも実際に作業を完遂した新しい executor の actor で記録され、誰から誰へ引き継がれたかの履歴（`claim` → `release` → `claim` → `complete`）もイベントログに残るため、案 A を採用した。

### 解決内容

- `src/exec/run/schedule-prepare.ts`:
  - `prepareSingleTask` で `skipClaim: true` かつ `stageAgentOverrides.executor`（`--executor-by`）が指定され、再開段が `reporter` 以外（executor 段からの再開）である場合、解決した新しい executor の actor を `PreparedTask.actor` に設定するように変更した。
  - `findClaimEventPath` に worktree 参照（`worktreeRef`）を渡し、既存 worktree がある場合は worktree 内にチェックポイントされた初回 `claim` イベントファイルを優先して返すようにした。これにより、再開時に root 側で新しい `claim` イベントを追加しても、統合時の `releaseRootPaths` が初回チェックポイントの `claim` イベントファイルを対象に維持する。
- `src/exec/run/lifecycle-commands.ts`:
  - `runResumeMode` で、`unblock` のメモリ投影前の初期状態（`initialTaskStates`）を保持し、executor 段からの再開または `--executor-by` 指定時は `unblock` イベントの即時書き出しを保留して `prepareSingleTask` の解決後に判定するようにした。
  - executor 段からの再開（`prepared.pipelineResumeStage` が `reporter` / `integrate` 以外）で `prepared.actor !== previousActor` の場合、元の actor による `release` イベント（`pipeline_resume_released=true`、`replaced_by=<新しい actor>`）と新しい executor による `claim` イベント（`pipeline_resume_claimed=true`、`previous_actor=<元の actor>`、および `agent_pipeline`・`pipeline_stage`・`pipeline_state_ref` などのメタデータ）を記録し、スナップショットを `state: "doing"`・`last_by: prepared.actor`・`last_type: "claim"` に更新するようにした（`--dry-run` 時はイベントを書き出さない）。
  - `--executor-by` を指定しない場合や同じ executor で再開する場合、および reporter 段・統合段のみを再開する場合は従来どおり既存の claim を維持し、`blocked` から同じ actor で再開する場合のみ保留していた `unblock` イベントを記録する。
- `src/exec/events.ts`:
  - `readAllEventFiles` に `orderSameTimestampEventsByState` を追加し、同一 `task_id`・同一秒（`ts`）内に複数のイベント（`release` と再 `claim` など）が記録された場合、固定の種別順ではなく、それまでのタスク状態から有効な状態遷移順（`doing` / `blocked` からは `release` → `todo` → `claim` → `doing`）に沿って並べるようにした。
- 文書更新:
  - `docs/ja/specdojo/guides/exec-operation-guide.md` の「2.2. blockedタスクの復帰」に、executor 段からの再開時に `--executor-by` で別の executor を指定したときの claim の扱い（`release` と `claim` イベントによる引き継ぎと `complete` イベントの記録先、`--executor-by` 省略時の動作）を追記した。
  - `CHANGELOG.md` の `## [Unreleased]` 節に本修正を追記した（公開済みの版の節は変更なし）。

### 確認結果

- `tests/src/exec/pipeline-e2e.integration.test.ts` に統合テストを追加し、`blocked` および `doing` の双方の状態から `exec resume --task <id> --resume-from executor --executor-by cloud-expert-executor`（元の claim は `local-gemma-executor`）で再開したとき、`--dry-run` で状態が変わらないこと、本実行で executor・親の検証・reporter・統合・worktree 削除まで完了すること、イベントログに `local-gemma-executor` の `release` と `cloud-expert-executor` の再 `claim` が記録され、`complete` イベントが新しい executor である `cloud-expert-executor` で記録されることを確認した。また、`--executor-by` を指定しない既存の再開テストもそのまま通ることを確認した。
- `tests/src/exec/events.test.ts` に単体テストを追加し、同一秒内に `release` と新しい actor の `claim` が記録された場合に `release` → `claim` の順で畳み込まれ、`last_by` が新しい actor になることを確認した。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit` を実行し、すべて通過することを確認した。
- 保護された設定（`.specdojo/**`、`package.json` など）の変更は不要であり、変更していない。

### 再発防止策

- `exec resume` で stage agent を上書きする経路では、イベントログ上の `last_by` と runner が完了・中断に使う `PreparedTask.actor` が常に一致するよう、E2E 統合テストで `doing` / `blocked` 両方からの `--resume-from executor --executor-by` 再開と完了後の `complete` イベントの `by` を継続的に検証する。

## 6. 関連ドキュメント

- [[prj-0001:pjr-gqn3-data-flow-uc-rewrite]]
- [[prj-0001:pm-orchestrator-playbook]]
