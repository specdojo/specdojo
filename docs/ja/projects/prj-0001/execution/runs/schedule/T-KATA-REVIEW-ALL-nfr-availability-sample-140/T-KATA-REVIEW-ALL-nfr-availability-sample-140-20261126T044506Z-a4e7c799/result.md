---
specdojo:
  id: prj-0001:xer-t-kata-review-all-nfr-availability-sample-140-20261126t044506z-a4e7c799
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-nfr-availability-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-nfr-availability-sample-140/T-KATA-REVIEW-ALL-nfr-availability-sample-140-20261126T044506Z-a4e7c799/plan.md
  started_at: "2026-11-26T04:45:16.763Z"
  completed_at: "2026-11-26T04:51:51.757Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:nfr-availability-sample
    - specdojo:nfr-availability-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）のレビューとして、nfr-availability-sample に書かれた事実 15 件を参照先の sample や schema と突き合わせた。不一致は 1 件で、概要の章の紙の販売控えへの切替の判断者と時機だった。正本に合わせてこの箇所を直した。
- 残り 14 件は正本と一致したため維持した。確かめられなかった主張はない。
- grade 由来の F001 は R4 の観点（vp-arc-conciseness）に当たらないため扱っていない。F002 は、可用性要件一覧の基準欄から暫定判定が読み取れるため、追加の直しは要らないと判断した。
- runner が実行した `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` は passed だった。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 | 1. 概要（対象・目的） | 「店番担当が記録できないことに気付いたら紙の販売控えへ切り替える」が正本と食い違っていた。正本では、P1 に気付いてから 30 分たっても記録を再開できない場合に `PO` が切替を決める。 | 「記録を 30 分たっても再開できなければ `PO` が紙の販売控えへの切替を決める」に直した。 | vp-arc-technical-constraints。正本は opd-index-sample L97、opd-incident-management-sample L50、opr-incident-sample L73。 | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/nfr-availability-sample.md`: 概要の章の「店番担当が記録できないことに気付いたら紙の販売控えへ切り替える」を「記録を 30 分たっても再開できなければ `PO` が紙の販売控えへの切替を決める」に直した。正本の opd-index-sample、opd-incident-management-sample、opr-incident-sample に合わせた修正で、変更は 1 行。

## 3. 申し送り

- F001 は R4 の観点に当たらないため未対応。vp-arc-conciseness を扱う段で、未決事項の「当面の扱い」と可用性要件一覧の基準欄の重複を見直す必要がある。
- R4-1: R4 / 1. 概要（対象・目的） / 「店番担当が記録できないことに気付いたら紙の販売控えへ切り替える」が正本と食い違う。正本では P1 に気付いてから 30 分たっても記録を再開できない場合に `PO` が切替を決める / 「記録を 30 分たっても再開できなければ `PO` が紙の販売控えへの切替を決める」に直した / vp-arc-technical-constraints。正本は opd-index-sample L97、opd-incident-management-sample L50、opr-incident-sample L73 / -
- 確かめの表（R4、全 15 件）: (1) 営業日の 90% 以上の目標 = prj-overview-sample L78 と一致。(2) 紙の控えへの切替 = 不一致のため修正（R4-1）。(3) 10:00〜18:00 = opd-index-sample L34 と一致。(4) 計画停止は閉店後 = opd-index-sample L108-111 と一致。(5) ACD-A02 = prj-assumptions-constraints-dependencies-sample L26 と一致。(6) 5 分続けて応答なしで通知 = opd-index-sample L89 と一致。(7) RTO・RPO の暫定値 = opd-index-sample L122-123 と一致。(8) 1 日 1 回の自動バックアップと月次の復元演習 = opd-index-sample L121・L125、opr-backup-restore-sample L63 と一致。(9) 復旧の終点は各 1 件の記録 = opr-incident-sample L60 と一致。(10) 件数・金額の照合 = opd-index-sample L98、opr-incident-sample L60 と一致。(11) 予備のタブレットなし = opd-incident-management-sample L42 と一致。(12) frontmatter の `type: requirement`・`part_of`・`based_on` = deliverable / common の frontmatter schema と一致。(13) rulebook の sample 宣言 = nfr-availability-rulebook L8 と一致。(14) wikilink の参照先 5 件の id が存在する。(15) `sac-availability`・`stc-availability` は未作成の文書としてバッククォートで書いており、sac-sample L21 と rulebook L126 に同じ記述がある。確かめられない主張はなし。
- F001（vp-arc-conciseness）は R4 の観点に当たらないため扱わない。F002（vp-qe-verifiability）は、測定・検証方法の章の末尾の段落が暫定の判定の扱いをまとめており、可用性要件一覧の基準欄から判定が読み取れるため、追加の直しは要らないと判断した。

## 4. 進め方と実践の型の適用

sample-maintenance の R4 として、sample の事実を opd-index-sample、opd-incident-management-sample、opr-incident-sample、opr-backup-restore-sample、prj-overview-sample、prj-assumptions-constraints-dependencies-sample、nfr-availability-rulebook、frontmatter schema と照合した。15 件のうち 1 件（紙の控えへの切替の判断者と時機）が正本と食い違っていたため、正本を正として直した。残り 14 件は一致していたので維持した。F001 は R4 の範囲外として扱わず、F002 は追加の直しを要さないと判断した。
