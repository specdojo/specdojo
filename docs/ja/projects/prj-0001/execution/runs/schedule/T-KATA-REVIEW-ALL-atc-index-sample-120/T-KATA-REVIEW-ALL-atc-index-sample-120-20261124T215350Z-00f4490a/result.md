---
specdojo:
  id: prj-0001:xer-t-kata-review-all-atc-index-sample-120-20261124t215350z-00f4490a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-atc-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-atc-index-sample-120/T-KATA-REVIEW-ALL-atc-index-sample-120-20261124T215350Z-00f4490a/plan.md
  started_at: "2026-11-24T21:53:59.327Z"
  completed_at: "2026-11-24T21:58:25.022Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:atc-index-sample
    - specdojo:atc-index-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）として `atc-index-sample` の章構成を rulebook の本文要件（1〜9 章）と照合した。章の名前・順序・必須の区分は一致し、合格基準と判定の流れは第 1 章の下位の節に置かれている。章の移動・分割・統合は不要だった。
- grade の F001 だけを直した。`取引照合の保証` の主担当を `atc-sale-hold` に絞り、分配表に主担当・従担当の行を追加した。
- F002 は R1 で解消済みのため扱わず、F003 は R3 の観点のため R3 に任せた。
- executor の検証（prettier、markdownlint）と runner の検証（`lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema`）は passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/atc-index-sample.md`: 受入観点の立て方の表で `取引照合の保証` の主に立てる term を `atc-sale-hold` だけにした。分配表には `取引照合の保証` の行を追加し、主担当を `atc-sale-hold`、従担当を `atc-cash-sale` とした。これにより「同じ観点を複数の term で主担当にしない」という分配方針と一致した。

## 3. 申し送り

- R2 の指摘の一覧（result の実施内容に表として 1 回だけ書く）: | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | - | - | - | - | - | - | - | | 1 | R2 | 受入観点の立て方（共通）・観点/条件の採用基準と対象別への分配方針（共通） | `取引照合の保証` の主に立てる term に `atc-cash-sale`・`atc-sale-hold` の 2 つが並び、分配方針と食い違う（grade F001） | 主に立てる term を `atc-sale-hold` だけにし、分配表に主担当 `atc-sale-hold`・従担当 `atc-cash-sale` の行を追加した | `vp-qe-omissions-consistency`、rulebook の記述ガイド | - | | 2 | R2 | 観点/条件の採用基準と対象別への分配方針（共通） | 観点名「主要操作の自力完了」が命名規則に従っていない（grade F002） | R1 で `主要操作の自力完了の成立` に直っているため扱わない | `vp-qe-kata-conformance` | - | | 3 | R2 | 本ドキュメントの目的と適用対象 | 家族利用者代表の行だけ Role code がない（grade F003） | R3 に任せる | `vp-ux-language-consistency`（R3 の観点） | - | | 4 | R2 | 全章 | 章の構成は rulebook と一致し、移動・分割・統合は不要。rulebook の `template` が `undecided` のため template とは照合できない | - | `vp-arc-document-structure` | - |
- No: 1 / 段: R2 / 箇所: 受入観点の立て方（共通）・観点/条件の採用基準と対象別への分配方針（共通） / 指摘: `取引照合の保証` の主に立てる term に `atc-cash-sale`・`atc-sale-hold` の 2 つが並び、分配方針の「同じ観点を複数の term で主担当にしない」と食い違う（grade F001） / 直した案: 主に立てる term を `atc-sale-hold` だけにし、分配表に「`取引照合の保証` / 引継ぎ後の取引の確認｜BAC-03｜主担当 `atc-sale-hold`｜従担当 `atc-cash-sale`｜取引番号の観測点は `atc-cash-sale` のケースと同じ項目で残す」の行を追加した / 根拠: `vp-qe-omissions-consistency`、rulebook の記述ガイド「観点/条件の採用基準と対象別への分配方針（共通）」（主担当 1 つ・従担当から参照）。主担当は、状態の列の引継ぎメモが `atc-sale-hold` の業務成果に当たることから選んだ / 印: -
- No: 2 / 段: R2 / 箇所: 観点/条件の採用基準と対象別への分配方針（共通） / 指摘: 分配表の観点名「主要操作の自力完了」が命名規則に従っていない（grade F002）が、R1（commit 4edecf4315）で `主要操作の自力完了の成立` にすでに直っている / 直した案: - / 根拠: `vp-qe-kata-conformance`（R1・R5 の観点）。現行の版で解消済みのため扱わない / 印: -
- No: 3 / 段: R2 / 箇所: 本ドキュメントの目的と適用対象 / 指摘: 関係者の表で家族利用者代表の行だけ Role code がない（grade F003） / 直した案: -（R3 に任せる） / 根拠: `vp-ux-language-consistency` は kata-guide の観点の組で R3 に割り当てられているため、R2 では直さない / 印: -
- No: 4 / 段: R2 / 箇所: 全章 / 指摘: 章の名前・順序・必須の区分は rulebook の本文要件（1〜9 章）と一致し、合格基準と判定の流れは第 1 章の下位の節に置かれている。章の移動・分割・統合は不要。rulebook の `template` が `undecided` のため template とは照合できない / 直した案: - / 根拠: `vp-arc-document-structure` / 印: -

## 4. 進め方と実践の型の適用

根拠として、plan に展開された grade の finding 3 件、rulebook の本文要件、kata-guide のレビュー段の定義を使った。構造・必須項目は rulebook を正として照合した。F001 は rulebook の記述ガイド（主担当は 1 つで、従担当から参照する）に沿って修正した。主担当は、状態の列の引継ぎメモが `atc-sale-hold` の業務成果に当たることから選んだ。F002 は R1 の版で解消済みのため維持した。F003 は R3 の観点のため未対応で、R3 の段に任せる。rulebook の `template` が `undecided` のため template との照合はできず、次のアクションは template の確定後に再照合することである。sample 以外のファイルは変更していない。
