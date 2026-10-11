---
specdojo:
  id: prj-0001:pjr-fpcm-devcontainer-editor-toolchain
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-02T11:47:42Z"
---

# PJR-FPCM devcontainer に Neovim と Emacs 用の開発ツールを導入する

## 1. 概要

開発用 devcontainer に Neovim 0.12（release の tarball）と、両エディタで共通に使う LSP（TypeScript・JSON/ESLint・YAML・Bash・Markdown）・tree-sitter CLI・C コンパイラ・lazygit・git-delta を導入する。エディタの設定とプラグインはイメージに含めず dotfiles と named volume で扱う

## 2. 完了条件

- `.devcontainer/Dockerfile` で Neovim 0.12 系を GitHub release の tarball から導入する。版と sha256 を固定し、arm64 と x86_64 の両方に対応する。`nvim --version` で 0.12 系が表示される。
- `tree-sitter` CLI と C コンパイラ（`build-essential`）を導入する。
- LSP として、npm のグローバルに `typescript-language-server`・`vscode-langservers-extracted`・`yaml-language-server`・`bash-language-server` を、release のバイナリ（版を固定）で `marksman` を導入し、それぞれの起動を確かめる。
- `lazygit`（release のバイナリ、版を固定）と `git-delta`（apt）を導入する。
- Emacs は apt の `emacs-nox`（trixie の 30.1）のままとする。30.2 は不具合修正の版であり、ソースからのビルドはイメージのビルド時間とサイズを大きく増やすため採らない。
- エディタの設定はローカルと共有しない。`devcontainer.json` から `~/dotfiles/.emacs.d` の bind mount を外し、Neovim の設定の mount も追加しない。ホストの状態によらずコンテナを起動できる。
- エディタの設定は、利用者の dotfiles のリポジトリを VS Code の `dotfiles.repository`（または devcontainer CLI の `--dotfiles-repository`）でコンテナ作成時に導入する。その手順と、リポジトリの構成の例（`emacs/`・`nvim/`・`install.sh`）を devcontainer の説明に書く。
- プラグイン・パッケージ・native compile のキャッシュ・tree-sitter の grammar は、named volume の `~/.local/share/emacs` と `~/.local/share/nvim` に置き、コンテナを作り直しても残す。Emacs の生成物をこの volume へ置く `early-init.el` の設定例を手順に含める。
- 利用者向けの `devcontainer scaffold`（[[prj-0001:pjr-2h5f-devcontainer-scaffold]]）の雛形には、このエディタ用のツールを既定で含めない。
- agent はコンテナを再ビルドできないため、イメージの再ビルド後に人が確かめる手順（Neovim と Emacs の Eglot で TypeScript と Markdown の LSP が起動すること、`lazygit` が起動すること）を result に書く。

## 3. 作業内容

| No  | 作業                                                  | 担当 | 状態 | メモ                                                                 |
| --- | ----------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------- |
| 1   | Dockerfile へのツールの導入（版の固定とチェックサム） | DEV  | done | Neovim 0.12.5、Marksman 2026-02-08、lazygit 0.65.1 と npm CLI を固定 |
| 2   | `devcontainer.json` の mount と volume の変更         | DEV  | done | Host の Emacs bind を外し、Emacs / Neovim の data volume を追加      |
| 3   | dotfiles のリポジトリを使う手順の記載                 | DEV  | done | 技術スタック定義 4.10.1〜4.10.2 に設定例と確認手順を追加             |
| 4   | 今の Emacs の設定を dotfiles のリポジトリへ移す       | 人   | open | 4.10.1 の例に従い、再ビルド前に設定と生成物の保存先を移す            |
| 5   | イメージの再ビルドとエディタでの動作確認              | 人   | open | 4.10.2 に従い、両エディタの LSP と lazygit を確認する                |

## 4. 対応結果

- `.devcontainer/Dockerfile` に、amd64 / arm64 対応の Neovim 0.12.5、Marksman 2026-02-08、lazygit 0.65.1 を公式 release と SHA-256 固定で追加した。npm global の TypeScript、JSON / ESLint、YAML、Bash の LSP と tree-sitter CLI は版を固定し、`build-essential` と `git-delta` は apt で追加した。Emacs は trixie の `emacs-nox` 30.1 を維持した。
- `.devcontainer/devcontainer.json` から Host Mac の `~/dotfiles/.emacs.d` bind mount を削除し、`/home/node/.local/share/emacs` と `/home/node/.local/share/nvim` を named volume にした。Neovim の設定を Host から mount する設定は追加していない。
- [[tsd-home-mac-dev-server|自宅 MacBook Pro 開発サーバ技術スタック定義]] に、VS Code / Dev Container CLI から dotfiles を導入する手順、`emacs/`・`nvim/`・`install.sh` の構成例、Emacs の package・native compile・tree-sitter grammar を data volume へ置く `early-init.el` の例、再ビルド後の確認手順を追加した。
- 残課題は人が担当する No. 4〜5 である。現在の Emacs 設定を dotfiles リポジトリへ移した後、Dev Container を再ビルドし、Neovim / Emacs Eglot の TypeScript・Markdown LSP、lazygit、named volume の再作成後の保持を実機で確認する。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2h5f-devcontainer-scaffold]]
- [[prj-0001:pjr-0029-devcontainer]]
- [[tsd-home-mac-dev-server|自宅 MacBook Pro 開発サーバ技術スタック定義]]
