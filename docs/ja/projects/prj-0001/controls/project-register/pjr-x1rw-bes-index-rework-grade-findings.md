---
specdojo:
  id: prj-0001:pjr-x1rw-bes-index-rework-grade-findings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

| No  | 作業                                                    | 担当 | 状態 | メモ                                                 |
| --- | ------------------------------------------------------- | ---- | ---- | ---------------------------------------------------- |
| 1   | 最新の grade の指摘を取り込み、テストの網羅の確認を足す | ARC  | done | executor が実施（対応結果を参照）                    |
| 2   | grade し直して結果を書く                                | ARC  | done | 2026-11-16 orchestrator が grade（needs-work 94 点） |

## 5. 対応結果

- 実施内容: [[prj-0001:bes-index]] に「網羅の確認」の章を足し、16 行それぞれに不成立の典型・境界・詳細化の対応の確かめ方と照合の結果を示した。照合は ARC が 2026-11-16 に、`cdfd-overview` の 2026-11-03 の版（コミット `dbe099f29`）と行った。14 領域すべてに対応し、ID 16 件は形式違反・重複ともに 0 件。
- grade の指摘への対応: 人間の PO の留保の承認（2026-11-15、PJR-AK5V）を「未決事項と承認条件」の冒頭 1 か所にまとめ、各論点は「留保」と記して内容・担当・時期を残した。PM の追跡の担当と確認の時点を足した。`bes-task-execution-requested` と `bes-task-ready-selected` の発生時点・回数の違いを詳細化の章に書いた。一覧の更新の担当と契機を足した。結びの条件を、済んだ承認と残る前提（カタログとの範囲の差、QE の確認、人間の確定）に分けた。
- 迷った点と決めた内容: 成果物カタログの概要が 10 領域と記す件は、PO が承認した 14 領域を正として本書に論点を残し、カタログは本タスクの対象外なので直していない。QE の確認と事実データとデータモデルの照合は executor が代わりに済ませたことにせず、論点として残した。`status` は `draft` のまま。
- 残課題: `dct-business-model-bes.yaml` の `bes-index` の概要とコメントを 14 領域に直す。QE が「網羅の確認」を確かめる。`bes-task-ready-selected` の「上位の一覧は未作成」の記述と双方向の参照を直す。`grade run --target deliverable` での grade のやり直しは runner の段で行う。

再 grade の結果（2026-11-16、orchestrator が `grade run --target deliverable` で実行）:

- 判定は needs-work、94 点（前回は 86 点・指摘 12 件）。指摘は 4 件（major 1・minor 3）。
- 完了条件の判定は 4 件中 2 件を満たす（未達: DC-003・DC-004）。
- major の指摘:
  - F004（vp-qe-done-criteria）: 宣言された完了条件が満たされたとマークする前に、ソースドメインのマッピング、PO のスコープ承認、および QE のカバレッジチェックを確認するレビューのエビデンスを追加してください。
- 結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/bes-index.yaml`。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
