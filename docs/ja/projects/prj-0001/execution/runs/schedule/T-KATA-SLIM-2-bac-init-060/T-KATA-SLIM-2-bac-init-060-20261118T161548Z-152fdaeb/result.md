---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-bac-init-060-20261118t161548z-152fdaeb
  type: exec-result
  task_id: T-KATA-SLIM-2-bac-init-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-bac-init-060/T-KATA-SLIM-2-bac-init-060-20261118T161548Z-152fdaeb/plan.md
  started_at: "2026-11-18T16:15:58.386Z"
  completed_at: "2026-11-18T16:43:28.238Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - bac-init
    - specdojo:bac-recipe
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/recipes/bac-recipe.md` から、共通の運用記述、未決事項管理台帳の詳細、および `rulebook` と重複する判断基準の言い直しを削除し、内容をスリム化した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/bac-recipe.md`: 共通の運用記述（改訂手順、引き継ぎ等）、未決事項台帳の列定義と登録手順、`rulebook` と重複する判断基準（期待結果の4要素、`_TODO_` と `_UNDECIDED_` の使い分け、対象外の参照先）、重複するレビュー観点、および仕上げチェックの構造検査を削除。各章の良い例・悪い例を統合し、文字数を削減（空白除き 3188 字 → 2229 字）。

## 3. 申し送り

- result に前後の文字数を書く: 空白を除いて 3188 字から 2229 字（約 69.9%）。
- rulebook・sample・template の変更案: 今回見た範囲では、変える点は見つからなかった。
- 外した記述: 改訂の手順と QE・ARC・PO・PM への引き継ぎ、未決事項の台帳の列（判断依頼先・解消時点・追跡先）と PJR 登録の段落、rulebook と同じ判断の言い直し（期待結果の 4 要素、`_TODO_` と `_UNDECIDED_` の使い分け、対象外の参照先）、レビュー観点の重複（観測可能性、合意と継承）、仕上げチェックの構造の検査。各章の良い例・悪い例は「良い例 / 悪い例」の表にまとめた。
- 残した記述: 使い方（Why・What・How・Trace の 1 項目）、集める情報（取り出し元の列を追加）、書く順番とその理由、各節の問い 2 つとコツ（写さず参照に置き換える、を含む）、深掘り手順の 4 段、6 観点の良い例・悪い例。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/recipes/bac-recipe.md だけで、plan・result・個票は変更していない）

## 4. 進め方と実践の型の適用

Recipe記述標準および `rulebook` との整合性を担保しつつ、冗長な記述（共通運用、重複する判断基準、構造検査など）を徹底的に排除することで、レシピをスリム化し、書き手が集中すべき「問い」と「コツ」を明確にした。
