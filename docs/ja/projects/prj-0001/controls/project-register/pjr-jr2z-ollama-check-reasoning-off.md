---
specdojo:
  id: prj-0001:pjr-jr2z-ollama-check-reasoning-off
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: low
  difficulty: easy
  owner: ARC
  registered_at: "2026-10-31T07:05:03Z"
  derived_from:
    - PJR-AHXK
  depends_on:
    - PJR-AHXK
---

# PJR-JR2Z tsd-ollama-opencode の接続確認の例で考える過程を止める

## 1. 概要

接続確認の例に reasoning_effort: none を足し、本文が返ることを期待値として書く。tsd-ollama の確認の例も同じかを確かめる

## 2. 入力

- 2026-10-31 に母艦の Ollama で確かめた。gemma4:e4b-mlx-light-8k と gemma4:e4b-light-8k は、tsd-ollama-opencode の接続確認の例（`max_tokens:` 32）では考える過程（reasoning）だけで上限に達し、`finish_reason` が length で content が空になる
- 同じ要求に `"reasoning_effort":` "none" を足すと `finish_reason` が stop で本文が返った。"think": false では止まらなかった
- executor は母艦への接続を試さない。母艦での確認はオーケストレーターが行う

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
