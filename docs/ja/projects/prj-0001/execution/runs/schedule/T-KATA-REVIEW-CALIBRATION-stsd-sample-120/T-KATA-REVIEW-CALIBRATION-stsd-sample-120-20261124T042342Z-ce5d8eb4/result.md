---
specdojo:
  id: prj-0001:xer-t-kata-review-calibration-stsd-sample-120-20261124t042342z-ce5d8eb4
  type: exec-result
  task_id: T-KATA-REVIEW-CALIBRATION-stsd-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-CALIBRATION-stsd-sample-120/T-KATA-REVIEW-CALIBRATION-stsd-sample-120-20261124T042342Z-ce5d8eb4/plan.md
  started_at: "2026-11-24T04:23:50.464Z"
  completed_at: "2026-11-24T04:28:42.039Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
    - specdojo:stsd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの R2（構成）として `docs/ja/specdojo/samples/stsd-sample.md` を修正した。適用範囲に混在していた記録の集約と一部数量の遷移規則を、rulebook と template の章ごとの責務に合わせて移動・分割した。
- 状態値・遷移 ID・図表は変更しておらず、判定条件の欠落もない。必須の5章、状態一覧の列、通常系・例外系それぞれの図と直下の遷移表は規範に沿っているため維持した。
- grade の F001（`vp-qe-verifiability`）と F002（`vp-ux-language-consistency`）は R2 の観点に当たらないため未修正とした。解消済みとは扱わない。
- 以下は R2 の指摘表である。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 2. 適用範囲、3. 状態の判定 | 対象の定義に記録の集約と一部数量の遷移規則が混在し、一意判定では初期状態と履歴の判定が一段落にまとまっていた。 | 適用範囲には個品の定義を残し、記録の集約を状態の正本へ、個品ごとの判定と数量分割を一意判定へ移動。一意判定を個品・初期状態、履歴の照合、一部数量の遷移に分割した。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency`。stsd-rulebook 6.2・6.3、stsd-template の2章・3章に定める内容配置。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stsd-sample.md`: 適用範囲から判定・記録規則を状態の判定の章へ移動した。記録の集約は状態の正本の説明へ、個品ごとの判定と数量分割は一意判定へ移した。一意判定は個品・初期状態、履歴の照合、一部数量の遷移の3つに分割した。状態値、遷移 ID、図表の内容は変更していない（6行追加、3行削除）。

## 3. 申し送り

- F001（`vp-qe-verifiability`、検品の合格基準・品質不良の定義が未定義）は R4 へ申し送る。R2 の対象外のため未修正。
- F002（`vp-ux-language-consistency`、店番担当から店主代表への引き継ぎ元が不明確）は R3 へ申し送る。R2 の対象外のため未修正。
- 要判断の指摘、および他の Kata の修正提案はない。condense 起因の記録は plan にない。
- reporter は result の実施内容に次の指摘表を Markdown の表として記載すること。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R2-1 | R2 | 2. 適用範囲、3. 状態の判定 | 対象の定義に記録の集約と一部数量の遷移規則が混在し、一意判定では初期状態と履歴の判定が一段落にまとまっていた。 | 適用範囲には個品の定義を残し、記録の集約を状態の正本へ、個品ごとの判定と数量分割を一意判定へ移動。一意判定を個品・初期状態、履歴の照合、一部数量の遷移に分割した。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency`。stsd-rulebook 6.2・6.3、stsd-template の2章・3章に定める内容配置。 | - |
- reporter 向け変更ファイル・判断根拠: 変更ファイルは docs/ja/specdojo/samples/stsd-sample.md のみ。根拠として docs/ja/specdojo/rulebooks/stsd-rulebook.md（本文要件、6.2・6.3・6.5）、docs/ja/specdojo/templates/stsd-template.md、docs/ja/specdojo/recipes/stsd-recipe.md、docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md（図の分割）、docs/ja/specdojo/standards/sample-authoring-standard.md、docs/ja/specdojo/guides/kata-guide.md（6.1・6.3・6.5）、docs/ja/specdojo/defaults/pm-review-viewpoints.yaml、docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml の stsd-sample の `done_criteria` を確認した。rulebook と template の章ごとの責務に合わせ、既存規則を移動・分割した。必須の5章、状態一覧の列、通常系・例外系それぞれの図と直下の遷移表は規範に沿っているため維持した。差分を確認し、判定条件の欠落や状態値・遷移 ID・図表の変更がないことを確認した。要判断の指摘、他の Kata の修正提案はない。result の進め方と実践の型の適用に反映すること。
- R1 の result（docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-CALIBRATION-stsd-sample-110/T-KATA-REVIEW-CALIBRATION-stsd-sample-110-20261124T041522Z-ec1c9fe0/result.md）と修正後の sample を確認した。R1 が削除した納品不足分の手順は再指摘していない。grade の根拠は docs/ja/projects/prj-0001/execution/grade/results/specdojo.stsd-sample.yaml を読み、anchor と現状を照合した。F001（`vp-qe-verifiability`、検品合格・品質不良の基準不足）は R4 へ、F002（`vp-ux-language-consistency`、店番担当から店主代表への引き継ぎ元が不明確）は R3 へ申し送る。両件は R2 の対象外として未修正であり、解消済みとは扱わない。condense 起因の記録は plan にない。
- executor 指定に従い result と grade サイドカーは編集していない。reporter は指摘表を実施内容へ、変更ファイルと判断根拠を所定セクションへ記載すること。指定された Markdown・frontmatter・図・テスト等の親検証は runner に委ねた。
- 適用外の検証: `npm run validate:schema:file`（変更した成果物は Markdown のみで、YAML ファイルの変更がない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（個票、既存 plan、result などの履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

R1 の result と修正後の sample を読み、R1 が削除した納品不足分の手順は再指摘しなかった。根拠は次のとおり。 - `docs/ja/specdojo/rulebooks/stsd-rulebook.md` の本文要件と 6.2・6.3・6.5 - `docs/ja/specdojo/templates/stsd-template.md` - `docs/ja/specdojo/recipes/stsd-recipe.md` - `docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md`（図の分割） - `docs/ja/specdojo/standards/sample-authoring-standard.md` - `docs/ja/specdojo/guides/kata-guide.md` の 6.1・6.3・6.5 - `docs/ja/specdojo/defaults/pm-review-viewpoints.yaml` - `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml` の stsd-sample の `done_criteria` - grade 結果 `docs/ja/projects/prj-0001/execution/grade/results/specdojo.stsd-sample.yaml` rulebook と template の章ごとの責務を正として、既存規則を移動・分割した。差分を確認し、判定条件の欠落や状態値・遷移 ID・図表の変更がないことを確かめた。executor は Prettier と `git diff --check` に成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` もすべて通過した。grade サイドカーは編集していない。
