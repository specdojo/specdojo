---
specdojo:
  id: specdojo:cstd-rulebook
  type: rulebook
  status: deprecated
  recipe: not-needed
  sample: specdojo:cstd-sample
  template: not-needed
---

# 概念状態遷移図（CSTD）ドキュメント作成ルール（非推奨）

Deprecated Conceptual State Transition Diagram Rulebook

この rulebook は非推奨です。状態一覧と状態遷移図を別文書で管理すると内容が重複するため、後継の [[specdojo:stsd-rulebook|ステータス定義（STSD）作成ルール]] へ統合しました。

## 1. 移行方針

- 新しい `cstd-<term>` は作成せず、`stsd-<term>` に状態一覧、状態遷移図、遷移の説明を記載します。
- 既存 CSTD の状態、イベント、条件は、同じ対象の STSD の「状態遷移図」と「遷移の説明」へ移します。
- CDFD などの参照元は CSTD 参照を削除し、統合先の STSD だけを参照します。
