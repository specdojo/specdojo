---
specdojo:
  id: prj-0001:pjr-dkd8-reporter-fallback-on-connection-error
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-19T21:41:24Z"
  derived_from:
    - PJR-BHMH
---

# PJR-DKD8 ローカル LLM につながらないとき reporter が切り替わらずに止まる

## 1. 課題内容

2026-10-20 06:33 に PJR-16S0 の reporter（gemma26-reporter）が、ホストの Ollama が止まっていたため Cannot connect to API で失敗し、--fallback-reporter-by claude-reporter を指定していたのに切り替わらずに waiting になった。切り替えは rate limit のときだけ働き、つながらないエラーは対象にしていない

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
