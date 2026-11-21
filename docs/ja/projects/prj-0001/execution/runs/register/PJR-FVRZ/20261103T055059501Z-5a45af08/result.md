---
specdojo:
  id: prj-0001:xer-pjr-fvrz-20261103t052539z-18a09ea8
  type: exec-result
  task_id: PJR-FVRZ
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-FVRZ/20261103T055059501Z-5a45af08/plan.md
  started_at: "2026-11-03T05:27:08.836Z"
  completed_at: "2026-11-03T06:11:51.458Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- plan 生成プロセスにおいて、`exec run --auto` 実行時の `checkpoint` コミット時に発生していた Markdown の構文エラー（MD032）を、`exec plan` または `schedule build` の段階で事前に検知できるよう、`plan` 生成工程に `markdownlint` による検査を組み込みました。
- 具体的には、`src/exec/plans-generation.ts` を修正し、生成される `plan` ファイルに対して `plan-markdownlint.ts` を用いた検査を行うように変更しました。また、`exec run --auto --dry-run` は検査対象に含まれますが、`exec run --task &lt;task-id&gt; --dry-run` は対象外となるよう制御しています。
- TypeScript の型インポートに関する警告（`@typescript-eslint/consistent-type-imports` 違反）についても、`src/exec/plan-markdownlint.ts` 等の修正を通じて解消しました。
- 個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-fvrz-plan-markdown-early-check.md` を更新し、対応内容を記録しました。

## 2. 変更ファイル

- `CHANGELOG.md`: `CHANGELOG.md` の更新。
- `docs/ja/specdojo/guides/schedule-operation-guide.md`: `docs/ja/specdojo/guides/schedule-operation-guide.md` の更新。
- `src/exec/plans-generation.ts`: `src/exec/plans-generation.ts` において、`plan` 生成時に `markdownlint` による検査を行うロジックを追加。
- `src/exec/plan-markdownlint.ts`: `src/exec/plan-markdownlint.ts` を新規作成（または更新）し、`plan` の構文を検査する機能を実装。
- `tests/helpers/plan-markdownlint.ts`: `tests/helpers/plan-markdown-lint.ts` を作成（または更新）。
- `tests/src/exec/plan-markdownlint.integration.test.ts`: `tests/src/exec/plan-markdownlint.integration.test.ts` を作成（または更新）。
- `tests/src/exec/plan-markdownlint.test.ts`: `tests/src/exec/plan-markdownlint.test.ts` を作成（または更新）。

## 3. 申し送り

- result には、検査時点を共通の `plan` 生成処理にした理由と `dry-run` の適用範囲を記録してください。展開済み `plan` 全体を検査でき、`auto` と処理を共有できるためです。`exec run --auto --dry-run` は検査対象です。`plan` を生成しない `exec run --task &lt;task-id&gt; --dry-run` は対象外です。詳細は個票に記載済みです。
- 前回の `lint-ts` エラーである `@typescript-eslint/consistent-type-imports` 違反を修正しました。`typecheck`・`lint`・単体／`integration` テストなど、設定済みの親検証の再実行結果は runner が記録してください。
- 統合後はオーケストレーター運用メモに従い、`PJR-JSEY` で runner の動作を確認してから `close` してください。個票にも記録済みです。
- result には、検査時点を共通の plan 生成処理にした理由と dry-run の適用範囲を記録してください。展開済み plan 全体を検査でき、auto と処理を共有できるためです。`exec run --auto --dry-run` は検査対象です。plan を生成しない `exec run --task &lt;task-id&gt; --dry-run` は対象外です。詳細は個票に記載済みです。
- 前回の lint-ts エラーである `@typescript-eslint/consistent-type-imports` 違反を修正しました。typecheck・lint・単体／integration テストなど、設定済みの親検証の再実行結果は runner が記録してください。
- 統合後はオーケストレーター運用メモに従い、PJR-JSEY で runner の動作を確認してから close してください。個票にも記録済みです。

## 4. 進め方

1. `src/exec/plan-markdownlint.ts` を作成し、`plan` ファイルの Markdown 構文を検査するロジックを実装しました。2. `src/exec/plans-generation.ts` を修正し、`plan` 生成プロセスの中でこの検査を実行するように変更しました。3. 検証用のテストコード（`tests/src/exec/plan-markdownlint.test.ts` 等）を追加しました。4. 最後に個票を更新し、変更内容と `lint-ts` エラーの修正について記述しました。
