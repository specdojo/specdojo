---
specdojo:
  id: prj-0002:pjr-4zsn-lp-tech-stack-tsd
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
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

| No  | 作業                                       | 担当         | 状態 | メモ |
| --- | ------------------------------------------ | ------------ | ---- | ---- |
| 1   | `tsd-index.md` を書き、README から案内する | DEV          | open | -    |
| 2   | `format:check` とビルドを確かめる          | orchestrator | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 技術スタックの決定。
- [[prj-0002:pjr-2cqc-lp-dev-environment]]: 整形・lint・型検査の道具。
- [[prj-0002:pjr-hktj-assets-repository]]: アセットを specdojo-assets で管理する決定。
- [[prj-0002:pjr-ym7m-lp-cloudflare-deploy]]: Cloudflare への配置。
