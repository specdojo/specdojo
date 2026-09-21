---
specdojo:
  id: prj-0001:pjr-dpvv-docs-lint-package
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-21T06:27:03Z"
  due_on: "2026-10-10"
---

# PJR-DPVV 文書 lint を @specdojo/docs-lint として分離する

## 1. 概要

`specdojo` の `package.json` の `files` は `tools/docs/src` と `tools/docs/tsconfig.json` を同梱しているが、次の理由で利用者側では機能しない。

- 中身は remark プラグイン 3 本（`remark-md-content`、`remark-no-unescaped-angle-placeholder`、`remark-frontmatter-ajv2020`）と検証スクリプト 4 本（`validate-yaml-schema`、`validate-rulebook-schema-enums`、`validate-history-links`、`validate-md-content`）で、CLI（`src/`）からは参照されない。参照元は本リポジトリの `package.json` scripts と `.remarkrc.yaml` だけである。
- 依存する `remark` / `remark-cli` / `ajv-formats` / `fast-glob` は devDependencies で、`npm i specdojo` では入らない。
- 利用者が使うには `node_modules/specdojo/tools/docs/src/…` を `.remarkrc` や scripts から指すことになり、公開 API として成立していない。

PJR-9S8F で文書サイトを `@specdojo/docs-site`（`packages/docs-site`）へ分離した前例に合わせ、文書 lint も `@specdojo/docs-lint`（`packages/docs-lint`）へ分離する。

### 1.1. 決定事項

- パッケージ名は `@specdojo/docs-lint`、配置は `packages/docs-lint`。`@specdojo/docs-site` と同じく独自の `package.json` / lockfile を持ち、npm workspaces にはしない（PJR-7VKR の publish 形態と揃える）。
- remark プラグインは export（例: `@specdojo/docs-lint/remark/md-content`、`.../no-unescaped-angle-placeholder`、`.../frontmatter-ajv2020`）として提供し、利用者は `.remarkrc` から参照する。
- 検証スクリプトは `bin`（例: `specdojo-docs-lint yaml-schema` / `rulebook-schema-enums` / `history-links` / `md-content`）として提供する。schema は `specdojo` 本体に同梱される `docs/specdojo/schemas` を `specdojo` のパッケージルートから解決する。
- 依存（remark 系、ajv、ajv-formats、fast-glob、js-yaml、gray-matter）はこのパッケージの `dependencies` に置く。
- 本リポジトリの `.remarkrc.yaml`、`validate:*` / `lint:md` / `lint:fm` scripts、lefthook、tsconfig references を `packages/docs-lint` 参照へ書き換える。
- `specdojo` の `files` から `tools/docs/src` と `tools/docs/tsconfig.json` を除く（PJR-7VKR の作業 1 で先行して除外してよい）。
- 利用者向けの案内（quick-start / docs-editing-guide）は `npm i -D specdojo @specdojo/docs-lint` と `.remarkrc` の例を載せる。

## 2. 完了条件

- `packages/docs-lint` が独自の `package.json` を持ち、remark プラグインの export と検証コマンドの `bin` を提供している。`npm pack --dry-run` の同梱物が意図どおりで、依存がすべて `dependencies` にある。
- 本リポジトリの `.remarkrc.yaml`、scripts、lefthook、tsconfig references が `packages/docs-lint` を参照し、`tools/docs` が削除されている。
- `specdojo` の `files` に `tools/docs` が含まれない。
- 別ディレクトリで `npm i -D specdojo @specdojo/docs-lint`（`npm pack` の tarball）を行い、`.remarkrc` から remark プラグインが解決され、`specdojo-docs-lint history-links` が動く。
- quick-start / docs-editing-guide に導入と `.remarkrc` の例が記載されている。
- `npm run check` が通過している。

## 3. 作業内容

| No  | 作業                                                                                                           | 担当 | 状態 | メモ                                              |
| --- | -------------------------------------------------------------------------------------------------------------- | ---- | ---- | ------------------------------------------------- |
| 1   | `packages/docs-lint` を作成し、remark プラグインの export と検証コマンドの `bin` を実装する                    | DEV  | open | codex-expert-executor / gemma-reporter / worktree |
| 2   | 本リポジトリの `.remarkrc.yaml` / scripts / lefthook / tsconfig references を書き換え、`tools/docs` を削除する | DEV  | open | 作業 1 と同一タスク                               |
| 3   | `specdojo` の `files` から `tools/docs` を除く（PJR-7VKR 作業 1 と整合）                                       | DEV  | open | 同上                                              |
| 4   | tarball を別ディレクトリで導入して実地検証し、guide を更新する                                                 | DEV  | open | 同上                                              |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0001:pjr-7vkr-npm-release]]
- [[prj-0001:pjr-9s8f-split-docs-site-package]]
- [[specdojo:docs-editing-guide]]
- [[specdojo:quick-start-guide]]
- `tools/docs/src/`
- `.remarkrc.yaml`
