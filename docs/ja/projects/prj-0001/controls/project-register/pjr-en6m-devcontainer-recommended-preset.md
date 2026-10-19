---
specdojo:
  id: prj-0001:pjr-en6m-devcontainer-recommended-preset
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-19T21:41:04Z"
  derived_from:
    - PJR-GHBP
---

# PJR-EN6M devcontainer の scaffold に推奨の設定をまとめて入れる preset を加える

## 1. 概要

devcontainer scaffold に --preset recommended を加え、emacs と vim（.vimrc の雛形を新しく足す）、tmux、SpecDojo の文書の作業に効く VS Code の拡張（git graph・markdownlint・YAML・Prettier・remark・Markdown All in One・Code Spell Checker・EditorConfig・Error Lens・Even Better TOML）と設定（保存時の整形、YAML の schema の紐づけ）、.vscode/extensions.json の推奨の拡張をまとめて入れる。init の対話では devcontainer を選んだときだけ推奨の設定を入れるかを聞く（2026-10-20、利用者が推奨案を承認。0.4.1 の範囲）

## 2. 完了条件

- `devcontainer scaffold` に `--preset recommended` を加え、次をまとめて入れる。個別のオプション（`--editor`・`--tmux`）は今のまま残し、preset と一緒に指定した場合は両方を合わせる。
  - editor: emacs（今の `init.el`）と vim。vim は `vim-nox` などを入れ、`.vimrc` の雛形を新しく足す。どちらも既にある設定のファイルは上書きしない。
  - tmux。
  - VS Code の拡張: `mhutchie.git-graph`・`davidanson.vscode-markdownlint`・`redhat.vscode-yaml`・`esbenp.prettier-vscode`・`unifiedjs.vscode-remark`・`yzhang.markdown-all-in-one`・`streetsidesoftware.code-spell-checker`・`editorconfig.editorconfig`・`usernamehw.errorlens`・`tamasfe.even-better-toml`。provider ごとの拡張は今と同じく選んだ provider の分だけ。
  - VS Code の設定: Markdown と YAML の保存時の Prettier の整形、SpecDojo の YAML の schema の紐づけ（`docs/specdojo/schemas/` などの配布の schema を参照）。
- `.vscode/extensions.json` の `recommendations` に、同じ拡張を書く。既にある場合は、足りない拡張だけを足す。
- `init` の対話では、devcontainer を選んだときだけ「推奨の設定を入れるか（既定ははい）」を 1 つ聞く。`--yes` の既定は入れる。`--devcontainer-preset <name>` などの指定の方法は実装で決めて result に書く。
- [[specdojo:remote-host-development-guide]] の Dev Container を生成する節とコマンドリファレンスに、preset の中身を書く。
- 単体テストで、preset を指定したときの `devcontainer.json`・`post-create.sh`・`.vscode/extensions.json` の中身と、既にあるファイルを上書きしないことを確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [0.4.1] - 未定` の節に書く。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ |
| --- | ------------------------------------------- | ---- | ---- | ---- |
| 1   | devcontainer の推奨の設定の preset を加える | DEV  | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-ghbp-devcontainer-local-bin-and-tmux-user]]（元の項目）
- [[specdojo:remote-host-development-guide]]（影響先）
