---
specdojo:
  id: prj-0001:pjr-zsrd-review-stage-stale-grade-claim
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-11T03:08:42Z"
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

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
