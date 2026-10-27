---
specdojo:
  id: prj-0001:xer-pjr-evae-20261027t131038z-cd540a5d
  type: exec-result
  task_id: PJR-EVAE
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-evae-20261027T131038Z-cd540a5d-plan.md
  started_at: "2026-10-27T13:10:41.025Z"
  completed_at: "2026-10-27T13:48:35.303Z"
  agent: flash-high-executor
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
---

# Edit Result

## 1. 実施内容

- tsd-sample を新しい `tsd-rulebook` および `sample-authoring-standard` に合わせて、PostgreSQL と Prisma のデータベース詳細定義として再構成しました。
- フロントマターの `type` を `architecture` へ変更し、`part_of` に `specdojo:tsd-index-sample` を追加しました。
- rulebook の要件に従い、採用技術の設定、動作確認手順（確認対象、実行場所、期待結果、失敗時の確認先）、および技術的な制約やトラブルシューティングの節を追加しました。
- `CHANGELOG.md` を更新し、`docs/ja/specdojo/samples/tsd-sample.md` の変更内容を記録しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 未公開の版の節に、`tsd-sample` の見直しに関する変更内容を追記しました。
- `docs/ja/specdojo/samples/tsd-sample.md`: `tsd-rulebook` の構成に準拠した完成例として再構成しました。具体的には、技術スタックのインベントリから、PostgreSQL / Prisma の詳細定義へと変更し、環境の前提条件、採用設定、動作確認手順、および制約事項を記載しました。

## 3. 申し送り

- finding F017 では ID の `tsd-&lt;term&gt;` 形式への変更が指摘されていましたが、個票完了条件 3（`id` は変えない）に従い `specdojo:tsd-sample` を維持しています。
- `tsd-index-sample.md` との記述に齟齬はありません（題材の PostgreSQL / Prisma、関連記述と完全に整合しています）。
- finding F017 では ID の tsd-&lt;term&gt; 形式への変更が指摘されていましたが、個票完了条件 3（id は変えない）に従い specdojo:tsd-sample を維持しています。
- tsd-index-sample.md との記述に齟齬はありません（題材の PostgreSQL / Prisma、関連記述と完全に整合しています）。
- 適用外の検証: `specdojo register build`（pjr-index.md was not changed）
- 適用外の検証: `specdojo exec refresh`（`sch-*.yaml` was not changed）

## 4. 進め方と実践の型の適用

rulebook の定義に従い、既存の `tsd-sample` を技術スタックの一覧から、特定の技術領域（PostgreSQL / Prisma）の詳細定義へと作り直しました。`sample-authoring-standard` に則り、動作確認手順や技術的制約を含めることで、完成例としての責務を果たしています。
