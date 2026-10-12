---
specdojo:
  id: prj-0001:pjr-szgz-devcontainer-lp-extensions
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T06:13:25Z"
  due_on: "2026-10-31"
---

# PJR-SZGZ devcontainer に specdojo-lp 用の VS Code 拡張機能を加える

## 1. 概要

作業場所の devcontainer で specdojo-lp も開いているが、Astro・Tailwind CSS IntelliSense・ESLint の拡張機能が入っていない。devcontainer.json の customizations.vscode.extensions に加え、作り直したときに自動で入るようにする

## 2. 完了条件

- `.devcontainer/devcontainer.json` の `customizations.vscode.extensions` に、次の拡張機能を加えている。
  - `astro-build.astro-vscode`（Astro）
  - `bradlc.vscode-tailwindcss`（Tailwind CSS IntelliSense）
  - `dbaeumer.vscode-eslint`（ESLint）
- Prettier（`esbenp.prettier-vscode`）は既にあるため、重複して加えない。
- devcontainer を作り直し（Rebuild Container）、3 つの拡張機能が入ること、`specdojo-lp` の `.astro` ファイルで構文の強調表示と Tailwind の補完が効くことを確認している。
- `.devcontainer/` の変更は利用者の承認を得てから行う。

## 3. 作業内容

| No  | 作業                                   | 担当 | 状態 | メモ               |
| --- | -------------------------------------- | ---- | ---- | ------------------ |
| 1   | `devcontainer.json` に拡張機能を加える | DEV  | open | 利用者の承認を得る |
| 2   | devcontainer を作り直して確認する      | DEV  | open | -                  |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-2cqc-lp-dev-environment]]: `specdojo-lp` の開発環境。推奨の一覧（`.vscode/extensions.json`）はこちらで置く。
