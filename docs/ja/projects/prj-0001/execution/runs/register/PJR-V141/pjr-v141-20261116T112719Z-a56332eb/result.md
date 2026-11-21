---
specdojo:
  id: prj-0001:xer-pjr-v141-20261116t112719z-a56332eb
  type: exec-result
  task_id: PJR-V141
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-V141/pjr-v141-20261116T112719Z-a56332eb/plan.md
  started_at: "2026-11-16T11:27:20.634Z"
  completed_at: "2026-11-16T11:41:08.742Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- result の frontmatter へ書き写す condense の記録（location・reason・cause.location）と `block_reason` の山括弧を、コードスパンの外にあればコードの書式で包むようにした（`inlineCodeFrontmatterAnglePlaceholders`）。回帰テストを足し、個票の対応結果を書いた。

## 2. 変更ファイル

- `src/exec/results.ts`: 変更、+36 / -4 行
- `src/exec/shared.ts`: 変更、+1 / -0 行
- `src/shared/text.ts`: 変更、+11 / -1 行
- `tests/src/exec/condense.test.ts`: 変更、+85 / -0 行

## 3. 申し送り

- 決めたこと: lint で検査して止めず、書き写すときにコードスパンの外の山括弧を包む方式にした。止めると executor の正しい記録が書式の問題だけで失われるため。frontmatter 用の関数は lint-fm に合わせて autolink（`&lt;https://...&gt;`）も包む。
- executor の文を frontmatter へ書き写す箇所は `condense_records`（`renderReporterResult`・`serializeFrontmatter`）と `block_reason`（`serializeFrontmatter`）の 2 つで、両方に適用した。result の frontmatter のほかの項目は runner が決める値。
- CHANGELOG に書く事項（個票にも記載）: 区分 Fixed。文案「condense の段の result の frontmatter に executor の記録の山括弧（例: `&lt;provider&gt;`）がそのまま入り、lint-fm で落ちていた不具合を直した。block 理由の山括弧も同様にコードの書式にする（PJR-V141）。」
- 保護された設定の変更は不要。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
