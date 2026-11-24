---
specdojo:
  id: prj-0001:xer-t-kata-review-all-etc-index-sample-140-20261124t222310z-92f4c5b9
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-etc-index-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-etc-index-sample-140/T-KATA-REVIEW-ALL-etc-index-sample-140-20261124T222310Z-92f4c5b9/plan.md
  started_at: "2026-11-24T22:23:18.761Z"
  completed_at: "2026-11-24T22:35:45.526Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:etc-index-sample
    - specdojo:etc-index-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として etc-index-sample を、schema・関連 sample・rulebook と突き合わせて確かめた。誤りと食い違いを 3 点直した。
- F005 に対応し、環境条件の「遅延（上限の直前）」を応答待ち上限の 1 秒前の具体値（`receipt-print` は 9 秒、保管サービスは 29 秒）にした。
- トレース記入例の章番号参照を章タイトル参照にした。
- `ifx-cmd-sample` の上限 30 秒・自動再試行 3 回と、本書の応答待ち 10 秒・自動再送なしの食い違いを `_UNDECIDED_` としてメモに足した。
- F001・F008 の原因は相手側の `itc-index-sample` が `tsp-index-sample` と食い違っていることだった。R4 では本書を直さず、R5 へ回す。
- F002〜F004 は `vp-pm-*` の観点で、段のレビューには使わない観点のため扱わなかった。F006・F007・F009 は R1・R2・R5 の観点に当たるため扱わなかった。
- 検証は、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` と executor の整形・lint が成功した。コード変更がないため `lint:ts`・`typecheck`・単体／統合テストなどは対象外になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/etc-index-sample.md`: 環境条件の遅延を、応答待ち上限の 1 秒前の具体値（`receipt-print` は 9 秒、保管サービスは 29 秒）にした。トレース記入例の章番号参照を章タイトルにした。`receipt-print` の応答待ち・自動再送の値が `ifx-cmd-sample` と食い違うことを `_UNDECIDED_` としてメモに足した。表の列幅を整形した。

## 3. 申し送り

- R4 の指摘と確かめは executor の handoff に 1 件ずつ記録済み。確かめられなかった主張は、保管サービスの応答待ち 30 秒・再送 2 回（正本なし）と、明細最大件数 30 件（上限の定義が見つからない）の 2 件。
- 判断が要る点が 2 つある。1 つ目は、`receipt-print` の応答待ち・再送の値を本書に合わせるか連携仕様に合わせるかである。executor は、30 秒に寄せると `etc-sample` の多くのケースへ波及するため採らなかった。2 つ目は、`itc-index-sample` を `tsp-index-sample` に合わせて `PATH-04`・`PATH-07` を内部結合テストの範囲に入れる案で、R5 に渡す。
- R4-1: R4 / 5. 条件の立て方（共通） / 環境の「遅延（上限の直前）」は何秒遅らせるかが決まらず、境界ケースの合否が人によってぶれる（F005） / 「遅延（応答待ち上限の1秒前。`receipt-print` は9秒、保管サービスは29秒）」にした / vp-qe-verifiability。上限10秒・30秒は本書の「外部結合テスト共通の境界/依存/環境の扱い」による / -
- R4-2: R4 / 9. メモ / 将来課題 / `receipt-print` の応答待ち10秒・自動再送なしが、正本の `docs/ja/specdojo/samples/ifx-cmd-sample.yaml`（`timeout_seconds: 30`、`retry.max_attempts: 3`、`on_categories: transient_failure`）と食い違うのに、本書に記載がない / `_UNDECIDED_` の行を足し、連携仕様と値をそろえた時点で本書と `etc-receipt-print` を更新する扱いにした / vp-arc-technical-constraints。`etc-sample` の4章も同じ食い違いを `_UNDECIDED_` としている。値を30秒に寄せる案は、`etc-sample` の多くのケースへ波及するため採らなかった / 要判断
- R4-3: R4 / 8. ケース表の共通カラム / トレース記入例が「テスト戦略・方針 5章」と章番号で参照しており、markdown の規約（章への参照は章タイトルで書く）に反する。参照先の5章は「入口／出口条件（品質ゲート）」で、内容は正しい / 「の「入口／出口条件（品質ゲート）」の」に置き換えた / `.github/instructions/markdown.instructions.md` の見出し階層と番号付け / -
- R4-4: R4 / 2. テスト対象の括り方と分割基準 / `PATH-04`・`PATH-07` を内部結合テストに置く記述は、`based_on` の `tsp-index-sample` の36行目・89行目と一致する。食い違っているのは `itc-index-sample` の側で、19行目・30行目・68行目がこの2経路を外部結合テストの範囲としている（F001・F008 の原因） / - / 相手側の `itc-index-sample` を `tsp-index-sample` に合わせ、`PATH-04`・`PATH-07` を内部結合テストの範囲に入れる案を R5 に渡す。F001・F008 の観点は R1・R2 のもので、R4 では本書を直さない / 要判断
- R4 確かめの表 C1: 主張 2章「保管サービスは `PATH-05`・`PATH-06`、`PATH-03`・`PATH-04`・`PATH-07` は内部」 / 正本 `docs/ja/specdojo/samples/tsp-index-sample.md`・`ifd-sample.md` / grep で読み取り / 一致 / tsp の36〜37行目・89行目、ifd の79〜82行目
- R4 確かめの表 C2: 主張 7章「`receipt-print` は応答待ち10秒・自動再送なし」 / 正本 `docs/ja/specdojo/samples/ifx-cmd-sample.yaml` / grep で読み取り / 不一致 / 正本は `timeout_seconds: 30`、`retry.max_attempts: 3`。メモに `_UNDECIDED_` を足した（R4-2）
- R4 確かめの表 C3: 主張 7章「保管サービスは応答待ち30秒・再送2回（間隔5秒・10秒）」 / 正本なし（`ops-kinuya-backup` は未同梱） / ifd-sample を grep で確認 / 確かめられない / 本書の中で `_ASSUMPTION_` と明記されている。提供事業者の提供条件が必要
- R4 確かめの表 C4: 主張 5章「明細最大件数（30件）」 / 正本の候補 `ifx-file-sample.md`・`ifx-cmd-sample.yaml` / maxItems・最大で grep / 確かめられない / 上限の定義が見つからない。`etc-sample` の contract-020 は30件を使っている。`line_items` の上限を定める正本が必要
- R4 確かめの表 C5: 主張 8章「カラム名・順・区分、`case_id` = `et-&lt;term&gt;-&lt;perspective_key&gt;-&lt;nnn&gt;`、`nnn` は010から10刻み、優先度 P0、自動化 automated」 / 正本 `docs/ja/specdojo/rulebooks/etc-index-rulebook.md` のケース表の共通カラム / 読み取り / 一致 / rulebook の 6.8 の表と同じ
- R4 確かめの表 C6: 主張 8章の記入例 `et-receipt-print-failure-handling-010`（観点「印刷失敗時の会計維持」、`perspective_key`: `failure-handling`） / 正本 `docs/ja/specdojo/samples/etc-sample.md` / grep で読み取り / 一致 / etc-sample の83行目と93行目
- R4 確かめの表 C7: 主張 3章「放課後ピークでも印刷は1時間60件」 / 正本 `docs/ja/specdojo/samples/tsp-index-sample.md` / grep で読み取り / 一致 / tsp の138行目「放課後ピーク1時間60取引」
- R4 確かめの表 C8: 主張 8章「証跡は `kinuya-ci-sales-recovery`、相関 ID は取引番号」 / 正本 `tsp-index-sample.md`・`etc-sample.md` / grep で読み取り / 一致 / tsp の116行目、etc-sample の27行目
- R4 確かめの表 C9: 主張 8章のトレース記入例「テスト戦略・方針の外部結合テスト出口条件」 / 正本 `tsp-index-sample.md` の入口／出口条件（品質ゲート） / grep で読み取り / 一致（章の参照の書き方だけを直した） / tsp の97行目と105行目
- 申し送り: F002・F003・F004（`vp-pm-*`）は kata-guide の「kata の観点の組」で段のレビューに使わない観点とされている。F006・F007・F009 は R1・R2・R5 の観点に当たる。どれも R4 では扱わなかった。F006 は観点の型の表に非機能の行がもうあり、解消済み

## 4. 進め方と実践の型の適用

kata-guide の R4（正しさ）に従い、sample の事実（経路、値、列、ID 形式、参照先）を `tsp-index-sample`・`ifd-sample`・`ifx-cmd-sample`・`etc-sample`・rulebook と突き合わせた。誤りと食い違いだけを直し、一致した記述は維持した。確かめた主張は 9 件で、一致 6 件、直した 2 件（C2 の値の食い違い、C9 の章参照）、確かめられなかった 2 件を含む。rulebook を正とし、`status` は据え置いた。
