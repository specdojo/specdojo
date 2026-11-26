---
specdojo:
  id: prj-0001:xer-t-kata-review-all-trc-requirements-to-tests-sample-150-20261125t142752z-47c3f795
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-150/T-KATA-REVIEW-ALL-trc-requirements-to-tests-sample-150-20261125T142752Z-47c3f795/plan.md
  started_at: "2026-11-25T14:28:01.110Z"
  completed_at: "2026-11-25T14:39:27.855Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:trc-requirements-to-tests-sample
    - specdojo:trc-requirements-to-tests-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `trc-requirements-to-tests-sample` を、同じ接頭辞の index sample（`atc-index-sample`・`stc-index-sample`・`tsp-index-sample`）の分割基準と照合した。「ギャップと対応方針」の表で SC-07 の行と SC-09・AC-02・AC-05 の行を 1 行に統合し、sample 側の食い違いを解消した。
- マトリクス、母集団外の参照、件数は参照先の sample と一致していたので変更していない。
- grade の F001（対象列の文書 ID 付与と区切りの統一）は前の段で解消済みで、`vp-ux-language-consistency`（R3 の観点）に当たるため、R5 では追加修正していない。
- `sac-sample` の下位ケースの記述に食い違いがある。相手側を直す案を findings と handoff に残し、本タスクでは変更していない。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md の「ギャップと対応方針」の SC-07 の行と SC-09・AC-02・AC-05 の行 | SC-07 の行は直し方を「`atc-index` の分割基準で SC-07 を受け持つ受入テストを決め」としていた。しかし atc-index-sample の分割基準の表は、SC-07 をすでに `atc-stock-credit-check` に受け持たせている。SC-09・AC-02・AC-05 の行は受入テストしか挙げていなかった。しかし stc-index-sample は AC-02・AC-05 を `stc-stock-update`・`stc-credit-balance` に受け持たせ、tsp-index-sample も総合テストの対象に AC-05・AC-02 を挙げている。 | 2 行を SC-07・SC-09・AC-02・AC-05 の 1 行にまとめた。直し方は `atc-stock-credit-check` の作成に加え、`stc-stock-update`・`stc-credit-balance` の「トレース」の表に AC-02・AC-05 を持たせることとし、判定条件を「4 行が `一部充足` 以上」に改めた（sample 側を修正済み）。 | atc-index-sample の `atc-stock-credit-check` の行（SC-01、SC-07、SC-09、AC-02、AC-05）、stc-index-sample の分割基準の表、tsp-index-sample の総合テストの対象、trc-requirements-to-tests-rulebook の編集の境界（ギャップごとの対応方針は作成者が書く）。 | - |
| 2 | R5 | docs/ja/specdojo/samples/sac-sample.md の「下位」の記述（`st-cash-sale-commit-response-010` が `SAC-PERF-01`・`SAC-PERF-02` を分解して測る） | stc-sample では SAC-PERF-02（TR-06）を `st-cash-sale-commit-records-010` が受け持つ。`st-cash-sale-commit-response-010` が参照するのは TR-05・TR-07（SAC-PERF-01）だけである。本書の母集団外の参照の表は stc-sample に合っているので、食い違っているのは sac-sample の側である。 | 相手側の sac-sample を直す。下位の記述を「`st-cash-sale-commit-response-010` が `SAC-PERF-01` を、同じ試行の記録を使う `st-cash-sale-commit-records-010` が `SAC-PERF-02` を測る」に改める（本タスクでは変更していない）。 | stc-sample の「トレース」の表の TR-06・TR-07 と、ケース表の `st-cash-sale-commit-response-010`・`st-cash-sale-commit-records-010` の `トレース` 列。 | 要判断 |
| 3 | R5 | grade finding F001（「ギャップと対応方針」の対象列） | 各項目への文書 ID の付与と区切りの `,` への統一は、前の段で済んでいて追加の修正は要らない。この指摘は `vp-ux-language-consistency`（R3 の観点）に当たるので、R5 では直していない。 | - | 現行の対象列はすべての項目に要求文書 ID が付き、`,` で区切られている。kata-guide の「kata の観点の組」では R3 の観点としている。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md`: 「ギャップと対応方針」の表で SC-07 の行と SC-09・AC-02・AC-05 の行を 1 行にまとめた。直し方は `atc-stock-credit-check` の作成に加え、`stc-stock-update`・`stc-credit-balance` の「トレース」の表に AC-02・AC-05 を持たせることとし、判定条件を「4 行が `一部充足` 以上」に改めた。あわせて prettier で表の列幅をそろえた。

## 3. 申し送り

- `sac-sample` の「下位」の記述の修正は本タスクの対象外で、別途扱うかどうかの判断が要る（findings の No 2 を参照）。
- No: 1 / 段: R5 / 箇所: docs/ja/specdojo/samples/trc-requirements-to-tests-sample.md の「ギャップと対応方針」の SC-07 の行と SC-09・AC-02・AC-05 の行 / 指摘: SC-07 の行は直し方を「`atc-index` の分割基準で SC-07 を受け持つ受入テストを決め」としていたが、atc-index-sample の分割基準の表は SC-07 をすでに `atc-stock-credit-check` に受け持たせている。また SC-09・AC-02・AC-05 の行は受入テストしか挙げていなかったが、stc-index-sample は AC-02・AC-05 を `stc-stock-update`・`stc-credit-balance` に受け持たせ、tsp-index-sample も総合テストの対象に AC-05・AC-02 を挙げている / 直した案: 2 行を SC-07・SC-09・AC-02・AC-05 の 1 行にまとめた。直し方は `atc-stock-credit-check` の作成に加え、`stc-stock-update`・`stc-credit-balance` の「トレース」の表に AC-02・AC-05 を持たせることとし、判定条件を「4 行が `一部充足` 以上」に改めた（sample 側を修正済み） / 根拠: atc-index-sample の `atc-stock-credit-check` の行（SC-01、SC-07、SC-09、AC-02、AC-05）、stc-index-sample の分割基準の表、tsp-index-sample の総合テストの対象、trc-requirements-to-tests-rulebook の編集の境界（ギャップごとの対応方針は作成者が書く） / 印: なし
- No: 2 / 段: R5 / 箇所: docs/ja/specdojo/samples/sac-sample.md の「下位」の記述（「`st-cash-sale-commit-response-010` が `SAC-PERF-01`・`SAC-PERF-02` を分解して測る」） / 指摘: stc-sample では SAC-PERF-02（TR-06）を `st-cash-sale-commit-records-010` が受け持ち、`st-cash-sale-commit-response-010` は TR-05・TR-07（SAC-PERF-01）だけを参照している。本書の母集団外の参照の表は stc-sample に合っているので、食い違っているのは sac-sample の側である / 直した案: 相手側の sac-sample を直す。下位の記述を「`st-cash-sale-commit-response-010` が `SAC-PERF-01` を、同じ試行の記録を使う `st-cash-sale-commit-records-010` が `SAC-PERF-02` を測る」に改める（本タスクでは変更していない） / 根拠: stc-sample の「トレース」の表の TR-06・TR-07 と、ケース表の `st-cash-sale-commit-response-010`・`st-cash-sale-commit-records-010` の `トレース` 列 / 印: 要判断（対象の kata の外にあるため、sac-sample の見直しで扱うかを人が決める）
- No: 3 / 段: R5 / 箇所: grade finding F001（「ギャップと対応方針」の対象列） / 指摘: 各項目への文書 ID の付与と区切りの `,` への統一は、前の段で済んでいて追加の修正は要らない。この指摘は `vp-ux-language-consistency`（R3 の観点）に当たるので、R5 では直していない / 直した案: なし（再評価で解消を確かめる） / 根拠: 現行の対象列はすべての項目に `&lt;要求文書ID&gt;` が付き、`,` で区切られている。kata-guide の「kata の観点の組」では R3 の観点としている / 印: なし
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル（plan・result・個票）を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更した `*.yaml` / `*.yml` ファイルがないため）

## 4. 進め方と実践の型の適用

kata-guide の R5（整合）に従い、`trc-requirements-to-tests-sample` を `atc-index-sample`・`stc-index-sample`・`tsp-index-sample`・`stc-sample`・`sac-sample` と照合した。矛盾時は `trc-requirements-to-tests-rulebook` を正とした。ギャップごとの対応方針は作成者が書く、という編集の境界に従い、sample 側の方針だけを直した。F001 は R3 の観点に当たり、現行の対象列はすべての項目に要求文書 ID が付いて `,` で区切られているため、解消済みとして維持した。再評価で解消を確かめる。grade result サイドカーは直接編集していない。frontmatter の `status` は `draft` のまま据え置いた。
