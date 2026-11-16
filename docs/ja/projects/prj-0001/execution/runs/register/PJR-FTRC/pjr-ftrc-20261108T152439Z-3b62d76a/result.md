---
specdojo:
  id: prj-0001:xer-pjr-ftrc-20261108t152439z-3b62d76a
  type: exec-result
  task_id: PJR-FTRC
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-FTRC/pjr-ftrc-20261108T152439Z-3b62d76a/plan.md
  started_at: "2026-11-08T15:24:39.873Z"
  completed_at: "2026-11-08T15:59:15.189Z"
  agent: flash-high-executor
---

# Edit Result

## 1. 実施内容

- lint:fm (`specdojo-docs-lint.js`) が `.gitignore` で管理外とされている生成物（`docs/**/generated/**` 等）を検査してエラーを出す問題を解決しました。
- `.remarkignore` に除外設定を追加し、`specdojo-docs-lint.js` の実行時に `--silently-ignore` フラグを自動付与するように変更しました。
- 変更に伴い、ユニットテストを追加しました。

## 2. 変更ファイル

- `.remarkignore`: `.gitignore` のルールに基づき、`docs/**/generated/**` を lint の対象外とする設定を追加しました。
- `packages/docs-lint/bin/specdojo-docs-lint.js`: `remark` 実行時に `--silently-ignore` を付与して、`.remarkignore` にあるファイルをエラーにせずスキップするように改善しました。
- `tests/packages/docs-lint/specdojo-docs-lint-remark.test.ts`: 変更内容を検証するためのユニットテストを追加しました。

## 3. 申し送り

- CHANGELOG (改善): docs-lint: `specdojo-docs-lint` の `remark` 実行時に `--silently-ignore` を自動付与し、`.remarkignore` で指定された無視対象ファイルをエラーにせずスキップするように改善
- CHANGELOG (改善): lint: `.remarkignore` に `docs/**/generated/**` を指定し、git 管理外の生成物（grade の一時ファイル等）が `lint:fm` の検査対象から外れるように設定
- CHANGELOG (改善): docs-lint: specdojo-docs-lint remark の実行時に --silently-ignore を自動付与し、.remarkignore で指定された無視対象ファイルをエラーにせずスキップするように改善
- CHANGELOG (改善): lint: .remarkignore に `docs/**/generated/**` を指定し、git 管理外の生成物（grade の一時ファイル等）が lint:fm の検査対象から外れるように設定
- 適用外の検証: `npm run validate:schema:file`（no YAML files changed by executor）

## 4. 進め方

まず、`.remarkignore` を更新して `docs/**/generated/**` を明示的に除外対象としました。次に、`specdojo-docs-lint.js` が `remark` を呼び出す際に `--silently-ignore` 引数を追加することで、無視設定されたファイルが frontmatter の警告（`--frail` モード時）によって検証を失敗させないように調整しました。最後に、新機能の動作を保証するためのテストを追加しました。
