---
specdojo:
  id: prj-0001:pjr-x1rw-bes-index-rework-grade-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T11:12:24Z"
  commit_type: docs
  commit_scope: bes
  approach: fully-guided
  targets:
    - bes-index
---

# PJR-X1RW bes-index を grade の指摘で手直しする（イベントからのテストの網羅）

## 1. 概要

最新の grade の指摘を取り込み、テスト設計の入口としての網羅の確認を本文に足す

## 2. 入力

- kata-wave-1 の確定（T-KATA-WAVE-1-bes-index-140）で差し戻した（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 86 点で完了条件 2/4
- 主な指摘: イベントからテスト設計を網羅できるかを確かめた記録がない（DC-004）。事実データとデータモデルの照合（DC-003）は PJR-AK5V の留保として残す

## 3. 完了条件

- 各起点イベントについて、テスト設計で網羅を確かめる観点（発生条件・境界・詳細化の対応）を本文に示し、網羅を確かめた結果を記録している。
- 仮置きの詳細化の対応（`bes-routine-due` と P-14 など）を、テストの観点からどう確かめるかが分かる。
- 本文に書いた人間の PO の判断と、期限付きの留保（追跡先の PJR）を消さずに保っている。
- 成果物の `status` は `draft` のまま変えない（確定は人が T-KATA-WAVE-1 の 140 で行う）。
- 直した後に `grade run --target deliverable` で grade し直し、成果物カタログの完了条件をすべて満たす（留保の範囲だけが未充足として残る場合は、その理由を対応結果に書く）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                                    | 担当 | 状態 | メモ |
| --- | ------------------------------------------------------- | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込み、テストの網羅の確認を足す | ARC  | open | -    |
| 2   | grade し直して結果を書く                                | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
