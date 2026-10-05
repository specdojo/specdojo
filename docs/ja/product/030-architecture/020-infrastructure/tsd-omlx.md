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

構成の基本は、Ornith または Qwen3.6 のいずれか 1 つだけをロードし、oMLX の continuous batching で 2 つのリクエストを並列に処理することである。同じモデルを 2 つ別々にロードせず、モデルを比較するときも同時にはロードしない。

```text
Mac host
├─ oMLX
│  └─ Ornith-1.5 35B-A3B oQ4e-mtp または Qwen3.6 35B-A3B 4bit  ← 1 copy
│
├─ Docker / devcontainer A
│  └─ opencode agent A ─┐
│                       ├─→ oMLX :8000
└─ Docker / devcontainer B
   └─ opencode agent B ─┘
```

opencode からの接続設定は [[tsd-omlx-opencode]] で定義する。

## 2. モデルの選定

| 用途                         | 採用モデル                              | 補足                                                          |
| ---------------------------- | --------------------------------------- | ------------------------------------------------------------- |
| 並列の agent 作業            | `mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp` | 約 35B total / 約 3B active の MoE。oQ4e mixed-precision 4bit |
| agentic coding の比較運用    | `mlx-community/Qwen3.6-35B-A3B-4bit`    | 約 35B total / 約 3B active の MoE。MLX 4bit、約 20.4GB       |
| 最終判断・難しい設計レビュー | Claude Code / Codex                     | ローカル LLM の結果を必要に応じて補完する                     |

`mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp` を選ぶ理由は次のとおり。

- 約 20.9GB で、M3 Max 64GB でも 2 セッション分の KV cache を含めて余裕がある
- MTP head を保持している
- text-only 版である
- Qwen 用に修正された chat template を含む。opencode では chat template と tool call の形式が重要なため、単純な MLX 4bit 変換よりこの版を優先する

`mlx-community/Qwen3.6-35B-A3B-4bit` は、agentic coding と tool calling を重視した Qwen3.6 を Ornith と同程度のメモリで比較するために追加する。vision encoder を含むモデルだが、本構成では opencode から text-only で利用する。通常運用では Ornith と Qwen3.6 のどちらか一方だけをロードする。

## 3. oMLXのインストール

oMLX は macOS アプリ版を使う。Apple Silicon 向けのネイティブカーネルを同梱し、自動アップデートと Admin UI に対応しているためである。サーバーの起動・停止・監視はメニューバーから、設定は Admin UI から行う。

GitHub Releases から最新の macOS アプリを取得して Applications へインストールし、初回起動時の Welcome screen に従って次を実施する。

1. モデルの保存先に `~/.omlx/models` を指定する。
2. アプリが管理するサーバーを起動する。
3. `mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp` を検索し、ダウンロードする。
4. `mlx-community/Qwen3.6-35B-A3B-4bit` を検索し、比較用モデルとしてダウンロードする。

初回設定後は oMLX がメニューバーに常駐する。メニューバーの oMLX アイコンを開き、サーバーが起動していることを確認する。

```text
Server: running (port 8000)
```

ダウンロードしたモデルの容量を確認する。どちらも 20GB 強になっていればよい。

```bash
du -sh ~/.omlx/models/*Ornith-1.5-35B-A3B-oQ4e-mtp*
du -sh ~/.omlx/models/*Qwen3.6-35B-A3B-4bit*
```

## 4. M3 Max 64GB向けの初期設定

最初から最大性能を狙わず、安定する基準の設定から始める。設定は、Mac ホストのブラウザーで `http://127.0.0.1:8000/admin` を開き、Admin UI で入力する。

待ち受けアドレス、API key、Memory guard の変更は、サーバーの再起動後に有効になる。本章の設定をすべて入力した後、メニューバーの oMLX から配信統計の `Restart` を選び、サーバーを再起動する。

Admin UI で保存した設定は、API key を含めて `~/.omlx/settings.json` に永続化される。このファイルと API key の値を Git に commit せず、本書を含むリポジトリ内にコピーしない。

### 4.1. 待ち受けとAPI key

devcontainer からは Mac ホストの `localhost` を直接参照できないため、oMLX を `0.0.0.0:8000` で待ち受けさせる。ネットワークに bind するため、必ず長いランダムな API key を設定する。

Admin UI のサーバー全体の設定に次の値を入れる。

```text
Host:     0.0.0.0
Port:     8000
API key:  長いランダムな値
```

API key を設定すると、`127.0.0.1` からのリクエストを含め、`/v1/models` などすべての API で `Authorization` ヘッダーが必要になる。

### 4.2. サーバー設定

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

| 項目                               | 意図                                                                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Memory guard                       | 既定値（システム RAM − 8GB）では、macOS、VS Code、Docker Desktop、devcontainer などの開発ツールの余裕が残りにくいため、48GB に抑える          |
| Hot Cache Limit (In-Memory Cache)  | opencode が毎回送る長い system prompt などの KV cache を RAM に保持する。memory pressure が上がる場合は 5% に下げる                           |
| Cold Cache Limit (SSD Cache)       | 既定値の `auto` は空きディスクの 50% まで使うため、固定値で上限を決める。サーバーの再起動後も prefix cache を SSD から復元できる              |
| Max Concurrent Requests            | 2 つの opencode agent の並列実行に合わせる（既定値は 8）                                                                                      |
| Embedding Batch Size               | embedding モデルを使わないため、影響しない                                                                                                    |
| Chunked Prefill                    | 長い入力を分割して処理し、もう一方のリクエストの decode を止めにくくする。prefill 中の一時的なメモリ使用量も抑える                            |
| Prioritize Decoding During Prefill | prefill 中も、生成中のリクエストの decode を優先する                                                                                          |
| Prefill Priority                   | `Speed` は prefill を最大速度で処理し、メモリに収まらないリクエストは拒否する。拒否が発生する場合は、prefill を縮小して続ける方式に切り替える |
| Idle Timeout                       | モデルをロードしたままにし、初回のロード待ちをなくす。oMLX を使わない時間が長く、メモリを解放したい場合は 30～60 分にする                     |

Hot Cache が Memory guard の上限に含まれるかは公開情報で確認できないため、設定後は Admin UI の Peak memory と Activity Monitor の Memory Pressure で確認する。

### 4.3. キャッシュ設定

Admin UI のサーバー全体の設定の Cache に次の値を入れる。

```text
Cache Enabled:        ON
Hot Cache Only:       OFF
SSD Cache Directory:  既定値のまま
```

| 項目                | 意図                                                                                                |
| ------------------- | --------------------------------------------------------------------------------------------------- |
| Cache Enabled       | opencode は毎回同じ長い system prompt を送るため、prefix cache で prefill の時間を減らす            |
| Hot Cache Only      | ON にすると SSD の層を使わず、Cold Cache Limit が無駄になるため OFF にする                          |
| SSD Cache Directory | 内蔵 SSD 上の既定値を使う。外付けドライブや、iCloud・Dropbox などで同期されるフォルダーを指定しない |

### 4.4. 生成の既定値

Admin UI のサーバー全体の設定の Generation Defaults は、全モデルに共通する既定値である。リクエストが値を指定しない場合だけ使われる。opencode はモデルごとのサンプリングの値と thinking の有無をリクエストで送るため（[[tsd-omlx-opencode]]）、ここでは最低限の安全な値にとどめる。

```text
Global Context Window Cap:  131072
Fallback Context Window:    32768
Max Tokens:                 32768
Temperature:                既定値のまま
Top P:                      既定値のまま
Top K:                      既定値のまま
Repetition Penalty:         1.0
```

| 項目                        | 意図                                                                                                                                                                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Global Context Window Cap   | Qwen3.6 の thinking で使う 128K を上限とする。Ornith は per-model settings で 64K に制限する                                                                                                                                                   |
| Fallback Context Window     | モデルが最大 context を宣言していない場合の値として、控えめにする。採用する 2 モデルは宣言しているため影響しない                                                                                                                               |
| Max Tokens                  | リクエストが出力の上限を指定しない場合の既定値である。ファイル編集の出力が途中で切れないよう、余裕を持たせる。opencode はモデルの `limit.output`（[[tsd-omlx-opencode]]）を出力の上限として送るため、opencode からの利用ではこの値は使われない |
| Temperature / Top P / Top K | モデルごとに推奨値が異なり、opencode のリクエストでも指定するため、全体の既定値は変更しない                                                                                                                                                    |
| Repetition Penalty          | コードは同じ字句を正当に繰り返すため、ペナルティを無効（1.0）にする                                                                                                                                                                            |

Global Context Window Cap と Fallback Context Window の正確な定義、および Generation Defaults とモデル設定の優先順位は、公開情報で確認できない。モデル設定の値が有効になっていることを、Admin UI のログや chat completion の応答で確認する。

### 4.5. モデル設定

各モデルのサンプリングの値と thinking の有無は、opencode の設定（[[tsd-omlx-opencode]] の「サンプリングと thinking」）を正とする。oMLX はリクエストで指定された `temperature`、`top_p`、`top_k`、`min_p`、`presence_penalty`、`repetition_penalty`、`chat_template_kwargs.enable_thinking` を、Admin UI のモデル設定より優先する。2026-10-04 に、Admin UI の Thinking を OFF にしたままリクエストで `enable_thinking: true` を送ると thinking が出ることで確認した。

Admin UI のモデル設定には、opencode を介さないリクエスト（`curl` による確認など）のための既定値を入れる。値は opencode の設定とそろえる。

#### 4.5.1. Ornith

Admin UI のモデル一覧から Ornith の per-model settings を開き、次の値を入れる。

```text
Model Alias:              ornith-1.5-35b
Max Context Window:       65536
Thinking:                 OFF
Temperature:              0.7
Top P:                    0.8
Top K:                    20
Min P:                    0.05
Presence Penalty:         0.0
Repetition Penalty:       1.0
```

| 項目                                  | 意図                                                                                                                                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Model Alias                           | API で公開するモデル名を短くし、opencode から Hugging Face 上の長い名前ではなく alias で呼べるようにする                                                                                                                  |
| Max Context Window                    | Global Context Window Cap でも 64K に制限されるが、opencode の `limit.context`（[[tsd-omlx-opencode]]）と合わせる前提の値のため明示する                                                                                   |
| Thinking                              | OFF とする。2026-10-04 の grade の計測で、thinking ON は OFF より約3倍遅く、判定が甘く、検証の通過率も上がらなかった（[[prj-0001:pjr-vqb5-agent-grade-comparison]]）。thinking の有無は opencode のリクエストでも指定する |
| Temperature / Top P / Top K           | Qwen 系が thinking なしで推奨する値（0.7 / 0.8 / 20）とする。opencode の agent は用途ごとにこれを上書きする                                                                                                               |
| Min P                                 | 確率の低いトークンを候補から外し、中国語の字体や崩れた語の混入を抑える。混入を完全には防げない                                                                                                                            |
| Presence Penalty / Repetition Penalty | どちらも無効にする。presence penalty は言語の混在を増やし、repetition penalty は executor の文の書き写しや、コードで同じ字句を正当に繰り返すことを妨げる                                                                  |

#### 4.5.2. Qwen3.6

Admin UI のモデル一覧から Qwen3.6 の per-model settings を開き、次の値を入れる。

```text
Model Alias:              qwen3.6-35b-a3b
Max Context Window:       131072
Thinking:                 ON
Temperature:              0.6
Top P:                    0.95
Top K:                    20
Min P:                    0.0
Presence Penalty:         0.0
Repetition Penalty:       1.0
```

Qwen3.6 は thinking が既定であり、agentic coding の比較では維持する。サンプリング値は Qwen3.6 の公式モデルカードが precise coding tasks 向けに推奨する値を使う。モデル自体は 262,144 tokens をサポートするが、M3 Max 64GB で 2 並列を安定させる初期値として 128K に制限する。公式は thinking 能力を保つため 128K 以上を推奨している。

Model Alias は Basic Settings にある。空欄に表示される「Falls back to the model id」はプレースホルダーであり、model id（ディレクトリ名）自体は変更できない。欄に alias を入力して保存すると、`/v1/models` は alias を返し、リクエストでは alias と model id のどちらも受け付ける。

両モデルとも次の項目は既定値のままとし、画面上の既定値が次の値であることを確認する。異なる場合は次の値を入れる。

```text
Lightning MTP:            OFF
TurboQuant KV:            OFF
SpecPrefill:              OFF
DFlash:                   OFF
Qwen ANE Prefill:         OFF
```

Lightning MTP は、配布元が MoE ではまず OFF で評価することを推奨しているため OFF で始め、ON にするかは `段階的な最適化` で判断する。

#### 4.5.3. モデルの切り替え

サーバー設定の Idle Timeout を None にしているため、一度ロードしたモデルは使い終わっても外れない。Ornith（約 20.9GB）と Qwen3.6（約 20.4GB）を同時にロードすると、KV cache を含めて Memory guard の 48GB に迫る。そのため、使うモデルを切り替えるときは次の順にする。

1. 実行中のリクエストがないことを Admin UI の Concurrent requests で確認する。
2. Admin UI のモデル一覧で、使い終わったモデルをアンロードする。
3. Admin UI の Loaded model が 0 個になったことを確認してから、使うモデルへのリクエストを送る（最初のリクエストでロードされる）。

モデルを比較する計測でも、1 つのモデルの計測をすべて終えてから切り替え、同時にはロードしない。

## 5. devcontainerからの接続

サーバーの再起動後、devcontainer 内から oMLX に接続できることを確認する。

まず、devcontainer 内のシェルで、Mac ホストで設定した API key を `read -s` で読み込む。`read -s` は入力を画面に表示せず、シェルの履歴にも残さない。API key を `.zshrc` などのファイルに書かない。

```bash
read -s OMLX_API_KEY
```

モデル一覧を取得する。

```bash
curl \
  -H "Authorization: Bearer $OMLX_API_KEY" \
  http://host.docker.internal:8000/v1/models
```

`data` に、設定した 2 つの alias が含まれればよい（抜粋）。

```text
{"object":"list","data":[{"id":"ornith-1.5-35b","object":"model",...},{"id":"qwen3.6-35b-a3b","object":"model",...}]}
```

次に、chat completion をモデルごとに確認する。この確認ではサンプリングの値と出力の上限を指定せず、Admin UI のモデル設定と生成の既定値を使う。次の `model` を `ornith-1.5-35b` に変え、Ornith でも同じ確認を行う。

```bash
curl http://host.docker.internal:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OMLX_API_KEY" \
  -d '{
    "model": "qwen3.6-35b-a3b",
    "messages": [
      {
        "role": "user",
        "content": "Reply with exactly: OK"
      }
    ]
  }'
```

`choices[0].message.content` が `OK` であればよい（抜粋）。

```text
{"choices":[{"index":0,"message":{"role":"assistant","content":"OK",...},...}],...}
```

確認が終わったら、API key を破棄する。

```bash
unset OMLX_API_KEY
```

接続できない場合は、Mac ホストのターミナルで同じ手順を、接続先を `http://127.0.0.1:8000` に変えて実行する。Mac ホストで成功し devcontainer で失敗する場合は待ち受けアドレスやネットワーク、Mac ホストでも失敗する場合は oMLX の起動状態や API key を確認する。

## 6. 並列実行

2 つの opencode agent を同時に動かす場合の設定値は、`サーバー設定` と `モデル設定` に従う。

2 並列にしても、各 agent が単独時と同じ速度で動くわけではない。continuous batching により総スループットは増えるが、各リクエストのレイテンシは少し増える。単独時を 1.0 とすると、2 並列の総スループットは概ね 1.4～1.7 倍を期待できる。1 つの agent を最速で終わらせるなら単独のほうが速いが、2 件の作業を同時に終わらせる総時間は並列のほうが有利であり、SpecDojo のバックグラウンドの agent 用途と相性がよい。

3 並列・4 並列も技術的には可能である。M3 Max 64GB での実作業では、次の目安とする。

| 並列数 | 用途                       |
| ------ | -------------------------- |
| 1      | 対話作業                   |
| 2      | 推奨                       |
| 3      | バックグラウンドの一括処理 |
| 4      | スループット重視           |

普段は 2 並列とする。夜間の一括処理などで 3～4 並列を試す場合も、context は Ornith で 64K、Qwen3.6 で 128K を基準とする。並列数を増やすときは、Admin UI で総スループット、リクエストごとの TTFT、Peak memory、長い文脈での品質を確認する。prefill の遅延や一時的なメモリ使用量、memory pressure に問題が出た場合に限り、実測結果に基づいて context を下げる。

## 7. メモリ配分と監視

64GB の Mac での配分の目安は次のとおり。

```text
Ornith または Qwen3.6 + oMLX  22～32GB前後
Docker/devcontainer  8～16GB
macOS + GUI          8～12GB
余裕                 残り
```

Docker Desktop に 32GB 以上を割り当てる必要はない。SpecDojo の用途では、まず 12～16GB 程度を目安にし、memory pressure が黄色・赤にならない範囲で調整する。

Ornith-1.5 と Qwen3.6 の KV cache は、`config.json` にある次の値から fp16 で概算する。Qwen3.6 も Ornith と同じく、40 層のうち通常の attention は 10 層で、KV のヘッド数と次元数も同じである。

| 項目                        | 値        | 算定への反映                                   |
| --------------------------- | --------- | ---------------------------------------------- |
| `num_hidden_layers`         | 40        | 全レイヤー数                                   |
| `full_attention_interval`   | 4         | 通常の attention は 40 層中 10 層              |
| `num_key_value_heads`       | 2         | K/V それぞれのヘッド数                         |
| `head_dim`                  | 256       | 1 ヘッドの次元数                               |
| 1 トークンあたり            | 約 20 KB  | 10 層 × K/V × 2 ヘッド × 256 次元 × 2 byte     |
| 64K × 1 リクエスト          | 約 1.3 GB | 20,480 byte × 65,536 tokens                    |
| 64K × 2 リクエスト          | 約 2.7 GB | 64K × 1 の 2 リクエスト分                      |
| Ornith: モデル本体との合計  | 約 24 GB  | 約 20.9 GB のモデル本体 + 64K × 2 の KV cache  |
| 128K × 2 リクエスト         | 約 5.4 GB | Qwen3.6 の context で 2 リクエスト分           |
| Qwen3.6: モデル本体との合計 | 約 26 GB  | 約 20.4 GB のモデル本体 + 128K × 2 の KV cache |

この概算の対象は通常の attention 10 層の KV cache である。残りの linear attention の状態は context の長さによらず一定である。値は fp16 を仮定した概算で、oMLX 内部のバッファや一時領域などのオーバーヘッドは含まない。そのため、運用時は計算値だけでなく Admin UI の Peak memory も確認する。

監視は次で行う。

- Activity Monitor の Memory Pressure と Swap Used
- ターミナルの `memory_pressure`
- oMLX の Admin UI の Loaded model、Concurrent requests、Peak memory、Tokens/sec、TTFT

swap が継続的に大きく増える場合は、次の順で調整する。

1. context を下げる
2. 並列数を 2 に戻す
3. Hot Cache Limit を下げる
4. Docker のメモリの割り当てを見直す

## 8. 段階的な最適化

### 8.1. フェーズ1：安定性の基準

最初の数日は、`M3 Max 64GB向けの初期設定` の値（Ornith は context 64K / thinking OFF、Qwen3.6 は context 128K / thinking ON、2 並列、Lightning MTP と TurboQuant KV は OFF）のまま固定する。

この状態で、Ollama の Qwen3.8（[[tsd-ollama]]）と同じ実タスクを比べる。成功・失敗、総処理時間、tool call の失敗回数、テストの再実行回数、修正漏れ、不要な変更、最終的な diff の品質を記録する。tokens/sec だけで判断しない。比較の方法は [[tsd-omlx-opencode]] で定義する。

### 8.2. フェーズ2：Lightning MTP

安定性を確認できたら、Lightning MTP を ON にして同じタスクを再実行する。生成速度、tool call の精度、重複生成、reasoning の破綻、JSON や tool の引数の破損、テストの成功率を確認し、品質が落ちなければ ON を採用する。問題が出れば OFF に戻す。

### 8.3. フェーズ3：context の拡張

Ornith は 64K、Qwen3.6 は 128K を通常運用の基準とし、Ornith は必要な場合に 128K 以上への拡張を検討する。拡張する場合は、モデル設定の Max Context Window、生成の既定値の Global Context Window Cap、opencode の `limit.context` を合わせて上げる。

Ornith の 64K × 2 の KV cache は約 2.7GB、Qwen3.6 の 128K × 2 でも約 5.4GB のため、主な判断材料は KV cache の容量ではなく、prefill の時間、prefill 中の一時的なメモリ使用量、長い文脈での回答と tool calling の品質である。prefix cache と Chunked Prefill は prefill の負担を減らすが、長い文脈での品質低下を補う機能ではない。Admin UI の TTFT と Peak memory を確認し、同じ実タスクで修正漏れ、不要な変更、tool call の失敗率を比較して判断する。

### 8.4. TurboQuant KV Cache

Ornith の 64K × 2（約 2.7GB）、Qwen3.6 の 128K × 2（約 5.4GB）の KV cache はいずれも Memory guard に収まるため OFF のままとする。3 並列以上または context をさらに増やし、実測した Peak memory や memory pressure に余裕がない場合に試す。試す場合は 6-bit から始める。4-bit はメモリの節約効果が大きいが、coding や tool calling の用途では品質を確認してから採用する。

## 9. 参照

- <https://github.com/jundot/omlx>
- <https://github.com/TomLeeLive/jundot-omlx>
- <https://huggingface.co/mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp>
- <https://huggingface.co/mlx-works/Ornith-1.5-35B-A3B-oQ4e-mtp/raw/main/config.json>
- <https://huggingface.co/mlx-community/Qwen3.6-35B-A3B-4bit>
- <https://huggingface.co/Qwen/Qwen3.6-35B-A3B>
- <https://jacar.es/en/omlx-api-key-port-endpoints/>
- <https://jacar.es/en/how-to-install-and-tune-omlx-on-m5-max-128-gb/>
