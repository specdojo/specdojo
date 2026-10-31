---
specdojo:
  id: prj-0001:pjr-ahxk-tsd-ollama-opencode-model-tag
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
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

- `docs/ja/product/030-architecture/020-infrastructure/tsd-ollama-opencode.md` の「5. 接続確認」の例（L109）のモデル名を `gemma4:e4b-light-8k` から `gemma4:e4b-mlx-light-8k` に修正した。
- 正しい登録名の根拠: `tsd-ollama.md`「7.2. Gemma 4 E4B 軽作業用」で `ollama create gemma4:e4b-mlx-light-8k` を作成する手順が定義され、設定例（`opencode.json` の `models` キー・`small_model`）でも `gemma4:e4b-mlx-light-8k` を使用。MLX 版を正とする判断に基づき接続確認の例もこれに揃えた。
- `docs/ja/product/` 配下で `gemma4:e4b-light-8k` を検索した結果、残存なし（修正後は出現しないことを確認）。
- 成果物: `tsd-ollama-opencode.md`。残課題はなし。

## 5. 関連ドキュメント

- [[tsd-ollama-opencode]]
- [[tsd-ollama]]
