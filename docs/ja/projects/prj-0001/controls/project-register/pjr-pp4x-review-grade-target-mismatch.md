---
specdojo:
  id: prj-0001:pjr-pp4x-review-grade-target-mismatch
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  difficulty: hard
  registered_at: "2026-11-22T02:08:32Z"
  completed_at: "2026-11-22T03:35:31Z"
  conclusion: 型の文書と型の catalog の review では、事前の grade と plan の対象種別を kata にし、同じ文書の grade を 2 回流さないようにした。review の段では鮮度の確認を理由に止めない。
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

解決内容は次のとおり。

- review の grade の対象種別を `reviewGradeTargetKind`（`src/exec/plans-core.ts`）で決めるようにした。runner の事前の grade（`reviewGradeSubject`）と review plan の「grade の対象種別」（`_GRADE_TARGET_`）は、どちらもこの関数を使う。
- 判定の規則は次の 3 つで、どれかに当たれば `kata`、どれにも当たらなければ `deliverable` を返す。
  - `approach` が型の整備（`*-authoring`・`*-maintenance`）である（従来の `gradeTargetKind`）。
  - 評価対象のパスが `docs/ja/specdojo/` の `rulebooks` / `recipes` / `samples` / `templates` 配下にある（`isKataDocumentPath`）。
  - 成果物が `domain: kata` の catalog（`dct-kata` など）にある（`deliverableCatalogDomain`）。
- 規則の理由: 評価結果サイドカーは対象種別によらず 1 文書に 1 つで、型の追加の完了条件（PJR-E4R5）は型の文書を `kata` で評価する。型の文書を `deliverable` でも評価すると同じサイドカーを奪い合うため、文書が型であることそのもので決める。catalog の `domain` の判定は、型の catalog の成果物が型の配下の外に置かれた場合にも `kata` に揃えるために足した。
- 事前の grade で、代表成果物と宣言済みの型が同じパスで、どちらも `kata` の場合は 2 回目を流さない。この規則は従来からあり、代表が `kata` になったことで第 3 波でも効く。
- review の段では、`specdojo grade list ... --changed-only` が failed と記録されても runner は block にしない（`isGradeFreshnessCheck`、`src/exec/reporter.ts`）。鮮度は verdict（`grade-stale` など）で判断する。ほかの検証の failed と、`--changed-only` の付かない `grade list`（`--dependency-changed` など）の failed は、今までどおり block する。edit の段の扱いも変えていない。
- 単体テストは `tests/src/exec/review-kata.test.ts` と `tests/src/exec/reporter.test.ts` に足した。型の catalog の sample は `kata` で 1 回だけ grade され、plan に `kata` が出ること、型でない成果物は `deliverable` のままであること、判定の規則、review の段での鮮度の確認の扱い（block しない・ほかの失敗は block する・edit の段は block する）を確かめる。
- [[specdojo:review-guide|レビューガイド]] の「review 前段の grade」に、型の文書の対象種別と鮮度の確認の扱いを書いた。[[specdojo:exec-operation-guide|exec運用ガイド]] には review の grade の対象種別を説明する箇所がなく、変えていない。

第 1・2 波の review の段（`approach: retrofit`）への影響は次のとおり。

- 第 1・2 波の代表成果物は `docs/ja/projects/prj-0001/` 配下にあり、`dct-architecture` や `dct-business-acceptance-criteria` など `domain: kata` でない catalog の成果物である。このため代表の grade は今までどおり `deliverable` で、型（rulebook・sample）は別のパスを `kata` で評価する。動きは変わらない。
- 食い違いが起きなかった理由もここにある。代表と型が別の文書なので、サイドカーも別になり、上書きが起きなかった。第 3 波は代表そのものが sample なので、2 回の grade が同じサイドカーへ書いていた。

止まった 090 の 10 件の流し直しの手順は次のとおり。コードと [[specdojo:exec-operation-guide|exec運用ガイド]] の再開の表で確かめたが、実際には流していない。

1. 統合の後に、10 件の task ごとに `specdojo exec release --project prj-0001 --task <task-id> --by <actor>` で `blocked` を `todo` に戻し、`specdojo exec refresh --project prj-0001` を実行する。
2. 第 3 波の 090 を `specdojo exec run` で流し直す。新しい run の review plan は `kata` で作り直され、事前の grade も `kata` で 1 回だけ流れる（sample のサイドカーが最新なら再実行しない）。
3. `exec resume`（reporter から、または `--resume-from executor`）は使わない。reporter からの再開は、古い plan（`deliverable`）で executor が出した verdict をそのまま使う。`--resume-from executor` は worktree の古い plan を executor に渡すため、また `deliverable` で鮮度を確かめてしまう。

未了の確認: 統合の後にオーケストレーターが第 3 波の 090 を 1 件流し、止まらずに verdict が記録されることを確かめる（executor の sandbox では agent の起動と grade を流せないため）。

### 5.1. CHANGELOG に書く事項

区分は「不具合修正」。行の文案:

- 型の schedule の review の段で、sample などの型の文書の grade の鮮度が常に最新でないと出て、runner が止まっていた問題を修正しました。評価対象が型の文書か、`domain: kata` の catalog の成果物である review は、runner の事前の grade と review plan の「grade の対象種別」を `kata` に揃え、同じ文書を 2 回評価しません。review の段では、executor が `grade list --changed-only` の鮮度の確認を失敗と記録しても block にせず、verdict で判断します（PJR-PP4X）。

## 6. 関連ドキュメント

- [[specdojo:review-guide|レビューガイド]]: review 前段の grade の対象種別と鮮度の確認の扱いを更新した。
- [[specdojo:exec-operation-guide|exec運用ガイド]]: 090 の流し直しに使う `exec release` と再開の表の根拠。
- [[prj-0001:pjr-e4r5-kata-review-grade-kata-fix]]: 型の追加の完了条件（`kata` の grade）。
- [[prj-0001:pjr-vcer-kata-wave-3-catalog-schedule]]: 第 3 波の catalog と schedule（派生元）。
