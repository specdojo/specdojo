---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-usability-sample-110-20261125t140532z-fe2d4830
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-usability-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-usability-sample-110/T-KATA-REVIEW-ALL-nfr-usability-sample-110-20261125T140532Z-fe2d4830/plan.md
  started_at: "2026-11-25T14:05:41.243Z"
  completed_at: "2026-11-25T14:14:26.198Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-usability-sample
    - specdojo:nfr-usability-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）を実施した。sample は rulebook の必須 5 章、各章の受入条件、カタログの `done_criteria` を満たしており、削る内容はなかった。
- F001 は、関連ドキュメント導線の受入条件の行にある `sac-store-sales` へ「（未作成）」を付けて解消した。
- F002 は観点が `vp-ux-language-consistency` で R3 に当たるため、この段では直していない。R3 に回す。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R1 | 関連ドキュメント導線の表、受入条件の行（line 83、grade では line 71） | `sac-store-sales` はほかの導線の行と違って wikilink でなく、未作成かどうかも書かれていない。既存の受入条件 sample は `specdojo:sac-sample`（性能）だけで、`sac-store-sales` はない。 | 目的の列を「`nfr-usb-001`〜`nfr-usb-004` の合否判定（未作成）」とし、同じ表の `uis-credit-ledger` の行の（未作成）と書き方をそろえた。 | grade F001（`vp-qe-kata-conformance`）、`specdojo:nfr-usability-rulebook` の「位置づけ」、共通規約（未作成の文書はバッククォートで仮置き） | - |
| 2 | R1（R3 に回す） | 測定・検証方法の表、判定者の列（`nfr-usb-001`・`nfr-usb-003`・`nfr-usb-004` の「利用者代表・QE」） | grade F002（`vp-ux-language-consistency`）。「利用者代表」が Role code か役割名か分からない。観点が R3 のものなので、この段では直していない。 | 変更なし。R3 で、メンバー定義の Role code か、概要の「店主代表」「家族利用者代表」の書き方のどちらかにそろえる。 | `docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」（`vp-ux-language-consistency` は R3） | 要判断 |
| 3 | R1（R5 に回す） | `nfr-index-sample` と `nfr-security-safety-sample` にある `sac-store-sales` の参照 | ほかの sample も、未作成の `sac-store-sales` を（未作成）と書かずに参照している。対象外の kata なので直していない。 | R5 で系列全体の未作成の書き方をそろえるか、`sac-store-sales` の sample を作るかを決める。 | `docs/ja/specdojo/guides/kata-guide.md` の「段と渡す材料」（ほかの kata の直すべき点は指摘として残す） | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-usability-sample.md`: 関連ドキュメント導線の表で、受入条件の行（`sac-store-sales`）の目的の列を「`nfr-usb-001`〜`nfr-usb-004` の合否判定（未作成）」に変更した。同じ表の `uis-credit-ledger` の行と、未作成の文書の書き方をそろえた。

## 3. 申し送り

- F002（判定者列の「利用者代表」の表記）は R3 で、メンバー定義の Role code か、概要の「店主代表」「家族利用者代表」の書き方のどちらかにそろえるかを決める。
- `nfr-index-sample` と `nfr-security-safety-sample` にも `sac-store-sales` を「（未作成）」と書かずに参照している箇所がある。R5 で系列全体の書き方をそろえるか、`sac-store-sales` の sample を作るかを決める。
- No: 1／段: R1／箇所: 関連ドキュメント導線の表、受入条件の行（line 83、grade では line 71）／指摘: `sac-store-sales` はほかの導線の行と違って wikilink でなく、未作成かどうかも書かれていない。既存の受入条件 sample は `specdojo:sac-sample`（性能）だけで、`sac-store-sales` はない／直した案: 目的の列を「`nfr-usb-001`〜`nfr-usb-004` の合否判定（未作成）」とし、同じ表の `uis-credit-ledger` の行の（未作成）と書き方をそろえた／根拠: grade F001（`vp-qe-kata-conformance`）、`specdojo:nfr-usability-rulebook` の「位置づけ」（受入は `sac-*` を正本として参照）、共通規約（未作成の文書はバッククォートで仮置き）／印: なし
- No: 2／段: R1（R3 に回す）／箇所: 測定・検証方法の表、判定者の列（`nfr-usb-001`・`nfr-usb-003`・`nfr-usb-004` の「利用者代表・QE」）／指摘: grade F002（`vp-ux-language-consistency`）。「利用者代表」が Role code か役割名か分からない。観点が R3 のものなので、この段では直していない／直した案: 変更なし。R3 で、メンバー定義の Role code か、概要の「店主代表」「家族利用者代表」の書き方のどちらかにそろえる／根拠: `docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」（`vp-ux-language-consistency` は R3）／印: 要判断
- No: 3／段: R1（R5 に回す）／箇所: `nfr-index-sample` と `nfr-security-safety-sample` にある `sac-store-sales` の参照／指摘: ほかの sample も、未作成の `sac-store-sales` を（未作成）と書かずに参照している。対象外の kata なので直していない／直した案: R5 で系列全体の未作成の書き方をそろえるか、`sac-store-sales` の sample を作るかを決める／根拠: `docs/ja/specdojo/guides/kata-guide.md` の「段と渡す材料」（ほかの kata の直すべき点は指摘として残す）／印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ の sample だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml`・`*.yml` のファイルがない）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に従い、plan に展開された finding のうち R1 の観点に当たる F001 だけを直した。根拠は `specdojo:nfr-usability-rulebook` の「位置づけ」（受入は `sac-*` を正本として参照する）と、共通規約（未作成の文書は wikilink にせずバッククォートで仮置きする）である。既存の受入条件 sample は `specdojo:sac-sample`（性能）だけなので、`sac-store-sales` を wikilink にはできないと判断した。F002 は `docs/ja/specdojo/guides/kata-guide.md` の「kata の観点の組」で R3 の観点とされているため、未解消のまま申し送りに残した。rulebook など sample 以外は変更していない。
