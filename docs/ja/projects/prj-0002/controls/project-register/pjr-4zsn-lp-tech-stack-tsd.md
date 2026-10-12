---
specdojo:
  id: prj-0002:pjr-4zsn-lp-tech-stack-tsd
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T13:14:29Z"
  due_on: "2026-10-31"
---

# PJR-4ZSN LP の技術スタックを TSD にまとめる

## 1. 概要

specdojo-lp が採用する技術（Astro・Tailwind CSS・TypeScript・Node.js・整形と lint の道具・Material 3 のテーマ・Cloudflare・specdojo-assets など）を、tsd-index-rulebook に従って specdojo-lp の tsd-index.md にまとめる

### 1.1. 前提（2026-10-12）

- TSD は、全体の一覧の `tsd-index`（[[specdojo:tsd-index-rulebook]]）と、1 つの技術領域の詳細の `tsd-<term>`（[[specdojo:tsd-rulebook]]）からなる。本項目では `tsd-index` を作る。Cloudflare の配置の詳細は [[prj-0002:pjr-ym7m-lp-cloudflare-deploy]] で `tsd-<term>` にまとめる。
- LP はプロダクトリポジトリ `specdojo-lp` の成果物のため、TSD も `specdojo-lp` に置く。プロダクトリポジトリの文書は doc id では引けないため、参照はパスで書く。

## 2. 完了条件

- `specdojo-lp/docs/ja/product/030-architecture/020-infrastructure/tsd-index.md` がある。frontmatter は `specdojo:` 名前空間の下に `id: tsd-index`・`type: architecture`・`status: draft`・`rulebook: specdojo:tsd-index-rulebook` を持つ。
- `技術スタック一覧` は表 1 つで、列は `区分`・`採用技術`・`担当責務`（必要なら `補足`）とする。採用技術はメジャーバージョンまで書き、`specdojo-lp` の `package.json` と一致させる。少なくとも次を含む。
  - 言語・ランタイム: TypeScript、Node.js（開発は 22.13.0 以上、ビルドは 22.12.0 以上）
  - Web フレームワーク: Astro（静的出力）
  - スタイル: Tailwind CSS と、`src/styles/global.css` の Material 3 のテーマ
  - コードフォーマット・lint・型検査: Prettier（Astro・Tailwind CSS の plugin）、ESLint（`typescript-eslint`・`eslint-plugin-astro`）、`astro check`
  - ホスティング: Cloudflare Workers の静的アセット（利用者が決めた。独自ドメインは `specdojo.org`。設定の詳細は [[prj-0002:pjr-ym7m-lp-cloudflare-deploy]] の `tsd-<term>` に委ねる）
  - ソースコード管理: GitHub（GitHub flow。`main` を公開している状態とする）
  - 画像などのアセット: `specdojo-assets` で原本を管理し、使うものだけを書き出す
- 採用が確定した技術だけを書く。候補や検討中のものは書かない。
- `補足` に、詳細の `tsd-<term>` へのリンクを書く（まだ無いものは書かない）。
- `specdojo-lp` の README から `tsd-index.md` へ案内している。
- 接続情報・API キー・機密の URL を書かない。
- 変更は `specdojo-lp` の統合先（`feature/lp-v1`）へ入れる。`npm run format:check` が通る。

## 3. 作業内容

| No  | 作業                                       | 担当         | 状態 | メモ                   |
| --- | ------------------------------------------ | ------------ | ---- | ---------------------- |
| 1   | `tsd-index.md` を書き、README から案内する | DEV          | done | -                      |
| 2   | `format:check` とビルドを確かめる          | orchestrator | done | sandbox の外で確認した |

## 4. 対応結果

- `specdojo-lp` に `docs/ja/product/030-architecture/020-infrastructure/tsd-index.md` を作成した。frontmatter は `id: tsd-index`・`type: architecture`・`status: draft`・`rulebook: specdojo:tsd-index-rulebook` とした。
- `技術スタック一覧` は表 1 つで、列を `区分`・`採用技術`・`担当責務`・`補足` とした。メジャーバージョンは `specdojo-lp` の `package.json` に合わせた（TypeScript 6.x、Node.js 22.x、Astro 7.x、Tailwind CSS 4.x、Prettier 3.x、ESLint 10.x、`@astrojs/check` 0.9.x など）。Material 3 のテーマ、Cloudflare Workers（静的アセット、`specdojo.org`）、GitHub（GitHub flow）、specdojo-assets も載せた。
- Cloudflare の詳細の `tsd-<term>` はまだ無いため、リンクは書かず [[prj-0002:pjr-ym7m-lp-cloudflare-deploy]] で作成した時点で足す。
- `specdojo-lp` の README の冒頭から `tsd-index.md` へ案内した。
- executor の作業環境で `npm run format:check` と `npm run build` が通ることを確かめた。作業内容 No.2 の確認は orchestrator が行う。

### 4.1. orchestrator の確認（2026-10-12）

- exec run は `waiting` に止まらず、runner が `specdojo-lp` の `feature/lp-v1` へ統合した（7113ae0）。runner の親検証 7 種はすべて passed だった。
- orchestrator が sandbox の外で 7113ae0 の `npm run format:check` とビルドを実行し、どちらも成功した。差分は `tsd-index.md` の追加と README の案内の 2 行だけである。
- 一覧の採用技術のメジャーバージョンが `specdojo-lp` の `package.json`（Astro 7・Tailwind CSS 4・TypeScript 6・Prettier 3・ESLint 10・`typescript-eslint` 8・`@astrojs/check` 0.9 など）と一致することを確かめた。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 技術スタックの決定。
- [[prj-0002:pjr-2cqc-lp-dev-environment]]: 整形・lint・型検査の道具。
- [[prj-0002:pjr-hktj-assets-repository]]: アセットを specdojo-assets で管理する決定。
- [[prj-0002:pjr-ym7m-lp-cloudflare-deploy]]: Cloudflare への配置。
