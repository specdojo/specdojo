---
specdojo:
  id: prj-0001:pjr-2gze-product-validation-not-run-delegation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-11T15:00:34Z"
---

# PJR-2GZE プロダクトリポジトリの検証を not_run の委譲先として満たせない

## 1. 課題内容

executor が not_run と記録したプロダクトリポジトリの検証（例: npm --prefix specdojo-lp run build）は、runner がプロジェクト側で同じコマンドを通した場合しか満たされず、repo 指定の親検証でも解消できないため run が必ず止まる

## 2. 影響範囲

| 観点         | 影響                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| スコープ     | executor が `not_run` と記録した検証を、runner の親検証で満たしたとみなす判定（`src/exec-reporter.ts`） |
| スケジュール | v0.3.0 の公開前に直す                                                                                   |
| コスト       | プロダクトリポジトリを変える項目は、ビルドなどを executor が実行できないため必ず止まる                  |
| 品質         | 複数リポジトリの project で exec が統合まで進まない                                                     |
| 関係者       | `repos` を宣言した project の利用者                                                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `not_run` を満たす runner の結果は、`repo` を持たないか project リポジトリの親検証に限られている。`pipeline.parent_validations` の `{ id, repo }` でプロダクトリポジトリに割り当てた検証が通っても、満たしたとみなさない                                                                                                                                                                                                                                                      |
| 対応策   | `{ id, repo }` で割り当てた親検証が通っていれば、同じリポジトリを対象とする executor の `not_run`（例: `npm --prefix specdojo-lp run build`、`specdojo-lp` での `npm run build`）を満たしたとみなす。対応づけはコマンドとリポジトリの組で行い、別のリポジトリの結果では満たさない                                                                                                                                                                                             |
| 依存事項 | プロダクト側の親検証には依存の導入が要る（[[prj-0001:pjr-86q5-product-worktree-deps-not-installed]]）。WP44 と同じ判定の箇所を扱う                                                                                                                                                                                                                                                                                                                                            |
| 完了条件 | プロダクトリポジトリに割り当てた親検証が通った場合に、対応する executor の `not_run` が満たされることを単体テストで確認する。別のリポジトリの親検証や、失敗した親検証では満たされないことも確認する。exec-config-guide の該当の記述を更新する。統合テストで子プロセスとして CLI を起動する場合は、実リポジトリの `node_modules/.bin/tsx` を絶対パスで起動する。fixture の `agent-members.yaml` は schema の必須項目（`capabilities`・`proficiency`・`priority` など）を満たす |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- prj-0002 の PJR-HEPK（`project/prj-0002/develop` 上）: 事象が起きた実行
- [[prj-0001:pjr-p8tk-release-stabilization-criteria]]: v0.3.0 の公開前に直すと利用者が判断した（2026-10-12）
