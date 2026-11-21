---
specdojo:
  id: prj-0001:pjr-z807-resume-edited-plan-lost
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-01T12:30:43Z"
  due_on: "2026-11-30"
  completed_at: "2026-11-03T22:51:34Z"
  conclusion: executor から再開したとき worktree で直した plan が統合の commit に残るようにし、schedule と register の両方を統合テストで確かめた
  derived_from:
    - PJR-RKHR
---

# PJR-Z807 executor から再開したとき、直した plan が統合で元の plan に置き換わる

## 1. 課題内容

exec resume --resume-from executor で worktree の plan を直して再開すると、executor は直した plan を読むが、統合の commit には再生成した元の plan が入り、追加の指示が履歴に残らない

## 2. 入力

- T-DATA-FLOW-USAGE-cdfd-overview-010 を worktree の plan に追加の指示を足して --resume-from executor で再開したところ、統合時に runner が Discarding regenerated files in worktree: …-plan.md と出力し、統合された plan に追加の指示が残らなかった（2026-11-01）
- exec-operation-guide は、worktree の編集済み plan を executor と reporter へ渡すと書いている。今回の経緯は orchestrator が result に追記した（ad2da9ee0）

## 3. 影響範囲

| 観点         | 影響                                                                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `exec resume --task <task-id> --resume-from executor`（schedule のタスク）と、同じ仕組みを使う `exec run --register --resume --resume-from executor` の統合 |
| スケジュール | なし（今回の経緯は result に手で追記した）                                                                                                                  |
| コスト       | runner の統合処理とテストの修正                                                                                                                             |
| 品質         | executor が実際に読んだ指示が履歴に残らず、成果物の根拠をたどれない                                                                                         |
| 関係者       | DEV、plan を直して再開する orchestrator と利用者                                                                                                            |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `commitWorktreeChanges` のコミット対象判定（`isCommitTargetPath` および `resolveCommitScope`）が `exec/plans/` を常に除外していたため、worktree で直した plan が exec branch にコミットされず、統合時のマージで root 側の checkpoint 版で上書きされ、worktree 撤去時に破棄されていた。また登録簿の `--resume-from executor` 再開では、再開準備時（`register-resume.ts`）に root 側の plan を読んでおり直した plan が executor のプロンプトに渡っていなかった |
| 対応策   | executor から再開した run を統合するときは、worktree の直した plan を記録として残す                                                                                                                                                                                                                                                                                                                                                                          |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 完了条件 | 下記の条件をすべて満たすこと                                                                                                                                                                                                                                                                                                                                                                                                                                 |

完了条件の内訳。

- `exec resume --task <task-id> --resume-from executor` で、worktree の plan を直してから再開した run を統合すると、統合の commit に直した plan が入る。元の plan で上書きされない
- `exec run --register <PJR-ID> --resume --resume-from executor` でも同じ扱いになる（登録簿の側も同じ問題があれば直す。なければ、ないことを確かめて記録する）
- plan を直さずに再開した場合と、通常の run の統合の動きは変わらない
- 原因を個票の対応結果に記録する
- 実際の worktree を使う統合テストで、直した plan が統合の commit に残ることを確かめる
- `exec-operation-guide` の plan を直して再開する手順が、実際の動きと合っている。CHANGELOG は未公開の版の節に書き、公開済みの版の節は変えない
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` と親の検証が通る

## 5. 対応結果

### 5.1. 原因

1. **コミット対象からの除外**: `src/exec/worktree-ops-commit.ts` の `isCommitTargetPath` では `normalized.startsWith(`${executionRel}/exec/plans/`)` が常に `false` を返し、さらに schedule の `resolveCommitScope` の `allowedFiles` にもタスク自身の plan が含まれていなかった。このため、利用者が worktree の plan を編集して指示を補っても、統合段の `commitWorktreeChanges` でコミット対象（targets）に含まれず、exec branch にコミットされなかった。
2. **統合・撤去時の破棄**: exec branch に直した plan がコミットされないまま `mergeWorktreeIntoCurrent` が実行されると、root 側で解放された古い checkpoint 時の plan がそのままマージコミットに残り、worktree 撤去時（`removeWorktree`）に未コミット差分として残った直した plan が `Discarding regenerated files in worktree: ...-plan.md` として破棄されていた。
3. **登録簿再開での読み込み先**: `src/exec/run/register-resume.ts` において、`--resume-from executor` による再開時でも root 側の plan（`artifacts.planRef`）を読んでプロンプトを構築していたため、worktree 内で直した plan が executor に渡っていなかった。

### 5.2. 解決内容

1. **直した plan のコミット許可**: `src/exec/worktree-ops-commit.ts` に `allowEditedPlan` オプションを追加した。`isCommitTargetPath` および `resolveCommitScope` で該当タスク自身の `planRel` をコミット対象として許容できるようにし、`assertNoAgentReadyPromotion` では成果物ではない plan をスキップするようにした。
2. **executor 再開時の統合連携**: `src/exec/run/schedule-task.ts`（schedule 実行）および `src/exec/run/register-worktree.ts`（登録簿実行）の統合段で、executor から再開された run（`pipelineResumeStage === "executor"` / `resumedExecutor === true`）の場合に `allowEditedPlan: true` を `commitWorktreeChanges` へ渡すようにした。これにより、直した plan が exec branch にコミットされ、統合マージ後も履歴に残るようにした。plan を直さずに再開した場合や通常の run では `statusPaths` に plan が現れないため、従来のコミット・統合動作を維持する。
3. **登録簿 executor 再開での plan 読み込み修正**: `src/exec/run/register-resume.ts` で `target.stage === "executor"` のとき、worktree 内の編集済み plan（`worktreePlanPath`）が存在すればそれを優先して読み込んで executor と reporter のプロンプトに渡すように修正した（`runAgentPipeline` が記録する `plan_ref` の計算基準となる `planPath` は root 側のパスを維持する）。
4. **ガイドと履歴の更新**: `docs/ja/specdojo/guides/exec-operation-guide.md` の手順に、統合時に直した plan がコミットに含まれて元の plan で上書きされずに履歴に残る旨を追記した。また `CHANGELOG.md` の未公開節（`[Unreleased]`）に不具合修正を記録した。
5. **テストの拡充**: `tests/src/exec/pipeline-e2e.integration.test.ts` および `tests/src/exec/register-pipeline-e2e.integration.test.ts` で、worktree の plan を編集して `--resume-from executor` で再開した際に、統合完了後の root の plan が直した plan と一致しコミットログに含まれること、および plan を直さずに再開した場合には余分な plan コミットが入らないことを検証するアサーションを追加した。

### 5.3. 確認結果

- 統合テスト（`pipeline-e2e.integration.test.ts`、`register-pipeline-e2e.integration.test.ts`）において、schedule および register の双方向で、worktree の plan を直して `--resume-from executor` で再開した run を統合したときに、統合後の commit に直した plan が残り、元の plan で上書きされないことを確認した。
- plan を直さずに再開した場合に、統合の commit に不要な plan 差分が入らず従来の動きと変わらないことを確認した。

### 5.4. 再発防止策

- executor 再開経路において、人が worktree の plan を編集する運用（[[specdojo:exec-operation-guide]]）が存在する。指示書である plan は通常 agent の改ざんを防ぐためコミット除外対象となっているが、人が介在して明示的に `--resume-from executor` で再開した場合は指示書の追記を正当な履歴として統合段で永続化する。この区別を `allowEditedPlan` フラグで明示的に管理し、通常の run や自動実行で agent が plan を書き換えてもコミットされない保護を維持する。

## 6. 関連ドキュメント

- [[specdojo:exec-operation-guide]]
