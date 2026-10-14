---
specdojo:
  id: prj-0001:pjr-1dkd-integration-test-depends-on-generated-templates
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T09:18:58Z"
---

# PJR-1DKD 統合テストが生成済みテンプレートの有無に依存する

## 1. 課題内容

exec-register-pipeline-e2e の並列実行の 2 件が、実リポジトリの作業ツリーにある git 管理外の生成済みテンプレートをコピーする前提で書かれており、生成物のない新しい checkout では必ず失敗する

## 2. 影響範囲

| 観点         | 影響                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| スコープ     | `tests/src/exec-register-pipeline-e2e.integration.test.ts` の並列実行の 2 件       |
| スケジュール | 影響なし                                                                           |
| コスト       | 新しい checkout での失敗の切り分けの手間                                           |
| 品質         | `npm test` の結果が作業ツリーの状態で変わり、CI や新しい worktree で誤って失敗する |
| 関係者       | テストを流す開発者、exec の親の検証                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | fixture が実リポジトリの `docs/ja/specdojo/templates` を丸ごとコピーし、その中の git 管理外の `generated/` を管理済みの生成物として扱う。テストは `config init` 後に `git ls-files -ci --exclude-standard` が 1 件以上あることを前提にするが、生成物のない checkout では 0 件になり失敗する。 |
| 対応策   | fixture 自身で登録簿の生成物を作って commit してから `config init` を実行する形にし、実リポジトリの作業ツリーの状態に依存しないようにする。                                                                                                                                                   |
| 依存事項 | なし                                                                                                                                                                                                                                                                                          |
| 完了条件 | 生成物のない新しい checkout（`specdojo build` 前）で当該 2 件が通る。既存の環境でも通る。                                                                                                                                                                                                     |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- prj-0002 の PJR-G4QN（`project/prj-0002/develop` 上）: 事象が見つかった実行（prj-0002 の worktree での親の検証）。
