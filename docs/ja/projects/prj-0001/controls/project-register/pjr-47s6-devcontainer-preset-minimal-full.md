---
specdojo:
  id: prj-0001:pjr-47s6-devcontainer-preset-minimal-full
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-22T12:56:35Z"
  block_reason: "agent exited with non-zero code: agent exited with non-zero code: error: authentication failed or timed out"
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
| 1   | preset に minimal と full を加え、init で選べるようにする | DEV  | open | PJR-ZH7Q の後 |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- PJR-EN6M（推奨 preset）
- PJR-ZH7Q（推奨 preset に gh を加える）
