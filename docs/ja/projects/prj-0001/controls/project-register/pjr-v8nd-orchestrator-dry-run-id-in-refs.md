---
specdojo:
  id: prj-0001:pjr-v8nd-orchestrator-dry-run-id-in-refs
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-25T22:40:00Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-FNB7
---

# PJR-V8ND オーケストレーターが dry-run の仮の ID を commit メッセージの Refs に書く

## 1. 課題内容

register add の dry-run で出た ID は仮で、実際の起票では乱数で振り直される。オーケストレーターが仮の ID を commit メッセージの Refs に書き、実際の ID と食い違う。

## 2. 入力

- PJR-FNB7 の実 agent の試験（2026-11-26、sonnet、5 回）のうち 2 回で観測。dry-run の PJR-2W39 に対し実際は PJR-RBET、dry-run の PJR-9077 に対し実際は PJR-PB3T で、commit の Refs は仮の ID のままだった。
- 直し方（CLI が実際の ID を -m に差し込む、dry-run の出力で仮の ID だと示す、オーケストレーターの本文に注意を足す、など）は executor が選び、理由を個票の対応結果に書く。本文は保護された設定のため、変更案を対応結果に書く。

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
