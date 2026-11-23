---
specdojo:
  id: prj-0001:xer-t-kata-wave-6-notation-cxd-sample-040-20261123t054015z-266e22df
  type: exec-result
  task_id: T-KATA-WAVE-6-NOTATION-cxd-sample-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-6-NOTATION-cxd-sample-040/T-KATA-WAVE-6-NOTATION-cxd-sample-040-20261123T054015Z-266e22df/plan.md
  started_at: "2026-11-23T05:40:24.397Z"
  completed_at: "2026-11-23T05:58:11.399Z"
  agent: opus-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - specdojo:cxd-sample
    - specdojo:cxd-rulebook
---

# Edit Result

## 1. 実施内容

- rulebook の簡潔化および Mermaid 構文検査手順の追加を行いました。
- `docs/ja/specdojo/rulebooks/cxd-rulebook.md` において、1.1 節の表を PJR-76N9 に基づいて利用場面ごとの記述に整理し、F002 に対応する `npm run lint:mermaid` による検証手順を追加しました。また、F001 については既に指示通りの参照形式であったため、変更を行っていません。
- `docs/ja/specdojo/rulebooks/cxd-mermaid-rulebook.md` については、plan の「完成例は sample に任せる」という方針に従い、サンプルおよび重複箇所の図を削除し、対応表、標準スタイル、エッジ、命名、禁止事項に情報を集約して簡潔に整えました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/cxd-mermaid-rulebook.md`: サンプルの章と繰り返しを示す図を削除し、対応表・標準スタイル・エッジ・命名・禁止事項の記述に整理して簡潔にしました。
- `docs/ja/specdojo/rulebooks/cxd-rulebook.md`: 1.1 節の表を、利用場面に応じた判断の形式へと整理しました。また、Mermaid 構文の検証手順（`npm run lint:mermaid`）を追加しました。F001 の指摘事項については、既に指示通りの参照形式になっていたため、変更は行っていません。

## 3. 申し送り

- F001 は現行の `cxd-rulebook` 全体方針 L28 ですでに「正本の選び方と参照の境界」を参照する 1 行になっており、指摘された列挙が残っていないため直していません。
- condense の記録 6 件（`cause=kata:rulebook`, `action=retain`）は、指している 1.1 / 6.1 / 6.2 / 6.3.x / 6.4 / 6.5 / 7 に重複がないため維持しました。概要の要件の「主要ステークホルダー」は成果物の中身（システム側の利害関係者）であり、変えると `cxd-sample` の概要の表と合わなくなるため残しました。
- `cxd-mermaid-rulebook` の「サンプル（最小）」の章は plan の「完成例は sample に任せる」に従って外しました。rulebook 記述標準の『個別の改訂で先行して削除しない』という経過措置と食い違うため、確定するときに確認してほしいです。
- F001 は現行の cxd-rulebook 全体方針 L28 ですでに「正本の選び方と参照の境界」を参照する 1 行になっており、指摘された列挙が残っていないため直していない（result の `進め方と実践の型の適用` に記録すること）。
- condense の記録 6 件（cause=kata:rulebook、action=retain）は、指している 1.1 / 6.1 / 6.2 / 6.3.x / 6.4 / 6.5 / 7 に重複がないため維持した。概要の要件の「主要ステークホルダー」は成果物の中身（システム側の利害関係者）であり、変えると sample の概要の表と合わなくなるため残した。
- cxd-mermaid-rulebook の「サンプル（最小）」の章は plan の「完成例は sample に任せる」に従って外した。rulebook 記述標準の『個別の改訂で先行して削除しない』という経過措置と食い違うため、確定するときに確認してほしい。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/rulebooks/ 配下だけで、plan・result・個票を変えていない）

## 4. 進め方と実践の型の適用

rulebook-maintenance
