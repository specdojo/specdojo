---
specdojo:
  id: prj-0001:xer-pjr-kv37-20261115t165135z-0d09573c
  type: exec-result
  task_id: PJR-KV37
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-KV37/pjr-kv37-20261115T165135Z-0d09573c/plan.md
  started_at: "2026-11-15T16:56:36.144Z"
  completed_at: "2026-11-15T17:43:30.515Z"
  agent: opus-executor
  approach: sample-maintenance
  targets:
    - specdojo:ifx-file-sample
  block_reason: "parent validation failed: test-integration"
---

# Edit Result

## 1. 実施内容

- ifx-file-sample における grade の指摘（F001〜F012）をすべて解消しました。
- YAML 文法エラー（コロンを含むスカラーの引用漏れ）を修正しました。
- 発注数量の単位定義、店舗コードの固定制約、および生成完了条件（最終 CSV の存在）を追記しました。
- 外部スキーマ参照の不備を解消するため、`sample` 内に「参照する正本スキーマの例と検証」という節を新設し、JSON Schema の具体例と状態定義・受入ケースを定義しました。
- 異常系リカバリの表において、未生成と転送失敗、および欠落と二重開始の条件を分離し、判断基準を明確化しました。
- ifx-index-sample との整合性をとるため、登録境界に関する説明を追加しました。
- 両方の YAML ブロックがパース可能であることを確認し、JSON Schema による検証（8 ケース）を通過しました。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-file-sample.md`: grade の指摘に基づき、YAML の構文修正、発注単位や店舗コードの制約追加、生成完了条件の明文化、正本スキーマの例と状態定義・受入ケースの追加、および異常系リカバリ手順の整理を行いました。

## 3. 申し送り

- grade run --target kata で ifx-file の rulebook と sample を grade し直し、sample が pass か確認して PJR-KV37 の対応結果に追記してください（agent CLI の起動が必要なため executor では未実施）。
- 正本スキーマは `sample` の外にファイルを新設せず、`sample` 内の節「参照する正本スキーマの例と検証」に JSON Schema 2020-12 の内容例として示しました。配置パスは店舗アプリ側の `schemas/kinuya-session.schema.json` と `schemas/kinuya-sales-record.schema.json` としました。これは `sample` 群の範囲を広げずに完成例として検証できるようにするためです。
- ifx-index-sample は CLI 内部の取引記録を外部 I/F の対象外としているため、3.2 の `based_on` から外し、CLI 仕様の入出力表から辿るという登録の境界を YAML コメントに明記しました（F011）。
- `current-tx.json` の `status` は `open` / `payment_requested` の 2 値とし、`api_sync_status` が `accepted` 以外の間は `print_status` を `not_requested` に限るようにしました。これは会計確定・取消の時点で `current-tx.json` を削除する既存の記述に合わせたものです。
- 申し送り: `clis-sample` は `kinuya-session-schema` / `kinuya-sales-record-schema` を今も「未同梱の架空参照名」としています。`ifx-file-sample` との表記をそろえるかは別の手直しで判断してください。
- grade run --target kata で ifx-file の rulebook と sample を grade し直し、sample が pass か確認して PJR-KV37 の対応結果に結果を追記する（agent CLI の起動が必要なため executor では未実施）。
- 決めた内容: 正本スキーマは sample の外にファイルを新設せず、sample 内の節「参照する正本スキーマの例と検証」に JSON Schema 2020-12 の内容例として示した。配置パスは店舗アプリ側の schemas/kinuya-session.schema.json と schemas/kinuya-sales-record.schema.json とした。sample 群の範囲を広げずに完成例として検証できるようにするため。
- 決めた内容: ifx-index-sample は CLI 内部の取引記録を外部 I/F の対象外としているので、3.2 の `based_on` から外し、CLI 仕様の入出力表から辿るという登録の境界を YAML コメントに明記した（F011）。
- 決めた内容: current-tx.json の status は open / `payment_requested` の 2 値とし、`api_sync_status` が accepted 以外の間は `print_status` を `not_requested` に限る。会計確定・取消の時点で current-tx.json を削除する既存の記述に合わせた。
- 申し送り: clis-sample は kinuya-session-schema / kinuya-sales-record-schema を今も「未同梱の架空参照名」としている。ifx-file-sample との表記をそろえるかは別の手直しで判断する。
- 人の確認が必要: `specdojo grade run --target kata`（agent CLI の起動と利用枠の消費が必要。rulebook と sample を grade し直し、sample が pass か確認する）

## 4. 進め方と実践の型の適用

外部ファイル連携の `sample` を最新の `grade` の指摘に従ってメンテナンスしました。`specdojo/standards/sample-authoring-standard.md` に基づき、構造の整合性、技術的な制約の明示、および冗長性の排除を重視して修正を行いました。
