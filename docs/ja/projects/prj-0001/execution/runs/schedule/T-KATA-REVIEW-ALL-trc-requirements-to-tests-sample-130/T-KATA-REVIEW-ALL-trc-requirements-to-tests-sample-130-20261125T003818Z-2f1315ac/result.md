---
specdojo:
  id: prj-0001:xer-t-kata-review-all-trc-requirements-to-tests-sample-130-20261125t003818z-2f1315ac
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-130/T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-130-20261125T003818Z-2f1315ac/plan.md
  started_at: "2026-11-25T00:38:28.221Z"
  completed_at: "2026-11-25T13:48:51.926Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:trc-requirements-to-tests-sample
    - specdojo:trc-requirements-to-tests-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）を実施し、`docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md` に文の直しを入れた。
- grade の finding F001（ギャップと対応方針の表の対象列で、2 件目以降の項目に要求文書 ID がなく区切りが混在）は、各項目に文書 ID を付け区切りを統一して解消した。
- 直した指摘は 5 件（R3-1 から R3-5）で、要判断の申し送りは 2 件（R3-6、R3-7）である。
- runner の検証では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。変更種別により非適用の検査は `not_applicable` である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | トレース対象の前提 / テストの抽出条件 | 1 文に受入テストと総合テストの 2 条件を詰め込み、読点が多い。 | 受入テスト・総合テストの 2 段の箇条書きに分けた。 | W3, W9 | - |
| R3-2 | R3 | トレースマトリクス | 「ケース表の `トレース` 列から参照されており」が受け身で主体が消えている。 | 「ケース表の `トレース` 列が抽出したテストの `trace_key` をすべて参照しており」にした。 | W6 | - |
| R3-3 | R3 | 充足状況サマリ | 「テストはそろっているが対応テストが」が重複している。「`ready` にするまで」では誰が `ready` にするかが読めない。 | 「対応テストはそろっているが `draft` であり、`ready` になるまで」にした。 | W1, vp-arc-conciseness | - |
| R3-4 | R3 | 充足状況サマリ、ギャップと対応方針 | grade F001: 対象列の 2 件目以降の項目に要求文書 ID がなく、区切りの `,` と `・` が混在している。優先順の箇条書きの `BAC-03` も同様である。 | 表の対象列で各項目に文書 ID を付け、区切りをマトリクスの対応テストID列と同じコンマと空白にそろえた。優先順の箇条書きは `bac-sample BAC-03` にした。 | vp-ux-language-consistency, W8 | - |
| R3-5 | R3 | ギャップと対応方針 | 「担当と期限は各行を…登録簿で追跡し」の主語と述語がねじれており、PJR の初出に正式名がない。 | 「各行はプロジェクト登録簿（PJR）の登録候補として追跡し、担当と期限は本書に持たない」にした。 | W2, W8 | - |
| R3-6 | R3 | 充足状況サマリ | 「店主不在の店番で起きても気づけない」は、気づけない主体（店番か店主か）が読めない。 | - | W1。主語を推測で補わず、共通サンプル文脈の登場人物で確かめてから直す（選ばなかった案: 「店主が気づけない」と補う） | 要判断 |
| R3-7 | R3 | ギャップと対応方針 | `atc-sale-hold`・`stc-sale-hold` の直し方で「`relations.verifies` に `bac-sample`」が両方にかかって読めるが、総合テストは `relations.verifies` を定めない。 | - | W5。R3 の範囲を超える正しさの問題になりうるため、R4 で正本と照らし「`atc-sale-hold` の `relations.verifies` に」と限定する案を検討する | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`: 文の直し（13 行追加・11 行削除）。テスト抽出条件を受入テストと総合テストの 2 段の箇条書きに分けた。トレースマトリクスの受け身表現を能動に直した。充足状況サマリの重複表現と `ready` にする主体の曖昧さを整理した。対象列の各項目に要求文書 ID を付け、区切りをマトリクスの対応テストID列と同じコンマと空白にそろえた（F001）。優先順の `BAC-03` は `bac-sample BAC-03` にした。PJR の主語と述語のねじれを直し、正式名を補った。

## 3. 申し送り

- R3-6 は、気づけない主体（店番か店主か）を推測で補っていないため未修正である。共通サンプル文脈の登場人物で確かめてから直す必要がある。
- R3-7 は、`atc-sale-hold`・`stc-sale-hold` の直し方で `relations.verifies` が両方にかかって読める件である。R3 の範囲を超える正しさの問題になりうるため、R4 で正本と照らし、`atc-sale-hold` の `relations.verifies` に限定する案を検討する。
- R3-1: R3 / トレース対象の前提 / テストの抽出条件が 1 文に受入テストと総合テストの 2 条件を詰め込み、読点が多い / 受入テスト・総合テストの 2 段の箇条書きに分けた / W3, W9 / -
- R3-2: R3 / トレースマトリクス / 「ケース表の `トレース` 列から参照されており」が受け身で主体が消えている / 「ケース表の `トレース` 列が抽出したテストの `trace_key` をすべて参照しており」にした / W6 / -
- R3-3: R3 / 充足状況サマリ / 「テストはそろっているが対応テストが」の重複と、「`ready` にするまで」で誰が ready にするかが読めない / 「対応テストはそろっているが `draft` であり、`ready` になるまで」にした / W1, vp-arc-conciseness / -
- R3-4: R3 / 充足状況サマリ、ギャップと対応方針 / grade F001: 対象列の 2 件目以降の項目に要求文書 ID がなく、区切りの `,` と `・` が混在している（優先順の箇条書きの `BAC-03` も同じ） / 表の対象列で各項目に文書 ID を付け、区切りをマトリクスの対応テストID列と同じ コンマと空白（「,」の後に空白） にそろえた。優先順の箇条書きは `bac-sample BAC-03` にした / vp-ux-language-consistency, W8 / -
- R3-5: R3 / ギャップと対応方針 / 「担当と期限は各行を…登録簿で追跡し」の主語と述語がねじれており、PJR の初出に正式名がない / 「各行はプロジェクト登録簿（PJR）の登録候補として追跡し、担当と期限は本書に持たない」にした / W2, W8 / -
- R3-6: R3 / 充足状況サマリ / 「店主不在の店番で起きても気づけない」は、気づけない主体（店番か店主か）が読めない / - / W1。主語を推測で補わず、共通サンプル文脈の登場人物で確かめてから直す（選ばなかった案: 「店主が気づけない」と補う） / 要判断
- R3-7: R3 / ギャップと対応方針 / `atc-sale-hold`・`stc-sale-hold` の直し方で「`relations.verifies` に `bac-sample`」が両方にかかって読めるが、総合テストは `relations.verifies` を定めない / - / W5。R3 の範囲を超える正しさの問題になりうるため、R4 で正本と照らし「`atc-sale-hold` の `relations.verifies` に」と限定する案を検討する / 要判断

## 4. 進め方と実践の型の適用

根拠としたのは、kata-guide の「kata を agent でレビューする」と文章のチェック項目（W1〜W10）、plan に展開された grade finding F001（`vp-ux-language-consistency`）、rulebook の要求項目表記 `＜要求文書ID＞ ＜項目ID＞` である。意味と判断に要る背景・例外・制約は変えず、文の直しだけを入れた。F001 は対象列の文書 ID 付与と区切りの統一で解消したと判断した。主語を推測で補う必要のある箇所（R3-6）と、R3 の範囲を超える正しさの問題（R3-7）は、推測で改訂せず申し送りに残した。`status` は `draft` のまま据え置いた。
