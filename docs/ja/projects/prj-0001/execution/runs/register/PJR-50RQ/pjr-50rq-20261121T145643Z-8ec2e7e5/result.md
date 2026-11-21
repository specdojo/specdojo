---
specdojo:
  id: prj-0001:xer-pjr-50rq-20261121t145643z-8ec2e7e5
  type: exec-result
  task_id: PJR-50RQ
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-50RQ/pjr-50rq-20261121T145643Z-8ec2e7e5/plan.md
  started_at: "2026-11-21T14:56:43.692Z"
  completed_at: "2026-11-21T15:05:15.946Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- 検証時間を短縮するため、`lint` の並列化、変更されたファイルのみを対象とする `lint-changed` ツールの追加、および文書参照テスト用の `test-docs` の導入を行いました。
- `exec-defaults.schema.yaml` に `parallel` プロパティを追加し、`parent-validation.ts` でそれを利用して検証を実行するよう変更しました。
- 文書のみの変更に対応するため、`vitest.docs.config.ts` を作成し、`tools/lint-changed.mjs` を実装して、変更された Markdown ファイルの `lint:md` と `lint:fm` を効率的に実行できるようにしました。
- 各種設定ファイル（`exec-config-guide.md`）およびテストコードを更新しました。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: `parallel` プロパティの追加に関するガイドを更新しました。
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: `pipeline.parent_validations` の各項目において `parallel` プロパティを許容するようにスキーマを更新しました。
- `src/exec/parent-validation.ts`: `parallel` 設定が `true` の場合に検証を並列実行するロジックを追加しました。
- `tests/src/exec/parent-validation.test.ts`: `parallel` 設定に関するテストケースを追加しました。
- `tests/tools/lint-changed.test.ts`: `tools/lint-changed.mjs` のためのテストファイルを追加しました。
- `tools/lint-changed.mjs`: 変更されたファイルのみを対象に `lint:md` や `lint:fm` を実行するツールを実装しました。
- `vitest.docs.config.ts`: 文書検証用の Vitest 設定ファイルを追加しました。

## 3. 申し送り

- 保護された設定の反映案: `package.json` の `scripts` に `test:docs`（`vitest run --config vitest.docs.config.ts`）、`lint:md:changed`（`node tools/lint-changed.mjs md`）、`lint:fm:changed`（`node tools/lint-changed.mjs fm`）を追加する。`.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` は個票の対応結果 5.4 の案に従い、lint を `parallel: true` で並べ、`test-unit` と `test-integration` の `paths` から文書を外し、`test-docs` に文書の `paths` を付ける。反映は利用者の承認のもと feature ブランチで行う。
- 反映後に `.markdownlint*`・`.remarkrc*` の実在を確かめる。`parent_validation_concurrency` は今は 1 のままにし、文書だけを変える run を 1 回流して合計時間を変更前と比べた後に 4 へ上げる。比較の結果は個票に書く（オーケストレーターの作業）。
- 文書を読むテストの一覧は grep による確認で、全数確認ではない。integration テストが `cp` で文書を fixture へ複製する経路は `test-docs` に含めていない。
- 保護された設定の反映案: `package.json` の scripts に `test:docs`（`vitest run --config vitest.docs.config.ts`）、`lint:md:changed`（`node tools/lint-changed.mjs md`）、`lint:fm:changed`（`node tools/lint-changed.mjs fm`）を追加する。`.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` は個票の対応結果 5.4 の案に従い、lint を `parallel: true` で並べ、`test-unit` と `test-integration` の `paths` から文書を外し、`test-docs` に文書の `paths` を付ける。反映は利用者の承認のもと feature ブランチで行う。
- CHANGELOG の文案（区分は Added）は個票の対応結果 5.1 に書いた。
- 適用外の検証: `npm run typecheck`（親 runner の allowlist 検証であり、親の結果を正とする。）

## 4. 進め方

まず、`exec-defaults.schema.yaml` を変更して `parallel` 設定を導入し、`src/exec/parent-validation.ts` でその設定に基づいて並列実行を行うよう実装しました。次に、文書の変更のみを効率的に検証するための仕組みとして、`tools/lint-changed.mjs` と `vitest.docs.config.ts` を作成しました。最後に、これらに関連するガイドやテストコードの更新を行いました。
