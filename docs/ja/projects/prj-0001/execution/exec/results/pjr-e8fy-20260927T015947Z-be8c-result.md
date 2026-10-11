---
specdojo:
  id: prj-0001:xer-pjr-e8fy-20260927t015947z-be8c
  type: exec-result
  task_id: PJR-E8FY
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: exec/plans/pjr-e8fy-20260927T015947Z-be8c-plan.md
  started_at: "2026-09-27T02:00:53.928Z"
  completed_at: "2026-09-27T02:41:58.548Z"
  agent: claude-expert-executor
---

# Edit Result

## 1. 実施内容

- VitePress サイドバーから実行記録（plan/result/events）を除外し、パス（`ja`/`en`）ごとにサイドバーを分割した。
- これにより、`/ja/specdojo/` では `specdojo` セクションのみ、`/ja/projects/&lt;id&gt;/` では該当プロジェクトのサイドバーのみが表示されるようになった。
- `metaChunk` を有効化し、サイトデータが各ページにインライン化されるのを防いだことで、メモリ不足問題を解消し `npm run docs:build` が `NODE_OPTIONS` なしで成功することを確認した。
- 到達性を維持するため、`specdojo dashboard build` により生成される `exec-records.md` リストページを追加し、ダッシュボードからリンクさせた。
- ビルド後の全 2,175 ページをスキャンし、意図どおりにサイドバーが構成されていることを検証した。

## 2. 変更ファイル

- `docs/ja/projects/prj-0001/controls/project-register/pjr-e8fy-docs-build-sidebar-scope.md`: 個票の作業内容および対応結果を更新。
- `packages/docs-site/.vitepress/config.mts`: `metaChunk` の有効化およびサイドバー構成の変更。
- `packages/docs-site/.vitepress/sidebar-config.ts`: サイドバー定義の修正。
- `src/dashboard.ts`: 実行記録リストページ `exec-records.md` の生成ロジックを追加。
- `tests/src/dashboard.test.ts`: ダッシュボードの変更に伴うテストケースを追加。

## 3. 申し送り

- ビルド時間は環境に依存するため、改めて同一環境での再計測を推奨する。

## 4. 進め方と実践の型の適用

サイドバーから大量の静的リンク（実行記録）を排除し、ページパスに基づいた動的なサイドバー分割を導入することで、メモリ消費量を削減した。また、VitePress の `metaChunk` 機能を活用してデータ転送量を最適化した。
