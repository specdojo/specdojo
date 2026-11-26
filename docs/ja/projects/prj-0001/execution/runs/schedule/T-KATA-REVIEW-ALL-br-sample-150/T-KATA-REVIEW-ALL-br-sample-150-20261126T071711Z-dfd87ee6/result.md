---
specdojo:
  id: prj-0001:xer-t-kata-review-all-br-sample-150-20261126t071711z-dfd87ee6
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-br-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-br-sample-150/T-KATA-REVIEW-ALL-br-sample-150-20261126T071711Z-dfd87ee6/plan.md
  started_at: "2026-11-26T07:17:22.384Z"
  completed_at: "2026-11-26T07:26:13.280Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:br-sample
    - specdojo:br-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として br-sample を、同じ接頭辞や関連の sample（gl-sample・bdd-sample・cdt-sample）と照合した。発注点を設定する対象が定番商品だけである点に合わせ、適用範囲を定番商品に絞った。
- grade の F001 は前の版の行を指していた。現在の版の6章には承認の条件がすでにあるため、追加の変更はしていない。
- 相手側の gl-sample と bdd-sample を直す案は、変更せずに findings と handoff に残した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 冒頭の1文と 1. 概要（適用範囲・対象外） | 発注点を設定するのは定番商品だけなのに、本文の対象が「商品」一般になっていた。 | 冒頭の1文と適用範囲を「定番商品」に絞り、対象外に「定番商品以外の補充判断」を加えた。 | vp-qe-kata-conformance。gl-sample の `tm-reorder-point` の notes、bdd-sample の発注点の説明、cdt-sample の定番商品の定義に合わせた。 | - |
| R5-2 | R5 | 6. メモ / 将来課題 | grade の F001（承認条件の不足）は前の版の行74を指していた。現在の版の6章にはすでに承認の条件がある。 | - | vp-qe-kata-conformance。「人間の PO による承認」は、Sample 記述標準が本文に承認の役割を書くことを禁じているため書き足さなかった。 | - |
| R5-3 | R5 | 2. 入力（相手側: gl-sample.yaml の `tm-reorder-point`） | 用語集の定義は「在庫数量がこの値を下回ったとき」だが、br-sample は予約を除いた販売可能数と発注点を比べる。 | 相手側の案: gl-sample の `tm-reorder-point` の notes に「不足の判定では予約分を除いた販売可能数と比べる（在庫不足判定に従う）」と添える。 | vp-qe-kata-conformance、vp-dev-change-impact。迷った理由: 用語集の定義は一般的な語義のままにして、具体の比較はルールに任せる案もあり、選ばなかった。 | 要判断 |
| R5-4 | R5 | 2. 入力（相手側: bdd-sample.yaml） | データ辞書の商品には発注点があるが、br-sample が必須入力とする在庫数と予約数の項目がない。 | 相手側の案: bdd-sample に在庫と予約の項目（個数・整数・必須）を加え、在庫不足判定への参照を付ける。 | vp-qe-kata-conformance、vp-dev-change-impact。迷った理由: bdd-sample は最小の例で、意図して省いている可能性がある。省いたままにする案は選ばなかった。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/br-sample.md`: 冒頭の1文と1章の適用範囲を「定番商品」に絞り、対象外に「定番商品以外の補充判断」を加えた。gl-sample・bdd-sample・cdt-sample の定番商品の扱いと揃えた。

## 3. 申し送り

- `npx prettier --check` は成功した。runner の `lint:md:changed`、`lint:fm:changed`、`validate:schema` なども成功した。
- F001 は前の版の行を指した指摘だった。指摘の例にある「人間の PO による承認」は、Sample 記述標準が本文に承認の役割を書くことを禁じているため書き足していない。
- R5-1: R5 / 冒頭の1文と 1. 概要（適用範囲・対象外） / 発注点を設定するのは定番商品だけなのに、本文の対象が「商品」一般になっていた / 冒頭の1文と適用範囲を「定番商品」に絞り、対象外に「定番商品以外の補充判断」を加えた / vp-qe-kata-conformance。gl-sample の `tm-reorder-point` の notes「定番商品だけに設定し」、bdd-sample の発注点の説明「定番商品で在庫不足判定に使う」、cdt-sample の定番商品の定義「発注点を設定する対象」に合わせた / -
- R5-2: R5 / 6. メモ / 将来課題 / grade の F001（承認条件の不足）は前の版の行74を指していた。今の版の6章にはすでに承認の条件（判定例1〜9が規則から一意に導けること）がある / - / vp-qe-kata-conformance。指摘の例にある「人間の PO による承認」は書き足さなかった。Sample 記述標準の記述ガイドと禁止事項が、本文に承認の役割を書くことを禁じているため / -
- R5-3: R5 / 2. 入力（相手側: gl-sample.yaml の `tm-reorder-point`） / 用語集の定義は「在庫数量がこの値を下回ったとき」だが、br-sample は予約を除いた販売可能数と発注点を比べる / -（相手側の案: gl-sample の `tm-reorder-point` の notes に「不足の判定では予約分を除いた販売可能数と比べる（在庫不足判定に従う）」と添える） / vp-qe-kata-conformance、vp-dev-change-impact。迷った理由: 用語集の定義は一般的な語義のままにして、具体の比較はルールに任せる案もあり、選ばなかった / 要判断
- R5-4: R5 / 2. 入力（相手側: bdd-sample.yaml） / データ辞書の商品には発注点があるが、br-sample が必須入力とする在庫数と予約数の項目がない / -（相手側の案: bdd-sample に在庫と予約の項目（個数・整数・必須）を加え、在庫不足判定への参照を付ける） / vp-qe-kata-conformance、vp-dev-change-impact。迷った理由: bdd-sample は最小の例で、意図して省いている可能性がある。省いたままにする案は選ばなかった / 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/br-sample.md だけで、plan・result・個票の履歴ファイルは変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

根拠は、Sample 記述標準、br-rulebook、同じ接頭辞や関連の sample（gl-sample・bdd-sample・cdt-sample）、および grade の F001。矛盾した場合は rulebook を正とした。発注点の対象が定番商品である点は他の sample と食い違っていたため、br-sample の側を直した。F001 は、現在の版の6章に承認の条件（判定例1〜9の期待結果が規則から一意に導けること）がすでにあるため、解消済みと判断した。gl-sample と bdd-sample の側の食い違いは、変更せず直す案を残した（`要判断`）。
