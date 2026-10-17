---
specdojo:
  id: prj-0001:pjr-8gq4-devcontainer-workspace-dir-fixed
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

| 項目     | 内容                                                                                                                                                                                                                                                                                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | 雛形が `target=/workspaces/specdojo-workspace` と `workspaceFolder` の `/workspaces/specdojo-workspace/${localWorkspaceFolderBasename}` を固定で持ち、scaffold がそのまま書き出す。devcontainer.json の変数には、親のディレクトリの名前を表すものがない                                                                                                 |
| 対応策   | 既定では、scaffold が実行したリポジトリの親のディレクトリの名前（例: `app1-workspace`）を取得し、`/workspaces/<親のディレクトリの名前>` を `workspaceMount` の `target` と `workspaceFolder` に書く。`--workspace-name <name>` を指定した場合は、その名前を使う（2026-10-17、利用者が承認。固定の名前にする案は、ホストの構成と対応しないため採らない） |
| 依存事項 | なし                                                                                                                                                                                                                                                                                                                                                    |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                                                                                                                                                  |

### 3.1. 完了条件

- `devcontainer scaffold` を `app1-workspace/app1-specdojo` で実行すると、`workspaceMount` の `target` が `/workspaces/app1-workspace`、`workspaceFolder` が `/workspaces/app1-workspace/${localWorkspaceFolderBasename}` になる。
- `devcontainer scaffold --workspace-name <name>` で、親のディレクトリの名前の代わりに `<name>` を使える。ホストで親のディレクトリの名前を変えた後も、前の名前を指定して同じパスを保てる。`specdojo init --devcontainer` から scaffold する場合も、同じ指定を渡せるようにするか、渡せない理由を result に書く。
- 親のディレクトリの名前や `--workspace-name` の値に、パスとして使えない文字（`/`・空白・制御文字など）が含まれる場合の扱い（置き換えるか、理由を出して止めるか）を決めて実装し、result に書く。
- `safe.directory` など、ほかに `/workspaces/specdojo-workspace` を前提にしている雛形や scaffold の処理（`post-create.sh` など）も、同じ名前に合わせる。
- 本リポジトリの `.devcontainer/devcontainer.json` は、本リポジトリの親のディレクトリが実際に `specdojo-workspace` であるため変えない。
- scaffold の単体テストで、親のディレクトリの名前が反映されることと、`--workspace-name` で上書きできることを確かめる。
- 雛形の説明、`docs/ja/specdojo/references/command-reference.md` の `devcontainer scaffold`（新しい引数を含む）、関係するガイドの `/workspaces/specdojo-workspace` の記載を直す。コンテナの中で作った git worktree は絶対パスを記録するため、親のディレクトリの名前を変えるときは `--workspace-name` で前の名前を保つよう注意書きを加える。
- CHANGELOG の次の版の節に、生成される作業ディレクトリが変わることを記載する（既に scaffold した利用者は、作り直すまで従来のまま）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。

## 4. 対応結果

- 解決内容: `devcontainer scaffold` が scaffold 対象リポジトリの親ディレクトリ名を取得し、`workspaceMount` と `workspaceFolder` の `/workspaces/<親名>` に反映するようにした。`--workspace-name <name>` で名前を上書きでき、`specdojo init --devcontainer` からも同じ指定を渡せる。
- 入力検証: 親名と `--workspace-name` は英数字・`.`・`_`・`-` だけを許可し、`.`・`..`、空白、`/`、制御文字などを含む値は、意図しない名前へ置換せず理由を表示して停止する。
- 関連処理: `post-create.sh` は実行時の Git ルートから親を求めるため、生成された `workspaceFolder` に追従して `safe.directory` を設定する。本リポジトリ自身の `.devcontainer/devcontainer.json` は変更していない。
- 確認内容: 親名の反映、`--workspace-name` の上書き、不正値の拒否、`specdojo init --devcontainer` からの引き渡しを単体テストへ追加した。CLI リファレンス、常時稼働ホスト運用ガイド、CHANGELOG へ新しい挙動と Git worktree の絶対パスに関する注意を記載した。
- 再発防止策: scaffold のテストが生成された `workspaceMount` と `workspaceFolder` を検証し、テンプレートには固定の利用者名ではなく scaffold が置き換えるプレースホルダを保持する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2h5f-devcontainer-scaffold]]: devcontainer scaffold を作った項目。
