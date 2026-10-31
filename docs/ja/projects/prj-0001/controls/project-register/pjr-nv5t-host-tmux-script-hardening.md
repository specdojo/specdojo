---
specdojo:
  id: prj-0001:pjr-nv5t-host-tmux-script-hardening
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: high
  difficulty: easy
  owner: DEV
  registered_at: "2026-10-31T13:54:15Z"
  due_on: "2026-11-30"
  block_reason: "agent exited with non-zero code: agent-config-write: protected configuration changes detected; paths=.specdojo/host/devcontainer-tmux.sh; agent must record the required change in the result handoff fo…"
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
| 1   | 完了条件に沿って script・テスト・CHANGELOG を直す | DEV  | done | -    |

## 5. 対応結果

### 実施内容

1. `templates/devcontainer/remote-host/devcontainer-tmux.sh` のマウント比較処理を修正しました。
   - `m_type` が `bind` のマウントのみを対象とし、`volume` マウントなどをスキップするようにしました。
   - ホストに存在するディレクトリの場合に `(cd "$m_src" && pwd -P)` でパスを正規化してから、正規化済みの `workspace_dir` と比較するようにしました。これにより、Docker Desktop for Mac 等でマウント元が `<親>/<repo>/..` の形式で返る環境でもコンテナ内作業ディレクトリを正しく特定できるようにしました。
   - 前方一致判定 `${workspace_dir#"$norm_src"/}` および `${workspace_dir#"$best_match_src"/}` で変数をクォートし、パスに `*` などの glob 文字が含まれる場合でもパターン展開による判定の狂いを防止しました。あわせて shellcheck の SC2295・SC2034 を解消しました。また line 63 の single quotes 展開警告（SC2016）について意図的な引数受け渡しである注記ディレクティブを追加しました。
2. `templates/devcontainer/remote-host/specdojo-tmux.sh.sample` を `exec bash "$workspace_dir/.specdojo/host/devcontainer-tmux.sh" "$workspace_dir"` に変更し、本体スクリプトの実行権限に依存せず実行できるようにしました。
3. `tests/src/devcontainer/host-script.test.ts` にマウント元の正規化（`<親>/<repo>/..` 形式）、`volume` マウントが混在するケース、パスに `*` 等の glob 文字が含まれるケース、および `shellcheck` による構文検証テストを追加しました。また、`specdojo-tmux.sh.sample` のラッパー変更に合わせて `tests/src/devcontainer/scaffold.test.ts` のアサーションを更新しました。
4. `CHANGELOG.md` の `[Unreleased]` の節に不具合修正（PJR-NV5T）として追記しました。
5. `node --import tsx src/specdojo.ts devcontainer host-script` を実行し、本リポジトリの `.specdojo/host/devcontainer-tmux.sh` をテンプレートと同一内容で更新しました。

### 成果物

- `templates/devcontainer/remote-host/devcontainer-tmux.sh`: マウント元正規化・bind 絞り込み・変数展開クォート
- `templates/devcontainer/remote-host/specdojo-tmux.sh.sample`: bash 経由の起動に変更
- `.specdojo/host/devcontainer-tmux.sh`: host-script で更新
- `tests/src/devcontainer/host-script.test.ts`: 正規化・bind 判定・glob 安全性・shellcheck のテスト追加
- `tests/src/devcontainer/scaffold.test.ts`: ラッパー起動コマンドのアサーション更新
- `CHANGELOG.md`: `[Unreleased]` 不具合修正の追記
- `docs/ja/projects/prj-0001/controls/project-register/pjr-nv5t-host-tmux-script-hardening.md`: 作業内容および対応結果の更新

### ホストでの実際の接続の確かめ方

ホスト環境（macOS・Docker Desktop）において、以下の手順で接続を確認します。

1. 本リポジトリの `.specdojo/host/devcontainer-tmux.sh` が最新の内容（bind 判定・パス正規化対応）になっていることを確認します。
2. ホスト側のラッパースクリプト（`~/bin/specdojo-tmux` など）が最新のサンプル同様に `exec bash "$workspace_dir/.specdojo/host/devcontainer-tmux.sh" "$workspace_dir"` の形式になっているか、あるいは直接実行します。
3. ホスト側のターミナルで `~/bin/specdojo-tmux`（または `~/bin/specdojo-tmux /Users/naoto/workspaces/specdojo-workspace/specdojo`）を実行します。
4. `docker inspect` の bind マウント元が `/Users/naoto/workspaces/specdojo-workspace/specdojo/..` のように返り volume マウントが混在していても、「Could not determine container workspace directory from mounts」エラーで停止せず、コンテナ内の作業ディレクトリ（`/workspaces/specdojo-workspace/specdojo`）が正しく特定されて tmux セッション（`specdojo`）に接続できることを確認します。

### 残課題

- なし（ホスト実環境での接続確認は利用者が上記手順に沿って実施）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-q8kp-host-tmux-script-distribution]]
- [[specdojo:remote-host-development-guide]]
