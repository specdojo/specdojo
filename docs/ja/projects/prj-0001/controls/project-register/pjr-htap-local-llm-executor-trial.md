---
specdojo:
  id: prj-0001:pjr-htap-local-llm-executor-trial
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: note
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T06:26:31Z"
---

# PJR-HTAP ローカル LLM の executor の試行の結果（WJE6、2026-10-18）

## 1. メモ

同じ todo（WJE6、ガイドへの節の追加）を、Ollama の gemma26（64k・128k）・gemma4 31B（thinking off・on）・qwen3.8 27B（thinking off・on）と agy で exec trial にかけた。gemma26 はツールの失敗から立て直せず止まり、thinking を on にすると遅くなるだけで中身は良くならなかった

## 2. 背景・文脈

PJR-Y8P9 で agent の定義を見直した後も、opencode で使うローカル LLM（Ollama・oMLX）の整理が残っていた。どのモデルをどの役割に使えるかを決める根拠として、同じ todo を `exec trial` で比べた（PJR-VQB5 は grade での比較）。

比べた todo は PJR-WJE6（ブランチ運用ガイドにプロダクトリポジトリの節を足す）である。reporter はすべて gemma26-reporter とした。最初の試行の plan は登録簿の一覧（約 479KB）を読ませていたため、2 回目以降は一覧の行を消した plan（`tmp/trial/pjr-wje6-trial-plan-noindex.md`）を使った。

| comparison             | agent                 | モデル・thinking            | 結果     | executor の時間 | 中身                                                                                            |
| ---------------------- | --------------------- | --------------------------- | -------- | --------------- | ----------------------------------------------------------------------------------------------- |
| `wje6-local-llm`       | gemma26-executor      | gemma4 26B MoE（64k）・off  | 変更なし | 約 8 分         | 一覧を分けて読むうちに止まった                                                                  |
| `wje6-local-llm`       | qwen-executor         | qwen3.8 27B・off            | 完走     | 約 34 分        | 正確。本文に登録簿の ID が入った                                                                |
| `wje6-local-llm`       | agy-expert-executor   | クラウド                    | 完走     | 約 4 分         | 詳しいが冗長。章を番号で参照した                                                                |
| `wje6-gemma26-noindex` | gemma26-executor      | gemma4 26B MoE（64k）・off  | 変更なし | 約 45 秒        | パスを推測して読み込みに失敗し、止まった                                                        |
| `wje6-gemma26-noindex` | gemma26-128k-executor | gemma4 26B MoE（128k）・off | 変更なし | 約 50 秒        | 同上。文脈の大きさは関係しなかった                                                              |
| `wje6-gemma31`         | gemma-expert-executor | gemma4 31B・on              | 完走     | 約 10 分        | 失敗から glob で立て直した。薄く、個票を更新しない                                              |
| `wje6-gemma31`         | gemma-executor        | gemma4 31B・off             | 完走     | 約 5 分         | 構成は正確で個票も更新。設定ファイル名と rebase merge の SHA を誤り、決定にない「推奨」を書いた |
| `wje6-qwen-think`      | qwen-executor         | qwen3.8 27B・off            | 完走     | 約 11 分        | 最も正確で厚い。日本語の崩れ、章の番号の参照、配布するガイドからの登録簿の参照が残った          |
| `wje6-qwen-think`      | qwen-expert-executor  | qwen3.8 27B・on             | 完走     | 約 50 分        | 正確で厚いが、章を差し込んで後ろの番号をすべて付け直した                                        |

参照時の注意:

- 親の検証は完走したものすべてで通った。中身の評価は orchestrator が完了条件と突き合わせたものである。
- 最初の qwen-executor の 34 分は、一覧を読ませる plan と、他の試行とのモデルの入れ替えを含む。同じ条件では約 11 分だった。
- gemma26 は、続きを促すと作業を進めたが、章の構成を壊し、事実を誤った。
- Ollama は `reasoning_effort: none` を守る（直接の呼び出しで thinking の出力が 0 になることを確かめた）。
- opencode の bash の許可は、パイプや `||` でつないだコマンドに当たらず、拒否される。

## 3. フォローアップ

- ローカル LLM の整理の方針は PJR-0ZAS で決める。
- plan が一覧を読ませる不具合は PJR-SJ0G で直す。
- plan の wikilink に実際のパスを添えると、弱いモデルがパスを推測して失敗するのを防げる。必要になったら起票する。

## 4. 関連ドキュメント

- [[prj-0001:pjr-wje6-product-repo-branch-guide]]（試行の対象）
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]（grade での比較）
- [[prj-0001:pjr-0zas-local-llm-consolidation]]（この結果に基づく決定）
- [[prj-0001:pjr-sj0g-register-plan-index-input]]（試行で見つけた不具合）
