---
specdojo:
  id: prj-0001:xer-t-kata-review-all-uis-sample-140-20261125t043829z-63994b37
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-uis-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-uis-sample-140/T-KATA-REVIEW-ALL-uis-sample-140-20261125T043829Z-63994b37/plan.md
  started_at: "2026-11-25T04:38:39.131Z"
  completed_at: "2026-11-25T04:51:17.887Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:uis-sample
    - specdojo:uis-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `uis-sample` の事実 11 件を schema、rulebook、共通サンプル文脈、手計算と突き合わせた。誤りは見つからず、sample は変更していない（`changes` は空）。
- F001（minor/`vp-qe-verifiability`、現在庫数の更新契機）は前の段で解消済みだった。現在の版は、商品追加・数量変更・会計確定の在庫確認が成功したときに最新値へ更新し、通信失敗時は前の値を保持する、と書いている。バリデーションの在庫との相関やエラー表の通信失敗の行とも食い違わない。
- executor は成果物を変えていない。そのため Prettier、schema 検証、履歴リンク検査は `not_applicable` とした。runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`validate:schema` は passed。ほかの runner 検査は変更種別により `not_applicable`。

## 2. 変更ファイル

- なし

## 3. 申し送り

- R5 への追加の申し送りはない。executor の申し送り（rulebook 側の遷移例の呼び名の不一致）は、そのまま引き継ぐ。
- R4 確かめの結果: frontmatter（`type: ui`・`rulebook`・`status`・`part_of`・`based_on`）は deliverable-frontmatter.schema.yaml・common-frontmatter.schema.yaml・uis-rulebook.md と一致し、画面の識別子 `uis-sales-register`、未作成の遷移先のバッククォート表記、本文要件の 8 章の順、内税・合計・釣銭の計算値もすべて一致した。業務の値は正本のない仮定のため確かめの対象外。直しの差分はない。
- F001（minor/`vp-qe-verifiability`、現在庫数の更新契機）は前の段で直っていた。今の版は『商品追加・数量変更・会計確定の在庫確認の成功時に最新値へ更新。通信失敗時は前の値を保持』で、バリデーションの在庫との相関とエラー表の通信失敗の行とも食い違わない。
- R5 への申し送り候補: uis-rulebook.md の遷移の記述ガイドの良い例は `商品検索画面`、sample は `商品検索ダイアログ（uis-product-search）` で、呼び名がそろっていない。直すなら rulebook 側の例で、この段では直していない。
- 適用外の検証: `npx prettier --check docs/ja/specdojo/samples/uis-sample.md`（成果物を変えておらず、Prettier の適用条件（変更した md などのファイル）に当たらない）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがない）
- 適用外の検証: `npm run validate:history-links`（executor が変更した plan・result・個票がない）

## 4. 進め方と実践の型の適用

| 主張 | 突き合わせ先 | 結果 | | --- | --- | --- | | frontmatter の `type: ui`、`rulebook`、`status`、`part_of`、`based_on` | `deliverable-frontmatter.schema.yaml`、`common-frontmatter.schema.yaml`、`uis-rulebook.md` | 一致 | | 画面の識別子 `uis-sales-register` | `uis-rulebook.md` | 一致 | | 未作成の遷移先をバッククォートで表記すること | 共通規約 | 一致 | | 本文要件の 8 章の順 | `uis-rulebook.md` | 一致 | | 内税・合計・釣銭の計算値 | 手計算 | 一致 | | 現在庫数の更新契機（F001） | sample 本文とバリデーション・エラー表 | 前の段で解消済みで、食い違いなし | | 駄菓子屋の業務の値 | 正本なし（共通サンプル文脈の仮定） | 確かめの対象外 | 誤りがなかったため、sample は維持した。規範とのずれはなく、rulebook を正として直した箇所もない。確かめられずに残った主張もない。
