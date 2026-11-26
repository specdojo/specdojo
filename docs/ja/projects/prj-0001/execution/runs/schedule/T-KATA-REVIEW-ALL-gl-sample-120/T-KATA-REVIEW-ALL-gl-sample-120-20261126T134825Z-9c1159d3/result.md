---
specdojo:
  id: prj-0001:xer-t-kata-review-all-gl-sample-120-20261126t134825z-9c1159d3
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-gl-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-gl-sample-120/T-KATA-REVIEW-ALL-gl-sample-120-20261126T134825Z-9c1159d3/plan.md
  started_at: "2026-11-26T13:48:36.404Z"
  completed_at: "2026-11-26T13:55:57.235Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:gl-sample
    - specdojo:gl-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `docs/ja/specdojo/samples/gl-sample.yaml` の `terms` を、分類ごとにまとめ、各まとまりの先頭に分類の語を置く順へ並べ替えた。順はアクター、在庫、販売で、前提の語から結論の語へ読める。
- 各用語の内容は変えていない。executor は差分で増えた行と消えた行が一致することを確かめている。schema 検査、用語集の参照検査、Prettier は成功した。
- rulebook など sample 以外は変更していない。R2-2 は判断が分かれるため、要判断の印を付けて人に委ねる。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | docs/ja/specdojo/samples/gl-sample.yaml の `terms` 全体の並び | 分類に使う用語（`tm-inventory`・`tm-sales`・`tm-actor`）が末尾にあり、分類ごとのまとまりもなかった。そのため、在庫・販売の定義と注記が後ろで定義する「店主代表」「常連客」に頼り、発注点の注記も後ろの「定番商品」に頼っていて、前提から結論の順に読めなかった。 | 分類ごとにまとめ、分類の語を各まとまりの先頭に置いた。順は、アクター（アクター→店主代表→顧客→常連客）、在庫（在庫→定番商品→発注点→安全在庫→欠品）、販売（販売→つけ→つけ残高→つけ限度額）とした。各用語の内容は変えていない。 | `vp-arc-document-structure`、gl-rulebook の「分類・関連用語の判断」、実際の用語集（gl-quality.yaml・gl-register.yaml）で分類の語が所属する語より先に来る慣行 | - |
| R2-2 | R2 | docs/ja/specdojo/samples/gl-sample.yaml の `tm-sales-regular-customer` の `definition` と `notes` | 常連客の定義が、後ろの販売の分類で定義する「つけ」を先に使っている。 | - | `vp-arc-document-structure`。販売を先に置くと、つけの定義が後ろの常連客に頼る形になり、どちらの順でも参照は前後どちらかに向く。分類ごとにまとめる並びを優先して残した。販売をアクターより前に置く案は選ばなかった。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/gl-sample.yaml`: `terms` の並びを、分類ごとのまとまりに組み替えた。各まとまりの先頭に分類の語を置いた。順はアクター（アクター、店主代表、顧客、常連客）、在庫（在庫、定番商品、発注点、安全在庫、欠品）、販売（販売、つけ、つけ残高、つけ限度額）。用語の内容は変えていない。

## 3. 申し送り

- No: R2-1 / 段: R2 / 箇所: docs/ja/specdojo/samples/gl-sample.yaml の `terms` 全体の並び / 指摘: 分類に使う用語（`tm-inventory`・`tm-sales`・`tm-actor`）が末尾にあり、分類ごとのまとまりもなかった。そのため、在庫・販売の定義と注記が後ろで定義する「店主代表」「常連客」に頼り、発注点の注記も後ろの「定番商品」に頼っていて、前提から結論の順に読めなかった / 直した案: 分類ごとにまとめ、分類の語を各まとまりの先頭に置いた。順は、アクター（アクター→店主代表→顧客→常連客）、在庫（在庫→定番商品→発注点→安全在庫→欠品）、販売（販売→つけ→つけ残高→つけ限度額）とした。各用語の内容は変えていない（差分で増えた行と消えた行が一致することを確かめた） / 根拠: `vp-arc-document-structure`、gl-rulebook の「分類・関連用語の判断」、実際の用語集（gl-quality.yaml・gl-register.yaml）で分類の語が所属する語より先に来る慣行 / 印: -
- No: R2-2 / 段: R2 / 箇所: docs/ja/specdojo/samples/gl-sample.yaml の `tm-sales-regular-customer` の `definition` と `notes` / 指摘: 常連客の定義が、後ろの販売の分類で定義する「つけ」を先に使っている / 直した案: - / 根拠: `vp-arc-document-structure`。販売を先に置くと、つけの定義が後ろの常連客に頼る形になり、どちらの順でも参照は前後どちらかに向く。分類ごとにまとめる並びを優先して残した。販売をアクターより前に置く案は選ばなかった / 印: 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/gl-sample.yaml だけで、plan・result・個票を変更していないため）

## 4. 進め方と実践の型の適用

gl-sample を `vp-arc-document-structure`、gl-rulebook の「分類・関連用語の判断」、実際の用語集（gl-quality.yaml・gl-register.yaml）で分類の語が所属する語より先に来る慣行に照らして見直した。分類の語を先頭に置き、分類ごとにまとめる並びを採った。内容の記述は根拠と整合していたため維持した。`docs/specdojo/schemas/v1/gl.schema.yaml` による schema 検査は成功した。
