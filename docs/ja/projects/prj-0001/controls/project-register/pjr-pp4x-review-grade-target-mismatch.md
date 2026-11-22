---
specdojo:
  id: prj-0001:pjr-pp4x-review-grade-target-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  registered_at: "2026-11-22T02:08:32Z"
  derived_from:
    - PJR-VCER
---

# PJR-PP4X 型の schedule の review の段で、sample の grade の鮮度が対象種別の食い違いで常に最新でないと出て止まる

## 1. 課題内容

第 3 波の 090 で、runner が review の対象（deliverable）と型の追加の完了条件（kata）の 2 回 grade を流し、同じサイドカーを kata が上書きする。executor が --target deliverable で鮮度を確かめると常に最新でないと出て、それを検証の失敗として記録し、runner が止める。

## 2. 入力

- 2026-11-22 の第 3 波の 090 で、流した 7 件がすべて block（executor validation failed or not run: specdojo grade list --target deliverable ... --changed-only）。
- 第 3 波の strategy の review の段は approach: fully-guided で、gradeTargetKind（src/exec/plans-core.ts）は deliverable を返す。plan の評価対象は docs/ja/specdojo/samples の sample で、サイドカー `specdojo.<sample>.yaml` は target: kata で記録されていた。
- plan は「評価結果が最新でないことは異常終了の理由にせず verdict として記録する」と書くが、executor は grade list の出力ありを failed の検証として evidence に残し、runner は review の段でも failed の検証を block にする（src/exec/reporter.ts）。
- 第 1・2 波の review の段は approach: retrofit。同じ食い違いが起きなかった理由は未確認。

## 3. 影響範囲

| 観点         | 影響                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| スコープ     | 型の schedule の review の段すべて。第 3 波の 090 の 13 件が流せない               |
| スケジュール | 第 3 波の review の段（090）とその後の人の確定（140）が止まる                      |
| コスト       | 1 件ごとに opus の review が流れてから止まり、枠を使う。止めるまでに 10 件が流れた |
| 品質         | review が、上書きされた評価（kata）を deliverable の評価として読んで判断する       |
| 関係者       | オーケストレーター（流し直し）、利用者（第 3 波の確定）                            |

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
