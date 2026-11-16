---
specdojo:
  id: prj-0001:xer-pjr-8zx8-20261115t190826z-b38426f5
  type: exec-result
  task_id: PJR-8ZX8
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-8ZX8/pjr-8zx8-20261115T190826Z-b38426f5/plan.md
  started_at: "2026-11-15T19:08:28.246Z"
  completed_at: "2026-11-15T21:01:19.024Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- br・bes・bac・opr の template の `frontmatter_template` の `id` を `_LOCAL_ID_` に直し、個票の作業内容と対応結果を更新済み。4 つの型の `grade run --target kata` は agent を起動して利用枠を使うため、人の実行が残る。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/bac-template.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/templates/bes-template.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/templates/br-template.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/templates/opr-template.md`: 変更、+1 / -1 行

## 3. 申し送り

- 未完了（人が実行する）: 4 つの型（br・bes・bac・opr）を `grade run --target kata` で grade し、id の書き方の指摘が出ないことを確かめる。agent を起動して利用枠を使うため executor では実行していない。
- 決めたこと: `based_on: _BASED_ON_` は変えなかった。完了条件が求めているのは `id` だけのため。
- 決めたこと: template-authoring-standard の予約済みプレースホルダ表の例 `_PROJECT_ID_:_LOCAL_ID_` は変えなかった。プロジェクト管理文書の template では今も正しい書き方のため。
- 人の確認が必要: `specdojo grade run --target kata (br・bes・bac・opr)`（agent を起動して利用枠を使うため、人が実行して id の書き方の指摘が出ないことを確かめる）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
