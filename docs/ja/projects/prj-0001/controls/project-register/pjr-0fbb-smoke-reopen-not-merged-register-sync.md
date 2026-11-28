---
specdojo:
  id: prj-0001:pjr-0fbb-smoke-reopen-not-merged-register-sync
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  registered_at: "2026-11-28T15:46:12Z"
  derived_from:
    - PJR-JSEY
---

# PJR-0FBB register_sync の project で exec smoke が JSEY の reopen を develop へ取り込まずに exec run を始めて失敗する

## 1. 課題内容

exec smoke の reopen は専用ブランチへ commit されるが、続く exec run は develop の個票を読むため done のままと判定して止まる

## 2. 入力

- 観測（2026-11-29 01:0x JST）: exec smoke --register PJR-JSEY --targets PJR-3R7V が [smoke:run] で Register item PJR-JSEY has terminal status done で失敗した。直前の [smoke:reopen] は専用ブランチに commit 86dc88ee1c で open を記帳していた
- 回避: register branch-merge --project prj-0001 で専用ブランチを develop へ取り込んでから exec smoke を流し直すと成功した
- 担当・期限は未定（indie が決める）

## 3. 影響範囲

| 観点         | 影響   |
| ------------ | ------ |
| スコープ     | _TODO_ |
| スケジュール | _TODO_ |
| コスト       | _TODO_ |
| 品質         | _TODO_ |
| 関係者       | _TODO_ |

## 4. 対応方針

| 項目     | 内容   |
| -------- | ------ |
| 原因     | _TODO_ |
| 対応策   | _TODO_ |
| 依存事項 | _TODO_ |
| 完了条件 | _TODO_ |

## 5. 対応結果

_TODO_: 解決内容、確認結果、再発防止策を記載する。未解決の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
