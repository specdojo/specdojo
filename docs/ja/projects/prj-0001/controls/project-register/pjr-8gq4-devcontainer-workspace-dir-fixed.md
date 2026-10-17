---
specdojo:
  id: prj-0001:pjr-8gq4-devcontainer-workspace-dir-fixed
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-17T11:27:24Z"
  due_on: null
---

# PJR-8GQ4 devcontainer の作業ディレクトリが /workspaces/specdojo-workspace に固定されている

## 1. 課題内容

devcontainer scaffold の雛形が、親のディレクトリを /workspaces/specdojo-workspace にマウントし、作業ディレクトリを /workspaces/specdojo-workspace/`<repo>` にする。利用者の親のディレクトリが app1-workspace でも specdojo-workspace という名前になるため、親のディレクトリの名前（例: /workspaces/app1-workspace/app1-specdojo）に合わせる

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `templates/devcontainer/devcontainer.json` の `workspaceMount`・`workspaceFolder`、`src/devcontainer/scaffold.ts`、devcontainer の雛形の説明とガイド                                               |
| スケジュール | 急がない                                                                                                                                                                                           |
| コスト       | 利用者の親のディレクトリが `app1-workspace` でも、コンテナの中では `/workspaces/specdojo-workspace` になり、パスがホストと対応しない。複数の利用者のリポジトリを同時に開くと、どれも同じ名前になる |
| 品質         | 用語の整理（[[prj-0001:pjr-9g9y-practice-execution-terminology]] など）で使う例（`app1-workspace/`）と、生成される構成が食い違う                                                                   |
| 関係者       | `devcontainer scaffold` を使う利用者                                                                                                                                                               |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 雛形が `target=/workspaces/specdojo-workspace` と `workspaceFolder` の `/workspaces/specdojo-workspace/${localWorkspaceFolderBasename}` を固定で持ち、scaffold がそのまま書き出す。devcontainer.json の変数には、親のディレクトリの名前を表すものがない |
| 対応策   | scaffold が、実行したリポジトリの親のディレクトリの名前（例: `app1-workspace`）を取得し、`/workspaces/<親のディレクトリの名前>` を `workspaceMount` の `target` と `workspaceFolder` に書く                                                             |
| 依存事項 | なし                                                                                                                                                                                                                                                    |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                  |

### 3.1. 完了条件

- `devcontainer scaffold` を `app1-workspace/app1-specdojo` で実行すると、`workspaceMount` の `target` が `/workspaces/app1-workspace`、`workspaceFolder` が `/workspaces/app1-workspace/${localWorkspaceFolderBasename}` になる。
- 親のディレクトリの名前に、devcontainer.json やパスとして使えない文字が含まれる場合の扱い（置き換えるか、理由を出して止めるか）を決めて実装し、result に書く。
- `safe.directory` など、ほかに `/workspaces/specdojo-workspace` を前提にしている雛形や scaffold の処理（`post-create.sh` など）も、同じ名前に合わせる。
- 本リポジトリの `.devcontainer/devcontainer.json` は、本リポジトリの親のディレクトリが実際に `specdojo-workspace` であるため変えない。
- scaffold の単体テストで、親のディレクトリの名前が反映されることを確かめる。
- 雛形の説明、`docs/ja/specdojo/references/command-reference.md` の `devcontainer scaffold`、関係するガイドの `/workspaces/specdojo-workspace` の記載を直す。
- CHANGELOG の次の版の節に、生成される作業ディレクトリが変わることを記載する（既に scaffold した利用者は、作り直すまで従来のまま）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2h5f-devcontainer-scaffold]]: devcontainer scaffold を作った項目。
