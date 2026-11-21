---
specdojo:
  id: prj-0001:xer-pjr-93nk-20261106t120141z-cd10ef24
  type: exec-result
  task_id: PJR-93NK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-93NK/20261106T120141334Z-f626ce92/plan.md
  started_at: "2026-11-06T12:01:57.250Z"
  completed_at: "2026-11-06T12:14:24.944Z"
  agent: sol-executor
  approach: recipe-maintenance
  targets:
    - specdojo:stsd-recipe
---

# Edit Result

## 1. 実施内容

- stsd-recipe の手順、問い、例、およびレビュー観点を、新しい章立て（「目的」、「適用範囲」、「状態の判定」、「状態遷移」）と、遷移 ID (`T-&lt;nn&gt;`) を含むラベル形式に更新しました。
- 「適用範囲」の記述から状態の正本や判定規則を分離し、「状態の判定」の章へ移動するよう手順を修正しました。
- 「状態遷移」の章において、図の直下に遷移の表を配置する構成に合わせ、図のラベルに遷移 ID を含める手順を追加しました。
- 成果物としての `docs/ja/projects/prj-0001/execution/exec/results/pjr-93nk-20261106T120141Z-cd10ef24-result.md` に、今回の改訂内容および今後のための申し送り事項を記録しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/stsd-recipe.md`: 新しい章立て（目的、適用範囲、状態の判定、状態遷移）および遷移 ID 付きのラベルを使用する手順、図の直後に遷移の表を置く構成、およびスコープの扱いに関する記述を更新しました。

## 3. 申し送り

- stsd-template には旧章立て、適用範囲内の正本、常時記入するスコープ、遷移 ID のないラベルが残っている。PJR-8TMF で新章立て・ラベル・スコープの扱いへ追従すること。同じ内容を PJR-93NK の対応結果に記録済み。
- 適用外の検証: `npm run validate:schema:file`（executor が変更したファイルは Markdown のみ。）

## 4. 進め方と実践の型の適用

stsd-recipe のメンテナンスを実施し、新しい章立ておよび遷移 ID 入りのラベル形式に適応させました。これにより、今後の Kata 作成における一貫性を確保します。
