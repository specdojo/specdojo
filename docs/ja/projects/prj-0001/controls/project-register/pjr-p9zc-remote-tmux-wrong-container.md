---
specdojo:
  id: prj-0001:pjr-p9zc-remote-tmux-wrong-container
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  difficulty: medium
  owner: DEV
  registered_at: "2026-10-29T12:21:38Z"
  due_on: "2026-10-31"
  derived_from:
    - PJR-CCXN
---

# PJR-P9ZC 接続のスクリプトが、対象の devcontainer が止まっていると別の container へ入ろうとして失敗する

## 1. 課題内容

specdojo-tmux.sh.sample の find_container は、ラベルで見つからないと vsc- で始まる最初の container を選ぶ。そのため対象の devcontainer が止まっていると、別の container へ docker exec して「chdir to cwd ... no such file or directory」で止まる。ラベルの一致だけで探し、見つからなければ devcontainer up するように直す

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
