---
specdojo:
  id: prj-0001:xer-pjr-pqg3-20261103t033238z-680e5397
  type: exec-result
  task_id: PJR-PQG3
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-PQG3/20261103T033238176Z-1ae7045c/plan.md
  started_at: "2026-11-03T03:32:38.505Z"
  completed_at: "2026-11-03T03:59:57.344Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- VitePress のサイドメニューに Kata の全 `sample`・`template`・`recipe`・`rulebook`（計306件）を掲載するように `packages/docs-site/.vitepress/sidebar-config.ts` を更新しました。
- サイドメニューの更新内容を検証するための自動検査テスト `tests/packages/docs-site/sidebar-kata.test.ts` を追加しました。

## 2. 変更ファイル

- `packages/docs-site/.vitepress/sidebar-config.ts`: VitePress のサイドメニュー設定に、Kata の各種成果物（`sample`、`template`、`recipe`、`rulebook`）を網羅的に追加しました。
- `tests/packages/docs-site/sidebar-kata.test.ts`: サイドメニューの変更を検証するためのテストコードを追加しました。

## 3. 申し送り

- 個票 `docs/ja/projects/prj-0001/controls/project-register/pjr-pqg3-sidebar-kata-menus.md` の内容は、実行過程において更新されています。

## 4. 進め方

まず `packages/docs-site/.vitepress/sidebar-config.ts` を編集し、不足していた Kata の各種成果物（`sample`、`template`、`recipe`、`rulebook`）のメニュー項目を追加しました。その上で、サイドメニューの整合性を担保するために `tests/packages/docs-site/sidebar-kata.test.ts` によるテストを追加し、`npm run docs:build` および `npm --prefix packages/docs-site run typecheck` 等の検証を行いました。
