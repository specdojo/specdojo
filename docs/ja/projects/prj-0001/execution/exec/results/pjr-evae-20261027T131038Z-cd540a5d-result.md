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
  completed_at: "2026-10-27T13:27:51.954Z"
  agent: flash-high-executor
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
  block_reason: "parent validation failed: lint-md, test-unit"
---

# Edit Result

## 1. 実施内容

- `tsd-sample` を新しい `tsd-rulebook` および `sample-authoring-standard` に基づいて、PostgreSQL / Prisma の特定領域詳細定義として再構成しました。
- `CHANGELOG.md` を更新しました。

## 2. 変更ファイル

- `CHANGELOG.md`: 未公開の版の節に、今回の変更内容を追記しました。
- `docs/ja/specdojo/samples/tsd-sample.md`: 技術スタックのインベントリ形式から、`tsd-rulebook` が求める「特定領域詳細定義」の構成（対象環境・前提条件、採用技術・設定、動作確認、制約・トラブルシュート）へと大幅に書き換えました。採用値や動作確認手順、前提条件を具体的に含め、実用的なサンプルとして再構成しています。

## 3. 申し送り

- finding `F017` では ID の `tsd-&lt;term&gt;` 形式への変更が指摘されていましたが、個票完了条件 3（`id` は変えない）に従い `specdojo:tsd-sample` を維持しています。
- `tsd-index-sample.md` との記述に齟齬はありません（題材の PostgreSQL / Prisma、関連記述と完全に整合しています）。
- finding F017 では ID の tsd-&lt;term&gt; 形式への変更が指摘されていましたが、個票完了条件 3（id は変えない）に従い specdojo:tsd-sample を維持しています。
- tsd-index-sample.md との記述に齟齬はありません（題材の PostgreSQL / Prisma、関連記述と完全に整合しています）。
- 適用外の検証: `npm run validate:schema:file`（changed files are Markdown only, no YAML files modified）
- 適用外の検証: `specdojo catalog validate`（changes outside docs/ja/projects/）
- 適用外の検証: `specdojo register build`（pjr-index.md was not changed）
- 適用外の検証: `specdojo exec refresh`（`sch-*.yaml` was not changed）

## 4. 進め方と実践の型の適用

既存の `tsd-sample` は技術スタックのインベントリ形式であり、`rulebook` が意図する「特定領域詳細定義」の責務を果たしていませんでした。そこで、題材となる PostgreSQL / Prisma の技術詳細に基づき、構成・設定・動作確認・制約を含む 완성例へと作り直しました。また、frontmatter の `type` を `architecture` へ変更し、`part_of` に `specdojo:tsd-index-sample` を設定することで、文書体系との整合性を確保しました。
