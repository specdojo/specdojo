---
specdojo:
  id: prj-0001:xer-t-kata-wave-1-sysd-index-040-20261114t014316z-e664824b
  type: exec-result
  task_id: T-KATA-WAVE-1-sysd-index-040
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-1-sysd-index-040/T-KATA-WAVE-1-sysd-index-040-20261114T014316Z-e664824b/plan.md
  started_at: "2026-11-14T01:43:32.890Z"
  completed_at: "2026-11-14T01:57:08.990Z"
  agent: sol-executor
  execution: agent
  approach: rulebook-maintenance
  targets:
    - sysd-index
    - specdojo:sysd-index-rulebook
---

# Edit Result

## 1. 実施内容

- `sysd-index-rulebook` の内容要件および記述ガイドを補強し、関連する `recipe` および `template` へのサイドバー導線を追加しました。

## 2. 変更ファイル

- `docs/ja/specdojo/rulebooks/sysd-index-rulebook.md`: 本文要件にソース管理・CIの所在・更新責任・検証方法を追加し、記述ガイドにおいて表の列定義、生成コマンドの照合、派生物と記録の区別、関連文書の分類・略語統一などの判断基準と良否例を補強しました。
- `packages/docs-site/.vitepress/sidebar-config.ts`: `specdojo:sysd-index-recipe` および `specdojo:sysd-index-template` のメニュー登録を行い、サイドバーからの導線を追加しました。

## 3. 申し送り

- reporter は result の実施内容・変更ファイル・進め方と実践の型の適用へ以下を記録する。変更ファイルは docs/ja/specdojo/rulebooks/sysd-index-rulebook.md と packages/docs-site/.vitepress/sidebar-config.ts の2件。成果物本体、sample・recipe・template 本文、grade サイドカー、result は編集していない。
- 判断根拠: rulebook-authoring-standard.md、document-metadata-standard.md、id-and-file-naming-standard.md、ryu-guide.md、共通レビュー観点の vp-qe-kata-conformance・vp-ux-readability・vp-ux-language-consistency・vp-arc-conciseness、成果物 docs/ja/product/040-system-design/sysd-index.md、対応 recipe・sample・template、clis-sample.md、および execution/grade/results/ 配下の sysd-index.yaml・specdojo.sysd-index-rulebook.yaml・specdojo.sysd-index-sample.yaml を確認した。
- 改訂判断: 成果物と template にあるソース管理・CI の所在・更新責任・検証方法を本文要件へ追加。記述ガイドでは表の各列の意味、対象リポジトリでの生成コマンド照合、派生物と業務記録・実行状態の区別、関連文書の分類・略語統一・表の連続性を明確化した。PJR-2GD6 に従い、値・構文・構造や設定全文は転載せず正本参照を維持した。
- finding 照合: F001 は現行 sample と template の6章および下位見出しの構成・順序が一致し、本文要件を満たす完成例として既に解消済み。F002 の不要括弧、F003 の途切れた表は現行文書に存在しない。F004 の旧略称混在も解消済みで, 今回、役割を示す分類名と初出展開した略語を揃える判断基準・良否例を補強した。旧 finding に合わせて過去の構成や固定分類を復元しない。
- recipe は正本候補・非該当・生成経路・確認経路を調べる手順が必要なため specdojo:sysd-index-recipe を維持。template は6章・表・留保欄の骨組みの正本として必要なため specdojo:sysd-index-template を維持。sample 宣言も維持し、完成例は外出し済みのため rulebook にサンプル章を追加しない。既存 sample は clis-sample 程度の具体性を備えており、本文の整合調整は後続段に委ねる。
- 新規文書は作成していないが、対応 recipe・template のメニュー未登録を確認したため両方を追加。rulebook・sample を含む4種の導線が揃った。親 runner が sidebar-kata.test.ts を含むテストと指定 lint を実行する。
- finding 照合: F001 は現行 sample と template の6章および下位見出しの構成・順序が一致し、本文要件を満たす完成例として既に解消済み。F002 の不要括弧、F003 の途切れた表は現行文書に存在しない。F004 の旧略称混在も解消済みで、今回、役割を示す分類名と初出展開した略語を揃える判断基準・良否例を補強した。旧 finding に合わせて過去の構成や固定分類を復元しない。
- 適用外の検証: `npm run validate:schema:file`（変更した YAML・YML ファイルがないため。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/ と packages/docs-site/ に限定され、docs/ja/projects/ 配下に及ばないため。）
- 適用外の検証: `npm run validate:history-links`（登録簿個票および既存 plan・result を変更していないため。）

## 4. 進め方と実践の型の適用

rulebook-maintenance
