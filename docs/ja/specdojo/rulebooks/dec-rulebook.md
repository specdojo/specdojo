---
specdojo:
  id: specdojo:dec-rulebook
  type: rulebook
  deliverable_type: project
  status: deprecated
  target_format: markdown
  recipe: not-needed
  sample: specdojo:dec-sample
  template: not-needed
---

# 決定記録 作成ルール（非推奨）

Deprecated Decision Log Documentation Rulebook

この rulebook は非推奨です。決定の記録はプロジェクト登録簿の decision で管理するため、後継を登録簿の decision（[[specdojo:pjr-rulebook|プロジェクト登録簿作成ルール]]）としました。

## 1. 移行方針

- 新しい `dec-<NNNN>` は作成せず、決定事項はプロジェクト登録簿の decision（個票）で管理します。
- 既存の決定記録がある場合は、プロジェクト登録簿の decision 個票へ移行します。
- 参照元は dec 参照を削除または更新し、プロジェクト登録簿の decision を参照します。
