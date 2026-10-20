---
specdojo:
  id: prj-0001:pjr-ej4f-remote-tmux-sample-path
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-20T11:00:35Z"
  derived_from:
    - PJR-GHBP
---

# PJR-EJ4F 接続のスクリプトを ssh から動かすと Dev Container CLI が見つからない

## 1. 課題内容

specdojo-tmux.sh.sample を ssh の RemoteCommand で動かすと、ログインも対話もしないシェルで動くため、Mac の端末で読み込まれる Homebrew・nvm などの PATH の設定が入らず、「Dev Container CLI is not installed」で止まる（2026-10-20、利用者が報告）。サンプルは PATH の追加をコメントで書いているだけで、自宅の Mac 向けの設計書の helper にある node_bin_dir と /opt/homebrew/bin・/usr/local/bin の追加が引き継がれていない

## 2. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 3. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 4. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
