---
specdojo:
  id: tsd-omlx
  type: architecture
  status: draft
  rulebook: specdojo:tsd-rulebook
  part_of:
    - tsd-index
---

# oMLX 技術スタック定義

SpecDojo では、ローカル LLM の実行基盤として、Ollama（[[tsd-ollama]]）に加えて oMLX を技術スタックの一部として定義する。oMLX は Apple Silicon 向けの MLX 推論サーバで、1 つのモデルを continuous batching で複数のリクエストに共有させられる。devcontainer 内の複数の opencode agent から同じモデルを並列に使う用途に向く。なお、oMLX の使用は必須ではない。

## 1. oMLX実行環境

oMLX は Mac ホスト側で実行し、opencode は devcontainer 内で実行する。本書は次の環境を対象とする。

- Apple Silicon Mac（M3 Max / 64GB Unified Memory）
- macOS 15 以降
- 最初の目標は、2 つの opencode agent の並列実行とする

構成の基本は、モデルを 1 つだけロードし、oMLX の continuous batching で 2 つのリクエストを並列に処理することである。同じモデルを 2 つ別々にロードしない。

```text
Mac host
├─ oMLX
│  └─ Ornith-1.5 35B-A3B oQ4e-mtp  ← 1 copy
│
├─ Docker / devcontainer A
│  └─ opencode agent A ─┐
│                       ├─→ oMLX :8000
└─ Docker / devcontainer B
   └─ opencode agent B ─┘
```

2 並列にしても、各 agent が単独時と同じ速度で動くわけではない。continuous batching により総スループットは増えるが、各リクエストのレイテンシは少し増える。

opencode からの接続設定は [[tsd-omlx-opencode]] で定義する。

## 2. oMLXのインストール

oMLX は、macOS アプリ版を使う。GitHub Releases から最新の macOS アプリを取得し、Applications へインストールする。

macOS アプリ版を使う理由は次のとおり。

- Apple Silicon 向けのネイティブカーネルを同梱している
- 自動アップデートに対応している
- Admin UI を使える
- CLI shim もインストールされる
- Qwen3.5 系の高速化機能を利用しやすい

Homebrew 版でも動作するが、本構成の Qwen3.5 MoE 系のモデルではアプリ版を優先する。

インストール後、バージョンを確認する。

```bash
~/.omlx/bin/omlx --version
```

`omlx` が PATH に入っていれば、`omlx --version` でもよい。

## 3. モデルの選定

| 用途                         | 採用モデル                              | 補足                                                          |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| 並列の agent 作業            | `mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp` | 約 35B total / 約 3B active の MoE。oQ4e mixed-precision 4bit |
| 最終判断・難しい設計レビュー | Claude Code / Codex                     | ローカル LLM の結果を必要に応じて補完する                     |

`mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp` を選ぶ理由は次のとおり。

- 約 20.9GB で、M3 Max 64GB でも 2 セッション分の KV cache を含めて余裕がある
- MTP head を保持している
- text-only 版である
- Qwen 用に修正された chat template を含み、opencode の tool calling と相性を確認しやすい

opencode では chat template と tool call の形式が重要なため、単純な MLX 4bit 変換よりこの版を優先する。

## 4. モデルの保存先とダウンロード

モデルの保存先は `~/.omlx/models` とする。

```bash
mkdir -p ~/.omlx/models
```

モデルは、oMLX の Admin UI または Hugging Face CLI でダウンロードする。

1. Admin UI を使う場合は、oMLX を起動して Admin UI から Hugging Face のモデルを検索し、`mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp` を `~/.omlx/models` に保存する。
2. Hugging Face CLI（`hf`）を使う場合は、次を実行する。

```bash
hf download \
  mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp \
  --local-dir ~/.omlx/models/Ornith-1.5-35B-A3B-oQ4e-mtp
```

ダウンロード後、容量を確認する。

```bash
du -sh ~/.omlx/models/Ornith-1.5-35B-A3B-oQ4e-mtp
```

20GB 強になっていればよい。

## 5. 起動とモデル alias

動作確認の段階では、localhost だけで待ち受けて起動する。

```bash
~/.omlx/bin/omlx serve \
  --model-dir ~/.omlx/models \
  --max-concurrent-requests 2 \
  --memory-guard-gb 48
```

OpenAI 互換 API は `http://127.0.0.1:8000/v1`、Admin UI は `http://127.0.0.1:8000/admin` で提供される。モデル一覧を確認する。

```bash
curl http://127.0.0.1:8000/v1/models
```

Ornith が一覧に含まれれば、oMLX 側は正常に動いている。

Admin UI で、Ornith の Model Alias を `ornith-1.5-35b` に設定する。以後、opencode からは Hugging Face 上の長い名前ではなく、この alias で呼べる。設定後、`curl http://127.0.0.1:8000/v1/models` で alias が表示されることを確認する。

## 6. M3 Max 64GB向けの初期設定

最初から最大性能を狙わず、安定する基準の設定から始める。

### 6.1. サーバー設定

```text
Max Concurrent Requests: 2
Memory Guard:            48 GB
Chunked Prefill:         ON
Prefill Priority:        speed
Decode Fairness:         ON
```

64GB のすべてを oMLX に使わせず、48GB 程度に抑える。macOS、VS Code、Docker Desktop、devcontainer、opencode、Git / Node などの開発ツールのための余裕を残すためである。

### 6.2. モデル設定

```text
Max Context Window:       32768
Temperature:              0.6
Top P:                    0.95
Top K:                    20

Thinking:                 ON
Thinking Budget:          2048～4096

Lightning MTP:            OFF
TurboQuant KV:            OFF
SpecPrefill:              OFF
DFlash:                   OFF
Qwen ANE Prefill:         OFF
```

### 6.3. Lightning MTP を最初は OFF にする理由

このモデルは MTP head を保持しているが、配布元は MoE での Lightning MTP について、まず OFF で評価することを推奨している。別のベンチマークでは ON で高速化した例もあるため、次の順で判断する。

1. OFF で品質と tool calling を確認する
2. 同じタスクで ON にする
3. 速度の向上と失敗率を比べる
4. 品質が落ちなければ ON で運用する

### 6.4. Thinking Budget

Ornith は reasoning model のため、thinking を完全には切らず、上限を付けて使う。通常は 2048 tokens、難しい設計やレビューでは 4096 tokens とする。考えすぎて遅くなるのを避けるため、通常作業で 8192 以上にはしない。

## 7. 並列実行

2 つの opencode agent を同時に動かす場合は、次の設定とする。

```text
Max Concurrent Requests: 2
Context per agent:        32768
Thinking Budget:          2048
Chunked Prefill:          ON
Prefill Priority:         speed
Decode Fairness:          ON
Memory Guard:             48GB
```

Ornith を 2 コピー起動しない。1 つの oMLX に 1 つの Ornith をロードし、2 つのリクエストを continuous batching で処理させる。

```text
oMLX #1
  └─ Ornith 21GB
       ├─ request A
       └─ request B
```

単独時を 1.0 とすると、2 並列の総スループットは概ね 1.4～1.7 倍を期待できる。1 つの agent を最速で終わらせるなら単独のほうが速いが、2 件の作業を同時に終わらせる総時間は並列のほうが有利であり、SpecDojo のバックグラウンドの agent 用途と相性がよい。

3 並列・4 並列も技術的には可能である（oMLX の既定の最大同時リクエスト数は 8）。M3 Max 64GB での実作業では、次の目安とする。

| 並列数 | 用途                       |
| ------ | -------------------------- |
| 1      | 対話作業                   |
| 2      | 推奨                       |
| 3      | バックグラウンドの一括処理 |
| 4      | スループット重視           |

普段は `max_concurrent_requests = 2` とする。夜間の一括処理などで 3～4 並列を試す場合は、context を 16K～24K、thinking budget を 2048 程度まで抑える。

## 8. devcontainerからの接続

devcontainer からは Mac ホストの `localhost` を直接参照できないため、oMLX を `0.0.0.0:8000` で待ち受けさせる。ネットワークに bind するときは、必ず API key を設定する。

API key は Mac ホストのシェルの環境変数 `OMLX_API_KEY` に、長いランダムな値を設定する。値は Git に commit せず、本書を含むリポジトリ内のファイルにも書かない。

```bash
~/.omlx/bin/omlx serve \
  --model-dir ~/.omlx/models \
  --host 0.0.0.0 \
  --api-key "$OMLX_API_KEY" \
  --max-concurrent-requests 2 \
  --memory-guard-gb 48
```

devcontainer 内から、モデル一覧を取得できることを確認する。`<OMLX_API_KEY>` には Mac ホストで設定した値を入れる。

```bash
curl \
  -H "Authorization: Bearer <OMLX_API_KEY>" \
  http://host.docker.internal:8000/v1/models
```

次に、chat completion を確認する。

```bash
curl http://host.docker.internal:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <OMLX_API_KEY>" \
  -d '{
    "model": "ornith-1.5-35b",
    "messages": [
      {
        "role": "user",
        "content": "Reply with exactly: OK"
      }
    ],
    "temperature": 0.6,
    "max_tokens": 32
  }'
```

## 9. メモリ配分と監視

64GB の Mac での配分の目安は次のとおり。

```text
Ornith + oMLX       22～30GB前後
Docker/devcontainer  8～16GB
macOS + GUI          8～12GB
余裕                 残り
```

Docker Desktop に 32GB 以上を割り当てる必要はない。SpecDojo の用途では、まず 12～16GB 程度を目安にし、memory pressure が黄色・赤にならない範囲で調整する。

監視は次で行う。

- Activity Monitor の Memory Pressure と Swap Used
- ターミナルの `memory_pressure`
- oMLX の Admin UI の Loaded model、Concurrent requests、Peak memory、Tokens/sec、TTFT

swap が継続的に大きく増える場合は、次の順で調整する。

1. context を下げる
2. 並列数を 2 に戻す
3. thinking budget を下げる
4. Docker のメモリの割り当てを見直す

## 10. 段階的な最適化

### 10.1. フェーズ1：安定性の基準

最初の数日は、次の設定で固定する。

```text
Context:                32K
Concurrency:            2
Thinking budget:        2048
Lightning MTP:          OFF
TurboQuant KV:          OFF
Chunked Prefill:        ON
Prefill Priority:       speed
Memory Guard:           48GB
```

この状態で、Ollama の Qwen3.8（[[tsd-ollama]]）と同じ実タスクを比べる。成功・失敗、総処理時間、tool call の失敗回数、テストの再実行回数、修正漏れ、不要な変更、最終的な diff の品質を記録する。tokens/sec だけで判断しない。比較の方法は [[tsd-omlx-opencode]] で定義する。

### 10.2. フェーズ2：Lightning MTP

安定性を確認できたら、Lightning MTP を ON にして同じタスクを再実行する。生成速度、tool call の精度、重複生成、reasoning の破綻、JSON や tool の引数の破損、テストの成功率を確認し、品質に問題がなければ ON を採用する。問題が出れば OFF に戻す。

### 10.3. フェーズ3：context の拡張

32K で不足したときだけ、48K または 64K へ増やす。常時 64K 以上にする必要はない。opencode の agent では tool の結果や diff が積み重なるため、context が大きすぎると、prefill の時間、KV cache、2 並列時のメモリが増え、古い情報を抱え込みすぎる。通常は 32K、レビューは 64K 程度で使い分ける。

### 10.4. TurboQuant KV Cache

M3 Max 64GB で 32K × 2 の場合は OFF のままとする。64K 以上を多用する、3～4 並列へ増やす、memory pressure が高い、のいずれかの場合だけ検討する。試す場合は 6-bit から始める。4-bit はメモリの節約効果が大きいが、coding や tool calling の用途では品質を確認してから採用する。
