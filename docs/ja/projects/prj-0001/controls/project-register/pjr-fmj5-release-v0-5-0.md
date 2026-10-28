---
specdojo:
  id: prj-0001:pjr-fmj5-release-v0-5-0
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: BA
  registered_at: "2026-10-28T21:40:56Z"
  due_on: "2026-10-31"
---

# PJR-FMJ5 v0.5.0 を公開する

## 1. 概要

0.4.7 以降の変更（成果物 type の移行という破壊的変更を含む）を v0.5.0 として検証し、main へ昇格して npm に公開する

## 2. 完了条件

- PJR-484B・0D0T・EXH2・WAGY・B4Y4・6RVJ・9ZN5・05GN・EVAE・9SXH・XSM8・H988・N9JC・8NWR がすべて `done` である。
- `package.json` と `package-lock.json` の版が `0.5.0` で、`CHANGELOG.md` の `[Unreleased]` を `0.5.0` の節として日付を付けて確定している。
- `packages/docs-lint` と `packages/docs-site` の `package.json` と `package-lock.json` の版が `0.3.0` で、`CHANGELOG.md` の `0.5.0` の節の冒頭に、`@specdojo/docs-lint` 0.3.0 と `@specdojo/docs-site` 0.3.0 を同時に公開することと、それぞれの変更内容を記載している（利用者の判断、案 A）。
- 破壊的変更を含むため、`CHANGELOG.md` の `0.5.0` の節の先頭に移行手順（rulebook への `deliverable_type` の追加、YAML の旧 type の置き換え、表示ページの再生成）をまとめている。
- ルートと `packages/docs-lint`・`packages/docs-site`・`packages/vscode-specdojo` の `npm ci` が通り、クリーンな作業ツリーで `npm run check` が通る。
- `npm pack` の配布物（本体・docs-lint・docs-site）を空の Git リポジトリへ入れ、`init`、`register add`（`epic` と `--depends-on` を含む）、`exec run --register`、docs-lint の `lint:fm` による `deliverable_type` の照合、docs-site の `build` の動作を確かめる。
- 公開候補が PR の merge commit で `main` へ入り、その commit を指す `v0.5.0`・`docs-lint-v0.3.0`・`docs-site-v0.3.0` のタグからそれぞれの npm の公開 workflow が起動する。push・PR の merge・npm 公開の承認は利用者が行う。
- 公開後に npm の `latest` が `specdojo` は `0.5.0`、`@specdojo/docs-lint` と `@specdojo/docs-site` は `0.3.0` であること、タグで起動した workflow の結果、npm から入れた版の動作を確かめる。

## 3. 作業内容

| No  | 作業                                    | 担当                  | 状態 | メモ |
| --- | --------------------------------------- | --------------------- | ---- | ---- |
| 1   | 版番号と変更履歴・移行手順を確定する    | specdojo-orchestrator | open | -    |
| 2   | 全体検証と配布物の試用を行う            | specdojo-orchestrator | open | -    |
| 3   | PR を merge し、タグ 3 つを push する   | BA                    | open | -    |
| 4   | npm 公開 3 件を承認し、公開版を確かめる | BA                    | open | -    |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-484b-deliverable-type-declaration]]
- [[prj-0001:pjr-0d0t-yaml-deliverable-type-alignment]]
- [[prj-0001:pjr-e6qa-release-v0-4-7]]
