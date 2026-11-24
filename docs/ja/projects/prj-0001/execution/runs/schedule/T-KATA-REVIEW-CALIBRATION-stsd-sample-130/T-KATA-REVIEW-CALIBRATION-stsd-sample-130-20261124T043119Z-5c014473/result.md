---
specdojo:
  id: prj-0001:xer-t-kata-review-calibration-stsd-sample-130-20261124t043119z-5c014473
  type: exec-result
  task_id: T-KATA-REVIEW-CALIBRATION-stsd-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-CALIBRATION-stsd-sample-130/T-KATA-REVIEW-CALIBRATION-stsd-sample-130-20261124T043119Z-5c014473/plan.md
  started_at: "2026-11-24T04:31:27.884Z"
  completed_at: "2026-11-24T04:36:00.306Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stsd-sample
    - specdojo:stsd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として `docs/ja/specdojo/samples/stsd-sample.md` の文面を直した。引き継ぎ元の明示、判定文の分割、表の導入文の追加を行った。
- grade の F002（`vp-ux-language-consistency`）は解消した。F001（`vp-qe-verifiability`、検品合格・品質不良の基準不足）は R4 の観点なので未修正とし、R4 へ申し送る。
- 指摘表（報告の形）は次のとおり。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 5. 状態遷移 | 店番担当は店主代表を含むため、自分へ引き継ぐように読める（grade F002）。`T-04` にも同じ表現がある。 | `T-04`・`T-06` とも、未完了時の扱いを保持し、家族利用者代表が店番をしている場合に店主代表へ引き継ぐと明示した。 | W1、W3、`vp-ux-language-consistency` | - | | R3-2 | R3 | 3. 状態の判定 | 記録照合・遷移追跡・現在状態の決定が一文に連なっている。 | 三つの文へ分け、一部条件だけでは遷移しない規則を保持した。 | W3、W6、`vp-ux-readability` | - | | R3-3 | R3 | 4. 状態一覧、5. 状態遷移 | 各表で示す対応や対象経路の説明が不足している。 | 状態一覧の対応を示す一文を追加し、各図の前に直下の表が示す遷移条件と補足を明記した。 | `vp-ux-readability`、Sample 記述標準の「表の前の1文」、`stsd-mermaid-rulebook` の図表間に文を挟まない配置 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stsd-sample.md`: R3（読みやすさ）の文面修正。`T-04`・`T-06` の補足で、家族利用者代表が店番をしている場合に店主代表へ引き継ぐと明示した（F002 対応）。「状態の判定」の長い一文を三文に分けた。状態一覧と各遷移表・図の前に、対応や対象経路を示す導入文を追加した。状態・遷移 ID・経路・イベント・条件・数量分割・欠損記録の扱いは変えていない。

## 3. 申し送り

- F001（`vp-qe-verifiability`、検品の合格基準・品質不良の具体的判定基準の不足、`T-03`・`T-06` の分岐に関係）は R4 の観点なので、この段では修正していない。R4 で扱うこと。
- executor の指示に従い、result と grade サイドカーは編集していない。要判断の指摘、他の Kata の修正提案、規範間の矛盾はない。
- reporter は result の実施内容へ次の指摘表を記載すること。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R3-1 | R3 | 5. 状態遷移 | 店番担当は店主代表を含むため、自分へ引き継ぐように読める（grade F002）。T-04 にも同じ表現がある。 | T-04・T-06 とも、未完了時の扱いを保持し、家族利用者代表が店番をしている場合に店主代表へ引き継ぐと明示した。 | W1、W3、`vp-ux-language-consistency` | - | | R3-2 | R3 | 3. 状態の判定 | 記録照合・遷移追跡・現在状態の決定が一文に連なっている。 | 三つの文へ分け、一部条件だけでは遷移しない規則を保持した。 | W3、W6、`vp-ux-readability` | - | | R3-3 | R3 | 4. 状態一覧、5. 状態遷移 | 各表で示す対応や対象経路の説明が不足している。 | 状態一覧の対応を示す一文を追加し、各図の前に直下の表が示す遷移条件と補足を明記した。 | `vp-ux-readability`。Sample 記述標準6章の「表の前の1文」。図表間に文を挟まない配置は stsd-mermaid-rulebook 6.3に従う。 | - |
- 変更ファイルは docs/ja/specdojo/samples/stsd-sample.md のみ。result の変更ファイル・進め方と実践の型の適用へ反映すること。判断根拠として docs/ja/specdojo/guides/kata-guide.md 6.1〜6.5、docs/ja/specdojo/philosophy/specdojo-philosophy.md 3.6、docs/ja/specdojo/standards/sample-authoring-standard.md、docs/ja/specdojo/standards/rulebook-authoring-standard.md の用語統一規定、docs/ja/specdojo/rulebooks/stsd-rulebook.md、docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md、docs/ja/specdojo/recipes/stsd-recipe.md、docs/ja/specdojo/defaults/pm-review-viewpoints.yaml を確認した。W1〜W10 を確認し、役割名は共通サンプル文脈と照合した。指定の product 用語集には今回の業務語の該当定義がなかった。
- 前段 R2 の result（docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-REVIEW-CALIBRATION-stsd-sample-120/T-KATA-REVIEW-CALIBRATION-stsd-sample-120-20261124T042342Z-ce5d8eb4/result.md）と修正後の sample を確認した。前段の章配置と、対象外の納品不足手順を除いた状態を維持した。状態一覧、Mermaid、遷移 ID・経路・イベント・条件、初期判定、数量分割、欠損記録の扱いを保持した。必須の図表対応は rulebook に従って維持し、長さだけを根拠とした削除はしていない。要判断の指摘、他の Kata の修正提案、規範間の矛盾はない。
- grade の根拠 docs/ja/projects/prj-0001/execution/grade/results/specdojo.stsd-sample.yaml を読み、anchor と現状を照合した。F002 は解消。F001（`vp-qe-verifiability`、検品合格・品質不良の基準不足）は R4 の観点なので未修正として R4 へ申し送る。condense 起因の記録は plan にない。executor 指定に従い result と grade サイドカーは編集していない。
- 適用外の検証: `npm run validate:schema:file`（変更は Markdown のみで、YAML ファイルを変更していない。）
- 適用外の検証: `npm run validate:catalog`（executor の変更は docs/ja/specdojo/samples/ 配下のみで、docs/ja/projects/ 配下を変更していない。）
- 適用外の検証: `npm run validate:history-links`（個票、既存 plan、result などの履歴蓄積ファイルを変更していない。）

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、前段 R2 の版を読んで章配置と対象外の納品不足手順を維持した。`docs/ja/specdojo/guides/kata-guide.md` の W1〜W10 と、`sample-authoring-standard`、`rulebook-authoring-standard` の用語統一規定、`stsd-rulebook`、`stsd-mermaid-rulebook`、`stsd-recipe`、`pm-review-viewpoints.yaml` を根拠にした。役割名は共通サンプル文脈と照合した。product 用語集に今回の業務語の定義はなかった。F002 は修正して解消し、F001 は R4 の観点として未修正のまま申し送った。rulebook の必須の図表対応は維持し、長さだけを根拠とした削除はしていない。整形（`prettier`）と `git diff --check` は成功した。runner 側の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。
