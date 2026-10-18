---
specdojo:
  id: prj-0001:pjr-0zas-local-llm-consolidation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-18T06:26:51Z"
---

# PJR-0ZAS ローカル LLM を Ollama と gemma・qwen の役割の分担に整理する

## 1. 背景

ローカル LLM の基盤を Ollama にし、reporter は gemma26、小さな修正の executor は作業の種類で gemma-executor（31B）と qwen-executor を使い分ける。thinking on の executor、gemma26 の executor、使っていない定義は無効にする

## 2. 検討した選択肢

| 選択肢 | 内容                                                                                                                                                             | 利点                                                                                | 懸念                                                                                                 |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| A      | 今のまま（Ollama と oMLX、gemma・qwen・ornith の executor と reporter を並べておく）                                                                             | 変更が要らない                                                                      | 使えない定義が残り、選び間違える。試行で止まると分かった gemma26 の executor も選べてしまう          |
| B      | ローカル LLM を reporter だけに使い、executor はクラウドの agent に限る                                                                                          | 品質の不安がなくなる                                                                | 31B と qwen が小さな修正を完走できることが分かったのに使わない。クラウドの上限のときの予備がなくなる |
| C      | 基盤を Ollama にし、reporter は gemma26、小さな修正の executor は作業の種類で gemma 31B と qwen を使い分ける。thinking on の executor と使えない定義は無効にする | 試行で確かめた組み合わせだけが残る。速い gemma と正確な qwen を作業に合わせて選べる | 使い分けの判断が要る。ローカル LLM の結果は必ずレビューが要る                                        |

## 3. 決定内容

C を採る（2026-10-18、利用者が承認）。

1. ローカル LLM の基盤は Ollama とする。oMLX を使う定義（ornith・qwen36）は無効にする。
2. reporter・要約・翻訳は gemma26-reporter（gemma4 26B MoE）を使う。
3. 小さな修正の executor は、作業の種類で使い分ける。
   - 何をどう変えるかが plan で決まっている作業（表記の統一、値の置き換え、指摘への対応）は `gemma-executor`（gemma4 31B、thinking off）。
   - 関連する文書を読んで内容を組み立てる作業は `qwen-executor`（qwen3.8 27B、thinking off）。時間がかかるため、急がない作業に回す。
4. どちらを使っても、結果は orchestrator（または review の agent）がレビューしてから close する。
5. thinking on の executor（`gemma-expert-executor`・`qwen-expert-executor`）、`gemma26-executor`・`gemma26-128k-executor`、その他の使っていないローカル LLM の定義は無効にする。
6. 名簿の実際の変更は、0.4.0 の 2 段構成への移行（PJR-8MPY）の中で行う。この決定では方針だけを決める。

## 4. 採択理由

- gemma26 は、ツールが失敗すると立て直さずに止まり、plan を直しても文脈を 128k にしても executor として使えなかった（[[prj-0001:pjr-htap-local-llm-executor-trial]]）。
- gemma4 31B と qwen3.8 27B は同じ todo を完走し、親の検証も通った。gemma は約 5 分で速いが事実を誤ることがあり、qwen は約 11 分かかるが最も正確だった。
- thinking を on にすると、gemma は約 2 倍、qwen は約 4.5 倍遅くなり、中身は良くならなかった。
- 使えない定義を無効にすれば、名前で選ぶときに選び間違えない。

## 5. 承認

| 項目     | 内容                                                                        |
| -------- | --------------------------------------------------------------------------- |
| 決定者   | 利用者（PO）                                                                |
| 決定日   | 2026-10-18                                                                  |
| 承認方式 | orchestrator との会話で、提案した整理の案を「推奨でお願いします」として承認 |
| 証跡     | orchestrator との会話（2026-10-18）                                         |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| 影響範囲   | `.specdojo/agent-members.yaml`、`.opencode/agents/`、`opencode.json`、ローカル LLM を使う Job の reporter の指定 |
| 必要な対応 | 0.4.0 の名簿の 2 段構成への移行で、無効にする定義と残す定義を反映する                                            |
| 追跡先     | PJR-8MPY（本リポジトリの名簿の移行）                                                                             |

## 7. 関連ドキュメント

- [[prj-0001:pjr-htap-local-llm-executor-trial]]（試行の結果）
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]（grade での比較）
- [[prj-0001:pjr-zm1k-agent-members-model-alias]]（名簿の 2 段構成）
