---
specdojo:
  id: prj-0001:pjr-zsrd-review-stage-stale-grade-claim
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  difficulty: medium
  registered_at: "2026-11-11T03:08:42Z"
  completed_at: "2026-11-16T04:20:15Z"
  conclusion: review の段で、古い grade の流し直しを review の agent の起動より前に済ませ、reopen の後の流し直しが引き受けの重なりで止まらないようにした
  derived_from:
    - PJR-2GD6
---

# PJR-ZSRD schedule の review の段が、古い grade で判定し、reopen の後の引き受けの重なりで統合の前に止まる

## 1. 課題内容

代表の review の段（mode review）で、review の agent が runner の grade の流し直しより前に評価して grade-stale と判定する。reopen の後に再び流すと、完了の前の検査が「別の actor が引き受けている」として統合の前に止める。blocked の review を resume すると、古い executor の結果を使い回す。原因を特定して直す

## 2. 入力

- 2026-11-11、T-BUSINESS-SPECS-REPS の sf・cdt・ccd の 090 を reopen して流したところ、review の agent は grade-stale と判定し、completion preflight failed: task is being worked on by another actor: sol-review-executor で Blocked before integration になった。
- bdd・ifx-cmd の 090 は、PJR-CBV6 で YAML の grade が流せるようになった後に exec resume したが、CBV6 の前の executor の結果（grade list が失敗した記録）を使い回して止まった。
- 代表の確定には、review の段をやめて grade を直接流す形を使う（indie が案 A を決定）。

## 3. 影響範囲

| 観点         | 影響                                                                                 |
| ------------ | ------------------------------------------------------------------------------------ |
| スコープ     | schedule の review の段（mode review）を流す項目                                     |
| スケジュール | review の段が止まると、型の整備の schedule が完了せず、orchestrator の手作業が増える |
| コスト       | 止まるたびに再開の手作業と grade の流し直しが要る                                    |
| 品質         | 古い grade で判定すると、review の結論が実態と食い違う                               |
| 関係者       | orchestrator・PO                                                                     |

## 4. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | review の agent が、runner の grade の流し直しより前に評価して grade-stale と判定する（順番の問題）。reopen の後の引き受けの重なりは PJR-M495・T4G3 で直った可能性があり、残りを確かめる                                                                                  |
| 対応策   | review の段では、grade が古い場合に runner が先に grade を流し直し、その結果ができてから review の agent を起動する。reopen して流し直した場合の完了の前の検査が、claim の持ち主で判定されることを確かめる                                                                |
| 依存事項 | PJR-M18B（grade の再試行と grade-stale の block）、PJR-M495・T4G3（claim の持ち主）                                                                                                                                                                                       |
| 完了条件 | grade が古い代表の review の段で、runner の grade の流し直しが review の agent の前に終わり、review が grade-stale にならないことを回帰テストで確かめる。reopen して流し直した review の段が「別の actor が引き受けている」で止まらない。`npm run check` と親の検証が通る |

## 5. 対応結果

-

## 6. 関連ドキュメント

- [[prj-0001:pjr-m18b-review-grade-failure-blocks-completion]]
