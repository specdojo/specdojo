---
specdojo:
  id: opr-change-sample
  type: operations
  status: draft
  rulebook: opd-rulebook
  based_on: [opd-index]
  supersedes: []
---

# 運用手順: 運用変更（設定変更・デプロイ） サンプル

- 参照: `../rulebooks/opr-rulebook.md`

## 1. 運用変更作業（設定変更・デプロイ・ロールバック）

- 事前:
  - 変更チケット起票（承認者: Ops Lead）
  - 影響評価とロールバック方針を記載
- 実施:
  - 実施ログ（誰が/いつ/何を）を残す
- ロールバック:
  - 異常（P1/P2）発生時は即時戻し、報告
