---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-index-sample-120-20261125t213832z-5d40a693
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-index-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-index-sample-120/T-KATA-REVIEW-ALL-nfr-index-sample-120-20261125T213832Z-5d40a693/plan.md
  started_at: "2026-11-25T21:38:41.472Z"
  completed_at: "2026-11-25T21:46:24.376Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-index-sample
    - specdojo:nfr-index-sample
---

# Edit Result

## 1. 実施内容

- R2（構成）の段を実施した。sample は変更していない（`changes` は空）。章 1〜5 の順序と見出しは rulebook の本文要件の 5 見出しとそろっている。どの章も表の前の 1 文、表、補足の順で、前提から結論の順に読める。
- template は `undecided` で存在しないため、構成の照合先は rulebook の本文要件だけにした。
- grade の F001（`_UNDECIDED_` の次の行動）と F002（監査ログ保管期間の再掲）は、R1 が直した版ではすでに当てはまらない。F001 の観点 `vp-po-decision-readiness` は kata のレビューでは外す観点で、F002 の冗長さは R3 の観点なので、この段では扱わない。
- 迷った指摘 1 件（R2-4）に「要判断」の印を付けた。rulebook 側の直す案も 1 件ある（R2-5）。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 全体（1〜5 章） | 章の順序と見出しは rulebook「本文要件」の 5 見出しとそろっている。どの章も表の前の 1 文、表、補足の順で、前提から結論の順に読める。 | - | `vp-arc-document-structure`、rulebook「本文要件」「記述ガイド」（template は `undecided` のため本文要件だけで照合した） | - |
| R2-2 | R2 | 3. 分冊ドキュメント一覧（ID/参照先） | grade の F001 が指す備考の `_UNDECIDED_`（営業時間外の緊急連絡手段）は、R1 が直した版には残っていない。指摘の観点 `vp-po-decision-readiness` も kata のレビューでは外す観点なので、構成の直しは要らない。 | - | F001、kata-guide「kata の観点の組」 | - |
| R2-3 | R2 | 3. 分冊ドキュメント一覧（ID/参照先） | grade の F002 が指す備考の目標値「監査ログの保管期間 1 年」は、R1 が直した版では「監査ログの保管期間は `opd-index` と揃える」になり、値の再掲はもうない。冗長さは R3 の観点なので、この段では繰り返さない。 | - | F002、`vp-arc-conciseness`（R3） | - |
| R2-4 | R2 | 3. 分冊ドキュメント一覧（ID/参照先） | 表の後の文「目標値が `_UNDECIDED_` の分冊は、その指標で合否を判定せず、発生の記録だけを残す」と、性能の備考「決まるまで総合テストは仮置き基準で測る」は、仮置きの基準で合否を決めるのかが読み分けにくい。 | 性能の備考を「決まるまで総合テストは仮置き基準で測った値だけを記録する」に直す案がある。文の直しなので R3 または R5 に任せた。 | `vp-qe-omissions-consistency`。迷った理由: 「仮置き基準で測る」は合否を決めずに測った値を残すとも読め、矛盾とは言い切れない。 | 要判断 |
| R2-5 | R2 | （rulebook） | rulebook の `template: undecided` と全体方針の `_UNDECIDED_` が残っているため、構成を照らし合わせる先が本文要件だけになっている。 | 本文要件にそろった sample を元に、NFR 分冊と共通の template にするかを決め、その結果で `template` を埋める。 | rulebook `specdojo:nfr-index-rulebook` の全体方針 | - |

## 2. 変更ファイル

- なし

## 3. 申し送り

- R2-1: R2 / 全体（1〜5 章） / 章の順序と見出しは rulebook「本文要件」の 5 見出しとそろっている。どの章も表の前の 1 文、表、補足の順で、前提から結論の順に読める / - / `vp-arc-document-structure`、rulebook「本文要件」「記述ガイド」（template は `undecided` のため本文要件だけで照合した） / -
- R2-2: R2 / 3. 分冊ドキュメント一覧（ID/参照先） / grade の F001 が指す備考の `_UNDECIDED_`（営業時間外の緊急連絡手段）は、R1 が直した版には残っていない。指摘の観点 `vp-po-decision-readiness` も kata のレビューでは外す観点（kata-guide「kata の観点の組」）なので、構成の直しは要らない / - / F001、kata-guide「kata の観点の組」 / -
- R2-3: R2 / 3. 分冊ドキュメント一覧（ID/参照先） / grade の F002 が指す備考の目標値「監査ログの保管期間 1 年」は、R1 が直した版では「監査ログの保管期間は `opd-index` と揃える」になり、値の再掲はもうない。冗長さは R3 の観点なので、この段では繰り返さない / - / F002、`vp-arc-conciseness`（R3） / -
- R2-4: R2 / 3. 分冊ドキュメント一覧（ID/参照先） / 表の後の文「目標値が `_UNDECIDED_` の分冊は、その指標で合否を判定せず、発生の記録だけを残す」と、性能の備考「決まるまで総合テストは仮置き基準で測る」は、仮置きの基準で合否を決めるのかが読み分けにくい / - / `vp-qe-omissions-consistency`。迷った理由: 「仮置き基準で測る」は合否を決めずに測った値を残すとも読め、矛盾とは言い切れない。選ばなかった案: 性能の備考を「決まるまで総合テストは仮置き基準で測った値だけを記録する」に直す。文の直しなので R3 または R5 に任せた / 要判断
- R2-5: R2 / （rulebook） / rulebook の `template: undecided` と全体方針の `_UNDECIDED_` が残っているため、構成を照らし合わせる先が本文要件だけになっている / - / rulebook `specdojo:nfr-index-rulebook` の全体方針。相手側を直す案: 本文要件にそろった sample を元に、NFR 分冊と共通の template にするかを決め、その結果で `template` を埋める / -

## 4. 進め方と実践の型の適用

参照の向きを「成果物 → sample」に切り替え、R1 が直した版の sample を読んで構成を確かめた。照合先は rulebook の本文要件で、template は `undecided` のため使っていない。章の移動・分割・統合が要る箇所は見つからなかったので、sample は維持した。grade の F001・F002 は、R1 の修正で解消済みか、この段の観点に当たらないと判断した。rulebook は変更せず、直す案を findings に残した。
