---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdt-sample-150-20261126t130219z-c5621c31
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdt-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdt-sample-150/T-KATA-REVIEW-ALL-cdt-sample-150-20261126T130219Z-c5621c31/plan.md
  started_at: "2026-11-26T13:02:30.353Z"
  completed_at: "2026-11-26T13:11:54.772Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdt-sample
    - specdojo:cdt-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として cdt-sample を、uis-sample・gl-sample と突き合わせて直した。税率区分の表記と、用語集の定番商品の語義の食い違いを解消した。
- 商品台帳の扱いで cdsd-sample と食い違う点は、相手側を直す案を findings に残した。どちらを正とするか決められないため「要判断」とした。
- grade の F001（`vp-ops-operability`）は、kata-guide の「kata の観点の組」で kata の段では使わない観点のため、R5 では扱わなかった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 1. 概要、4. 関連仕様との関係 | 「税区分」が uis-sample の「税率区分（8% または 10%）」と食い違っている。 | 2 か所を「税率区分」に直した。 | `vp-qe-kata-conformance`（uis-sample の集計の章で、商品台帳が税率区分を持つと書いている） | - |
| R5-2 | R5 | 4. 関連仕様との関係（用語集の行） | 用語集の語義として「通年で棚に置く方針」と書いているが、gl-sample の tm-standard-product の定義は「継続して棚に置くと決め、在庫を補充しながら販売する商品」である。 | 「継続して棚に置き補充する方針」に直した。本文の「通年」は店の方針として残した。 | `vp-qe-kata-conformance`、`vp-dev-change-impact` | - |
| R5-3 | R5 | 2.3. 棚札タグ、3.2.2. 区分を変更する場合、3.4. 棚札タグの管理 | cdt-sample は店主代表が「紙の商品台帳」を正本として、取扱区分の変更理由・適用日・棚札タグの管理欄を記録するとしている。cdsd-sample は商品台帳の内容を商品の識別・表示名・標準販売価格・補充基準とし、承認後に OPS だけが更新するとしており、食い違う。 | -（変更しない）。相手側の案は 2 つある。1 つ目は、cdsd-sample の商品台帳の内容に取扱区分・商品区分・棚札タグを足し、更新者を店主代表と整合させる案。2 つ目は、cdt-sample の「紙の商品台帳」が現行運用（AS-IS）を指すと明記する案。 | cdfd-overview-sample が現行を「商品ノート」、システム化後の保管先を未決としているため、どちらを正とするか決められなかった。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdt-sample.md`: 「税区分」を uis-sample に合わせて「税率区分」に直した（1. 概要、4. 関連仕様との関係の 2 か所）。用語集の行の定番商品の語義を、gl-sample の定義に合わせて「継続して棚に置き補充する方針」に直した。本文の「通年」は店の方針として残した。差分は 3 行の追加と 3 行の削除。

## 3. 申し送り

- `cdsd-sample` の商品台帳の内容に取扱区分・商品区分・棚札タグを足し、更新者を店主代表と整合させる案がある。または cdt-sample の「紙の商品台帳」が現行運用（AS-IS）を指すと明記する案もある。どちらを採るかは `cdfd-overview-sample` の保管先が未決のため判断が要る。
- 検査は、executor の `npx prettier --check` と runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。その他の検査は変更種別により非適用だった。
- R5-1: R5 / 1. 概要、4. 関連仕様との関係 / 「税区分」が uis-sample の「税率区分（8% または 10%）」と食い違う / 2 か所を「税率区分」に直した / vp-qe-kata-conformance（uis-sample の集計の章で、商品台帳が税率区分を持つと書いている）/ -
- R5-2: R5 / 4. 関連仕様との関係（用語集の行）/ 用語集の語義として「通年で棚に置く方針」と書いているが、gl-sample の tm-standard-product の定義は「継続して棚に置くと決め、在庫を補充しながら販売する商品」 / 「継続して棚に置き補充する方針」に直した（本文の「通年」は店の方針として残した） / vp-qe-kata-conformance、vp-dev-change-impact / -
- R5-3: R5 / 2.3. 棚札タグ、3.2.2. 区分を変更する場合、3.4. 棚札タグの管理 / cdt-sample は店主代表が「紙の商品台帳」を正本として取扱区分の変更理由・適用日・棚札タグの管理欄を記録するとしている。cdsd-sample は商品台帳の内容を商品の識別・表示名・標準販売価格・補充基準とし、承認後に OPS だけが更新するとしており、食い違う / - / 相手側の案: cdsd-sample の商品台帳の内容に取扱区分・商品区分・棚札タグを足し、更新者を店主代表と整合させる。あるいは cdt-sample の「紙の商品台帳」が現行の運用（AS-IS）を指すと明記する。cdfd-overview-sample が現行を「商品ノート」、システム化後の保管先を未決としているため、どちらを正とするか決められなかった / 要判断
- F001（grade、vp-ops-operability）: 3.2.2. 区分を変更する場合に、店番が適用日までに棚札を新しい表示名に貼り替えると前の段で書き足し済み。kata-guide の「kata の観点の組」で vp-ops-operability は kata の段では使わないため、R5 では扱わなかった

## 4. 進め方と実践の型の適用

根拠にしたのは、同じ接頭辞の関連 sample（uis-sample、gl-sample、cdsd-sample、cdfd-overview-sample）と cdt-rulebook、および Sample 記述標準の共通サンプル文脈である。相手側と食い違った表記と語義は、sample 側を直した。相手側を直すべき点は変更せず、案として残した。整合していた記述は維持した。F001 は、kata の段の観点の組に含まれないため扱わず、後続の段に任せる。
