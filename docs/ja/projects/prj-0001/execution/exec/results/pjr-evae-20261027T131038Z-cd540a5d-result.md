---
specdojo:
  id: prj-0001:xer-pjr-evae-20261027t131038z-cd540a5d
  type: exec-result
  task_id: PJR-EVAE
  mode: edit
  status: blocked
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-evae-20261027T131038Z-cd540a5d-plan.md
  started_at: "2026-10-27T13:10:41.025Z"
  completed_at: "2026-10-27T13:43:01.355Z"
  agent: flash-high-executor
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
  block_reason: "parent validation failed: test-unit"
---

# Edit Result

## 1. 実施内容

- tsd-sample を新しい `tsd-rulebook` および `sample-authoring-standard` に合わせて見直し、PostgreSQL と Prisma のデータベース詳細定義として再構成しました。
- Frontmatter の `type` を `architecture` に変更し、`part_of` に `specdojo:tsd-index-sample` を設定しました。
- rulebook の要件に基づき、採用技術の設定、動作確認の手順（確認対象・実行場所・期待結果・失敗時の確認先）、および技術的制約やトラブルシューティングのセクションを追加しました。
- MD031 lint エラーの解消および Prettier によるフォーマット適用を行い、`CHANGELOG.md` の更新も完了しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 未公開の版の節に、`tsd-sample` の見直しに関する変更内容を追記しました。
- `docs/ja/specdojo/samples/tsd-sample.md`: 技術スタックの一覧形式から、`tsd-rulebook` の構成に従った技術領域の詳細定義（概要、前提条件、採用設定、動作確認、制約・トラブルシューティング）へと全面的に書き換えました。題材は PostgreSQL と Prisma を使用しています。

## 3. 申し送り

- finding F017 では ID の `tsd-&lt;term&gt;` 形式への変更が指摘されていましたが、個票完了条件 3（`id` は変えない）に従い `specdojo:tsd-sample` を維持しています。
- `tsd-index-sample.md` との記述に齟齬はありません（題材の PostgreSQL / Prisma、関連記述と完全に整合しています）。
- finding F017 では ID の tsd-&lt;term&gt; 形式への変更が指摘されていましたが、個票完了条件 3（id は変えない）に従い specdojo:tsd-sample を維持しています。
- tsd-index-sample.md との記述に齟齬はありません（題材の PostgreSQL / Prisma、関連記述と完全に整合しています）。
- 適用外の検証: `specdojo register build`（pjr-index.md was not changed）
- 適用外の検証: `specdojo exec refresh`（`sch-*.yaml` was not changed）

## 4. 進め方と実践の型の適用

既存の `tsd-sample.md` を読み込み、`finding` で指摘された構造的・内容的な不備を `tsd-rulebook` および `sample-authoring-standard` に基づいて解消しました。具体的には、インデックス形式から詳細定義形式への変換、動作確認手順の追加、技術的制約の明示、および frontmatter の修正を行いました。
