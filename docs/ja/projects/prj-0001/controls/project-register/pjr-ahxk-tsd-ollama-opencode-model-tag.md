---
specdojo:
  id: prj-0001:pjr-ahxk-tsd-ollama-opencode-model-tag
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: low
  difficulty: easy
  owner: ARC
  registered_at: "2026-10-27T14:13:09Z"
  derived_from:
    - PJR-05GN
---

# PJR-AHXK tsd-ollama-opencode のモデルのタグの食い違いを直す

## 1. 概要

tsd-ollama-opencode は設定例で gemma4:e4b-mlx-light-8k を登録する一方、接続確認の要求では gemma4:e4b-light-8k を使っている。対象環境での正しい登録名を確かめ、どちらかに揃える。

## 2. 完了条件

- 軽作業用の 8k のモデルの名前を、作成の手順（`tsd-ollama.md` の「Gemma 4 E4B 軽作業用」）と同じ `gemma4:e4b-mlx-light-8k` にそろえる（2026-10-31 の利用者の判断。MLX 版を正とする）。
- `tsd-ollama-opencode.md` の「接続確認」の例の `gemma4:e4b-light-8k` を `gemma4:e4b-mlx-light-8k` に直す。
- `docs/ja/product/` の下で、`gemma4:e4b-light-8k` が残っていないことを検索で確かめ、結果を本個票の対応結果に書く。
- 母艦の Ollama のモデルの作成は利用者が行うため、executor は母艦への接続を試さない。
- 変更した文書で `npm run lint:md` と `npm run lint:fm` が通る。
- 利用者に影響しない文書の直しのため、`CHANGELOG.md` は変えない。

## 3. 作業内容

| No  | 作業                         | 担当     | 状態 | メモ |
| --- | ---------------------------- | -------- | ---- | ---- |
| 1   | 接続確認の例のモデル名を直す | executor | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[tsd-ollama-opencode]]
- [[tsd-ollama]]
