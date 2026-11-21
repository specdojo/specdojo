---
specdojo:
  id: prj-0001:xer-pjr-n6gk-20261115t232557z-58a62b91
  type: exec-result
  task_id: PJR-N6GK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-N6GK/pjr-n6gk-20261115T232557Z-58a62b91/plan.md
  started_at: "2026-11-15T23:30:11.712Z"
  completed_at: "2026-11-16T00:10:38.867Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- 作業内容の表の検査（理由のない done 以外の行と `_TODO_` の行を検出）を src/register/work-table.ts に追加し、register close（止めて理由を出す）と post-review（close せず waiting）に組み込んだ。register edit plan テンプレートに表を実績に合わせる指示を足し、テストと個票の作業内容・対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/exec-templates/xep-register-template.md`: 変更、+1 / -1 行
- `src/exec/run/register-post-review.ts`: 変更、+16 / -1 行
- `src/register/transition-commands.ts`: 変更、+10 / -0 行
- `tests/src/exec/register-post-review.test.ts`: 変更、+14 / -0 行
- `tests/src/register/commands.test.ts`: 変更、+56 / -0 行
- `src/register/work-table.ts`: 追加、+66 / -0 行
- `tests/src/register/work-table.test.ts`: 追加、+86 / -0 行

## 3. 申し送り

- `_ASSUMPTION_:` 「plan の共通の約束」は全 plan 共通の `xp-common-conventions-template.md` ではなく、register の項目を対象にする plan の本文 `xep-register-template.md`（進め方 4）と解釈した。全 plan への展開が必要なら別途判断が要る。
- reporter での検査は入れず、close の前（手動の `register close` と post-review）の検査で完了を止める方式にした。
- インラインコード内の `_TODO_` は記法の説明として検査対象外とした（この個票自身の作業 2 の記述が該当）。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
