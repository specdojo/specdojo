---
specdojo:
  id: prj-0001:pjr-wjpx-gemma4-26b-moe-evaluation
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T10:00:13Z"
  due_on: null
  completed_at: "2026-10-04T12:45:39Z"
  conclusion: gemma4 26B は 31B の約3倍速く日本語に中国語の字体が混ざらないが、判定は甘く参考資料・128K・判定例でも改善しないため、grade の executor には採用せず reporter の要約に使う。gemma26-reporter を追加し tsd-ollama を更新した
---

# PJR-WJPX gemma4 26B（MoE）を導入し、速度・日本語・判定を計測して使い道を決める

## 1. 概要

Ornith-1.5（Qwen 系 MoE）は速いが、日本語に中国語の字体が混ざる（2026-10-04 の計測で 6 回中 3〜4 回）。gemma4 31B（dense）は同じ計測で 0 回だった。gemma4 26B-A4B は全 25.2B・動作 3.8B の MoE で Ornith と同程度の速さが見込め、日本語の質は 31B に近いと期待できる。Ollama の gemma4:26b-mlx（18GB）を導入し、grade の executor としての速さ・形式・中国語の字体・判定を計測して使い道を決める。sliding window 主体で長い context に強いため、参考資料付きの評価で 128K の効果も確かめる

## 2. 完了条件

- Host Mac に `gemma4:26b-mlx` と派生モデル（64K: `gemma4:26b-mlx-work-64k`、128K: `gemma4:26b-mlx-work-128k`）を作成し、Modelfile を記録している。
- 計測用の agent（例: `gemma26-expert-executor`）を priority 4 で追加し、[[prj-0001:pjr-vqb5-agent-grade-comparison]] の「ornith の executor の改善（2026-10-04）」と同じ方法（本文埋め込みの plan、3文書×2回、marker からの機械変換）で、64K の派生モデルを計測している。比較対象は gemma4 31B と Ornith とし、所要時間、検証通過率、中国語の字体の混入、score と finding を記録する。
- 参考資料（リファレンス）を付けた評価で、64K と 128K の判定と所要時間・メモリ（Admin UI ではなく Ollama の `ollama ps` 等）を比べ、長い context が精度に効くかを記録している。
- 結果から使い道（reporter、日本語の文書の下書き・編集、軽作業、grade の一次評価など）を決め、採用する場合は [[tsd-ollama]] のモデルの選定と派生モデルの定義、`opencode.json`、agent、`pm-members.yaml` を更新している。採用しない場合は、計測用の agent と登録を削除している。

## 3. 作業内容

| No  | 作業                                    | 担当 | 状態 | メモ                                                            |
| --- | --------------------------------------- | ---- | ---- | --------------------------------------------------------------- |
| 1   | Host Mac でモデルと派生モデルを作成する | DEV  | open | 「Host Mac の作業」                                             |
| 2   | 計測用の agent と登録                   | DEV  | open | qwen・gemma の expert executor と同じ本文で、モデルだけを変える |
| 3   | 64K での grade の計測                   | DEV  | open | gemma4 31B・Ornith と比べる                                     |
| 4   | 参考資料付きで 64K と 128K を比べる     | DEV  | open | 長い context が精度に効くか                                     |
| 5   | 使い道の決定と、文書・設定の更新        | DEV  | open | -                                                               |

### 3.1. Host Mac の作業

```bash
ollama pull gemma4:26b-mlx

cd ~/ollama-modelfiles
mkdir -p gemma4-26b-mlx-work-64k gemma4-26b-mlx-work-128k

cat > gemma4-26b-mlx-work-64k/Modelfile <<'MODELFILE'
FROM gemma4:26b-mlx
PARAMETER num_ctx 65536
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.0
MODELFILE

cat > gemma4-26b-mlx-work-128k/Modelfile <<'MODELFILE'
FROM gemma4:26b-mlx
PARAMETER num_ctx 131072
PARAMETER temperature 0.2
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.0
MODELFILE

ollama create gemma4:26b-mlx-work-64k -f gemma4-26b-mlx-work-64k/Modelfile
ollama create gemma4:26b-mlx-work-128k -f gemma4-26b-mlx-work-128k/Modelfile
ollama show gemma4:26b-mlx-work-64k --parameters
```

temperature と top_p は、[[prj-0001:pjr-4rr8-ollama-sampling-recommended-params]] で grade には低い温度が合うと分かった現行の gemma4 31B にそろえる。repeat_penalty は、executor の文の書き写しを妨げないよう 1.0 とする。モデルの重み（約 18GB）は Ornith（約 24GB）と同時に載せても Memory guard に収まる見込みだが、計測中は Ornith を使う作業と重ねない。

## 4. 対応結果

Host Mac に `gemma4:26b-mlx` と 64K・128K の派生モデルを作成し、計測用の executor で grade を計測した。結果は [[prj-0001:pjr-vqb5-agent-grade-comparison]] の「gemma4 26B（MoE）（2026-10-04）」に記録した。

- 速さと日本語: gemma4 31B の約3倍速く（1件 2〜3 分）、すべての実行で中国語の字体が混ざらなかった。
- 判定: 31B と同じく良否を区別できず、参考資料付き・128K・判定の規則と例と「問題を先に挙げる」手順のいずれでも厳しくならなかった。grade の executor には採用しない。
- context: 入力が 64K に収まる範囲では、128K にしても精度・時間・メモリに差がなかった。128K の派生モデルは使わない（Host Mac の `gemma4:26b-mlx-work-128k` は削除してよい）。

使い道は、判定を伴わない reporter の文章要約とした。`gemma26-reporter` を priority 4 で追加し、gemma-reporter としばらく併用して実際の exec で様子を見る。[[tsd-ollama]] に用途と派生モデル（`gemma4:26b-mlx-work-64k`）の定義を追加した。計測用の executor と 128K モデルの登録は外した（コミット c512cee6d）。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: Ornith と gemma4 31B の計測（中国語の字体の混入、判定の甘さ、形式の安定性）。
- [[prj-0001:pjr-4rr8-ollama-sampling-recommended-params]]: grade には低い温度が合うという結果。
- [[prj-0001:pjr-86je-docs-lint-chinese-glyphs]]: 中国語の字体を検出する lint（日本語の文書に使う場合の安全網）。
- [[tsd-ollama]]
- 出典: <https://ollama.com/library/gemma4/tags>（`gemma4:26b-mlx` 18GB、256K context、MoE の a4b）
- 出典: <https://www.verdent.ai/guides/model/gemma-4>（26B-A4B: 全 25.2B・動作 3.8B、sliding window 1024）
