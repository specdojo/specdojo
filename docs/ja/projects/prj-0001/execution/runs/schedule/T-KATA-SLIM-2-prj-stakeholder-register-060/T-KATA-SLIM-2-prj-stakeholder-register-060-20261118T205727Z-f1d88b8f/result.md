---
specdojo:
  id: prj-0001:xer-t-kata-slim-2-prj-stakeholder-register-060-20261118t205727z-f1d88b8f
  type: exec-result
  task_id: T-KATA-SLIM-2-prj-stakeholder-register-060
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-SLIM-2-prj-stakeholder-register-060/T-KATA-SLIM-2-prj-stakeholder-register-060-20261118T205727Z-f1d88b8f/plan.md
  started_at: "2026-11-18T20:57:35.136Z"
  completed_at: "2026-11-18T21:31:45.515Z"
  agent: opus-executor
  execution: agent
  approach: recipe-maintenance
  targets:
    - prj-0001:prj-stakeholder-register
    - specdojo:prj-stakeholder-register-recipe
---

# Edit Result

## 1. 実施内容

- ステークホルダー登録簿の `recipe` から、運用の記述と言い直し、構造検査などの冗長な内容を削除し、執筆に不可欠な問いやコツに絞った記述へスリム化した。
- grade result で指摘されていた F001〜F009 の問題を `recipe` 側の記述修正（追跡範囲の統一や仕上げチェック項目の適正化など）により解消した。
- Recipe 記述標準に従い、本文から `rulebook` や `sample` への直接的な参照を排除し、成果物の章名による指示形式に変更した。

## 2. 変更ファイル

- `docs/ja/specdojo/recipes/prj-stakeholder-register-recipe.md`: rulebook と重複する判断基準や共通運用、構造検査の記述を削除し、書く順番・入力元・問い・コツ・深掘り手順に絞って再構成した。また、追跡 ID の範囲を証跡要件までとし rulebook/template と整合させた。

## 3. 申し送り

- 大きさ: 前 3,619 字（区切り行を含めると 3,957 字・11,529 B）、後 2,529 字（区切り行を含めると 2,829 字・7,732 B）、比 69.9%。測り方は PJR-7M9J と同じで、空白（改行を含む）と表の区切り行を除いて数えた。
- finding の対応: F001・F006 は仕上げチェックのカラム充足の確認を外した。F002・F004・F005・F009 は ID で追跡する終点を「関係者一覧から必要な合意・関与方針・証跡要件まで」の 1 つにそろえ、見直し条件の表に ID を要求しないことで rulebook・template と整合させた。F003 は期限を会議の頻度でなく判断の節目で書くコツ（4.3）、F007 は合意を取る時点と関与方針の期限を照らす深掘り手順 2 とレビュー観点「合意の時点」、F008 は承認者を「-」にしないコツ（4.5）と仕上げチェックの行で対応した。
- 参照の形: Recipe 記述標準の「記述ガイド」に従い、本文に rulebook・sample への参照を書かず、判断の基準は成果物の章名で示すだけにした。共通の運用の参照文も書いていない。8 章の構成は保った。
- sample の変更案（この段では直さない）: prj-stakeholder-register-sample の STH-FAMILY-USER について、エンゲージメント方針の「リリース後に試利用させる」を、コミュニケーション要件の「リリース前の試利用に参加」とそろえて「リリース前に試利用させる」にする（F007）。
- sample の変更案: STH-TECH-MENTOR の「週次相談」が関係者一覧・影響度分析・エンゲージメント方針・コミュニケーション要件に繰り返し書かれている。会議の頻度はコミュニケーション計画へ渡すにとどめ、関係者一覧の備考と計画への反映欄からは外す（F003）。
- sample の変更案: 見直し条件の「プロジェクトの目的・スコープ変更」行の承認者「-」を、承認する役割名に置き換える（F008）。
- rulebook と template は変える点がなかった。見直し条件の表に ID の列を足す案は採らず、ID で追跡する終点を証跡要件にそろえた。
- 適用外の検証: `npm run validate:history-links`（変更は recipe のみで、pjr 個票・plan・result を変更していない）

## 4. 進め方と実践の型の適用

recipe-maintenance
