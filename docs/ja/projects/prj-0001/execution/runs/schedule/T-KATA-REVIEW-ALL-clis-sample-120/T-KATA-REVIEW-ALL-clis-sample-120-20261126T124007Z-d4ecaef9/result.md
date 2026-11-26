---
specdojo:
  id: prj-0001:xer-t-kata-review-all-clis-sample-120-20261126t124007z-d4ecaef9
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-clis-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-clis-sample-120/T-KATA-REVIEW-ALL-clis-sample-120-20261126T124007Z-d4ecaef9/plan.md
  started_at: "2026-11-26T12:40:17.497Z"
  completed_at: "2026-11-26T12:50:04.437Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:clis-sample
    - specdojo:clis-sample
---

# Edit Result

## 1. 実施内容

- kata レビュー R2（構成）として、`docs/ja/specdojo/samples/clis-sample.md` の「代表的な表示と利用者の次の手」の表を操作の流れの順に並べ替え、会計確定の前提（`_ASSUMPTION_`）を表の前へ移した。
- grade の指摘 F001・F002 は R2 の観点外として扱わず、F003・F004 は R1 で解消済みとして直していない。
- Prettier の確認と runner の lint・スキーマ検証は通過した。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 6.2. 代表的な表示と利用者の次の手 / 表の行 | 表の行が操作の流れの順になっていない。「取引未開始・取引二重開始」「取引記録破損」が会計入力の行より後にあり、「明細なし」が預かり金の行より後にある。 | 行を 前提（設定・認証）、開始・取引状態、明細追加、会計前の確認・預かり金、売上登録・印字、保存失敗 の順に並べ替えた。行の中身は変えていない。 | `vp-arc-document-structure`（前提から結論の順に読めるか）、rulebook「操作の流れ」との対応 | - |
| R2-2 | R2 | 6.2. 代表的な表示と利用者の次の手 / 会計確定の通知条件と照合待ちの前提（`_ASSUMPTION_`） | 前提が表の後にあり、表の「売上登録失敗」などの行を読んだ後でしか前提が分からない。 | `_ASSUMPTION_` を小節の見出しの直後、表の前へ移した。 | `vp-arc-document-structure`（前提から結論の順） | - |
| R2-3 | R2 | grade の指摘 F001・F002（7. メモ / 将来課題） | 担当役割・確認の時期・管理先を追記するよう求める指摘は、`vp-pm-plan-feasibility`・`vp-pm-control-reporting` の観点のものである。 | - | kata-guide の「kata の観点の組」では、これらの観点を kata の段のレビューに使わないとしている。rulebook の全体方針では、役割の割り当てと未決事項の引き継ぎを、適用先のメンバー定義とドキュメントメタ情報標準に任せている。そのため対象外とした。 | - |
| R2-4 | R2 | grade の指摘 F003・F004（6.2. 取引セッション保存失敗） | 取引開始の保存失敗の回復手順についての指摘は、R1 が「開始」と「追加・取消」の行を分け、取引未開始の確認、`sales start` の再試行、取引番号の表示による回復確認を書いた時点で解消している。 | - | `vp-qe-omissions-consistency`。R1 の指摘を繰り返さないため直していない。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/clis-sample.md`: 「代表的な表示と利用者の次の手」の表の行を、前提（設定・認証）、開始・取引状態、明細追加、会計前の確認・預かり金、売上登録・印字、保存失敗の順に並べ替えた。会計確定の通知条件と、会計要求後の停止を照合待ちとする前提（`_ASSUMPTION_`）は、小節の見出し直後で表の前に移した。行の中身は変えていない。

## 3. 申し送り

- F001・F002 は `vp-pm-plan-feasibility`・`vp-pm-control-reporting` の観点で、kata のレビュー段の観点外のため対象外とした。担当役割や管理先の扱いは rulebook の全体方針に従い、メンバー定義とドキュメントメタ情報標準に任せる。
- F003・F004 は R1 が「開始」と「追加・取消」の行を分けた時点で解消済みと executor が判断した。R1 の指摘の繰り返しを避け、直していない。
- R2-1: R2 / 6.2. 代表的な表示と利用者の次の手 / 表の行が操作の流れの順になっていない。「取引未開始・取引二重開始」「取引記録破損」が会計入力の行より後にあり、「明細なし」が預かり金の行より後にある / 行を 前提（設定・認証）→ 開始・取引状態 → 明細追加 → 会計前の確認・預かり金 → 売上登録・印字 → 保存失敗 の順に並べ替えた（行の中身は変えていない） / `vp-arc-document-structure`（前提から結論の順に読めるか）、rulebook「操作の流れ」との対応 / -
- R2-2: R2 / 6.2. 代表的な表示と利用者の次の手 / 会計確定の通知条件と、会計要求後の停止を照合待ちとして扱う前提（`_ASSUMPTION_`）が表の後にあり、表の「売上登録失敗」などの行を読んだ後でしか前提が分からない / `_ASSUMPTION_` を小節の見出しの直後、表の前へ移した / `vp-arc-document-structure`（前提から結論の順） / -
- R2-3: R2 / grade の指摘 F001・F002（7. メモ / 将来課題） / 担当役割・確認の時期・管理先を追記するよう求める指摘は、`vp-pm-plan-feasibility`・`vp-pm-control-reporting` の観点のもの / - / kata-guide の「kata の観点の組」では、これらの観点を kata の段のレビューに使わないとしている。また rulebook の全体方針では、役割の割り当てと未決事項の引き継ぎを適用先のメンバー定義とドキュメントメタ情報標準に任せている。そのため対象外とした / -
- R2-4: R2 / grade の指摘 F003・F004（6.2. 取引セッション保存失敗） / 取引開始の保存失敗の回復手順についての指摘は、R1 が「開始」と「追加・取消」の行を分け、取引未開始の確認・`sales start` の再試行・取引番号の表示で回復を確かめることを書いた時点で解消している / - / `vp-qe-omissions-consistency`。R1 の指摘を繰り返さないため直していない / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/clis-sample.md のみで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がない）

## 4. 進め方と実践の型の適用

R2（構成）の観点で、章の順と表・本文の配置が前提から結論の順に読めるかを確認した。`vp-arc-document-structure` を根拠に、表の行順と `_ASSUMPTION_` の位置だけを直した。sample 以外は変更していない。grade の finding は kata-guide の「kata の観点の組」に照らし、R2 に当たらないものを扱わなかった。
