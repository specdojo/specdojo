---
specdojo:
  id: prj-0001:pjr-aeke-ifx-api-msg-spec-content
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: hard
  owner: BA
  registered_at: "2026-11-22T12:55:19Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-0VPB
---

# PJR-AEKE ifx-api と ifx-msg の rulebook と sample の仕様の中身を直す

## 1. 概要

型の grade で、ifx-api と ifx-msg は rulebook と sample とも needs-work だった。必須の info.version と responses の欠け、ifx-api の sample の題材が駄菓子屋の文脈でないことを直す。

## 2. 入力

- 2026-11-22 の型の grade（opus-review-executor）: ifx-api-rulebook 72・ifx-api-sample 73・ifx-msg-rulebook 77・ifx-msg-sample 74、いずれも needs-work。
- major の中心: OpenAPI 3.0.3 と AsyncAPI 2.6.0 で必須の info.version が sample にない。ifx-api-rulebook の必須の構造に info.version と各操作の responses が入っていない。ifx-api-sample は汎用の決済 API が題材で、ifx-index-sample でキャッシュレス決済は対象外とされている。
- PJR-0VPB の executor は「標準の構造を変えない」完了条件に従い、info.version を変更案として個票に残していた。0VPB は運用の記述を外す目的で完了したため、中身の直しはこの項目で扱う（indie の承認、2026-11-22）。

## 3. 完了条件

- `ifx-api-sample` と `ifx-msg-sample` の `info` に `version` を足す。
- `ifx-api-rulebook` の必須の構造に、`info.version` と各操作の `responses` を足す。`ifx-msg-rulebook` の必須の構造と sample が合っていることを確かめる。
- `ifx-api-sample` の題材を、共通サンプル文脈（駄菓子屋きぬや）と `ifx-index-sample` の外部連携の一覧に合う本部の API（商品マスタや売上の登録など）に差し替える。`ifx-index-sample` の対象外（キャッシュレス決済）を題材にしない。`ifx-index-sample` のどの項目の詳しい仕様かを sample に示す。
- OpenAPI と AsyncAPI の標準の構造は守る。
- ほかの型の rulebook と sample は変えない。`ifx-index-sample` を直す必要があれば、変更案を個票の対応結果に書く。
- 型の grade は統合の後に orchestrator が流す。executor は grade を実行しない。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。影響がなければ「なし」と書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- `npm run validate:schema`・`npm run lint:md`・`npm run lint:fm` を通し、親の検証を通す。
- 2 回目の実行（2026-11-23）。1 回目の後の型の grade（2026-11-22、opus-review-executor）は、ifx-api-rulebook が needs-work 79、ifx-api-sample が needs-work 82、ifx-msg-rulebook が needs-work 77、ifx-msg-sample が pass 86 だった。2 回目では次を直す（利用者の決定、2026-11-23、indie）。
- `ifx-index-sample` の「本部への売上登録」の `spec_ref` を `specdojo:ifx-api-sample` にし、「レシート印刷」の行と同じ形で詳細契約への wikilink のコメントを置く。「本部の二つの詳細仕様は未同梱」のコメントと、想定のファイル名 `ifx-api-kinuya-sales.yaml` の記述を、売上登録は同梱・商品マスタの照会は未同梱（`spec_ref: TBD` のまま）に合わせて直す。この項目に限り、上の「ほかの型の rulebook と sample は変えない」の例外とする。
- `ifx-api-rulebook` と `ifx-msg-rulebook` のタイトルと英語名から、今は使わない略語（`EAPIS`・`EMS`）を外す。タイトルは「外部API仕様 作成ルール」「外部メッセージ仕様 作成ルール」の形にし、タイトルの直下に英語名の行（例: `External API Specification Documentation Rules`）を足す。本文の `EAPIS`・`EMS`・`ESIL` は、日本語の名前か `ifx-api`・`ifx-msg`・`ifx-index` の prefix に置き換え、`ifx-index` は `[[specdojo:ifx-index-rulebook|外部システムI/F一覧 作成ルール]]` で特定する。4 文書で同じ扱いとし、sample のコメントの `ESIL` も直す。
- 1 回目の後の grade の minor と note を、次の一覧のとおり 4 文書で直す。指摘ごとに「直した」か「直さない（理由）」を決め、個票の対応結果に表で残す。rulebook と sample の両方に関わる指摘は、両方をそろえて直す。
  - ifx-api-rulebook: OpenAPI 3.0.3 と 3.1.x の選び方と決める人がない。対象外（ifx-msg・ifx-file・ifx-cmd）を書いていない。合意の当事者（Role）がない。`specdojo-schema: none reason=external-openapi` の前提と、代わりの OpenAPI の検証の手順がない。配置先のディレクトリがない。id を変えたときの `spec_ref` と yaml-pages の表示のページへの影響がない。「エラー定義（推奨）」と「少なくとも定義します」、必須の章の中の「推奨」で必須度が混ざる。ファイル名の例 `ifx-api-payment` に拡張子がない。互換を壊す変更の版の付け方（`info.version`・`/v1`）と改訂の手順がない。標準の章の構成（全体方針・ファイル命名・ID 規則など）とのずれ。sample の id `specdojo:ifx-api-sample` が `ifx-api-...` の規則の例外であることの説明がない（`ifx-cmd-rulebook` の「命名上の例外」と同じ書き方にする）。
  - ifx-api-sample: 連携の前提・合意対象・未決事項（冪等性・通貨など）と、PO（店主代表）が承認と ready への昇格を判断する旨のコメントがない。`based_on` が空（`specdojo:ifx-index-sample` などを入れる）。403・404・429 がなく省略の理由もない。`SaleLine` で税区分・合計・預かり金を送るかが分からない。結果不明のときの受付の照会の手段と、409 で既存の `sale_id` を返すかがない。201 の応答の `status` に `REJECTED` を許す意味と扱いが分からない。項目の追加・必須化の互換の扱いがない。`product_code`・`transaction_id` の形式（pattern・長さ）がない。代わりの OpenAPI の検証の手段がない。本部の問い合わせの窓口がない（`_TODO_` でよい）。ready にするための残課題がない。表示のページ `samples/generated/ifx-api-sample.md` が旧版のまま（note、yaml-pages で作り直す）。
  - ifx-msg-rulebook: AsyncAPI と CloudEvents を選ぶ理由がない。合意・承認の主体と、ready にする条件がない。`servers` に実の接続先・認証情報・契約情報を書かない禁止事項がない。`ifx-index` で `spec_ref` を決めてから作る、という作る順序がない。イベントの `type` の版（`.v1`）の上げ方、旧版の併存、廃止と変更の通知の規則がない。未決事項と仮定の書き方がない。同期の API（`ifx-api`）との責務の境界がない。publish・subscribe の向きごとの送信者・受信者の書き方がない。CloudEvents の structured・binary と `contentType`、`servers`・プロトコルの記載の要否がない。配置先と `channels`・`components/messages` の必須の項目がない。id やファイル名を変えたときの影響がない。AsyncAPI の検証の手順がない。AsyncAPI 2.6.0 以外を許す条件と「最小十分」「推奨」の判定がない。`specdojo-schema: none reason=external-asyncapi` の書き方がない。ファイル名の例 `ifx-msg-stock-changed` に拡張子がない。sample の id `specdojo:ifx-msg-sample` の例外の説明がない。`datacontenttype` の固定と sample の食い違い。禁止事項に理由がない。「メッセージング仕様」「メッセージ仕様」の用語の混在と、1 ファイルの単位の定義がない。
  - ifx-msg-sample: `info.description` がない。配信・順序の保証と重複受信の扱い（`id` による冪等処理）がない。`based_on` が空。`current_quantity` の下限と `product_id` の書式がない。`subscribe` の意味と発行者・購読者がない。`datacontenttype` を `enum: ["application/json"]` にしていない。代わりの AsyncAPI の検証の手段がない。`id` が一意になる条件（`source` との組み合わせなど）がない。チャネルの発生の契機（販売・仕入れ・棚卸しなど）がない。`defaultContentType`・`contentType`・`datacontenttype` の使い分けの説明がない。
- 1 回目の後の grade の rulebook の major（「sample に `info.version` がない」）は、sample に `info.version` があるので評価の誤りとして直さない。
- プロダクト文書とプロジェクト文書の id の修飾の規則（PJR-PHY7 の範囲）は、この項目では変えない。
- `ifx-cmd-rulebook`・`ifx-file-rulebook`・`ifx-cmd-recipe`・成果物カタログの古い略語は、後続の todo で直すので、この項目では変えない。
- yaml-pages で表示のページを作り直してから `npm run lint:md` を流す。

## 4. 作業内容

| No  | 作業                                                           | 担当 | 状態 | メモ                                    |
| --- | -------------------------------------------------------------- | ---- | ---- | --------------------------------------- |
| 1   | ifx-api-sample と ifx-msg-sample の info に version を足す     | BA   | done | 1.0.0                                   |
| 2   | ifx-api-rulebook の必須構造に info.version と responses を足す | BA   | done | ifx-msg-rulebook は既に version を要求  |
| 3   | ifx-api-sample を本部の売上登録 API に差し替える               | BA   | done | ifx-index-sample の本部への売上登録対応 |
| 4   | 型の grade の再実行                                            | BA   | open | executor は grade を実行しないため      |
| 5   | ifx-index-sample の売上登録の spec_ref とコメントを直す        | BA   | done | 2 回目。spec_ref を ifx-api-sample に   |
| 6   | 4 文書から EAPIS・EMS・ESIL を外し、英語名の行を足す           | BA   | done | 2 回目                                  |
| 7   | grade の minor と note を 4 文書で直す                         | BA   | done | 2 回目。対応結果の表を参照              |
| 8   | yaml-pages で表示のページを作り直す                            | BA   | done | 3 ページを生成                          |

## 5. 対応結果

- `ifx-api-sample` を決済 API から本部売上登録 API（`createSale`、`POST /v1/sales`）へ差し替え、`info.version: 1.0.0` と、`ifx-index-sample` の「本部への売上登録」の詳細仕様であることを `info.description` に追加した。取引ID重複の `409` を含む。
- `ifx-msg-sample` に `info.version: 1.0.0` を追加した。`ifx-msg-rulebook` は `info` に `version` を既に要求しており、sample と整合する。変更なし。
- `ifx-api-rulebook` の必須構造に `info.version` と各操作の `responses` を追加し、例の決済題材（`ifx-api-payment`・`createPayment`）を売上登録に置き換えた。
- 決めた点: version は `1.0.0`。`ifx-msg-rulebook` の「決済」は外部システムの一般例のため残した。
- `ifx-index-sample` の変更案: なし（`spec_ref` は TBD で、`ifx-api-kinuya-sales.yaml` を想定する記述と整合する）。1 回目の判断。2 回目の利用者の決定で、下記のとおり直した。

### 5.1. 2 回目の対応（2026-11-23）

- `ifx-api-rulebook`・`ifx-msg-rulebook` を標準の章構成（全体方針・位置づけ・ファイル命名・ID規則・先頭メタ項目・本文要件・記述ガイド・禁止事項）に組み直した。タイトルを「外部API仕様 作成ルール」「外部メッセージ仕様 作成ルール」にし、直下に英語名の行を足した。`EAPIS`・`EMS`・`ESIL` は `ifx-api`・`ifx-msg`・`ifx-index` に置き換え、`ifx-index` は `[[specdojo:ifx-index-rulebook|外部システムI/F一覧 作成ルール]]` で特定した。sample の 2 つには `ESIL` の記述がなかった。
- `ifx-index-sample` の「本部への売上登録」の `spec_ref` を `specdojo:ifx-api-sample` にし、詳細契約の wikilink のコメントを置いた。冒頭の「本部の二つの詳細仕様は未同梱」を「売上登録は同梱、商品マスタの照会は未同梱」に直し、`ifx-api-kinuya-sales.yaml` の記述は外した。商品マスタの照会は `spec_ref: TBD` のまま。
- 決めた点と理由:
  - `based_on` を rulebook で必須にし、参照元の `ifx-index` の ID を最低限入れるとした。sample の `based_on` を空にしないという指摘を、rulebook と sample の両方でそろえるため。
  - 201 の `status` は `enum: [ACCEPTED]` にし、拒否は 4xx で返すとした。`REJECTED` を 201 に残すと HTTP の状態コードと意味が二重になるため。
  - 409 は既存の `sale_id` を返す専用の `DuplicateSaleResponse` にした。再送を受付済みとして扱えるようにするため。
  - 404 はこの操作で返さないとし、理由を `info.description` に書いた。対象の資源を指定しない登録の操作のため。商品コードの未登録は 400 で返す。
  - 税区分・税額・合計・預かり金は送らず、本部が計算する仮定にした。`ifx-index-sample` の商品照会が税区分を本部から得るため。最終の扱いは `_UNDECIDED_` に残した。
  - `ifx-msg-sample` の `defaultContentType` を `application/cloudevents+json` にし、`contentType` とそろえた。`datacontenttype` は `enum: ["application/json"]` に固定した。structured モードの既定と `data` の形式を分けるため。
  - 在庫変更のイベントは `ifx-index-sample` に未掲載のため、未掲載の連携の例であり、採用するときは一覧に行を足すと `_ASSUMPTION_` に書いた。一覧に行を足すのは対象外の変更になるため、行は足していない。
  - OpenAPI・AsyncAPI の検証器はリポジトリの依存にないため、rulebook では例（Redocly CLI・Spectral・AsyncAPI CLI）を挙げて実行記録に残す手順とした。依存の追加はこの項目の範囲外とした。

指摘への対応（1 回目の後の grade の minor と note）:

| 文書             | 指摘                                                                    | 対応                                                           |
| ---------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------- |
| ifx-api-rulebook | OpenAPI 3.0.3 と 3.1.x の選び方と決める人がない                         | 直した（本文要件。DEV が ARC と合意）                          |
| ifx-api-rulebook | 対象外（ifx-msg・ifx-file・ifx-cmd）がない                              | 直した（全体方針）                                             |
| ifx-api-rulebook | 合意の当事者（Role）がない                                              | 直した（位置づけ）                                             |
| ifx-api-rulebook | `specdojo-schema: none` の前提と代わりの検証の手順がない                | 直した（先頭メタ項目、記述ガイドの未決事項と検証）             |
| ifx-api-rulebook | 配置先のディレクトリがない                                              | 直した（ファイル命名・ID規則）                                 |
| ifx-api-rulebook | id を変えたときの `spec_ref` と yaml-pages への影響がない               | 直した（ファイル命名・ID規則）                                 |
| ifx-api-rulebook | エラー定義の必須度が混ざる                                              | 直した（必須とし、省略は理由を書く）                           |
| ifx-api-rulebook | ファイル名の例に拡張子がない                                            | 直した（`ifx-api-sales.yaml`）                                 |
| ifx-api-rulebook | 互換を壊す変更の版の付け方と改訂の手順がない                            | 直した（記述ガイドの版と改訂）                                 |
| ifx-api-rulebook | 標準の章の構成とのずれ                                                  | 直した                                                         |
| ifx-api-rulebook | sample の id の例外の説明がない                                         | 直した（ifx-cmd-rulebook と同じ書き方）                        |
| ifx-api-sample   | 連携の前提・合意対象・未決事項と PO の判断のコメントがない              | 直した（先頭コメントと `info.description`）                    |
| ifx-api-sample   | `based_on` が空                                                         | 直した（`specdojo:ifx-index-sample`）                          |
| ifx-api-sample   | 403・404・429 がない                                                    | 直した（403・429 を追加、404 は省略の理由を書いた）            |
| ifx-api-sample   | `SaleLine` で税区分・合計・預かり金を送るかが分からない                 | 直した（送らない、本部が計算）                                 |
| ifx-api-sample   | 結果不明のときの照会の手段と、409 で既存の `sale_id` を返すかがない     | 直した（409 は返す。照会の手段は `_UNDECIDED_` に残した）      |
| ifx-api-sample   | 201 の `REJECTED` の意味が分からない                                    | 直した（`ACCEPTED` のみ）                                      |
| ifx-api-sample   | 項目の追加・必須化の互換の扱いがない                                    | 直した（`info.description`）                                   |
| ifx-api-sample   | `product_code`・`transaction_id` の形式がない                           | 直した（`pattern`・`maxLength`）                               |
| ifx-api-sample   | 代わりの OpenAPI の検証の手段がない                                     | 直した（先頭コメント）                                         |
| ifx-api-sample   | 本部の問い合わせの窓口がない                                            | 直した（`_TODO_`）                                             |
| ifx-api-sample   | ready にするための残課題がない                                          | 直した（`_UNDECIDED_` の一覧）                                 |
| ifx-api-sample   | 表示のページが旧版のまま                                                | 直した（yaml-pages で作り直した）                              |
| ifx-msg-rulebook | AsyncAPI と CloudEvents を選ぶ理由がない                                | 直した（全体方針）                                             |
| ifx-msg-rulebook | 合意・承認の主体と ready にする条件がない                               | 直した（位置づけ）                                             |
| ifx-msg-rulebook | `servers` に実の接続先などを書かない禁止事項がない                      | 直した（禁止事項）                                             |
| ifx-msg-rulebook | `ifx-index` で `spec_ref` を決めてから作る順序がない                    | 直した（位置づけ）                                             |
| ifx-msg-rulebook | `type` の版の上げ方、旧版の併存、廃止の通知がない                       | 直した（記述ガイドの版と改訂）                                 |
| ifx-msg-rulebook | 未決事項と仮定の書き方がない                                            | 直した（記述ガイドの未決事項と検証）                           |
| ifx-msg-rulebook | 同期の API との責務の境界がない                                         | 直した（全体方針）                                             |
| ifx-msg-rulebook | publish・subscribe の送信者・受信者の書き方がない                       | 直した（記述ガイドの向きと送信者・受信者）                     |
| ifx-msg-rulebook | structured・binary と `contentType`、`servers` の要否がない             | 直した（形式の使い分け、本文要件で `servers` は任意）          |
| ifx-msg-rulebook | 配置先と `channels`・`components/messages` の必須の項目がない           | 直した（ファイル命名・ID規則、本文要件）                       |
| ifx-msg-rulebook | id やファイル名を変えたときの影響がない                                 | 直した（ファイル命名・ID規則）                                 |
| ifx-msg-rulebook | AsyncAPI の検証の手順がない                                             | 直した（記述ガイドの未決事項と検証）                           |
| ifx-msg-rulebook | 2.6.0 以外を許す条件と「最小十分」「推奨」の判定がない                  | 直した（本文要件、全体方針。「推奨」は必須性の列に置き換えた） |
| ifx-msg-rulebook | `specdojo-schema: none` の書き方がない                                  | 直した（先頭メタ項目）                                         |
| ifx-msg-rulebook | ファイル名の例に拡張子がない                                            | 直した（`ifx-msg-stock-changed.yaml`）                         |
| ifx-msg-rulebook | sample の id の例外の説明がない                                         | 直した                                                         |
| ifx-msg-rulebook | `datacontenttype` の固定と sample の食い違い                            | 直した（両方で `enum` に固定）                                 |
| ifx-msg-rulebook | 禁止事項に理由がない                                                    | 直した（表に理由の列）                                         |
| ifx-msg-rulebook | 「メッセージング仕様」「メッセージ仕様」の混在と 1 ファイルの単位       | 直した（「メッセージ仕様」に統一、全体方針で単位を定義）       |
| ifx-msg-sample   | `info.description` がない                                               | 直した                                                         |
| ifx-msg-sample   | 配信・順序の保証と重複受信の扱いがない                                  | 直した（at-least-once、`source` と `id` の組）                 |
| ifx-msg-sample   | `based_on` が空                                                         | 直した（`specdojo:ifx-index-sample`）                          |
| ifx-msg-sample   | `current_quantity` の下限と `product_id` の書式がない                   | 直した（`minimum: 0`、`pattern`）                              |
| ifx-msg-sample   | `subscribe` の意味と発行者・購読者がない                                | 直した（チャネルの `description`）                             |
| ifx-msg-sample   | `datacontenttype` を `enum` にしていない                                | 直した                                                         |
| ifx-msg-sample   | 代わりの AsyncAPI の検証の手段がない                                    | 直した（先頭コメント）                                         |
| ifx-msg-sample   | `id` が一意になる条件がない                                             | 直した（`source` との組）                                      |
| ifx-msg-sample   | チャネルの発生の契機がない                                              | 直した（販売の確定・仕入れの登録・棚卸しの訂正）               |
| ifx-msg-sample   | `defaultContentType`・`contentType`・`datacontenttype` の使い分けがない | 直した（`info.description`）                                   |
| 両 rulebook      | major「sample に `info.version` がない」                                | 直さない（sample に `info.version` があり、評価の誤りのため）  |

### 5.2. CHANGELOG に書く事項

- 区分: Changed
- 文案: ifx-api・ifx-msg の rulebook を標準の章構成に組み直し、タイトルから略語を外して英語名の行を足した。ifx-api の rulebook で `info.version` と各操作の `responses` を必須構造に追加し、版の付け方・検証の手順・合意の当事者を定めた。ifx-api-sample を本部売上登録 API へ差し替え、ifx-index-sample の「本部への売上登録」から参照するようにした。

## 6. 関連ドキュメント

- `specdojo:ifx-api-rulebook`
- `specdojo:ifx-api-sample`
- `specdojo:ifx-msg-rulebook`
- `specdojo:ifx-msg-sample`
- `specdojo:ifx-index-sample`
