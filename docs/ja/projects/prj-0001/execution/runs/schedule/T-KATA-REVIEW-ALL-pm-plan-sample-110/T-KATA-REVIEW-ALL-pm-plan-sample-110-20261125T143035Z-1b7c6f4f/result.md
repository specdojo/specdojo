---
specdojo:
  id: prj-0001:xer-t-kata-review-all-pm-plan-sample-110-20261125t143035z-1b7c6f4f
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-pm-plan-sample-110
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-pm-plan-sample-110/T-KATA-REVIEW-ALL-pm-plan-sample-110-20261125T143035Z-1b7c6f4f/plan.md
  started_at: "2026-11-25T14:30:45.961Z"
  completed_at: "2026-11-25T14:42:20.802Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:pm-plan-sample
    - specdojo:pm-plan-sample
---

# Edit Result

## 1. 実施内容

- kata レビュー R1（目的の過不足）として `pm-plan-sample` を確認し、「運用前の準備」にあった成功条件の測定方法の再掲を削り、管理への接続だけに絞った。
- rulebook と template の食い違い 1 件は、rulebook を正として sample には足さず、要判断として findings に残した。
- その他の必須要件と `done_criteria` は満たしていた。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R1-1 | R1 | 4.2. 運用前の準備 / SC-04・SC-05 のベースライン記録 | 採る項目・期間・月次集計と年換算・担当別の作業時間を表と `_ASSUMPTION_` で書いており、成功条件の「判定手順と証跡」の測定方法を本書で再定義していた。採取担当も `BA` としていて、成功条件の `PO` と食い違っていた。 | 表と `_ASSUMPTION_` を削った。正本を成功条件の「判定手順と証跡」とすること、`PM` が記録開始と照合を `kinuya-schedule` の先行作業に置いて U-03 の候補日から逆算し M-04 の見積もりに含めること、比較期間のリスク登録、ベースラインがそろわない場合に `PO` が決めた扱いの反映先だけを残した。 | `vp-qe-kata-conformance`（rulebook の禁止事項「成功基準を本文へ複製する」、本書「管理目的と適用方針」の再定義しない方針）、`vp-arc-single-responsibility` | - |
| R1-2 | R1 | 1. 管理目的と適用方針 | template の `_TODO_` は「人間とAI Agentの判断・実行境界」の記述を求める。しかし rulebook の本文要件「管理範囲の選定」にはその項目がなく、sample にも記述がない。 | sample には足していない。相手側を直す案は、rulebook の「管理範囲の選定」に判断・実行境界を加えるか、template の `_TODO_` から外して rulebook とそろえるかのどちらか。 | `vp-qe-kata-conformance`。rulebook を正として扱った。どちらを選ぶか決められなかった。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/pm-plan-sample.md`: 「運用前の準備」から、SC-04・SC-05 のベースライン記録の項目・期間・月次集計と年換算・担当別作業時間を述べた表と `_ASSUMPTION_` を削除した（2 行追加・9 行削除）。正本を成功条件の「判定手順と証跡」とし、`PM` が記録開始と照合を `kinuya-schedule` の先行作業に置くこと、比較期間のリスク登録、ベースラインがそろわない場合の `PO` の決定の反映先だけを残した。採取担当が成功条件の `PO` と食い違っていた点も解消した。

## 3. 申し送り

- R1-2 は sample 側では直していない。rulebook の「管理範囲の選定」に判断・実行境界を加えるか、template の `_TODO_` から外すかの選択は人の判断に委ねる。
- R1-1: R1 / 4.2. 運用前の準備 / SC-04・SC-05 のベースライン記録について、採る項目・期間・月次集計と年換算・担当別の作業時間を表と `_ASSUMPTION_` で書いており、成功条件の「判定手順と証跡」の測定方法を本書で再定義していた。さらに採取担当を `BA` としていて、成功条件の `PO` と食い違っていた / 表と `_ASSUMPTION_` を削った。正本を成功条件の「判定手順と証跡」とすること、`PM` が記録開始と照合を `kinuya-schedule` の先行作業に置いて U-03 の候補日から逆算し M-04 の見積もりに含めること、比較期間のリスク登録と、ベースラインがそろわない場合に `PO` が決めた扱いの反映先だけを残した / `vp-qe-kata-conformance`（rulebook の禁止事項「成功基準を本文へ複製する」、本書の「管理目的と適用方針」の再定義しない方針）、`vp-arc-single-responsibility` / -
- R1-2: R1 / 1. 管理目的と適用方針 / template の `_TODO_` は「人間とAI Agentの判断・実行境界」の記述を求めるが、rulebook の本文要件「管理範囲の選定」にはその項目がなく、sample にも記述がない / - / `vp-qe-kata-conformance`。rulebook を正として sample には足さなかった。相手側を直す案は、rulebook の「管理範囲の選定」に判断・実行境界を加えるか、template の `_TODO_` から外して rulebook とそろえるかのどちらか。どちらを選ぶか決められなかったため要判断とした / 要判断
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/pm-plan-sample.md だけで、plan・result・個票などの履歴ファイルを変更していないため）

## 4. 進め方と実践の型の適用

根拠は rulebook の禁止事項「成功基準を本文へ複製する」、本書「管理目的と適用方針」の再定義しない方針、`vp-qe-kata-conformance`、`vp-arc-single-responsibility` である。再掲は削って参照に置き換え、PM の管理接続（先行作業・見積もり・リスク登録・反映先）は判断に要るため維持した。rulebook と template が食い違う箇所は rulebook を正とし、推測で sample に足さなかった。
