---
specdojo:
  id: prj-0001:pjr-wre7-omlx-context-64k
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-03T02:59:25Z"
  completed_at: "2026-10-03T03:09:48Z"
  conclusion: tsd-omlx と tsd-omlx-opencode のコンテキストの既定を 64K にし、config.json に基づく KV cache の見積もり（64K × 2 で約 2.7GB、合計約 24GB）と、prefill の時間・品質を見る判断の書き方に直した
---

# PJR-WRE7 oMLX の Ornith のコンテキストを 64K にする

## 1. 概要

Ornith-1.5（qwen3_5_moe）は 40 層中 10 層だけが通常の attention で、64K × 2 並列でも KV cache は約 2.7GB に収まる。tsd-omlx と tsd-omlx-opencode のコンテキストの既定を 32K から 64K にし、KV cache の見積もりと、メモリより prefill の時間と品質を見る判断の書き方に直す

## 2. 完了条件

- [[tsd-omlx]] の「モデル設定」の `Max Context Window` と「並列実行」の `Context per agent` を `65536` にする。「段階的な最適化」のフェーズ1の `Context` も 64K にそろえる。
- 「メモリ配分と監視」に、KV cache の見積もりを表で加える。根拠は `config.json` の値（40 層、`full_attention_interval` 4、`num_key_value_heads` 2、`head_dim` 256）とし、1 トークンあたり約 20 KB、64K × 1 で約 1.3 GB、64K × 2 で約 2.7 GB、linear attention の状態は長さによらず一定、モデル本体と合わせて約 24 GB とする。fp16 の概算で oMLX の内部のオーバーヘッドを含まないことを明記する。
- 「context の拡張」を、64K を基準とし、メモリより prefill の時間・prefill 中の一時的なメモリ（Admin UI の Peak memory）・長い文脈での品質を見て判断する書き方に直す。prefix cache と Chunked Prefill の効果にも触れる。
- 「TurboQuant KV Cache」を、このモデルでは 64K × 2 でも KV cache が小さいため、3 並列以上か 128K 以上の場合に検討する書き方に直す。
- 「並列実行」で 3〜4 並列のときに context を 16K〜24K へ抑えるとしている記述を、上の見積もりと矛盾しないように見直す。
- [[tsd-omlx-opencode]] の `limit.context` を `65536` にし、本文の対応する説明をそろえる。
- 参照に `config.json` の URL（<https://huggingface.co/mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp/raw/main/config.json>）を加える。
- `npm run lint:md`・`npm run lint:fm` が通る。

## 3. 作業内容

| No  | 作業                                      | 担当 | 状態 | メモ                                          |
| --- | ----------------------------------------- | ---- | ---- | --------------------------------------------- |
| 1   | tsd-omlx の設定値と説明の更新             | DEV  | done | 64K の既定値、KV cache の概算、運用判断を更新 |
| 2   | tsd-omlx-opencode の limit.context の更新 | DEV  | done | `limit.context` と説明を 65536 に更新         |

## 4. 対応結果

[[tsd-omlx]] の Ornith の既定 context を 64K に変更し、モデル構成に基づく KV cache の概算、prefill・Peak memory・品質を使った判断基準、3～4 並列および TurboQuant KV Cache の運用方針を更新した。[[tsd-omlx-opencode]] の `limit.context` も `65536` にそろえた。残課題はない。

## 5. 関連ドキュメント

- [[tsd-omlx]]
- [[tsd-omlx-opencode]]
- [[prj-0001:pjr-mgnw-omlx-app-gui-setup]]
