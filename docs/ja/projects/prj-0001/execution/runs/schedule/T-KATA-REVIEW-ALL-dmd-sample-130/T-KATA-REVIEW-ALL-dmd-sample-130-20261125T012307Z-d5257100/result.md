---
specdojo:
  id: prj-0001:xer-t-kata-review-all-dmd-sample-130-20261125t012307z-d5257100
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-dmd-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-dmd-sample-130/T-KATA-REVIEW-ALL-dmd-sample-130-20261125T012307Z-d5257100/plan.md
  started_at: "2026-11-25T01:23:16.724Z"
  completed_at: "2026-11-25T01:35:29.645Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:dmd-sample
    - specdojo:dmd-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/dmd-sample.md` の文を 5 か所直した（W2・W3・W4・W5、`vp-arc-conciseness`）。意味と判断に要る背景・例外・制約は変えていない。
- grade の F001（手順 1・3・4・5 の実行担当がない、観点 `vp-pm-plan-feasibility`）は、kata のレビューで使わない観点のため直さず、要判断として申し送った。
- 検査は、executor の prettier と markdownlint-cli2、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` が通った。ほかの検査は変更種別により `not_applicable` である。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/dmd-sample.md`: 文の読みやすさを直した（6 行追加・5 行削除）。概要の前提の文を 2 文に分けた。残高の締め時点の修飾関係を明確にした。除外ルールは作業と理由を分けた。性能/所要時間見積の `_UNDECIDED_` の文を 2 文に分けた。リスクと対策を別項目にして、締め時点を「切替日の前日の閉店後」に統一した。

## 3. 申し送り

- 指摘一覧（No・段・箇所・指摘・直した案・根拠・印）。reporter が result の実施内容へ表にまとめる。
- R3-1 / R3 / 1. 概要（credit-data） 前提の文 / 括弧の中を含めて長く、一文に二つの主張がある / 「前提は `mip-index` の並行移行と成功条件である」と「並行移行では切替日の午前を臨時休業にして取り込み、1 週間の並行記録の後に正本を切り替える」の 2 文に分けた / W3 / -
- R3-2 / R3 / 2. 対象データ詳細 / 「最終棚卸と同じ切替日の前日の閉店後」で、「最終棚卸と同じ」がどの語にかかるか読めない / 「残高の締めは切替日の前日の閉店後とし、最終棚卸と同じ時点にそろえる」にした / W5 / -
- R3-3 / R3 / 5. 除外ルール / 理由と作業が一文にねじれて並ぶ / 「除外せず、備考欄に『取り消し線あり』と残す。除外すると移行後に残高を請求できなくなるためである」と作業と理由を分けた / W2 / -
- R3-4 / R3 / 7. 性能/所要時間見積 `_UNDECIDED_` の文 / 理由と決め手を一文に詰めて長い / 「…判定できない。店主代表が移行リハーサルの結果を見て決める」の 2 文に分けた / W3 / -
- R3-5 / R3 / 7. 性能/所要時間見積 リスクと対策 / 1 項目にリスクと対策の 2 論点がある。「当日は残高だけを前日の閉店後に」は当日と前日が食い違って読める / 「リスク:」と「対策:」の 2 項目に分け、「残高だけを切替日の前日の閉店後に読み合わせておく」と言い切った / W4、`vp-arc-conciseness` / -
- R3-6 / R3 / 6. 移行手順（手動/バッチ/ツール） / grade F001（手順 1・3・4・5 の実行担当がない）は観点 `vp-pm-plan-feasibility` の指摘で、R3 の観点に当たらない / 直していない。kata-guide で `vp-pm-plan-feasibility` は kata のレビューでは使わない観点とされているため。手順の担当を書く場合は、rulebook（`specdojo:dmd-rulebook`）の手順表が担当を求めるかを R1 で確かめる案がある / 要判断
- R3-1: R3 / 1. 概要（credit-data） / 前提の文が括弧の中を含めて長く、一文に二つの主張がある / 「前提は mip-index の並行移行と成功条件である」と「並行移行では切替日の午前を臨時休業にして取り込み、1 週間の並行記録の後に正本を切り替える」の 2 文に分けた / W3 / -
- R3-2: R3 / 2. 対象データ詳細 / 「最終棚卸と同じ切替日の前日の閉店後」の修飾「最終棚卸と同じ」がどの語にかかるか読めない / 「残高の締めは切替日の前日の閉店後とし、最終棚卸と同じ時点にそろえる」にした / W5 / -
- R3-3: R3 / 5. 除外ルール / 「除外すると…請求できなくなるためで、備考欄に…残す」と、理由と作業が一文にねじれて並ぶ / 「除外せず、備考欄に『取り消し線あり』と残す。除外すると移行後に残高を請求できなくなるためである」と作業と理由を分けた / W2 / -
- R3-4: R3 / 7. 性能/所要時間見積 / `_UNDECIDED_` の文が理由と決め手を一文に詰めて長い / 「…判定できない。店主代表が移行リハーサルの結果を見て決める」の 2 文に分けた / W3 / -
- R3-5: R3 / 7. 性能/所要時間見積 / 「リスクと対策」の 1 項目にリスクと対策の 2 論点がある。「当日は残高だけを前日の閉店後に」は当日と前日が食い違って読める / 「リスク:」と「対策:」の 2 項目に分け、「残高だけを切替日の前日の閉店後に読み合わせておく」と言い切った / W4、vp-arc-conciseness / -
- R3-6: R3 / 6. 移行手順（手動/バッチ/ツール） / grade F001（手順 1・3・4・5 の実行担当がない）は観点 vp-pm-plan-feasibility の指摘で、R3 の観点にも当たらない / - / kata-guide の「kata の観点の組」で vp-pm-plan-feasibility は kata のレビューでは使わない観点とされているため直さなかった。手順の担当を書く場合は、rulebook（specdojo:dmd-rulebook）の手順表が担当を求めるかを R1 で確かめる案がある / 要判断

## 4. 進め方と実践の型の適用

根拠は kata-guide の「kata を agent でレビューする」と「文章のチェック項目」（W1〜W10）、`vp-arc-conciseness`、sample-authoring-standard である。前の段が直した版を読み、前の段の指摘は繰り返していない。直したのは、W2・W3・W4・W5 に当たる文の構造だけである。成功条件・許容差・残高の締め時点などの判断に要る内容は維持した。F001 は観点が `vp-pm-plan-feasibility` で、kata のレビューでは使わない観点のため未解消とした。理由は、観点の割り当てが R3 に当たらないことである。次のアクションは、手順表に実行担当を求める記述が rulebook にあるかを R1 で確かめ、求めるなら担当列か備考を足すことである。grade result のサイドカーは直接編集していない。
