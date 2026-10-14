---
specdojo:
  id: prj-0001:pjr-ca0s-docs-site-output-in-node-modules
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: done
  priority: high
  owner: DEV
  registered_at: "2026-10-13T14:33:33Z"
  due_on: null
  completed_at: "2026-10-13T15:05:43Z"
  conclusion: docs-site のビルド結果と cache を workspace 直下の .vitepress/ へ移し、deploy.yml と README を合わせて、本リポジトリと空のリポジトリで出力先を確かめた
---

# PJR-CA0S docs-site のビルド結果が node_modules の中へ出力される

## 1. 課題内容

@specdojo/docs-site 0.2.0 は outDir と cacheDir を package の中（node_modules/@specdojo/docs-site/.vitepress/dist）に置くため、利用者はビルドしたサイトを見つけにくく、npm ci で消える。README にも出力先の記載がない

## 2. 影響範囲

| 観点         | 影響                                                                                                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スコープ     | `packages/docs-site/.vitepress/config.mts` の `outDir`・`cacheDir`、`packages/docs-site/README.md`、本リポジトリの `.github/workflows/deploy.yml` と `.gitignore`                         |
| スケジュール | v0.3.0 の公開前に直す（2026-10-13、利用者の判断）。修正は `@specdojo/docs-site` 0.2.1 として公開する                                                                                      |
| コスト       | 利用者はビルドしたサイトを `node_modules/@specdojo/docs-site/.vitepress/dist` からしか得られない。`npm ci` や再導入で消え、複数の workspace が同じ package を共有する構成では出力が混ざる |
| 品質         | 本リポジトリは package をリポジトリの中で使うため、出力先が `packages/docs-site/.vitepress/dist` になり問題が表に出ない                                                                   |
| 関係者       | docs-site を導入する利用者、本リポジトリの GitHub Pages への deploy                                                                                                                       |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `config.mts` が `outDir` と `cacheDir` を `PACKAGE_ROOT`（package の置き場所）から組み立てている                                                                             |
| 対応策   | 出力先を閲覧対象の workspace 側へ移す。`srcDir` が workspace の直下であるため、VitePress の既定と同じ `<workspace>/.vitepress/dist` と `<workspace>/.vitepress/cache` にする |
| 依存事項 | [[prj-0001:pjr-ea20-docs-site-requires-en-locale]] と同じ `config.mts` を変えるため、その後に実行する                                                                        |
| 完了条件 | 下記の完了条件を満たす                                                                                                                                                       |

### 3.1. 完了条件

- `specdojo-docs-site build <workspace>` の出力が `<workspace>/.vitepress/dist`、cache が `<workspace>/.vitepress/cache` になる。package の中（`node_modules/@specdojo/docs-site/.vitepress/`）へは書き込まない。
- `<workspace>/.vitepress/` の生成物が、ページとして走査されない（ビルド結果にページとして現れない）。
- `packages/docs-site/README.md` に、ビルド結果と cache の出力先、利用リポジトリの `.gitignore` へ `/.vitepress/dist` と `/.vitepress/cache` を加えることを記載している。
- 本リポジトリの `.gitignore` の `/packages/docs-site/.vitepress/dist` と `/packages/docs-site/.vitepress/cache` を、新しい出力先に合わせて更新している。
- 本リポジトリの `.github/workflows/deploy.yml` の upload の `path` を新しい出力先に合わせている。
- 本リポジトリで `npm run docs:build` が通り、出力が新しい出力先に作られる。
- `packages/docs-site/package.json` の版は変えない（0.2.1 への版上げは公開の準備でまとめて行う）。

## 4. 対応結果

| 項目       | 内容                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 解決内容   | `config.mts` の `outDir` / `cacheDir` を `WORKSPACE_ROOT` 基準の `<workspace>/.vitepress/dist`・`<workspace>/.vitepress/cache` へ変更し、`srcExclude` に `.vitepress/**` を追加した。未使用になった `PACKAGE_ROOT` を削除した                                                                                                                                                                                                                                                                                       |
| 文書       | `packages/docs-site/README.md` に出力先と利用リポジトリの `.gitignore` へ加える行を記載した。本リポジトリの `.gitignore` と `sysd-index.md` の生成先を新しい出力先へ更新した。`packages/docs-site/package.json` の版は変えていない                                                                                                                                                                                                                                                                                  |
| 未完了     | なし。`.github/workflows/deploy.yml` の upload `path` は agent の編集権限外のため executor は変更できなかった。統合後に orchestrator が feature ブランチで `.vitepress/dist` へ直し、develop へ統合した（77a6a28d6、merge 6ebe2fb28）                                                                                                                                                                                                                                                                               |
| 確認結果   | 統合後（2026-10-14）に orchestrator が確認した。本リポジトリで `NODE_OPTIONS=--max-old-space-size=4096 npm run docs:build` が約 1 分 48 秒で通り、出力が `.vitepress/dist` に作られた。また、修正後の docs-site を `npm pack` して、`config init` と `register scaffold` だけを行った空のリポジトリ（`docs/ja` のみ）へ入れ、`npx specdojo-docs-site build .` が通って出力が利用リポジトリの `.vitepress/dist` に作られ、package の中に `dist` と `cache` が作られないことを確かめた（PJR-EA20 の修正も同時に確認） |
| 再発防止策 | 出力先を package からではなく閲覧対象の workspace から組み立てる旨を `config.mts` のコメントに残した                                                                                                                                                                                                                                                                                                                                                                                                                |

## 5. 関連ドキュメント

- [[prj-0001:pjr-cbqv-docs-site-npm-publish]]: docs-site の npm への公開。導入の確認で本件が見つかった。
- `packages/docs-site/.vitepress/config.mts`、`packages/docs-site/README.md`
