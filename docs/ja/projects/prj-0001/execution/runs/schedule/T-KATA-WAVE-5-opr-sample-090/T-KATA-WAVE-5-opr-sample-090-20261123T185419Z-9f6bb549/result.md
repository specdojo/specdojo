---
specdojo:
  id: prj-0001:xrr-t-kata-wave-5-opr-sample-090-20261123t185419z-9f6bb549
  type: exec-result
  task_id: T-KATA-WAVE-5-opr-sample-090
  mode: review
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-WAVE-5-opr-sample-090/T-KATA-WAVE-5-opr-sample-090-20261123T185419Z-9f6bb549/plan.md
  started_at: "2026-11-23T18:54:21.990Z"
  completed_at: "2026-11-23T19:55:49.551Z"
  agent: sonnet-review-executor
  execution: agent
  approach: fully-guided
  targets:
    - specdojo:opr-sample
---

# Review Result

## 1. 評価結果の確認

executor は `npx specdojo grade list --target kata --changed-only` と `npx specdojo grade list --target kata --incomplete` を実行し、どちらも `opr-` を含む対象が出力されなかったと記録している。plan の評価結果章でも、`opr-sample` を含む各型の評価結果サイドカーは「最新」（`content_hash` 一致）とされている。評価パイプラインは完了している。対象の `opr-sample` は `verdict` が `pass`、`score` が 94 で、finding は blocker 0 / major 0 / minor 4 / note 0 である。型の追加完了条件で対象となる評価結果は次のとおり。`opr-rulebook` は `needs-work`（94、major 1 / minor 1）、`opr-batch-sample` は `needs-work`（66、major 8 / minor 15）、`opr-support-sample` は `fail`（57、blocker 1 / major 14 / minor 9）。それ以外の `opr-template`、`opr-access-control-sample`、`opr-backup-restore-sample`、`opr-change-sample`、`opr-incident-sample`、`opr-monitoring-sample` は `pass` である。

## 2. 判断根拠

- `opr-sample` 自体は `pass`（94）で最新である。完了条件 DC-001〜DC-005（章立て、Sample 記述標準、禁止事項、概要での `opr-index` との対応、手順・判断・証跡の値での記述）に直結する blocker・major の finding はない。
- `opr-sample` の finding は minor 4 件である。内容は未決事項の表への決定者・期限・ready 化前の解消項目の追加、証跡保管期間の `_UNDECIDED_`、分冊の記述と id の不整合である。これらは `opr-sample` 単体の完了を妨げない。
- plan の追加完了条件は、型を構成するすべての評価対象（rulebook、sample、template）に最新の `--target kata` の `pass` を求める。`needs-work` と `fail` は `incomplete` とし、`complete-with-findings` でも完了扱いにしない。
- `opr-rulebook` は `needs-work` で、major の F002 がある。`opr-batch-sample`・`opr-change-sample`・`opr-support-sample` が `rulebook: specdojo:opd-rulebook` を宣言し、template の 12 章構成にもなっていない、という内容である。
- `opr-batch-sample` は `needs-work`（66）で、major 8 件を含む。必須章の欠落、`rulebook` の宣言誤り、見出し番号の誤りなどが挙がっている。
- `opr-support-sample` は `fail`（57）で、blocker 1 件（必須章の欠落）と major 14 件を含む。`opr-batch-sample` と同様に `rulebook` の宣言誤りと見出し番号の誤りがある。
- 他の sample には分冊と `opr-sample` の間の食い違いがある。具体的には緊急権限の扱い、日次点検の時刻（9:30 と 9:45）、変更件数の月次集計、`opr-incident` の予定と分冊の記述である。いずれも minor だが、横串の確認で整合させる必要がある。
- executor が確認できなかった範囲は、成果物の再評価（本文は一部のみ閲覧）、先行 edit result の特定、sandbox 検査である。実行記録（先行 edit task の result）は特定できていない。
- `evidence.changes` は空で、成果物への変更や対象外の変更の混入はない。runner の検査は `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`validate:schema` が passed で、他は変更種別により `not_applicable` である。

## 3. 未充足事項・改善指示

- `opr-batch-sample` と `opr-support-sample` は、`rulebook` を `specdojo:opr-rulebook` に直す。見出し番号と章構成を template の 12 章に揃え、欠落している必須章（概要、適用範囲・前提、証跡、関連文書導線など）を補う。そのうえで再 grade して `pass` にする。または sample の宣言から外す。
- `opr-change-sample` の `rulebook` 宣言も `opr-rulebook` grade の F002 で指摘されている。`opr-rulebook` の再 grade の前に確認して揃える。
- `opr-rulebook` の F001（6.4 と 6.6 が template と重複しているため、template 参照に置き換えるか差分だけにする）と F002 を解消し、再 grade して `pass` にする。
- `opr-sample` の F001〜F004 に対応する。未決事項の表に決定者・期限・ready 化前の解消項目を足す。証跡の保管期間に仮値または扱いを示す。関連導線の「分冊は障害対応だけ」「`opr-incident` は予定」を実在の分冊 sample と id に合わせる。
- `opr-sample` と分冊 sample の食い違いを解消する。対象は、緊急権限と付与の実施者（`opr-access-control-sample`）、日次点検の時刻 9:30 と 9:45（`opr-monitoring-sample`）、誤検知の閾値（月 3 件以上と月 3 回を超えたら）、変更件数とロールバック件数の月次集計（`opr-change-sample`）である。
- 人の確定はこの track に入れず、sample がそろった後の横串の確認でまとめて行う。

## 4. approach に応じた確認

fully-guided の方針に従い、宣言された文書だけを確認した。具体的には、評価結果サイドカーの要約、対象成果物の評価、rulebook・sample・template の評価結果、executor の鮮度確認出力である。成果物は再評価していない。対象の `opr-sample` は完了条件を満たす。ただし型の整備を含む schedule の追加完了条件で、`opr-rulebook`（`needs-work`）、`opr-batch-sample`（`needs-work`）、`opr-support-sample`（`fail`）が `pass` に達していない。したがって `incomplete` と判断する。

## 5. decision

- verdict: incomplete
