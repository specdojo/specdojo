---
specdojo:
  id: prj-0002:pjr-2cqc-lp-dev-environment
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T06:05:24Z"
  due_on: "2026-10-31"
---

# PJR-2CQC specdojo-lp に標準的な開発環境を整える

## 1. 概要

specdojo-lp に整形（Prettier）・lint（ESLint）・型検査（astro check）と推奨の VS Code 拡張機能を整え、exec の親 runner が sandbox の外でプロダクトリポジトリの検証を実行できるようにする

### 1.1. 背景（2026-10-12）

- PJR-KH17 の 2 回目の exec run で、executor が `npx prettier --write` を「`specdojo-lp` に Prettier がない」理由で `not_applicable` と記録し、runner の判定が通らず `waiting` に止まった。`specdojo-lp` の `package.json` は `astro`・`tailwindcss`・`@tailwindcss/vite` だけを持ち、整形・lint・型検査の道具がない。
- agent の sandbox では `specdojo-lp` の npm を実行できない。道具を入れるだけでは executor が検証できないため、親 runner の検証で実行する。`pipeline.parent_validations` の要素に `{ id, repo }` を書くと、プロダクトリポジトリで固定 argv の検証を実行できる（[[specdojo:exec-config-guide]]、prj-0001 の PJR-V96B）。ID は許可リスト（`validate-schema`・`typecheck`・`test-unit`・`test-integration`・`lint-ts`・`lint-fm`・`lint-md`）に限られ、`format` や `build` の ID はない。
- 利用者と合意した範囲は、整形・lint・型検査・推奨の VS Code 拡張機能と exec との連携までとする。git hook（lefthook）、`.editorconfig`、CI は必要になってから足す。

## 2. 完了条件

- 整形: `specdojo-lp` に Prettier と `prettier-plugin-astro`、Tailwind CSS 用の plugin を devDependencies として入れ、`format`（書き込み）と `format:check`（検査のみ）の script を用意している。
- lint: ESLint と `eslint-plugin-astro` を入れ、許可リストの ID `lint-ts` に合わせて `lint:ts` の script としている。
- 型検査: `@astrojs/check` と `typescript` を入れ、許可リストの ID `typecheck` に合わせて `typecheck` の script（`astro check`）としている。
- 既存のファイルが `format:check`・`lint:ts`・`typecheck`・`build` をすべて通る。
- 推奨の VS Code 拡張機能を `specdojo-lp/.vscode/extensions.json` の `recommendations` に書いている（Astro、Tailwind CSS IntelliSense、Prettier、ESLint）。
- exec との連携（親 runner での `specdojo-lp` の検証）は、本項目では行わず [[prj-0001:pjr-he9r-per-project-parent-validations]] へ引き継ぐ。`.specdojo/exec-defaults.yaml` は prj-0001 と共有で、`{ id, repo: specdojo-lp }` を足すと `repos` を持たない prj-0001 の run で検証が `failed` になるため（利用者の判断、2026-10-12）。それまでは、LP の検証を orchestrator が sandbox の外で行う。
- 整備が済んだら、PJR-7T8X などの完了条件にある「`specdojo-lp` で prettier を実行しない」の条件が不要になったことを、該当する個票に記録している。
- `npm` の導入は agent の sandbox ではできないため、`specdojo-lp` での依存の追加と検証は orchestrator が sandbox の外で行う。

## 3. 作業内容

| No  | 作業                                                                            | 担当 | 状態     | メモ                                  |
| --- | ------------------------------------------------------------------------------- | ---- | -------- | ------------------------------------- |
| 1   | orchestrator                                                                    | DEV  | done     | 90bab8b（feature/lp-dev-environment） |
| 2   | orchestrator                                                                    | DEV  | done     | ea408e2（feature/lp-dev-environment） |
| 3   | `parent_validations` に `specdojo-lp` の検証を加え、prj-0001 への影響を確かめる | DEV  | deferred | PJR-HE9R へ引き継ぐ                   |

## 4. 対応結果

### 4.1. 実施内容（2026-10-12）

利用者の指定で、orchestrator が実装者として行った（exec では `package.json` と `.specdojo/` の変更が保護機構で止まり、`npm install` も sandbox から行えないため）。作業は `specdojo-lp` の `feature/lp-v1` から切った `feature/lp-dev-environment` で行った。

- 90bab8b: Prettier（`prettier-plugin-astro`・`prettier-plugin-tailwindcss`）、ESLint（`typescript-eslint`・`eslint-plugin-astro`、`eslint/config` の `defineConfig`）、`@astrojs/check`・`typescript` を devDependencies に入れ、`format`・`format:check`・`lint:ts`・`typecheck` の script、`.prettierrc.json`・`.prettierignore`・`eslint.config.js`・`.vscode/extensions.json` を加えた。README に検証のコマンドの表と、構成の表の設定ファイルを書き足した。
- ea408e2: 既存のコンポーネント 11 ファイルを Prettier で整形した。

### 4.2. 検証

- `format:check`・`lint:ts`・`typecheck`（0 errors・0 warnings・0 hints）・`build` がすべて通った。ESLint は `.astro` を含む 15 ファイルを検査している。
- 整形の前後でビルドの出力を比べた。差は、インラインの script の関数の引数の末尾にカンマが 1 つ付いた所だけで、JavaScript の意味は同じである。HTML の構造・文言・クラスと CSS は変わっていない。
- `npm audit` は high の脆弱性 5 件を報告したが、すべて開発用の依存（`braces`）で、`--omit=dev` では 0 件だった。修正には互換性を壊す `npm audit fix --force` が要るため、手を付けていない。

### 4.3. 残課題

- `feature/lp-dev-environment` を `feature/lp-v1` へ取り込むのは、利用者の承認を得てから行う。
- 親 runner での `specdojo-lp` の検証は [[prj-0001:pjr-he9r-per-project-parent-validations]] で扱う。
- 「`specdojo-lp` で prettier を実行しない」の条件を置いた項目（PJR-7T8X・PJR-1QBZ・PJR-XEJ4 など）はすべて完了済みで、今後の項目では不要になった。

## 5. 関連ドキュメント

- [[prj-0002:pjr-kh17-lp-tool-fit-guide]]: run が止まった項目。
- [[prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix]]: 「prettier を実行しない」の条件を置いた項目。
- [[specdojo:exec-config-guide]]: `parent_validations` の `{ id, repo }`。
- [[prj-0001:pjr-he9r-per-project-parent-validations]]: 親 runner での検証を引き継ぐ項目。
