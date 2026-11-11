---
specdojo:
  id: prj-0001:xer-t-glossary-gl-planning-010-20261111t165324z-31fa2135
  type: exec-result
  task_id: T-GLOSSARY-gl-planning-010
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-GLOSSARY-gl-planning-010/T-GLOSSARY-gl-planning-010-20261111T165324Z-31fa2135/plan.md
  started_at: "2026-11-11T16:53:25.437Z"
  completed_at: "2026-11-11T17:08:18.932Z"
  agent: sol-executor
  execution: agent
  approach: retrofit
  targets:
    - gl-planning
---

# Edit Result

## 1. 実施内容

- 計画領域の主要用語を定義する用語集 `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml` を新設した。
- 実装エビデンスとして 4 つのスキーマ（`dct.schema.yaml`, `sch-strategy.schema.yaml`, `sch-track.schema.yaml`, `sch-milestones.schema.yaml`）を調査し、20 用語の定義・別名・分類・関連語・出典を記載した。
- 共通用語集 `gl-common.yaml` やプロジェクト概要と整合させ、カタログの完了条件を満たす内容を構成した。
- 整形およびスキーマ検証を実施し、適合を確認済みである。

## 2. 変更ファイル

- `docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml`: 計画領域の用語集を新規作成し、戦略・トラック・マイルストーンなどの用語定義を実装スキーマに基づき記載した。

## 3. 申し送り

- 判断は「新設」。対象が存在せず、カタログに配置先と完了条件が定義されていたため、`docs/ja/product/010-business-specs/060-glossary/gl-planning.yaml` を作成した。`status` は draft。result・実装エビデンス・設定は編集していない。
- 参照済み実装① `docs/specdojo/schemas/v1/dct.schema.yaml`：ドメインと階層グループ、成果物論理名、work/control/generated、成果物間依存、読み取り専用の `evidence_refs` を確認。work に配置先・完了条件を要求する関係を、成果物種別の補足へ反映した。
- 参照済み実装② `docs/specdojo/schemas/v1/sch-strategy.schema.yaml`：対象範囲、intent ごとの追加項目、段と段の組、主担当割当、周回と個別反復、同期ゲート、横断作業、開始前の完了範囲、agent 実行と pipeline の関係を確認。用語間の関係を短く記載し、詳細条件は schema を正本として参照した。
- 参照済み実装③ `docs/specdojo/schemas/v1/sch-track.schema.yaml`：トラック別計画が期間を持つタスクとマイルストーンを扱う構造を確認。④ `docs/specdojo/schemas/v1/sch-milestones.schema.yaml`：プロジェクト全体のマイルストーン計画を確認。トラックと節目の定義へ反映した。
- 一致・反映：`gl-common.yaml`、カタログの完了条件、プロジェクト概要、Schedule/DCT rulebook と照合。共通のカタログ・戦略・Schedule・タスクを再定義せず参照し、`gl-execution.yaml` の実行段・状態・役割とも区別した。人間の承認判断と計画上の節目を分けた。
- 未反映の乖離：`docs/ja/specdojo/guides/schedule-design-guide.md` の1.1.1の表には、Schedule がタスク実行状態を持つ記述が残る。共通用語集と決定記録 `prj-0001:pjr-bb92-cdfd-overview-propagation` に従い、成果物では実行記録を状態の正本とした。後続の文書修正候補として当該ガイドの訂正を申し送る。
- 記法判断：gl-rulebook のファイル名規則は locale 接尾辞を求めるが、本タスクとカタログが指定する `gl-planning.yaml` を優先した。用語ID・同一用語集内の分類と関連参照・ルート構造には同 rulebook を適用した。
- 確認限界：列挙された4スキーマはすべて読了。参照先の `sch-common.schema.yaml`・`exec-common.schema.yaml` の定義本体、生成器の実行分岐、CLI 引数の実動作は今回の実装調査範囲外。approach の導出や依存の運用上の意味は設計文書で確認したが、列挙スキーマだけでは実動作を確認できない。未作成の登録簿・品質・導入設定用語集との将来的な重複は後続レビューで確認する。
- 親 runner 管理の lint・全体スキーマ検証・型検査・単体/統合テストは重複実行していない。reporter は本申し送りの照合結果・判断根拠・未確認範囲を result に反映すること。
- 適用外の検証: `npm run validate:catalog`（executor の変更は product 配下の用語集のみで、docs/ja/projects/ 配下の成果物を変更していない。）
- 適用外の検証: `npm run validate:history-links`（履歴蓄積ファイル・plan・result を変更していない。）

## 4. 進め方と実践の型の適用

retrofit
