---
specdojo:
  id: prj-0001:xer-pjr-7mxj-20260810t074438z-dbea
  type: exec-result
  task_id: PJR-7MXJ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-7mxj-20260810T074438Z-dbea-plan.md
  started_at: "2026-08-10T07:44:38.853Z"
  completed_at: "2026-08-10T08:01:02.663Z"
  agent: codex-expert-edit-agent
---

# Edit Result

## 1. 実施内容

- run-scoped `pipeline-state.json` の状態モデル、JSON Schema、原子的な保存・読込・検証処理を追加した。
- executor / reporter の開始・終了境界で状態、actor、試行回数、evidence / result 参照を永続化し、block event に失敗 stage と recovery artifact の参照を記録するよう runner を拡張した。
- blocked reporter task の `exec resume --task` で、task ID / run ID が一致する succeeded executor evidence を再利用し、executor を再実行せず reporter から再開する経路を追加した。不正・欠損 checkpoint は新しい executor run へフォールバックする。
- `exec run`、`exec resume`、`exec cycle` に `--executor-by` / `--reporter-by` を追加し、stage role 検証と未指定時の自動選択を維持した。
- state schema、再利用条件、block metadata、stage 別 agent 選択、reporter 成否をテストし、運用・設定ガイドへ復旧手順を反映した。

## 2. 変更ファイル

- `src/exec-pipeline-state.ts`
- `src/exec-run.ts`
- `docs/specdojo/schemas/v1/pipeline-state.schema.yaml`
- `tests/src/exec-pipeline-state.test.ts`
- `tests/src/exec-run.test.ts`
- `tests/src/exec-run-inplace.test.ts`
- `tests/src/exec-run-resolve-command.test.ts`
- `docs/ja/specdojo/guides/exec-config-guide.md`
- `docs/ja/specdojo/guides/exec-operation-guide.md`
- `docs/ja/projects/prj-0001/controls/project-register/pjr-7mxj-pipeline-resume-recovery.md`
- `docs/ja/projects/prj-0001/execution/exec/results/pjr-7mxj-20260810T074438Z-dbea-result.md`

## 3. 申し送り

- `npm run typecheck`、対象テスト57件、Markdown lint、`register build`、`catalog validate`、`index build`、`git diff --check` は成功した。`npx tsx` は sandbox の IPC socket 制限で `listen EPERM` となったため、同じ loader を IPC 不使用の `node --import tsx src/specdojo.ts` で起動して SpecDojo 検査を完走した。
- 全体 `npm test` は1024件成功した後、sandbox 内の Vitest fork から `git` を起動する既存 worktree 系16件が `spawnSync git EPERM` で失敗した。実装 assertion の失敗ではなく、同じ環境では対象ファイルの直列再実行でも同じ `EPERM` となるため、sandbox 外の通常開発環境または CI で全体テストを再確認する。
- reporter resume は既存 task claim と worktree を再利用する。pipeline state または evidence の整合検証に失敗した場合は executor を省略せず、新しい run ID で再実行する。

## 4. 進め方と実践の型の適用

この register 起点 plan には `approach` と専用 rulebook の指定がないため、個票の完了条件を基準に freeform で進めた。先行実装である executor evidence、reporter result 生成、task event fold、worktree resume の現行コードと、[[specdojo:exec-operation-guide|exec運用ガイド]]、[[specdojo:exec-config-guide|exec設定ガイド]] を確認し、既存の task 単位 lifecycle を変更せず stage checkpoint だけを追加した。保存形式は既存 `exec-evidence.schema.yaml` と run-scoped evidence 配置に合わせ、復旧判断は永続 state だけを信用せず evidence の task ID / run ID / succeeded status も照合する方針とした。
