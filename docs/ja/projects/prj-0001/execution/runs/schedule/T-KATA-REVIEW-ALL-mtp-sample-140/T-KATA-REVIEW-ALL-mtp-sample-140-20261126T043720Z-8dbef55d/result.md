---
specdojo:
  id: prj-0001:xer-t-kata-review-all-mtp-sample-140-20261126t043720z-8dbef55d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-mtp-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-mtp-sample-140/T-KATA-REVIEW-ALL-mtp-sample-140-20261126T043720Z-8dbef55d/plan.md
  started_at: "2026-11-26T04:37:37.441Z"
  completed_at: "2026-11-26T04:47:10.345Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mtp-sample
    - specdojo:mtp-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R4（正しさ）として、`mtp-sample` の主張を schema、`mtp-rulebook` および関連 sample（`mip-index-sample`、`dmd-index-sample`、`dmd-sample`、`otp-index-sample`、`cop-index-sample`）と突き合わせた。誤りを 2 件直した。
- 直した 1 件目は、所要時間の基準（grade F002）である。時刻も分数もなく合否を測れなかったため、180 分以内（臨時休業の開始を 9:00 と仮置き）という仮値に直した。`_UNDECIDED_` は、決まった開始時刻から正午までの分数に直す旨へ書き換えた。
- 直した 2 件目は、データ準備の担当の行である。存在しない `dmd-index` の「移行手順」章を参照していたため、参照先を `dmd-index` の共通方針と、対象別の `dmd-&lt;term&gt;` の移行手順（顧客台帳とつけ残高は `dmd-credit-data`）に直した。
- F001（`based_on` への `specdojo:dmd-sample` の追加）は観点 `vp-dev-change-impact` で R5 の担当のため、この段では扱っていない。F003（呼称の揺れ）は R3 の担当である。読んだ版は、すでに `pm-decision-log` へそろっていた。
- 主張ごとの確かめは 14 件ある。12 件は正本と一致した。2 件（結果報告の置き場所、データセット ID と予定日）は、正本のない駄菓子屋の業務の仮定のため確かめの対象にしていない。
- 検証は、`prettier` の整形、`markdownlint-cli2`、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` がいずれも passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 合否基準 / 所要時間の基準 | 基準が「臨時休業の開始から正午まで」で、時刻も分数もなく合否を測れない（grade F002）。 | 基準を「…取り込み直し 1 回分を足した時間が 180 分以内（臨時休業の開始を 9:00 と仮置き）」に変え、`_UNDECIDED_` を、決まった開始時刻から正午までの分数に直す旨へ書き換えた。 | `vp-qe-verifiability`。`mtp-rulebook` の合否基準の良い例（停止許容時間（60分）以内）、`cop-index-sample` の「9:00 を T+0:00、T+3:00 が正午」、`cop-sample` の「開店の 180 分前（T-180m）に始める前提」。 | - |
| R4-2 | R4 | テスト環境/データ準備 / データ準備の担当の行 | 「`dmd-index` の移行手順」を参照しているが、`dmd-index-sample` にその章はない。章は共通方針・`run_id` 規約・検証の共通方針・対象一覧である。移行手順は `dmd-sample` の「移行手順（手動/バッチ/ツール）」にある。 | 「`dmd-index` の共通方針と対象別の `dmd-&lt;term&gt;` の移行手順（顧客台帳とつけ残高は `dmd-credit-data`）」に直した。 | `vp-dev-implementation-readiness` | - |
| R4-3 | R4 | Frontmatter | `based_on` に `specdojo:dmd-sample` がない（grade F001）。観点 `vp-dev-change-impact` は R5 の担当のため、この段では直していない。 | R5 で、`based_on` に `specdojo:dmd-sample` を足すか、関連ドキュメントの参照だけに留めるかを決める。 | `mtp-rulebook` の推奨 Frontmatter 項目の `based_on` の条件 | - |
| R4-4 | R4 | GO/NO-GO判断プロセス | 「決定記録」と `pm-decision-log` の呼び方が揺れている（grade F003）。観点は R3 の担当で、読んだ版ではすでに `pm-decision-log` へそろっていた。 | - | `vp-ux-language-consistency`。直すことはない。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mtp-sample.md`: 所要時間の合否基準を、180 分以内（臨時休業の開始を 9:00 と仮置き）という測れる値に直し、`_UNDECIDED_` の記述を調整した。データ準備の担当の行の参照先を、実在する章（`dmd-index` の共通方針と `dmd-&lt;term&gt;` の移行手順）へ直した。`prettier` の整形で表の列幅が変わった。

## 3. 申し送り

- F001 は R5 で判断する。`based_on` に `specdojo:dmd-sample` を足すか、関連ドキュメントの参照だけに留めるかを、`mtp-rulebook` の推奨 Frontmatter 項目の `based_on` の条件で決める。
- F003 は直す必要がない。読んだ版で、すでに `pm-decision-log` へそろっていた。
- R4-1: R4 / 合否基準 / 所要時間の基準が「臨時休業の開始から正午まで」で、時刻も分数もなく合否を測れない（grade F002） / 基準を「…取り込み直し 1 回分を足した時間が 180 分以内（臨時休業の開始を 9:00 と仮置き）」に変え、`_UNDECIDED_` を、決まった開始時刻から正午までの分数に直す旨へ書き換えた / `vp-qe-verifiability`。mtp-rulebook の合否基準の良い例（停止許容時間（60分）以内）、cop-index-sample の「9:00 を T+0:00、T+3:00 が正午」、cop-sample の「開店の 180 分前（T-180m）に始める前提」 / -
- R4-2: R4 / テスト環境/データ準備 / データ準備の担当の行が「`dmd-index` の移行手順」を参照しているが、dmd-index-sample にその章はない（章は共通方針・`run_id` 規約・検証の共通方針・対象一覧）。移行手順は dmd-sample の「移行手順（手動/バッチ/ツール）」にある / 「`dmd-index` の共通方針と対象別の `dmd-&lt;term&gt;` の移行手順（顧客台帳とつけ残高は `dmd-credit-data`）」に直した / `vp-dev-implementation-readiness` / -
- R4-3: R4 / Frontmatter / `based_on` に `specdojo:dmd-sample` がない（grade F001）。観点 `vp-dev-change-impact` は R5 の担当なので、この段では直さない / - / R5 で、`based_on` に `specdojo:dmd-sample` を足すか、関連ドキュメントの参照だけに留めるかを決める（mtp-rulebook の推奨 Frontmatter 項目の `based_on` の条件で判断する） / -
- R4-4: R4 / GO/NO-GO判断プロセス / 「決定記録」と `pm-decision-log` の呼び方が揺れている（grade F003）。観点は R3 の担当で、読んだ版ではすでに `pm-decision-log` へそろっていた / - / `vp-ux-language-consistency`。直すことはない / -
- 確かめの表 No1: 主張=Frontmatter の `type: test`・`rulebook: specdojo:mtp-rulebook` / 正本=docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml、mtp-rulebook の推奨 Frontmatter 項目 / 確かめ方=enum と rulebook の記述を読んだ / 結果=一致 / 根拠=schema の enum に `test`、rulebook に「`specdojo.type` は `test`、`specdojo.rulebook` は `specdojo:mtp-rulebook`」
- 確かめの表 No2: 主張=`run_id` の規約は `DMD-YYYYMMDD-&lt;term&gt;-NN`、日付でリハーサルと本番を区別する / 正本=dmd-index-sample の `run_id` 規約 / 確かめ方=読んだ / 結果=一致 / 根拠=命名の行と「移行リハーサルも同じ規約で採番する。日付の部分で…区別する」
- 確かめの表 No3: 主張=作業フォルダは `migration/&lt;run_id&gt;/`、照合表は `&lt;run_id&gt;-check-count`・`&lt;run_id&gt;-check-sample`・`&lt;run_id&gt;-check-value`、紙の照合表は鍵付きの引き出しにしまう / 正本=dmd-index-sample の `run_id` 規約と検証の共通方針 / 確かめ方=読んだ / 結果=一致 / 根拠=記録先の行と、証跡の行の `&lt;run_id&gt;-check-&lt;種別&gt;`（`count`・`sample`・`value`）
- 確かめの表 No4: 主張=許容差は商品名・氏名の全角と半角、長音記号の違いだけ / 正本=dmd-index-sample の検証の共通方針 / 確かめ方=読んだ / 結果=一致 / 根拠=「全角・半角の違いと長音記号の違いだけを許容する。金額・個数・つけ残高に許容差は設けない」
- 確かめの表 No5: 主張=件数の判定者 DEV は `mip-index` の成功条件と同じ役割 / 正本=mip-index-sample の項目ごとの受入基準 / 確かめ方=読んだ / 結果=一致 / 根拠=件数の一致の判定者が開発担当（DEV）
- 確かめの表 No6: 主張=判定者を Role code（OPS・DEV・QE・PO）で書く / 正本=mtp-rulebook の合否基準、docs/ja/specdojo/samples/pm-roles-sample.yaml / 確かめ方=grep で code を確かめた / 結果=一致 / 根拠=pm-roles-sample に PO・DEV・QE・OPS の code がある
- 確かめの表 No7: 主張=顧客台帳とつけ残高の設計は `dmd-credit-data` / 正本=dmd-index-sample の対象一覧、dmd-sample / 確かめ方=読んだ / 結果=一致 / 根拠=対応DMD 列が `dmd-credit-data`、dmd-sample の概要が（credit-data）
- 確かめの表 No8: 主張=結果報告の所要時間を `dmd-*` の見積と比べる / 正本=dmd-sample の性能/所要時間見積 / 確かめ方=読んだ / 結果=一致 / 根拠=手順ごとの見積（10 分・35 分など）があり、リハーサルで測り直すとある
- 確かめの表 No9: 主張=業務シナリオで店主代表が現金販売を取り消す / 正本=otp-index-sample の権限 / 確かめ方=読んだ / 結果=一致 / 根拠=販売の取り消しは店主代表だけができる
- 確かめの表 No10: 主張=つけ残高を 1 分以内に表示する / 正本=otp-index-sample / 確かめ方=読んだ / 結果=一致 / 根拠=「つけ残高を 1 分以内で確認するため」
- 確かめの表 No11: 主張=臨時休業は切替日の午前で、正午に開店する / 正本=mip-index-sample、cop-index-sample / 確かめ方=読んだ / 結果=一致 / 根拠=mip の `_ASSUMPTION_`、cop-index の T+3:00（正午）
- 確かめの表 No12: 主張=判断の結果を `pm-decision-log`、差異を `pm-issue-log` へ転記する / 正本=mtp-rulebook の差異発生時の扱い / 確かめ方=読んだ / 結果=一致 / 根拠=課題管理簿（`pm-issue-log`）と決定記録（`pm-decision-log`）への転記の判断基準
- 確かめの表 No13: 主張=結果報告は `migration/rehearsal/` の `MTP-R&lt;n&gt;-report` / 正本=なし（駄菓子屋の業務の値の仮定） / 確かめ方=- / 結果=確かめられない / 根拠=正本がない。共通サンプル文脈と食い違わないため、確かめの対象にしない
- 確かめの表 No14: 主張=データセット ID の `MTP-DS-R1`・`MTP-DS-R2`、切替日の 10 日前・3 日前の予定 / 正本=なし（業務の仮定） / 確かめ方=- / 結果=確かめられない / 根拠=正本がない。共通サンプル文脈と食い違わないため、確かめの対象にしない
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/mtp-sample.md だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したのは `*.md` の 1 ファイルだけで、`*.yaml` / `*.yml` を変更していないため）

## 4. 進め方と実践の型の適用

根拠にした規範は、`mtp-rulebook`、`deliverable-frontmatter.schema.yaml`、`dmd-index-sample`、`dmd-sample`、`mip-index-sample`、`otp-index-sample`、`cop-index-sample`、`cop-sample`、`pm-roles-sample.yaml` である。各主張を正本と突き合わせ、誤りがあった 2 箇所だけを直し、一致した記述は維持した。正本のない業務の仮定（結果報告の置き場所、データセット ID、予定日）は、共通サンプル文脈と食い違わないため確かめの対象にしなかった。F001 は R5、F003 は R3 の担当として、この段では修正していない。
