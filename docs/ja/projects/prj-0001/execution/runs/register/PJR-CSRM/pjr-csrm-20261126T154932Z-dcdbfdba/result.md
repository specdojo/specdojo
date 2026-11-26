---
specdojo:
  id: prj-0001:xer-pjr-csrm-20261126t154932z-dcdbfdba
  type: exec-result
  task_id: PJR-CSRM
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-CSRM/pjr-csrm-20261126T154932Z-dcdbfdba/plan.md
  started_at: "2026-11-26T15:49:33.814Z"
  completed_at: "2026-11-26T16:14:27.918Z"
  agent: sol-executor
  block_reason: "parent validation failed: lint-ts, typecheck"
---

# Edit Result

## 1. 実施内容

- 親の検証の終わりに気づくまでの遅れの原因だった、`src/exec/` 配下の同期処理（準備・merge・scheduler lock の待ち方など）を非同期化した。呼び出し元までPromiseに変更している。
- 一時リポジトリでの再現計測（npm ci・specdojo build・実Git merge を同期と非同期で各3回）では、非同期版の検出遅延は最大3msだった。計測条件・平均・最大は個票に記録済みで、一時スクリプトは削除した。
- 回帰テストを追加・更新し、運用ガイドを更新した。
- runner の親検証では `npm run lint:ts` と `npm run typecheck` が失敗している。`lint:ts` は `tests/src/exec/worktree-async.test.ts` の `import()` 型注釈が `consistent-type-imports` に違反している。`typecheck` は `tests/src/exec/task-repos.integration.test.ts` の1353行で、number が `void | Promise&lt;void&gt;` に代入できない型エラーを出している。どちらも未解消である。
- 実運用の目標（`detection_lag_ms` の平均5秒以下・最大30秒以下）の達成は未確認である。`--parallel 3` の実行は executor が行っておらず、統合後にオーケストレーターが確認する。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-worktree-guide.md`: worktree 操作の同期処理を非同期化した内容に合わせて、ガイドを更新した。
- `src/exec/commands.ts`: 非同期化した worktree 操作や準備処理を、Promise を返す形で呼び出すように変更した。
- `src/exec/core.ts`: 非同期化した処理に合わせて、呼び出しを調整した。
- `src/exec/events.ts`: 非同期化した処理に合わせて、呼び出しを調整した。
- `src/exec/register-foreign-wait.ts`: 非同期化した処理に合わせて、待機まわりの呼び出しを調整した。
- `src/exec/repo-integration.ts`: 統合まわりの同期処理を非同期処理に置き換えた。
- `src/exec/run/agent.ts`: 呼び出し元を非同期化した処理に追従させた。
- `src/exec/run/job.ts`: 呼び出し元を非同期化した処理に追従させた。
- `src/exec/run/lifecycle-commands.ts`: 呼び出し元を非同期化した処理に追従させた。
- `src/exec/run/register-post-review.ts`: 呼び出し元を非同期化した処理に追従させた。
- `src/exec/run/register-resume.ts`: 呼び出し元を非同期化した処理に追従させた。
- `src/exec/run/register-worktree.ts`: worktree の準備・merge まわりの呼び出しを非同期化した。
- `src/exec/run/schedule-prepare.ts`: 呼び出し元を非同期化した処理に追従させた。scheduler lock は待ち方だけを非同期にし、場所・timeout・stale条件・保持範囲は維持した。
- `src/exec/task-repos.ts`: 同期処理を非同期処理に置き換えた。
- `src/exec/trial-commands.ts`: 呼び出し元を非同期化した処理に追従させた。
- `src/exec/worktree-command.ts`: worktree コマンドの処理を非同期化した。
- `src/exec/worktree-ops-lifecycle.ts`: worktree の lifecycle 操作（準備など）を非同期化した。
- `src/exec/worktree-ops-merge.ts`: root への merge 操作を非同期化した。
- `src/exec/worktree-yaml-pages.ts`: YAML ページ生成まわりの同期処理（specdojo build など）を非同期化した。
- `src/exec/worktree.ts`: worktree の同期処理を非同期処理に置き換えた。重複していた同期版と非同期版を一本化した。
- `tests/src/commands/build.integration.test.ts`: 非同期化した処理に合わせて、テストを更新した。
- `tests/src/exec/repo-integration.test.ts`: 非同期化した処理に合わせて、テストを更新した。
- `tests/src/exec/task-repos.integration.test.ts`: 非同期化した処理に合わせて、テストを更新した。1353行に typecheck エラーが残っている。
- `tests/src/exec/trailing-records.integration.test.ts`: 非同期化した処理に合わせて、テストを更新した。
- `tests/src/exec/worktree-ops.integration.test.ts`: 非同期化した処理に合わせて、テストを更新した。
- `tests/src/exec/worktree-yaml-pages.integration.test.ts`: 非同期化した処理に合わせて、テストを更新した。
- `tests/src/exec/worktree-yaml-pages.test.ts`: 非同期化した処理に合わせて、テストを更新した。
- `tests/src/exec/worktree.integration.test.ts`: 非同期化した処理に合わせて、テストを更新した。
- `tests/src/exec/worktree.test.ts`: 非同期化した処理に合わせて、テストを更新した。
- `src/exec/worktree-process.ts`: 新規ファイル。子プロセス（npm ci・specdojo build・git など）を event loop を止めずに実行する処理を追加した。
- `tests/src/exec/scheduler-lock-async.test.ts`: 新規テスト。scheduler lock の待ち方が非同期になったことを検証する。
- `tests/src/exec/worktree-async.test.ts`: 新規テスト。worktree 操作の非同期化を検証する。12行目の `import()` 型注釈が lint エラーになっている。
- `tests/src/exec/worktree-process.integration.test.ts`: 新規の統合テスト。非同期の子プロセス実行処理を検証する。

## 3. 申し送り

- 親検証で `npm run lint:ts`（`tests/src/exec/worktree-async.test.ts` の12行目、`import()` 型注釈）と `npm run typecheck`（`tests/src/exec/task-repos.integration.test.ts` の1353行、number が `void | Promise&lt;void&gt;` に代入できない）が失敗している。再実行して通す前に close しないこと。
- runner が管理する個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-csrm-validation-lag-other-sync-work.md` も更新されている。executor は計測条件と最終計測値を反映して整形したと報告している。
- 統合後、オーケストレーターが `--parallel 3` で数件実行し、`detection_lag_ms` の平均5秒以下・最大30秒以下、統合順序・失敗数を確認する。処理別所要時間の平均・最大も個票へ追記し、確認後にcloseする。小規模再現計測は実運用の目標達成の証拠ではない。
- 判断: 準備・merge の同期版と非同期版の重複を避け、呼び出し元までPromiseへ変更した。scheduler lockは待ち方だけを非同期化し、場所・timeout・stale条件・保持範囲を維持した。
- 単体・統合テスト、型検査、lintなど指定の親検証はrunnerが実行する。resultは編集していないため、reporter / runnerが本報告を反映する。
- 人の確認が必要: `npx specdojo exec run --project prj-0001 --auto --parallel 3`（統合後にオーケストレーターが実行する。実agentの起動と使用量消費を伴うため、executorでは実行していない。）

## 4. 進め方

原因の同期処理を計測で洗い出し、子プロセス実行を非同期の共通処理（`src/exec/worktree-process.ts`）へ集約した。呼び出し元までPromiseに変更し、同期版と非同期版の重複を避けた。回帰テストと一時リポジトリでの同期・非同期比較計測で効果を確認し、個票とガイドへ反映した。
