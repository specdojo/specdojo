---
specdojo:
  id: prj-0001:pjr-vgng-job-run-partial-failure-integration
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T21:56:35Z"
---

# PJR-VGNG 一部の文書が失敗した Job Run が完了分も含めて統合されない

## 1. 課題内容

grade の Job Run で一部の文書の評価が失敗すると Job Run 全体が failed になり、review が incomplete と判定して、評価できた文書の結果も統合されない。完了した文書の結果を統合し、失敗した文書は次の Run へ回すことを review の判定で選べるようにする

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | grade の Job（`docs/ja/projects/prj-0001/jobs/job-grade-deliverable.yaml`・`job-grade-kata.yaml`）の command と review の観点、`tools/grade/run-per-document.sh` の終了コード、Job Run の状態（`src/job/`）、routine の統合の判定 |
| スケジュール | 急がないが、定期評価の成果を無駄にしないため早めに直す                                                                                                                                                                            |
| コスト       | 1 件でも評価が失敗すると、評価できた文書の結果も統合されず、次の Run で評価し直すか人が手で統合する（2026-10-12 の kata の Run は 15 件中 3 件の失敗で人が統合した）                                                              |
| 品質         | 定期評価の結果が、一部の失敗で丸ごと捨てられる                                                                                                                                                                                    |
| 関係者       | 定期実行の grade の運用                                                                                                                                                                                                           |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `run-per-document.sh` は 1 件でも段が失敗すると 0 以外で終わり、Job の command がその終了コードで失敗する。Job Run の状態が `failed` になり、review は完了条件に従って `incomplete` と判定し、routine は統合しない |
| 対応策   | 評価できた文書と失敗した文書を分けて扱う。少なくとも 1 件の評価ができ、失敗した文書が評価の状態（再試行の回数）に記録されている場合は、評価できた分を統合できる結果として扱い、失敗した文書は次の Run で評価し直す |
| 依存事項 | なし                                                                                                                                                                                                               |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                             |

### 3.1. 完了条件

- grade の Job Run で、一部の文書の評価が失敗し、残りの文書の評価ができた場合に、評価できた文書の結果が review を経て統合される。失敗した文書は評価の状態に記録され、次の Run で評価し直される（既存の連続失敗の上限 `max_failures` に従う）。
- 終了コード 75（上限）や中断で未完了の段がある場合と、すべての文書の評価が失敗した場合は、従来どおり統合しない（`waiting`）。
- 一部の失敗を表す状態を、Job Run の状態に加えるか（例: `partial`）、`succeeded` の中で失敗の件数を記録するかを決めて実装し、理由を result に書く。routine の記録（`last_result`）と `routine list` の表示でも、一部の失敗が分かるようにする。
- grade の Job の review の観点（command の `analysis` と review の完了条件）を、一部の失敗のときに `complete-with-findings` と判定し、失敗した文書と理由を指摘として残す形に改める。成果物と kata の 2 つの Job を揃える。
- routine の運用ガイド（[[specdojo:routine-operation-guide]]）に、一部の失敗の扱いを書く。
- 統合テストか単体テストで、一部の失敗・全部の失敗・未完了の 3 通りを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG に記載する場合は、未公開の版の節（`## [0.4.0] - 未定`）に書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:routine-operation-guide]]: routine と grade の運用。
- [[prj-0001:pjr-vqza-routine-commit-after-run]]: routine の worktree での実行と review。
