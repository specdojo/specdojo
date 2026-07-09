---
specdojo:
  id: opr-support-sample
  type: operations
  status: draft
  rulebook: opd-rulebook
  based_on: [opd-index]
  supersedes: []
---

# 運用手順: 問い合わせ一次対応 サンプル

- 参照: `../rulebooks/opr-rulebook.md`

## 1. 問い合わせ一次対応手順（テンプレ・ナレッジ）

- 分類:
  - 仕様確認 / 障害疑い / 依頼（権限・設定） / データ修正要否
- 一次対応テンプレ（例）:
  - 受付→再現条件→影響→暫定回避→引継ぎ要否
- 引き継ぎ条件:
  - 障害疑いは `opr-incident` へ（P判定を付与）
