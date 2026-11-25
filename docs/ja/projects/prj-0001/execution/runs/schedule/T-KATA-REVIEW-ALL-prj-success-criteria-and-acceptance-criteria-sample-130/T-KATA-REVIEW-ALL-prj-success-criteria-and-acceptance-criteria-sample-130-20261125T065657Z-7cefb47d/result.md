---
specdojo:
  id: prj-0001:xer-t-kata-review-all-prj-success-criteria-and-acceptance-criteria-sample-130-20261125t065657z-7cefb47d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-130/T-KATA-REVIEW-ALL-prj-success-criteria-and-acceptance-criteria-sample-130-20261125T065657Z-7cefb47d/plan.md
  started_at: "2026-11-25T06:57:08.028Z"
  completed_at: "2026-11-25T07:11:36.316Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
    - specdojo:prj-success-criteria-and-acceptance-criteria-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、成功基準と受入条件の sample の文を 10 か所直し、Prettier で整形した。意味・背景・例外・制約は変えていない。
- 主な直しは、主語の補足（確認者・店主代表（`PO`））、長文の分割、参照先の明確化（章タイトル `例外条件と未解決事項`）、表記ゆれの統一である。
- runner の検証では `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が成功した。変更種別に合わない検査は `not_applicable` である。
- grade の F001（SC-06 の必須記録と引き継ぎの定義）は観点が `vp-qe-verifiability` で R4 が扱うため、この段では扱っていない。F002（例外表の列）は、表がすでに template の列構成になっており解消済みと判断した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/prj-success-criteria-and-acceptance-criteria-sample.md`: 読みやすさの観点で 10 か所の文を直した（14 行追加・14 行削除）。判定対象の範囲の文を 2 文に分け、成功基準・受入条件の前置き文と判定手順 3・5 に「確認者が」を補った。手順 1 は「ベースライン記録の開始前に」と章タイトル `例外条件と未解決事項` の参照にして主体の店主代表（`PO`）を足した。手順 6 は「業務受入条件と関連テスト、その条件 ID の取得済みの証跡」に変えた。例外表の前置き文は「論点ごとに」に直した。人気商品の対象範囲の文は主語の順を並べ直し、「初期運用開始前」は「運用開始前」にそろえた。

## 3. 申し送り

- R3 の指摘は executor の handoff（R3-1〜R3-10）を参照のこと。この報告では重ねて書かない。
- F001 は R4 の段で、必須記録と引き継ぎの項目の中身を決めたうえで扱う必要がある。
- R3-1: R3 / 判定対象と適用範囲 / 初期受入の必須範囲と対象外を 1 文に詰めて長い / 2 文に分けた / W3 / -
- R3-2: R3 / 成功基準 / 表の前の文で誰が確かめるかが書かれていない / 「確認者が」を足した / W1 / -
- R3-3: R3 / 受入条件 / 表の前の文に「確かめる」「判断する」が並び前半に主語がない / 文を分け前半に「確認者が」を足した / W1、W3 / -
- R3-4: R3 / 判定手順と証跡（手順 1） / 「開始までに」が運用開始かベースライン記録の開始か決まらず、「例外表」の指す先と決める主体もない / 「ベースライン記録の開始前に」と章タイトル `例外条件と未解決事項` の参照にし、主体の店主代表（`PO`）を足して 2 文に分けた / W4、W1、W3 / -
- R3-5: R3 / 判定手順と証跡（手順 3） / 誰が追記するかが書かれていない / 「確認者が」を足した / W1 / -
- R3-6: R3 / 判定手順と証跡（手順 5） / 長く、前半に主語がない / 「確認者が…書く」「店主代表（`PO`）は…引き継ぐ」の 2 文に分けた / W1、W3 / -
- R3-7: R3 / 判定手順と証跡（手順 6） / 「変更した条件 ID を引き継ぐ」が証跡にもかかるのか読めない / 「業務受入条件と関連テスト、その条件 ID の取得済みの証跡」に変えた / W5 / -
- R3-8: R3 / 例外条件と未解決事項 / 表の前の文の「値ごとに」が表の列「論点」と食い違い、並べ方も曖昧 / 「論点ごとに」にし 3 項目を読点で並べた / W5、vp-ux-language-consistency / -
- R3-9: R3 / 例外条件と未解決事項（人気商品の対象範囲） / 主語が二つ入れ子になっている / 「BA が候補を整理し、PO が決める」の順に並べ直した / W5、W1 / -
- R3-10: R3 / 例外条件と未解決事項（オフライン時の記録方法） / 「初期運用開始前」がほかの箇所の「運用開始」と表記が違う / 「運用開始前」にそろえた / vp-ux-language-consistency / -
- 申し送り: grade F001（SC-06 の必須記録と引き継ぎの定義がない）は観点が `vp-qe-verifiability` で R4 が扱う。項目の中身を決めないと書けないため、文の直しでは決めず R4 の段へ回す。
- 申し送り: grade F002（例外表の列）は、表がすでに template の「論点・判定への影響・当面の扱い」の列になっており解消済みと判断した（R1/R5 の観点）。
- 申し送り: 「Role code」は用語集（docs/ja/product/010-business-specs/060-glossary/）にないが、ほかの sample でも同じ表記を使うため、この sample では変えていない。用語集に載せるかは R5 または用語集側で判断する。
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していないため）

## 4. 進め方と実践の型の適用

根拠は plan の「このフェーズで行うこと」に挙げた kata-guide の R3 と文章のチェック項目（W1〜W10）である。executor が W1・W3・W4・W5 と `vp-ux-language-consistency` に当たる箇所だけを直し、意味と判断に要る背景・例外・制約は維持した。plan に展開された grade の F001 は `vp-qe-verifiability` で R4 の観点のため、未解消のまま R4 へ回す。項目の中身を決める判断が要り、文の直しの範囲を超えるためである。F002 は例外表が template の「論点・判定への影響・当面の扱い」の列構成になっており、解消済みと判断した（R1/R5 の観点）。「Role code」は用語集にないが、ほかの sample でも同じ表記を使うため変えていない。用語集に載せるかは R5 または用語集側で判断する。frontmatter の `status` は変更していない。
