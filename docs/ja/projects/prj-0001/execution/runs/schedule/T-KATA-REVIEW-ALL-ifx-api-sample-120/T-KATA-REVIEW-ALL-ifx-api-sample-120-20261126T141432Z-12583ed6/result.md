---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-api-sample-120-20261126t141432z-12583ed6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-api-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-api-sample-120/T-KATA-REVIEW-ALL-ifx-api-sample-120-20261126T141432Z-12583ed6/plan.md
  started_at: "2026-11-26T14:14:43.732Z"
  completed_at: "2026-11-26T14:20:48.148Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-api-sample
    - specdojo:ifx-api-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `ifx-api-sample.yaml` を見直した。仮置き・未決・未確認を `_ASSUMPTION_`・`_UNDECIDED_`・`_TODO_` に分け、`info.description` の前提・未決事項と対応させた（F004）。
- `components` の並びを rulebook の本文要件の表の順（`schemas` → `securitySchemes`）にそろえた。
- F001・F002・F003・F005・F006 は R2 の観点外のため、扱う段へ送った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R2 | `ifx-api-sample.yaml` 先頭コメント（旧 4〜8 行）と `info.description` の「連携の前提」「未決事項」 | 通貨が日本円のみであることと、税・合計を本部が計算することは仮置きなのに、`_UNDECIDED_` の下にあった。`info.description` では確定した前提として書かれ、扱いが食い違っていた。検証器・接続の確認は未確認の作業なのに `_UNDECIDED_` に入っていた（F004）。 | 仮置きを `_ASSUMPTION_`、受付照会を `_UNDECIDED_`、検証器と接続の確認を `_TODO_`（DEV が ready の前に行う）に分けた。連携の前提に「いずれも仮置きで、本部の確認待ち」を書き添え、未決事項を受付照会だけにした。 | `[[specdojo:ifx-api-rulebook]]` の記述ガイド「未決事項と検証」、`vp-qe-omissions-consistency` | - |
| 2 | R2 | `ifx-api-sample.yaml` の `components` | `securitySchemes` が `schemas` より前にあり、rulebook の本文要件の表の順（`components/schemas` → `components/securitySchemes`）と逆になっていた。 | `schemas` を先、`securitySchemes` を末尾へ移した。 | `[[specdojo:ifx-api-rulebook]]` の「本文要件」の表、`vp-arc-document-structure` | 要判断（表の行の順を、記述の順の規定と読むかどうか） |
| 3 | R2 | F001（`_UNDECIDED_` の残課題の担当と期限） | `vp-pm-plan-feasibility` は kata-guide の「kata の観点の組」で、kata の段のレビューでは使わない観点に当たる。R2 では採らない。No 1 の直しで、`_UNDECIDED_` と `_ASSUMPTION_` に確認先と時期を、`_TODO_` に担当の DEV を書いた。 | 追加の対応はしない。 | `docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」 | - |
| 4 | R2 | F002（2 行目の参照元コメントが `info.description` と同じ主張）、F006（「開発担当」に Role code がない） | いずれも R3 の観点（`vp-arc-conciseness`、`vp-ux-language-consistency`）に当たる。 | R3 へ送る。2 行目のコメントを削り、64・70 行の「開発担当」を「DEV（開発担当）」にそろえる案。 | kata-guide の「kata の観点の組」 | - |
| 5 | R2 | F003（`ErrorResponse.details` が構造のない `type: object`） | R4 の観点（`vp-dev-implementation-readiness`）に当たる。 | R4 へ送る。`details` に項目名と理由の構造を定めるか、形式が未決であることを `_UNDECIDED_` で示す案。 | kata-guide の「kata の観点の組」 | - |
| 6 | R2 | F005（`generated/ifx-api-sample.md` が旧版のまま） | YAML の表示のページは yaml-pages の生成物で、sample の本文構成の対象ではない。 | close の前にオーケストレーターが yaml-pages で作り直す。 | `[[specdojo:ifx-api-rulebook]]` の「ファイル命名・ID規則」（表示のページは yaml-pages で作り直す） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-api-sample.yaml`: 先頭コメントの残課題を、仮置きは `_ASSUMPTION_`、受付照会は `_UNDECIDED_`、検証器と接続の確認は `_TODO_`（担当 DEV）に分けた。`info.description` の「連携の前提」に仮置きで本部の確認待ちである旨を足し、未決事項を受付照会だけにした。`components` は `schemas` を先、`securitySchemes` を末尾に並べ替えた。

## 3. 申し送り

- No: 1 / 段: R2 / 箇所: ifx-api-sample.yaml 先頭コメント（旧 4〜8 行）と info.description の「連携の前提」「未決事項」 / 指摘: 通貨が日本円のみであることと、税・合計を本部が計算することは仮置きなのに `_UNDECIDED_` の下にあった。一方で info.description では確定した前提として書かれ、扱いが食い違っていた。検証器・接続の確認は未確認の作業なのに `_UNDECIDED_` に入っていた（F004） / 直した案: 仮置きを `_ASSUMPTION_`、受付照会を `_UNDECIDED_`、検証器と接続の確認を `_TODO_`（DEV が ready の前に行う）に分けた。連携の前提に「いずれも仮置きで、本部の確認待ち」を書き添え、未決事項を受付照会だけにした / 根拠: [[specdojo:ifx-api-rulebook]] の記述ガイド「未決事項と検証」（未決は `_UNDECIDED_`、仮置きは `_ASSUMPTION_`、未確認は `_TODO_`）、`vp-qe-omissions-consistency` / 印: なし
- No: 2 / 段: R2 / 箇所: ifx-api-sample.yaml の components / 指摘: securitySchemes が schemas より前にあり、rulebook の本文要件の表の順（components/schemas → components/securitySchemes）と逆になっていた / 直した案: schemas を先、securitySchemes を末尾へ移した / 根拠: [[specdojo:ifx-api-rulebook]] の「本文要件」の表、`vp-arc-document-structure` / 印: 要判断（表の行の順を、記述の順の規定と読むかどうか）
- No: 3 / 段: R2 / 箇所: F001（`_UNDECIDED_` の残課題の担当と期限） / 指摘: `vp-pm-plan-feasibility` は kata-guide の「kata の観点の組」で、kata の段のレビューでは使わない観点に当たる。R2 では採らない。ただし No 1 の直しで、`_UNDECIDED_` と `_ASSUMPTION_` に「ready の前に本部と決める・本部へ確認する」という確認先と時期を、`_TODO_` に担当の DEV を書いた / 直した案: 追加の対応はしない / 根拠: docs/ja/specdojo/guides/kata-guide.md の「kata の観点の組」 / 印: なし
- No: 4 / 段: R2 / 箇所: F002（2 行目の参照元コメントが info.description と同じ主張）、F006（「開発担当」に Role code がない） / 指摘: いずれも R3 の観点（`vp-arc-conciseness`、`vp-ux-language-consistency`）に当たる / 直した案: R3 へ送る。2 行目のコメントを削り、64・70 行の「開発担当」を「DEV（開発担当）」にそろえる案 / 根拠: kata-guide の「kata の観点の組」 / 印: なし
- No: 5 / 段: R2 / 箇所: F003（ErrorResponse.details が構造のない type: object） / 指摘: R4 の観点（`vp-dev-implementation-readiness`）に当たる / 直した案: R4 へ送る。details に項目名と理由の構造を定めるか、形式が未決であることを `_UNDECIDED_` で示す案 / 根拠: kata-guide の「kata の観点の組」 / 印: なし
- No: 6 / 段: R2 / 箇所: F005（generated/ifx-api-sample.md が旧版のまま） / 指摘: YAML の表示のページは yaml-pages の生成物で、sample の本文構成の対象ではない / 直した案: close の前にオーケストレーターが yaml-pages で作り直す / 根拠: [[specdojo:ifx-api-rulebook]] の「ファイル命名・ID規則」（表示のページは yaml-pages で作り直す） / 印: なし
- 適用外の検証: `npm run validate:schema:file`（sample の先頭に `# specdojo-schema: none reason=external-openapi` があり、SpecDojo の schema の検証対象外のため）

## 4. 進め方と実践の型の適用

根拠は `ifx-api-rulebook` の記述ガイド「未決事項と検証」と「本文要件」の表、`kata-guide` の「kata の観点の組」。F004 は `_ASSUMPTION_`・`_UNDECIDED_`・`_TODO_` の使い分けで解消した。F001 は R2 で使わない観点のため追加対応を見送った。F002・F006 は R3、F003 は R4 へ送った。F005 は生成物のため、close 前に yaml-pages で再生成する。`prettier --check` は通過した。`validate:schema:file` は外部 OpenAPI で対象外のため `not_applicable`。runner の検証は、適用されたものがすべて通過した。
