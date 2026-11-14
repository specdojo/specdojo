---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-cpd-specdojo-cli-045-20261114t002305z-6f3c5073
  type: exec-result
  task_id: T-KATA-WAVE-1-cpd-specdojo-cli-045
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-cpd-specdojo-cli-045/T-KATA-WAVE-1-cpd-specdojo-cli-045-20261114T002305Z-6f3c5073/plan.md
  started_at: "2026-11-14T00:23:09.758Z"
  completed_at: "2026-11-14T00:37:08.107Z"
  agent: sol-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - cpd-specdojo-cli
    - specdojo:cpd-recipe
---

# Edit Result

## 1. 実施内容

- CPD recipe の問い・作成手順・判断例を改訂し、C4 の型メニューを補完しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/cpd-recipe.md`: 上位の成功基準との接続、確認者と公開範囲、未決事項の担当・判断者・判断時点、変更影響の追跡を具体化する問いと手順を追加し、各章に良い例・悪い例を補いました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: CPD recipe および template を追加し、併せて CND recipe と template の登録漏れを修正しました。

## 3. 申し送り

- reporter 向け実施内容・変更ファイル: docs/ja/specdojo/recipes/cpd-recipe.md に、上位の成功基準との接続、確認者と公開範囲、未決事項の担当・判断者・判断時点、変更影響の追跡を具体化する問いと手順を追加した。各章に良い例・悪い例を補い、既存の責務分割・障害境界の問いを維持した。packages/docs-site/.vitepress/sidebar-config.ts に CPD recipe・template を追加し、同じ C4 メニューで残っていた CND recipe・template の登録漏れも補った。
- reporter 向け判断根拠: recipe-authoring-standard、rulebook-authoring-standard、cpd-rulebook の「記述ガイド」、ryu-guide の「実践の型メンテナンスの進め方」、共通レビュー観点の `vp-arc-conciseness`・`vp-qe-kata-conformance` を確認した。cpd-specdojo-cli、cnd-specdojo、cpd-sample、cpd-template と照合し、論理分割と実装確認済み構成、正本と派生物、作業結果と人間の判断を区別する問いを維持・補強した。既存の grade 結果 specdojo.cpd-rulebook.yaml・specdojo.cpd-sample.yaml は改訂前の評価として補助参照し、今回の修正要件は現行 rulebook を正とした。plan に展開された finding はない。
- reporter 向け要否判断: recipe は責務分割や依存・観測点を導く思考手順に必要、template は図・定義表・検証対象の記入骨組みに必要と判断し、cpd-rulebook の既存宣言 `specdojo:cpd-recipe`・`specdojo:cpd-template` を維持した。完成例は既存の `specdojo:cpd-sample` に外出し済みであり、新規作成は不要。PJR-2GD6 に沿い、値・構文・構造の詳細や規約一覧を recipe に再定義していない。result と grade サイドカーは編集していないため、判断根拠を result の「進め方と実践の型の適用」へ記録すること。
- reporter 向け判断根拠: recipe-authoring-standard、rulebook-authoring-standard、cpd-rulebook の「記述ガイド」、ryu-guide の「実践の型メンテナンスの進め方」、共通レビュー観点の vp-arc-conciseness・vp-qe-kata-conformance を確認した。cpd-specdojo-cli、cnd-specdojo、cpd-sample、cpd-template と照合し、論理分割と実装確認済み構成、正本と派生物、作業結果と人間の判断を区別する問いを維持・補強した。既存の grade 結果 specdojo.cpd-rulebook.yaml・specdojo.cpd-sample.yaml は改訂前の評価として補助参照し、今回の修正要件は現行 rulebook を正とした。plan に展開された finding はない。
- reporter 向け要否判断: recipe は責務分割や依存・観測点を導く思考手順に必要、template は図・定義表・検証対象の記入骨組みに必要と判断し、cpd-rulebook の既存宣言 specdojo:cpd-recipe・specdojo:cpd-template を維持した。完成例は既存の specdojo:cpd-sample に外出し済みであり、新規作成は不要。PJR-2GD6 に沿い、値・構文・構造の詳細や規約一覧を recipe に再定義していない。result と grade サイドカーは編集していないため、判断根拠を result の「進め方と実践の型の適用」へ記録すること。
- 適用外の検証: `npm run validate:schema:file`（変更した YAML・YML ファイルがない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo と packages/docs-site 配下に限られ、docs/ja/projects 配下の成果物を変更していない。）

## 4. 進め方と実践の型の適用

recipe-maintenance
