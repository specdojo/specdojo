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

インストール後は Applications から oMLX を初回起動し、Welcome screen に従って次の 3 段階を実施する。

1. モデルの保存先に `~/.omlx/models` を指定する。
2. アプリが管理するサーバーを起動する。
3. `mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp` を検索し、最初のモデルとしてダウンロードする。

初回設定後は oMLX がメニューバーに常駐する。サーバーの起動・停止・監視はここから行う。

最後に、アプリがインストールする CLI shim のバージョンを確認する。この確認はサーバーの起動手順ではない。

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

1. Admin UI を使う場合は、メニューバーからサーバーを起動し、`http://127.0.0.1:8000/admin` を開く。モデルの検索とダウンロードの機能から `mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp` を選び、初回設定で指定した `~/.omlx/models` に保存する。
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

動作確認の段階では、初回設定のまま `127.0.0.1:8000` だけで待ち受ける。メニューバーの oMLX アイコンを開き、サーバーが開始されていることを確認する（`Server: running (port 8000)`）。

OpenAI 互換 API は `http://127.0.0.1:8000/v1`、Admin UI は `http://127.0.0.1:8000/admin` で提供される。モデル一覧を確認する。

```bash
curl http://127.0.0.1:8000/v1/models
```

API key を設定済みの場合は、`/v1/models` にも認証が必要になり、上記は `API key required` で失敗する。その場合は API key を `read -s` で読み込み、`Authorization` ヘッダーを付ける。`read -s` は入力を画面に表示せず、シェルの履歴にも残さない。API key を `.zshrc` などのファイルに書かず、確認が終わったら `unset` で破棄する。

```bash
read -s OMLX_API_KEY
curl -H "Authorization: Bearer $OMLX_API_KEY" \
  http://127.0.0.1:8000/v1/models
unset OMLX_API_KEY
```

Ornith が一覧に含まれれば、oMLX 側は正常に動いている。

Admin UI のモデル一覧から Ornith の per-model settings を開き、Model Alias を `ornith-1.5-35b` に設定する。以後、opencode からは Hugging Face 上の長い名前ではなく、この alias で呼べる。設定後、同じ方法で `/v1/models` を取得し、alias が表示されることを確認する。

## 6. M3 Max 64GB向けの初期設定

最初から最大性能を狙わず、安定する基準の設定から始める。以下の値は CLI の引数ではなく、Admin UI で入力する。

### 6.1. サーバー設定

Admin UI のサーバー全体の設定の Resource Management に次の値を入れる。

```text
Memory guard:                        48 GB
Hot Cache Limit (In-Memory Cache):   10%
Cold Cache Limit (SSD Cache):        50 GB
Max Concurrent Requests:             2
Embedding Batch Size:                既定値のまま
Chunked Prefill:                     ON
Prioritize Decoding During Prefill:  ON
Prefill Priority:                    Speed
Idle Timeout:                        None
```

各項目の意図は次のとおり。

| 項目                               | 意図                                                                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Memory guard                       | 既定値（システム RAM − 8GB）では開発ツールの余裕が残りにくいため、48GB に抑える。変更後はサーバーの再起動が必要である                         |
| Hot Cache Limit (In-Memory Cache)  | opencode が毎回送る長い system prompt などの KV cache を RAM に保持する。memory pressure が上がる場合は 5% に下げる                           |
| Cold Cache Limit (SSD Cache)       | 既定値の `auto` は空きディスクの 50% まで使うため、固定値で上限を決める。サーバーの再起動後も prefix cache を SSD から復元できる              |
| Max Concurrent Requests            | 2 つの opencode agent の並列実行に合わせる（既定値は 8）                                                                                      |
| Embedding Batch Size               | embedding モデルを使わないため、影響しない                                                                                                    |
| Chunked Prefill                    | 長い入力を分割して処理し、もう一方のリクエストの decode を止めにくくする                                                                      |
| Prioritize Decoding During Prefill | prefill 中も、生成中のリクエストの decode を優先する                                                                                          |
| Prefill Priority                   | `Speed` は prefill を最大速度で処理し、メモリに収まらないリクエストは拒否する。拒否が発生する場合は、prefill を縮小して続ける方式に切り替える |
| Idle Timeout                       | モデルをロードしたままにし、初回のロード待ちをなくす。oMLX を使わない時間が長く、メモリを解放したい場合は 30～60 分にする                     |

64GB のすべてを oMLX に使わせず、48GB 程度に抑える。macOS、VS Code、Docker Desktop、devcontainer、opencode、Git / Node などの開発ツールのための余裕を残すためである。Hot Cache が Memory guard の上限に含まれるかは公開情報で確認できないため、設定後は Admin UI の Peak memory と Activity Monitor の Memory Pressure で確認する。

### 6.2. キャッシュ設定

Admin UI のサーバー全体の設定の Cache に次の値を入れる。

```text
Cache Enabled:        ON
Hot Cache Only:       OFF
SSD Cache Directory:  既定値のまま
```

| 項目                | 意図                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| Cache Enabled       | opencode は毎回同じ長い system prompt を送るため、prefix cache で prefill の時間を減らす            |
| Hot Cache Only      | ON にすると SSD の層を使わず、サーバー設定の Cold Cache Limit が無駄になるため OFF にする           |
| SSD Cache Directory | 内蔵 SSD 上の既定値を使う。外付けドライブや、iCloud・Dropbox などで同期されるフォルダーを指定しない |

### 6.3. 生成の既定値

Admin UI のサーバー全体の設定の Generation Defaults は、全モデルに共通する既定値である。Ornith 個別の値は次節のモデル設定で入れるため、ここでは最低限の安全な値にとどめる。

```text
Global Context Window Cap:  65536
Fallback Context Window:    32768
Max Tokens:                 16384
Temperature:                既定値のまま
Top P:                      既定値のまま
Top K:                      既定値のまま
Repetition Penalty:         1.0
```

| 項目                        | 意図                                                                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Global Context Window Cap   | 全モデルの context の上限を、64K の運用方針に合わせる。context を拡張する場合は、モデル設定と同時にこの値も上げる       |
| Fallback Context Window     | モデルが最大 context を宣言していない場合の値として、控えめにする。Ornith は宣言しているため影響しない                  |
| Max Tokens                  | リクエストが出力の上限を指定しない場合の既定値である。thinking とファイル編集の出力が途中で切れないよう、余裕を持たせる |
| Temperature / Top P / Top K | Ornith 向けの値はモデル設定で入れるため、全体の既定値は変更しない                                                       |
| Repetition Penalty          | コードは同じ字句を正当に繰り返すため、ペナルティを無効（1.0）にする                                                     |

Global Context Window Cap と Fallback Context Window の正確な定義、および Generation Defaults とモデル設定の優先順位は、公開情報で確認できない。モデル設定の値が有効になっていることを、Admin UI のログや chat completion の応答で確認する。

### 6.4. モデル設定

Admin UI で Ornith の per-model settings を開き、次の値を入れる。opencode は temperature などのサンプリングの値をリクエストで送らないため、ここで設定した値がそのまま使われる。

```text
Max Context Window:       65536
Temperature:              0.6
Thinking Budget:          2048
```

| 項目               | 意図                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Max Context Window | 生成の既定値の Global Context Window Cap でも 64K に制限されるが、opencode の `limit.context`（[[tsd-omlx-opencode]]）と合わせる前提の値のため明示する        |
| Temperature        | モデルの `generation_config.json` の既定値は 1.0 である。Qwen 系が thinking を使うコーディング向けに推奨する 0.6 とし、tool の引数や diff の安定性を優先する  |
| Thinking Budget    | 上限がないと考えすぎて遅くなり、出力の Max Tokens も消費するため、上限を付ける。難しい設計やレビューで 4096 にする基準は、後述の Thinking Budget の節で定める |

次の項目は既定値のままとし、画面上の既定値が次の値であることを確認する。異なる場合は次の値を入れる。

```text
Top P:                    0.95
Top K:                    20
Thinking:                 ON
Lightning MTP:            OFF
TurboQuant KV:            OFF
SpecPrefill:              OFF
DFlash:                   OFF
Qwen ANE Prefill:         OFF
```

Top P と Top K は、モデルの `generation_config.json` の既定値と同じである。ただし、oMLX が `generation_config.json` の値を既定値として使うかは、公開情報で確認できない。

### 6.5. Lightning MTP を最初は OFF にする理由

このモデルは MTP head を保持しているが、配布元は MoE での Lightning MTP について、まず OFF で評価することを推奨している。別のベンチマークでは ON で高速化した例もあるため、次の順で判断する。

1. OFF で品質と tool calling を確認する
2. 同じタスクで ON にする
3. 速度の向上と失敗率を比べる
4. 品質が落ちなければ ON で運用する

### 6.6. Thinking Budget

Ornith は reasoning model のため、thinking を完全には切らず、上限を付けて使う。通常は 2048 tokens、難しい設計やレビューでは 4096 tokens とする。考えすぎて遅くなるのを避けるため、通常作業で 8192 以上にはしない。

## 7. 並列実行

2 つの opencode agent を同時に動かす場合の設定値は、`サーバー設定` と `モデル設定` に従う。

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

普段は `max_concurrent_requests = 2` とする。夜間の一括処理などで 3～4 並列を試す場合も、context は 64K を基準とし、thinking budget は 2048 程度にする。並列数を増やすときは、Admin UI で総スループット、リクエストごとの TTFT、Peak memory、長い文脈での品質を確認する。prefill の遅延や一時的なメモリ使用量、memory pressure に問題が出た場合に限り、実測結果に基づいて context を下げる。

## 8. devcontainerからの接続

devcontainer からは Mac ホストの `localhost` を直接参照できないため、oMLX を `0.0.0.0:8000` で待ち受けさせる。ネットワークに bind するときは、必ず長いランダムな API key を設定する。

1. Mac ホストのブラウザーで `http://127.0.0.1:8000/admin` を開く。
2. Admin UI のサーバー全体の設定で、待ち受けアドレスを `0.0.0.0`、ポートを `8000`、Max Concurrent Requests を `2` にする。
3. 同じ設定で API key を入力し、保存する。
4. メニューバーの oMLX から配信統計の`Restart`をクリックしサーバーを再起動する。

Admin UI で保存した API key を含む設定は `~/.omlx/settings.json` に永続化される。このファイルと API key の値を Git に commit せず、本書を含むリポジトリ内にコピーしない。

devcontainer 内のシェルで、Mac ホストで設定した API key を `read -s` で読み込む。入力は画面に表示されず、シェルの履歴にも残らない。

```bash
read -s OMLX_API_KEY
```

モデル一覧を取得できることを確認する。

```bash
curl \
  -H "Authorization: Bearer $OMLX_API_KEY" \
  http://host.docker.internal:8000/v1/models
```

次に、chat completion を確認する。

```bash
curl http://host.docker.internal:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OMLX_API_KEY" \
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

確認が終わったら、API key を破棄する。

```bash
unset OMLX_API_KEY
```

## 9. CLI で起動する場合

CLI での起動は、Homebrew 版を使う場合や自動化する場合の別手段とする。アプリ版の通常運用ではメニューバーから起動し、`omlx serve` を使わない。

アプリと CLI は同じ `~/.omlx/settings.json` を使う。設定の優先順位は、強い順にコマンドの引数、`OMLX_*` 環境変数、`~/.omlx/settings.json`、組み込みの既定値である。

アプリが管理するサーバーの起動中に別プロセスの `omlx serve` を実行すると、既定のポート `8000` が衝突する。CLI で起動する前に、メニューバーからアプリ管理のサーバーを停止する。

## 10. メモリ配分と監視

64GB の Mac での配分の目安は次のとおり。

```text
Ornith + oMLX       22～30GB前後
Docker/devcontainer  8～16GB
macOS + GUI          8～12GB
余裕                 残り
```

Docker Desktop に 32GB 以上を割り当てる必要はない。SpecDojo の用途では、まず 12～16GB 程度を目安にし、memory pressure が黄色・赤にならない範囲で調整する。

Ornith-1.5 の KV cache は、`config.json` にある次の値から fp16 で概算する。

| 項目                      | 値        | 算定への反映                                  |
| ------------------------- | --------- | --------------------------------------------- |
| `num_hidden_layers`       | 40        | 全レイヤー数                                  |
| `full_attention_interval` | 4         | 通常の attention は 40 層中 10 層             |
| `num_key_value_heads`     | 2         | K/V それぞれのヘッド数                        |
| `head_dim`                | 256       | 1 ヘッドの次元数                              |
| 1 トークンあたり          | 約 20 KB  | 10 層 × K/V × 2 ヘッド × 256 次元 × 2 byte    |
| 64K × 1 リクエスト        | 約 1.3 GB | 20,480 byte × 65,536 tokens                   |
| 64K × 2 リクエスト        | 約 2.7 GB | 64K × 1 の 2 リクエスト分                     |
| モデル本体との合計        | 約 24 GB  | 約 20.9 GB のモデル本体 + 64K × 2 の KV cache |

この概算の対象は通常の attention 10 層の KV cache である。残りの linear attention の状態は context の長さによらず一定である。値は fp16 を仮定した概算で、oMLX 内部のバッファや一時領域などのオーバーヘッドは含まない。そのため、運用時は計算値だけでなく Admin UI の Peak memory も確認する。

監視は次で行う。

- Activity Monitor の Memory Pressure と Swap Used
- ターミナルの `memory_pressure`
- oMLX の Admin UI の Loaded model、Concurrent requests、Peak memory、Tokens/sec、TTFT

swap が継続的に大きく増える場合は、次の順で調整する。

1. context を下げる
2. 並列数を 2 に戻す
3. thinking budget を下げる
4. Docker のメモリの割り当てを見直す

## 11. 段階的な最適化

### 11.1. フェーズ1：安定性の基準

最初の数日は、次の設定で固定する。

```text
Context:                64K
Concurrency:            2
Thinking budget:        2048
Lightning MTP:          OFF
TurboQuant KV:          OFF
Chunked Prefill:        ON
Prefill Priority:       Speed
Memory guard:           48GB
```

この状態で、Ollama の Qwen3.8（[[tsd-ollama]]）と同じ実タスクを比べる。成功・失敗、総処理時間、tool call の失敗回数、テストの再実行回数、修正漏れ、不要な変更、最終的な diff の品質を記録する。tokens/sec だけで判断しない。比較の方法は [[tsd-omlx-opencode]] で定義する。

### 11.2. フェーズ2：Lightning MTP

安定性を確認できたら、Lightning MTP を ON にして同じタスクを再実行する。生成速度、tool call の精度、重複生成、reasoning の破綻、JSON や tool の引数の破損、テストの成功率を確認し、品質に問題がなければ ON を採用する。問題が出れば OFF に戻す。

### 11.3. フェーズ3：context の拡張

64K を通常運用の基準とし、必要な場合に 128K 以上への拡張を検討する。拡張する場合は、モデル設定の Max Context Window と、生成の既定値の Global Context Window Cap を合わせて上げる。このモデルでは 64K × 2 の KV cache が約 2.7GB のため、64K での主な判断材料は KV cache の容量ではなく、prefill の時間、prefill 中の一時的なメモリ使用量、長い文脈での回答と tool calling の品質である。Admin UI の TTFT と Peak memory を確認し、同じ実タスクで修正漏れ、不要な変更、tool call の失敗率を比較する。

prefix cache が再利用できる共通 prefix は prefill の負担を減らせるが、新規部分の prefill は残る。Chunked Prefill は長い入力を分割して処理し、decode との干渉や一時的なメモリ使用量を抑えるため、ON を維持する。どちらも長い文脈での品質低下を補う機能ではないため、最終判断は実タスクの品質を含めて行う。

### 11.4. TurboQuant KV Cache

M3 Max 64GB で 64K × 2 の場合は、KV cache が約 2.7GB に収まるため OFF のままとする。3 並列以上または 128K 以上へ増やす場合に検討し、実測した Peak memory や memory pressure に余裕がなければ試す。試す場合は 6-bit から始める。4-bit はメモリの節約効果が大きいが、coding や tool calling の用途では品質を確認してから採用する。

## 12. 参照

- <https://github.com/TomLeeLive/jundot-omlx>
- <https://huggingface.co/mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp/raw/main/config.json>
- <https://jacar.es/en/omlx-api-key-port-endpoints/>
