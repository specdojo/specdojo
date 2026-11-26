---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-index-sample-140-20261126t040556z-1376d22e
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-index-sample-140/T-KATA-REVIEW-ALL-ifx-index-sample-140-20261126T040556Z-1376d22e/plan.md
  started_at: "2026-11-26T04:06:05.959Z"
  completed_at: "2026-11-26T04:13:05.265Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-index-sample
    - specdojo:ifx-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、`ifx-index-sample.yaml` に書かれた事実 12 件を schema、`ifx-api-sample`、`ifx-cmd-sample`、`clis-sample`、`pm-members-sample` と突き合わせた。11 件は一致し、1 件（No 9）は確かめられなかった。
- 誤りは見つからなかったため、sample は編集していない（`changes` は空）。
- schema 検査（`ifx-index.schema.yaml`）は valid。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`validate:schema` は passed。その他は変更種別により `not_applicable`。
- grade 由来の F001（`vp-qe-kata-conformance`）は R4 の観点ではないため、この段では扱っていない。型どうしの整合を見る段に任せる。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 | docs/ja/specdojo/samples/ifx-index-sample.yaml 56 行（`_UNDECIDED_`） | index の `_UNDECIDED_` は「結果不明時の受付照会と保存失敗後の回復方式が未決」と書いている。一方、詳細契約 `specdojo:ifx-api-sample` の未決（4〜8 行・22 行）は受付照会と税区分などの送信だけで、保存失敗後の回復は載っていない。clis-sample の 124 行には載っている。正本どうしで未決の範囲が食い違っている。 | ARC が DEV と決める。`ifx-api-sample` の未決に保存失敗後の回復を足すか、409 による回復で決着済みとして index と clis の記述から外す。 | `ifx-index-sample.yaml` 56 行、`ifx-api-sample` の 4〜8 行と 22 行、`clis-sample` の 124 行の突き合わせ。 | minor |

## 2. 変更ファイル

- なし

## 3. 申し送り

- 確かめの表は executor の最終応答にあり、evidence には要約（11 件一致・1 件未確認）だけが残っている。
- [R4/minor] ifx-index-sample.yaml の 56 行の `_UNDECIDED_` は「結果不明時の受付照会と保存失敗後の回復方式が未決」と書いている。一方、詳細契約 specdojo:ifx-api-sample の未決（4〜8 行・22 行）は受付照会と税区分などの送信だけで、保存失敗後の回復は載っていない（clis-sample の 124 行には載っている）。正本どうしで未決の範囲が食い違うため、R4 では推測で直さず残した。次のアクション: ifx-api-sample の未決に保存失敗後の回復を足すか、409 による回復で決着済みとして index と clis の記述から外すかを、ARC が DEV と決める。
- F001（`vp-qe-kata-conformance`、57 行の `spec_ref` と clis-sample の `ifx-api-kinuya-sales.yaml` 参照の食い違い）は R4 の観点ではないため扱っていない。型どうしの整合を見る段で扱う。

## 4. 進め方と実践の型の適用

sample メンテナンスの R4 として、sample の事実を schema と関連 sample に照合した。照合の結果、誤りがないため維持した。残った未決の食い違いは推測で直さず、finding として申し送った。F001 は R4 の観点外のため未対応で、後続の段に任せる。
