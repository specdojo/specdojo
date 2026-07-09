---
specdojo:
  id: opr-batch-sample
  type: operations
  status: draft
  rulebook: opd-rulebook
  based_on: [opd-index]
  supersedes: []
---

# 運用手順: バッチ再実行・失敗対応 サンプル

- 参照: `../rulebooks/opr-rulebook.md`

## 1. バッチ再実行・失敗時対応

- 失敗検知: 監視アラート or ジョブ管理の失敗通知
- 再実行条件:
  - 同一run_idで再実行可否を確認（冪等性方式に従う）
  - 再実行上限: 1回（2回目はOps Lead判断）
- エスカレーション:
  - データ不整合の可能性がある場合は P1 として `opr-incident` に切替
