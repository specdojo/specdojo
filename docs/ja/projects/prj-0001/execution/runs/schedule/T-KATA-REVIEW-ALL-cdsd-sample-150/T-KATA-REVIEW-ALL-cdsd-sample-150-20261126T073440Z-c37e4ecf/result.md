---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdsd-sample-150-20261126t073440z-c37e4ecf
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdsd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdsd-sample-150/T-KATA-REVIEW-ALL-cdsd-sample-150-20261126T073440Z-c37e4ecf/plan.md
  started_at: "2026-11-26T07:34:50.977Z"
  completed_at: "2026-11-26T07:45:24.466Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdsd-sample
    - specdojo:cdsd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`cdsd-sample` を同じ接頭辞の sample、用語集、共通サンプル文脈と照合した。sample 側で直せる 2 点を修正し、相手側の修正案 4 件を findings に挙げた。
- 修正した点は、担当欄の Role code と役割名の対応を足したことと、保管場所一覧 `sld-sample` を未作成扱いしていた確認事項を、実在する同書への参照へ直したことである。
- 整形と markdownlint は executor 側で通過した。runner 検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通過した。変更種別により対象外とされた検査は runner の記録のとおりである。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 3.1. 生成元と利用制約 | 担当欄の PO・OPS・BA・QE が Role code のまま説明なく使われている。役割名で書く `sld-sample` と読み合わせられない。 | 表の前に、Role code が `specdojo:pm-members-sample` のものであるという説明を 1 文足した。PO・OPS は店主代表、BA は開発担当、QE は同行レビュー担当が担うことも同じ文で示した。 | `vp-qe-kata-conformance`（kata 相互）、`sld-sample` の概要にある担当欄の説明、`pm-members-sample` の roles | - |
| R5-2 | R5 | 5. 確認事項と変更影響 | 保存・保持・復旧方式の正本を未作成の `specdojo:sld-sales-closing` としている。実際には `sld-sample` が保管場所・削除条件・復旧手順を持つ。また `sld-sample` の確認事項は、販売記録の正本保存先と保持期間を CDSD で未決としている。 | 論点を「システム化後の販売記録の正本保存先と保持期間」に絞った。保管場所・削除条件・復旧手順は `[[specdojo:sld-sample\|保管場所一覧]]` に従い、決まったら同書を書き換える形にした。`based_on` には循環を避けて足していない。 | `vp-dev-change-impact`、`sld-sample` の「削除・退避・復旧の判断基準」と「確認事項と変更影響」 | - |
| R5-3 | R5 | 2. 概念データストア一覧（販売記録） | `cdfd-overview-sample` の販売記録は「支払区分（現金・つけ）」と書く。一方 `bdd-sample.yaml` と本 sample は「支払方法」と書き、用語が食い違う。 | - | `vp-qe-kata-conformance`。相手側の `cdfd-overview-sample` の「トランザクションデータ」表で、販売記録の主な内容を「支払方法（現金・つけ）」へそろえる案。 | - |
| R5-4 | R5 | 2. 概念データストア一覧（商品台帳） | 「補充基準」（`cdfd-overview-sample` と本 sample）と「発注点」（`bdd-sample.yaml` の `reorder_point`、`gl-sample` の `tm-reorder-point`）が並び立っている。 | - | `vp-qe-kata-conformance`。相手側の案は、`cdfd-overview-sample` と `bdd-sample` をどちらかの語へそろえること、または `gl-sample` の `tm-reorder-point` の aliases に「補充基準」を足すこと。`bdd-sample.yaml` の発注点は定番商品の在庫不足判定に限るため、同じ概念か判断できない。そのため、`cdfd-overview-sample` に合わせている本 sample は直していない。 | 要判断 |
| R5-5 | R5 | 2. 概念データストア一覧、3.1. 生成元と利用制約 | 本 sample を含む多数の sample が「つけ上限」と書く。`gl-sample` の正式な語は「つけ限度額」で、aliases は「つけ上限額」であり、「つけ上限」は別名にない。 | - | `vp-qe-kata-conformance`（用語集）。相手側の `gl-sample` の `tm-sales-credit-limit` の aliases に「つけ上限」を足す案を選んだ。全 sample を「つけ限度額」へ直す案は変更の範囲が大きいため選ばなかった。 | 要判断 |
| R5-6 | R5 | 2. 概念データストア一覧（販売記録） | `sld-sample` の「隣接仕様の記録・状態と保管場所の対応」は、本 sample の対応に「販売記録は `data/sales/`（結果不明の取引は照合待ち）」と書く。しかし本 sample の販売記録は確定した会計だけを含む。本部受付の結果不明は `bdd-sample.yaml` の本部売上受付の概念である。 | - | `vp-dev-change-impact`。相手側の `sld-sample` の該当セルで、結果不明の取引の根拠を `bdd-sample`（本部売上受付）として書き分ける案。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdsd-sample.md`: 「生成元と利用制約」の表の前に、PO・OPS・BA・QE の Role code が `specdojo:pm-members-sample` のものであり、各役割を誰が担うかを示す 1 文を足した。「確認事項と変更影響」では、保存・保持・復旧方式の正本を未作成の `specdojo:sld-sales-closing` としていた論点を、「システム化後の販売記録の正本保存先と保持期間」に絞った。保管場所・削除条件・復旧手順は `sld-sample` に従う形にした。表の列幅は prettier で再整形した。

## 3. 申し送り

- `sld-sample` が本 sample を `based_on` に持つため、循環を避けて本 sample の `based_on` には `sld-sample` を足していない。
- findings の R5-3 から R5-6 は、相手側（cdfd-overview-sample、bdd-sample、gl-sample、sld-sample）を直す案である。本タスクでは変更していない。
- R5-1: 段 R5 / 箇所 3.1. 生成元と利用制約 / 指摘: 担当欄の PO・OPS・BA・QE が Role code のまま説明なく使われ、役割名で書く sld-sample と読み合わせられない / 直した案: 表の前に、Role code が `specdojo:pm-members-sample` のもので PO・OPS は店主代表、BA は開発担当、QE は同行レビュー担当が担うという 1 文を足した / 根拠: `vp-qe-kata-conformance`（kata 相互）、sld-sample の概要の担当欄の説明、pm-members-sample の roles / 印: -
- R5-2: 段 R5 / 箇所 5. 確認事項と変更影響 / 指摘: 保存・保持・復旧方式の正本を未作成の `specdojo:sld-sales-closing` としている。実際には sld-sample が保管場所・削除条件・復旧手順を持ち、sld-sample の確認事項は販売記録の正本保存先と保持期間を CDSD で未決としている / 直した案: 論点を「システム化後の販売記録の正本保存先と保持期間」に絞り、保管場所・削除条件・復旧手順は `[[specdojo:sld-sample|保管場所一覧]]` に従い、決まったら同書を書き換える形にした（sld-sample がこの sample を `based_on` に持つため、循環を避けて `based_on` には足していない） / 根拠: `vp-dev-change-impact`、sld-sample の「削除・退避・復旧の判断基準」と「確認事項と変更影響」 / 印: -
- R5-3: 段 R5 / 箇所 2. 概念データストア一覧（販売記録） / 指摘: cdfd-overview-sample の販売記録は「支払区分（現金・つけ）」、bdd-sample.yaml とこの sample は「支払方法」で、用語が食い違う / 直した案: - / 根拠: `vp-qe-kata-conformance`。相手側の cdfd-overview-sample の「トランザクションデータ」表の販売記録の主な内容を「支払方法（現金・つけ）」へそろえる案 / 印: -
- R5-4: 段 R5 / 箇所 2. 概念データストア一覧（商品台帳） / 指摘: 「補充基準」（cdfd-overview-sample とこの sample）と「発注点」（bdd-sample.yaml の `reorder_point`、gl-sample の `tm-reorder-point`）が並び立つ / 直した案: - / 根拠: `vp-qe-kata-conformance`。相手側の案は、cdfd-overview-sample と bdd-sample をどちらかの語へそろえるか、gl-sample の `tm-reorder-point` の aliases に「補充基準」を足すこと。bdd-sample.yaml の発注点は定番商品の在庫不足判定に限るため同じ概念か判断できず、cdfd-overview-sample に合わせているこの sample は直さなかった / 印: 要判断
- R5-5: 段 R5 / 箇所 2. 概念データストア一覧、3.1. 生成元と利用制約 / 指摘: この sample を含む多数の sample が「つけ上限」と書くが、gl-sample の正式な語は「つけ限度額」（aliases は「つけ上限額」）で、「つけ上限」は別名にない / 直した案: - / 根拠: `vp-qe-kata-conformance`（用語集）。相手側の gl-sample の `tm-sales-credit-limit` の aliases に「つけ上限」を足す案を選んだ。全 sample を「つけ限度額」へ直す案は変更の範囲が大きいため選ばなかった / 印: 要判断
- R5-6: 段 R5 / 箇所 2. 概念データストア一覧（販売記録） / 指摘: sld-sample の「隣接仕様の記録・状態と保管場所の対応」は、この sample の対応に「販売記録は `data/sales/`（結果不明の取引は照合待ち）」と書くが、この sample の販売記録は確定した会計だけを含み、本部受付の結果不明は bdd-sample.yaml の本部売上受付の概念である / 直した案: - / 根拠: `vp-dev-change-impact`。相手側の sld-sample の該当セルで、結果不明の取引の根拠を bdd-sample（本部売上受付）として書き分ける案 / 印: -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/cdsd-sample.md のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）

## 4. 進め方と実践の型の適用

根拠にしたのは、同じ接頭辞の sample（`cdfd-overview-sample`、`bdd-sample`、`ccd-sample`、`sld-sample`、`pm-members-sample`）、用語集 `gl-sample`、Sample 記述標準の共通サンプル文脈である。観点は `vp-qe-kata-conformance` と `vp-dev-change-impact` を使った。sample 側で直せる食い違い（R5-1、R5-2）は本文を修正した。相手側を直すべき食い違い（R5-3 から R5-6）は変更せず、直す案を findings に記録した。用語の揺れのうち「補充基準」と「発注点」の同一性、「つけ上限」の扱いは判断が割れるため、「要判断」の印を付けた。grade や condense 由来の finding は plan に展開されていなかった。
