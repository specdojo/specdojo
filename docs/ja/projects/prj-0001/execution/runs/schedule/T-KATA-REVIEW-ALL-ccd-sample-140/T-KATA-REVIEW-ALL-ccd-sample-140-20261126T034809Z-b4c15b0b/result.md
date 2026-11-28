---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ccd-sample-140-20261126t034809z-b4c15b0b
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ccd-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ccd-sample-140/T-KATA-REVIEW-ALL-ccd-sample-140-20261126T034809Z-b4c15b0b/plan.md
  started_at: "2026-11-26T03:48:19.223Z"
  completed_at: "2026-11-26T03:55:15.682Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:ccd-sample
    - specdojo:ccd-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として、ccd-sample の主張 14 件を schema、辞書、rulebook と突き合わせた。一致は 12 件、不一致を直したものは 1 件、未確認は 1 件だった。
- 不一致は「図だけでは表せない整合性条件」にあった。商品と顧客の両方が登録済みであることを条件と言い切っていたが、`specdojo:bdd-sample` は顧客台帳を対象外としており、本書の「未解決事項」も顧客の参照先の存在条件を未照合としている。このため商品だけを言い切りに残し、顧客の存在条件は「未解決事項」で扱う形に直した。
- 一致した主張は次のとおり。`product_id`、`sale_id`、`sale_id` と `line_number` の複合キー、`customer_id` の各キーと説明。売上明細の多重度 `1..*`。顧客台帳が既存辞書の対象外であること。rulebook の PK の書き方と `based_on` の規約。`specdojo:bdd-customer` がまだ存在しないこと。
- 未確認は Mermaid の描画 1 件で、親 runner の `npm run lint:mermaid` が通ったことで確かめた。
- F001 と F002 は、前の段の版で Frontmatter にすでに `based_on: [specdojo:bdd-sample]` があり、未作成の `specdojo:bdd-customer` も含まれていない。このため解消済みと判断し、追加の変更はしていない。
- 検証では `npx prettier --check`、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | docs/ja/specdojo/samples/ccd-sample.md「図だけでは表せない整合性条件」 | 商品と顧客の両方を登録済みが条件と言い切っていた。`specdojo:bdd-sample` は顧客台帳を対象外としており、本書の「未解決事項」も顧客の参照先の存在条件を未照合としているため、記述が矛盾していた。 | 商品だけを言い切りに残し、顧客の存在条件は「未解決事項」で扱う形に直した。 | `specdojo:bdd-sample` の対象範囲（顧客台帳は対象外）と、本書「未解決事項」の顧客台帳との照合の記述。 | minor/vp-qe-verifiability |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ccd-sample.md`: 「図だけでは表せない整合性条件」を 1 行修正した。商品と顧客の両方を登録済みが条件と言い切っていた記述を、商品だけの条件に改めた。顧客の存在条件は「未解決事項」で扱う。

## 3. 申し送り

- R4 指摘（minor/vp-qe-verifiability）: 「図だけでは表せない整合性条件」で、商品と顧客の両方を登録済みが条件と言い切っていた。specdojo:bdd-sample では顧客台帳が対象外で、本書の「未解決事項」も顧客の参照先の存在条件を未照合としている。商品だけを言い切りに残し、顧客の存在条件は「未解決事項」で扱うと直した。
- F001・F002（`based_on` に specdojo:bdd-sample を記録する）は、前の段の版で Frontmatter に `based_on: [specdojo:bdd-sample]` がすでにあり、未作成の `specdojo:bdd-customer` も含まれていないため解消済み。追加の変更はしていない。
- 確かめの表（主張 14 件）: 一致 12 件、不一致を直したもの 1 件、未確認 1 件。主な一致は、`product_id`・`sale_id`・`sale_id`+`line_number`・`customer_id` のキーと説明、売上明細の `1..*`、顧客台帳が既存辞書の対象外であること（bdd-sample.yaml）、rulebook の PK の書き方と `based_on` の規約（ccd-mermaid-rulebook.md）、`specdojo:bdd-customer` がまだないこと（grep）。未確認は Mermaid の描画で、親 runner の `npm run lint:mermaid` で確かめる。
- 適用外の検証: `npm run validate:history-links`（executor が変更したのは docs/ja/specdojo/samples/ccd-sample.md だけで、plan・result・個票などの履歴蓄積ファイルを変更していない）

## 4. 進め方と実践の型の適用

sample メンテナンスの R4 として、sample 中の事実の主張を `specdojo:bdd-sample`（業務データ辞書）、`ccd-mermaid-rulebook` の規約、リポジトリ内の検索結果と突き合わせた。根拠のない言い切りだけを直し、一致した記述は維持した。plan の F001・F002 は Frontmatter の `based_on` で解消済みであることを確認した。確証が得られた範囲だけを改訂し、顧客辞書は未作成のため推測で補っていない。
