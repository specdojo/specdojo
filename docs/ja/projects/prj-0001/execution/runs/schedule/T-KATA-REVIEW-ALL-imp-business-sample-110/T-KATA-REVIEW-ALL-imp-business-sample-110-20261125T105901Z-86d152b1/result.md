---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-business-sample-110-20261125t105901z-86d152b1
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-business-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-business-sample-110/T-KATA-REVIEW-ALL-imp-business-sample-110-20261125T105901Z-86d152b1/plan.md
  started_at: "2026-11-25T10:59:12.720Z"
  completed_at: "2026-11-25T11:13:10.686Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-business-sample
    - specdojo:imp-business-sample
---

# Edit Result

## 1. 実施内容

- R1（目的の過不足）の段として、grade の finding F001 の 1 件を `docs/ja/specdojo/samples/imp-business-sample.md` で直した。
- 1 つ目の成功条件の現状値が `_UNDECIDED_` のまま、未解決事項に計測の論点がなかった。未解決事項の表に「会計時間の現状値の計測」の行を足した。成功条件の表の現状値の欄は、この行を指す書き方に変えた。
- 変更は sample 1 ファイルだけ。rulebook など sample 以外は変更していない。
- runner の検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が passed になった。変更ファイルの種類に合わない検査は `not_applicable` になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-business-sample.md`: 成功条件の表で、1 つ目の成功条件の現状値の欄を「`_UNDECIDED_`: 未解決事項「会計時間の現状値の計測」で記入する」に変えた。未解決事項の表には「会計時間の現状値の計測」の行を足した。不足情報は 2026-05-07〜2026-05-13 の平日 16:00-18:00 の平均処理時間、決定期限は 2026-05-13、担当は `BA`、転記先は `PJR-B4Q4`（`question`）とした。表は prettier で整え直した。差分は 8 行追加・7 行削除。

## 3. 申し送り

- 指摘一覧（R1）。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | 1 | R1 | 変更要求の概要の成功条件の表（1 つ目の成功条件の現状値）と未解決事項の表 | 現状値が `_UNDECIDED_` のままなのに、未解決事項に計測の論点がない（F001） | 未解決事項に「会計時間の現状値の計測」の行を足し、成功条件の現状値の欄からその行を指すようにした | imp-business-rulebook の未解決事項の章の目的と、記述ガイドの未解決事項（調査が必要な事項は `question` として登録簿へ転記する）。観点は R1 の `vp-qe-kata-conformance`。grade の `vp-ba-business-value` は kata の段では使わない観点のため、R1 の観点に置き換えて扱った | なし | | 2 | R1 | 未解決事項の表の転記先 `PJR-B4Q4` | 足した行の転記先の登録項目 ID は架空のもので、ほかの sample や登録簿からは参照されていない | 既にある `PJR-B4Q1` から `PJR-B4Q3` に続く番号として `PJR-B4Q4` を付けた。番号の付け方を変えるかは人が決める | 既存の未解決事項の行の ID の付け方 | 要判断 |
- No: 1 / 段: R1 / 箇所: 変更要求の概要の成功条件の表（1 つ目の成功条件の現状値）と未解決事項の表 / 指摘: 現状値が `_UNDECIDED_` のままなのに、未解決事項に計測の論点がない。rulebook の未解決事項の章（判断待ち・調査不足を示す）の求めに足りない（F001） / 直した案: 未解決事項に「会計時間の現状値の計測」の行（不足情報: 2026-05-07〜2026-05-13 の平日 16:00-18:00 の平均処理時間、決定期限 2026-05-13、担当 `BA`、転記先 `PJR-B4Q4`（`question`））を足し、成功条件の現状値の欄を「`_UNDECIDED_:` 未解決事項「会計時間の現状値の計測」で記入する」に変えた / 根拠: imp-business-rulebook の本文要件（未解決事項の章の目的）と記述ガイドの未解決事項（調査が必要な事項は `question` として登録簿へ転記する）。観点は R1 の `vp-qe-kata-conformance`。grade の `vp-ba-business-value` は kata-guide で kata の段では使わない観点のため、R1 の観点に置き換えて扱った / 印: なし
- No: 2 / 段: R1 / 箇所: 未解決事項の表の転記先 `PJR-B4Q4` / 指摘: 足した行の転記先の登録項目 ID は架空のもので、ほかの sample や登録簿からは参照されていない / 直した案: 既にある `PJR-B4Q1` から `PJR-B4Q3` に続く番号として `PJR-B4Q4` を付けた。ほかの番号の付け方にするかは人が決める / 根拠: 既存の未解決事項の行の ID の付け方 / 印: 要判断

## 4. 進め方と実践の型の適用

根拠にしたのは、plan に展開された finding F001、imp-business-rulebook の未解決事項の章の目的、記述ガイドの未解決事項の扱い（調査が必要な事項は `question` として登録簿へ転記する）、sample 記述標準。F001 の問題は、未解決事項に計測の論点を足し、成功条件の現状値の欄からその行を指すことで解消した。未解決事項の行は、既存の行と同じ列の並びと ID の付け方に合わせた。それ以外の記述は根拠と整合しているため維持した。未解決の点は `PJR-B4Q4` の採番で、「要判断」の印を付けて人に回す。
