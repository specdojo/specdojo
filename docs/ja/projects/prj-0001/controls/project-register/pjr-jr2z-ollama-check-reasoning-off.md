---
specdojo:
  id: prj-0001:pjr-jr2z-ollama-check-reasoning-off
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: low
  difficulty: easy
  owner: ARC
  registered_at: "2026-10-31T07:05:03Z"
  completed_at: "2026-10-31T07:28:50Z"
  conclusion: "tsd-ollama-opencode の接続確認の例に reasoning_effort: none を足し、期待する結果と、付けないと本文が空になりうることを書いた。tsd-ollama の確認の例は OpenAI 互換の API ではないため変えていない"
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

- `tsd-ollama-opencode.md` の「接続確認」の `curl` の例の要求に `"reasoning_effort": "none"` を足す。
- 同じ節に、期待する結果（`finish_reason` が `stop` で、`content` に短い本文が返ること）と、`reasoning_effort` を付けないと考える過程だけで `max_tokens` に達して本文が空になりうることを書く。
- `tsd-ollama.md` の確認の例（`/api/generate` や `ollama run` など）も、考える過程で本文が空になりうるかを文書の記述から確かめ、OpenAI 互換の `/v1/chat/completions` を使う例があれば同じく直す。`/api/generate` など別の API の例は変えず、確かめた結果を本個票の対応結果に書く。
- モデル名は PJR-AHXK でそろえた `gemma4:e4b-mlx-light-8k` のままにする。
- 変更した文書で `npm run lint:md` と `npm run lint:fm` が通る。
- 利用者に影響しない文書の直しのため、`CHANGELOG.md` は変えない。

## 4. 作業内容

| No  | 作業                                                         | 担当     | 状態 | メモ |
| --- | ------------------------------------------------------------ | -------- | ---- | ---- |
| 1   | 接続確認の例に `reasoning_effort` を足し、期待する結果を書く | executor | done | -    |

## 5. 対応結果

- `tsd-ollama-opencode.md` の「5. 接続確認」の `curl`（`/v1/chat/completions` の OpenAI 互換 API）の要求に `"reasoning_effort": "none"` を追加した。モデルは `gemma4:e4b-mlx-light-8k`、`max_tokens` は 32 のまま。
- 同じ節に、期待する結果（`finish_reason` が `stop` で、`content` に短い本文が返ること）と、`reasoning_effort` を付けないと考える過程だけで `max_tokens` に達して `content` が空になりうることを追記した。また、`"think": false` では止められなかった旨を記載した。
- `tsd-ollama.md` の確認の例を確認した。本書の生成系の確認は `curl ... /api/generate`（第 6 節）と `ollama run gemma4:e4b-mlx-light-8k ...`（第 7.5 節）であり、いずれも OpenAI 互換の `/v1/chat/completions` ではなかった。完了条件は「OpenAI 互換の `/v1/chat/completions` を使う例があれば直す。`/api/generate` など別の API の例は変えずに確かめた結果を書く」としているため、`tsd-ollama.md` の `/api/generate` と `ollama run` の例は変更の対象外と判断し、変更していない。
- モデル名は PJR-AHXK でそろえた `gemma4:e4b-mlx-light-8k` のままにしている。
- 利用者に影響しない文書の直しのため、`CHANGELOG.md` は変更していない。

## 6. 関連ドキュメント

- [[prj-0001:pjr-ahxk-tsd-ollama-opencode-model-tag]]
- [[tsd-ollama-opencode]]
- [[tsd-ollama]]
