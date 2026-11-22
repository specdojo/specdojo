---
specdojo:
  id: prj-0001:pjr-vqk2-run-summary-commit-id
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: low
  owner: DEV
  registered_at: "2026-11-22T11:15:38Z"
  due_on: "2026-11-30"
---

# PJR-VQK2 exec run の要約の commit= に、その run のものではない commit の ID が出ることがある

## 1. 課題内容

exec run --register の要約（Register run summary）の commit= に、その run の統合の commit ではなく HEAD の commit の ID が出ることがある。記録だけの問題で、統合そのものには影響しない。

## 2. 入力

- 2026-11-22 の運用で観測した。例の run の記録は手元に残っておらず、再現の手順の特定も調査に含める。
- 要約の整形は formatRegisterRunSummary（src/exec/register.ts）。
- 利用者の承認（2026-11-22、indie）で起票した。担当 DEV、期限 2026-11-30。

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
