---
specdojo:
  id: prj-0001:pjr-djft-grade-run-per-document-sh
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-09T03:55:04Z"
---

# PJR-DJFT 公開物では grade を通しで実行できない（run-per-document.sh が同梱されない）

## 1. 課題内容

公開物の試用（2026-10-09）で、文書ごとの grade の実行を担う tools/grade/run-per-document.sh（約 1,300 行の bash）が npm package の files に含まれず、利用者は grade plan と grade apply の部品しか使えないことを確認した。案内文書はこのスクリプトを前提にしている。v0.3.0 では grade を部品のみ・試験的と明記するか、CLI に grade run として取り込むかを決める。

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
