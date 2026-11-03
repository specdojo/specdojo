---
specdojo:
  id: prj-0001:pjr-8tdx-devcontainer-tmux-conf
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

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
