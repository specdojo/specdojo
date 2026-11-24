---
specdojo:
  id: prj-0001:xer-t-kata-review-all-stc-sample-150-20261124t221930z-e9b79dba
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-stc-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-stc-sample-150/T-KATA-REVIEW-ALL-stc-sample-150-20261124T221930Z-e9b79dba/plan.md
  started_at: "2026-11-24T22:19:38.742Z"
  completed_at: "2026-11-24T22:31:59.233Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:stc-sample
    - specdojo:stc-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として stc-sample を同じ接頭辞の index、`sac-sample`、`tsp-index-sample`、共通サンプル文脈と照合した。食い違いは1件で、`stc-index-sample` の「共通合格基準」が商品検索の測定を `stc-cash-sale` の担当と定めているのに、本書にそのケースや観測点がなかった。sample 側を直して解消した。
- plan に展開された F001〜F005 は、前の段までの版で解消済みであることを現行版と照合して確かめた。追加の差分は入れていない。
- 相手側の `sac-sample` に直すべき点が1件ある。変更せず、案を handoff に残した。
- 検査は executor の prettier 整形と markdownlint が通った。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/stc-sample.md`: `st-cash-sale-commit-response-010` の観測点に「商品検索の応答時間」を加え、TR-07 の備考に「商品検索の応答（`nfr-perf-004`）も同じ試行で値だけ記録する」と書いた。`stc-index-sample` の共通合格基準および担当割当と揃えた。12行追加・12行削除で、prettier 整形による差分を含む。

## 3. 申し送り

- 指摘一覧は executor の handoff（No.1〜4）に記載済み。相手側の修正案は No.2 のとおり、`docs/ja/specdojo/samples/sac-sample.md` 29行目の `SAC-PERF-02` の担当を `st-cash-sale-commit-records-010` に改める。この案は判断を要する点として扱う。
- No: 1 / 段: R5 / 箇所: docs/ja/specdojo/samples/stc-sample.md の「トレース」TR-07 の備考と「観点: 会計確定応答」の `st-cash-sale-commit-response-010` の観測点 / 指摘: `stc-index-sample` の「共通合格基準」は「商品検索の測定は `stc-cash-sale` が担当する」と定めるが、本書には商品検索の応答を測るケースや観測点がなかった / 直した案: `st-cash-sale-commit-response-010` の観測点に「商品検索の応答時間」を加え、TR-07 の備考に「商品検索の応答（`nfr-perf-004`）も同じ試行で値だけ記録する」と書いた（sample 側を修正済み） / 根拠: `stc-index-sample` の「共通合格基準」、`tsp-index-sample` の総合テストの出口条件の補足（`nfr-perf-004` は値の記録のみ）、`sac-sample` の対象外（商品検索は合否を判定しない） / 印: なし
- No: 2 / 段: R5 / 箇所: docs/ja/specdojo/samples/sac-sample.md 29行目（下位の行） / 指摘: 「`st-cash-sale-commit-response-010` が `SAC-PERF-01`・`SAC-PERF-02` を分解して測る」とあるが、`stc-sample` と `stc-index-sample` の分配表では `SAC-PERF-02` を「会計記録保全」の `st-cash-sale-commit-records-010` が受け持つ / 直した案（相手側のため未変更）: 「`st-cash-sale-commit-response-010` が `SAC-PERF-01` を、同じ試行の記録を使う `st-cash-sale-commit-records-010` が `SAC-PERF-02` を測る」に改める / 根拠: `stc-sample` の TR-06・TR-07 と「観点: 会計記録保全」、`stc-index-sample` の「対象別への分配方針（共通）」の `会計記録保全` 行 / 印: なし
- No: 3 / 段: R5 / 箇所: grade finding F001〜F005 / 指摘: plan に展開された finding を現行版と照合し、前の段までに解消済みであることを確かめた。F001 は境界の「実施」行がなくなり、外部依存の行が共通方針への参照になった。F002 は意図が1つの合否命題にまとまった。F003 は対象外の重複が「例外」の行に置き換わった。F004 は `stc-index-sample` から記入例の表がなくなり本書への参照に変わったため、食い違いが残っていない。F005 は観点名が「会計維持」になり、index の名前と一致した / 直した案: 追加の差分なし / 根拠: 現行の `stc-sample.md`・`stc-index-sample.md` / 印: なし
- No: 4 / 段: R5 / 箇所: 用語集の照合 / 指摘: `docs/ja/product/010-business-specs/060-glossary/` には SpecDojo のプロダクト用語しかなく、駄菓子屋の業務用語（店番担当・取引番号・会計確定など）は収録されていないため照合していない。共通サンプル文脈と `bac-sample` の用語・数値（商品A 単価30円・在庫5個、C-01・C-02）とは一致を確かめた / 直した案: なし / 根拠: 用語集のディレクトリ構成、`sample-authoring-standard` の「共通サンプル文脈」 / 印: なし
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/stc-sample.md だけで、plan・result・個票などの履歴ファイルを変更していないため）
- 適用外の検証: `npm run validate:catalog`（変更が docs/ja/specdojo/samples/ にとどまり、docs/ja/projects/ に及ばないため）

## 4. 進め方と実践の型の適用

根拠にしたのは、`stc-index-sample` の「共通合格基準」と分配方針、`tsp-index-sample` の総合テストの出口条件、`sac-sample` の対象外、Sample 記述標準の共通サンプル文脈。 維持した記述は、F001〜F005 の解消済みの箇所（共通方針への参照、1つの合否命題にまとめた意図、観点名「会計維持」、対象外の「例外」行）。 改訂した記述は、`stc-index-sample` の共通合格基準に合わせた商品検索の応答時間の記録だけ。 用語集 `docs/ja/product/010-business-specs/060-glossary/` には駄菓子屋の業務用語がなく、照合できなかった。商品A 単価30円・在庫5個、C-01・C-02 は `bac-sample` と一致している。 根拠不足による見送りはない。
