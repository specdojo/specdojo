---
specdojo:
  id: prj-0001:xer-t-kata-review-all-bps-sample-150-20261126t071557z-065152d2
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-bps-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-bps-sample-150/T-KATA-REVIEW-ALL-bps-sample-150-20261126T071557Z-065152d2/plan.md
  started_at: "2026-11-26T07:16:08.092Z"
  completed_at: "2026-11-26T07:22:54.925Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:bps-sample
    - specdojo:bps-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `bps-sample` を、同じ接頭辞の sample 群や業務イベント一覧・全体概要との食い違いについて見直した。
- 業務イベント ID と受領情報を業務イベント一覧に合わせた。基準割れの判定の主体も全体概要に合わせた。
- 仕入グループから戻された補充依頼の入口 `T-02` と、対応する受入観点を足した。
- `br-sample` との補充必要数・用語の食い違いは相手側の判断が要るため、`bps-sample` では変更せず、案を findings に残した。
- executor の検査では markdownlint と prettier が通り、runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 2. トリガー / `T-01` | 業務イベント ID がなく、受領情報が業務イベント一覧（`bes-stock-below-threshold` の付帯情報「下回った時点」）と違っていた。 | 出来事に `bes-stock-below-threshold` を併記し、受領情報の「確認時刻」を「下回った時点」にした。 | `vp-qe-kata-conformance`（bps-rulebook のトリガーと前提条件「BES がある場合は業務イベント ID と名称を併記」、bes-index-sample の `bes-stock-below-threshold` 行） | - |
| R5-2 | R5 | 1. 概要、2. トリガー | 「`P-05` が基準割れと判定した結果を受け取って」とあったが、全体概要では `P-06` が補充基準を下回った商品を特定する。業務イベント一覧では、基準割れは `P-06` の起点で、発生元は在庫の記録を保つ販売管理システムである。 | 概要を「`P-05` が保つ在庫記録で現在庫が補充基準を下回ってからの流れ」に、`T-01` の発生元を「在庫記録を保つ販売管理システム（`P-05`）」に改めた。 | `vp-qe-kata-conformance`（cdfd-overview-sample の `P-05`・`P-06` 行、bes-index-sample、cdfd-sample の委譲先 `cdfd-inventory`「補充基準との比較」） | - |
| R5-3 | R5 | 1. 概要、2. トリガー、8. 検証・受入観点 | cdfd-sample の `E-01-01`（発注内容を未確定として在庫グループへ再検討の数量を引き渡す）と cdfd-uc-sample の「例外時の戻り」（修正・再承認済みの補充依頼を再提示する）に当たる入口が bps-sample になかった。 | `T-02`「仕入グループが補充依頼を未確定として戻した」を足した。戻された依頼は未完了依頼として `S-01` から判定し、補充要なら `E-03` で数量を反映して渡し直すと書いた。開始点に `T-02` を足し、受入観点に「仕入から戻された依頼」の行を足した。選ばなかった案は、`T-02` を足さず、対象外に「仕入から戻された補充依頼の再検討」と委譲先を書くことである。迷った理由は、入口を足すと sample の範囲が広がるためである。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`（bps-rulebook「複数のトリガーは同じ業務成果へ収束することを確認」。出力は補充依頼・重複不要記録に収束し、出力の表は変えていない） | 要判断 |
| R5-4 | R5 | 4. 入力、5. 処理 | bps-sample は `br-reorder-point` が「要否と補充必要数」を判定するとする。一方、br-sample（在庫不足判定）の出力は「不足 / 不足なし」だけで、発注量は対象外である。用語も br-sample は発注点・販売可能数（在庫数から予約数を引く）で、bps-sample・全体概要・業務イベント一覧の補充基準・現在庫と違う。 | bps-sample は変更しない。相手側の直す案は二つある。一つは、br-sample に「`br-reorder-point` として作成する場合」の対応と、発注点と補充基準の語の対応（または補充基準への統一）を書くことである。もう一つは、bps-sample の補充必要数の正本を別の BR とすることである。迷った理由は、br-sample が成果物 ID を名乗っておらず `br-reorder-point` の例と断定できないことと、どちらの文書を直すかで系列の他の sample（全体概要の商品台帳の項目）への影響が変わることである。 | `vp-qe-kata-conformance` | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/bps-sample.md`: トリガーに業務イベント ID `bes-stock-below-threshold` を併記し、受領情報を「下回った時点」に改めた。概要と `T-01` の発生元を全体概要・業務イベント一覧の記述に合わせた。仕入から戻された依頼の入口 `T-02` を足し、開始点と受入観点の表にも反映した。

## 3. 申し送り

- R5-1: R5 / 2. トリガー / `T-01` に業務イベント ID がなく、受領情報が業務イベント一覧（`bes-stock-below-threshold` の付帯情報「下回った時点」）と違っていた / 出来事に `bes-stock-below-threshold` を併記し、受領情報の「確認時刻」を「下回った時点」にした / `vp-qe-kata-conformance`（bps-rulebook のトリガーと前提条件「BES がある場合は業務イベント ID と名称を併記」、bes-index-sample の `bes-stock-below-threshold` 行） / -
- R5-2: R5 / 1. 概要、2. トリガー / 「`P-05` が基準割れと判定した結果を受け取って」とあったが、全体概要では `P-06` が補充基準を下回った商品を特定し、業務イベント一覧では基準割れが `P-06` の起点で発生元は在庫の記録を保つ販売管理システムである / 概要を「`P-05` が保つ在庫記録で現在庫が補充基準を下回ってからの流れ」に、`T-01` の発生元を「在庫記録を保つ販売管理システム（`P-05`）」に改めた / `vp-qe-kata-conformance`（cdfd-overview-sample の `P-05`・`P-06` 行、bes-index-sample、cdfd-sample の委譲先 `cdfd-inventory`「補充基準との比較」） / -
- R5-3: R5 / 1. 概要、2. トリガー、8. 検証・受入観点 / cdfd-sample の `E-01-01`（発注内容を未確定として在庫グループへ再検討の数量を引き渡す）と cdfd-uc-sample の「例外時の戻り」（修正・再承認済みの補充依頼を再提示する）に当たる入口が bps-sample になかった / `T-02`「仕入グループが補充依頼を未確定として戻した」を足した。戻された依頼は未完了依頼として `S-01` から判定し、補充要なら `E-03` で数量を反映して渡し直すと書いた。開始点に `T-02` を足し、受入観点に「仕入から戻された依頼」の行を足した / `vp-qe-kata-conformance`、`vp-dev-change-impact`（bps-rulebook「複数のトリガーは同じ業務成果へ収束することを確認」。出力は補充依頼・重複不要記録に収束し、出力の表は変えていない）。迷った理由: 入口を足すと sample の範囲が広がる。選ばなかった案: `T-02` を足さず、対象外に「仕入から戻された補充依頼の再検討」と委譲先を書く / 要判断
- R5-4: R5 / 4. 入力、5. 処理 / bps-sample は `br-reorder-point` が「要否と補充必要数」を判定するとするが、br-sample（在庫不足判定）の出力は「不足 / 不足なし」だけで発注量は対象外である。用語も br-sample は発注点・販売可能数（在庫数から予約数を引く）で、bps-sample・全体概要・業務イベント一覧の補充基準・現在庫と違う / - / `vp-qe-kata-conformance`。相手側の直す案: br-sample に「`br-reorder-point` として作成する場合」の対応と、発注点と補充基準の語の対応（または補充基準への統一）を書く。または bps-sample の補充必要数の正本を別の BR とする。迷った理由: br-sample は成果物 ID を名乗っておらず `br-reorder-point` の例と断定できない。どちらの文書を直すかで系列の他の sample（全体概要の商品台帳の項目）への影響が変わる / 要判断

## 4. 進め方と実践の型の適用

根拠にした資料は、bps-rulebook のトリガーと前提条件の規定、bes-index-sample、cdfd-overview-sample、cdfd-sample、cdfd-uc-sample、br-sample である。整合する記述は維持し、sample 側で直せる食い違い（R5-1〜R5-3）だけを改訂した。`br-sample` との食い違い（R5-4）は、`br-sample` が成果物 ID を名乗っておらず、どちらを直すかの判断が要るため `bps-sample` は変えず、案だけを残した。R5-3 は、入口を足すと sample の範囲が広がるため要判断とした。
