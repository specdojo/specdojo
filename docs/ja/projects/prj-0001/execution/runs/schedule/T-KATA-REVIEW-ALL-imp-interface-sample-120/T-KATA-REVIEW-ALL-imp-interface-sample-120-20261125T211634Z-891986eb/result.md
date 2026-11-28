---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-interface-sample-120-20261125t211634z-891986eb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-interface-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-interface-sample-120/T-KATA-REVIEW-ALL-imp-interface-sample-120-20261125T211634Z-891986eb/plan.md
  started_at: "2026-11-25T21:16:44.739Z"
  completed_at: "2026-11-25T21:23:05.810Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-interface-sample
    - specdojo:imp-interface-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）を実施した。章の順と必須の列は rulebook の本文要件と一致していた。
- 高影響 2 件の並びが食い違っていた。本文と「対応方針」の表は売上登録が先なのに、「影響分析サマリ」の「主な影響対象I/F」と「影響詳細一覧」の行は商品照会が先だった。これを売上登録→商品照会の順にそろえた。
- 展開された grade の F001（`based_on` が個票 ID の形式でなく `cr-2026-004`）は `vp-qe-kata-conformance` の観点で、R2 の観点ではない。そのため R2 では扱わず、R1/R5 に任せた。
- runner の検証は、lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema が passed だった。executor の prettier も passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 3. 影響分析サマリ・4. 影響詳細一覧 | 本文は本部への売上登録の調整を先に始めるとし、「対応方針」の表も売上登録が先だった。しかしサマリの「主な影響対象I/F」と影響詳細一覧の行は商品照会が先で、3〜5 章の並びが食い違っていた。 | サマリの表のセルを「本部への売上登録、本部商品マスタの照会」にした。影響詳細一覧の 2 行を入れ替え、売上登録を先にした。 | vp-arc-document-structure | - |
| R2-2 | R2 | 5. 対応方針 | 見送りの在庫変更イベントは再評価を表の 1 行（低・2026-07-31・BA）にしている。一方、代替のレシート印字の再評価は表の下の箇条書きにだけあり、表と本文の置き方がそろっていない。 | - | vp-arc-document-structure。選ばなかった案は 2 つある。レシートの再評価を表の 1 行として足す案は、担当の Role を推測で決めることになるため見送った。在庫変更の行を外して箇条書きに寄せる案は、低影響の対応項目が表から消えるため見送った。どちらにそろえるかは人が決める。 | 要判断 |
| R2-3 | R2 | Frontmatter（`based_on`）・1. 目的と適用範囲 | 展開された grade の F001（`based_on` が個票 ID の形式 PJR-XXXX でなく `cr-2026-004`）は、観点が `vp-qe-kata-conformance` のため R2 では扱わない。 | - | kata-guide の「kata の観点の組」で `vp-qe-kata-conformance` は R1・R5 の観点。R1/R5 で、個票 ID の形式に合わせるか、rulebook の `based_on` の規定を見直すかを判断する。 | - |
| R2-4 | R2 | 4. 影響詳細一覧 | ほかの章と違い、表の前に導入の 1 文がない。 | - | Sample 記述標準の「表の前の 1 文」に当たり、kata-guide の「文章のチェック項目」の範囲のため R3 に任せる。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-interface-sample.md`: 「影響分析サマリ」の「主な影響対象I/F」を「本部への売上登録、本部商品マスタの照会」の順に直した。「影響詳細一覧」の高影響 2 行も入れ替え、売上登録を先にした。本文と「対応方針」の表の優先順に、3〜5 章の並びをそろえた。

## 3. 申し送り

- R2-2 は、レシートの再評価を表の 1 行にするか、在庫変更の行を箇条書きに寄せるかで案が分かれる。どちらにそろえるかは人が決める。
- R2-3 の F001 は、R1/R5 で個票 ID の形式に合わせるか、rulebook の `based_on` の規定を見直すかを判断する。
- R2-4 の「影響詳細一覧」の表前の導入文は R3 に任せる。
- R2-1: R2 / 3. 影響分析サマリ・4. 影響詳細一覧 / 本文は本部への売上登録の調整を先に始めるとし、「対応方針」の表も売上登録が先だが、サマリの「主な影響対象I/F」と影響詳細一覧の行は商品照会が先で、3〜5 章の並びが食い違っていた / サマリの表のセルを「本部への売上登録、本部商品マスタの照会」にし、影響詳細一覧の 2 行を入れ替えて売上登録を先にした / vp-arc-document-structure / -
- R2-2: R2 / 5. 対応方針 / 見送りの在庫変更イベントは再評価を表の 1 行（低・2026-07-31・BA）にしているが、代替のレシート印字の再評価は表の下の箇条書きにだけあり、表と本文の置き方がそろっていない / - / vp-arc-document-structure。選ばなかった案: レシートの再評価を表の 1 行として足す（担当の Role を推測で決めることになるため見送った）、在庫変更の行を外して箇条書きに寄せる（低影響の対応項目が表から消えるため見送った）。どちらにそろえるかは人が決める / 要判断
- R2-3: R2 / Frontmatter（`based_on`）・1. 目的と適用範囲 / 展開された grade の finding F001（`based_on` が個票 ID の形式 PJR-XXXX でなく `cr-2026-004`）は観点が `vp-qe-kata-conformance` のため R2 では扱わない / - / kata-guide の「kata の観点の組」で `vp-qe-kata-conformance` は R1・R5 の観点。R1/R5 で、個票 ID の形式に合わせるか、rulebook の `based_on` の規定を見直すかを判断する / -
- R2-4: R2 / 4. 影響詳細一覧 / ほかの章と違い、表の前に導入の 1 文がない / - / Sample 記述標準の「表の前の 1 文」に当たり、kata-guide の「文章のチェック項目」の範囲のため R3 に任せる / -
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/ 配下の sample だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

kata-guide の R2（構成）に従い、章の順・粒度・表と本文の配置を rulebook の本文要件と照合した。章構成は一致していたため、章の移動・分割・統合は行わず、3〜5 章の優先順の食い違いだけを直した。F001 は観点が `vp-qe-kata-conformance` で R1/R5 の担当のため、未解消のまま申し送った。次のアクションは R1/R5 での判断である。rulebook など sample 以外は変更していない。
