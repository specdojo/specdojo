---
specdojo:
  id: prj-0001:xer-pjr-yh9q-20261016t224633z-f9dc
  type: exec-result
  task_id: PJR-YH9Q
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-yh9q-20261016T224633Z-f9dc-plan.md
  started_at: "2026-10-16T22:46:33.165Z"
  completed_at: "2026-10-16T22:54:38.046Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- grade 関連の実装13件を `src/grade/` へ、register 関連の実装16件を `src/register/` へ移し、接頭辞付きの重複を除いたファイル名に変更した(例: `src/grade-core.ts` は `src/grade/core.ts` へ、`src/register-item.ts` は `src/register/item.ts` へ)。
- 対応するテスト14件を `tests/src/grade/` と `tests/src/register/` へ移した。
- 移動に合わせて、参照元の import を更新した。対象は `src/specdojo.ts`、`src/exec-*`、`src/init-command.ts`、`src/review/grade.ts`、`src/schedule/approach.ts`、`src/dashboard/dashboard.ts`、`packages/docs-lint`、既存テストである。
- system-design 文書とカタログ YAML のパス記述を新しい配置に更新した。
- executor は、移動前後で grade と register の全サブコマンド25件の `--help` 出力が一致することを確認した。
- executor は Prettier、`npm run build`、`catalog build`、`catalog validate`、`git diff --check` を実行し、すべて成功した。
- runner の検証 `lint-ts`、`lint-fm`、`lint-md`、`typecheck`、`test-unit`、`test-integration`、`validate-schema` はすべて passed である。`lint-ts` は error 0 件で、warning(`max-lines-per-function`)が25件ある。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-critical-flows.md`: 新しいパス配置に合わせて記述を更新した。
- `docs/ja/product/040-system-design/sysd-index.md`: 新しいパス配置に合わせて記述を更新した。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml`: 移動後のパスに合わせてカタログ記述を更新した。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-bdd.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdsd.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cld.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-stsd.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-test-specs.yaml`: 移動後のテストパスに合わせてカタログ記述を更新した。
- `packages/docs-lint/src/remark-md-content.ts`: 移動に伴う参照を更新した。
- `src/dashboard/dashboard.ts`: 移動先を参照するよう import を更新した。
- `src/exec-plans-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-plans-storage.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-register.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-register-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-register-mode.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-register-resume.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-register-state.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-register-worktree.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-worktree-ops-merge.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-apply.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-command-apply.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-command-inspect.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-command-plan.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-command-shared.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-markdown.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-pipeline-state.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-plan.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-result.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-target-discovery.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-targets.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade.ts`: reporter の説明がないため、変更差分を参照。
- `src/init-command.ts`: 移動先を参照するよう import を更新した。
- `src/register-command-types.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-create-commands.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-date.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-event-merge.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-events.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-history.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-item.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-maintenance-commands.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-migrate-timestamps.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-migration.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-renumber.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-transition-commands.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-update.ts`: reporter の説明がないため、変更差分を参照。
- `src/register-views.ts`: reporter の説明がないため、変更差分を参照。
- `src/register.ts`: reporter の説明がないため、変更差分を参照。
- `src/review/grade.ts`: grade の移動先を参照するよう import を更新した。
- `src/schedule/approach.ts`: register の移動先を参照するよう import を更新した。
- `src/specdojo.ts`: 移動先の grade と register を参照するよう import を更新した。
- `tests/src/cli-verb-taxonomy.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/deliverable/trash.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-plans-grade-findings.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-register-multiple-ids.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-register-pipeline-e2e.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-register-plan-escape.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-register-worktree.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-register.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-worktree-ops.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/grade-result.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/grade-triggers.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/grade.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register-commands.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register-commit.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register-date.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register-event-merge.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register-history.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register-item.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register-migrate-events.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register-migrate-timestamps.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register-migration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register-view-order.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/register.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/review/grade.test.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade/apply.ts`: 旧 `src/grade-apply.ts` から移動した。
- `src/grade/command-apply.ts`: 旧 `src/grade-command-apply.ts` から移動した。
- `src/grade/command-inspect.ts`: 旧 `src/grade-command-inspect.ts` から移動した。
- `src/grade/command-plan.ts`: 旧 `src/grade-command-plan.ts` から移動した。
- `src/grade/command-shared.ts`: 旧 `src/grade-command-shared.ts` から移動した。
- `src/grade/core.ts`: 旧 `src/grade-core.ts` から移動した。
- `src/grade/grade.ts`: 旧 `src/grade.ts` から移動した。
- `src/grade/markdown.ts`: 旧 `src/grade-markdown.ts` から移動した。
- `src/grade/pipeline-state.ts`: 旧 `src/grade-pipeline-state.ts` から移動した。
- `src/grade/plan.ts`: 旧 `src/grade-plan.ts` から移動した。
- `src/grade/result.ts`: 旧 `src/grade-result.ts` から移動した。
- `src/grade/target-discovery.ts`: 旧 `src/grade-target-discovery.ts` から移動した。
- `src/grade/targets.ts`: 旧 `src/grade-targets.ts` から移動した。
- `src/register/command-types.ts`: 旧 `src/register-command-types.ts` から移動した。
- `src/register/core.ts`: 旧 `src/register-core.ts` から移動した。
- `src/register/create-commands.ts`: 旧 `src/register-create-commands.ts` から移動した。
- `src/register/date.ts`: 旧 `src/register-date.ts` から移動した。
- `src/register/event-merge.ts`: 旧 `src/register-event-merge.ts` から移動した。
- `src/register/events.ts`: 旧 `src/register-events.ts` から移動した。
- `src/register/history.ts`: 旧 `src/register-history.ts` から移動した。
- `src/register/item.ts`: 旧 `src/register-item.ts` から移動した。
- `src/register/maintenance-commands.ts`: 旧 `src/register-maintenance-commands.ts` から移動した。
- `src/register/migrate-timestamps.ts`: 旧 `src/register-migrate-timestamps.ts` から移動した。
- `src/register/migration.ts`: 旧 `src/register-migration.ts` から移動した。
- `src/register/register.ts`: 旧 `src/register.ts` から移動した。
- `src/register/renumber.ts`: 旧 `src/register-renumber.ts` から移動した。
- `src/register/transition-commands.ts`: 旧 `src/register-transition-commands.ts` から移動した。
- `src/register/update.ts`: 旧 `src/register-update.ts` から移動した。
- `src/register/views.ts`: 旧 `src/register-views.ts` から移動した。
- `tests/src/grade/grade.test.ts`: 旧 `tests/src/grade.test.ts` から移動した。
- `tests/src/grade/result.test.ts`: 旧 `tests/src/grade-result.test.ts` から移動した。
- `tests/src/grade/triggers.test.ts`: 旧 `tests/src/grade-triggers.test.ts` から移動した。
- `tests/src/register/commands.test.ts`: 旧 `tests/src/register-commands.test.ts` から移動した。
- `tests/src/register/commit.integration.test.ts`: 旧 `tests/src/register-commit.integration.test.ts` から移動した。
- `tests/src/register/date.test.ts`: 旧 `tests/src/register-date.test.ts` から移動した。
- `tests/src/register/event-merge.test.ts`: 旧 `tests/src/register-event-merge.test.ts` から移動した。
- `tests/src/register/history.test.ts`: 旧 `tests/src/register-history.test.ts` から移動した。
- `tests/src/register/item.test.ts`: 旧 `tests/src/register-item.test.ts` から移動した。
- `tests/src/register/migrate-events.test.ts`: 旧 `tests/src/register-migrate-events.test.ts` から移動した。
- `tests/src/register/migrate-timestamps.test.ts`: 旧 `tests/src/register-migrate-timestamps.test.ts` から移動した。
- `tests/src/register/migration.test.ts`: 旧 `tests/src/register-migration.test.ts` から移動した。
- `tests/src/register/register.test.ts`: 旧 `tests/src/register.test.ts` から移動した。
- `tests/src/register/view-order.test.ts`: 旧 `tests/src/register-view-order.test.ts` から移動した。

## 3. 申し送り

- `catalog validate` に、未作成文書の `based_on` に関する既存警告が出ている。今回の移動が原因ではない。
- `test:unit` と `test:integration` の出力に `unknown option '--reserve'` などのエラー行がある。実行自体は passed で、テストが意図的に失敗を検証した際の出力とみられる。ただし evidence だけでは確証がないため、必要なら確認すること。
- `lint:ts` に `max-lines-per-function` の warning が25件ある。error は0件で、分割の検討対象である。
- 登録簿 `pjr-index.md` と個票のステータスは変更していない。状態遷移は runner と人間が行う。

## 4. 進め方と実践の型の適用

codemod 相当のファイル移動で、接頭辞付きの `src/grade-*.ts` と `src/register-*.ts` を各ディレクトリ配下の短い名前へ変えた。続いて import とドキュメント上のパス参照を更新した。移動前後の `--help` 出力の差分がないことを確認し、build、型検査、lint、unit/integration テスト、schema 検証で整合性を確かめた。
