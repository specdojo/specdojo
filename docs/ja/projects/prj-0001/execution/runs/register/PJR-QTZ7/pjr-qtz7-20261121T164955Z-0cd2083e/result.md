---
specdojo:
  id: prj-0001:xer-pjr-qtz7-20261121t164955z-0cd2083e
  type: exec-result
  task_id: PJR-QTZ7
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-QTZ7/pjr-qtz7-20261121T164955Z-0cd2083e/plan.md
  started_at: "2026-11-21T16:49:56.002Z"
  completed_at: "2026-11-21T23:23:45.288Z"
  agent: qwen-executor
  block_reason: "parent validation failed: lint-md"
---

# Edit Result

## 1. 実施内容

- 外部プロジェクトへの `register add --commit` において、`-m` の各引数が改行された段落として扱われるよう、`src/register/external-project.ts` を修正しました。
- コミット失敗時に `commitlint` 等の hook 出力を適切に表示するため、`src/register/register.ts` で `gitOutputCapturingFailure()` を使用するように変更しました。
- これらの変更に伴い、`tests/src/register/commit.integration.test.ts` および `tests/src/register/external-project.test.ts` に新しいテストケースを追加しました。
- また、`tests/src/register/external-project.test.ts` において、前回の変更による期待値の齟齬（`stdio` の設定）を修正しました。

## 2. 変更ファイル

- `src/register/external-project.ts`: 各 `-m` 引数を個別のメッセージ段落として扱うよう、`message` 引数の扱いを変更しました。
- `src/register/register.ts`: コミット失敗時に Git の出力（`commitlint` のエラーメッセージ等）を `GitCommandError` に含めるよう修正しました。
- `tests/src/register/commit.integration.test.ts`: 新しいコミットメッセージ形式とエラーハンドリングの統合テストを追加しました。
- `tests/src/register/external-project.test.ts`: ユニットテストの更新および、`stdio` の期待値に関する修正を行いました。

## 3. 申し送り

- 個票 `PJR-QTZ7` §5「対応結果」と §5.1「CHANGELOG に書く事項」は前回の attempt で既に記載済みです。runner と human が完了判定を行ってください。
- parent runner が実行する `npm run test:unit` / `lint-ts` / `typecheck` / `lint-md` / `lint-fm` / `validate-schema` / `test-integration` 等の結果が本タスクの最終検証となります。sandbox 内では重複実行しません。
- 個票 §5.1 の CHANGELOG 文案（不具合修正 ×2）は reporter が対象バージョンの `CHANGELOG.md` へ転記してください。
- 個票 PJR-QTZ7 §5「対応結果」と §5.1「CHANGELOG に書く事項」は前回の attempt で既に記載済みで、今回の resume では変更なし。runner と human が完了判定を行う。
- parent runner が実行する npm run test:unit / lint-ts / typecheck / lint-md / lint-fm / validate-schema / test-integration 等の結果が本タスクの最終検証となる。sandbox 内では重複実行しない。
- 個票 §5.1 の CHANGELOG 文案（不具合修正 ×2）は reporter が対象バージョンの CHANGELOG.md へ転記する。
- 適用外の検証: `npm run lint:mermaid`（対象ファイル（.ts と .md）に mermaid 記述がないため、lint-mermaid は検出対象なし。）
- 適用外の検証: `npm run lint:d2`（対象ファイルに D2 記述がないため、lint-d2 は検出対象なし。）
- 適用外の検証（runner の判定）: `npm run lint:md`（変更に Markdown ファイル（`*.md`） がない）

## 4. 進め方

まず、`src/register/external-project.ts` を修正して、`message` 配列の各要素が `git commit -m` の段落と同様に扱われるようにしました。次に、`src/register/register.ts` において、コミット失敗時の原因（`commit-msg` hook の出力など）がユーザーに表示されるよう、エラーキャプチャのロジックを強化しました。最後に、これらの挙動を検証するためのテストケースを `tests/src/register/commit.integration.test.ts` と `tests/src/register/external-project.test.ts` に追加し、既存のテストの不整合も解消しました。
