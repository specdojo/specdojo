---
specdojo:
  id: prj-0001:pjr-gbev-exec-reporter-machine-facts
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-10-04T05:20:41Z"
  due_on: null
  completed_at: "2026-10-06T10:44:08Z"
  conclusion: reporter の事実項目（変更パス・outcome・block_reason）を runner が evidence から機械生成するようにした。その後の不具合は PJR-0ECY（件数ずれ）と PJR-979N（委譲した検証の扱い）で修正済み
---

# PJR-GBEV exec の reporter の事実項目を evidence から機械生成し、LLM は要約だけに使う

## 1. 概要

exec の reporter（LLM）は、`changed_files` のパス・outcome・`block_reason` という evidence に正確な値がある事実項目まで書き写しており、誤りや根拠のない出力の原因になっている。事実項目は runner が evidence から機械生成し、LLM の reporter は summary などの文章項目だけに使う。review の verdict など判定は executor の申告を正とする方向も検討する。grade の reporter は PJR-E9H3 で機械変換へ置き換え済み

## 2. 完了条件

- 段階1: runner が evidence（`changes`、`validations`、executor の終了コード、保護機構のメッセージ）から `changed_files` のパス、`outcome`、`block_reason` を生成し、LLM の reporter にはこれらを書かせない。reporter の出力と食い違う場合は runner の値を正とする。
- 段階1: LLM の reporter の入力と出力スキーマを、文章項目（`summary`、各 `changed_files` の説明、`handoff`、`approach`、review の `rationale` と `improvements`）だけに絞る。result の描画は機械生成の項目と組み合わせる。
- 段階2の採否を、段階1の結果を見て判断し記録する。段階2は、executor が最終応答に印付きの結果ブロックを書き runner が読み取る方式で、読み取れない場合だけ LLM の reporter が executor の最終応答から要約する。review の `verdict` は executor の申告を正とする。
- 予備の LLM reporter の候補として、`response_format`（JSON Schema）で出力の形を強制できる ornith-reporter を評価する。評価は、`buildReporterPrompt` で過去の evidence から当時の reporter の入力を再構成し、当時の gemma-reporter の出力と比べる方法とする。
- unit test で、機械生成の項目、reporter との食い違い時の扱い、blocked の場合を検証する。exec の運用ガイドとスキーマを更新する。
- `npm run check` が通る。

## 3. 作業内容

| No  | 作業                                                       | 担当 | 状態 | メモ                                                                          |
| --- | ---------------------------------------------------------- | ---- | ---- | ----------------------------------------------------------------------------- |
| 1   | 段階1: 事実項目の機械生成と reporter の出力の縮小          | DEV  | done | runner が evidence から事実を生成し、reporter schema は文章項目だけに縮小した |
| 2   | 段階2の採否の判断                                          | DEV  | done | 現時点では不採用。review の verdict は reporter に残す                        |
| 3   | 予備の LLM reporter の評価（ornith-reporter と構造化出力） | DEV  | done | mode 別の単純 schema に適合可能。既定 reporter の変更は行わない               |

### 3.1. 構造化出力についての確認（2026-10-04）

oMLX は `response_format` の JSON Schema による出力の強制に対応している。opencode の agent の frontmatter に `response_format`（`type: json_schema`）を書くとリクエストへ渡り、自由な文章を求めてもスキーマどおりの JSON だけが返った。不正な値は型のエラーになる。現在の reporter の出力スキーマは `oneOf` と `if/then/else` を使うため、強制の仕組みがこれらに対応しない場合は、`anyOf` で単純なオブジェクトを並べる形に直す必要がある。

### 3.2. 段階2と予備 reporter の判断（2026-10-04）

- 段階2は採用しない。executor の現在の印付き envelope は `final_message`・`validations`・`target_coverage` を対象とし、review の verdict を含まない。新しい判定 marker を全 executor に要求すると、marker 欠落時の fallback とモデルごとの追従性を再び扱う必要がある。段階1だけで事実の書き写し誤りは除去できるため、review の verdict と文章要約は reporter に残す。
- reporter へ渡す schema は edit / review の `oneOf` 全体ではなく、実行 mode の分岐だけを返すようにした。分岐から条件構文と機械管理項目を除いたため、`response_format` で強制する候補にも単純な object schema をそのまま使える。
- ornith-reporter は構造化出力の候補として利用可能だが、今回の変更は既定 reporter の選定を変えない。過去 evidence 約 10 件で予定していた事実項目の転記精度比較は、どの reporter も事実項目を出力しなくなったため評価指標として無効になった。過去の gemma-reporter の問題だったパス・`outcome`・`block_reason` の誤記は provider の選定ではなく runner の機械生成で解消し、残る文章品質や速度の比較は `exec trial` と人の rating で別に行える状態とした。

## 4. 対応結果

- evidence の `changes` から変更パスを、executor stage・終了コード・保護理由・親 runner 検証から `outcome` と `block_reason` を生成する `deriveReporterFacts` を追加した。executor が失敗した場合は保護機構を含む理由を evidence の `block_reason` に保存する。
- reporter の runtime / 公開 JSON Schema から変更パス・`outcome`・`block_reason` を削除した。edit reporter は evidence の変更順に説明だけを返し、件数不一致や機械管理項目の追加を拒否する。result 描画時は runner が evidence のパスと説明を結合する。
- pipeline 本体と trial の成功判定を reporter の申告から `deriveReporterFacts` へ切り替えた。executor または親 runner の検証が failed / `not_run` なら reporter の文章にかかわらず blocked になる。
- exec 運用ガイド、exec 設定ガイド、evidence / reporter schema、unit / integration fixture を新しい責務境界へ更新した。
- 段階2は上記理由で不採用とし、ornith-reporter は mode 別 object schema を強制できる予備候補として維持する。既定 reporter と review verdict の責務は変更しない。

## 5. 関連ドキュメント

- [[prj-0001:pjr-e9h3-grade-deterministic-reporter]]: grade の reporter を executor の marker の機械変換に置き換えた先行事例。
- [[prj-0001:pjr-vqb5-agent-grade-comparison]]: reporter の書き写しの誤り、JSON の構文破損、根拠のない JSON の生成の観測。
- [[prj-0001:pjr-ankr-grade-executor-reporter]]: executor と reporter を分けた経緯。
