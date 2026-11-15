---
specdojo:
  id: prj-0001:pjr-cpzh-prj-comparison-of-alternatives-rework-grade-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: PM
  registered_at: "2026-11-15T12:32:36Z"
  commit_type: docs
  commit_scope: pm
  approach: fully-guided
  targets:
    - prj-0001:prj-comparison-of-alternatives
---

# PJR-CPZH prj-comparison-of-alternatives を grade の指摘で手直しする（project-kata の 140 の差し戻し）

## 1. 概要

prj-comparison-of-alternatives を最新の grade の指摘で直す

## 2. 入力

- T-PROJECT-KATA-prj-comparison-of-alternatives-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43 の 1.4 の D）。2026-11-15 の grade で完了条件を満たしていない
- 最新の grade の未充足の完了条件と major の指摘を取り込む。本文は status: ready のまま差し戻したため、直す間の status の扱いも決める

## 3. 完了条件

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く。
- 本文はすでに `status: ready` のため、直す間に `draft` へ戻すか、`ready` のまま直すかを決め、理由を対応結果に書く（確定は人が 140 で行う）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ |
| --- | ----------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込んで直す | PM   | open | -    |
| 2   | grade し直して結果を書く            | PM   | open | -    |

## 5. 対応結果

- 実施内容: 2026-11-15 の grade の指摘 F001〜F010 を [[prj-0001:prj-comparison-of-alternatives|代替案比較]] に取り込んだ。
  - 評価軸と評価基準: 全軸の判定基準を High / Middle / Low の境界で書き直し、D-02・D-03 に「統合する最低観点」と「主に対応する課題・制約」の列を追加した（F005・F010）。「判定の根拠と集約規則」を新設し、机上評価であること、D-01 の重みによる総合評価の規則、D-02・D-03 の正本・試行・非採択の規則を定めた（F008）。
  - 比較結果と採択理由: D-02 に方式ごとの評価根拠と再評価条件の表を追加し、SDD-06 の非採択理由と再評価条件を記した（F001）。「技術的実現性と影響」に後続作業の担当と確認方法・期待結果を追加した（F003・F006）。「比較試行の計画と完了条件」を新設し、WP-01〜WP-05 と DP-01 の担当 Role・前提・完了条件と、継続利用・撤退の判定条件を定めた（F002・F009）。
  - リスクとトレードオフ・決定と見直し: 表の各行に決定・案 ID と担当・完了条件を付け、非採択案のトレードオフを追加した（F007）。管理事項を試行結果・リスク・課題・変更要求・未決事項に分け、記録先と担当を定めた（F004）。
- status の扱い: `ready` のまま直す。理由は、`ready` は人が付けた状態で、`draft` へ戻すと人の再昇格が必要になること、変更は本タスクの worktree に閉じ、統合前に 140 で人が確認することである。確定は人が 140 で行う。
- 迷った点と決めた内容:
  - 試行の作業時間の上限は根拠資料で未決のため数値を置かず、[[prj-0001:prj-issues-and-approach|プロジェクト課題と解決アプローチ]] の「費用・負荷の上限を決める」に従い、決まるまで試行を始めない条件にした。
  - 試行の実施担当は、成果物内で方式境界を担う `ARC`（AI Agent が支援）とした。
  - 記録先は実在を確認できる [[prj-0001:pjr-index|プロジェクト登録簿]] に一本化し、実在を確認できない「技術検証結果」は外した。
  - 既存の評価セルは変えず、判定境界と集約規則は既存の判定と整合するように定めた。
- 再 grade: executor では `grade run --target deliverable` を実行していない（agent CLI の起動を要するため）。runner または人が実行し、結果をここへ追記する。
- 残課題: 再 grade の実行と結果の記入、140 での status の確定。

再 grade の結果（2026-11-16、orchestrator が `grade run --target deliverable` で実行）:

- 判定は needs-work、91 点（前回は 86 点・指摘 10 件）。指摘は 6 件（major 1・minor 5）。
- 完了条件の判定は 4 件中 4 件を満たす（すべて満たす）。
- major の指摘:
  - F004（vp-qe-verifiability）: High・Middle・Lowの判定境界、各セルの根拠、D-01の重みを総合評価と採否へ反映する規則がなく比較結果を再現できないため、尺度・証拠・集約規則を明記してください。
- 結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml`。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
