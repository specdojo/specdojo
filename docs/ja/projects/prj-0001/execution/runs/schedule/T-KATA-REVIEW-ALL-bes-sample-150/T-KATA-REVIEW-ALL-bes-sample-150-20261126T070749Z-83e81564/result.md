---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bes-sample-150-20261126t070749z-83e81564
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bes-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bes-sample-150/T-KATA-REVIEW-ALL-bes-sample-150-20261126T070749Z-83e81564/plan.md
  started_at: "2026-11-26T07:08:00.117Z"
  completed_at: "2026-11-26T07:18:00.774Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bes-sample
    - specdojo:bes-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）として、`docs/ja/specdojo/samples/bes-sample.md` を同じ系列の sample（`bes-index-sample`、`bdd-sample`）と突き合わせて直した。
- データモデルの仮置き参照を既存の `specdojo:bdd-sample` への wikilink に置き換え、項目の対応（取引番号は売上ID、会計確定時点は売上日時、請求金額は合計金額、支払区分は支払方法、商品明細は売上明細）を示した。
- 状態定義の仮置き ID を `cdsd-order-status` から `stsd-order-status` に改めた。`cdsd` は概念データストア定義の接頭辞で、状態定義は `stsd` であるため。
- `_UNDECIDED_` の段落は、未照合の範囲だけに書き直した。
- frontmatter の `based_on` に `specdojo:bes-index-sample` と `specdojo:bdd-sample` を入れた。
- 相手側の文書を直すべき点は変更せず、直す案を handoff と findings に残した。
- executor の `prettier` と `markdownlint-cli2` は通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。他の検査は変更種別により `not_applicable` だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 5. 事実データ / データモデル | データモデルを仮置き ID `bdd-sales-record` としていたが、`specdojo:bdd-sample` が既にあり、売上記録が会計の確定を定義している。 | `specdojo:bdd-sample` の売上記録・売上明細への wikilink に置き換えた。項目の対応は、取引番号が売上ID、会計確定時点が売上日時、請求金額が合計金額、支払区分が支払方法、商品明細が売上明細である。 | `vp-qe-kata-conformance`、`bdd-sample.yaml` の売上記録の説明 | - |
| R5-2 | R5 | 4. 発生条件 / 条件 1 | 状態定義の仮置き ID が `cdsd-order-status` だった。`cdsd` は概念データストア定義の接頭辞で、状態定義は `stsd` である。 | `stsd-order-status` に改め、未決事項の段落も同じ ID にそろえた。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`、rulebooks の接頭辞一覧 | - |
| R5-3 | R5 | 5. 事実データ / `_UNDECIDED_` | 状態定義とデータモデルの両方を未作成としていたが、データモデルは `bdd-sample` があるため事実と食い違っていた。 | 未照合の範囲だけに書き直した。受領金額・釣銭金額・確定担当が辞書にないことと、`stsd-order-status` が未作成で状態値を照合できないことである。 | `vp-qe-kata-conformance` | - |
| R5-4 | R5 | frontmatter | 本文で `bes-index-sample` の行を詳細化し、`bdd-sample` を参照しているのに `based_on` が空だった。 | `based_on` に `specdojo:bes-index-sample` と `specdojo:bdd-sample` を入れた。 | document-metadata-standard の `based_on`（作成時に直接の根拠とした文書） | 要判断（`bdd-sample` が作成時の根拠と言えるか迷った。選ばなかった案は `bes-index-sample` だけを入れる案） |
| R5-5 | R5 | 5. 事実データ | 受領金額・釣銭金額・確定担当に当たる項目が `bdd-sample` の売上記録にない。 | 本書は変更していない。相手側の `docs/ja/specdojo/samples/bdd-sample.yaml` に、受領金額（預かり金額）・釣銭金額・確定担当を足す案と、事実データからこの 3 項目を外す案がある。 | `vp-qe-kata-conformance` | 要判断（BES と辞書のどちらに合わせるかは業務の判断で、agent では決められない） |
| R5-6 | R5 | 5. 事実データ | `bes-index-sample` の事実データの列と本書は `支払区分`、`bdd-sample` は `支払方法` と書いていて、表記がそろっていない。 | 一覧との一致を保つため、本書の語は変えていない。相手側の `docs/ja/specdojo/samples/bes-index-sample.md` と `bdd-sample` のどちらの表記に合わせるかを決め、そろえたら本書の表も直す。 | `vp-qe-kata-conformance` | 要判断 |
| R5-7 | R5 | 全体 | 用語集の sample（`gl-sample.yaml`）に、店番担当・会計確定・釣銭・受領金額がない。`clis-sample` では受領金額に当たる語が預かり金額になっている。 | 本書は変更していない。相手側の `docs/ja/specdojo/samples/gl-sample.yaml` に店番担当・会計確定・釣銭を足し、受領金額と預かり金額のどちらを正の語にするか決める。プランが指す `docs/ja/product/010-business-specs/060-glossary/` は SpecDojo 製品の用語で、駄菓子屋の語との食い違いはない。 | `vp-qe-kata-conformance` | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bes-sample.md`: frontmatter の `based_on` に `specdojo:bes-index-sample` と `specdojo:bdd-sample` を追加した。「発生条件」の状態定義の仮置き ID を `stsd-order-status` に修正した。「事実データ」ではデータモデルの参照を `bdd-sample` への wikilink に替え、項目の対応を追記した。`_UNDECIDED_` の段落は未照合の範囲に限って書き直した。

## 3. 申し送り

- R5-5 と R5-6 と R5-7 は相手側文書の修正案である。本タスクでは相手側を変更していない。いずれも人の判断を要する。
- grade finding のうち F001・F003・F004・F006・F009・F012・F013 は R5 の観点ではないため扱っていない。F002・F011 は Sample 記述標準が本文に承認者を書くことを認めていないため、本文を直していない。
- R5-1: R5 / 5. 事実データ / データモデルを「仮置き ID `bdd-sales-record`」としていたが、`specdojo:bdd-sample` が既にあり、売上記録（`sale`）が会計の確定を定義している / [[specdojo:bdd-sample|業務データ辞書（駄菓子屋の販売管理）]] の売上記録・売上明細への wikilink に置き換え、取引番号→売上ID、会計確定時点→売上日時、請求金額→合計金額、支払区分→支払方法、商品明細→売上明細の対応を 1 文で書いた / `vp-qe-kata-conformance`（適用先）、`bdd-sample.yaml` の売上記録の説明（一回の店頭販売で確定した会計の管理単位）/ -
- R5-2: R5 / 4. 発生条件 / 条件 1 の状態定義の仮置き ID が `cdsd-order-status` だったが、`cdsd` は概念データストア定義（`cdsd-rulebook`）の接頭辞で、状態定義の接頭辞は `stsd`（`stsd-rulebook`）である / 「状態定義の仮置き ID `stsd-order-status`」にし、未決事項の段落も同じ ID にそろえた / `vp-qe-kata-conformance`、`vp-dev-change-impact`、rulebooks の接頭辞一覧 / -
- R5-3: R5 / 5. 事実データ / `_UNDECIDED_` の段落が状態定義・データモデルの両方を未作成としていたが、データモデルは bdd-sample があるため事実と食い違っていた / まだ照合できていない範囲（受領金額・釣銭金額・確定担当が辞書にないこと、`stsd-order-status` が未作成で状態値を照合できないこと）だけに書き直した / `vp-qe-kata-conformance` / -
- R5-4: R5 / frontmatter / 本文で bes-index-sample の行を詳細化し bdd-sample を参照しているのに、`based_on` が空だった / `based_on` に `specdojo:bes-index-sample` と `specdojo:bdd-sample` を入れた / document-metadata-standard の `based_on`（作成時に直接の根拠とした文書）/ 要判断（bdd-sample はこの段で参照を足した文書で、作成時の根拠と言えるかに迷った。選ばなかった案は bes-index-sample だけを入れる案）
- R5-5: R5 / 5. 事実データ / 本書の受領金額・釣銭金額・確定担当に当たる項目が bdd-sample の売上記録にない / - / 相手側の文書 `docs/ja/specdojo/samples/bdd-sample.yaml` を直す案: 売上記録に受領金額（預かり金額）・釣銭金額・確定担当を足すか、事実データからこの 3 項目を外すかを決める。`vp-qe-kata-conformance` / 要判断（BES と辞書のどちらに合わせるかは業務の判断で、agent では決められない）
- R5-6: R5 / 5. 事実データ / bes-index-sample の事実データの列とこの sample は `支払区分`、bdd-sample は `支払方法` と書いていて、表記が揃っていない / -（一覧との一致を保つため sample 側の語は変えなかった）/ 相手側の文書 `docs/ja/specdojo/samples/bes-index-sample.md` と bdd-sample のどちらの表記に合わせるかを決め、揃えたら本書の表も直す。`vp-qe-kata-conformance`、W8 / 要判断
- R5-7: R5 / 全体 / 用語集の sample（`gl-sample.yaml`）に、本書の中心の語である店番担当・会計確定・釣銭・受領金額がない。受領金額は clis-sample では預かり金額と書かれている / - / 相手側の文書 `docs/ja/specdojo/samples/gl-sample.yaml` に店番担当（店主代表と家族利用者代表の総称）・会計確定・釣銭を足し、受領金額と預かり金額のどちらを正の語にするか決める。プランが指す `docs/ja/product/010-business-specs/060-glossary/` は SpecDojo 製品の用語で、駄菓子屋の語との食い違いはない / -
- R5-8: R5 / grade finding の扱い / F005・F007・F008（確定が不明な場面）と F010（br-sample を参照していた件）は前の段までで直っており、R5 で見ても残りはない。F002・F011（承認者を本文に書く）は Sample 記述標準の、本文に承認者や承認の範囲を書かない決まりと矛盾するため、本文は直さない。承認は登録簿の個票で追う。F001・F003・F004・F006・F009・F012・F013 は kata-guide の「kata の観点の組」でこの段のレビューに使わない観点（decision-readiness、pm、ba、ops）なので扱わない / - / kata-guide の「kata を agent でレビューする」、sample-authoring-standard の記述ルール / -

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」の R5（整合）に従い、同じ接頭辞の sample、wikilink と `based_on` の参照先、共通サンプル文脈を突き合わせた。sample 側の食い違いだけを直し、相手側は直す案を残した。F005・F007・F008・F010 は前の段までで解消済みで、R5 で新たに直す点はなかった。承認者を本文に書く F002・F011 は、Sample 記述標準の記述ルールと矛盾するため見送った。承認は登録簿の個票で追う。F001・F003・F004・F006・F009・F012・F013 は decision-readiness、pm、ba、ops の観点で、この段では使わない。
