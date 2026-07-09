---
specdojo:
  id: opr-access-control-sample
  type: operations
  status: draft
  rulebook: opd-rulebook
  based_on: [opd-access-control]
  supersedes: []
---

# 運用手順: アカウント付与・剥奪 サンプル

- 参照: `../rulebooks/opr-rulebook.md`

## 1. アカウント付与/剥奪手順

| 手順 | 内容                 | 実施者      | 完了条件         | 証跡          |
| ---- | -------------------- | ----------- | ---------------- | ------------- |
| 1    | 申請受付（チケット） | Support/Ops | 必要情報が揃う   | ticket_id     |
| 2    | 承認                 | Ops Lead    | 承認コメントあり | 承認ログ      |
| 3    | 付与/剥奪            | Ops         | 権限反映確認     | 実施ログ      |
| 4    | 検証                 | 申請者      | ログイン確認     | スクショ/ログ |
| 5    | 記録                 | Ops         | 台帳更新         | 台帳          |
