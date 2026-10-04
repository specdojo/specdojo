---
specdojo:
  id: prj-0001:pjr-4rr8-ollama-sampling-recommended-params
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T02:28:38Z"
  due_on: null
  completed_at: "2026-10-04T08:28:53Z"
  conclusion: 推奨サンプリングは qwen で速くならず形式が崩れ、gemma は良否を区別できず形式も崩れたため採用しない。grade の用途には現行の低い温度が合う。計測用の agent と登録は削除した
---

# PJR-4RR8 qwen と gemma のサンプリングを公式推奨値へ合わせて grade の executor の改善を計測する

## 1. 概要

qwen と gemma の expert executor は temperature 0.2、Modelfile は top_p 0.9・repeat_penalty 1.05 で、公式推奨（Qwen の thinking・コーディング向け: temperature 0.6 / top_p 0.95 / top_k 20 / repeat_penalty 1.0、Gemma: temperature 1.0 / top_p 0.95 / top_k 64）から大きく外れている。Qwen は thinking で貪欲に近いデコードを避けるよう明記しており、qwen の executor が最大 1,952 秒かかった一因の可能性がある。gemma が良否を区別できない（3 件とも 100）ことや、repeat_penalty による書き写しの崩れにも関係しうる。推奨値の派生モデルを作り、同じ条件で計測して採否を決める

## 2. 完了条件

- qwen と gemma の推奨値の派生モデル（`qwen3.8:27b-mlx-agent-64k`、`gemma4:31b-mlx-agent-64k`）を Host Mac に作成し、Modelfile の内容を記録している。
- 各 expert executor で、同じ3文書（`trc-requirements-to-tests-rulebook`、`imp-business-rulebook`、`stsd-mermaid-rulebook`）を各2回、現行値と推奨値で評価し、検証通過率・score・finding・所要時間を比較した結果を [[prj-0001:pjr-vqb5-agent-grade-comparison]] に記録している。
- 計測の plan は、前回の指摘を空にし、評価対象と参考資料の本文を埋め込んだもの（[[prj-0001:pjr-26k4-grade-plan-embed-documents]] の方式）とし、GradeSubmission は executor の marker から機械的に生成する（[[prj-0001:pjr-e9h3-grade-deterministic-reporter]] の方式）。
- 結果から採否を決め、採用する場合は `.opencode/agents/` の各 agent の `model` と `temperature`、および [[tsd-ollama]] の Modelfile と派生モデルの定義を更新している。採用しない場合はその理由を記録している。
- 計測に用いた推奨値の出典（モデルカード等）を記録し、`qwen3.8` と `gemma4` の各モデルカードで推奨値を確認している。

## 3. 作業内容

| No  | 作業                                     | 担当 | 状態 | メモ                                          |
| --- | ---------------------------------------- | ---- | ---- | --------------------------------------------- |
| 1   | 推奨値の派生モデルを Host Mac に作成する | DEV  | open | 「派生モデルの作成」                          |
| 2   | 計測用の agent を用意する                | DEV  | open | 「計測用の agent」。既存の agent は変更しない |
| 3   | 現行値と推奨値で計測する                 | DEV  | open | 「計測」。ornith の計測と同時に動かさない     |
| 4   | 比較結果の記録と採否の判断               | DEV  | open | 採用時は agent と [[tsd-ollama]] を更新する   |

### 3.1. 作業用のコマンド

#### 3.1.1. 派生モデルの作成

Host Mac で推奨値の派生モデルを作成する。既存の `*-work-64k` は残す。

```bash
cd ~/ollama-modelfiles
mkdir -p qwen3.8-27b-mlx-agent-64k gemma4-31b-mlx-agent-64k

cat > qwen3.8-27b-mlx-agent-64k/Modelfile <<'MODELFILE'
FROM qwen3.8:27b-mlx
PARAMETER num_ctx 65536
PARAMETER temperature 0.6
PARAMETER top_p 0.95
PARAMETER top_k 20
PARAMETER min_p 0
PARAMETER presence_penalty 0
PARAMETER repeat_penalty 1.0
MODELFILE

cat > gemma4-31b-mlx-agent-64k/Modelfile <<'MODELFILE'
FROM gemma4:31b-mlx
PARAMETER num_ctx 65536
PARAMETER temperature 1.0
PARAMETER top_p 0.95
PARAMETER top_k 64
PARAMETER min_p 0
PARAMETER repeat_penalty 1.0
MODELFILE

ollama create qwen3.8:27b-mlx-agent-64k -f qwen3.8-27b-mlx-agent-64k/Modelfile
ollama create gemma4:31b-mlx-agent-64k -f gemma4-31b-mlx-agent-64k/Modelfile
ollama show qwen3.8:27b-mlx-agent-64k --parameters
ollama show gemma4:31b-mlx-agent-64k --parameters
```

#### 3.1.2. 計測用の agent

devcontainer で、計測用の agent を既存の expert executor から複製する。opencode は agent の `temperature` をリクエストで送り Modelfile の値を上書きするため、agent 側も推奨値にする。`opencode.json` の `ollama-local` の `models` に新しいモデル名を追加する。

```bash
cd /workspaces/specdojo-workspace/specdojo
sed -e 's|qwen3.8:27b-mlx-work-64k|qwen3.8:27b-mlx-agent-64k|' -e 's|^temperature: 0.2$|temperature: 0.6|' \
  .opencode/agents/qwen-expert-executor.md > .opencode/agents/qwen-agent-expert-executor.md
sed -e 's|gemma4:31b-mlx-work-64k|gemma4:31b-mlx-agent-64k|' -e 's|^temperature: 0.2$|temperature: 1.0|' \
  .opencode/agents/gemma-expert-executor.md > .opencode/agents/gemma-agent-expert-executor.md
```

`pm-members.yaml` に `qwen-agent-expert-executor` と `gemma-agent-expert-executor` を `priority: 4`（自動選択の対象外）で追加する。計測後、採用しない場合は agent と member を削除する。

#### 3.1.3. 計測

plan は `grade plan` で作成し、「前回の指摘」を空にして評価対象と参考資料の本文を行番号付きで埋め込む。executor の出力から GradeSubmission を機械的に生成し、`grade apply --dry-run` で検証する。2026-10-04 の ornith の計測で用いた手順（[[prj-0001:pjr-vqb5-agent-grade-comparison]] の「ornith の executor の改善（2026-10-04）」）と同じとする。

```bash
npx tsx src/specdojo.ts grade plan --target kata --project prj-0001 \
  --path docs/ja/specdojo/rulebooks/imp-business-rulebook.md --out logs/<work-dir>/plans/imp-business-rulebook
npx tsx src/specdojo.ts agent run --project prj-0001 --plan <embedded-plan> \
  --by qwen-agent-expert-executor --out logs/<work-dir>/runs/<run>/executor-output.txt
npx tsx src/specdojo.ts grade apply --target kata --project prj-0001 \
  --path docs/ja/specdojo/rulebooks/imp-business-rulebook.md \
  --analysis-from logs/<work-dir>/runs/<run>/executor-output.txt \
  --from logs/<work-dir>/runs/<run>/grade-submission.json --by qwen-agent-expert-executor --dry-run
```

2026-10-04 の計測に使った補助スクリプト（前回の指摘の除去と本文の埋め込み、marker からの GradeSubmission 生成、実行の繰り返し）は Git 管理外の `logs/agent-compare-20261003/` にある（`to-submission.ts`、`run-ornith5.sh` など）。devcontainer を作り直すと消えるため、[[prj-0001:pjr-e9h3-grade-deterministic-reporter]] と [[prj-0001:pjr-26k4-grade-plan-embed-documents]] が先に実装されていれば、そちらの CLI を使う。

計測中は Ollama のモデルを1つずつ動かし、終わったら外す。oMLX の Ornith と同時に動かさない。

```bash
curl -s http://host.docker.internal:11434/api/generate -d '{"model":"qwen3.8:27b-mlx-agent-64k","keep_alive":0}'
```

## 4. 対応結果

Host Mac に推奨値の派生モデル（`qwen3.8:27b-mlx-agent-64k`、`gemma4:31b-mlx-agent-64k`）を作成し、計測用の agent で見込みを先に確かめた（各文書1回）。推奨値の出典は Ollama 公式ライブラリの各モデルの既定値でも確認した（qwen3.8: temperature 1.0 / top_p 0.95 / top_k 20 / min_p 0 / presence_penalty 0 / repeat_penalty 1.0、gemma4: temperature 1.0 / top_p 0.95 / top_k 64）。

結果は [[prj-0001:pjr-vqb5-agent-grade-comparison]] の「qwen と gemma の推奨サンプリング（2026-10-04）」に記録した。qwen は速くならず検証通過 1/3、gemma は良否を区別できず検証通過 2/3 で、改善の兆しがなかった。

採用しない。grade の用途では、温度を上げると marker の形式が崩れやすく、現行の低い温度（qwen・gemma とも 0.2）が合う。[[tsd-ollama]] の Modelfile は変更しない。計測用の agent・モデルの登録・member は削除した（コミット ac232e341）。Host Mac の派生モデルは `ollama rm` で削除してよい。

## 5. 関連ドキュメント

- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: 2026-10-03〜04 の比較。qwen の executor が 707〜1,952 秒、gemma が3件とも 100 だった記録。
- [[tsd-ollama]]: 現行の Modelfile（temperature 0.2、top_p 0.9、repeat_penalty 1.05）。
- 出典: <https://docs.api.nvidia.com/nim/reference/qwen-qwen3-235b-a22b>（Qwen3 の thinking の推奨値と貪欲デコードの注意）
- 出典: <https://gitserver.onethingai.com/ai-models/Qwen3.6-35B-A3B/commit/a005c49d476ed5a283c9ec0d2a6b524723f4d925>（Qwen3.6 の用途別の推奨値）
- 出典: <https://glukhov.org/fr/llm-performance/benchmarks/agentic-inference-parameters-reference/>（Qwen と Gemma 4 の agentic 用途の推奨値。高い温度で JSON が壊れやすいという注意も含む）
