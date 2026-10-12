---
specdojo:
  id: prj-0001:pjr-4vac-job-review-result-trailing-newline
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-12T09:14:18Z"
---

# PJR-4VAC Job Run の review の result が末尾改行を欠き commit 前の検査で統合が止まる

## 1. 課題内容

Job Run の review の後に runner が verdict を書き込む fillIncompleteJobReviewResult と overrideJobReviewDecision が result を整形せず末尾改行を欠くため、review の記録の commit が markdownlint の MD047 で失敗し、すべての Job Run が統合されない

## 2. 影響範囲

| 観点         | 影響                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- |
| スコープ     | `task.review` を宣言した Job の Job Run（routine 起動・手動起動とも）の review の記録の commit |
| スケジュール | 今夜（2026-10-13 01:00）の定期実行の前に直す                                                   |
| コスト       | すべての Job Run が review の後で `waiting` になり、人が統合する                               |
| 品質         | review が通っても統合されず、新しい流れが機能しない                                            |
| 関係者       | 定期実行を使う利用者と orchestrator                                                            |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/exec-run.ts` の `fillIncompleteJobReviewResult` と `overrideJobReviewDecision` は、reporter が書いて整形した review の result を読み直して verdict や runner の判定を書き込むが、書き込み後に整形せず末尾の改行が欠ける。commit 前の hook の markdownlint（MD047）が失敗し、review の記録の commit ができない                                                                                                                                                                                                         |
| 対応策   | runner が review の result を書き換えた後に、ほかの result と同じく `formatMarkdownFile` で整形する（少なくとも末尾の改行を 1 つに揃える）。Job Run の review の result を書き換える箇所をすべて対象にする                                                                                                                                                                                                                                                                                                                 |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 完了条件 | review の verdict が `complete` の場合と、`incomplete` で runner が判定を書き込む場合の両方で、result が末尾の改行 1 つで終わり、`markdownlint` の MD047 に違反しないことを単体テストまたは統合テストで確認する。Job Run の review の記録の commit が hook で失敗せず、verdict に応じて統合または `waiting` へ進むことを統合テストで確認する。統合テストで子プロセスとして CLI を起動する場合は、実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する。fixture の `agent-members.yaml` は schema の必須項目を満たす |

## 4. 対応結果

- `fillIncompleteJobReviewResult` と `overrideJobReviewDecision` を非同期化し、review result の書き込み直後に共通の `formatMarkdownFile` を呼ぶようにした。これにより、runner が本文や verdict を上書きした場合もファイル末尾が改行 1 つへ正規化される。
- `tests/src/exec-job-worktree.integration.test.ts` に、complete の統合、Job 失敗時の runner による incomplete への上書き、reporter 不在時の incomplete 補完の各経路で、review result が末尾改行 1 つで終わることを確認する回帰テストを追加した。既存の検証と合わせて、complete は統合と worktree 撤去、incomplete は `waiting` と worktree 保持を確認する。
- 整形と静的検査は executor/reporter pipeline の親 runner が実行する。executor では親検証と重複しない `register build` と `catalog validate` を実行した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqza-routine-commit-after-run]]: Job Run を worktree で実行し review を経て統合する流れ
- [[prj-0001:pjr-md3c-job-review-agent]]: Job の review の宣言と agent の指名
