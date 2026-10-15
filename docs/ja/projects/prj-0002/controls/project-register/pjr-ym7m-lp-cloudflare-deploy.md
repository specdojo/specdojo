---
specdojo:
  id: prj-0002:pjr-ym7m-lp-cloudflare-deploy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T13:14:13Z"
  due_on: "2026-10-31"
---

# PJR-YM7M LP を Cloudflare に配置する設定を行う

## 1. 概要

specdojo-lp を Cloudflare Workers の静的アセットとして配置する設定は済んだ。残りは、確定した設定を tsd-cloudflare-workers.md にまとめ、tsd-index に wrangler とビルド環境の Node.js の版を反映すること

### 1.1. 前提（2026-10-12）

- 公開先は Cloudflare 上の静的サイトとする（[[prj-0002:pjr-fv3w-lp-tech-stack]]）。
- Astro の公式ガイドは、新しいプロジェクトには Cloudflare Pages ではなく Cloudflare Workers（静的アセット）を勧めている。静的なサイトではアダプターは要らず、`wrangler.jsonc` の `assets.directory` に `./dist` を指定し、Git 連携は Workers Builds で行う（<https://docs.astro.build/en/guides/deploy/cloudflare/>）。
- `specdojo-lp` は GitHub flow で運用し、`main` を公開している状態とする。今の作業は `feature/lp-v1` にある。
- 本番の公開（`main` への取り込みと配置）は、specdojo 0.3.0 の npm への公開を待つ。

### 1.2. 確定した設定（2026-10-14）

作業内容 No 1〜5・7 で設定し、orchestrator が確かめた事実。TSD はここに書いた事実だけをもとに書く。

- リポジトリの設定（specdojo-lp）
  - `wrangler` 4.x を devDependencies に入れた。
  - `wrangler.jsonc` に `$schema`・`name: "specdojo-lp"`・`compatibility_date: "2026-10-14"`・`assets.directory: "./dist"`・`previews: {}` を書いた。`previews` は `npx wrangler preview` に必要で、空なら本番と同じ設定を使う。`assets.not_found_handling` は書いておらず、存在しないパスには 404 が返る。
  - `wrangler dev` が作る `.wrangler/` を `.gitignore` と ESLint の対象から外した。
  - 手元では `npm run build` の後に `npx wrangler dev` で表示を確かめられる。
- Workers Builds（ダッシュボードで利用者が設定）
  - GitHub の `specdojo/specdojo-lp` を連携した。Build command は `npm run build`、Deploy command は `npx wrangler deploy`、本番のブランチは `main`。
  - Settings > Build > Branch control で Enable Preview Builds を有効にした。本番以外のブランチへの push で `npx wrangler preview`（open beta）が動き、ブランチ名の `/` を `-` にした名前のプレビューができる。プレビューの URL は `<プレビュー名>-specdojo-lp.<アカウントのサブドメイン>.workers.dev`。
  - Node.js の版は指定しておらず、Workers Builds の既定の 24.18.0 で動く。固定する場合は `NODE_VERSION` か `.node-version` を使う。
- 独自ドメイン（ダッシュボードで利用者が設定）
  - Workers の Custom Domains で `specdojo.org` を割り当てた。証明書は自動で発行された。
  - ゾーンの SSL/TLS > Edge Certificates で Always Use HTTPS を有効にし、http は 301 で https へ転送される。
  - `www` は、proxied な `A` レコード（`192.0.2.0`）と、Redirect Rule（`https://www.*` を `https://${1}` へ 301、クエリを保つ）でルートへ転送する。http の `www` は 2 回の転送でルートに着く。
- 起きたことと対処
  - GitHub の `main` に LP のファイルがない間は、本番のビルドが `package.json` を見つけられずに失敗した。`main` へ取り込んで解消した。
  - `previews` のブロックがないと、プレビューのビルドが失敗した。空の `previews` を加えて解消した。
  - DNS のレコードを作る前に名前を引くと、存在しないという結果が最大 30 分（SOA の negative TTL）残り、その間は手元から `www` を引けない。

## 2. 完了条件

配置の形の決定、`wrangler` の導入、Workers Builds への連携、プレビューと本番での確認、独自ドメインの設定は達成済みである（作業内容 No 1〜5・7）。本節には、残りの TSD の作成の条件だけを置く。

- `specdojo-lp` の `docs/ja/product/030-architecture/020-infrastructure/tsd-cloudflare-workers.md` がある。frontmatter は `specdojo:` 名前空間の下に `id: tsd-cloudflare-workers`・`type: architecture`・`status: draft`・`part_of: [tsd-index]`・`rulebook: specdojo:tsd-rulebook` を持つ。
- tsd-rulebook の観点（概要・採用理由、選定・バージョン、設定・セットアップ手順、動作確認、運用上の注意）を、1.2. の事実だけで書いている。
  - 設定・セットアップ手順に、`wrangler.jsonc` の内容と、ダッシュボードで行う設定（Workers Builds、プレビュー、Custom Domains、Always Use HTTPS、`www` の転送）を書いている。
  - 動作確認に、`wrangler dev` の手順と、本番・プレビュー・http・`www` で期待する応答（200・404・301 と転送先）を書いている。
  - 運用上の注意に、1.2. の「起きたことと対処」を書いている。
- アカウント ID、ダッシュボードの URL、API トークン、アカウントのサブドメインを書かない。`workers.dev` の URL は `<アカウントのサブドメイン>` のような置き換えの形で書く。
- `tsd-index.md` を次のように直している。
  - ホスティングの行の `補足` から `tsd-cloudflare-workers.md` へリンクしている。
  - `wrangler` 4.x の行（区分は配置）を加えている。
  - ランタイムの行の `補足` に、Workers Builds のビルドが既定の Node.js 24.18.0 で動くことを書いている。
- `wrangler.jsonc`・`package.json`・ソースコードは変えない。
- `npm run format:check` が通る。変更は `specdojo-lp` の `feature/lp-v1` へ統合される。

## 3. 作業内容

| No  | 作業                                                                                                | 担当         | 状態 | メモ                                                                                                                                                                                                                                                                                                                                                                    |
| --- | --------------------------------------------------------------------------------------------------- | ------------ | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 配置の形（Workers）を確かめて決める                                                                 | DEV          | done | 利用者が Workers に決めた（2026-10-12）                                                                                                                                                                                                                                                                                                                                 |
| 2   | `wrangler` と `wrangler.jsonc` を加え、手元で表示を確かめる                                         | orchestrator | done | specdojo-lp `af31dfd`（`feature/lp-v1` へ `86628cc` で統合）。`wrangler dev` で `/` と静的アセットが 200、存在しないパスが 404 になることを確かめた。プレビューのため空の `previews` を加えた（`1f86cb3`、`54cad6b` で統合）                                                                                                                                            |
| 3   | Cloudflare のダッシュボードで Workers Builds に連携する                                             | 利用者       | done | 最初のビルドは、GitHub の `main` に LP のファイルがなく失敗した。`main` への取り込み後に本番のビルドが成功した。プレビューは、`wrangler preview` が `previews` のブロックを求めて失敗し、No 2 の修正の後に成功した（2026-10-14）                                                                                                                                        |
| 4   | プレビューの URL で表示を確かめる                                                                   | orchestrator | done | `https://feature-lp-v1-specdojo-lp.<アカウントのサブドメイン>.workers.dev/` で `/` と静的アセットが 200、存在しないパスが 404 になることを確かめた（2026-10-14）                                                                                                                                                                                                        |
| 5   | 独自ドメインを決めて設定する                                                                        | 利用者       | done | 利用者が `specdojo.org` を Custom Domains に割り当て、Always Use HTTPS を有効にし、`www` の proxied な DNS レコードと `www` からルートへの 301 の Redirect Rule を設定した。<https://specdojo.org/> で `/` と静的アセットが 200、存在しないパスが 404、http と `www` からはパスとクエリを保って `https://specdojo.org/` へ 301 で転送されることを確かめた（2026-10-14） |
| 6   | 設定の内容を `tsd-<term>` にまとめ、`tsd-index` に `wrangler` とビルド環境の Node.js の版を反映する | DEV          | done | `claude-expert-executor` が exec で対応し、specdojo-lp の `feature/lp-v1` へ `fa5a900` で統合された（2026-10-15）。`wrangler` と Node.js の版は、PJR-4ZSN の close 時の照合で見つかった                                                                                                                                                                                 |
| 7   | 0.3.0 の公開の後、`main` へ取り込んで本番に配置する                                                 | 利用者       | done | 利用者が `feature/lp-v1` を `main` へ取り込み（`9a3d56d`）、本番のビルドが成功した。`https://specdojo-lp.<アカウントのサブドメイン>.workers.dev/` で `/` と静的アセットが 200、存在しないパスが 404 になることを確かめた。`specdojo.org` での確認は No 5 で行う。`main` にはまだ `previews` が入っていない                                                              |

## 4. 対応結果

- 作業内容 No 6（2026-10-15）: 1.2. の事実をもとに、`specdojo-lp` の `docs/ja/product/030-architecture/020-infrastructure/tsd-cloudflare-workers.md` を作った。概要・採用理由、選定・バージョン、設定・セットアップ手順（`wrangler.jsonc`、Workers Builds とプレビュー、Custom Domains、Always Use HTTPS、`www` の転送）、動作確認（`wrangler dev` と、本番・プレビュー・http・`www` で期待する応答）、運用上の注意（起きたことと対処）を書いた。アカウントのサブドメインは `<アカウントのサブドメイン>` の形で書いた。
- 同じく `tsd-index.md` を直した。ホスティングの行の `補足` から `tsd-cloudflare-workers.md` へリンクし、`wrangler` 4.x の行（区分は配置）を加え、ランタイムの行の `補足` に Workers Builds のビルドが既定の Node.js 24.18.0 で動くことを書いた。
- `wrangler.jsonc`・`package.json`・ソースコードは変えていない。
- 残課題: `main` にはまだ `previews` が入っていない（作業内容 No 7 のメモ）。変更の `feature/lp-v1` への統合は runner が行う。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 公開先を Cloudflare 上の静的サイトとした決定。
- [[prj-0002:pjr-g4qn-lp-tech-stack-evaluation]]: Cloudflare への配置のしやすさの比較。
- [[prj-0002:pjr-4zsn-lp-tech-stack-tsd]]: LP の技術スタックの TSD。
- [[prj-0001:pjr-zdvq-product-repo-branch-strategy]]: `specdojo-lp` のブランチ運用の根拠。
