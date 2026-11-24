---
specdojo:
  id: prj-0001:xer-t-kata-review-all-stc-sample-140-20261124t220507z-672e84ab
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-stc-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-stc-sample-140/T-KATA-REVIEW-ALL-stc-sample-140-20261124T220507Z-672e84ab/plan.md
  started_at: "2026-11-24T22:05:16.066Z"
  completed_at: "2026-11-24T22:16:31.312Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stc-sample
    - specdojo:stc-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）として、`stc-sample.md` の事実を正本（`ifx-cmd-sample.yaml`、`stc-index-sample.md`、`sac-sample.md` など）と突き合わせ、誤り3点を直した。
- 直した点は次のとおり。(1) TR-03 の自動再試行の言い切りを、`ifx-cmd` の分類（送信前のビジーは最大3回まで自動再試行）に合わせて限定した。(2) TR-04 の根拠に分割基準を加えた。(3) SAC-PERF-01 へのトレース TR-07 を追加し、会計確定応答のケースに P95・P99 の記録を加えた。
- 確かめた主張は11件。一致が8件、不一致が3件で、不一致は上記の修正で解消した。確かめの表の全項目は handoff に残っている。
- grade の finding F001〜F005 は R4 の観点外のため、この段では扱っていない。executor の見立てでは F001・F003・F004・F005 は前の段の修正で解消済みに見える。F002 は R2 の確認に委ねる。
- `npm run lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は runner 実行で passed だった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-sample.md`: R4 の確かめで見つかった誤り3点を修正した。(1) TR-03 の「印字失敗・30秒タイムアウトは自動再試行しない」を、送信開始後の用紙切れ・30秒タイムアウトに限定した。送信前のビジー（exit 1）は最大3回まで自動再試行するためである。(2) TR-04 の根拠の仕様IDと要点を、分割基準に取消が含まれる形へ直した。(3) SAC-PERF-01 へのトレース TR-07 を追加し、会計確定応答のケースの観測点に P95・P99 の記録を加えた。あわせて prettier で整形した。

## 3. 申し送り

- 他の kata・R5 向け: `sac-sample.md` 29行は `st-cash-sale-commit-response-010` が SAC-PERF-01・SAC-PERF-02 を分解して測ると書いているが、SAC-PERF-02 は `st-cash-sale-commit-records-010` が担当している。`sac-sample` 側の修正を提案する。
- 他の kata・R1/R5 向け: `stc-index-sample.md` 152行は商品検索の測定を `stc-cash-sale` が担当するとしているが、`stc-sample` に商品検索の応答測定の観点・ケースがない。観点を追加するか分担を見直すかの判断が要る。
- 他の kata・R5 向け: `stc-index-sample.md` の分配表に「確定前の取消」の行がない。分割基準で `stc-cash-sale` に含めているだけなので、分配表に行を追加するかの判断が要る。
- 確かめの表（R4）: 1 TR-01 C-01（2個・60円・在庫5→3）/C-02（5個・150円・在庫5→0）| 正本 docs/ja/specdojo/samples/bac-sample.md 55-56行 | 一致
- 確かめの表（R4）: 2 TR-02 AC-01「商品・数量・支払方法を確定すると販売記録が1件できる」| 正本 prj-success-criteria-and-acceptance-criteria-sample.md 51行 | 一致
- 確かめの表（R4）: 3 TR-03「印字失敗・30秒タイムアウトは自動再試行しない」| 正本 ifx-cmd-sample.yaml の `exit_codes`・`error_handling` | 不一致: exit 1 の送信前のビジー状態は `transient_failure` で、最大3回まで自動再試行する。「送信開始後の用紙切れ・30秒タイムアウト」に限定して修正した。`timeout_seconds:` 30 と、会計を取り消さないこと（21行）は一致
- 確かめの表（R4）: 4 TR-04「取消・印刷失敗は分配方針で本 term が主担当」| 正本 stc-index-sample.md 分割基準（40行）・分配表（108-118行）| 一部不一致: 分配表に取消の行がなく、取消は分割基準で本 term に含まれている。仕様IDと要点を修正した。印刷失敗（会計維持）の主担当と、二重確定防止の従担当は一致
- 確かめの表（R4）: 5 TR-05・目的・例外「60取引/時で95%が2秒以内（仮置き）」「BAC-01〜BAC-03 の全ケース合格」| 正本 tsp-index-sample.md 106行・138行 | 一致
- 確かめの表（R4）: 6 会計確定応答のトレースと観測点 | 正本 sac-sample.md SAC-PERF-01（22行: P95 が2秒以内、P99 は記録のみ）、stc-index-sample.md 115行（P99 も記録する）| 不一致: SAC-PERF-01 へのトレースがなく、P99 の記録もなかった。TR-07 を追加し、観測点に P95・P99 を加えた
- 確かめの表（R4）: 7 TR-06 SAC-PERF-02「送った件数と販売記録が一致」| 正本 sac-sample.md 23行・58行（SAC-PERF-01 と同じ試行）| 一致
- 確かめの表（R4）: 8 データ・外部依存・証跡（kinuya-st・kinuya-test-data 商品A 30円・在庫5個、スタブで再現、kinuya-ci-st・kinuya-st-report）| 正本 stc-index-sample.md 7.1（133-137行）| 一致。性能試行で在庫を100個にする件は、共通方針との差として根拠つきで書かれている
- 確かめの表（R4）: 9 `case_id` 書式 `st-&lt;term&gt;-&lt;perspective_key&gt;-&lt;nnn&gt;`、優先度 P0/P1、自動化 automated/mixed、列の順 | 正本 stc-index-sample.md 8章 | 一致
- 確かめの表（R4）: 10 frontmatter（type: test、rulebook: specdojo:stc-rulebook、`based_on` に tsp-index と stc-index）と wikilink の参照先が実在すること | 正本 docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml、stc-rulebook.md 4章、各 sample の id | 一致（schema の正式な検査は runner の lint:fm に委ねる）
- 確かめの表（R4）: 11 在庫100→40（60取引×1個）、在庫5→3の算術 | 正本: 本文の値から算出 | 一致
- 指摘（他の kata・R5 向け）: sac-sample.md 29行は「st-cash-sale-commit-response-010 が SAC-PERF-01・SAC-PERF-02 を分解して測る」と書いているが、SAC-PERF-02 は st-cash-sale-commit-records-010 が担当している。sac-sample 側の修正を提案する
- 指摘（他の kata・R1/R5 向け）: stc-index-sample.md 152行は「商品検索の測定は stc-cash-sale が担当する」としているが、stc-sample に商品検索の応答測定の観点・ケースがない。観点を追加するか、分担を見直すかの判断が要る
- 指摘（他の kata・R5 向け）: stc-index-sample.md の分配表に「確定前の取消」の行がない。分割基準で stc-cash-sale に含めているだけなので、分配表に行を追加するかどうかの判断が要る
- grade の finding: F001・F003・F004・F005 は、前の段の修正で解消済みに見える（実施の行は削除済み、対象外は例外の形に変更済み、stc-index に記入例のケースはない、観点名は「会計維持」）。F002 は R2 の観点で、flow-success-030 は観点「販売確定成立」に残っている。意図の文は1つの命題として読めるため、R2 での確認に委ねる。いずれも R4 の観点外のため未対応
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/stc-sample.md のみで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として実施した。sample の主張ごとに、schema・関連 sample・正本文書と突き合わせた。確かめられた範囲の誤りだけを最小差分で直し、finding F001〜F005 は R4 の観点外として他の段に任せた。rulebook を正とする矛盾はなかった。履歴蓄積ファイルは変更していないため `validate:history-links` は非適用とした。
