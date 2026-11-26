---
specdojo:
  id: prj-0001:xer-t-kata-review-all-utc-index-sample-130-20261124t215623z-e1fdde45
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-utc-index-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-utc-index-sample-130/T-KATA-REVIEW-ALL-utc-index-sample-130-20261124T215623Z-e1fdde45/plan.md
  started_at: "2026-11-24T21:56:31.706Z"
  completed_at: "2026-11-24T22:09:23.977Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:utc-index-sample
    - specdojo:utc-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/utc-index-sample.md` の文を直した。直した内容は、長い文の分割、略語 UT の初出への正式名の追記、受入確認の箇条書き化、指示語や重なった表現の整理、grade F002 の繰り返しの削除である。意味と判断に要る背景・例外・制約は変えていない。
- 指摘は executor の handoff（R3-1〜R3-11）に 1 件ずつ記録されている。迷った R3-4 と R3-10 には「要判断」の印が付いている。
- この段で扱わなかった grade の指摘は次のとおり。F001・F003・F004・F005 は R4 の観点のため R4 に任せた。F006・F007・F008 は R2 の観点で、前の段で直った版になっていた。F009 は kata の段のレビューでは使わない観点のため外した。
- 検査結果は次のとおり。executor の `prettier` と `markdownlint-cli2` は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。他の検査は変更種別により非適用になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/utc-index-sample.md`: 文の読みやすさを直した。目的と適用対象の範囲の文を 3 文に分け、単体テストの初出に（UT）を添えた。受入確認を 3 項目の箇条書きにした。採用のしかたと根拠の文を 2 文に分けた。非同期・並行性の文のねじれと「本表」の指示語を直した。共通カラムの文の重なりを整理した。grade F002 に当たる `証跡` の暫定の書き方の繰り返しを削り、メモ / 将来課題の CI の行を整備の期限と差し替えの対象だけにした。メモ / 将来課題の表の「UT」は「単体テスト」に改めた。

## 3. 申し送り

- R3-4（受入確認を行う主体）は、sample 本文と `tsp-index-sample` から主体を特定できず、推測で足していない。人の判断が要る。
- R3-10（F002 の担当）は、担当を示す根拠がなく書いていない。人の判断が要る。
- R3-1: R3 / 本ドキュメントの目的と適用対象 / 範囲の文が長く、範囲・対象・扱わないものが 1 文に入っていた / 「範囲は…単体テスト（UT）とし、対象は…の各モジュールである。内部結合以降の確認は…で扱う。」の 3 文に分けた / W3 / -
- R3-2: R3 / 本ドキュメントの目的と適用対象 / 略語 UT が表と本文で正式名を添えずに使われていた / 単体テストの初出に「（UT）」を添えた / W8 / -
- R3-3: R3 / 本ドキュメントの目的と適用対象 / 受入確認の 1 文に確かめることが 3 つ並び、読点が多い / 「次の3点を確かめる」に続けて 3 項目の箇条書きにした / W3・W9 / -
- R3-4: R3 / 本ドキュメントの目的と適用対象 / 受入確認を誰が行うかが本文から決まらない / - / W1。主語を足す案もあったが、行う主体を sample の本文と tsp-index-sample から特定できず、推測で足さなかった / 要判断
- R3-5: R3 / 観点/条件の採用基準と対象別への分配方針（共通） / 採用のしかたと採用の根拠が 1 文に入っていた / 「採用は…とする。採用の根拠は、…に限る。」の 2 文に分けた / vp-ux-readability（一文一主張） / -
- R3-6: R3 / 単体テスト共通の境界/依存の扱い / 「非同期・並行性は、…同期処理のみで、当てはまらない」の主語と述語がねじれていた / 「非同期・並行性の扱いは、…同期処理だけのため当てはまらない。」にした / W2 / -
- R3-7: R3 / 単体テスト共通の境界/依存の扱い / 「本表」が指す表が一つに決まりにくい / 「本章の依存の表」に置き換えた / W4 / -
- R3-8: R3 / ケース表の共通カラム / 「rulebook の定める10カラムを定められた順で置く（並びは後述の記入例のとおり）」で同じことが重なっていた / 「rulebook が定める10カラムを、後述の記入例の順で置く。」にまとめた / vp-arc-conciseness / -
- R3-9: R3 / ケース表の共通カラム / 記入例の前の括弧書きが、`証跡` の暫定の書き方を繰り返していた（grade F002） / 括弧書きを削り、「`証跡` は CI 整備後の書き方で、テストコードの位置は未同梱の架空例である。」の 1 文にした / vp-arc-conciseness（F002） / -
- R3-10: R3 / メモ / 将来課題 / CI の行の決定までの扱いが、暫定の書き方を繰り返していた（grade F002） / 「内部結合テストの入口条件の判定までに整備し、整備後に全 term の `証跡` を差し替える」にした。F002 は担当も書くよう求めているが、担当を示す根拠がないため書いていない / vp-arc-conciseness（F002） / 要判断
- R3-11: R3 / メモ / 将来課題 / 表のセルで略語の「UT」を使っていた / 「単体テスト」に改めた / W8 / -
- この段で扱わなかった grade の指摘: F001・F003・F004・F005 は R4 の観点（vp-arc-technical-constraints、vp-dev-implementation-readiness、vp-dev-testability、vp-qe-verifiability）のため R4 に任せた。F006・F007・F008 は R2 の観点（vp-qe-omissions-consistency）で、前の段で直った版になっていた。F009 は kata の段のレビューでは使わない観点（vp-ops-release-readiness）のため外した。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/utc-index-sample.md だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

approach は sample-maintenance。参照の向きを「成果物 → sample」に切り替え、kata-guide の R3（読みやすさ）の観点と W1〜W10 に沿って、既存 sample の文だけを直した。根拠のない推測による追記はしていない。plan に展開された grade の finding のうち、この段の観点に当たる F002 だけを扱った。F001・F003・F004・F005 は R4 の観点のため扱っていない。F006〜F008 は前の段で解消済みの版を読んだ。F009 は kata の段では使わない観点のため扱っていない。未解消の R3-4 と R3-10 は、根拠不足として見送り、申し送りに残した。成果物 frontmatter の `status` は `draft` のまま据え置いた。
