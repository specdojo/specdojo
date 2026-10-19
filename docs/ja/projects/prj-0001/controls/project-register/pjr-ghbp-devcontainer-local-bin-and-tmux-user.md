---
specdojo:
  id: prj-0001:pjr-ghbp-devcontainer-local-bin-and-tmux-user
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
  priority: high
  owner: DEV
  registered_at: "2026-10-19T21:17:36Z"
  derived_from:
    - PJR-CCXN
---

# PJR-GHBP devcontainer の雛形で ~/.local/bin を作れず、tmux のスクリプトが root で入る

## 1. 課題内容

init の scaffold で作った devcontainer で、opencode の volume を ~/.local/share/opencode に mount すると Docker が親の ~/.local を root の持ち物として作り、post-create.sh は mount 先しか持ち主を戻さないため、node が ~/.local/bin を作れず Claude Code などのインストーラが失敗する。また specdojo-tmux.sh.sample は docker exec に利用者を指定しないため、container の既定の root で入る（2026-10-20、利用者が報告）

## 2. 影響範囲

| 観点         | 影響                                                                                                        |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| スコープ     | `templates/devcontainer/post-create.sh`、`src/devcontainer/scaffold.ts`（`specdojo-tmux.sh.sample` の生成） |
| スケジュール | 高い。init で devcontainer を作った利用者が、agent の CLI を入れられない                                    |
| コスト       | 利用者が原因を調べて手で持ち主を直す手間                                                                    |
| 品質         | 接続のサンプルで入ると root になり、作ったファイルの持ち主が食い違う                                        |
| 関係者       | `init --devcontainer` と `devcontainer scaffold` の利用者                                                   |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | Docker は volume の mount 先の親のディレクトリを root の持ち物として作る。`post-create.sh` は mount 先だけの持ち主を戻すため、`~/.local` が root のまま残る。`specdojo-tmux.sh.sample` は `docker exec` に利用者を指定しない |
| 対応策   | `post-create.sh` で `~/.local` と `~/.local/share` の持ち主も戻し、`~/.local/bin` を作ってから CLI を入れる。接続のスクリプトは `remoteUser` で container に入る                                                             |
| 依存事項 | なし                                                                                                                                                                                                                         |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                                                                       |

### 3.1. 完了条件

- `post-create.sh` で、volume の mount 先の親（少なくとも `~/.local`・`~/.local/share`・`~/.config`）の持ち主を container の利用者に戻す。中身を再帰的に変えるのは mount 先だけとし、親は自身だけを変える。
- agent の CLI のインストーラを動かす前に、`~/.local/bin` を作り、`PATH` に加える。
- `specdojo-tmux.sh.sample` の `docker exec` に、`devcontainer.json` の `remoteUser`（既定は `node`）を `-u` で渡す。`remoteUser` を変えた利用者のために、値の変え方をスクリプトの冒頭のコメントに書く。
- 単体テストで、生成した `post-create.sh` に親の持ち主を戻す処理と `~/.local/bin` の作成があること、`specdojo-tmux.sh.sample` に `-u` があることを確かめる。
- devcontainer を実際に作り直して、`~/.local/bin` に Claude Code が入ること、接続のスクリプトで入ると node になることを確かめる（executor の sandbox で行えないため `requires_human` とし、利用者が確かめる）。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない。

## 4. 対応結果

- 解決内容:
  - `templates/devcontainer/post-create.sh` で、volume の mount 先の親ディレクトリ（`~/.local`・`~/.local/share`・`~/.config`）を非再帰でコンテナ利用者へ chown して所有者を戻し、mount 先（`~/.config/git`、`~/.local/share/opencode` など）は再帰的（`-R`）に chown するようにした。
  - 親ディレクトリの所有者を戻した後、agent CLI のインストーラ実行前に `mkdir -p "${HOME}/.local/bin"` を実行して `PATH` に加えるようにした。これにより、Docker が親ディレクトリを root 所有で作成した場合でも Claude Code 等のインストーラが失敗しないようにした。
  - `templates/devcontainer/remote-host/specdojo-tmux.sh.sample` の `docker exec` に `-u "$container_user"` を追加し、コンテナ既定の root ではなく `devcontainer.json` の `remoteUser`（既定は `node`）で tmux セッションに接続するようにした。冒頭コメントに `remoteUser` の変更方法を記載し、`src/devcontainer/scaffold.ts` で `devcontainer.json` の `remoteUser` に応じて `container_user` を置換・反映するようにした。
- 確認結果:
  - 単体テスト `tests/src/devcontainer/scaffold.test.ts` で、生成される `post-create.sh` に親ディレクトリの非再帰 chown・mount 先の再帰 chown・`~/.local/bin` の作成と `PATH` 追加がインストーラより前にあること、および `specdojo-tmux.sh.sample` に `-u` フラグ・`remoteUser` の反映・冒頭コメントでの変更方法の案内が含まれることを検証した。
  - 実機環境での devcontainer 再構築と接続確認は executor sandbox では行えないため、`requires_human` として利用者に引き継ぐ。
- 再発防止策:
  - Docker volume mount が介在するテンプレートでは親ディレクトリのパーミッション・所有者状態を考慮し、scaffold の単体テストで生成されるスクリプトの所有権修復とユーザー指定オプションを検証する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ccxn-devcontainer-remote-host-samples]]（元の項目）
