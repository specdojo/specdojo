---
specdojo:
  id: prj-0001:pjr-vehx-sf-index-rework-grade-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T11:12:09Z"
  commit_type: docs
  commit_scope: sf
  approach: fully-guided
  targets:
    - sf-index
---

# PJR-VEHX sf-index を grade の指摘で手直しする（P-06 の境界のずれとテスト対象との照合）

## 1. 概要

最新の grade の指摘を取り込み、機能の境界とテスト対象との対応を直す

## 2. 入力

- kata-wave-1 の確定（T-KATA-WAVE-1-sf-index-140）で差し戻した（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 75 点で完了条件 0/5
- 主な指摘: SF-ROUT-02 が実行の行だが、対応する P-06 はジョブの定義の領域で境界がずれている。全機能 ID と業務領域をテスト対象と照らした記録がない。Q-01・Q-03 の留保（PJR-AK5V）は残す

## 3. 完了条件

- `SF-ROUT-02` と P-06（ジョブの定義）の対応を正し、機能の境界と、業務プロセスの領域ごとの対応がずれていない。必要なら行を分けるか、定義と実行の機能を別の ID にする。
- 全機能 ID と業務領域を、テスト対象（どの検証で確かめるか）と照らした対応表がある。
- Q-02 の方針（領域ごとに代表の BPS だけを依存にする）と、一覧の各行の参照先が食い違っていない。
- 本文に書いた人間の PO の判断と、期限付きの留保（追跡先の PJR）を消さずに保っている。
- 成果物の `status` は `draft` のまま変えない（確定は人が T-KATA-WAVE-1 の 140 で行う）。
- 直した後に `grade run --target deliverable` で grade し直し、成果物カタログの完了条件をすべて満たす（留保の範囲だけが未充足として残る場合は、その理由を対応結果に書く）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                             | 担当 | 状態 | メモ |
| --- | ------------------------------------------------ | ---- | ---- | ---- |
| 1   | 最新の grade の指摘を取り込み、P-06 の境界を直す | ARC  | open | -    |
| 2   | テスト対象との対応表を足す                       | ARC  | open | -    |
| 3   | grade し直して結果を書く                         | ARC  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
