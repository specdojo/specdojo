---
specdojo:
  id: prj-0001:pjr-86q5-product-worktree-deps-not-installed
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T13:43:19Z"
  completed_at: "2026-10-12T07:19:07Z"
  conclusion: プロダクトの worktree に package-lock.json があれば npm ci で依存を導入するようにした
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

- 解決内容: 調査の結果、プロダクト worktree の作成時の依存導入は PJR-98G4 で配線済みで、`setup.install`（既定 `true`）のリポジトリでは project 側と同じ `installWorktreeDependencies` が追跡されている `package-lock.json` ごとに `npm ci` を実行していた。PJR-CM5W では、プロダクト worktree の作成時点で `specdojo-lp` に lock が無かったため（lock は後から orchestrator が統合先で生成した）、何も導入されず、ログも出なかった。そこで、追跡されている lock が無い worktree では導入しなかったことを `Skipping worktree dependencies: no tracked package-lock.json in <path>` としてログに出すようにした（`src/exec-worktree.ts`）。失敗時の扱いは project 側と同じ（`npm ci` の失敗は準備の失敗）である。
- 確認結果: `tests/src/exec-task-repos.integration.test.ts` に、lock を持つプロダクト worktree では `npm ci --include=dev` がその worktree で実行され、lock を持たないプロダクト worktree では実行されずログが出ることを確認する統合テストを追加した。`npm` はネットワークに依存しない代替スクリプトを `PATH` の先頭に置いて置き換え、既定の準備経路（`checkpointAndEnsureWorktree`）をそのまま通す。CLI を子プロセスとして起動しないため、`tsx` の絶対パス起動と `agent-members.yaml` の fixture は不要である。docs-structure-guide の「現行実装の境界」の表に「依存の導入」の行を追加した。
- 再発防止策: lock が無いことがログで分かるため、依存が無いまま検証が失敗したときに原因を追える。
- 残課題: 再利用する worktree では、project 側と同じく依存を導入し直さない。作成後に lock が追加された場合は、worktree を作り直すまで依存は導入されない。

## 5. 関連ドキュメント

- prj-0002 の PJR-CM5W（`project/prj-0002/develop` 上）: 事象が起きた実行
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]: v0.3.0 の公開前に直すと利用者が判断した（2026-10-12）
