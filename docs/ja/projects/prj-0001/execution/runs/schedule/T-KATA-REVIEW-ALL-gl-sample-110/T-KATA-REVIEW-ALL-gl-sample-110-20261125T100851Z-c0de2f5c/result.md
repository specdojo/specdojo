---
specdojo:
  id: prj-0001:xer-t-kata-review-all-gl-sample-110-20261125t100851z-c0de2f5c
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-gl-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-gl-sample-110/T-KATA-REVIEW-ALL-gl-sample-110-20261125T100851Z-c0de2f5c/plan.md
  started_at: "2026-11-25T10:09:01.393Z"
  completed_at: "2026-11-25T10:20:20.490Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:gl-sample
    - specdojo:gl-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）のレビューを `gl-sample.yaml` に対して行いました。用語集の責務から外れる記録手順の一文を 1 件削りました。
- 必須項目、分類用語の定義、対象範囲と共通の正本の明示は、rulebook の要求を満たしていました。
- schema 検査、用語の参照検査、Prettier 検査は成功しました。runner の `lint:md:changed`、`lint:fm:changed`、`test:docs`、`validate:schema` も成功しました。
- 指摘は 3 件で、反映は 1 件です。No.2 は人の判断が要る「要判断」です。No.3 は R4・R5 へ申し送りました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/gl-sample.yaml`: 「欠品」（`tm-inventory-stockout`）の `notes` から「欠品の回数は日ごとに記録する。」を削除しました。記録の手順は用語の意味や範囲ではなく、gl-rulebook の位置づけで操作手順は各仕様へ委ねるためです。「取り扱いをやめた商品や、季節外で棚に置いていない商品は含めない。」は残しました。

## 3. 申し送り

- 実施内容の表（指摘の一覧）。executor の handoff の 3 件を 1 回だけ表にまとめます。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R1 | `gl-sample.yaml` の `tm-inventory-stockout` の `notes` | 「欠品の回数は日ごとに記録する。」は記録の手順で、用語集の責務の外にある | この一文を削除しました（sample に反映済み） | gl-rulebook の「位置づけ」と「禁止事項」、`vp-arc-single-responsibility` | なし | | 2 | R1 | `gl-sample.yaml` の `terms` 全体の `status` | すべて `official` で、rulebook が書き方を定める `candidate` の例がありません。任意項目なので欠けているとまでは言えません | sample は変えていません。`candidate` の用語を 1 件（`notes` に未合意の論点と影響を書いたもの）入れるかを人が決めます | gl-rulebook の「`terms` の項目」、Sample 記述標準の「構成の原則」 | 要判断 | | 3 | R1（R4・R5 へ申し送り） | `tm-reorder-point` の `example` と先頭コメント | 例文が `notes` の記述（発注数量と発注先は店主代表が判断する）とずれています。先頭コメントの `tm-common-product` は、この sample にしか出てきません | この段では直していません。例文の正しさは R4、`tm-common-product` の参照先の有無は R5 で確かめます | kata-guide の「段と渡す材料」 | なし |
- No: 1 / 段: R1 / 箇所: docs/ja/specdojo/samples/gl-sample.yaml の `tm-inventory-stockout` の `notes` / 指摘: 「欠品の回数は日ごとに記録する。」は用語の意味や範囲ではなく記録の手順で、用語集の責務の外にある / 直した案: この一文を削り、「取り扱いをやめた商品や、季節外で棚に置いていない商品は含めない。」だけを残した（sample に反映済み） / 根拠: gl-rulebook の「位置づけ」（判定条件・データ項目・操作手順・実装詳細は各仕様・設計へ委ねる）、「禁止事項」（概念の説明を実装詳細・条件一覧で代用すること）、`vp-arc-single-responsibility` / 印: なし
- No: 2 / 段: R1 / 箇所: docs/ja/specdojo/samples/gl-sample.yaml の `terms` 全体の `status` / 指摘: すべて `official` で、rulebook が書き方を定める `candidate`（`notes` に論点と利用への影響を書く）の例がない。任意項目なので欠けているとまでは言えない / 直した案: sample は変えていない。完成例に `candidate` の用語を 1 件（`notes` に未合意の論点と影響を書いたもの）入れるかを人が決める / 根拠: gl-rulebook の「`terms` の項目」の `candidate` の説明、Sample 記述標準の「構成の原則」（任意の要素は理解を助ける場合に限り含める） / 印: 要判断
- No: 3 / 段: R1（R4・R5 への申し送り） / 箇所: docs/ja/specdojo/samples/gl-sample.yaml の `tm-reorder-point` の `example` と先頭コメント / 指摘: 例文「発注点を下回ったため、追加発注を行う。」が `notes` の「発注候補に挙がった後の発注数量と発注先は店主代表が判断する」とずれている。先頭コメントの `tm-common-product` は docs/ja 配下の YAML を検索してもこの sample にしか出てこない / 直した案: この段では直さない。例文の正しさは R4、`tm-common-product` の参照先の有無は R5 で確かめる / 根拠: kata-guide の「段と渡す材料」の R4・R5 の範囲 / 印: なし

## 4. 進め方と実践の型の適用

根拠は gl-rulebook の「位置づけ」「禁止事項」「`terms` の項目」、Sample 記述標準の「構成の原則」、`vp-arc-single-responsibility`、kata-guide のレビュー段の定義です。plan に展開された grade と condense の finding はありませんでした。維持したのは、必須項目、分類用語の定義、対象範囲と共通の正本の明示です。改訂したのは `tm-inventory-stockout` の `notes` の 1 箇所だけです。矛盾時に rulebook を正とした箇所はありません。`candidate` 用語の追加は任意項目で確証が足りないため、推測で改訂せず「要判断」として残しました。
