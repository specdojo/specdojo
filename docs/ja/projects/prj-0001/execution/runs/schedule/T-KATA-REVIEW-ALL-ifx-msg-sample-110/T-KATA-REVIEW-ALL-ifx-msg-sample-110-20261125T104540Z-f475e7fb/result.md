---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-msg-sample-110-20261125t104540z-f475e7fb
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-msg-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-msg-sample-110/T-KATA-REVIEW-ALL-ifx-msg-sample-110-20261125T104540Z-f475e7fb/plan.md
  started_at: "2026-11-25T10:45:52.809Z"
  completed_at: "2026-11-25T11:03:38.379Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-msg-sample
    - specdojo:ifx-msg-sample
---

# Edit Result

## 1. 実施内容

- kata のレビュー段 R1（目的の過不足）を `docs/ja/specdojo/samples/ifx-msg-sample.yaml` に対して実施した。rulebook と ifx-index-sample は変更していない。
- 足した内容は、対応する `ifx-index` の連携名と、未決事項（本部が在庫の通知を受けるかは未合意）の 2 点。どちらも rulebook が `info.description` に求める本文要件である。
- 発生の契機を `info.description` からチャネルの `description` へ移した（F003 に対応）。
- 順序の保証と古いイベントを捨てる判定の単位を、任意の `subject` から必須で pattern のある `data.product_id` に改めた（F001・F002 に対応）。
- 削った内容は、先頭コメントの承認の割り当て（PO が ready への昇格を判断する）と、書き手向けメモ（対象外の連携は題材にしない）。
- 検証では、executor の prettier が通り、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が passed だった。ts 系の検査と `test:integration` は変更種別により `not_applicable` だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-msg-sample.yaml`: `info.description` の先頭に連携名「本部への在庫変更通知」（`ifx-index` 未掲載）を足し、末尾に未決事項を足した。発生の契機はチャネルの `description` へ移し、二重に書かないようにした。順序の保証と古いイベントを捨てる判定の単位は `data.product_id` に改め、`subject` は任意のまま残した。先頭コメントでは、承認の割り当てを確認先と解消時点の記述に改め、書き手向けメモを削除した。

## 3. 申し送り

- 指摘の一覧（result の実施内容に表として 1 回だけ書く元データ。No・段・箇所・指摘・直した案・根拠・印の順）は、evidence.handoff の R1-1〜R1-8 を使う。
- 要判断は 2 件。R1-4 は順序の単位を `data.product_id` にした。代案は `subject` を required にして pattern `^product/PROD-[0-9]{4}$` を付ける案で、F002 は R4 の観点なので R4 で再確認する。R1-6 は書き手向けメモを削除した。代案は題材の範囲の注意として残す案。
- F004 の残りは R1-7 に記録されている。ifx-index-sample に在庫変更通知の行を足すか、rulebook に例外を書くかの判断が要る。sample 側では直さず、R5 か ifx-index-sample の改訂で決める。
- R1-1: R1 / info.description / rulebook の本文要件が info.description に求める対応する ifx-index の連携名がない / 「対応する `ifx-index` の連携名は「本部への在庫変更通知」（一覧に未掲載）。」を先頭に足した / vp-qe-kata-conformance（種別の責務）、ifx-msg-rulebook の本文要件、grade F004 の sample 側 / -
- R1-2: R1 / info.description / rulebook の本文要件が info.description に求める未決事項がなく、先頭コメントの `_UNDECIDED_` にしかない / 末尾に「未決事項: 本部が在庫の通知を受けるかは未合意。」を足した / vp-qe-kata-conformance、ifx-msg-rulebook の本文要件 / -
- R1-3: R1 / channels.inventory.stock.changed.description / rulebook の本文要件がチャネルの description に求める発生の契機が info.description にしかない（F003） / 「発生の契機は販売の確定・仕入れの登録・棚卸しの訂正。」を info.description からチャネルの description へ移し、二重に書かない / vp-qe-kata-conformance、ifx-msg-rulebook の本文要件（channels 行）。F003 は R2 の観点の vp-qe-omissions-consistency だが、必須内容の欠けとして R1 で扱った / -
- R1-4: R1 / info.description（配信と順序の保証） / 順序の単位が任意で書式もない `subject` のため、購読者がこのファイルだけで順序を判断できず、rulebook の全体方針の最小十分を満たさない（F001・F002） / 順序の保証と古いイベントを捨てる判定の単位を、必須で pattern のある `data.product_id` に改めた。`subject` は rulebook どおり任意のまま残した / vp-qe-kata-conformance、ifx-msg-rulebook の全体方針（最小十分）と配信の保証と重複。選ばなかった案は `subject` を required にして pattern `^product/PROD-[0-9]{4}$` を付ける案（rulebook の例「同じ `subject` の中だけ」に近い）。F002 は R4 の観点で、R4 で再確認する / 要判断
- R1-5: R1 / 先頭コメント（`_UNDECIDED_`） / 「PO（店主代表）が採否と ready への昇格を判断する」は、Sample 記述標準が禁じる文書の承認の割り当てに当たる / 「確認先は PO（店主代表）で、ready にする前に解消する。」に改めた（rulebook の未決事項と検証が求める確認先と解消の時点だけを残した） / Sample 記述標準の記述ガイドと禁止事項、ifx-msg-rulebook の未決事項と検証 / -
- R1-6: R1 / 先頭コメント / 「同一覧の対象外（仕入先システム連携、キャッシュレス決済など）は題材にしない。」は sample を書く人へのメモで、メッセージ仕様の完成例に要らない / 削除した / vp-po-purpose-alignment、Sample 記述標準のサンプル群の目的（説明に必要な範囲へ限定）。選ばなかった案は、題材の範囲の注意として残す案。この制約は ifx-index-sample の `_ASSUMPTION_` と共通サンプル文脈で担保されると判断した / 要判断
- R1-7: R1 / `x-spec-meta.based_on`（specdojo:ifx-index-sample） / `based_on` の参照先の ifx-index-sample にこの連携の行がない（F004 の残り） / - / 相手側の案: ifx-index-sample の interfaces に「本部への在庫変更通知」の行（`spec_ref:` specdojo:ifx-msg-sample）を足し、sample の先頭コメントの未掲載の注記を外す。または ifx-msg-rulebook の ID 規則に、完成例は一覧に未掲載でよい例外を書く。R5 か ifx-index-sample の改訂で決める / -
- R1-8: R1 / channels.inventory.stock.changed.description / 「`subscribe` は、発行者が送り、購読者が受け取れることを表す。」は rulebook の向きの説明に近い / -（維持） / rulebook の向きと送信者・受信者は向きの誤読を防ぐことを求め、この文はその目的に役立つため要らない内容と判定しなかった / -
- 適用外の検証: `npm run validate:schema:file`（ifx-msg-sample.yaml は SpecDojo schema を持たない（specdojo-schema: none）ため、--schema に渡す schema がない）
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ifx-msg-sample.yaml だけで、pjr 個票や plan・result を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿い、grade の finding F001〜F004 のうち R1 の観点に当たるものを扱った。根拠は ifx-msg-rulebook の本文要件・全体方針、Sample 記述標準、vp-qe-kata-conformance。F003 は本来 R2 の観点（vp-qe-omissions-consistency）だが、必須内容の欠けとして R1 で扱った。F002 は R4 の観点で、順序の単位の変更でひとまず解消したが R4 で再確認する。F004 は sample 側の連携名の追記までを行い、参照先側の改訂は未解消として申し送った。rulebook と矛盾する箇所はなく、rulebook どおり任意の `subject` は維持した。「`subscribe` は、発行者が送り、購読者が受け取れることを表す。」の文は、rulebook の向きの説明に役立つため維持した。grade result のサイドカーは編集していない。
