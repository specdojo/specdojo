---
specdojo:
  id: prj-0001:pjr-nn43-worktree-build-before-product-worktree
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-11T08:58:38Z"
---

# PJR-NN43 repos を持つ project の worktree 実行がプロダクトの worktree 作成前の build で失敗する

## 1. 課題内容

repos を宣言した project で exec run --worktree を行うと、project/ の worktree で specdojo build が設定を読む時点で兄弟のプロダクト worktree がまだなく、repos[].path の存在検査で失敗する

## 2. 影響範囲

| 観点         | 影響                                                                                 |
| ------------ | ------------------------------------------------------------------------------------ |
| スコープ     | `repos` を宣言した project での `exec run --worktree`（`--register`・`--task` とも） |
| スケジュール | `repos` を持つ project では worktree 実行ができず、in-place 実行で回避する必要がある |
| コスト       | 失敗した実行の後片づけと、in-place への切り替えの手間                                |
| 品質         | 成果物の隔離という worktree 実行の利点が使えない                                     |
| 関係者       | 別リポジトリ構成の project（prj-0002 など）の利用者                                  |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `src/exec-worktree-ops.ts` の `checkpointAndEnsureWorktree` は、`project/` の worktree を作った直後に `generateWorktreeArtifacts`（`specdojo build`）を実行し、その後で `ensureProductWorktrees` で兄弟のプロダクト worktree を作る。`specdojo build` は設定の読み込みで `repos[].path` の存在を検査するため、`../<repo>` がまだない時点で失敗する。 |
| 対応策   | プロダクトの worktree を先に作り、その後で project 側の `specdojo build` を実行する順序に改める。                                                                                                                                                                                                                                                    |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                 |
| 完了条件 | `repos` を宣言した project で `exec run --register --worktree` が準備の段階を通ることを統合テストで確認する。既存のテストが通る。                                                                                                                                                                                                                    |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-98g4-multi-repo-worktree-agent]]: `repos` を持つ project の worktree 配置（`project/` と兄弟のプロダクト worktree）を導入した項目。
- prj-0002 の PJR-G4QN（`project/prj-0002/develop` 上）: 事象が起きた実行（2 回目、`../specdojo-lp` が存在しないとして準備段階で失敗した）。
