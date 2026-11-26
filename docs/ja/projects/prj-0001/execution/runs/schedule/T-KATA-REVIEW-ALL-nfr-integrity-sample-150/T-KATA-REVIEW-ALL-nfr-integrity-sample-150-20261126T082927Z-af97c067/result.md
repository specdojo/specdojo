---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-integrity-sample-150-20261126t082927z-af97c067
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-integrity-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-integrity-sample-150/T-KATA-REVIEW-ALL-nfr-integrity-sample-150-20261126T082927Z-af97c067/plan.md
  started_at: "2026-11-26T08:29:38.501Z"
  completed_at: "2026-11-26T08:40:07.249Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-integrity-sample
    - specdojo:nfr-integrity-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`nfr-integrity-sample.md` を同じ系列の sample と突き合わせ、食い違い 4 件（試験 ID、監査証跡と監査ログの区別、オフラインの `_UNDECIDED_` の参照先、店番担当の表記）を sample 側で直した。
- 相手側を直すべき点（`nfr-index-sample`、`stc-index-sample`、`nfr-integrity-rulebook` など）は変更せず、直す案を handoff に残した。
- grade の F001 は前の段で解消済みのため繰り返していない。F002 は rulebook 側の更新案として R5-8 に記録した。F003 は kata のレビューで使わない観点のため扱っていない。
- 検査は、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed だった。executor の `prettier` も passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 4. 測定・検証方法、5. 関連ドキュメント導線 | 試験 ID の `sac-integrity` と `stc-integrity` はどの sample にもなく、`nfr-index-sample` の完全性の検証（`sac-store-sales`、`stc-cash-sale`、`stc-record-recovery`）や `stc-index-sample` の term 一覧と食い違っていた。 | `nfr-int-002` と `nfr-int-004` を `sac-store-sales`、`nfr-int-003` を `stc-cash-sale`、`nfr-int-006` を `stc-record-recovery` にし、導線の表もそろえた。相手側の案は、`stc-index-sample` の「観点の立て方（共通）」のデータ整合性の行に「改ざん検知」の観点と `stc-record-recovery` を足すこと。 | vp-qe-kata-conformance。`stc-index-sample` に改ざん検知の観点がなく、`nfr-int-006` を `stc-record-recovery` に置くのは記録の照合という近さで選んだ。選ばなかった案は、`stc-integrity` を残して `stc-index-sample` に新しい term を足すこと。 | 要判断 |
| R5-2 | R5 | 2. 適用範囲・前提条件 | 監査証跡の 7 年保持が、`nfr-security-safety-sample`（`nfr-sec-010`）、`opd-index-sample`、`opr-index-sample` の監査ログの 1 年保管と同じ記録のように読め、つけ残高の訂正では保管期間が食い違って見えた。 | 監査証跡（記録の変更履歴、7 年保持）と `nfr-security-safety` の監査ログ（1 年保管）は別の記録とする 1 文を足した。相手側の案は、`opd-index-sample` の監査ログの行か `opr-index-sample` の証跡の表に、監査証跡（重要記録の変更履歴）の 7 年保管を足すこと。 | vp-qe-kata-conformance、vp-dev-change-impact | - |
| R5-3 | R5 | 2. 適用範囲・前提条件 | オフライン時の `_UNDECIDED_` が、`nfr-availability-sample` と `nfr-reliability-sample` の前提条件 ACD-D03、`dec-offline-recording`、`nfr-avl-004`（紙の控えの転記漏れ 0 件）を参照しておらず、転記漏れを誰が扱うかが重なって読めた。 | ACD-D03 と `dec-offline-recording` を足し、紙の控えの転記漏れは `nfr-avl-004` が扱い、本書は整合性境界に含める時点だけを決めると書いた。 | vp-qe-kata-conformance | - |
| R5-4 | R5 | 1. 概要、4. 測定・検証方法 | 「店番」の表記が、同じ系列の sample（可用性・信頼性・運用）の「店番担当」と食い違っていた。 | 3 か所を「店番担当」にした。 | vp-qe-kata-conformance。用語集には該当の語がないため、同じ系列の sample にそろえた。 | - |
| R5-5 | R5 | 3. 完全性要件一覧 | `nfr-index-sample` の完全性の代表指標「日次締めの現金と販売記録の差額」が、本書の要件（`nfr-int-001` から `nfr-int-006`）にない。 | 本書は変更していない。相手側の案は、`nfr-index-sample` の「カテゴリ一覧（8カテゴリ）」の完全性の代表指標を「整合性違反件数（営業日ごと）、同一取引番号の重複記録件数」にすること。 | vp-qe-kata-conformance | - |
| R5-6 | R5 | 5. 関連ドキュメント導線 | `nfr-index-sample` の完全性の運用は `opr-index` だけだが、本書は `opd-integrity-check` と `opr-integrity-check` を必須の導線にしている。`opd-integrity-check` は `imp-operations-sample` と `imp-data-sample` も参照している。 | 本書は変更していない。相手側の案は、`nfr-index-sample` の「関連ドキュメント導線」の完全性の運用列を `opd-integrity-check` と `opr-integrity-check` にすること。 | vp-qe-kata-conformance。どちらの ID もまだファイルがなく、sample の側だけでは正を決められない。選ばなかった案は、本書を `opr-index` にそろえること（imp の sample との食い違いが新たに生じる）。 | 要判断 |
| R5-7 | R5 | 3. 完全性要件一覧 | `nfr-int-003`（同一取引番号の重複記録件数）と `nfr-reliability-sample` の `nfr-rel-002`（同じ確定操作からの重複記録件数）が同じ二重記録を扱う。前者は取引番号での検知、後者は確定時の防止という分担として読めるため、本書は直していない。 | 本書は変更していない。相手側の案は、`nfr-reliability-sample` の `nfr-rel-002` の備考に「取引番号での事後の検知は `nfr-int-003`」と分担を書くこと。 | vp-dev-change-impact | - |
| R5-8 | R5 | rulebook の全体方針（grade の F002） | `nfr-integrity-rulebook` の `_UNDECIDED_`「sample は 5 章に揃っていない」が、5 章にそろった今の sample と食い違っている。 | sample 側は変更していない。相手側の案は、rulebook の該当の `_UNDECIDED_` から sample の章の記述を外し、`recipe` と `template` の要否の判断だけを残すこと。 | vp-qe-kata-conformance | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-integrity-sample.md`: 試験 ID を `sac-store-sales`、`stc-cash-sale`、`stc-record-recovery` にそろえ、関連ドキュメント導線の表も合わせた。監査証跡（7 年保持）と `nfr-security-safety` の監査ログ（1 年保管）は別の記録とする 1 文を足した。オフライン時の `_UNDECIDED_` に ACD-D03 と `dec-offline-recording` を足し、紙の控えの転記漏れは `nfr-avl-004` が扱うと明記した。「店番」を「店番担当」に 3 か所直した。

## 3. 申し送り

- R5-1 と R5-6 は「要判断」の指摘である。R5-1 は `stc-index-sample` に改ざん検知の観点がない点、R5-6 は `opd-integrity-check` と `opr-index` のどちらを正にするかが sample 側だけでは決められない点が理由である。
- R5-1: R5 / 4. 測定・検証方法、5. 関連ドキュメント導線 / 試験 ID の `sac-integrity`・`stc-integrity` はどの sample にもなく、`nfr-index-sample` の完全性の検証（`sac-store-sales`、`stc-cash-sale`、`stc-record-recovery`）や `stc-index-sample` の term 一覧と食い違っていた / `nfr-int-002`・`nfr-int-004` を `sac-store-sales`、`nfr-int-003` を `stc-cash-sale`（データ整合性の観点「二重確定防止」）、`nfr-int-006` を `stc-record-recovery` にし、導線の表もそろえた / vp-qe-kata-conformance。迷った理由: `stc-index-sample` には改ざん検知（監査証跡を経ない書き換え）の観点がなく、`nfr-int-006` を `stc-record-recovery` に置くのは記録の照合という近さで選んだため。選ばなかった案は `stc-integrity` を残して `stc-index-sample` に新しい term を足すこと。相手側の案: `stc-index-sample` の「観点の立て方（共通）」のデータ整合性の行に「改ざん検知」の観点と `stc-record-recovery` を足す / 要判断
- R5-2: R5 / 2. 適用範囲・前提条件 / 監査証跡の 7 年保持が、`nfr-security-safety-sample`（`nfr-sec-010`）・`opd-index-sample`・`opr-index-sample` の監査ログの 1 年保管と同じ記録のように読め、つけ残高の訂正では保管期間が食い違って見えた / 監査証跡（記録の変更履歴、7 年保持）と `nfr-security-safety` の監査ログ（1 年保管）は別の記録とする 1 文を足した / vp-qe-kata-conformance、vp-dev-change-impact。相手側の案: `opd-index-sample` の監査ログの行か `opr-index-sample` の証跡の表に、監査証跡（重要記録の変更履歴）の 7 年保管を足す / -
- R5-3: R5 / 2. 適用範囲・前提条件 / オフライン時の `_UNDECIDED_` が、`nfr-availability-sample`・`nfr-reliability-sample` の前提条件 ACD-D03・`dec-offline-recording`・`nfr-avl-004`（紙の控えの転記漏れ 0 件）を参照しておらず、転記漏れを誰が扱うかが重なって読めた / ACD-D03 と `dec-offline-recording` を足し、紙の控えの転記漏れは `nfr-avl-004` が扱い、本書は整合性境界に含める時点だけを決めると書いた / vp-qe-kata-conformance / -
- R5-4: R5 / 1. 概要、4. 測定・検証方法 / 「店番」の表記が、同じ系列の sample（可用性・信頼性・運用）の「店番担当」と食い違っていた / 3 か所を「店番担当」にした / vp-qe-kata-conformance（用語集には該当の語がないため、同じ系列の sample にそろえた） / -
- R5-5: R5 / 3. 完全性要件一覧 / `nfr-index-sample` の完全性の代表指標「日次締めの現金と販売記録の差額」が、本書の要件（`nfr-int-001`〜`nfr-int-006`）にない / - / vp-qe-kata-conformance。相手側の案: `nfr-index-sample` の「カテゴリ一覧（8カテゴリ）」の完全性の代表指標を「整合性違反件数（営業日ごと）、同一取引番号の重複記録件数」にする / -
- R5-6: R5 / 5. 関連ドキュメント導線 / `nfr-index-sample` の完全性の運用は `opr-index` だけだが、本書は `opd-integrity-check` / `opr-integrity-check` を必須の導線にしている（`opd-integrity-check` は `imp-operations-sample`・`imp-data-sample` も参照している） / - / vp-qe-kata-conformance。迷った理由: どちらの ID もまだファイルがなく、どちらを正にするかを sample の側だけでは決められないため。選ばなかった案は本書を `opr-index` にそろえること（imp の sample との食い違いが新たに生じる）。相手側の案: `nfr-index-sample` の「関連ドキュメント導線」の完全性の運用列を `opd-integrity-check`、`opr-integrity-check` にする / 要判断
- R5-7: R5 / 3. 完全性要件一覧 / `nfr-int-003`（同一取引番号の重複記録件数）と `nfr-reliability-sample` の `nfr-rel-002`（同じ確定操作からの重複記録件数）が同じ二重記録を扱う。前者は取引番号での検知、後者は確定時の防止という分担として読めるため、本書は直していない / - / vp-dev-change-impact。相手側の案: `nfr-reliability-sample` の `nfr-rel-002` の備考に「取引番号での事後の検知は `nfr-int-003`」と分担を書く / -
- R5-8: R5 / rulebook の全体方針 / grade の F002: `nfr-integrity-rulebook` の `_UNDECIDED_`「sample は 5 章に揃っていない」が、5 章にそろった今の sample と食い違っている / - / vp-qe-kata-conformance。相手側の案: rulebook の該当の `_UNDECIDED_` から sample の章の記述を外し、`recipe`・`template` の要否の判断だけを残す / -
- grade の F001 は前の段で直っている（`based_on` を空にした理由と `dec-*` への導線が 2. 適用範囲・前提条件にある）ため、繰り返していない。F003（vp-ops-release-readiness）は kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされているため、扱っていない。
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

根拠にした資料は、同じ接頭辞の sample 群（`nfr-index-sample`、`nfr-security-safety-sample`、`nfr-availability-sample`、`nfr-reliability-sample`、`stc-index-sample`、`opd-index-sample`、`opr-index-sample`）、`nfr-integrity-rulebook`、Sample 記述標準の共通サンプル文脈である。食い違いは rulebook を正として確かめ、sample の側だけを直した。相手側の文書は変更せず、直す案だけを findings に書いた。用語集には「店番」の該当語がないため、同じ系列の sample の「店番担当」にそろえた。維持した記述は、前の段で直った `based_on` を空にした理由と `dec-*` への導線である。根拠不足による見送りはない。
