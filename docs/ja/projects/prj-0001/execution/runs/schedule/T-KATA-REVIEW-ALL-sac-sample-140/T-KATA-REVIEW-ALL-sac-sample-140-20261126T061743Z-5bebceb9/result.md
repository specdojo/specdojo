---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sac-sample-140-20261126t061743z-5bebceb9
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sac-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sac-sample-140/T-KATA-REVIEW-ALL-sac-sample-140-20261126T061743Z-5bebceb9/plan.md
  started_at: "2026-11-26T06:17:52.948Z"
  completed_at: "2026-11-26T06:24:27.315Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sac-sample
    - specdojo:sac-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）の段として、`sac-sample` の事実 11 件を schema、`nfr-performance-sample`、`tsp-index-sample`、`stc-sample` などの正本と突き合わせた。10 件は一致した。下位テストの対応の誤り 1 件を直した。
- F001 は、日次締めの合否境界を、控えに記録した閉店時刻から翌日の開店時刻までの時間として判定できる形にして解消した。時間の数値は rulebook が根拠のない閾値の追加を禁じているため足していない。
- F002 は、前の段で概要表と 2.4 の見出しがすでにそろっており、観点も R3 のものなので、この段では扱っていない。
- executor は `npx prettier --check` に成功した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` もすべて passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R4 正しさ | docs/ja/specdojo/samples/sac-sample.md 概要の下位テストの対応 | `st-cash-sale-commit-response-010` が `SAC-PERF-02` も測るとしていたが、stc-sample と nfr-performance-sample では取りこぼしの照合を `st-cash-sale-commit-records-010` が受け持つ。 | `st-cash-sale-commit-response-010` は `SAC-PERF-01` を測り、`st-cash-sale-commit-records-010` は `SAC-PERF-02` を照合する、と直した。 | stc-sample、nfr-performance-sample の 83 行目 | 修正済み |
| 2 | R4 正しさ | docs/ja/specdojo/samples/sac-sample.md 2.4.4. 判定方法（F001） | 日次締めの合否の境界が「翌日の開店まで」だけで、判定に使う時刻が決まっていなかった。 | 閉店時刻と翌日の開店時刻を、試行の前に試験の控えへ記録する手順を 2.4.1 に足した。2.4.3 と 2.4.4 は、この 2 つの時刻の間の時間以内なら合格と判定する形にした。時間の数値は足していない。 | vp-qe-verifiability、sac-rulebook（根拠のない閾値の追加の禁止） | 修正済み |
| 3 | R4 正しさ | docs/ja/specdojo/samples/sac-sample.md 通常の営業日の閉店時刻と開店時刻 | 通常の営業日の閉店時刻と開店時刻を定めた正本がなく、確かめられなかった。 | - | 共通サンプル文脈、bes-index-sample、cop-sample に正本がない。 | 未確認 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sac-sample.md`: 概要の下位テストの対応を、`st-cash-sale-commit-response-010` が `SAC-PERF-01` を測り、`st-cash-sale-commit-records-010` が `SAC-PERF-02` を照合する形に直した。F001 への対応として、2.4.1 の前提に閉店時刻と翌日の開店時刻を試験の控えへ記録する手順を足した。2.4.3 と 2.4.4 は、この 2 つの時刻の間の時間以内なら合格、超える回か完了しない回があれば不合格と判定できる形にした。

## 3. 申し送り

- 通常の営業日の閉店時刻と開店時刻は、共通サンプル文脈にも業務イベントの sample にも正本がないため、確かめられなかった（確かめの表の No11）。日次締めの完了時間（`nfr-perf-006` の `_UNDECIDED_`）を確定するときに、`nfr-performance-sample` 側で決める必要がある。
- 確かめの表: No1 frontmatter の `type: requirement`、`rulebook`、`based_on` / 正本 deliverable-frontmatter.schema.yaml、common-frontmatter.schema.yaml、sac-rulebook.md / 一致（`requirement` が列挙値にあり、`based_on` もキーとして定義されている）。No2 概要表の `nfr-perf-001`〜`003`・`005`・`006` の基準 / 正本 nfr-performance-sample.md の性能要件一覧 / 一致。No3 `nfr-perf-004` を対象外にすること / 正本 nfr-performance-sample.md の 82 行目 / 一致。No4 ピーク時の負荷（平日 16:00〜18:00、60 件/時、均等な間隔） / 正本 nfr-performance-sample.md の適用範囲・負荷条件 / 一致。No5 2.1 の印字を除く、1 時間 × 1 回、平均値だけで判定しない / 正本 nfr-performance-sample.md の測定方法 / 一致。No6 2.3 の 30 回とつけの顧客の事前登録 / 正本 nfr-performance-sample.md の `nfr-perf-005` / 一致。No7 2.4 の 3 回実行と最も長い回での判定 / 正本 nfr-performance-sample.md の `nfr-perf-006` / 一致。No8 仮置き値（95% が 2 秒以内、60 取引/時） / 正本 tsp-index-sample.md の 138 行目 / 一致。No9 下位テストの対応 / 正本 stc-sample.md、nfr-performance-sample.md の 83 行目 / 不一致のため修正。No10 `sac-availability` / 正本 nfr-availability-sample.md の 78 行目 / 一致（まだ存在しない文書のためバッククォートで仮置き）。No11 閉店時刻と開店時刻の値 / 共通サンプル文脈、bes-index-sample.md、cop-sample.md / 確かめられない（通常の営業日の時刻を定めた正本がない）。
- [minor/vp-qe-verifiability] 概要の下位の行で、`st-cash-sale-commit-response-010` が `SAC-PERF-02` も測るとしていたが、stc-sample と nfr-performance-sample では取りこぼしの照合を `st-cash-sale-commit-records-010` が受け持つ。response-010 が `SAC-PERF-01` を測り、records-010 が `SAC-PERF-02` を照合する、と直した。
- [minor/vp-qe-verifiability] F001: 2.4.4 の合否の境界が「翌日の開店まで」だけで、判定に使う時刻がなかった。rulebook が根拠のない閾値の追加を禁じているため時間の数値は足さず、2.4.1 の前提に、試行の前に閉店時刻と翌日の開店時刻を試験の控えに記録する手順を足した。2.4.3 と 2.4.4 は、この 2 つの時刻の間の時間以内なら合格、超える回か完了しない回があれば不合格と判定できる形にした。解消済み。
- F002（vp-ux-language-consistency）: 前の段で、概要表の『閉店後の日次締めを翌日の開店前に終える』と 2.4 の見出し『閉店後の日次締めの完了』がすでにそろっている。観点も R3 のものなので、この段では扱わない。
- 申し送り: 通常の営業日の閉店時刻と開店時刻は、共通サンプル文脈にも業務イベントの sample にも正本がない。日次締めの完了時間（`nfr-perf-006` の `_UNDECIDED_`）を確定するときに、nfr-performance-sample の側で決めるとよい。
- 適用外の検証: `npm run validate:history-links`（変更したのは sample だけで、plan / result / 個票を変更していないため）

## 4. 進め方と実践の型の適用

根拠とした正本は、frontmatter の schema（`deliverable-frontmatter.schema.yaml`、`common-frontmatter.schema.yaml`）、`sac-rulebook`、`nfr-performance-sample`、`tsp-index-sample`、`stc-sample` である。矛盾した場合は rulebook を正とした。根拠のない閾値を足さないという rulebook の禁止事項に従い、F001 は数値の追加ではなく、時刻を控えに記録して判定する手順で解消した。一致した記述は維持した。F002 は前の段で解消済みで R3 の観点でもあるため、見送った。
