---
specdojo:
  id: prj-0001:xer-t-kata-review-all-atc-index-sample-110-20261124t151932z-e8aed961
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-atc-index-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-atc-index-sample-110/T-KATA-REVIEW-ALL-atc-index-sample-110-20261124T151932Z-e8aed961/plan.md
  started_at: "2026-11-24T15:19:40.835Z"
  completed_at: "2026-11-24T21:50:17.720Z"
  agent: sol-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-index-sample
    - specdojo:atc-index-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）として `atc-index-sample` を見直し、分配表の観点名を命名規則に合わせ、条件の追加順に rulebook が求める重大リスクの段を足した。
- grade F001（`vp-qe-omissions-consistency`）は R2、F003（`vp-ux-language-consistency`）は R3 の観点のため、R1 では直さず該当段へ申し送った。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-index-sample.md`: 分配表の観点名「主要操作の自力完了」を、名詞＋成立/保証/整合の命名規則に従う `主要操作の自力完了の成立` に直した（F002）。条件の立て方（共通）の追加順に「→重大リスク（P0: 金銭に響くつけ残高の照合）」の段を足した。

## 3. 申し送り

- 指摘一覧（R1）: | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R1-1 | R1 | 6. 観点/条件の採用基準と対象別への分配方針（共通） | 分配表の観点名「主要操作の自力完了」が、rulebook と本書の受入観点の立て方で定めた命名規則（名詞＋成立/保証/整合）に従っていない（grade F002） | 観点名を `主要操作の自力完了の成立` にし、ほかの行と同じくインラインコードで囲んだ | `vp-qe-kata-conformance`（rulebook 記述ガイドの受入観点の立て方） | - | | R1-2 | R1 | 5. 条件の立て方（共通） | ケースの追加順が「代表→重要分岐」で止まり、rulebook の条件の立て方が求める重大リスク（P0: 不正権限・金銭・監査・データ破壊）の段がない | 「→重大リスク（P0: 金銭に響くつけ残高の照合）」を追加順に足した | `vp-qe-kata-conformance`、`vp-po-purpose-alignment`。重大リスクの例は合格基準の P0（AC-02）と分配表の `つけ残高の整合` に合わせた | 要判断 | R1-2 は、つけ残高がすでに P0 に含まれ、追記しなくても扱いは変わらないとも読めるため迷った。選ばなかった案は、追記せず「代表」の段で兼ねたとみなす案。
- grade F001 は R2 へ申し送る。受入観点の立て方の表で `取引照合の保証` の主に立てる term に `atc-cash-sale` と `atc-sale-hold` を並べており、分配方針の「同じ観点を複数の term で主担当にしない」と食い違って読める。主担当を1つに絞るか、分配表に行を足して主担当・従担当を分けるかを R2 で判断する。
- grade F003 は R3 へ申し送る。列見出し「関係者（Role code）」に対して家族利用者代表の行だけ Role code がないため、共通サンプル文脈（`PO` 業務助言）に合わせて書き足す。
- R1-1: 段 R1 / 箇所 6. 観点/条件の採用基準と対象別への分配方針（共通） / 指摘 分配表の観点名「主要操作の自力完了」が rulebook と本書の受入観点の立て方で定めた「名詞＋成立/保証/整合」の命名規則に従っていない（grade F002） / 直した案 観点名を `主要操作の自力完了の成立` にし、ほかの行と同じくインラインコードで囲んだ / 根拠 `vp-qe-kata-conformance`（rulebook 記述ガイドの受入観点の立て方: 観点名は名詞＋成立/保証/整合） / 印 -
- R1-2: 段 R1 / 箇所 5. 条件の立て方（共通） / 指摘 ケースの追加順が「代表→重要分岐」で止まり、rulebook の条件の立て方が求める「→重大リスク（P0: 不正権限・金銭・監査・データ破壊）」の段がない / 直した案 「→重大リスク（P0: 金銭に響くつけ残高の照合）」を追加順に足した / 根拠 `vp-qe-kata-conformance`、`vp-po-purpose-alignment`（rulebook 記述ガイドの条件の立て方）。重大リスクの例は合格基準の P0（AC-02）と分配表の `つけ残高の整合` に合うつけ残高にした。迷った理由: つけ残高は P0 にすでに含まれ、追記しなくても扱いは変わらないとも読める。選ばなかった案: 追記せず「代表」の段で兼ねたとみなす案 / 印 要判断
- 申し送り（R2 へ）: grade F001（`vp-qe-omissions-consistency`、受入観点の立て方の表）は R2 の観点のため R1 では直していない。`取引照合の保証` の主に立てる term に `atc-cash-sale` と `atc-sale-hold` の 2 つを並べており、分配方針の「同じ観点を複数の term で主担当にしない」と食い違って読める。主担当を 1 つに絞るか、分配表に行を足して主担当・従担当を分けるかを R2 で判断する。
- 申し送り（R3 へ）: grade F003（`vp-ux-language-consistency`、関係者表の家族利用者代表の行）は R3 の観点のため R1 では直していない。列見出し「関係者（Role code）」に対して家族利用者代表だけ Role code がないため、共通サンプル文脈に合わせて書き足す。
- R1 で維持した記述: 合格基準と判定の流れ（実施者・証跡確認者を辿れること）、全必須章、ケース表の共通カラム、`based_on`、形式例に限ったケースの記載は rulebook と成果物カタログの `done_criteria` を満たすため維持した。関係者表の役割は受入の手順という文書の中身であり、Sample 記述標準が禁じる文書の作成・承認の割り当てに当たらないため維持した。
- 適用外の検証: `npm run validate:history-links`（executor が変更したのは docs/ja/specdojo/samples/atc-index-sample.md だけで、個票・plan・result などの履歴蓄積ファイルを変更していないため）

## 4. 進め方と実践の型の適用

根拠は、rulebook の記述ガイド（受入観点の立て方・条件の立て方）、Sample 記述標準、成果物カタログの `done_criteria`、grade finding の F001〜F003 である。F002 は命名規則への不一致なので観点名を直し、条件の追加順には rulebook が求める重大リスクの段を足した（要判断）。合格基準と判定の流れ、全必須章、ケース表の共通カラム、`based_on`、形式例に限ったケースの記載は rulebook と `done_criteria` を満たすため維持した。関係者表の役割は受入の手順という文書の中身であり、Sample 記述標準が禁じる文書の作成・承認の割り当てに当たらないため維持した。F001 と F003 は R1 の観点ではないので直さず、申し送った。検査は executor が `npx prettier --write` と `npx markdownlint-cli2` で通し、runner の `npm run lint:md:changed`、`npm run lint:fm:changed`、`npm run validate:schema` などもすべて passed になった。
