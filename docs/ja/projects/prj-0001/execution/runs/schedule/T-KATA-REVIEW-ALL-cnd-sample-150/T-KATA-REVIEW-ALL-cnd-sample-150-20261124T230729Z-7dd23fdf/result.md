---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cnd-sample-150-20261124t230729z-7dd23fdf
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cnd-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cnd-sample-150/T-KATA-REVIEW-ALL-cnd-sample-150-20261124T230729Z-7dd23fdf/plan.md
  started_at: "2026-11-24T23:07:37.399Z"
  completed_at: "2026-11-24T23:15:21.334Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cnd-sample
    - specdojo:cnd-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `cnd-sample` を用語集と同じ系列の sample に照合し、2 か所を直した。
- Person の節の「来店客」を用語集の正式な語「顧客」にそろえた。
- 末尾の変更時の照合先にあった仮の名前 `cpd-kinuya-sales-service` を、実在する `cpd-sample` への wikilink に置き換えた。
- `depends_on`（`cxd-sample`）と本文・`based_on` の食い違いは相手側を直す案として handoff に残し、本段では直していない。
- `npx prettier --check`、`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` はすべて passed。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cnd-sample.md`: Person の節の「来店客」2 か所を用語集の「顧客」にした。末尾の変更時の照合先にあった仮名 `cpd-kinuya-sales-service` を `[[specdojo:cpd-sample|販売処理サービス C4コンポーネント図]]` に置き換えた。2 行の追加と 2 行の削除。

## 3. 申し送り

- R5 の指摘は executor の handoff（R5-1 から R5-3）にある。ここでは表を重ねず、要約だけを書く。
- 「要判断」は 2 件。1 件目は R5-1 で、「顧客」へ直すか、用語集 `tm-sales-customer` の `aliases` に「来店客」を足して本 sample を戻すかを決める。2 件目は R5-3 で、`dct-kata.yaml` の `depends_on` から `cxd-sample` を外すか、`cxd-sample` を本図と同じ構成で作り直して `based_on` に入れるかを決める。
- R5-2 は直し済みで、判断は要らない。
- R5-1: R5 / 3.2. Person（人・ロール） / 店頭で商品を受け取る人を「来店客」と書いており、用語集（`gl-sample.yaml` の `tm-sales-customer`）の正式な語「顧客」（別名は「お客さん」だけ）と食い違う / 「来店客」2 か所を「顧客」にした / `vp-qe-kata-conformance`（適用先の用語集との整合）。迷った理由: 同じ系列の `cxd-sample` やほかの sample（sf・nfr・bac など）も「来店客」を使っている。選ばなかった案: 用語集の `tm-sales-customer` の `aliases` に「来店客」を足し、本 sample を元の表記に戻す / 要判断
- R5-2: R5 / 5. メモ / 将来課題（末尾の変更時の照合先） / 下位のコンポーネント図を仮の名前 `cpd-kinuya-sales-service` で示しているが、本図を `based_on` にして販売処理サービスを分解した `specdojo:cpd-sample` が既にある / 仮の名前を `[[specdojo:cpd-sample|販売処理サービス C4コンポーネント図]]` に置き換えた / `vp-dev-change-impact`（変更の影響先を実在の文書で追える）。`cpd-sample` の frontmatter の `based_on` と概要が `specdojo:cnd-sample` を上位図として参照している / -
- R5-3: R5 / 1. 概要・frontmatter の `based_on` / 成果物カタログ（`docs/ja/projects/prj-0001/010-deliverables-catalog/dct-kata.yaml` の `cnd-sample`）は `depends_on: [cxd-sample]` とするが、sample の本文は `cxd-sample` を「別の学習用構成で、直接の設計根拠にはしない」と書き、`based_on` も空である。cnd-rulebook は `based_on` を `depends_on` の推移閉包にある上位コンテキスト図などの直接の根拠に限るとしている / - / `vp-qe-kata-conformance`（kata 相互）。相手側を直す案 A: `dct-kata.yaml` の `cnd-sample` の `depends_on` から `cxd-sample` を外す（または前後関係を示すだけの依存であると明記する）。案 B: `cxd-sample` の上位図を本図と同じタブレット画面の構成で作り直し、cnd-sample の `based_on` に入れる。型全体の構成に関わるため本段では直さない / 要判断

## 4. 進め方と実践の型の適用

根拠にした資料は、同じ接頭辞の sample、用語集（`gl-sample.yaml` の `tm-sales-customer`）、成果物カタログ（`dct-kata.yaml`）、cnd-rulebook の `based_on` の定義、`cpd-sample` の `based_on` と概要。用語の食い違いと実在する文書への参照は、sample の側を直した。カタログ側の `depends_on` と用語集の別名は、相手側を変更せず案として handoff に記録した。`based_on` は変更していない。rulebook を正とする構造は変えていない。成果物の `status` は `draft` のままにした。
