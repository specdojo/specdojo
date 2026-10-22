---
specdojo:
  id: prj-0001:pjr-47s6-devcontainer-preset-minimal-full
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-22T12:56:35Z"
  derived_from:
    - PJR-EN6M
---

# PJR-47S6 devcontainer の preset に minimal と full を加え、init で選べるようにする

## 1. 概要

推奨 preset（recommended）だけでは、軽くしたい人とローカル LLM や routine まで使う人に合わない。provider の選択とは別の軸として、minimal（CLI と最低限だけ）と full（recommended に加えて開発用の道具・Ollama への接続・cron）を加え、init の Dev Container の質問で選べるようにする

## 2. 完了条件

- 次の版の範囲とする（2026-10-22、利用者が承認）。PJR-ZH7Q（推奨 preset に gh を加える）の統合の後に行う。
- `devcontainer scaffold --preset` に `minimal` と `full` を加える。preset は provider の選択（`--provider`）とは別の軸とし、provider ごとの preset は作らない。
  - `minimal`: 選んだ provider の CLI と、SpecDojo が動く最低限だけ。今の preset なしの生成物と同じにする。
  - `recommended`: 今のまま（tmux・emacs・vim・推奨の VS Code 拡張と設定、PJR-ZH7Q の gh）。
  - `full`: `recommended` に加え、ripgrep・fd・fzf・yq・shellcheck・shfmt、Ollama への接続（`--ollama` と同じ）、cron（`--cron` と同じ）。
- preset に個別の指定（`--ollama`・`--cron`・`--tmux`・`--editor`）を足せるのは今のままとする。`--preset` を指定しないときの動きは今のまま（`minimal` と同じ）とする。
- `specdojo init` の Dev Container の質問を、推奨 preset の はい／いいえ から、preset を選ぶ質問（`minimal`／`recommended`／`full`、既定は `recommended`）に変える。`--yes --devcontainer` の既定は今のまま `recommended` とし、`--devcontainer-preset` に `minimal` と `full` を指定できる。今の `none` は `minimal` と同じ意味として受け付け続ける。
- [[specdojo:remote-host-development-guide]]・[[specdojo:quick-start-guide]]・[[specdojo:command-reference]] の preset の説明を、3 つの preset の表に合わせる。
- 単体テストで、3 つの preset と preset なしの生成物（apt のパッケージ、features、VS Code の拡張、Ollama の環境変数、cron）の違いと、`init` の質問と `--devcontainer-preset` の値の解釈を確かめる。
- 作業を終える前に、`npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を実行して通す。
- 親の検証（lint-ts・lint-fm・lint-md・typecheck・test-unit・test-integration・validate-schema）が通る。
- CHANGELOG の `## [Unreleased]` の節に書く（なければ作る）。公開済みの版の節は変えない。

## 3. 作業内容

| No  | 作業                                                      | 担当 | 状態 | メモ          |
| --- | --------------------------------------------------------- | ---- | ---- | ------------- |
| 1   | preset に minimal と full を加え、init で選べるようにする | DEV  | done | PJR-ZH7Q の後 |

## 4. 対応結果

- `devcontainer scaffold --preset` に `minimal` / `recommended` / `full` を実装した。`minimal` と preset なしは provider の CLI と最低限だけ、`recommended` は従来の推奨構成、`full` は推奨構成に ripgrep・fd・fzf・yq・shellcheck・shfmt、Ollama 接続、cron を加える。
- preset と個別の `--ollama`・`--cron`・`--tmux`・`--editor` は引き続き合成できる。Debian の `fd-find` package は post-create で `fd` コマンドとしても利用できるようにした。
- `specdojo init` の Dev Container の質問を3 preset の選択に変更し、既定を `recommended` のまま維持した。`--devcontainer-preset` は `minimal` と `full` を受け付け、従来の `none` は `minimal` へ正規化する。
- [[specdojo:remote-host-development-guide]]・[[specdojo:quick-start-guide]]・[[specdojo:command-reference]] に3 preset の比較表を追加し、CHANGELOG の `Unreleased` に記載した。
- 単体テストに preset なしを含む4構成の apt package、VS Code 拡張、Ollama 環境変数、cron の差分と、`init` の質問・既定・値の解釈を追加した。
- 残課題: なし。

## 5. 関連ドキュメント

- PJR-EN6M（推奨 preset）
- PJR-ZH7Q（推奨 preset に gh を加える）
