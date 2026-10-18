---
specdojo:
  id: prj-0001:pjr-283n-register-plan-blank-lines-autopilot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-18T16:40:17Z"
  derived_from:
    - PJR-6DHY
---

# PJR-283N 夜間の承認の印がない個票の plan に空行が重なり、register の run の commit が止まる

## 1. 課題内容

6DHY で xep-register-template に _AUTOPILOT_CONSTRAINTS_ の段落を足した。夜間の承認の印（autopilot）がない個票ではこれが空に展開され、前後の空行と合わせて空行が 3 行続く。plan を commit する pre-commit の hook が markdownlint の MD012 で落ちるため、6DHY の統合（2026-10-19 01:18）の後の exec run --register は記帳の commit で止まる（01:34 の PJR-JSEY で確認）

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
