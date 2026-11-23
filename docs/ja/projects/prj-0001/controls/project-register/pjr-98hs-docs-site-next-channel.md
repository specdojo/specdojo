---
specdojo:
  id: prj-0001:pjr-98hs-docs-site-next-channel
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-23T12:07:47Z"
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

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
