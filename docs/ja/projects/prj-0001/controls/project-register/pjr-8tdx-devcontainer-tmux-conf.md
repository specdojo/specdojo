---
specdojo:
  id: prj-0001:pjr-8tdx-devcontainer-tmux-conf
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
  registered_at: "2026-11-03T10:21:19Z"
  commit_type: feat
  commit_scope: devcontainer
---

# PJR-8TDX devcontainer の生成で tmux の設定を配置する

## 1. 概要

tmux を入れる構成で .devcontainer/tmux.conf を生成し、コンテナの起動時に ~/.tmux.conf へリンクする。既存の ~/.tmux.conf は上書きしない

## 2. 入力

- このリポジトリの .devcontainer には tmux.conf（マウス操作・クリップボード・256 色の 6 行）があり、post-start.sh が ~/.tmux.conf へ ln -sfn でリンクしている。init --devcontainer と devcontainer scaffold が作る .devcontainer には tmux.conf も配置の処理もなく、post-start.sh もない（postCreateCommand だけ）（2026-11-03）
- tmux は --tmux を付けるか preset が recommended 以上のときに apt で入る。ホストから tmux で入る使い方は remote-host 開発ガイドで案内している（2026-11-03）
- 利用者の判断: tmux を入れる構成では、このリポジトリと同じ内容の tmux.conf を生成し、生成する post-create.sh で ~/.tmux.conf へリンクを張る（post-start.sh と postStartCommand は足さない。リンクなので tmux.conf の中身の変更はそのまま反映される）。利用者が既に ~/.tmux.conf（リンクでないもの）を持っている場合は上書きしない。生成物のテストと remote-host 開発ガイドの説明を足す（2026-11-03）

## 3. 完了条件

- tmux を入れる構成（`devcontainer scaffold --tmux`、または preset が `recommended` 以上、`init --devcontainer` から呼ぶ場合も含む）で、`.devcontainer/tmux.conf` が生成される。中身は、マウス操作（`set -g mouse on`）、クリップボード（`set -g set-clipboard on`）、256 色（`set -g default-terminal "tmux-256color"` と `set -as terminal-overrides ',*:Tc'`）の設定と、説明の注記である
- tmux を入れない構成では、`tmux.conf` もリンクの処理も生成しない
- 生成する `post-create.sh` が、スクリプトと同じ `.devcontainer/` の下の `tmux.conf` を `~/.tmux.conf` へリンクする（`ln -sfn`）。`~/.tmux.conf` がないか、すでにリンクの場合だけ張り、普通のファイルは上書きしない。`tmux.conf` がなければ何もしない。`post-start.sh` と `postStartCommand` は足さない
- `--dry-run` の出力に `tmux.conf` が含まれ、既存の `.devcontainer/` は `--force` なしでは上書きしない（今の動きを保つ）
- 生成物のテスト（tmux あり・なしの両方）を足し、post-create.sh のリンクの処理を shellcheck で確かめている
- remote-host 開発ガイド（[[specdojo:remote-host-development-guide]]）に、生成される `tmux.conf` とリンクの扱い、既存の `~/.tmux.conf` を上書きしないことを書いている
- CHANGELOG の Unreleased の節に書いている。保護された設定（`.specdojo/**`・`package.json` など）と、このリポジトリの `.devcontainer/` は変えない
- 作業を終える前に `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` を流し、親の検証が通る。未決の点は executor が決め、理由を個票の対応結果に記録する

## 4. 作業内容

| No  | 作業                                           | 担当 | 状態 | メモ |
| --- | ---------------------------------------------- | ---- | ---- | ---- |
| 1   | scaffold で tmux.conf とリンクの処理を生成する | DEV  | open | -    |
| 2   | テストとガイド・CHANGELOG を足す               | DEV  | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- [[specdojo:remote-host-development-guide]]
