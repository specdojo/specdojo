---
specdojo:
  id: prj-0001:xer-t-kata-review-all-mtp-sample-120-20261125t213313z-a65a7d7d
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-mtp-sample-120
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-mtp-sample-120/T-KATA-REVIEW-ALL-mtp-sample-120-20261125T213313Z-a65a7d7d/plan.md
  started_at: "2026-11-25T21:33:24.008Z"
  completed_at: "2026-11-25T21:39:26.523Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:mtp-sample
    - specdojo:mtp-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R2（構成）を実施した。9 章の順、各表の列、前提から結論への流れは `mtp-rulebook` の本文要件に沿っていた。
- 再実行の上限（回数・期限・判定者・NO-GO の条件）が差異発生時の扱いの章になくスケジュール表を見に行く形だったため、これを差異の扱いの章へ集約した。変更は `docs/ja/specdojo/samples/mtp-sample.md` の 2 行のみ。
- plan に展開された grade の F001〜F003 は、R2 の観点に当たらないため直していない。F001 は R5、F002 は R4、F003 は R3 の観点で扱う。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R2-1 | R2 | 6. 差異発生時の扱い（許容/修正/再実行）、2. リハーサル回数とスケジュール | 再実行の上限（回数と期限）が差異の扱いの章になく、スケジュール表を見に行く形だった。追加の回の完了条件にも NO-GO の規則が混ざっていた。 | 差異の扱いの章の再実行の上限に「追加の回は 1 回まで、期限は切替日の 2 日前の閉店後まで、PO が判断して `pm-decision-log` へ転記、上限を超えたら NO-GO」をまとめた。スケジュール表の追加の回の完了条件から NO-GO の一文を外した。予定日の「1 回まで」は日程として残した。 | vp-arc-document-structure。`mtp-rulebook` の本文要件が差異発生時の扱いの章に「再実行の上限（回数と期限）と判定者」を求めている。 | - |
| R2-2 | R2 | 全体（章構成） | 9 章の順、各表の列（回数/予定日/目的/完了条件、観点/方法/期待値、項目/基準/判定者、項目/記載内容）、前提から結論への流れは rulebook の本文要件と合っている。`mtp-rulebook` の template が undecided のため、template とは照合できない。 | - | vp-arc-document-structure、vp-qe-omissions-consistency。template ができたら、R2 で章構成と表の列を照合し直す。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/mtp-sample.md`: 「差異発生時の扱い（許容/修正/再実行）」の章の再実行の上限に、追加の回は 1 回まで、期限は切替日の 2 日前の閉店後まで、PO が判断して `pm-decision-log` へ転記、上限を超えたら NO-GO という内容をまとめた。「リハーサル回数とスケジュール」の表の追加の回の完了条件からは NO-GO の一文を外した。予定日の「1 回まで」は日程として残した。

## 3. 申し送り

- grade の F001〜F003 は R2 では未対応。F001（`based_on` に `specdojo:dmd-sample` がない）は R5、F002（所要時間の基準に数値がない）は R4、F003（決定記録と `pm-decision-log` の呼称の揺れ）は R3 で扱う。
- `mtp-rulebook` の template が undecided のため、章構成と表の列を template とは照合していない。template ができたら R2 で照合し直す。
- R2-1: 段 R2 / 箇所 6. 差異発生時の扱い（許容/修正/再実行）、2. リハーサル回数とスケジュール / 指摘 再実行の上限（回数と期限）が差異の扱いの章になく、スケジュール表を見に行く形だった。追加の回の完了条件にも NO-GO の規則が混ざっていた / 直した案 差異の扱いの章の再実行の上限に「追加の回は 1 回まで、期限は切替日の 2 日前の閉店後まで、PO が判断して pm-decision-log へ転記、上限を超えたら NO-GO」をまとめ、スケジュール表の追加の回の完了条件から NO-GO の一文を外した（予定日の「1 回まで」は日程として残した） / 根拠 vp-arc-document-structure。mtp-rulebook の本文要件が差異発生時の扱いの章に「再実行の上限（回数と期限）と判定者」を求めている / 印 -
- R2-2: 段 R2 / 箇所 全体（章構成） / 指摘 9 章の順、各表の列（回数/予定日/目的/完了条件、観点/方法/期待値、項目/基準/判定者、項目/記載内容）、前提から結論への流れは rulebook の本文要件と合っている。mtp-rulebook の template が undecided のため、template とは照合できない / 直した案 - / 根拠 vp-arc-document-structure、vp-qe-omissions-consistency。template ができたら、R2 で章構成と表の列を照合し直す / 印 -
- R2-3: 段 R2 / 箇所 grade の finding F001〜F003 / 指摘 F001（`based_on` に specdojo:dmd-sample がない）は vp-dev-change-impact で R5、F002（所要時間の基準に数値がない）は vp-qe-verifiability で R4、F003（決定記録と pm-decision-log の呼び方の揺れ）は vp-ux-language-consistency で R3 が扱う観点のため、R2 では直していない / 直した案 - / 根拠 kata-guide の「kata の観点の組」 / 印 -

## 4. 進め方と実践の型の適用

kata-guide の「kata を agent でレビューする」に従い R2（構成）を実施した。章の順、表の列、前提から結論への流れを `mtp-rulebook` の本文要件と照合し、不整合は再実行の上限の置き場所 1 件だけだった。rulebook など sample 以外は変更していない。根拠は `vp-arc-document-structure` と `vp-qe-omissions-consistency`。
