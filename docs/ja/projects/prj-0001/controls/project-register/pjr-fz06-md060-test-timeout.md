---
specdojo:
  id: prj-0001:pjr-fz06-md060-test-timeout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  difficulty: easy
  registered_at: "2026-10-28T12:06:34Z"
---

# PJR-FZ06 MD060 の review テンプレートのテストが負荷で 5 秒の上限を超える

## 1. 課題内容

tests/src/exec/review-template-table.test.ts の MD060 のテストが、親の検証の負荷で 5.0〜5.7 秒かかり時間切れになる。PJR-EVAE・PJR-484B・PJR-0D0T の実行で落ち、そのたびに親の検証をやり直した

## 2. 影響範囲

| 観点         | 影響                                                                                |
| ------------ | ----------------------------------------------------------------------------------- |
| スコープ     | `tests/src/exec/review-template-table.test.ts` の 1 件                              |
| スケジュール | 親の検証の test-unit が落ち、そのたびに `--resume` で親の検証をやり直す時間がかかる |
| コスト       | 再実行の時間。agent の利用枠は使わない                                              |
| 品質         | 本当の失敗と時間切れの見分けに手間がかかり、本当の失敗を見落とすおそれがある        |

## 3. 対応方針

| 項目     | 内容                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 原因     | テストが markdownlint を実際に走らせ、単独では 5 秒未満だが、親の検証の負荷の下で 5.0〜5.7 秒かかる                           |
| 対応策   | テストを軽くする（lint の対象や準備を減らす）か、このテストだけ上限を延ばす。どちらにするかは executor が決め、理由を記録する |
| 依存事項 | なし                                                                                                                          |
| 完了条件 | 検証の範囲（MD060 を有効にしたまま、生のテンプレートと展開した基準の表の両方を通す）を保ったまま、負荷の下でも上限を超えない  |

## 4. 対応結果

-

## 5. 関連ドキュメント

- `.github/instructions/vitest.instructions.md`
