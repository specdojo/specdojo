---
specdojo:
  id: prj-0001:pjr-avsr-grade-reporter-level-severity-mismatch
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-09-29T12:29:07Z"
---

# PJR-AVSR grade の reporter が finding の severity と level の矛盾で形式の検査に落ちる

## 1. 課題内容

grade の reporter の出力を `grade apply` が検証するとき、finding の severity に応じて level の上限を課している（`src/grade.ts` の `finding severity caps level at <n>`）。reporter が、minor 以上の finding を残したまま観点の level を上限より高く付けると、この検証で失敗し、その文書の評価が未完了になる。

2026-09-28 の評価し直しでは、sample の 2 件（例: `atc-index-sample`、reporter は claude-reporter）がこの理由で失敗した。

## 2. 影響範囲

| 観点         | 影響                                                   |
| ------------ | ------------------------------------------------------ |
| スコープ     | grade の評価（手動・夜間の定期実行とも）               |
| スケジュール | 失敗した文書は `--incomplete` での再試行が必要になる   |
| コスト       | 再試行の分だけ agent の利用枠を使う                    |
| 品質         | 評価そのものは妥当でも、形式の矛盾だけで結果が残らない |
| 関係者       | grade を回す利用者                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | reporter への指示に、severity と level の上限の関係が十分に伝わっていない、または reporter の出力を整える段で矛盾を解消していない                                                                                                                                                        |
| 対応策   | reporter の plan に、severity ごとの level の上限（`blocker` は 0、`major` は最大 2、`minor` は最大 3）を明示する。あわせて、形式の検査で失敗したときに、違反内容を reporter に返して 1 回だけ出し直させる（format attempts と同じ扱い）。level を機械的に引き下げて合わせることはしない |
| 依存事項 | なし                                                                                                                                                                                                                                                                                     |
| 完了条件 | reporter の plan に上限が書かれている。上限を超える level を出した場合に、違反内容を添えて出し直させ、出し直しで直れば評価が完了することを単体テストで確かめる。出し直しても直らない場合は、従来どおり失敗として記録する。`npm run check` が成功する                                     |

## 4. 対応結果

-

## 5. 関連ドキュメント

- `src/grade.ts`（`grade apply` の検証）、`tools/grade/run-per-document.sh`
- PJR-K351（rubric v2）
