---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sld-sample-150-20261126t101230z-3d8c5884
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sld-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sld-sample-150/T-KATA-REVIEW-ALL-sld-sample-150-20261126T101230Z-3d8c5884/plan.md
  started_at: "2026-11-26T10:12:43.920Z"
  completed_at: "2026-11-26T10:20:17.420Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sld-sample
    - specdojo:sld-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `sld-sample` を、同じ接頭辞以外の参照先 sample、用語集、共通サンプル文脈と突き合わせ、sample 側で 3 か所を直した。
- 直した内容は、店番担当の定義範囲、店頭台帳保管棚の所在表記、確定前確認の照合範囲である。
- 参照先の sample 側を直すべき食い違いはなかった。
- plan に展開された F001〜F004 は前の段で解消済みであることを本文で確かめた。F005 は運用性の観点で、kata レビューで使わない観点のため扱わなかった。
- 検証は、executor の prettier が成功し、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も成功した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 概要 / 店番担当の定義 | 店番担当の定義が「その日にレジに立って最初に対処する人」だけで、誰が担うかが `stsd-sample`（店主代表または家族利用者代表）と `cdfd-overview-sample`（家族利用者代表が店番業務を担う）の範囲と結び付いていない。 | 「店主代表または家族利用者代表のうち、その日にレジに立って店頭で最初に対処する人」に直した。 | vp-qe-kata-conformance（`specdojo:stsd-sample` の「目的」、`specdojo:cdfd-overview-sample` の前提） | - |
| R5-2 | R5 | 保管場所一覧（店舗内・母屋の物理保管場所） / 店頭台帳保管棚 | `cdfd-overview-sample` は現行の台帳の保管先を「レジ横のノート」とするが、sample の店頭台帳保管棚は「施錠キャビネット」とだけ書き、位置が対応しない。 | 保管場所名を「店頭台帳保管棚（レジ横の施錠キャビネット）」にした。CDFD 側を「施錠キャビネット」に書き換える案は CDFD の現行描写を変えるため選ばなかった。 | vp-qe-kata-conformance（`specdojo:cdfd-overview-sample` のデータストアの章「現行の保管先はレジ横のノート」） | 要判断 |
| R5-3 | R5 | 本書を確定する前の確認 | 対応表の CDFD 行は顧客台帳・つけ台帳（常連客ノート）を対応づけているが、確認手順は全体概要から仕入記録・在庫記録しか照合しておらず、CDFD の 8 データストアのうち 2 つが照合から外れる。 | 手順を「全体概要の仕入記録・在庫記録・顧客台帳・つけ台帳」にした。 | vp-qe-kata-conformance、vp-dev-change-impact（`specdojo:cdfd-overview-sample` のマスタ・トランザクションデータ表） | - |
| R5-4 | R5 | grade の finding（F001〜F005） | F002（STSD の `sold`）と F003（検品場所の管理区分の分割）は前の段で直り済みである。F001（第5章の再掲）と F004（担当表記）は R3 の段で直り済みである。F005（取引セッションの消失・破損時の対処）は `vp-ops-operability` の指摘で、kata レビューで使わない観点のため、この段では扱わない。 | - | kata-guide の「kata の観点の組」 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sld-sample.md`: 店番担当の定義を「店主代表または家族利用者代表のうち、その日にレジに立って店頭で最初に対処する人」にし、`stsd-sample` と `cdfd-overview-sample` の範囲に合わせた。保管場所名を「店頭台帳保管棚（レジ横の施錠キャビネット）」にし、`cdfd-overview-sample` のレジ横のノートの位置と対応させた。確定前の確認手順の照合対象を、仕入記録・在庫記録に加えて顧客台帳・つけ台帳にし、対応表の CDFD 行と揃えた。

## 3. 申し送り

- F005（取引セッションの消失・破損時の対処）は、`kata-guide` の「kata の観点の組」が kata レビューで使わない観点としているため、この段では未対応である。扱う場合は運用性を見る段で検討する必要がある。
- R5-2 の「店頭台帳保管棚」の位置は、sample 側を「施錠キャビネット」に加えて「レジ横」と書く形にした。CDFD 側を書き換える案は CDFD の現行描写を変えるため選んでいない。採否は人の判断に委ねる。
- R5-1: R5 / 概要 / 店番担当の定義が「その日にレジに立って最初に対処する人」だけで、誰が担うかが stsd-sample（店番担当＝店主代表または家族利用者代表）と cdfd-overview-sample（家族利用者代表が店番業務を担う）の範囲と結び付いていない / 「店主代表または家族利用者代表のうち、その日にレジに立って店頭で最初に対処する人」に直した / vp-qe-kata-conformance（specdojo:stsd-sample の「目的」、specdojo:cdfd-overview-sample の前提） / -
- R5-2: R5 / 保管場所一覧（店舗内・母屋の物理保管場所）/ cdfd-overview-sample は現行の台帳の保管先を「レジ横のノート」とするが、sample の店頭台帳保管棚は「施錠キャビネット」とだけ書き、位置が対応しない / 保管場所名を「店頭台帳保管棚（レジ横の施錠キャビネット）」にした / vp-qe-kata-conformance（specdojo:cdfd-overview-sample のデータストアの章「現行の保管先はレジ横のノート」）。施錠と所在の両方を保つ最小の直しを選び、CDFD 側を「施錠キャビネット」に書き換える案は CDFD の現行描写を変えるため選ばなかった / 要判断
- R5-3: R5 / 本書を確定する前の確認 / 対応表の CDFD 行は顧客台帳・つけ台帳（常連客ノート）を対応づけているが、確認手順は全体概要から仕入記録・在庫記録しか照合しておらず、CDFD の 8 データストアのうち 2 つが照合から外れる / 手順を「全体概要の仕入記録・在庫記録・顧客台帳・つけ台帳」にした / vp-qe-kata-conformance、vp-dev-change-impact（specdojo:cdfd-overview-sample のマスタ・トランザクションデータ表） / -
- R5-4: R5 / grade の finding / F002（STSD の sold）と F003（検品場所の管理区分の分割）は前の段で直り済み、F001（第5章の再掲）・F004（担当表記）は R3 の段で直り済みであることを本文で確かめた。F005（取引セッションの消失・破損時の対処）は vp-ops-operability の指摘で、kata-guide の「kata の観点の組」が kata レビューで使わない観点としているためこの段では扱わない / - / kata-guide の「kata の観点の組」 / -
- 適用外の検証: `npm run lint:md`（pipeline の parent validation として親 runner が実行するため executor では実行しない）

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample に切り替え、`stsd-sample`、`cdfd-overview-sample` と、用語集・共通サンプル文脈を読んで食い違いを確かめた。食い違いは sample 側の最小の差分で直した。相手側を直すべき点はなかった。前の段で直った指摘は繰り返していない。`status` は据え置いた。
