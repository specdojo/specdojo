---
specdojo:
  id: prj-0001:pjr-86q5-product-worktree-deps-not-installed
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T13:43:19Z"
---

# PJR-86Q5 プロダクトリポジトリの worktree に依存が導入されない

## 1. 課題内容

worktree 準備はプロジェクト側の依存だけを導入し、プロダクト worktree では npm ci を行わない。executor の sandbox では npm も実行できないため、プロダクトのビルドや検証を exec 内で確認できない

## 2. 影響範囲

| 観点         | 影響                                                                             |
| ------------ | -------------------------------------------------------------------------------- |
| スコープ     | `repos` を宣言した project の exec worktree の準備（`src/exec-worktree-ops.ts`） |
| スケジュール | v0.3.0 の公開前に直す                                                            |
| コスト       | プロダクト側のビルド・テストを、executor も親検証も実行できない                  |
| 品質         | プロダクトの変更を検証しないまま統合することになる                               |
| 関係者       | `repos` を宣言した project の利用者                                              |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | worktree の準備は project リポジトリ（とその `packages/*`）の依存だけを `npm ci` で導入し、プロダクトリポジトリの worktree には導入しない                                                                                                                                                                                                                                                                       |
| 対応策   | プロダクトリポジトリの worktree に `package-lock.json` があれば、project 側と同じ方式で `npm ci` を実行する。lock が無い場合は導入せず、その旨をログに出す。失敗した場合の扱い（準備の失敗とするか）は project 側に揃える                                                                                                                                                                                       |
| 依存事項 | [[prj-0001:pjr-2gze-product-validation-not-run-delegation]] がこの依存を前提にする                                                                                                                                                                                                                                                                                                                              |
| 完了条件 | lock を持つプロダクトリポジトリの worktree で依存が導入され、lock を持たない場合は導入しないことを統合テストで確認する。docs-structure-guide の「現行実装の境界」の表を更新する。統合テストで子プロセスとして CLI を起動する場合は、実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する。fixture の `agent-members.yaml` は schema の必須項目（`capabilities`・`proficiency`・`priority` など）を満たす |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- prj-0002 の PJR-CM5W（`project/prj-0002/develop` 上）: 事象が起きた実行
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]: v0.3.0 の公開前に直すと利用者が判断した（2026-10-12）
