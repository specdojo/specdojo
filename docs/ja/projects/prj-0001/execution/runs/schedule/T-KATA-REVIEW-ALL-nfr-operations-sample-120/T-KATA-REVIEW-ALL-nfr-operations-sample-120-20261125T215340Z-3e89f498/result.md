---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-operations-sample-120-20261125t215340z-3e89f498
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-operations-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-operations-sample-120/T-KATA-REVIEW-ALL-nfr-operations-sample-120-20261125T215340Z-3e89f498/plan.md
  started_at: "2026-11-25T21:53:50.735Z"
  completed_at: "2026-11-25T22:01:42.179Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-operations-sample
    - specdojo:nfr-operations-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を実施した。章の順・章の名前・表と本文の置き場所は rulebook の「本文要件」「記述ガイド」と一致していて、章の移動・分割・統合は不要だった。
- 「運用要件一覧」の表の前の 1 文が、暫定の扱いの置き場所を実態と違う形で説明していた。この 1 文だけを直した。
- grade の F001・F002・F004 は R2 の観点ではないため扱っていない。F003 は rulebook 側の修正案を残し、sample は変更していない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 3. 運用要件一覧 / 表の前の 1 文 | 基準が `_UNDECIDED_` の要件はどれも「測定・検証方法」の暫定の扱いで判定する、と読める。実際は `nfr-ops-009` の暫定の基準が基準の欄にあり、`nfr-ops-003` だけが「測定・検証方法」の未達のときの扱いにある。暫定の扱いの置き場所の説明が表の配置と合わない。 | 「暫定の基準があれば基準の欄に併記し、ない要件は決まるまで「測定・検証方法」の未達のときの扱いに従う」に直した。 | `vp-arc-document-structure`、`vp-qe-omissions-consistency` | - |
| R2-2 | R2 | 全章 | 章の順・章の名前・必須の 5 章は rulebook「本文要件」の表と一致する。2 章の範囲の表と段階の表、4 章の表の後の判定記録と見直しの契機の箇条書きも、rulebook「記述ガイド」の求めの順に並んでいる。5 章の行の順（判定先、方針、手順）も表の前の文と判断基準に合う。template は `undecided` のため照合していない。 | - | `vp-arc-document-structure` | - |
| R2-3 | R2 | 3. 運用要件一覧（grade F003） | rulebook 第 1 章の `_UNDECIDED_` が「sample は「本文要件」の 5 章に揃っていない」と書いており、5 章にそろった今の sample と食い違う。sample 側は直さない。 | 相手側の `specdojo:nfr-operations-rulebook` の「全体方針」の最後の箇条書きから「sample は「本文要件」の 5 章に揃っていないため、sample を揃えることと、」を削り、「同じ構成を NFR 分冊で共通の template にできるかの判断を、本書を `ready` にする前提条件とする。」だけを残す案。kata 相互の整合は R1・R5 の観点のため、ここでは案だけを残す。 | `vp-qe-kata-conformance` | 要判断（R2 の構成とも R5 の整合とも取れるため。R5 に任せる案は選ばず、案だけを残した） |
| R2-4 | R2 | 2. 適用範囲・体制前提、3. 運用要件一覧（grade F001・F002・F004） | F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata のレビューでは使わないと外されている。F002（`vp-qe-verifiability`）は R4 の観点。どれも R2 では扱わない。 | - | kata-guide「kata の観点の組」 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-operations-sample.md`: 「運用要件一覧」の表の前の 1 文を直した。暫定の基準があれば基準の欄に併記し、ない要件は決まるまで「測定・検証方法」の未達のときの扱いに従う、という説明にした。`nfr-ops-009` と `nfr-ops-003` の表の配置と一致する。

## 3. 申し送り

- `npx prettier --check` は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。その他の検査は変更種別により `not_applicable` だった。
- grade F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata のレビューに使わない観点として外されている。F002（`vp-qe-verifiability`）は R4 の観点である。いずれも R2 の対象ではなく、該当する段に任せる。
- template は `undecided` のため、R2 では照合していない。
- R2-1: R2 / 3. 運用要件一覧 / 表の前の 1 文が、基準が `_UNDECIDED_` の要件はどれも「測定・検証方法」の暫定の扱いで判定する、と読める。実際は `nfr-ops-009` の暫定の基準が基準の欄にあり、`nfr-ops-003` の扱いだけが「測定・検証方法」の未達のときの扱いにあって、暫定の扱いの置き場所の説明が表の配置と合わない / 「暫定の基準があれば基準の欄に併記し、ない要件は決まるまで「測定・検証方法」の未達のときの扱いに従う」に直した / `vp-arc-document-structure`、`vp-qe-omissions-consistency` / -
- R2-2: R2 / 全章 / 章の順・章の名前・必須の 5 章は rulebook「本文要件」の表と一致する。2 章の範囲の表と段階の表、4 章の表の後の判定記録と見直しの契機の箇条書きも、rulebook「記述ガイド」の求めの順に並んでいる。5 章の行の順（判定先 → 方針 → 手順）も表の前の文と判断基準に合う。template は `undecided` のため照合していない / - / `vp-arc-document-structure` / -
- R2-3: R2 / 3. 運用要件一覧（grade F003） / rulebook 第 1 章の `_UNDECIDED_` が「sample は「本文要件」の 5 章に揃っていない」と書いており、5 章にそろった今の sample と食い違う。sample 側は直さない / - / `vp-qe-kata-conformance`。相手側の `specdojo:nfr-operations-rulebook` の「全体方針」の最後の箇条書きから「sample は「本文要件」の 5 章に揃っていないため、sample を揃えることと、」を削り、「同じ構成を NFR 分冊で共通の template にできるかの判断を、本書を `ready` にする前提条件とする。」だけを残す案。kata 相互の整合は R1・R5 の観点のため、ここでは案だけを残す / 要判断（R2 の構成とも R5 の整合とも取れるため。R5 に任せる案は選ばず、案だけを残した）
- R2-4: R2 / 2. 適用範囲・体制前提、3. 運用要件一覧（grade F001・F002・F004） / F001（`vp-po-decision-readiness`）と F004（`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata のレビューでは使わないと外されている。F002（`vp-qe-verifiability`）は R4 の観点。どれも R2 では扱わない / - / kata-guide「kata の観点の組」 / -

## 4. 進め方と実践の型の適用

sample-maintenance の R2（構成）として、R1 が直した版を読み、rulebook の「本文要件」「記述ガイド」と章の順・粒度・表と本文の配置を照合した。ずれは表の前の 1 文だけだったので、その 1 文を直した。rulebook など sample 以外は変更していない。grade F001・F002・F004 は R2 の観点に当たらず、F003 は rulebook 側の修正であるため、sample では未対応のまま申し送った。
