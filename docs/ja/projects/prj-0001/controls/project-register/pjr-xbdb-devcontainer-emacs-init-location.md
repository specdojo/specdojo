---
specdojo:
  id: prj-0001:pjr-xbdb-devcontainer-emacs-init-location
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-09T13:28:55Z"
---

# PJR-XBDB devcontainer scaffold の Emacs の設定が ~/.emacs.d があると読まれない

## 1. 課題内容

devcontainer scaffold --editor emacs の post-create は、init.el がどこにもないときテンプレートを ~/.config/emacs/init.el に置く。Emacs は ~/.emacs.d があると init.el がなくても ~/.config/emacs を読まないため、Emacs を起動したことがある環境やホームを引き継ぐ構成ではテンプレートが黙って無視される（2026-10-09 に実機で確認）。

## 2. 影響範囲

| 観点         | 影響                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| スコープ     | `src/devcontainer-scaffold.ts` が生成する post-create の Emacs の設定の配置、その unit test と案内文書 |
| スケジュール | devcontainer scaffold は v0.3.0 で試験的な機能。公開前に直すのが望ましい                               |
| コスト       | 利用者が設定の効かない理由を調べる手間                                                                 |
| 品質         | テンプレートが黙って無視され、`C-h` などの既定が効かない                                               |
| 関係者       | `--editor emacs` を使う利用者                                                                          |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | Emacs は `~/.emacs` / `~/.emacs.el` / `~/.emacs.d` のいずれかがあると `~/.config/emacs/` を読まない。`~/.emacs.d` は Emacs の初回起動で自動的に作られる                                    |
| 対応策   | 実際に読まれる場所へ置く。下記の「完了条件の詳細」のとおり。本リポジトリの `.devcontainer/post-create.sh` は同じ規則で orchestrator が対応済み（feature/prj-0001/devcontainer-emacs-init） |
| 依存事項 | PJR-J7WE                                                                                                                                                                                   |
| 完了条件 | 下記の「完了条件の詳細」を満たす                                                                                                                                                           |

### 3.1. 完了条件の詳細

- 生成する post-create は、`~/.emacs`、`~/.emacs.el`、`~/.emacs.d/init.el`、`~/.config/emacs/init.el` のいずれかがあれば何もしない（利用者の設定を優先する）。
- いずれもない場合、`~/.emacs.d` ディレクトリがあれば `~/.emacs.d/init.el` に、なければ `~/.config/emacs/init.el` にテンプレートを置く。
- 置いた場所を post-create の出力に表示する。
- unit test で、生成された post-create の処理を一時的な HOME で実行し、次を確かめる。
  - 何もない場合は `~/.config/emacs/init.el` に置かれる。
  - 空の `~/.emacs.d` がある場合は `~/.emacs.d/init.el` に置かれる。
  - `~/.emacs` がある場合は何も置かれない。
- command-reference と remote-host-development-guide の配置の説明を直す。
- CHANGELOG の v0.3.0 の devcontainer scaffold の項目に追記する。
- `npm run check` が通る。

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-j7we-devcontainer-emacs-template]]（Emacs のテンプレートの展開）
