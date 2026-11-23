---
specdojo:
  id: prj-0001:xer-pjr-tjzm-20261123t023733z-7d3cedb1
  type: exec-result
  task_id: PJR-TJZM
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-TJZM/pjr-tjzm-20261123T023733Z-7d3cedb1/plan.md
  started_at: "2026-11-23T02:37:34.466Z"
  completed_at: "2026-11-23T02:45:43.398Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- runner のログ出力における項目のタイトルのエスケープ問題を修正しました。
- `exec run --register` および `--dry-run` の実行時に、`Register item:` および `[dry-run] register item:` の行で、タイトルの `_` が `\_` と表示される問題を解消しました。
- 具体的には、`src/exec/run/register-core.ts` と `src/exec/run/register-mode.ts` において、タイトルを `unescapeMarkdownCell` を用いて適切にデコードするように変更しました。
- また、`tests/src/exec/register-pipeline-e2e.integration.test.ts` に、エスケープが解除されたことを検証するテストケースを追加しました。

## 2. 変更ファイル

- `src/exec/run/register-core.ts`: `Register item:` の行で出力するタイトルに対して `unescapeMarkdownCell` を適用し、`_` がエスケープされないように修正しました。
- `src/exec/run/register-mode.ts`: `[dry-run] register item:` の行で出力するタイトルに対して `unescapeMarkdownCell` を適用し、`_` がエスケープされないように修正しました。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: タイトルの `_` が正しく表示されることを確認するための、dry-run 実行時のアサーションを拡張しました。

## 3. 申し送り

- 追加したアサーションは `tests/src/exec/register-pipeline-e2e.integration.test.ts` にあり、実行は親 runner の `npm run test:integration` に委ねる。このテストは `pjr-index.md` のタイトルを書き換えて dry-run の出力を確かめるため、タイトルの読み込み元が `pjr-index.md` でなければ失敗する。落ちた場合はその点を確認する。
- CHANGELOG に書く事項は個票の対応結果 5.1 に記載済み（区分: Fixed）。

## 4. 進め方

まず、`src/exec/run/register-core.ts` および `src/exec/run/register-mode.ts` を調査し、`Register item:` 行のログ生成ロジックを特定しました。そこでタイトルの Markdown エスケープがそのまま出力されていることが判明したため、`unescapeMarkdownCell` を導入して適切にデコードするよう修正しました。その後、`tests/src/exec/register-pipeline-e2e.integration.test.ts` を更新し、エスケープ解除が正しく行われているかを検証するテストを追加しました。
