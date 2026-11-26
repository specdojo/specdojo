---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bps-sample-140-20261126t034236z-f42b3667
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bps-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bps-sample-140/T-KATA-REVIEW-ALL-bps-sample-140-20261126T034236Z-f42b3667/plan.md
  started_at: "2026-11-26T03:42:46.103Z"
  completed_at: "2026-11-26T03:49:07.996Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bps-sample
    - specdojo:bps-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）のレビューを実施した。bps-sample の主張を、schema、rulebook、CDFD 系 sample と突き合わせた。確かめの表は 10 行で、一致 7、不一致 1（直した）、確かめられない 2 だった。
- 不一致だったのは「出力」表の後続処理 ID `H-01` である。どこにも定義がなく、rulebook の ID 規則にも `T-`・`S-`・`E-` しかないため、「`P-01-01` 発注内容確定へ」に直した。
- 確かめられなかった 2 件は R5 への申し送りとした。内容は handoff を参照。
- 整形と markdownlint は executor が通した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通っている。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | docs/ja/specdojo/samples/bps-sample.md「出力」表の後続処理 | 後続処理の ID `H-01` は、sample 本文、rulebook、template、recipe、CDFD 系 sample のどこにも定義がない。rulebook の ID 規則も `T-`・`S-`・`E-` だけである。 | CDFD に存在する「`P-01-01` 発注内容確定へ」に直した。 | `cdfd-sample` の仕入計画（P-01）の表、bps-rulebook の「ファイル命名・ID規則」 | 直した |
| 2 | R4 正しさ | docs/ja/specdojo/samples/bps-sample.md「処理」の `S-02` と表の下の文 | `br-reorder-point` が補充必要数を判定するとしている。しかし `br-sample` は在庫不足かどうかの判定だけを行い、product ID の宣言がなく、発注量を対象外としている。 | - | `br-sample` | R5 へ申し送り |
| 3 | R4 正しさ | docs/ja/specdojo/samples/bps-sample.md「入力」「出力」表の「正本」列 | 補充依頼を「正本」列に置いている。しかし CDFD のデータストアの表に補充依頼はなく、データフローとして描かれている。rulebook は BPS だけでデータストアを足すことを禁じている。 | - | `cdfd-overview-sample` のデータストアの表、bps-rulebook の禁止事項 | R5 へ申し送り |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bps-sample.md`: 「出力」表の後続処理にあった未定義 ID `H-01` を、CDFD に存在する「`P-01-01` 発注内容確定へ」に直した。prettier により表の列幅も変わった。差分は 5 行追加・5 行削除。

## 3. 申し送り

- R5 への申し送り 1: 「処理」の `S-02` と表の下の文は、`br-reorder-point` が補充必要数を判定するとしている。一方 `br-sample` は不足の判定だけを行い、発注量を対象外としている。BPS の書き方を直すか、`br-sample` に product ID と補充必要数を足すかを R5 で決める。
- R5 への申し送り 2: 補充依頼は「入力」と「出力」の「正本」列に置かれている。しかし CDFD のデータストアの表に補充依頼はなく、データフローとして描かれている。rulebook は BPS だけでデータストアを足すことを禁じているため、「正本」列の扱いを CDFD と照らして R5 で判断する。
- R4 確かめの表: No 1 frontmatter の `type: flow` / 正本 `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` と rulebook の「推奨 Frontmatter 項目」 / 確かめ方 enum の読み取り / 結果 一致。No 2 `rulebook: specdojo:bps-rulebook` / 正本 `docs/ja/specdojo/rulebooks/bps-rulebook.md` の id / 結果 一致。No 3 ID の形式 `T-01`・`S-01`〜`S-04`・`E-01`〜`E-05` / 正本 rulebook の「ファイル命名・ID規則」 / 結果 一致。No 4 `P-05` 在庫確認・`P-06` 補充判断 / 正本 `cdfd-overview-sample` の在庫（P-05〜P-06）の表 / 結果 一致。No 5 `cdfd-inventory`・`cdfd-purchasing`・`cdfd-uc-replenishment` / 正本 `cdfd-overview-sample` と `cdfd-sample` / 結果 一致。No 6 `P-01-01` 発注内容確定 / 正本 `cdfd-sample` の仕入計画（P-01）の表 / 結果 一致。No 7 商品台帳（補充基準・発注単位）と在庫記録（現在庫） / 正本 `cdfd-overview-sample` のデータストアの表 / 結果 一致。No 8 「出力」の後続処理の `H-01` / 正本 sample 本文、rulebook、template、recipe、CDFD 系の sample / 確かめ方 grep / 結果 不一致（どこにも定義がなく、rulebook の ID 規則も `T-`・`S-`・`E-` だけ）。「`P-01-01` 発注内容確定へ」に直した。No 9 補充依頼を「入力」と「出力」の「正本」列に置いていること / 正本 `cdfd-overview-sample` のデータストアの表 / 結果 確かめられない（補充依頼はデータストアになく、データフローとして描かれている）。No 10 `br-reorder-point` が補充必要数を判定すること（「処理」の `S-02` と表の下の文） / 正本 `br-sample` / 結果 確かめられない（`br-sample` は在庫不足判定で product ID の宣言がなく、発注量を対象外としている）。
- 指摘（R5 へ申し送り）: bps-sample の「処理」は `br-reorder-point` が補充必要数を判定するとしているが、`br-sample` は不足かどうかの判定だけを行い、発注量を対象外としている。BPS の書き方を直すか、`br-sample` に product ID と補充必要数を足すかを R5 で決める。
- 指摘（R5 へ申し送り）: bps-sample は補充依頼を「入力」と「出力」の「正本」列に置いているが、CDFD のデータストアの表に補充依頼はない。rulebook の禁止事項は BPS だけでデータストアを足すことを禁じているので、「正本」列の扱いを R5 で CDFD と照らして判断する。

## 4. 進め方と実践の型の適用

R4 として、sample に書かれた事実（frontmatter の `type` と `rulebook`、ID の形式、CDFD のプロセス ID、データストア名、`P-01-01` の名称）を schema、rulebook、`cdfd-overview-sample`、`cdfd-sample` と照合した。誤りは未定義の `H-01` の 1 件で、これだけを最小の差分で直した。一致した記述は維持した。根拠が不足していて確認できなかった 2 件は、推測で改訂せず R5 へ申し送った。frontmatter の `status` は `draft` のまま据え置いた。
