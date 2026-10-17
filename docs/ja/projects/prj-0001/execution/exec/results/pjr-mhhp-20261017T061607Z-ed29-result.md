---
specdojo:
  id: prj-0001:xer-pjr-mhhp-20261017t061607z-ed29
  type: exec-result
  task_id: PJR-MHHP
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-mhhp-20261017T061607Z-ed29-plan.md
  started_at: "2026-10-17T06:16:07.169Z"
  completed_at: "2026-10-17T06:27:03.195Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- 共通処理を `src/shared/` へ、コマンド入口を `src/commands/` へ移動した。移動した実装は `agent-response`・`build-if-stale`・`dist-freshness`・`git-environment`・`package-paths`・`practice-id`・`spawn-self`・`specdojo-config`・`specdojo-gitignore`・`yaml-schema-modeline`・`yaml` の11件（`shared`）と、`agent`・`build`・`init`・`orchestrator`・`watch` の5件（`commands`）。
- 対応するテストも `tests/src/shared/` と `tests/src/commands/` へ移した。
- import パスを全参照元で補正した。`tools/build-if-stale.mjs`、`tests/setup/git-environment.ts`、関連する設計書・ガイド・スキーマ・カタログ YAML も更新した。
- executor は、123件の help 出力が移動前後で一致したと報告している。`npm run build`、hook 入口、`catalog build`、`catalog validate`、`register build`、Prettier、`git diff --check` も成功した。
- runner の検証は `lint:ts`、`lint:fm`、`lint:md`、`typecheck`、`validate:schema`、`test:unit`、`test:integration` がすべて passed だった。`lint:ts` は 0 エラー・25 警告で、警告は `max-lines-per-function` などの既存の関数長に関するもの。

## 2. 変更ファイル

- `.github/instructions/vitest.instructions.md`: reporter の説明がないため、変更差分を参照。
- `docs/ja/product/040-system-design/sysd-cross-cutting-policy.md`: reporter の説明がないため、変更差分を参照。
- `docs/ja/product/040-system-design/sysd-index.md`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-bdd.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdsd.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-system-design.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-test-specs.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/specdojo/guides/exec-config-guide.md`: reporter の説明がないため、変更差分を参照。
- `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`: 移動に伴う参照を更新したスキーマ。
- `src/agent-response.ts`: reporter の説明がないため、変更差分を参照。
- `src/agent.ts`: reporter の説明がないため、変更差分を参照。
- `src/build-command.ts`: reporter の説明がないため、変更差分を参照。
- `src/build-if-stale.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog/build-references.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog/build.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog/catalog.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog/generate.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog/plan-generate.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog/plan.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog/scaffold.ts`: reporter の説明がないため、変更差分を参照。
- `src/dashboard/dashboard.ts`: reporter の説明がないため、変更差分を参照。
- `src/dashboard/exec-records.ts`: reporter の説明がないため、変更差分を参照。
- `src/dashboard/routines.ts`: reporter の説明がないため、変更差分を参照。
- `src/dashboard/timeline.ts`: reporter の説明がないため、変更差分を参照。
- `src/deliverable/deliverable.ts`: reporter の説明がないため、変更差分を参照。
- `src/deliverable/trash.ts`: reporter の説明がないため、変更差分を参照。
- `src/devcontainer/command.ts`: reporter の説明がないため、変更差分を参照。
- `src/dist-freshness.ts`: reporter の説明がないため、変更差分を参照。
- `src/docs/doc-index.ts`: reporter の説明がないため、変更差分を参照。
- `src/docs/frontmatter-namespace.ts`: reporter の説明がないため、変更差分を参照。
- `src/docs/index-command.ts`: reporter の説明がないため、変更差分を参照。
- `src/docs/template-resolution.ts`: reporter の説明がないため、変更差分を参照。
- `src/docs/viewpoint-document-kinds-check.ts`: reporter の説明がないため、変更差分を参照。
- `src/docs/yaml-pages-command.ts`: reporter の説明がないため、変更差分を参照。
- `src/docs/yaml-pages.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-agent-config.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-commands.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-handoff.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-limit.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-parent-validation.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-plans-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-plans-generation.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-plans-storage.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-project.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-provider-scaffold.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-register.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-repo-integration-git.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-repo-integration.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-reporter-output.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-reporter.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-results.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-agent.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-in-place.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-job.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-lifecycle-commands.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-mode-shared.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-register-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-register-mode.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-register-resume.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-register-worktree.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-schedule-mode.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-schedule-prepare.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-shared.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-schedule-index.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-shared.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-task-repos.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-trial-commands.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-trial-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-worktree-command.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-worktree-ops-commit.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-worktree.ts`: reporter の説明がないため、変更差分を参照。
- `src/git-environment.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/apply.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/command-apply.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/command-plan.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/core.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/markdown.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/pipeline-state.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/plan.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/result.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/target-discovery.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/targets.ts`: reporter の説明がないため、変更差分を参照。
- `src/init-command.ts`: reporter の説明がないため、変更差分を参照。
- `src/job/definition.ts`: reporter の説明がないため、変更差分を参照。
- `src/job/job.ts`: reporter の説明がないため、変更差分を参照。
- `src/kata/command.ts`: reporter の説明がないため、変更差分を参照。
- `src/kata/kata.ts`: reporter の説明がないため、変更差分を参照。
- `src/orchestrator.ts`: reporter の説明がないため、変更差分を参照。
- `src/package-paths.ts`: reporter の説明がないため、変更差分を参照。
- `src/practice-id.ts`: reporter の説明がないため、変更差分を参照。
- `src/register/core.ts`: reporter の説明がないため、変更差分を参照。
- `src/register/date.ts`: reporter の説明がないため、変更差分を参照。
- `src/register/events.ts`: reporter の説明がないため、変更差分を参照。
- `src/register/history.ts`: reporter の説明がないため、変更差分を参照。
- `src/register/item.ts`: reporter の説明がないため、変更差分を参照。
- `src/register/maintenance-commands.ts`: reporter の説明がないため、変更差分を参照。
- `src/register/register.ts`: reporter の説明がないため、変更差分を参照。
- `src/register/renumber.ts`: reporter の説明がないため、変更差分を参照。
- `src/review/grade.ts`: reporter の説明がないため、変更差分を参照。
- `src/review/plan.ts`: reporter の説明がないため、変更差分を参照。
- `src/routine/definition.ts`: reporter の説明がないため、変更差分を参照。
- `src/routine/routine.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule/approach.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule/build.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule/schedule.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule/strategy-generate.ts`: reporter の説明がないため、変更差分を参照。
- `src/spawn-self.ts`: reporter の説明がないため、変更差分を参照。
- `src/specdojo-config.ts`: reporter の説明がないため、変更差分を参照。
- `src/specdojo-gitignore.ts`: reporter の説明がないため、変更差分を参照。
- `src/specdojo.ts`: CLI 入口の import を新しい配置に合わせて更新した。
- `src/watch.ts`: reporter の説明がないため、変更差分を参照。
- `src/yaml-schema-modeline.ts`: reporter の説明がないため、変更差分を参照。
- `src/yaml.ts`: reporter の説明がないため、変更差分を参照。
- `tests/setup/git-environment.ts`: 移動後の `git-environment` を参照するよう更新した。
- `tests/src/agent-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/agent-response.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/build-command.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/build-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/cli-verb-taxonomy.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/dist-freshness.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-agent-config-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-format.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-pipeline-e2e.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-plans-grade-findings.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-register-pipeline-e2e.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-register-plan-escape.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-register-resume.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-register.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-results.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-run-resolve-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-run.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/git-environment-isolation.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/grade/grade.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/init-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/kata/kata.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/orchestrator-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/package-paths.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/practice-id.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register/date.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register/register.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/schedule/build.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/spawn-self.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/specdojo-config-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/specdojo-config-env.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/specdojo-config-repos.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/specdojo-config.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/specdojo-gitignore.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/yaml.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/tools/build-if-stale.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/tools/src-move-codemod.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tools/build-if-stale.mjs`: 移動後の出力パスに合わせて更新した hook 入口。
- `src/commands/agent.ts`: reporter の説明がないため、変更差分を参照。
- `src/commands/build.ts`: `src/build-command.ts` から移動したコマンド実装。
- `src/commands/init.ts`: reporter の説明がないため、変更差分を参照。
- `src/commands/orchestrator.ts`: reporter の説明がないため、変更差分を参照。
- `src/commands/watch.ts`: reporter の説明がないため、変更差分を参照。
- `src/shared/agent-response.ts`: reporter の説明がないため、変更差分を参照。
- `src/shared/build-if-stale.ts`: reporter の説明がないため、変更差分を参照。
- `src/shared/dist-freshness.ts`: reporter の説明がないため、変更差分を参照。
- `src/shared/git-environment.ts`: `src/git-environment.ts` から移動した git 環境隔離の共通処理。
- `src/shared/package-paths.ts`: reporter の説明がないため、変更差分を参照。
- `src/shared/practice-id.ts`: reporter の説明がないため、変更差分を参照。
- `src/shared/spawn-self.ts`: `src/spawn-self.ts` から移動した共通処理。
- `src/shared/specdojo-config.ts`: `src/specdojo-config.ts` から移動した設定読み込みの共通処理。
- `src/shared/specdojo-gitignore.ts`: reporter の説明がないため、変更差分を参照。
- `src/shared/yaml-schema-modeline.ts`: reporter の説明がないため、変更差分を参照。
- `src/shared/yaml.ts`: `src/yaml.ts` から移動した共通 YAML 処理。
- `tests/src/commands/agent.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/commands/build.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/commands/build.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/commands/init.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/commands/orchestrator.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/agent-response.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/dist-freshness.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/git-environment-isolation.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/package-paths.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/practice-id.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/spawn-self.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/specdojo-config-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/specdojo-config-env.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/specdojo-config-repos.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/specdojo-config.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/specdojo-gitignore.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/shared/yaml.test.ts`: reporter の説明がないため、変更差分を参照。

## 3. 申し送り

- `specdojo exec run --register` の統合後実行は `requires_human` として残っている。close 条件として、統合後に orchestrator が実行する。
- `catalog validate` で、既存の未作成文書に関する `based_on` 警告が出ている。今回の変更が原因とは報告されていない。
- `lint:ts` の警告25件（`max-lines-per-function` など）は残っている。分割は別途検討する。
- executor evidence に、`reporter failedproblem` と、`catalog` の `data-flow` に既存カタログがあるという WARN が出力されていた。今回の検証はすべて passed だが、必要なら人間が確認する。
- 人の確認が必要: `specdojo exec run --register (post-integration)`（統合後に orchestrator が実行する close 条件）

## 4. 進め方と実践の型の適用

codemod で共通処理とコマンド入口を `src/shared` と `src/commands` へ移し、テストも対応する配置に移した。その後、参照パスと関連文書を補正した。help 出力の前後比較と runner の検証で、挙動が変わっていないことを確認している。
