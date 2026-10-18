---
specdojo:
  id: prj-0001:pjr-e412-not-applicable-repo-env-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T06:06:37Z"
  due_on: "2026-10-31"
---

# PJR-E412 SPECDOJO_REPO_* で指定したプロダクトリポジトリのコマンドを not_applicable の判定が認識しない

## 1. 課題内容

runner は agent に `SPECDOJO_REPO_<NAME>` でプロダクトリポジトリの場所を渡すが、not_applicable の判定（productRepoCommand）は --prefix `<repo>` と `<repo>`:`<path>` しか認識しない。$SPECDOJO_REPO_SPECDOJO_LP/... のコマンドがプロジェクトリポジトリの package.json で判定され、正しい not_applicable が却下されて run が止まる

## 2. 影響範囲

| 観点         | 影響                                                                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `repos` を宣言した別リポジトリ構成の register run で、executor が `$SPECDOJO_REPO_<NAME>` を使ってプロダクトリポジトリを指すコマンドを記録した場合 |
| スケジュール | run が `waiting` に止まり、orchestrator が runner の代わりに統合する手間がかかる                                                                   |
| コスト       | 手動の統合、evidence の移動、状態遷移の記帳                                                                                                        |
| 品質         | 正しい `not_applicable` が却下される。逆に、プロジェクトリポジトリにない道具なら誤って受け入れる可能性もある                                       |
| 関係者       | 別リポジトリ構成で exec を使う利用者と orchestrator                                                                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | runner は agent に `SPECDOJO_REPO_<NAME>`（`src/exec-task-repos.ts`）でプロダクトリポジトリの worktree の場所を渡す。`not_applicable` の判定（`src/exec-reporter.ts` の `productRepoCommand`）は `--prefix <repo>` と `<repo>:<path>` だけを認識し、環境変数の形はプロジェクトリポジトリの `package.json` で判定する |
| 対応策   | _UNDECIDED_: 候補は (1) `productRepoCommand` が `$SPECDOJO_REPO_<NAME>` / `${SPECDOJO_REPO_<NAME>}` を含むコマンドを該当リポジトリとして判定する、(2) executor への指示で `<repo>:<path>` か `--prefix <repo>` の形で記録させる。(1) は agent の書き方に依存しない                                                   |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                 |
| 完了条件 | `$SPECDOJO_REPO_<NAME>` でプロダクトリポジトリを指すコマンドの `not_applicable` が、そのリポジトリの `package.json` で判定される。単体テストで確認する                                                                                                                                                               |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-kh17-lp-tool-fit-guide]]: run が止まった項目。
- [[prj-0001:pjr-wp44-not-applicable-reason-criteria]]: `catalog validate` の `not_applicable` が通らない近い問題。
- 再現（2026-10-12）: prj-0002 の PJR-KH17 の 2 回目の run（evidence `20261012T053152081Z-7bd6dc06`）。executor が `npx prettier --write "$SPECDOJO_REPO_SPECDOJO_LP/src/pages/index.astro"` を「specdojo-lp/package.json に Prettier がない」理由で `not_applicable` と記録し、`executor validation failed or not run` で `waiting` になった。
