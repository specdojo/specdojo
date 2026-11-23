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
  completed_at: "2026-11-23T02:55:50.803Z"
  agent: sonnet-executor
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- runner のログと `--dry-run` の `Register item:` 行が、Markdown 用にエスケープしたタイトルではなくエスケープ前のタイトルを出すように修正した。
- 親検証の `test-integration` で落ちた `register-pipeline-e2e.integration.test.ts` の dry-run 期待値を新しい出力に合わせた。ほかにエスケープ付きタイトルを期待するテストは `rg` で見つからなかった。
- executor ではテストを実行していない。直前の親検証では `test-integration` が failed だった。修正後の再実行結果は evidence にない。

## 2. 変更ファイル

- `src/exec/run/register-core.ts`: Register item 行をエスケープ前のタイトルで出すように変更し、区切り空白の欠落も直した。
- `src/exec/run/register-mode.ts`: `--dry-run` の register item 行も、エスケープ前のタイトルを出すように変更した。
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: dry-run 出力の期待値を、エスケープ付きタイトルからエスケープ前のタイトルに合わせて更新した。

## 3. 申し送り

- `test-integration` は、修正前の状態で `register-pipeline-e2e.integration.test.ts` の dry-run 期待値が落ちた。修正後の結果は親 runner での再実行で確認が必要。
- evidence の `target_coverage` には個票が changed として載っているが、`changes` には個票がない。個票の更新内容は evidence からは確認できない。

## 4. 進め方

タイトルのエスケープは一覧や個票向けの Markdown 処理であり、ログには不要と判断した。ログと dry-run の出力側でエスケープ前のタイトルを使い、再開指示に従ってテストの期待値を新しい出力に合わせた。
