---
specdojo:
  id: prj-0001:pjr-pejs-docs-site-default-index-pages
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-11-13T14:48:23Z"
  due_on: "2026-11-30"
  block_reason: "parent validation failed: typecheck"
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

| No  | 作業                                                                                                     | 担当  | 状態 | メモ                                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------- |
| 1   | サイトのトップと project のトップをステージングへ用意する（`default-index-pages.ts`・`kata-staging.ts`） | DEV   | done | 利用側に `index.md` があれば書き込まない。dev 中に利用側の `index.md` を消すと用意したページへ戻す            |
| 2   | 上のナビゲーションの「ホーム」と言語メニューのリンク先を切り替える（`config.mts`）                       | DEV   | done | `docs/ja/index.md` が無いときは `/`（サイトのトップ）を開く                                                   |
| 3   | 単体テストの追加と docs-site の README の追記                                                            | DEV   | done | `tests/packages/docs-site/default-index-pages.test.ts`                                                        |
| 4   | 空のリポジトリへ `npm pack` の配布物を入れ、`docs:dev`・`docs:build` で 404 にならないことを確かめる     | human | open | executor の sandbox では build の起動と registry からの導入が承認されず実行できない。人が実施する（対応結果） |

## 5. 対応結果

### 5.1. 実施内容

- `packages/docs-site/.vitepress/default-index-pages.ts` を追加した。閲覧用ステージング（`.vitepress/kata-staging`）を作った直後に、利用リポジトリに無い入口のページを書き込む。
  - サイトのトップ（`docs/index.md`）: SpecDojo の文書（`docs/ja/specdojo/index.md`、無ければ全体概要ガイド）と、`.specdojo/specdojo.config.json` の project ごとのトップへのリンク。
  - project のトップ（`<base_path>/index.md`、`base_path` が無ければ `docs/ja/projects/<project-id>/index.md`）: `project_register_path` の `generated/` にある登録簿の一覧・派生ビューと、その親の `generated/` にある管理ログへのリンク。`docs/` の外にある project は対象外。
  - ステージングに存在するページだけをリンクし、`docs:build` の dead link 検査で失敗しないようにした。リンクの表示名は各ページの H1 から取る。
- `kata-staging.ts` の `stageBundledKata` から生成を呼び、`syncFile` は利用側の `index.md` が消えたときに用意したページへ戻す。
- `config.mts` の「ホーム」と日本語の言語メニューは、ステージングに `docs/ja/index.md` が無いとき `/` を開く。SpecDojo 自身のリポジトリは `docs/ja/index.md` があるため従来どおり `/ja/` を開く。
- CLI に組み込まない理由: `@specdojo/docs-site` は任意導入のパッケージで、入口のページは文書サイトでしか使わない。`config scaffold` で `docs/index.md` を作ると、利用リポジトリに管理対象のファイルが増え、project の追加や登録簿の生成のたびに手で更新する必要が出る。ステージングに毎回生成すれば設定と生成物の現状に追従し、利用者が自分の `index.md` を置けばそちらが優先される。

### 5.2. 検証結果

- 追加した単体テスト（`tests/packages/docs-site/default-index-pages.test.ts`）を含む `tests/packages/docs-site/` の 100 件が通った。`index.md` の有無、リンク対象の絞り込み、dev 中の削除からの復元、`base_path` 未設定と `docs/` 外の project を確かめている。
- docs-site の `tsc -p packages/docs-site/.vitepress/tsconfig.json --noEmit` が通った。
- 残課題: 空のリポジトリへ `npm pack` の配布物を入れ、`docs:dev` と `docs:build` でトップ（`/<base>/`）と project のトップ（`/ja/projects/<project-id>/`）が 404 にならないことを、利用側の `index.md` がある場合とない場合の両方で人が確かめる。executor の sandbox では build の起動が承認されなかった。手順の下書きは worktree の `tmp/pejs-build-check.sh`（`SPECDOJO_PACKAGE_ROOT` でリポジトリを package として指す簡易版。`npm pack` の配布物での確認は別途必要）。
- 「プロジェクト」のナビゲーションは引き続き `prj-0001` の `prj-overview` を固定で開く。project の ID や構成が違う利用リポジトリでは 404 になり得るため、必要なら別の登録項目で扱う。

### 5.3. CHANGELOG に書く事項

- `@specdojo/docs-site`: 利用リポジトリに `docs/index.md` が無いとき、サイトのトップに SpecDojo の文書と project ごとのトップへのリンクを置いたページを用意するようにした。これまでは `/<base>/` が 404 になっていた。
- `@specdojo/docs-site`: `docs/` 配下の project のトップ（`/ja/projects/<project-id>/`）に `index.md` が無いとき、登録簿の一覧・派生ビュー・管理ログへのリンクを置いたページを用意するようにした。
- `@specdojo/docs-site`: 利用リポジトリの `index.md` がある場合はそちらを使い、上書きしない。`docs/ja/index.md` が無いときは、上のナビゲーションの「ホーム」がサイトのトップを開く。

## 6. 関連ドキュメント

- [[prj-0001:pjr-index]]
- `packages/docs-site/README.md`（ステージングと入口のページの説明）
