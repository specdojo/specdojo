---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-test-sample-110-20261125t111938z-ec816563
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-test-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-test-sample-110/T-KATA-REVIEW-ALL-imp-test-sample-110-20261125T111938Z-ec816563/plan.md
  started_at: "2026-11-25T11:19:49.244Z"
  completed_at: "2026-11-25T11:39:49.517Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-test-sample
    - specdojo:imp-test-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R1（目的の過不足）として `imp-test-sample` を見直し、R1 に当たる F003 と F002 を sample に反映した。
- F003: 成功条件の重大度「高」から、つけ管理のテストを対象外とした適用範囲と合わない「つけ残高の誤り」を外した。
- F002: 対応方針に、rulebook の位置づけが定める反映先を示す「反映先」の箇条を足した。
- F001 は文書内の矛盾として R2 へ、F004 と F005 は読みやすさ・用語の観点として R3 へ残した。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-test-sample.md`: 成功条件の重大度「高」を「売上金額の誤り」だけにした（F003）。5. 対応方針に「反映先」の箇条を足し、結合テストの新規 8 ケースは `itc-index`、業務受入テストの判定項目とシナリオは `atc-index`、回帰テストを重点 20 ケースへ絞る方針は `tsp-index` とした（F002）。差分は 6 行追加、5 行削除。

## 3. 申し送り

- R1-1: R1 / 2. 変更要求の概要 / 成功条件の重大度「高」に「つけ残高の誤り」があり、つけ管理のテストを対象外とした適用範囲と合わず、確かめる手段がない（F003） / 直した案: 成功条件を「重大度「高」（売上金額の誤り）の未解決欠陥が 0 件」にした / 根拠: `vp-qe-kata-conformance`、`vp-po-purpose-alignment`。影響分析サマリの尺度「売上金額・つけ残高の誤り」は高の定義として一般的なので残した / 印: -
- R1-2: R1 / 5. 対応方針 / rulebook の「位置づけ」が定める反映先がなく、完成例として要る内容が欠けている（F002） / 直した案: 「反映先」の箇条を足した（結合テスト新規 8 ケース→`itc-index`、業務受入テストの判定項目とシナリオ→`atc-index`、回帰テストを重点 20 ケースへ絞る方針→`tsp-index`） / 根拠: `vp-qe-kata-conformance`、`vp-po-purpose-alignment`。迷った点: 結合テストを内部結合と読んで `itc-index` にしたが、外部結合の `etc-index` とする案もある。回帰テストのケースの置き場所が決められず、方針だけを `tsp-index` に書いた / 印: 要判断
- R1-3: R1 / 5. 対応方針 / 重点回帰で欠陥が出たら残り 100 ケースを受入判定前に実行する記述が、4. 影響詳細一覧の「全 120 ケースの再実行は期限内に終わらない」と食い違う（F001） / 直した案: - / 根拠: `vp-pm-plan-feasibility` は kata の段のレビューでは使わない。文書内の矛盾として R2 の `vp-qe-omissions-consistency` で扱うことを提案する / 印: -
- R1-4: R1 / 1. 目的と適用範囲 / 「その営業日前の 2026-05-28」で営業日数が抜けている（F004） / 直した案: - / 根拠: `vp-ux-readability` のため R3 へ残す / 印: -
- R1-5: R1 / 6. 未解決事項 / 論点名「連携系テストデータの準備」がほかの章の呼び方と合わない（F005） / 直した案: - / 根拠: `vp-ux-language-consistency` のため R3 へ残す / 印: -
- R1-1: R1 / 2. 変更要求の概要 / 成功条件の重大度「高」に「つけ残高の誤り」があり、つけ管理のテストを対象外とした適用範囲と合わず、確かめる手段がない（F003） / 成功条件を「重大度「高」（売上金額の誤り）の未解決欠陥が 0 件」にした / `vp-qe-kata-conformance`、`vp-po-purpose-alignment`（rulebook の目的と適用範囲に対し要らない内容）。影響分析サマリの尺度「売上金額・つけ残高の誤り」は高の定義として一般的なので残した / -
- R1-2: R1 / 5. 対応方針 / rulebook の「位置づけ」が定める反映先（テスト戦略・方針と各テストレベルのテストカタログ）が sample に書かれておらず、完成例として要る内容が欠けている（F002） / 「反映先」の箇条を足した（結合テスト新規 8 ケース→`itc-index`、業務受入テストの判定項目とシナリオ→`atc-index`、回帰テストを重点 20 ケースへ絞る方針→`tsp-index`） / `vp-qe-kata-conformance`、`vp-po-purpose-alignment`。迷った点: sample の「結合テスト」を内部結合と読んで `itc-index` にしたが、外部結合 `etc-index` とする案もある。回帰テストのケースの置き場所が決められず、方針だけを `tsp-index` に書いた / 要判断
- R1-3: R1 / 5. 対応方針 / 重点回帰で欠陥が出たら残り 100 ケースを受入判定前に実行するという記述が、4. 影響詳細一覧の「全 120 ケースの再実行は期限内に終わらない」と食い違う（F001） / - / 根拠の観点 `vp-pm-plan-feasibility` は kata の段のレビューでは使わない（kata-guide の kata の観点の組）。文書内の矛盾として R2 の `vp-qe-omissions-consistency` で扱うことを提案する / -
- R1-4: R1 / 1. 目的と適用範囲 / 「その営業日前の 2026-05-28」で営業日数が抜けている（F004） / - / `vp-ux-readability` のため R3 へ残す / -
- R1-5: R1 / 6. 未解決事項 / 論点名「連携系テストデータの準備」がほかの章の呼び方と合わない（F005） / - / `vp-ux-language-consistency` のため R3 へ残す / -

## 4. 進め方と実践の型の適用

sample-maintenance の進め方に沿い、R1（目的の過不足）に当たる finding だけを sample に反映した。根拠は rulebook の目的・位置づけと `vp-qe-kata-conformance`、`vp-po-purpose-alignment` である。F003 は適用範囲の対象外と合わない条件を削った。F002 は rulebook が定める反映先が欠けていたため足した。F001、F004、F005 は R1 の観点外なので変更せず、後の段へ残した。F002 の反映先の `itc-index` と `etc-index` のどちらにするかは、迷った点として「要判断」を付けた。executor の `npm run lint:md` は親 runner の実行に任せていた。runner の `npm run lint:md:changed` と `npm run lint:fm:changed` は passed だった。
