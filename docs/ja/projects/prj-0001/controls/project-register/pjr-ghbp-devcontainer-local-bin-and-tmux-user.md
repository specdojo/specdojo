---
specdojo:
  id: prj-0001:pjr-ghbp-devcontainer-local-bin-and-tmux-user
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-19T21:17:36Z"
  derived_from:
    - PJR-CCXN
---

# PJR-GHBP devcontainer の雛形で ~/.local/bin を作れず、tmux のスクリプトが root で入る

## 1. 課題内容

init の scaffold で作った devcontainer で、opencode の volume を ~/.local/share/opencode に mount すると Docker が親の ~/.local を root の持ち物として作り、post-create.sh は mount 先しか持ち主を戻さないため、node が ~/.local/bin を作れず Claude Code などのインストーラが失敗する。また specdojo-tmux.sh.sample は docker exec に利用者を指定しないため、container の既定の root で入る（2026-10-20、利用者が報告）

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
