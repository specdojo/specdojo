---
specdojo:
  id: prj-0001:xer-t-kata-wave-2-bac-task-completion-060-20261115t063517z-92526966
  type: exec-result
  task_id: T-KATA-WAVE-2-bac-task-completion-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-2-bac-task-completion-060/T-KATA-WAVE-2-bac-task-completion-060-20261115T063517Z-92526966/plan.md
  started_at: "2026-11-15T06:35:21.526Z"
  completed_at: "2026-11-15T06:47:18.770Z"
  agent: sol-executor
  execution: agent
  approach: template-maintenance
  targets:
    - bac-task-completion
    - specdojo:bac-template
---

# Edit Result

## 1. 実施内容

- `docs/ja/specdojo/templates/bac-template.md` を現行 rulebook の必須項目・推奨列へ同期し、説明文を記入欄へ整理しました。

## 2. 変更ファイル

- `docs/ja/specdojo/templates/bac-template.md`: 現行 rulebook の必須項目・推奨列に同期し、概要への「対象者・業務課題と価値・シナリオ対応」欄の追加、判定方法への詳細表（期待結果・確認者等）の追加、およびメモ表の列数調整を実施しました。

## 3. 申し送り

- 判断根拠: template-authoring-standard、rulebook-authoring-standard、document-metadata-standard、bac-rulebook、bac-recipe、bac-sample、bac-task-completion とその依存3文書、および既存の BAC rulebook・sample の grade result を確認した。plan に展開された finding はない。
- 改訂内容: 概要に対象者・業務課題と価値・シナリオ対応欄を追加。前提・期待結果を記入項目へ分け、ケース表を期待結果の節へ移動。判定方法に期待結果・確認者・確認時点・観測先・照合対象の表を追加。メモ表を rulebook の推奨5列へ同期した。必須3章と第2〜第4階層の連番を維持した。
- 要否判断: recipe は業務仕様から受入条件を導く思考手順、template は共通構造の開始点として必要。rulebook の既存宣言 `specdojo:bac-recipe` と `specdojo:bac-template` を維持した。旧 grade にある `type=test` より現行 rulebook の requirement を正とし、生成物 Frontmatter と予約プレースホルダを維持した。成果物本体・result・grade サイドカーは編集していない。
- CHANGELOG 文案（変更）: 業務受入条件テンプレートに価値とシナリオの対応、期待結果ごとの判定欄、未決事項の追跡欄を整備。
- 要否判断: recipe は業務仕様から受入条件を導く思考手順、template は共通構造の開始点として必要。rulebook の既存宣言 specdojo:bac-recipe と specdojo:bac-template を維持した。旧 grade にある type=test より現行 rulebook の requirement を正とし、生成物 Frontmatter と予約プレースホルダを維持した。成果物本体・result・grade サイドカーは編集していない。
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown template のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:history-links`（履歴ファイル・plan・result を変更していない。）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/templates/ 配下のみで、docs/ja/projects/ 配下への成果物変更がない。）

## 4. 進め方と実践の型の適用

現行 rulebook の必須項目および推奨列に基づき `docs/ja/specdojo/templates/bac-template.md` を更新し、構造の整合性を確保しました。具体的には、概要欄への価値・シナリオ対応の追加や、判定方法における詳細な管理項目の整理、メモ表の列数同期を行い、執筆標準に沿ったテンプレートへと整備しました。
