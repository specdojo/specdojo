---
specdojo:
  id: prj-0001:xer-pjr-5c3m-20261125t125818z-f146778b
  type: exec-result
  task_id: PJR-5C3M
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-5C3M/pjr-5c3m-20261125T125818Z-f146778b/plan.md
  started_at: "2026-11-25T12:58:19.579Z"
  completed_at: "2026-11-25T13:10:20.579Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- result の自由記述を描く処理で bare URL を autolink に直し、コードの書式の前後の空白を除くようにした（reporter と executor の `handoff` の両方に効く）。autolink の山括弧と URL の中の `_` は保持する。reporter のプロンプトと書式のやり直しの指示に代わりの書き方を足した。markdown.instructions.md の外部 URL の書き方を autolink だけに改め、検査を足し、個票の対応結果を埋めた。

## 2. 変更ファイル

- `.github/instructions/markdown.instructions.md`: 変更、+1 / -1 行
- `src/exec/reporter-repair.ts`: 変更、+2 / -4 行
- `src/exec/reporter.ts`: 変更、+3 / -1 行
- `src/exec/result-markdownlint.ts`: 変更、+1 / -1 行
- `src/exec/results.ts`: 変更、+14 / -3 行
- `src/exec/shared.ts`: 変更、+2 / -0 行
- `src/register/item.ts`: 変更、+1 / -30 行
- `src/shared/text.ts`: 変更、+53 / -1 行
- `tests/src/exec/result-markdownlint.test.ts`: 変更、+27 / -18 行
- `tests/src/shared/text.test.ts`: 変更、+44 / -0 行

## 3. 申し送り

- 直した後に review の段を 1 件流して止まらないことを確かめる作業は、agent の起動を伴うため executor では行っていない。統合の後に人かオーケストレーターが流して確かめてから PJR-5C3M を close する。
- 規則の変更として、`.github/instructions/markdown.instructions.md` の履歴蓄積ファイルのリンク記法を「autolink で書く。bare URL は MD034 に当たるため書かない」に改めた。MD034 の設定は変えていない。
- 人の確認が必要: `review の段を 1 件流して reporter が止まらないことの確認`（実際の agent CLI の起動が必要。統合の後に review の段を 1 件流して確かめる）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
