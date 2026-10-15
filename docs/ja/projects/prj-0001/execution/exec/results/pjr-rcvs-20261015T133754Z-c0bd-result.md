---
specdojo:
  id: prj-0001:xer-pjr-rcvs-20261015t133754z-c0bd
  type: exec-result
  task_id: PJR-RCVS
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-rcvs-20261015T133754Z-c0bd-plan.md
  started_at: "2026-10-15T13:37:54.891Z"
  completed_at: "2026-10-15T14:46:55.281Z"
  agent: codex-expert-executor
---

# Edit Result

## 1. 実施内容

- js-yaml 5 への移行に向けて、リポジトリ内の YAML 利用箇所を新設の共通ラッパー `src/yaml.ts` と `packages/docs-lint/src/yaml.ts` 経由に統一した。あわせて named import へ書き換えた。
- 日付が `Date` として扱われること、merge key（`&lt;&lt;`）が解決されること、dump が動作することを、executor が実行した確認コマンドで確認した。
- runner が実行した検証（`lint-ts`、`lint-fm`、`lint-md`、`typecheck`、`test-unit`、`test-integration`、`validate-schema`）はすべて passed。`lint-ts` は 0 error、25 warning で、warning は主に `max-lines-per-function` に関するもの。
- executor の最終メッセージによると、依存パッケージ自体の更新は後続の handoff 対象として残っている。

## 2. 変更ファイル

- `CHANGELOG.md`: js-yaml 5 への移行に関する変更を記録した。
- `packages/docs-lint/src/remark-frontmatter-ajv2020.cjs`: js-yaml 5 に対応するよう YAML の読み込みを修正した。
- `packages/docs-lint/src/remark-md-content.ts`: js-yaml 5 に対応するよう YAML の利用を修正した。
- `packages/docs-lint/src/remark-no-unescaped-angle-placeholder.ts`: js-yaml 5 に対応するよう YAML の利用を修正した。
- `packages/docs-lint/src/validate-glossary-references.ts`: js-yaml 5 に対応するよう YAML の利用を修正した。
- `packages/docs-lint/src/validate-rulebook-schema-enums.ts`: js-yaml 5 に対応するよう YAML の利用を修正した。
- `packages/docs-lint/src/validate-yaml-schema.ts`: js-yaml 5 に対応するよう YAML の利用を修正した。
- `src/catalog-build-references.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/catalog-build.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/catalog-generate.ts`: YAML の import を切り替えた。executor が最後の試行で、未定義参照を修正した。
- `src/catalog-plan-generate.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/catalog-plan.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/catalog-scaffold.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/catalog.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/dashboard-exec-records.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/dashboard-routines.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/deliverable-trash.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/doc-index.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/exec-plans-core.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/exec-shared.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/exec-worktree-ops-commit.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/frontmatter-namespace.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/grade-apply.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/grade-core.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/grade-plan.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/grade-result.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/grade-targets.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/init-command.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/job-definition.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/kata-command.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/register-events.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/register-item.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/review-plan.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/schedule-approach.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/schedule-strategy-generate.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/schedule.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/specdojo-config.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/viewpoint-document-kinds-check.ts`: YAML の import を共通ラッパーへ切り替えた。
- `src/yaml-pages.ts`: YAML の import を共通ラッパーへ切り替えた。
- `tests/src/catalog-merge.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/catalog-plan-command.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/catalog-plan-generate.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/catalog-plan.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/exec-cycle.integration.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/exec-register-plan-escape.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/exec-results.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/grade.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/init-command.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/review-grade.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/review-plan.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/schedule-build.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/schedule-command.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/schedule-strategy-generate.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `tests/src/viewpoint-document-kinds-check.test.ts`: js-yaml 5 の挙動に合わせてテストの YAML 利用を更新した。
- `packages/docs-lint/src/yaml.ts`: docs-lint 用の YAML 共通ラッパーを新規追加した。
- `src/yaml.ts`: 本体用の YAML 共通ラッパー（`load` / `dump`）を新規追加した。
- `tests/src/yaml.test.ts`: YAML ラッパーのテストを新規追加した。

## 3. 申し送り

- executor の最終メッセージによると、依存パッケージ（`package.json` の js-yaml）の 5 への更新は後続の handoff 対象である。今回の evidence の変更ファイル一覧に `package.json` と `package-lock.json` は含まれていないため、更新が未実施であることを確認し、実施する必要がある。
- evidence の `target_coverage` には個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-rcvs-js-yaml-5-migration.md` が changed として載っている。一方で `changes` にはこの個票が含まれていない。個票の更新内容を確認する必要がある。
- `test-unit` の出力末尾に `unknown option '--reserve'` などのエラー文言と `reporter failed` が含まれる。ただし、実行は exit 0 で passed と記録されている。この出力が既存テストの想定出力かどうかは evidence から判断できないため、確認が望ましい。
- `lint-ts` の warning 25 件（主に `max-lines-per-function`）は、いずれも既存の関数長に関する警告である。今回の変更で警告が増えたかどうかは evidence からは判断できない。

## 4. 進め方と実践の型の適用

js-yaml 5 の破壊的変更である named import、引用符なしの日付、既定 schema から消える merge key に対応するため、`src/yaml.ts` と `packages/docs-lint/src/yaml.ts` に共通ラッパーを新設した。既存の YAML 利用箇所とテストをこのラッパー経由に書き換えた。検証は、Prettier による整形、`register build`、カタログ検証、日付・merge key・dump の動作確認、`git diff --check` を executor が実行した。あわせて runner が lint、型検査、単体テスト、統合テスト、スキーマ検証を実行し、いずれも passed となった。
