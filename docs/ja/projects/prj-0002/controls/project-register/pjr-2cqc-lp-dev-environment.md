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
- exec との連携: `.specdojo/exec-defaults.yaml` の `pipeline.parent_validations` に `{ id: typecheck, repo: specdojo-lp }` と `{ id: lint-ts, repo: specdojo-lp }` を加え、prj-0002 の register run で runner が sandbox の外で検証することを確認している。
  - `exec-defaults.yaml` は prj-0001 と共有のため、`repos` を持たない prj-0001 の run に影響がないことを確認している。
  - `.specdojo/` は保護された領域のため、変更は利用者の承認を得てから行う。
- 整備が済んだら、PJR-7T8X などの完了条件にある「`specdojo-lp` で prettier を実行しない」の条件が不要になったことを、該当する個票に記録している。
- `npm` の導入は agent の sandbox ではできないため、`specdojo-lp` での依存の追加と検証は orchestrator が sandbox の外で行う。

## 3. 作業内容

| No  | 作業                                                                            | 担当 | 状態 | メモ                                    |
| --- | ------------------------------------------------------------------------------- | ---- | ---- | --------------------------------------- |
| 1   | 整形・lint・型検査の道具と script、推奨の拡張機能を `specdojo-lp` に入れる      | DEV  | open | -                                       |
| 2   | 既存のファイルを検証が通る状態にする                                            | DEV  | open | -                                       |
| 3   | `parent_validations` に `specdojo-lp` の検証を加え、prj-0001 への影響を確かめる | DEV  | open | `.specdojo/` の変更は利用者の承認を得る |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-kh17-lp-tool-fit-guide]]: run が止まった項目。
- [[prj-0002:pjr-7t8x-lp-roadmap-pdca-matrix]]: 「prettier を実行しない」の条件を置いた項目。
- [[specdojo:exec-config-guide]]: `parent_validations` の `{ id, repo }`。
