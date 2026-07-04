---
specdojo:
  id: prj-0001:xer-t-launch-prj-success-criteria-and-acceptance-criteria-010
  type: exec-result
  task_id: T-LAUNCH-prj-success-criteria-and-acceptance-criteria-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: exec/plans/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-010-plan.md
  started_at: "2026-06-24T14:55:07.181Z"
  completed_at: "2026-06-24T15:02:03.195Z"
  agent: codex-expert-edit-agent
  approach: bootstrap
---

## 1. 実施内容

- `prj-scope` の対象・対象外と整合させ、成功基準と受入条件を業務価値（BV）に対応付けた。各条件には、判定基準、測定方法または合格基準、証跡、確認者、承認者を明記した。
- rulebook を正として、構造・必須項目・禁止事項を一般化した。未宣言だった recipe と template を新規作成し、sample を完成最小例へ更新した。
- recipe / sample / template は、対象成果物の内容を丸写しせず、再利用可能な問い、駄菓子屋の例、プレースホルダへ分離した。
- `npm run -s lint:md` と `specdojo exec validate --project prj-0001` を実行し、いずれも成功した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/020-project-definition/prj-success-criteria-and-acceptance-criteria.md`
- `docs/ja/specdojo/rulebooks/prj-success-criteria-and-acceptance-criteria-rulebook.md`
- `docs/ja/specdojo/recipes/prj-success-criteria-and-acceptance-criteria-recipe.md`
- `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md`
- `docs/ja/specdojo/templates/prj-success-criteria-and-acceptance-criteria-template.md`
- `docs/ja/projects/prj-0001/030-project-management/execution/exec/results/T-LAUNCH-prj-success-criteria-and-acceptance-criteria-010-result.md`

## 3. 申し送り

- 初回公開後にしか測定できない利用実績と、ライセンス方針・外部貢献ルールは、例外条件と未解決事項に残した。決定後は該当する成功基準または受入条件を更新する。

## 4. 参考資料の活用

- bootstrap として既存の成果物・rulebook・sample を評価した。成果物は構造を維持して業務価値との対応と検証可能性を補強し、rulebook と sample は内容が薄いため更新した。recipe と template は未整備のため新規作成した。
- 同種の `status: ready` 文書として、`prj-scope` の rulebook / recipe / sample / template を、章構成、表の粒度、リンクとプレースホルダの記法の手本にした。`prj-overview` の同一4種も、reference material の frontmatter と標準章構成の確認に用いた。内容の根拠は [[prj-0001:prj-scope|プロジェクトスコープ]] と対象成果物に限定した。
- rulebook を構造・必須項目・禁止事項の正本とし、recipe は作成手順、sample は駄菓子屋の最小完成例、template はプロジェクト固有値を含まない骨組みに分離した。rulebook の既存の表に業務価値、確認者、承認者を追加したため、成果物・sample・template を同じ列構成へ揃えた。
- Web 出典は使用していない。一般的な外部情報を根拠とせず、対象文書、依存成果物、同種の ready 文書のみを参照した。
