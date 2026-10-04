---
specdojo:
  id: prj-0001:pjr-mp2p-devcontainer-config-persistence
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-03T14:27:19Z"
  due_on: null
  completed_at: "2026-10-04T06:23:58Z"
  conclusion: tsd-home-mac-dev-server に設定・認証情報の保存先を named volume・コンテナ内のみ・母艦と共有/コピー・母艦のみの4分類で整理し、再作成後の作業を記載した。tsd-home-mac-dev-server-usage の一覧は正本への参照に置き換えた。docs:build と利用者の確認を経て close した
---

# PJR-MP2P devcontainer の設定の保存先（named volume・コンテナ内のみ・母艦と共有）を文書に明記する

## 1. 概要

devcontainer の各設定・認証情報が named volume に残るか、リビルドで消えるか、母艦と共有・コピーされるかが文書にない。opencode の API key（`~/.local/share/opencode/auth.json`）が named volume の外にありリビルドで消えていた件（`specdojo-opencode-data` を追加して対応済み）を受け、保存先の一覧と、リビルド後に必要な再設定を guide か設計書に明記する

## 2. 完了条件

- [[tsd-home-mac-dev-server]] の「devcontainer 設定」に、設定・認証情報の保存先の一覧表を追加する。各項目について、保存先のパス、次の分類、リビルド後に必要な作業を書く。
  - named volume（`.devcontainer/devcontainer.json` の `mounts`。リビルド後も残る）
  - コンテナ内のみ（リビルドで消え、`post-create.sh` などで作り直すもの、または手作業で再設定が必要なもの）
  - 母艦と共有またはコピー（`workspaceMount` の bind mount、Dev Containers による `~/.gitconfig` のコピーなど）
- 一覧は `.devcontainer/devcontainer.json`、`.devcontainer/Dockerfile`、`.devcontainer/post-create.sh`、`.devcontainer/prepare-agent-dirs.sh` の実装と一致させる。最低限、次を含める。
  - agent CLI の設定・認証（`~/.claude`、`~/.codex`、`~/.copilot`、`~/.gemini`、`~/.config/opencode`、`~/.local/share/opencode`、`~/.config/antigravity`、`~/.config/gh`）
  - git の設定（named volume の `~/.config/git/config` が、Dev Containers がコピーした母艦の `~/.gitconfig` を include する構成）
  - エディタのデータ（`~/.local/share/emacs`、`~/.local/share/nvim`）と、dotfiles から導入する設定
  - `~/.local/bin` の CLI、shell profile（`~/.bashrc` など）、cron の設定
- 母艦側にだけ置くもの（oMLX の `~/.omlx/settings.json`、Ollama のモデルなど）と、devcontainer から参照する方法を書く。
- [[tsd-home-mac-dev-server-usage]] の named volume の一覧を、上の一覧表への参照に置き換えるか、同じ内容にそろえる。`specdojo-opencode-data` が欠けている状態を残さない。
- 同じ内容を複数の文書に重複して書かない。正本は [[tsd-home-mac-dev-server]] とし、他の文書からは参照する。
- `npm run lint:md`・`npm run lint:fm`・`npm run docs:build` が通る。

## 3. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ                                 |
| --- | -------------------------------------- | ---- | ---- | ------------------------------------ |
| 1   | 保存先の棚卸し                         | DEV  | done | `.devcontainer` の実装から一覧を作成 |
| 2   | tsd-home-mac-dev-server への追記       | DEV  | done | 正本の一覧表を追加                   |
| 3   | tsd-home-mac-dev-server-usage のそろえ | DEV  | done | 正本への参照に置き換え               |

## 4. 対応結果

[[tsd-home-mac-dev-server]] の 4.10.1 に、named volume、コンテナ内のみ、母艦との共有・コピー、母艦のみの4分類で設定・認証情報の保存先と再作成後の作業を整理した。`specdojo-opencode-data` と `auth.json`、Git 設定、エディタデータと dotfiles、CLI、shell profile、tmux、cron、oMLX、Ollama を実装に合わせて記載した。

[[tsd-home-mac-dev-server-usage]] の古い named volume 一覧は正本への参照に置き換え、存在しない `specdojo-claude-state` を削除するとともに `specdojo-opencode-data` の確認先を明記した。残課題はない。

## 5. 関連ドキュメント

- [[tsd-home-mac-dev-server]]
- [[tsd-home-mac-dev-server-usage]]
- [[tsd-omlx-opencode]]
