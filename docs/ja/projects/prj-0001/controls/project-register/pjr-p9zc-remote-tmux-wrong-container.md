---
specdojo:
  id: prj-0001:pjr-p9zc-remote-tmux-wrong-container
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-29T12:21:38Z"
  due_on: "2026-10-31"
  derived_from:
    - PJR-CCXN
---

# PJR-P9ZC 接続のスクリプトが、対象の devcontainer が止まっていると別の container へ入ろうとして失敗する

## 1. 課題内容

specdojo-tmux.sh.sample の find_container は、ラベルで見つからないと vsc- で始まる最初の container を選ぶ。そのため対象の devcontainer が止まっていると、別の container へ docker exec して「chdir to cwd ... no such file or directory」で止まる。ラベルの一致だけで探し、見つからなければ devcontainer up するように直す

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `templates/devcontainer/remote-host/specdojo-tmux.sh.sample`、その結合テスト（`tests/src/devcontainer/scaffold.integration.test.ts`）、[[specdojo:remote-host-development-guide]] の説明 |
| スケジュール | 期限 2026-10-31                                                                                                                                                                          |
| コスト       | _TODO_                                                                                                                                                                                   |
| 品質         | 対象の devcontainer が止まっていて、別の devcontainer が動いているホストでは、tmux から接続できない                                                                                      |
| 関係者       | サンプルから接続のスクリプトを作り、常時稼働ホストへ tmux で入る利用者                                                                                                                   |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `find_container` は `docker ps`（動いている container だけ）でラベル `devcontainer.local_folder` を探し、見つからないと `vsc-` で始まるイメージの最初の container を選ぶため、別の container が選ばれる。container が見つかったことになるので `devcontainer up` も動かない |
| 対応策   | 代わりに選ぶ処理を消し、ラベルの一致だけで探す。見つからなければ `devcontainer up` で起動する。`docker exec` の前に作業ディレクトリが container にあるかを確かめ、なければ原因の分かるメッセージで止める                                                                   |
| 依存事項 | なし                                                                                                                                                                                                                                                                       |
| 完了条件 | 3.1 のとおり                                                                                                                                                                                                                                                               |

### 3.1. 完了条件

- `specdojo-tmux.sh.sample` の `find_container` から、`vsc-` で始まるイメージの container を選ぶ処理を消し、ラベル `devcontainer.local_folder` が `workspace_dir` と一致する container だけを返す。
- 見つからないときは `devcontainer up --workspace-folder "$workspace_dir"` を実行し、もう一度ラベルで探す。`devcontainer up` の出力は標準エラーへ出す。
- `docker exec` の前に、`container_workspace_dir` が container にあるかを `test -d` で確かめ、なければ container 名とディレクトリを含むメッセージで止める。
- 冒頭のコメントに、ラベルが `workspace_dir` と一致しないと `devcontainer up` が別の新しい container を作ることと、ラベルの確かめ方（`docker inspect <id> --format '{{index .Config.Labels "devcontainer.local_folder"}}'`）を書く。
- 結合テストに、ラベルの一致する container が動いておらず、`vsc-` で始まる別の container が動いているときに、別の container へ `docker exec` せず `devcontainer up` を呼ぶ場合を加える。
- [[specdojo:remote-host-development-guide]] の `specdojo-tmux.sh.sample` の説明に、ラベルの一致する container だけへ接続することを書く。
- 生成したサンプルが `bash -n` と `shellcheck` を通る。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- `CHANGELOG.md` の `## [Unreleased]` 節に追記する。版の番号は決めない。公開済みの版（0.5.0 以前）の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ccxn-devcontainer-remote-host-samples]]（元の項目）
- [[specdojo:remote-host-development-guide]]
