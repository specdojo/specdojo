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

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | runner は review の前に、review の対象として `deliverable` で 1 回、型の追加の完了条件（PJR-E4R5）として `kata` で 1 回、sample を grade する。サイドカーは対象種別に依らず同じファイルで、後の `kata` が上書きする。`gradeTargetKind` は approach が `fully-guided` などのとき `deliverable` を返すため、型の文書でも `deliverable` で鮮度を確かめることになり、常に最新でないと出る |
| 対応策   | 利用者の決定（2026-11-22、indie）で、案 1 を主にし案 3 の一部を添える。案 1: 型の schedule では、review の対象の grade と plan の「grade の対象種別」を `kata` にする。案 3 の一部: review の段で、executor が鮮度の確認（`grade list` の出力あり）を失敗として記録しても block にせず、verdict の判断に任せる                                                                        |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                  |
| 完了条件 | 下の箇条書きのすべてを満たす                                                                                                                                                                                                                                                                                                                                                          |

- review の対象が型の文書（rulebook・recipe・sample・template）であるか、catalog が型の catalog（`dct-kata` など）である review の段では、runner の事前の grade と plan の「grade の対象種別」がどちらも `kata` になる。判定の規則は executor が決め、理由を個票の対応結果に書く（単体テストで確かめる）。
- 型でない成果物の review の段は、今までどおり `deliverable` のままになる（単体テストで確かめる）。
- 対象が同じ文書・同じ対象種別になる場合、review の前の grade を 2 回流さない（単体テストで確かめる）。
- review の段で、executor が `grade list` の鮮度の確認を failed として evidence に記録しても、runner はそれを理由に block しない。ほかの検証の失敗は今までどおり block する（単体テストで確かめる）。
- 第 1・2 波の review の段（approach: `retrofit`）が、この変更でどう変わるかを個票の対応結果に書く。
- 止まった 090 の 10 件をどう流し直すか（`exec reopen` してから流す、`exec resume` で流す、など）を、確かめた手順として個票の対応結果に書く。
- `exec-operation-guide` などで review の段の grade の対象種別を説明している箇所があれば直す。
- `CHANGELOG.md` は変えない。個票の対応結果の `### 5.1. CHANGELOG に書く事項` に、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。
- runner の動きを変えるため、統合の後にオーケストレーターが第 3 波の 090 を 1 件流して、止まらずに verdict が記録されることを確かめる。

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
