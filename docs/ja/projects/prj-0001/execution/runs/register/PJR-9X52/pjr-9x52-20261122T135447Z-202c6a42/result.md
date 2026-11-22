---
specdojo:
  id: prj-0001:xer-pjr-9x52-20261122t135447z-202c6a42
  type: exec-result
  task_id: PJR-9X52
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-9X52/pjr-9x52-20261122T135447Z-202c6a42/plan.md
  started_at: "2026-11-22T13:54:47.978Z"
  completed_at: "2026-11-22T14:08:04.683Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Added an opt-in `related: true` option to `test-unit` and `test-integration` in `pipeline.parent_validations` (`src/exec/related-tests.ts`). When set, the runner follows relative imports and launched file paths to run only the tests that depend on the changed files, and falls back to the full suite when the change set is unknown, no related test is found, or the test infrastructure, settings or non-code files under the source roots changed. Without the option the full suite runs as before. The selection is recorded in the evidence `test_selection` field. Updated the `exec-defaults` and `exec-evidence` schemas, added unit tests, and documented the nightly and pre-release full runs in `exec-config-guide` and `exec-operation-guide`. Filled in the ticket with the estimates from today's runs (median 26 of 43 files, about 130s down to about 80s), the decisions and the CHANGELOG entry. The prj-0001 config is unchanged.

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+24 / -0 行
- `docs/ja/specdojo/guides/exec-operation-guide.md`: 変更、+5 / -0 行
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: 変更、+15 / -0 行
- `docs/specdojo/schemas/v1/exec-evidence.schema.yaml`: 変更、+28 / -0 行
- `src/exec/evidence.ts`: 変更、+14 / -0 行
- `src/exec/parent-validation.ts`: 変更、+111 / -7 行
- `tests/src/exec/agent-config.test.ts`: 変更、+3 / -1 行
- `tests/src/exec/parent-validation.test.ts`: 変更、+1 / -1 行
- `src/exec/related-tests.ts`: 追加、+259 / -0 行
- `tests/src/exec/related-tests.test.ts`: 追加、+306 / -0 行

## 3. 申し送り

- 決めた点: 選び方は `vitest related` ではなく runner が import を辿る形にした。流す前に選んだテスト・流さないテストを evidence の `test_selection` に残せ、単体テストで確かめられるため。統合テストの多くが `tsx src/specdojo.ts` で CLI を起動するので、テストが起動するファイルのパスも依存として辿る。
- 決めた点: どのテストにも依存されない変更コードがあっても、関係するテストが 1 つでもあれば絞る（全件に戻すと単体テストしか持たない src の変更のたびに全件になるため）。該当ファイルは `reason` に挙げる。`docs/specdojo/**` の schema・template はテストが実行時に読むため、変えたら全件に戻す。
- 決めた点: 絞って `passed` になった検証も `commit_hook_skips` の `covered_by` を満たす扱いのままにした（統合の commit で `npm test` 全件を流すと時間が減らないため）。見逃しは夜間とリリースの前の全件で拾う前提で、`exec-config-guide` に明記した。
- 保護された設定の変更案（未適用、利用者の判断待ち）: `.specdojo/exec-defaults.yaml` の `test-integration` の要素に `related: true` を足す（`paths` はそのまま）。夜間に `npm run test:integration` を流す routine などを先に用意してから入れる。
- 見込み: src か tests を変えた今日の 19 run で、選ばれる数の中央値は 43 本中 26 本（4 run は全件に戻る）、中央値 130 秒が約 80 秒の見込み（実測 × 選ばれる割合で、実際の短縮はこれより小さい）。例ごとの値は個票の対応結果の表にある。
- 残作業: runner の動きを変えたため、統合の後にオーケストレーターが JSEY を流して確かめてから close する（個票の作業内容 No.6 を `open` のまま残した）。
- CHANGELOG に書く事項（区分: 追加）: 親の検証の `test-unit`・`test-integration` に `related: true` を書くと、変更したファイルに関係するテストだけを流せるようにした。既定は今までどおり全件。選んだテストと理由は evidence の `test_selection` に残る（PJR-9X52）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
