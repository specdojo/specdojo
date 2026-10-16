---
specdojo:
  id: prj-0001:xer-pjr-smk5-20261016t144937z-5afd
  type: exec-result
  task_id: PJR-SMK5
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-smk5-20261016T144937Z-5afd-plan.md
  started_at: "2026-10-16T14:49:38.013Z"
  completed_at: "2026-10-16T15:02:45.491Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- schedule 関連ソース8件と catalog 関連ソース11件を `src/schedule/`・`src/catalog/` へ移し、旧 `src/schedule-*.ts`・`src/catalog-*.ts` を削除した。
- 対応するテスト13件を `tests/src/schedule/`・`tests/src/catalog/` へ移動した。
- 参照元の import、codemod ツール、catalog 定義 YAML、設計書の記述を新配置に合わせて更新した。
- 検証は次のとおり。`npm run build` は成功した。catalog・schedule のヘルプ14件は前後で差分がなかった。生成物65件も前後で差分がなかった。`catalog validate` はエラーなしだった。`git diff --check` も問題なしだった。
- runner が実行した `lint-ts`・`lint-fm`・`lint-md`・`typecheck`・`test-unit`・`test-integration`・`validate-schema` はすべて passed だった。

## 2. 変更ファイル

- `docs/ja/product/040-system-design/sysd-index.md`: 設計書内のソース配置の記述を新配置に更新した。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-flow.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-bdd.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-ccd.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdsd.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cld.yaml`: reporter の説明がないため、変更差分を参照。
- `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-test-specs.yaml`: reporter の説明がないため、変更差分を参照。
- `src/catalog-build-references.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog-build-render.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog-build.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog-generate.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog-paths.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog-plan-generate.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog-plan-prompt.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog-plan.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog-scaffold.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog-types.ts`: reporter の説明がないため、変更差分を参照。
- `src/catalog.ts`: `src/catalog/` へ移動したため削除した。
- `src/deliverable/deliverable.ts`: reporter の説明がないため、変更差分を参照。
- `src/deliverable/trash.ts`: reporter の説明がないため、変更差分を参照。
- `src/docs/yaml-pages.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-commands.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-plans-core.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-plans-generation.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-in-place.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-schedule-mode.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-run-shared.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-schedule-index.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-schedule-initial.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-strategy.ts`: reporter の説明がないため、変更差分を参照。
- `src/exec-task-view.ts`: reporter の説明がないため、変更差分を参照。
- `src/grade-targets.ts`: 新配置に合わせて import を更新した。
- `src/init-command.ts`: 新配置に合わせて import を更新した。
- `src/schedule-approach.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule-build.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule-phase-sets.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule-strategy-generate-document.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule-strategy-generate-scope.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule-strategy-generate.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule-strategy-profiles.ts`: reporter の説明がないため、変更差分を参照。
- `src/schedule.ts`: `src/schedule/` へ移動したため削除した。
- `src/specdojo.ts`: 新配置に合わせて import を更新した。
- `src/watch.ts`: 新配置に合わせて import を更新した。
- `tests/src/catalog-based-on.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog-build.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog-generate.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog-index.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog-merge.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog-paths.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog-plan-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog-plan-generate.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog-plan.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog-scaffold.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/cli-verb-taxonomy.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-cycle.integration.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-deliverable.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/exec-plans.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/kata/kata.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/schedule-build.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/schedule-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/schedule-strategy-generate.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/specdojo-config-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/tools/src-move-codemod.integration.test.ts`: codemod の統合テストを更新した。
- `tools/catalog-validate-if-configured.mjs`: catalog の新パスに追従させた。
- `tools/src-move-codemod.mjs`: codemod を schedule・catalog の移動に対応させた。
- `src/catalog/build-references.ts`: 旧 `src/catalog-build-references.ts` を移動した。
- `src/catalog/build-render.ts`: 旧 `src/catalog-build-render.ts` を移動した。
- `src/catalog/build.ts`: 旧 `src/catalog-build.ts` を移動した。
- `src/catalog/catalog.ts`: 旧 `src/catalog.ts` を新ディレクトリへ移動した。
- `src/catalog/generate.ts`: 旧 `src/catalog-generate.ts` を移動した。
- `src/catalog/paths.ts`: 旧 `src/catalog-paths.ts` を移動した。
- `src/catalog/plan-generate.ts`: 旧 `src/catalog-plan-generate.ts` を移動した。
- `src/catalog/plan-prompt.ts`: 旧 `src/catalog-plan-prompt.ts` を移動した。
- `src/catalog/plan.ts`: 旧 `src/catalog-plan.ts` を移動した。
- `src/catalog/scaffold.ts`: 旧 `src/catalog-scaffold.ts` を移動した。
- `src/catalog/types.ts`: 旧 `src/catalog-types.ts` を移動した。
- `src/schedule/approach.ts`: 旧 `src/schedule-approach.ts` を移動した。
- `src/schedule/build.ts`: 旧 `src/schedule-build.ts` を移動した。
- `src/schedule/phase-sets.ts`: 旧 `src/schedule-phase-sets.ts` を移動した。
- `src/schedule/schedule.ts`: 旧 `src/schedule.ts` を移動した。
- `src/schedule/strategy-generate-document.ts`: 旧 `src/schedule-strategy-generate-document.ts` を移動した。
- `src/schedule/strategy-generate-scope.ts`: 旧 `src/schedule-strategy-generate-scope.ts` を移動した。
- `src/schedule/strategy-generate.ts`: 旧 `src/schedule-strategy-generate.ts` を移動した。
- `src/schedule/strategy-profiles.ts`: 旧 `src/schedule-strategy-profiles.ts` を移動した。
- `tests/src/catalog/based-on.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog/build.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog/generate.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog/index.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog/merge.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog/paths.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog/plan-command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog/plan-generate.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog/plan.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/catalog/scaffold.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/schedule/build.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/schedule/command.test.ts`: reporter の説明がないため、変更差分を参照。
- `tests/src/schedule/strategy-generate.test.ts`: reporter の説明がないため、変更差分を参照。

## 3. 申し送り

- `lint:ts` で `max-lines-per-function` の warning が25件残っている(例: `registerCatalogCommands`、`buildScheduleTrack`)。移動前から存在する関数長の問題で、エラーではない。分割は別タスクの候補になる。
- `catalog validate` に未作成文書に関する既存の `based_on` 警告が出ているが、今回の変更とは無関係である。
- `test:unit` の出力末尾に `unknown option '--reserve'` などのエラー文言があった。evidence 上は test:unit が passed なので、テスト内で意図的に発生させたケースの出力と解釈した。ただし根拠は出力の抜粋だけで確認できていない。
- `pjr-smk5-src-move-schedule-catalog.md` は runner 管理の変更として扱われる。登録簿の状態遷移は runner と人間が行う。

## 4. 進め方と実践の型の適用

codemod 方式で schedule と catalog のファイルを機能別ディレクトリへ移し、import・設計書・catalog 定義を追従させた。移動前後で build、ヘルプ出力、生成物を比較し、挙動が変わらないことを確認した。
