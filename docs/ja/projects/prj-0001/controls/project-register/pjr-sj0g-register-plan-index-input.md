---
specdojo:
  id: prj-0001:pjr-sj0g-register-plan-index-input
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T02:56:23Z"
---

# PJR-SJ0G register の plan が大きい一覧を読ませ、一覧のパスも誤っている

## 1. 課題内容

register の todo の plan（xep-register-template・xep-register-investigate-template）は、進め方の最初で登録簿の一覧の該当行を読ませ、対象項目に一覧のパスを挙げている。一覧は約 479KB あり、文脈が 64k のローカル LLM（gemma26-executor）は分けて読むうちに文脈を使い切り、何も変更せずに終わった（WJE6 の試行 wje6-local-llm）。挙げているパスも controls/project-register/pjr-index.md で、実際の生成先 generated/pjr-index.md と違う。作業に必要なのは個票だけである

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
