---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-communication-plan-sample-130-20261125t064334z-f6d30db2
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-communication-plan-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-communication-plan-sample-130/T-KATA-REVIEW-ALL-pm-communication-plan-sample-130-20261125T064334Z-f6d30db2/plan.md
  started_at: "2026-11-25T06:43:44.065Z"
  completed_at: "2026-11-25T06:57:45.950Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-communication-plan-sample
    - specdojo:pm-communication-plan-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/pm-communication-plan-sample.md` の文を5か所直した。F001 の RACI の参照先を示した修正と、W1・W2・W3・W4 に当たる修正を含む。
- 指摘は次の表のとおり。印が「要判断」の2件（No.4・No.5）は、補った主語を人が確認する必要がある。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R3 | 見直し条件と未決事項 | 「本書のエスカレーションと RACI（`PM`）」の RACI がどの文書か読み取れず、本書にも RACI がない | 「本書のエスカレーション（`PM`）、`[[specdojo:pm-raci-sample\|RACI]]` の判断行（`PM`）、管理計画の最終判断（`PM`）」とし、RACI の参照先を示した | F001、`vp-ux-language-consistency`、W4 | - | | 2 | R3 | 方針と適用範囲 | 読点の多い1文に、対面を使う場面の限定と結果の転記が詰まっている | 「店頭説明に限る。対面の結果は当日中に…転記する。」と2文に分けた | W3、`vp-ux-readability` | - | | 3 | R3 | コミュニケーション機会 | 停止連絡の行の「未決事項を参照」で、参照先の章が分からない | 「営業時間外は「見直し条件と未決事項」の未決事項を参照」とした | W4 | - | | 4 | R3 | エスカレーション | 表の前の文に、誰が誰へ判断を求めるかが書かれていない | 「次の条件に当たる場合、一次対応者は次の支出・利用・公開より前に `PO` へ判断を求める。」とした | W1。表の最終判断の列がすべて `PO` であることを根拠に補った。元の文のまま残す案は、判断を求める人が読み取れないため選ばなかった | 要判断 | | 5 | R3 | 見直し条件と未決事項 | 1つ目の `_UNDECIDED_` で、主語「停止連絡は」と述語「定まらず」「代える」がずれている | 「決まるまでは営業時間外に停止連絡を伝える先と手段がないため、`PM` が翌営業日の開店前に店頭で連絡する。」とした | W2、W1。停止連絡の行の責任の列が `PM` であることを根拠に、連絡する人を `PM` とした。主語を書かない案は W1 を満たさないため選ばなかった | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-communication-plan-sample.md`: R3（読みやすさ）の文の直しを5か所入れた（19行追加・19行削除）。F001 の RACI の参照先を `[[specdojo:pm-raci-sample\|RACI]]` で示した。方針の長い1文を2文に分けた。停止連絡の行に参照先の章名を補った。エスカレーションの表の前の文に主語と判断を求める先を補った。`_UNDECIDED_` の主語と述語のずれを直した。Prettier で整形した。

## 3. 申し送り

- No.4 と No.5 は「要判断」である。No.4 は判断を求める先を `PO`、No.5 は営業時間外の停止連絡をする人を `PM` と補った。補った内容が運用の意図に合うか確認してほしい。
- `_UNDECIDED_` の内容は、直した後も未決のまま残る。営業時間外の緊急連絡手段は判断ゲート「初期リリース・店頭試用開始」の前に `PO` が決定する。つけの記録方法の切替開始日は管理計画の U-03 の確定と同時に `PO` が決定する。
- 1: R3 / 見直し条件と未決事項 / 「本書のエスカレーションと RACI（`PM`）」の RACI がどの文書か読み取れず、本書にも RACI がない / 「本書のエスカレーション（`PM`）、[[specdojo:pm-raci-sample\|RACI]] の判断行（`PM`）、管理計画の最終判断（`PM`）」とし、RACI の参照先を示した / F001、`vp-ux-language-consistency`、W4 / -
- 2: R3 / 方針と適用範囲 / 読点の多い1文に、対面を使う場面の限定と結果の転記が詰まっている / 「…店頭説明に限る。対面の結果は当日中に…転記する。」と2文に分けた / W3、`vp-ux-readability` / -
- 3: R3 / コミュニケーション機会 / 停止連絡の行の「未決事項を参照」で、参照先の章が分からない / 「営業時間外は「見直し条件と未決事項」の未決事項を参照」とした / W4 / -
- 4: R3 / エスカレーション / 表の前の文に、誰が誰へ判断を求めるかが書かれていない / 「次の条件に当たる場合、一次対応者は次の支出・利用・公開より前に `PO` へ判断を求める。」とした / W1。表の最終判断の列がすべて `PO` であることを根拠に補った。元の「いずれの条件も…判断を求める」のまま残す案は、判断を求める人が読み取れないため選ばなかった / 要判断
- 5: R3 / 見直し条件と未決事項 / 1つ目の `_UNDECIDED_` で、主語「停止連絡は」と述語「定まらず」「代える」がずれている / 「決まるまでは営業時間外に停止連絡を伝える先と手段がないため、`PM` が翌営業日の開店前に店頭で連絡する。」とした / W2、W1。停止連絡の行の責任の列が `PM` であることを根拠に、連絡する人を `PM` とした。主語を書かない案は W1 を満たさないため選ばなかった / 要判断

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿い、grade の finding F001（minor、`vp-ux-language-consistency`）と、kata-guide の文章のチェック項目 W1〜W4 を根拠に文を直した。F001 は RACI の参照先を `[[specdojo:pm-raci-sample\|RACI]]` で示して解消した。意味や判断に要る背景・例外・制約は変えていない。frontmatter の `status` は変更していない。検証は、runner の `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run lint:mermaid`、`npm run lint:d2`、`npm run test:docs`、`npm run validate:schema` が passed だった。`npm run lint:ts`、`npm run lint:md`、`npm run lint:fm`、`npm run test:integration`、`npm run typecheck`、`npm run test:unit` は、変更種別に当たらないため `not_applicable` である。未解消の finding はない。
