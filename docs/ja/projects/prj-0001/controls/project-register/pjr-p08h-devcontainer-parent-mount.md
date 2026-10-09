---
specdojo:
  id: prj-0001:pjr-p08h-devcontainer-parent-mount
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: ARC
  registered_at: "2026-10-09T19:58:02Z"
  due_on: "2026-10-31"
---

# PJR-P08H devcontainer scaffold が親ディレクトリをマウントせずプロダクトリポジトリが見えない

## 1. 課題内容

templates/devcontainer/devcontainer.json に workspaceMount が無く、生成したコンテナからは app1-specdojo/ しか見えない。../app1 と ../app1-specdojo-worktrees を使えるよう、親ディレクトリをマウントする。

## 2. 影響範囲

| 観点         | 影響                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `devcontainer scaffold` の生成物（`devcontainer.json`、`post-create.sh`）と関連文書                                                         |
| スケジュール | PJR-ZGJ4 と、`repos` を使う exec の前提になる                                                                                               |
| コスト       | テンプレートと scaffold の小規模な変更                                                                                                      |
| 品質         | 生成コンテナで `repos` を宣言すると、設定の読み込みが「path が存在しない」エラーになる。worktree はコンテナ内の永続化されない場所に作られる |
| 関係者       | 別リポジトリ構成（`app1/` と `app1-specdojo/`）で Dev Container を使う利用者                                                                |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `templates/devcontainer/devcontainer.json` に `workspaceMount` が無く、既定のマウントが開いたフォルダ（`app1-specdojo/`）だけになる                                      |
| 対応策   | SpecDojo 本体の `.devcontainer/devcontainer.json` と同じく、親ディレクトリを `workspaceMount` でマウントし、`workspaceFolder` をその配下のプロジェクトリポジトリに向ける |
| 依存事項 | なし                                                                                                                                                                     |
| 完了条件 | 下記「完了条件」のとおり                                                                                                                                                 |

### 3.1. 完了条件

- `devcontainer scaffold` が生成する `devcontainer.json` が、`workspaceMount` で `${localWorkspaceFolder}/..` をマウントする。
- 生成した `devcontainer.json` の `workspaceFolder` が、マウントした親ディレクトリ配下のプロジェクトリポジトリ（`${localWorkspaceFolderBasename}`）を指す。
- 生成した `post-create.sh` が、親ディレクトリ配下の Git リポジトリ（`app1/` と worktree 置き場を含む）を `safe.directory` へ登録する。またはプロジェクトリポジトリ以外を登録しない理由を文書に残す。
- 上記を `tests/devcontainer-scaffold.test.ts` の unit test で確かめる。
- `remote-host-development-guide` と `command-reference` の `devcontainer scaffold` の説明に、親ディレクトリをマウントすること、その理由（`repos` と `worktree_base` がプロジェクトリポジトリの外にあること）、ホストの親ディレクトリにある他のファイルもコンテナから見えることを書く。
- CHANGELOG に記載する。
- `npm run typecheck`、`npm run lint:ts`、`npm run test:unit`、`npm run lint:md` が通る。

### 3.2. 作業内容

- `templates/devcontainer/devcontainer.json` または `src/devcontainer-scaffold.ts` に `workspaceMount` と `workspaceFolder` を加える。
- `templates/devcontainer/post-create.sh` の `safe.directory` の登録を、親ディレクトリ配下へ広げるか判断して反映する。
- unit test と文書を更新する。
- SpecDojo 本体の `.devcontainer/` は変更しない（すでに親ディレクトリをマウントしている）。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[specdojo:docs-structure-guide]]（別リポジトリ構成）
- [[specdojo:specdojo-config-reference]]（`repos`のキー）
- PJR-ZGJ4（orchestrator のプロダクトリポジトリへのアクセス）
