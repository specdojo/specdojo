---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sf-sample-150-20261126t100704z-28bb414b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sf-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sf-sample-150/T-KATA-REVIEW-ALL-sf-sample-150-20261126T100704Z-28bb414b/plan.md
  started_at: "2026-11-26T10:07:15.222Z"
  completed_at: "2026-11-26T10:15:06.291Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sf-sample
    - specdojo:sf-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `sf-sample.md` を同系列の sample と参照先に合わせて 3 件直した。相手側を直す案は 2 件を findings に残した。
- grade の指摘の扱いは次のとおり。F004（`vp-dev-change-impact`）は前の段の修正で `Q-01`・`Q-02` に見直す箇所が対応付けられており、解消済み。F006（`vp-qe-kata-conformance`）は前提の「辞書は税抜」が古くなっていたため、R5-2 で直した。F001・F002 の観点は kata の段のレビューでは使わないため対象外。F003・F005 は R4 の観点のため、この段では扱わない。
- 検査は、整形（prettier）、markdownlint、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 目的と概要・未決事項（`Q-01`） | `sf-index` を「未作成」としていたが、`specdojo:sf-index-sample` があり、`SF-POS-01` が本書に対応付けられている。 | wikilink `[[specdojo:sf-index-sample\|システム化機能一覧]]` に変え、`Q-01` から「`sf-index` の対応」を外した。 | `vp-qe-kata-conformance`（sf-index-sample の機能一覧の `SF-POS-01` 行） | - |
| R5-2 | R5 | 入出力・未決事項（`Q-01`） | 前の段が `Q-01` に足した「画面の税込単価と業務データ辞書の税抜の販売単価の対応」が、いまの `bdd-sample.yaml` と食い違う。辞書は標準販売価格・販売単価とも税込で、税率区分の項目を持たない。 | 入力行を「標準販売価格（税込）、税率区分、販売可能な在庫数量」にし、`Q-01` の論点を「税計算（業務データ辞書に未定義の税率区分の正本を含む）」に置き換えた。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`（`bdd-sample.yaml` の標準販売価格・販売単価の description） | - |
| R5-3 | R5 | 入出力・検証・受入観点・未決事項 | 「税区分」が画面仕様（uis-sample）の「税率区分」と違い、`V-04` の「商品台帳の単価」が業務データ辞書の「標準販売価格」と違う。 | 「税率区分」「商品の標準販売価格」にそろえた。 | `vp-qe-kata-conformance`（uis-sample の集計の説明、`bdd-sample.yaml` の商品） | - |
| R5-4 | R5 | 入出力（相手側: `bdd-sample.yaml` の商品） | 画面仕様は「商品台帳は税込単価と税率区分を持つ」とするが、業務データ辞書の商品に税率区分の項目がない。 | 相手側の案: `bdd-sample.yaml` の商品に税率区分（8% / 10%）の項目を足す。足した場合は、sf-sample の `Q-01` から税率区分の正本の論点を外す。本書では変更していない。 | `vp-qe-kata-conformance` | - |
| R5-5 | R5 | 業務プロセス・画面との対応（相手側: `bdd-sample.yaml` の売上記録の注記） | 売上記録の注記は「税額と請求額を確認する操作は販売管理 CLI 仕様に従う」とするが、sf-sample は CLI による会計を、sf-index-sample は販売管理 CLI を対象外とする。 | 相手側の案: 注記を販売登録画面に向けるか、照会用の CLI と明記する。照会は会計に当たらないとも読めるため、どちらを直すかは決めていない。本書では変更していない。 | `vp-qe-kata-conformance` | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sf-sample.md`: `sf-index` を「未作成」とした記述を、`specdojo:sf-index-sample` への wikilink に置き換えた。入力行は「標準販売価格（税込）、税率区分、販売可能な在庫数量」にそろえた。`V-04` の「商品台帳の単価」は「商品の標準販売価格」にした。「税区分」は画面仕様に合わせて「税率区分」に統一した。`Q-01` は、`sf-index` の対応と画面・辞書の税込税抜の差の論点を外し、税率区分の正本を含む税計算の論点にした。`Q-01` の見直す箇所には `FR-02`・`V-02` の条件追加も加えた。

## 3. 申し送り

- 相手側（`bdd-sample.yaml`・`uis-sample`）は変更していない。直す案は findings の R5-4・R5-5 に書いた。
- R5-1: R5 / 目的と概要・未決事項 / `sf-index` を「未作成」としていたが、`specdojo:sf-index-sample` があり `SF-POS-01` が本書に対応付けられている / wikilink [[specdojo:sf-index-sample|システム化機能一覧]] に変え、`Q-01` から「`sf-index` の対応」を外した / `vp-qe-kata-conformance`（sf-index-sample の機能一覧の `SF-POS-01` 行） / -
- R5-2: R5 / 入出力・未決事項 / 前の段が `Q-01` に足した「画面の税込単価と業務データ辞書の税抜の販売単価の対応」が、いまの業務データ辞書（bdd-sample.yaml）と食い違う。辞書は標準販売価格・販売単価とも税込で、税率区分の項目を持たない / 入力行を「標準販売価格（税込）、税率区分、販売可能な在庫数量」にし、`Q-01` の論点を「税計算（業務データ辞書に未定義の税率区分の正本を含む）」に置き換えた / `vp-qe-kata-conformance`、`vp-dev-change-impact`（bdd-sample.yaml の標準販売価格・販売単価の description） / -
- R5-3: R5 / 入出力・検証・受入観点・未決事項 / 「税区分」が画面仕様（uis-sample）の「税率区分」と違い、`V-04` の「商品台帳の単価」が業務データ辞書の「標準販売価格」と違う / 「税率区分」「商品の標準販売価格」にそろえた / `vp-qe-kata-conformance`（uis-sample の集計の説明、bdd-sample.yaml の商品） / -
- R5-4: R5 / 入出力（相手側） / 画面仕様は「商品台帳は税込単価と税率区分を持つ」とするが、業務データ辞書の商品に税率区分の項目がない / - / `vp-qe-kata-conformance`。相手側の案: bdd-sample.yaml の商品に税率区分（8% / 10%）の項目を足し、sf-sample の `Q-01` から税率区分の正本の論点を外す / -
- R5-5: R5 / 業務プロセス・画面との対応（相手側） / 業務データ辞書の売上記録の注記は「税額と請求額を確認する操作は販売管理 CLI 仕様に従う」とするが、sf-sample は CLI による会計を、sf-index-sample は販売管理 CLI を対象外とする / - / `vp-qe-kata-conformance`。相手側の案: bdd-sample.yaml の注記を販売登録画面に向けるか、照会用の CLI と明記する。照会は会計に当たらないとも読めるため、どちらを直すかを決めていない / 要判断
- grade の指摘の扱い: F004（`vp-dev-change-impact`）は前の段の修正で `Q-01`・`Q-02` に見直す箇所が対応付けられており、解消済み。F006（`vp-qe-kata-conformance`）は前提の「辞書は税抜」が古くなっていたため R5-2 で直した。F001・F002 の観点は kata の段のレビューでは使わないため対象外。F003・F005 は R4 の観点のためこの段では扱わない。

## 4. 進め方と実践の型の適用

根拠にしたのは、同じ接頭辞の `sf-index-sample`、業務データ辞書 `bdd-sample.yaml`、画面仕様 `uis-sample` の記述、kata-guide の R5 の観点、plan に展開された grade の finding である。rulebook との食い違いは見つかっていない。直した記述は、参照先と食い違っていた次の 3 点である。`sf-index` が未作成という記述、税込と税抜の前提、「税区分」と「商品台帳の単価」の用語。参照先と整合していた記述は維持した。未解消の finding はなく、相手側の 2 件は案だけを残した。
