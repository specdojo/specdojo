---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-prj-success-criteria-and-acceptance-criteria-060-20261118t150132z-a9dc8adf
  type: exec-result
  task_id: T-KATA-SLIM-2-prj-success-criteria-and-acceptance-criteria-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-prj-success-criteria-and-acceptance-criteria-060/T-KATA-SLIM-2-prj-success-criteria-and-acceptance-criteria-060-20261118T150132Z-a9dc8adf/plan.md
  started_at: "2026-11-18T15:01:37.969Z"
  completed_at: "2026-11-18T15:26:50.336Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:prj-success-criteria-and-acceptance-criteria
    - specdojo:prj-success-criteria-and-acceptance-criteria-recipe
---

# Edit Result

## 1. 実施内容

- recipe から運用の記述と言い直しを外す方針に基づき、`docs/ja/specdojo/recipes/prj-success-criteria-and-acceptance-criteria-recipe.md` を改訂しました。
- 空白を除いた文字数を 4,129 字から 2,763 字（66.9%）に削減し、記述の冗長性を解消しました。
- finding F003（文書種別の誤認）を解消し、「本ルールブック」という表現を「本書」に修正しました。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/prj-success-criteria-and-acceptance-criteria-recipe.md`: 運用の記述、rulebook との重複内容、および冗長な表現を削除し、レシピ記述標準に沿ってスリム化しました。あわせて finding F003 に基づく用語修正を行いました。

## 3. 申し送り

- 大きさ: 空白と表の区切り行を除いた文字数で、前 4,129 字・後 2,763 字（66.9%）。result の大きさの欄に書く。
- F003 は解消: 「本ルールブック」と書いていた文を「本書」に直し、4.5 節のコツにまとめた。
- F001・F002 は見送り: 今の rulebook には条件を追加・変更するとき変更理由と影響範囲を書く要件がない。改訂の運用はドキュメントメタ情報標準が扱い、plan も改訂の手順を外す記述に挙げている。古くなった指摘として扱い、次の grade の再評価で閉じる。
- 変更案: template（`docs/ja/specdojo/templates/prj-success-criteria-and-acceptance-criteria-template.md`）の未解決事項の表の列が rulebook の項目（論点・判定への影響・保留条件・当面の扱い）と合っているか確かめる。この段では確認していない。
- 変更案: 成果物 `prj-0001:prj-success-criteria-and-acceptance-criteria` の「例外条件と未解決事項」の表は「決めること・期限・責任者」と管理台帳の列になっている。成果物の改訂で rulebook の項目へそろえる（この段では成果物を変えない）。
- rulebook と sample は変える点がなかった。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していない）
- 適用外の検証: `npm run validate:schema:file`（YAML ファイルを変更していない）

## 4. 進め方と実践の型の適用

recipe-maintenance
