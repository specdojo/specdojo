---
specdojo:
  id: prj-0002:pjr-ym7m-lp-cloudflare-deploy
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0002:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-10-12T13:14:13Z"
  due_on: "2026-10-31"
---

# PJR-YM7M LP を Cloudflare に配置する設定を行う

## 1. 概要

specdojo-lp を Cloudflare Workers の静的アセットとして配置する設定（wrangler.jsonc、Workers Builds による GitHub 連携、本番とプレビューのブランチ、Node.js の版、独自ドメイン）を行う。本番の公開は 0.3.0 の公開を待つ

### 1.1. 前提（2026-10-12）

- 公開先は Cloudflare 上の静的サイトとする（[[prj-0002:pjr-fv3w-lp-tech-stack]]）。
- Astro の公式ガイドは、新しいプロジェクトには Cloudflare Pages ではなく Cloudflare Workers（静的アセット）を勧めている。静的なサイトではアダプターは要らず、`wrangler.jsonc` の `assets.directory` に `./dist` を指定し、Git 連携は Workers Builds で行う（<https://docs.astro.build/en/guides/deploy/cloudflare/>）。
- `specdojo-lp` は GitHub flow で運用し、`main` を公開している状態とする。今の作業は `feature/lp-v1` にある。
- 本番の公開（`main` への取り込みと配置）は、specdojo 0.3.0 の npm への公開を待つ。

## 2. 完了条件

- 配置の形: Cloudflare Workers の静的アセットとする（Astro の公式ガイドの推奨）。Cloudflare Pages を使う場合は、理由を対応結果に書く。
- `specdojo-lp` に次がある。`package.json` の変更は exec の保護の対象のため、orchestrator が行う。
  - `wrangler` を devDependencies に入れている。
  - `wrangler.jsonc` に、`name`・`compatibility_date`・`assets.directory`（`./dist`）を書いている。404 のページを用意する場合は `assets.not_found_handling` も書く。
  - 手元で `npm run build` の後に `npx wrangler dev` を実行し、LP が表示されることを確かめている。
- Cloudflare のダッシュボード（利用者が行う）で、`specdojo/specdojo-lp` を Workers Builds に連携している。
  - ビルドのコマンドは `npm run build`、配置のコマンドは `npx wrangler deploy` とする。
  - 本番のブランチは `main` とする。`feature/lp-v1` などの本番以外のブランチは、プレビューとして配置されるようにし、プレビューの URL で LP を確かめている。
  - ビルドで使う Node.js の版を 22.13.0 以上にしている（指定の方法は、設定するときに Cloudflare の公式の文書で確かめる）。
- _UNDECIDED_: 独自ドメイン（使うか、使う場合のドメイン名）は利用者が決める。
- 認証情報（API トークンなど）をリポジトリや個票に書かない。Cloudflare への認証は、利用者がダッシュボードや `wrangler login` で行う。
- 設定の内容を、`specdojo-lp` の `tsd-<term>`（例: `tsd-cloudflare-workers.md`）にまとめ、[[prj-0002:pjr-4zsn-lp-tech-stack-tsd]] の `tsd-index` から参照できるようにしている。
- 本番の公開は 0.3.0 の公開の後とし、`main` へ取り込んで配置したら、本番の URL で表示を確かめている。

## 3. 作業内容

| No  | 作業                                                        | 担当         | 状態 | メモ                                      |
| --- | ----------------------------------------------------------- | ------------ | ---- | ----------------------------------------- |
| 1   | 配置の形（Workers）を確かめて決める                         | DEV          | open | 利用者の確認                              |
| 2   | `wrangler` と `wrangler.jsonc` を加え、手元で表示を確かめる | orchestrator | open | `package.json` の変更は利用者の承認を得る |
| 3   | Cloudflare のダッシュボードで Workers Builds に連携する     | 利用者       | open | 認証を伴う                                |
| 4   | プレビューの URL で表示を確かめる                           | orchestrator | open | -                                         |
| 5   | 独自ドメインを決めて設定する                                | 利用者       | open | -                                         |
| 6   | 設定の内容を `tsd-<term>` にまとめる                        | DEV          | open | -                                         |
| 7   | 0.3.0 の公開の後、`main` へ取り込んで本番に配置する         | 利用者       | open | -                                         |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- [[prj-0002:pjr-fv3w-lp-tech-stack]]: 公開先を Cloudflare 上の静的サイトとした決定。
- [[prj-0002:pjr-g4qn-lp-tech-stack-evaluation]]: Cloudflare への配置のしやすさの比較。
- [[prj-0002:pjr-4zsn-lp-tech-stack-tsd]]: LP の技術スタックの TSD。
- [[prj-0001:pjr-zdvq-product-repo-branch-strategy]]: `specdojo-lp` のブランチ運用の根拠。
