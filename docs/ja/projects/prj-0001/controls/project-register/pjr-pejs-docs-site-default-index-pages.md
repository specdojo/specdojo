---
specdojo:
  id: prj-0001:pjr-pejs-docs-site-default-index-pages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-13T14:48:23Z"
  due_on: "2026-11-30"
  commit_type: feat
  commit_scope: docs-site
---

# PJR-PEJS 文書サイトにトップのページと project のトップのページを用意する

## 1. 概要

@specdojo/docs-site の dev と build で、サイトの土台と project のトップの index.md がないと 404 になる。ないときは docs-site がトップのページを用意する

## 2. 入力

- @specdojo/docs-site を導入した利用者からの要望（OpenFisca-Japan-specdojo、2026-11-11）。npm run docs:dev を流すと、/specdojo/ と /specdojo/ja/projects/prj-0001/ が 404 になった
- サイトの土台（/`<base>`/）と project のトップ（/ja/projects/`<project-id>`/）に当たる index.md がないと、開いたときに 404 になる。上のナビゲーションの「ホーム」も 404 になる
- SpecDojo の文書（/ja/specdojo/）と、project の登録簿の一覧（.../project-register/generated/pjr-index）は表示される

## 3. 完了条件

- 利用リポジトリに `docs/index.md` がないときは、docs-site がトップのページを用意する。トップのページには、SpecDojo の文書へのリンクと、`specdojo.config.json` の project ごとのリンクを置く。
- project のトップ（`/ja/projects/<project-id>/`）も同じく用意し、登録簿の一覧・派生ビュー・管理ログへのリンクを置く。
- 利用リポジトリに `index.md` があるときは、そちらを使う（上書きしない）。
- 置き場所は、`.vitepress/kata-staging` に生成する形を基本にする。specdojo の CLI に組み込むか（例: `config scaffold` で `docs/index.md` を作る）は、検討して理由を個票の対応結果に書く。
- 上のナビゲーションの「ホーム」が、用意したトップのページを開く。
- 空のリポジトリに `npm pack` の配布物を入れ、`docs:dev` と `docs:build` で、トップと project のトップが 404 にならないことを確かめる（利用リポジトリの `index.md` がある場合とない場合の両方）。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節に書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` と親の検証が通っている。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
