---
specdojo:
  id: prj-0001:pjr-j7we-devcontainer-emacs-template
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-07T13:56:21Z"
  due_on: null
---

# PJR-J7WE devcontainer scaffold で Emacs の設定をテンプレートから展開する

## 1. 概要

[[prj-0001:pjr-2h5f-devcontainer-scaffold]] の `specdojo devcontainer scaffold` は、利用リポジトリに devcontainer を生成する。本リポジトリの devcontainer（[[prj-0001:pjr-fpcm-devcontainer-editor-toolchain]]）は Emacs と LSP サーバーを入れているが、Emacs の設定は利用者の dotfiles に任せている。

scaffold のオプションで Emacs を選んだ場合に、必要なツールと、一般的なキーバインドを設定した Emacs の設定ファイルをテンプレートから展開し、コンテナを作ればすぐ使える状態にする。

## 2. 完了条件

- `specdojo devcontainer scaffold` に Emacs を加えるオプション（例: `--editor emacs`。名前は PJR-2H5F の既存のオプションの命名に合わせてよい）がある。既定では Emacs を入れない。
- オプションを指定した場合、生成する devcontainer に次を入れる。
  - Emacs（端末版）と、Emacs から使う LSP サーバー（TypeScript・Markdown・YAML・Bash）と検索ツール（ripgrep）。導入方法は本リポジトリの `.devcontainer/` の Emacs と LSP の導入（PJR-FPCM）に合わせる。
  - Emacs の設定ファイルのテンプレート（例: `init.el`）。テンプレートは package に同梱し、scaffold で `.devcontainer/` 配下へ展開する。
- コンテナの作成時（post-create）に、利用者の Emacs の設定（`~/.emacs.d/init.el` または `~/.config/emacs/init.el`）が無い場合だけ、展開したテンプレートを配置する。dotfiles などで既に設定がある場合は上書きしない。
- テンプレートの設定は、追加の package のダウンロードなしで動く（Emacs に同梱の機能だけを使う）。少なくとも次を含める。
  - `C-h` を後退（Backspace）として使う。ヘルプは別のキー（例: `C-x ?`）と `<f1>` で呼べる。
  - 文字コードを UTF-8 にする。行番号と対応する括弧を表示する。バックアップファイルと自動保存ファイルを作業ツリーに作らない。
  - 端末でマウスを使える。
  - TypeScript・Markdown・YAML・Bash のファイルを開くと、同梱の eglot で LSP サーバーに接続する（サーバーが無い場合はエラーにせず通常の編集を続ける）。
- テンプレートの各設定に、何をしているかのコメントを付け、利用者が変更・削除しやすくする。
- 単体テストで、オプションを指定した場合だけ Emacs の設定とツールの導入が生成されること、指定しない場合は生成されないことを確かめる。`emacs --batch` でテンプレートを読み込み、エラーにならないことを確かめる（実行できる環境の場合）。
- コマンドリファレンスと、devcontainer の利用手順の文書に、オプションとテンプレートの変更方法を記載する。
- 生成した devcontainer でコンテナを作り、Emacs で `C-h` が後退として働くこと、TypeScript のファイルで LSP に接続することの確認は、人が行う（executor は `requires_human` として申し送る）。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                              | 担当 | 状態 | メモ                          |
| --- | ----------------------------------------------------------------- | ---- | ---- | ----------------------------- |
| 1   | scaffold のオプション・テンプレート・post-create の配置を実装する | DEV  | done | `--editor emacs` で実装した   |
| 2   | テストと文書を更新する                                            | DEV  | done | 単体テストと利用手順を更新    |
| 3   | 生成した devcontainer で Emacs の動作を確かめる                   | PO   | done | Host Mac で確認（2026-10-12） |

## 4. 対応結果

- `devcontainer scaffold` に `--editor emacs` を追加した。指定時だけ `emacs-nox`、ripgrep、TypeScript・Markdown・YAML・Bash の LSP サーバーと `.devcontainer/emacs/init.el` を生成し、既定では追加しない。
- post-create は `~/.emacs.d/init.el` と `~/.config/emacs/init.el` がどちらも無い場合だけ、生成したテンプレートを後者へコピーする。既存の dotfiles は上書きしない。
- テンプレートは Emacs 組み込み機能だけを使い、`C-h`、UTF-8、行番号、括弧、バックアップ・自動保存、端末マウス、Eglot の設定をコメント付きで提供する。単体テストではオプションによる生成の有無、導入ツール、既存設定の保護条件、Emacs がある環境での batch 読み込みを検証する。
- [[specdojo:command-reference]] と [[specdojo:remote-host-development-guide]] にオプション、テンプレートの配置・変更方法、dotfiles 優先の挙動を記載した。
- 残課題は No. 3 の実機確認である。生成した Dev Container を作成し、端末 Emacs の `C-h` と TypeScript バッファの Eglot 接続を人が確認する。

実機の確認（2026-10-12、利用者）: `--editor emacs` を指定して生成した devcontainer で、Emacs の `C-h` が後退として働くこと、TypeScript のファイルで eglot が LSP に接続することを確かめた。

## 5. 関連ドキュメント

- [[prj-0001:pjr-2h5f-devcontainer-scaffold]]（devcontainer scaffold）
- [[prj-0001:pjr-fpcm-devcontainer-editor-toolchain]]（本リポジトリの Emacs と LSP の導入）
