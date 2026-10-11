---
specdojo:
  id: prj-0001:pjr-979n-delegated-validation-block
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-06T10:25:34Z"
  due_on: null
  completed_at: "2026-10-06T10:34:50Z"
  conclusion: 親 runner が project で同じコマンドを通した executor の not_run を満たされたものとして扱うよう修正した（73de62d3b）
---

# PJR-979N executor が親 runner へ委ねた検証を runner が通しても block される

## 1. 課題内容

deriveReporterFacts は executor の passed 以外の検証を一律に失敗とみなす。codex が sandbox で実行できない検証を not_run（親 runner へ委譲）と記録し、runner が同じコマンドを実行して passed になっても block される。PJR-27Y0 で発生。

## 2. 影響範囲

| 観点         | 影響                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------ |
| スコープ     | executor / reporter pipeline の機械判定（`src/exec-reporter.ts` の `deriveReporterFacts`） |
| スケジュール | PJR-27Y0 の統合が 1 回分止まった                                                           |
| コスト       | 親検証の再実行 1 回分                                                                      |
| 品質         | 親検証がすべて成功していても blocked になり、result の判定が実態と食い違う                 |
| 関係者       | sandbox で一部の検証を実行できない executor（codex）を使う実行                             |

## 3. 対応方針

| 項目     | 内容                                                                                                                                               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | executor 由来の検証のうち `passed` 以外を一律に失敗とみなし、親 runner が同じコマンドを通した結果を参照していなかった                              |
| 対応策   | executor の `not_run` は、親 runner が project で同じコマンドを実行して `passed` なら満たされたものとして扱う。executor の `failed` は打ち消さない |
| 依存事項 | なし                                                                                                                                               |
| 完了条件 | 委譲された `not_run` が親 runner の成功で満たされ、`failed` と未実行の `not_run` は引き続き block されることを unit テストで確認する               |

## 4. 対応結果

- 対応経路: orchestrator（claude）が利用者の指示で直接修正した（commit 73de62d3b）。
- `deriveReporterFacts` で、親 runner が project で通したコマンドと一致する executor の `not_run` を失敗から除いた。product リポジトリでだけ通った場合は満たさない。
- unit テストを 4 件追加した（委譲の受け入れ、runner が実行していない `not_run`、executor の `failed`、product リポジトリでの成功）。`npm run typecheck`・`npm run lint:ts`・commit 時の全テストが成功した。
- exec 設定ガイドと exec 運用ガイドの機械判定の説明に、委譲された `not_run` の扱いを追記した。
- 修正後に PJR-27Y0 を `--resume` し、親検証がすべて成功して review へ遷移・統合された（ea0fdcd59）。

## 5. 関連ドキュメント

- PJR-27Y0（発生した実行）
- PJR-GBEV（reporter の事実項目を runner が機械生成する変更）
