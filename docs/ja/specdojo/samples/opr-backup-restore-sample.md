---
specdojo:
  id: opr-backup-restore
  type: operations
  status: draft
  rulebook: opd-rulebook
  based_on: [opd-index]
  supersedes: []
---

# 運用手順: バックアップ確認・リストア サンプル

- 参照: `../rulebooks/opr-rulebook.md`

## 1. バックアップ確認・リストア手順（演習含む）

- 確認（毎日）:
  - 最新バックアップの生成時刻とサイズを確認
  - 失敗があればチケット起票（P2）
- 演習（四半期）:
  - staging にリストア → 主要テーブルの件数/参照整合を確認
  - 所要時間を記録し、RTO/RPO達成可否を判定する

証跡:

- 演習レポート（日時/所要時間/成功可否/ログURL）
