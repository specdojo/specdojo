---
specdojo:
  id: specdojo:ntp-rulebook
  type: rulebook
  deliverable_type: test
  status: deprecated
  recipe: not-needed
  sample: specdojo:ntp-sample
  template: not-needed
---

# 移行テスト計画（リハーサル計画） 作成ルール（非推奨）

Deprecated Migration Test Plan Documentation Rules

この rulebook は非推奨です。移行テスト計画（リハーサル計画）の作成ルールは後継の [[specdojo:mtp-rulebook|移行テスト計画 作成ルール]] へ統合しました。

## 1. 移行方針

- 新しい `ntp-<term>` は作成せず、`mtp-index` または `mtp-<term>` にリハーサル計画・検証設計を記載します。
- 既存の移行テスト計画がある場合は、後継の `mtp` へ移行します。
- 参照元は ntp 参照を削除または更新し、統合先の `mtp` を参照します。
