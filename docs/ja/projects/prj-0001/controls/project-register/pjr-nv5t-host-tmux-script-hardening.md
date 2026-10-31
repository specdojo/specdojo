---
specdojo:
  id: prj-0001:pjr-nv5t-host-tmux-script-hardening
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-31T13:54:15Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-Q8KP
---

# PJR-NV5T ホストの tmux の script でマウント元のパスを正規化して比べる

## 1. 概要

PJR-Q8KP で配った devcontainer-tmux.sh は、docker inspect が返すマウント元のパスを文字列のまま前方一致で比べる。Docker Desktop for Mac では workspaceMount の source が `<親>`/specdojo/.. の形で返るため一致せず、ホストで接続できない。bind のマウントだけを正規化して比べ、shellcheck の SC2295・SC2034 も直す。sample のラッパーは bash 経由で本体を呼ぶ形にする

## 2. 入力

- PJR-Q8KP の close の前の確かめで、shellcheck が SC2295（info）と SC2034（`m_type` の未使用）を出した（2026-10-31）
- ラッパーを bash 経由の起動に直すことは 2026-10-31 の対話で利用者が推奨を採用した
- 利用者のホスト（macOS・Docker Desktop）で ~/bin/specdojo-tmux を実行すると「Could not determine container workspace directory from mounts for: /Users/naoto/workspaces/specdojo-workspace/specdojo」で止まった（2026-10-31）
- 同じホストの docker inspect の Mounts は bind の Source を /Users/naoto/workspaces/specdojo-workspace/specdojo/..、Destination を /workspaces/specdojo-workspace と返した。ほかは volume のマウント（Source は /var/lib/docker/volumes/`<名前>``/_data`）だった
- マウント元の正規化の不具合は本項目の範囲に含め、優先度を high にすることを 2026-10-31 の対話で利用者が選んだ（案 A）

## 3. 完了条件

1. `templates/devcontainer/remote-host/devcontainer-tmux.sh` のマウント元の比べ方を直す。
   - `bind` のマウントだけを比べる。
   - マウント元のパスは、ホストにあるディレクトリなら `pwd -P` などで正規化してから、正規化した `workspace_dir` と比べる。
   - shellcheck の SC2295・SC2034 が出ない。
2. `templates/devcontainer/remote-host/specdojo-tmux.sh.sample` のラッパーは、`exec bash "<本体>" "$workspace_dir"` の形で本体を呼ぶ。本体の実行権限に頼らない。
3. `tests/src/devcontainer/host-script.test.ts` にテストを足す。
   - マウント元が `<親>/<repo>/..` の形で返る場合に、コンテナの中の作業ディレクトリを正しく求めて tmux へ入る。
   - `volume` のマウントが混ざっていても、`bind` のマウントから求める。
   - パスに `*` などの glob の文字を含む場合に、前方一致の判定がずれない。
4. 終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通す。あわせて親の検証も通す。
5. CHANGELOG の `[Unreleased]` の節に不具合の修正として追記する。公開済みの節は変えない。
6. このリポジトリの `.specdojo/host/devcontainer-tmux.sh` を `devcontainer host-script` で書き出し直し、テンプレートと同じ内容にする。
7. ホストでの実際の接続は利用者が確かめる。確かめ方を個票の対応結果に書く。

## 4. 作業内容

| No  | 作業                                              | 担当 | 状態 | メモ |
| --- | ------------------------------------------------- | ---- | ---- | ---- |
| 1   | 完了条件に沿って script・テスト・CHANGELOG を直す | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[prj-0001:pjr-q8kp-host-tmux-script-distribution]]
- [[specdojo:remote-host-development-guide]]
