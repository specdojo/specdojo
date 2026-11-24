---
specdojo:
  id: prj-0001:pjr-98hs-docs-site-next-channel
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T12:07:47Z"
  completed_at: "2026-11-23T13:02:44Z"
  conclusion: 本番（リリースの版、/specdojo/）はそのまま、公開用のブランチ site/next の文書を /specdojo/next/ に並べて公開した。deploy.yml はタグ・site/next の push・手動の実行のどれでも 2 つの版をビルドしてまとめる。開発中の版は帯とリリースの版へのリンクを出し、noindex にする。github-pages の環境に site/next を足した
  commit_type: feat
  commit_scope: docs-site
---

# PJR-98HS 開発中の版の文書サイトを /next/ に並べて公開する

## 1. 概要

本番はリリースの版のまま、site/next ブランチの文書を /specdojo/next/ に公開し、開発中の機能の文書を見せる。帯と noindex で本番と見分ける

## 2. 入力

- 利用者の依頼（2026-11-23）: 開発中の機能の文書を見せたい。早く実現したいので、オーケストレーターが案を作って実装する（実装者はオーケストレーター）

## 3. 完了条件

- 本番の文書サイト（`https://specdojo.github.io/specdojo/`）はリリースの版のまま残し、開発中の版を `https://specdojo.github.io/specdojo/next/` に並べて公開する（利用者の決定、2026-11-23）。
- 開発中の版は、公開用のブランチ `site/next` の文書をビルドする。`site/next` は、出したいときに develop から fast-forward する（develop の commit のたびには更新しない）。
- `.github/workflows/deploy.yml` は、リリースのタグ（`v*`）の push、`site/next` の push、手動の実行のどれでも、2 つの版をビルドして 1 つの成果物にまとめて公開する。本番は `main` に入っている最新のリリースのタグから、`/next/` は `site/next` からビルドする。
- docs-site は、公開のパス（`base`）と版の種類を環境変数で変えられる（既定は今までどおり `/specdojo/`）。開発中の版では、全ページの上に「開発中の版」の帯とリリースの版へのリンクを出し、ナビゲーションにリリースの版へのリンクを足し、検索エンジンに載せない（`noindex`）。
- docs-site の環境変数の解決を単体テストで確かめる。開発中の版を `base` `/specdojo/next/` でビルドし、帯と `noindex` が出ること、ページ間のリンクが `/specdojo/next/` の下で解決することを確かめる。
- 運用メモのリリースの手順に、`site/next` の更新の仕方を足す。
- `CHANGELOG.md` は変えない。個票の対応結果に「CHANGELOG に書く事項」の小節を作り、区分と行の文案を書く。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit`・`npm run lint:md` を通す。

## 4. 作業内容

| No  | 作業                                                                  | 担当         | 状態 | メモ                                                        |
| --- | --------------------------------------------------------------------- | ------------ | ---- | ----------------------------------------------------------- |
| 1   | docs-site の公開のパスと版の種類を環境変数で決め、帯と noindex を足す | orchestrator | done | `site-channel.ts`・`NextChannelBanner.vue`・単体テスト 8 件 |
| 2   | `deploy.yml` を 2 つの版のビルドとまとめた公開に変える                | orchestrator | done | 本番は main 上の最新のタグ、`/next/` は `site/next`         |
| 3   | `github-pages` の環境の公開を許すブランチに `site/next` を足す        | orchestrator | done | 利用者の承認のもと `gh api` で足した                        |
| 4   | 運用メモのリリースの手順に `site/next` の更新の仕方を足す             | orchestrator | done | 9.1. 文書サイトの 2 つの版                                  |
| 5   | `site/next` を push して公開を確かめる                                | 利用者       | done | run 45177442046 が成功。本番と `/next/` の表示を確かめた    |

## 5. 対応結果

- docs-site に `SPECDOJO_DOCS_CHANNEL`・`SPECDOJO_DOCS_BASE`・`SPECDOJO_DOCS_STABLE_URL` を足した（既定は今までどおり `/specdojo/`）。開発中の版では、全ページの上の帯、ナビゲーションの「リリースの版」へのリンク、`noindex, nofollow` の meta を出す。
- `.github/workflows/deploy.yml` は、リリースのタグ・`site/next` の push・手動の実行で、本番（`main` 上の最新の `v*` タグ）と開発中の版（`site/next`）をビルドし、1 つの成果物にまとめて公開する。
- `github-pages` の環境の公開を許すブランチに `site/next` を足した（`main`・`v*` のタグに加えて）。
- 確かめ: 手元で開発中の版をビルドし（209 秒）、noindex・帯・リンクが `/specdojo/next/` の下で解決することを確かめた。公開のワークフロー（run 45177442046）が成功し、本番（`https://specdojo.github.io/specdojo/`）に帯と noindex が出ないこと、`/next/` に出ることを確かめた。
- 本番は v0.9.2 からビルドしているため、本番から開発中の版へのリンクは v0.10.0 のリリースから出る。

CHANGELOG に書く事項:

- 区分: Added
- 文案: 文書サイトの公開のパスと版の種類を環境変数（`SPECDOJO_DOCS_BASE`・`SPECDOJO_DOCS_CHANNEL`・`SPECDOJO_DOCS_STABLE_URL`）で変えられるようにした。開発中の版では帯とリリースの版へのリンクを出し、検索エンジンに載せない。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
