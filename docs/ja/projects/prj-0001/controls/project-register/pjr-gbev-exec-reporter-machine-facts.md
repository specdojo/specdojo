---
specdojo:
  id: prj-0001:pjr-gbev-exec-reporter-machine-facts
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T05:20:41Z"
  due_on: null
---

# PJR-GBEV exec の reporter の事実項目を evidence から機械生成し、LLM は要約だけに使う

## 1. 概要

exec の reporter（LLM）は、changed_files のパス・outcome・block_reason という evidence に正確な値がある事実項目まで書き写しており、誤りや根拠のない出力の原因になっている。事実項目は runner が evidence から機械生成し、LLM の reporter は summary などの文章項目だけに使う。review の verdict など判定は executor の申告を正とする方向も検討する。grade の reporter は PJR-E9H3 で機械変換へ置き換え済み

## 2. 完了条件

- 段階1: runner が evidence（`changes`、`validations`、executor の終了コード、保護機構のメッセージ）から `changed_files` のパス、`outcome`、`block_reason` を生成し、LLM の reporter にはこれらを書かせない。reporter の出力と食い違う場合は runner の値を正とする。
- 段階1: LLM の reporter の入力と出力スキーマを、文章項目（`summary`、各 `changed_files` の説明、`handoff`、`approach`、review の `rationale` と `improvements`）だけに絞る。result の描画は機械生成の項目と組み合わせる。
- 段階2の採否を、段階1の結果を見て判断し記録する。段階2は、executor が最終応答に印付きの結果ブロックを書き runner が読み取る方式で、読み取れない場合だけ LLM の reporter が executor の最終応答から要約する。review の `verdict` は executor の申告を正とする。
- 予備の LLM reporter の候補として、`response_format`（JSON Schema）で出力の形を強制できる ornith-reporter を評価する。評価は、`buildReporterPrompt` で過去の evidence から当時の reporter の入力を再構成し、当時の gemma-reporter の出力と比べる方法とする。
- unit test で、機械生成の項目、reporter との食い違い時の扱い、blocked の場合を検証する。exec の運用ガイドとスキーマを更新する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                       | 担当 | 状態 | メモ                                                                              |
| --- | ---------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------------------- |
| 1   | 段階1: 事実項目の機械生成と reporter の出力の縮小          | DEV  | open | `src/exec-reporter.ts`、`src/exec-results.ts`、`exec-reporter-output.schema.yaml` |
| 2   | 段階2の採否の判断                                          | DEV  | open | executor が印を守れるかはモデルで差がある（ornith は grade で苦労した）           |
| 3   | 予備の LLM reporter の評価（ornith-reporter と構造化出力） | DEV  | open | 過去の evidence 10 件程度で gemma-reporter と比べる                               |

### 3.1. 構造化出力についての確認（2026-10-04）

oMLX は `response_format` の JSON Schema による出力の強制に対応している。opencode の agent の frontmatter に `response_format`（`type: json_schema`）を書くとリクエストへ渡り、自由な文章を求めてもスキーマどおりの JSON だけが返った。不正な値は型のエラーになる。現在の reporter の出力スキーマは `oneOf` と `if/then/else` を使うため、強制の仕組みがこれらに対応しない場合は、`anyOf` で単純なオブジェクトを並べる形に直す必要がある。

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-e9h3-grade-deterministic-reporter]]: grade の reporter を executor の marker の機械変換に置き換えた先行事例。
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: reporter の書き写しの誤り、JSON の構文破損、根拠のない JSON の生成の観測。
- [[prj-0001:pjr-ankr-grade-executor-reporter]]: executor と reporter を分けた経緯。
