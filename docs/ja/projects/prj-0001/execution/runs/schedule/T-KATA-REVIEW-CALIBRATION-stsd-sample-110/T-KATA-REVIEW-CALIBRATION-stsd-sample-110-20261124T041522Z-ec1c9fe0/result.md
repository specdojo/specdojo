---
specdojo:
  id: prj-0001:xer-t-kata-review-calibration-stsd-sample-110-20261124t041522z-ec1c9fe0
  type: exec-result
  task_id: T-KATA-REVIEW-CALIBRATION-stsd-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-CALIBRATION-stsd-sample-110/T-KATA-REVIEW-CALIBRATION-stsd-sample-110-20261124T041522Z-ec1c9fe0/plan.md
  started_at: "2026-11-24T04:15:29.937Z"
  completed_at: "2026-11-24T04:19:44.296Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
    - specdojo:stsd-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）の確かめとして、`stsd-sample` を Sample 記述標準と `stsd-rulebook` の目的に照らして見直した。
- 要らない内容として、`T-06` の補足にあった納品不足分の数量記録と仕入先への連絡手順を削除した。この手順は、適用範囲で対象外としている納品不足分を扱っており、現物のある個品の状態・遷移という責務を越えていた。
- R1 として足すべき内容は認めなかった。主題・目的・境界、個品と数量分割、正本・一意判定・互換、状態一覧、通常系と返品系の遷移は必要な内容として維持した。
- 状態値・状態名・遷移 ID・図・遷移条件は変更していない。Prettier と `git diff --check` は成功し、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stsd-sample.md`: 遷移 `T-06`（検品済み→返品待ち）の補足から、対象外の納品不足分について数量を仕入記録へ記録し、仕入先へ連絡する手順を削除した。対象外の宣言と、返品対象の分離確認、分離未完了時に販売対象へ混ぜず店主代表へ引き継ぐ記述は維持した。差分は 5 行追加・5 行削除。

## 3. 申し送り

- 指摘表（R1） | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | 5. 状態遷移（`T-06` の補足） | 適用範囲で対象外とした納品不足分について、数量記録と仕入先への連絡手順を定めており、個品の状態・遷移という責務を越えている。 | 納品不足分の記録・連絡手順を削除した。対象外の宣言と、返品対象の分離・引き継ぎは維持した。 | `vp-po-purpose-alignment`、`vp-arc-single-responsibility`、`vp-qe-kata-conformance`。`stsd-rulebook` の全体方針・本文要件、Sample 記述標準のサンプル群の目的。 | - |
- 段を分けた既存 finding（grade 結果の F001・F002）は R1 の対象外のため未修正で、解消済みとは扱わない。F001（検品の合格基準・品質不良の判定基準が未定義）は `vp-qe-verifiability` に関わるため R4 へ申し送る。F002（店番担当は店主代表を含むのに「店番担当は…店主代表へ引き継ぐ」と書かれ、主体が不明確）は `vp-ux-language-consistency` に関わるため R3 へ申し送る。
- 要判断の指摘はない。rulebook を正とした変更で、他の Kata の修正提案もない。
- reporter 向け実施内容の指摘表: | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | 5. 状態遷移（T-06 の補足） | 2. 適用範囲で対象外とした納品不足分について、数量記録と仕入先への連絡手順を定めていた。現物のある個品の状態・遷移という責務を越えている。 | 納品不足分の記録・連絡手順を削除した。対象外の宣言と、返品対象の分離・引き継ぎは維持した。 | `vp-po-purpose-alignment`、`vp-arc-single-responsibility`、`vp-qe-kata-conformance`。stsd-rulebook の全体方針・本文要件、Sample 記述標準のサンプル群の目的。 | - |
- reporter 向け変更ファイル・判断根拠: 変更した成果物は docs/ja/specdojo/samples/stsd-sample.md のみ。一次根拠は docs/ja/specdojo/rulebooks/stsd-rulebook.md の全体方針・本文要件・記述ガイド、docs/ja/specdojo/standards/sample-authoring-standard.md の適用範囲・サンプル群の目的・構成の原則。docs/ja/specdojo/recipes/stsd-recipe.md の対象と業務境界・委譲の境界、docs/ja/specdojo/guides/kata-guide.md の 6.1・6.3・6.5、docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml の stsd-sample の `done_criteria` を照合した。主題・目的・境界、個品と数量分割、正本・一意判定・互換、状態一覧、通常系と返品系の遷移は必要な内容として維持し、R1 として追加すべき内容は認めなかった。状態値・状態名・遷移 ID・図・遷移条件は変更しておらず、差分確認で構造への影響がないことを確認した。rulebook を正とする変更であり、他の Kata の修正提案や要判断の指摘はない。
- 段を分けた既存 finding: docs/ja/projects/prj-0001/execution/grade/results/specdojo.stsd-sample.yaml の F001・F002 を、plan の `source=grade` 相当の根拠として実際に読み、anchor と sample を照合した。condense 起因の記録は plan にない。F001 は `vp-qe-verifiability` の判定条件（pass / fail を決められる表現）に関わるため R4 へ申し送る。検品合格・品質不良の基準または根拠への参照を確認・補足すること。F002 は `vp-ux-language-consistency` の用語統一に関わるため R3 へ申し送る。店主代表を含む店番担当から店主代表へ引き継ぐ表現の主体を明確にすること。両件とも R1 の対象外として未修正であり、解消済みとは扱わない。
- Markdown・frontmatter・図・文書テストなど、指定された親検証は runner に委ねた。reporter は上記の指摘表と判断根拠を result の所定セクションへ反映すること。
- 適用外の検証: `npm run validate:schema:file`（変更した成果物は Markdown のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（個票、既存 plan、result などの履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

sample メンテナンスの進め方に従い、参照の向きを成果物から sample に切り替えて見直した。executor の evidence によると、根拠とした規範は次のとおり。`stsd-rulebook` の全体方針・本文要件・記述ガイド、Sample 記述標準の適用範囲・サンプル群の目的・構成の原則、`stsd-recipe` の対象と業務境界・委譲の境界、kata-guide の 6.1・6.3・6.5、`dct-kata.yaml` の `stsd-sample` の `done_criteria`。維持した記述は、主題・目的・境界、個品と数量分割、正本・一意判定・互換、状態一覧、通常系と返品系の遷移。これらは rulebook の要求に沿った必要な内容である。改訂したのは `T-06` 補足の納品不足分の手順だけで、rulebook を正として削除した。grade の finding の F001 と F002 は R1 の観点に当たらないため、R4 と R3 へ申し送った。grade サイドカーと result は直接編集していない。
