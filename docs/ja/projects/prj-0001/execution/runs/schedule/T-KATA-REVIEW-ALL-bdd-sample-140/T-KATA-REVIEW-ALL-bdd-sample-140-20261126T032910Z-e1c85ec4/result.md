---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bdd-sample-140-20261126t032910z-e1c85ec4
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bdd-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bdd-sample-140/T-KATA-REVIEW-ALL-bdd-sample-140-20261126T032910Z-e1c85ec4/plan.md
  started_at: "2026-11-26T03:29:21.425Z"
  completed_at: "2026-11-26T03:32:50.758Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:bdd-sample
    - specdojo:bdd-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として bdd-sample.yaml の事実の主張を、schema と参照先の sample に突き合わせた。誤りは 1 件で、商品 description にある用語集への wikilink の表示名を直した。
- ほかの主張は、確かめの対象外とした駄菓子屋の業務の値を除き、正本と一致した。schema 検査と prettier 検査は通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | entities 商品 description（15 行目） | 用語集への wikilink の表示名「用語集 在庫・調達」が、参照先 `specdojo:gl-sample` の title「用語集（駄菓子屋きぬやの販売・在庫・つけ管理）」と合わない。参照先に「調達」という語はない。 | 表示名を参照先の title に合わせた。 | vp-qe-verifiability（gl-sample.yaml の 5 行目） | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bdd-sample.yaml`: entities の商品 description（15 行目）にある用語集への wikilink の表示名を「用語集 在庫・調達」から、参照先 `specdojo:gl-sample` の title に合わせた表示名へ直した。差分は 1 行。

## 3. 申し送り

- R4-1: R4 / entities 商品 description（15 行目） / 用語集への wikilink の表示名「用語集 在庫・調達」が、参照先 specdojo:gl-sample の title「用語集（駄菓子屋きぬやの販売・在庫・つけ管理）」と合わない（参照先に「調達」という語はない） / 表示名を参照先の title に合わせた / vp-qe-verifiability（gl-sample.yaml の 5 行目） / -

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実を schema（`bdd.schema.yaml`）と参照先の sample に突き合わせた。誤りは参照先の title と合わない表示名 1 件で、これを直した。ほかは維持した。rulebook を正とする矛盾や根拠不足による見送りは、evidence に記録がない。
