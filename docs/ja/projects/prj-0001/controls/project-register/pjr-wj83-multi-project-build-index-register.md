---
specdojo:
  id: prj-0001:pjr-wj83-multi-project-build-index-register
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-11T11:09:50Z"
---

# PJR-WJ83 project が複数あると specdojo build の index build が他 project の登録簿の欠落で失敗する

## 1. 課題内容

--project なしの specdojo build は current_project の登録簿しか生成しないが、index build は全 project の generated/pjr-index.md を要求するため、生成物のない新しい worktree では project が複数あると必ず失敗する

## 2. 影響範囲

| 観点         | 影響                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | project を 2 つ以上持つ checkout での `specdojo build`（`--project` なし）と、それを使う exec の worktree 準備・commit 前フックの `index-build` |
| スケジュール | 複数 project の構成では worktree 実行ができず、prj-0002 の PJR-CM5W が止まっている                                                              |
| コスト       | 失敗した実行のやり直しと切り分けの手間                                                                                                          |
| 品質         | 成果物の隔離という worktree 実行の利点が使えない                                                                                                |
| 関係者       | 複数 project を持つリポジトリの利用者                                                                                                           |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `src/build-command.ts` は `--project` がない場合、`current_project`（無ければ先頭の project）だけを対象に register build を行う。一方 `src/doc-index.ts` の index build は、リポジトリ内のすべての登録簿ディレクトリに `generated/pjr-index.md` があることを前提にする。生成物は git 管理外のため、新しい worktree では対象外の project の一覧が欠け、index build が失敗する。 |
| 対応策   | `--project` なしの `specdojo build` では、register build を設定にあるすべての project に対して行う。対象を 1 project に絞る他の段の扱いは変えない。                                                                                                                                                                                                                            |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                                           |
| 完了条件 | project を 2 つ持つ fixture で、生成物のない状態から `specdojo build`（`--project` なし）が通ることをテストで確認する。exec の worktree 準備が同じ fixture で通る。既存のテストが通る。                                                                                                                                                                                        |

## 4. 対応結果

| 項目       | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 解決内容   | `src/build-command.ts` に `resolveRegisterProjectIds` を追加した。`--project` なしの `specdojo build` では、`project_register_path` を持つすべての project について `register build --project <id>` を順に実行してから index build へ進む。`--project` を明示した場合は、従来どおりその project だけを対象にする。exec / catalog / dashboard の段は従来どおり 1 project を対象にする。                                                  |
| 確認結果   | 単体テスト `tests/src/build-command.test.ts` で対象 project の解決と段の並びを確認する。統合テスト `tests/src/build-command.integration.test.ts` では、project を 2 つ持ち生成物のない fixture で、`specdojo build`（`--project` なし）と exec の worktree 準備（`generateWorktreeArtifacts`）が両 project の `generated/pjr-index.md` を生成して通ることを確認する。テストは親 runner の `test:unit` / `test:integration` で実行する。 |
| 再発防止策 | 2 project の fixture を使う統合テストを追加し、index build が要求する登録簿の生成範囲と build の対象範囲がずれた場合に検知できるようにした。                                                                                                                                                                                                                                                                                            |

## 5. 関連ドキュメント

- [[prj-0001:pjr-nn43-worktree-build-before-product-worktree]]: 直前に直した worktree 準備の順序の不具合。本件はその先の段で見つかった。
- prj-0002 の PJR-CM5W（`project/prj-0002/develop` 上）: 事象が起きた実行。
