---
specdojo:
  id: prj-0001:pjr-8pxj-init-devcontainer-host-script
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  owner: DEV
  registered_at: "2026-11-23T10:22:51Z"
  due_on: "2026-11-30"
  commit_type: feat
  commit_scope: init
---

# PJR-8PXJ specdojo init で tmux を含む Dev Container を作るときにホストの本体スクリプトも作る

## 1. 概要

init は devcontainer scaffold で remote-host のサンプルを作るが、それが呼ぶ .specdojo/host/devcontainer-tmux.sh は host-script を別に流さないと作られない。tmux を含む構成なら init の対話で作れるようにする

## 2. 入力

- 利用者の提案（2026-11-23）: devcontainer host-script で作る本体スクリプトを、specdojo init の対話でもインストールできるようにする。v0.10.0 に入れる

## 3. 完了条件

- `specdojo init` で Dev Container を作り、tmux を含める構成（`--tmux`、または preset が `recommended` 以上）を選んだとき、常時稼働ホストで使う tmux の本体スクリプト（`.specdojo/host/devcontainer-tmux.sh`）も作れるようにする（利用者の依頼、2026-11-23）。今は `devcontainer scaffold` が作る `.devcontainer/remote-host/specdojo-tmux.sh.sample` が本体スクリプトを呼ぶ前提なのに、本体は `npx specdojo devcontainer host-script` を別に流さないと作られない。
- 対話のときは、tmux を含める構成のときだけ「常時稼働ホストで使う tmux の本体スクリプトも作りますか？」と聞く。既定は Yes。tmux を含めない構成では聞かない。
- `--host-script`・`--no-host-script` を足す。`--yes` のときは、tmux を含める構成なら作る。tmux を含めない構成で `--host-script` を指定したときの扱い（作る、またはエラー）を executor が決め、理由を個票の対応結果に書く。
- 作るものは `devcontainer host-script` と同じにし、同じ関数を呼ぶ形で書き方を 1 か所にそろえる。既にファイルがあるときの扱いも `host-script` にそろえる。
- `init` の最後の案内に、本体スクリプトの置き場所と、ホストへコピーする手順を 1 行足す。
- 単体テストを足す（tmux を含める・含めない、`--host-script`・`--no-host-script`・`--yes` の組み合わせ）。
- `remote-host-development-guide` の「後から `host-script` を流す」手順を、`init` で作れることと、更新のときだけ流す手順に直す。コマンドリファレンスの `init` の節も直す。
- v0.10.0 に入れる（利用者の決定、2026-11-23）。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果と報告の `handoff` に書く。
- 保護された設定（`.specdojo/`・`.agents/`・`.claude/`・`.codex/`・`.opencode/`・`package.json` など）は変えない。変更が要る場合は、変更案を個票の対応結果と報告の `handoff` に書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通し、親の検証を通す。統合の後に orchestrator が、新しいリポジトリで `init` を流して本体スクリプトができることを確かめてから close する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
