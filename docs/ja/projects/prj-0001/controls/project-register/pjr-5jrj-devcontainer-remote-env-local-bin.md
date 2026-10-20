---
specdojo:
  id: prj-0001:pjr-5jrj-devcontainer-remote-env-local-bin
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-20T11:22:39Z"
  derived_from:
    - PJR-GHBP
---

# PJR-5JRJ devcontainer で後から開く端末に ~/.local/bin が PATH に入らない

## 1. 課題内容

GHBP で post-create.sh の中では ~/.local/bin を PATH に足したが、devcontainer.json に remoteEnv がないため、container の作成の後に開く端末や VS Code の terminal では ~/.local/bin が PATH に入らず、そこに入った Claude Code などの CLI が見つからない（2026-10-20、v0.4.0 の環境の直し方を確かめる中で見つかった）

## 2. 影響範囲

| 観点         | 影響                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| スコープ     | `templates/devcontainer/devcontainer.json`・`src/devcontainer/scaffold.ts`、`tools/e2e/devcontainer-host-e2e.ts` |
| スケジュール | 高い。devcontainer を作った後に開く端末で、`~/.local/bin` に入った Claude Code などの CLI が見つからない         |
| コスト       | 利用者が `~/.bashrc` などに PATH を足す手間                                                                      |
| 品質         | GHBP の修正だけでは CLI が使えない                                                                               |
| 関係者       | `init --devcontainer` と `devcontainer scaffold` の利用者                                                        |

## 3. 対応方針

| 項目     | 内容                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| 原因     | GHBP は `post-create.sh` の中でだけ `~/.local/bin` を PATH に足しており、`devcontainer.json` に `remoteEnv` がない |
| 対応策   | `devcontainer.json` の `remoteEnv` で `~/.local/bin` を PATH に足す                                                |
| 依存事項 | なし                                                                                                               |
| 完了条件 | 下記の完了条件を満たす                                                                                             |

### 3.1. 完了条件

- 生成する `devcontainer.json` の `remoteEnv` で、`/home/<remoteUser>/.local/bin` を PATH の先頭に足す（例: `"PATH": "/home/node/.local/bin:${containerEnv:PATH}"`）。既に `remoteEnv` がある構成でも、ほかの値を消さない。
- 単体テストで、生成した `devcontainer.json` に `remoteEnv` の PATH があることを確かめる。
- `tools/e2e/devcontainer-host-e2e.ts` に、`devcontainer exec` で新しく開いたシェル（ログインシェル）から `command -v claude` が `~/.local/bin/claude` を返すことの確認を足す。
- [[specdojo:remote-host-development-guide]] など、v0.4.0 で作った環境の直し方を書いている箇所があれば、`remoteEnv` の足し方を加える。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ghbp-devcontainer-local-bin-and-tmux-user]]（元の項目）
- [[prj-0001:pjr-3rxy-host-devcontainer-e2e-script]]（E2E のスクリプト）
