---
specdojo:
  id: prj-0001:xer-t-kata-review-all-trc-requirements-to-specs-sample-150-20261126t102912z-39657e92
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-150/T-KATA-REVIEW-ALL-trc-requirements-to-specs-sample-150-20261126T102912Z-39657e92/plan.md
  started_at: "2026-11-26T10:29:23.393Z"
  completed_at: "2026-11-26T10:37:39.001Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:trc-requirements-to-specs-sample
    - specdojo:trc-requirements-to-specs-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として `trc-requirements-to-specs-sample` を、共通サンプル文脈と同じ系列の sample に合わせて直した。
- 次期リリースの範囲、リリースの呼び方、`req-r1-004` の要約の 3 点を揃えた。
- grade の F001（使う人の欄が通称）は前の段で解消済みのため、今回は変更していない。
- `based_on` と本文の仕様 ID が実在の sample に解決しない点と、rulebook 側の例の直し方は、人の判断に残した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 1. 目的と適用範囲（対象外） | 次期リリースの要求を「つけ管理と仕入れ」としていたが、共通サンプル文脈の前提条件は初期リリースにつけ管理を含める。 | 次期リリースを「仕入れ改善と分析」に改め、つけ管理の要求は分冊 `trc-requirements-to-specs-credit` で扱う対象外の項目を足した。 | `vp-qe-kata-conformance`（共通サンプル文脈の前提条件・目的と必要性） | - |
| R5-2 | R5 | 表題・1. 目的と適用範囲・4. 充足状況サマリ・5. ギャップと対応方針・6. 変更履歴と更新ルール | リリースの呼び方「第 1 リリース」「2026 年度第 1 リリース」が、同じ系列の `trc-requirements-to-tests-sample` と共通サンプル文脈の「初期リリース」と食い違う。 | すべて「初期リリース」に揃えた。 | `vp-qe-kata-conformance`（kata 相互） | 要判断: rulebook の良い例は「第 1 リリース」と書いている。sample を rulebook の例に合わせる案は、同じ系列の sample と共通サンプル文脈から外れるため採らなかった。相手側を直す案は R5-5 に書いた。 |
| R5-3 | R5 | 3. トレースマトリクス・4. 充足状況サマリ | `req-r1-004`「監査ログを 1 年保持する」の依存先は `nfr-integrity` だが、`nfr-integrity-sample` は記録の変更履歴を「監査証跡、7 年保持」と定め、1 年保管の監査ログ（`nfr-security-safety`、ログインと権限の操作）とは別の記録としている。 | 要求要約を「監査証跡を 7 年保持する」にし、要求に対応しない仕様の表と優先理由の「監査ログ」も「監査証跡」にした。 | `vp-qe-kata-conformance`（参照先 `nfr-integrity-sample`）、`vp-dev-change-impact` | - |
| R5-4 | R5 | frontmatter `based_on`・2. トレース対象の前提・3. トレースマトリクス | `based_on` と本文の仕様 ID（`req-2026-r1`、`sf-pos-checkout`、`sf-discount-apply`、`bes-pos-operation`、`bes-stock-allocation`、`bes-audit-log`、`bes-product-master`、`ifx-msg-stock`）が、既にある sample のどれにも解決しない。同じ系列の `trc-requirements-to-tests-sample` は `based_on` に実在の `specdojo:*-sample` を挙げている。 | 案: `based_on` を実在の sample の ID（`specdojo:sf-index-sample`・`specdojo:sf-sample`・`specdojo:bes-index-sample`・`specdojo:bes-sample`・`specdojo:ifx-msg-sample`・`specdojo:nfr-integrity-sample`）へ寄せ、マトリクスの仕様 ID をそれらに置き換える。キャンペーン値引きの行（`sf-discount-apply`）は既存の sample に対応する機能がないので、置き換える場合は行を見直す。 | `vp-qe-kata-conformance`（kata 相互、`based_on` の参照先） | 要判断: 置き換えると表と件数の作り直しになり、R5 の最小の差分を超える。架空の ID のまま母集団の例として残す案もあり得るため、直さずに人の判断に残した。 |
| R5-5 | R5 | 相手側 `specdojo:trc-requirements-to-specs-rulebook` 本文の記述の指針（良い例） | rulebook の良い例「第 1 リリースの会計・在庫・値引き・監査の要求…」が、共通サンプル文脈と同じ系列の sample の「初期リリース」と呼び方が違う。 | 案: rulebook の良い例を「初期リリースの会計・在庫・値引き・監査の要求…」に直す。今回は相手側を変更していない。 | `vp-qe-kata-conformance` | - |
| R5-6 | R5 | 1. 目的と適用範囲（使う場面の表） | grade の F001（使う人の欄が通称）は、前の段で列が「使う役割（Role code）」になり `DEV`・`QE`・`PO` で書かれていて、解消済み。 | 変更なし | `vp-ux-language-consistency`、共通サンプル文脈の共通登場人物（Role code の使い分け） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/trc-requirements-to-specs-sample.md`: 次期リリースの範囲を「仕入れ改善と分析」に改め、つけ管理を分冊 `trc-requirements-to-specs-credit` で扱う対象外の項目を足した。リリースの呼び方を「初期リリース」に統一した。`req-r1-004` の要約を「監査証跡を 7 年保持する」にし、関連する表と優先理由の「監査ログ」も「監査証跡」にした。

## 3. 申し送り

- R5-1: R5 / 1. 目的と適用範囲（対象外） / 次期リリースの要求を「つけ管理と仕入れ」としていたが、共通サンプル文脈の前提条件は初期リリースにつけ管理を含める / 次期リリースを「仕入れ改善と分析」に改め、つけ管理の要求は分冊 `trc-requirements-to-specs-credit` で扱う対象外の項目を足した / `vp-qe-kata-conformance`（共通サンプル文脈の前提条件・目的と必要性） / -
- R5-2: R5 / 表題・1. 目的と適用範囲・4. 充足状況サマリ・5. ギャップと対応方針・6. 変更履歴と更新ルール / リリースの呼び方「第 1 リリース」「2026 年度第 1 リリース」が、同じ系列の `trc-requirements-to-tests-sample` と共通サンプル文脈の「初期リリース」と食い違う / すべて「初期リリース」に揃えた / `vp-qe-kata-conformance`（kata 相互） / 要判断: rulebook の良い例は「第 1 リリース」と書いている。sample を rulebook の例に合わせる案は、同じ系列の sample と共通サンプル文脈から外れるため採らなかった。相手側の直す案は R5-5 に書いた
- R5-3: R5 / 3. トレースマトリクス・4. 充足状況サマリ / `req-r1-004`「監査ログを 1 年保持する」の依存先は `nfr-integrity` だが、`nfr-integrity-sample` は記録の変更履歴を「監査証跡、7 年保持」と定め、1 年保管の監査ログ（`nfr-security-safety`、ログインと権限の操作）とは別の記録としている / 要求要約を「監査証跡を 7 年保持する」にし、要求に対応しない仕様の表と優先理由の「監査ログ」も「監査証跡」にした / `vp-qe-kata-conformance`（参照先 `nfr-integrity-sample`）、`vp-dev-change-impact` / -
- R5-4: R5 / frontmatter `based_on`・2. トレース対象の前提・3. トレースマトリクス / `based_on` と本文の仕様 ID（`req-2026-r1`、`sf-pos-checkout`、`sf-discount-apply`、`bes-pos-operation`、`bes-stock-allocation`、`bes-audit-log`、`bes-product-master`、`ifx-msg-stock`）が、既にある sample のどれにも解決しない。同じ系列の `trc-requirements-to-tests-sample` は `based_on` に実在の `specdojo:*-sample` を挙げている。既存の sample の機能・イベントは `SF-POS-01`（`specdojo:sf-sample`）、`bes-cash-sale-confirmed`（`specdojo:bes-sample`）、`specdojo:ifx-msg-sample`、`specdojo:nfr-integrity-sample` にある / - / `vp-qe-kata-conformance`（kata 相互、`based_on` の参照先）。案: `based_on` を実在の sample の ID（`specdojo:sf-index-sample`・`specdojo:sf-sample`・`specdojo:bes-index-sample`・`specdojo:bes-sample`・`specdojo:ifx-msg-sample`・`specdojo:nfr-integrity-sample`）へ寄せ、マトリクスの仕様 ID をそれらに置き換える。キャンペーン値引きの行（`sf-discount-apply`）は既存の sample に対応する機能がないので、置き換える場合は行を見直す / 要判断: 置き換えると表と件数の作り直しになり、R5 の最小の差分を超える。架空の ID のまま母集団の例として残す案もあり得るため、直さずに人の判断に残した
- R5-5: R5 / 相手側 `specdojo:trc-requirements-to-specs-rulebook` 本文の記述の指針（良い例） / rulebook の良い例「第 1 リリースの会計・在庫・値引き・監査の要求…」が、共通サンプル文脈と同じ系列の sample の「初期リリース」と呼び方が違う / - / `vp-qe-kata-conformance`。案: rulebook の良い例を「初期リリースの会計・在庫・値引き・監査の要求…」に直す / -
- R5-6: R5 / 1. 目的と適用範囲（使う場面の表） / grade の F001（使う人の欄が通称）は、前の段で列が「使う役割（Role code）」になり `DEV`・`QE`・`PO` で書かれていて、解消済み / 変更なし / `vp-ux-language-consistency`、共通サンプル文脈の共通登場人物（Role code の使い分け） / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown だけで、`*.yaml` / `*.yml` を変更していないため）

## 4. 進め方と実践の型の適用

根拠は、共通サンプル文脈、同じ系列の `trc-requirements-to-tests-sample`、`nfr-integrity-sample`、rulebook の良い例、grade の F001（`vp-ux-language-consistency`）である。 維持した記述: 使う場面の表の Role code 表記は前の段で解消済みのため維持した。 改訂した記述: 次期リリースの範囲、リリースの呼び方、`req-r1-004` の要約。 矛盾時の扱い: rulebook の良い例は「第 1 リリース」と書いている。ただし、同じ系列の sample と共通サンプル文脈を優先し、rulebook 側を直す案として findings の R5-5 に残した。 未解消: `based_on` と仕様 ID の置き換えは、表と件数の作り直しになり最小差分を超える。人の判断が要るため変更していない（R5-4）。
