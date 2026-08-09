---
specdojo:
  id: prj-0001:pjr-1d0c-pjr-index-wikilink-broken
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: review
  priority: high
  owner: ARC
  registered_on: "2026-08-09"
  due_on: "2026-08-31"
---

# PJR-1D0C 個票のpart_ofとwikilinkがprj-0001:pjr-indexを参照できない

## 1. 課題内容

[[prj-0001:pjr-rzr3-pjr-index-as-generated-view]] が追跡対象の `pjr-index.md` を `generated/` 配下の非追跡ビューへ移し、[[prj-0001:pjr-9p5q-migrate-existing-register-items]]（2026-08-09）が追跡版 `pjr-index.md` 本体を削除した。これにより、文書ID `prj-0001:pjr-index` を参照する箇所（個票 60 件の `part_of` と、本文中の wikilink 10 箇所。PJR-9P5Q・PJR-RZR3 自身の `5. 関連ドキュメント` を含む）が解決不能になっている。

`doc-index build` は `docs/**/generated/` を走査対象から除外するため、`prj-0001:pjr-index` は現状どの追跡ファイルにも存在しない。VitePress の wikilink 変換（`.vitepress/config.mts` の `specdojo_wikilink` ルール）は未解決 ID を検出してもビルドを失敗させず、画面に生の `[[prj-0001:pjr-index]]` という文字列をそのまま表示するだけになる。CI・lint のどの既存チェック（`lint:fm` / `validate-history-links` / `catalog validate` 等）もこのケースを検出しない。

## 2. 影響範囲

| 観点         | 影響                                                                               |
| ------------ | ---------------------------------------------------------------------------------- |
| スコープ     | 個票60件の`part_of`と本文wikilink10箇所の参照が解決不能。表示上のリンク切れ        |
| スケジュール | ビルド・CIは失敗しないため検知が遅れやすい。放置期間が長いほど参照箇所が増える恐れ |
| コスト       | 解決方式の決定と実装が必要（既存個票の一括置換を伴う可能性）                       |
| 品質         | ドキュメントサイトで生の`[[id]]`文字列が利用者に見える状態が既に発生している       |
| 関係者       | ドキュメント参照者・レビュアー                                                     |

## 3. 対応方針

| 項目     | 内容                                                                                                                                                                                                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 原因     | `doc-index build`が`generated/`配下を走査しないため、非追跡になった一覧を指すIDが解決先を持たなくなった                                                                                                                                                                                                                |
| 対応策   | (c) を採用し、`prj-0001:pjr-index`を持つ追跡対象の案内ページを`project-register/pjr-index.md`として置く。登録項目の値は持たせず、非追跡の`generated/pjr-index.md`へ案内する。(a) は生成ページとYAML正本のID重複を招き、(b) は既存の参照規約と全個票の変更を伴うため採用しない。`register scaffold`も同じ構成を生成する |
| 依存事項 | [[prj-0001:pjr-gh26-ledger-review-alternative]]は完了済み。同項目の`register history`は台帳の変更追跡を担い、本項目の文書ID解決は案内ページが担うため、役割を分離した                                                                                                                                                  |
| 完了条件 | `prj-0001:pjr-index`を参照する全箇所（実行時点で個票`part_of`187件、本文wikilink10箇所）が解決可能になっている。実リポジトリからdoc-indexを再構築して`part_of`と対象wikilinkを検証する回帰テストが追加され、再発時にCIで検知できる                                                                                     |

## 4. 対応結果

- `prj-0001:pjr-index`を持つ追跡対象の`pjr-index.md`を案内ページとして復元した。`specdojo index lookup prj-0001:pjr-index`は同ファイルを返し、個票187件の`part_of`と本文wikilink10箇所が同じIDで解決できるようになった。
- 一覧の値は案内ページへ戻さず、個票Frontmatterを正本、`generated/pjr-index.md`を非追跡の派生ビューとする構成を維持した。案内ページから生成一覧へ相対リンクで移動できる。
- `register scaffold`が追跡対象の案内ページと非追跡の生成一覧を併せて作るようにした。移行後の`register migrate`は案内ページを旧一覧と誤認せず、再実行時にno-opとなる。
- `tests/src/doc-index.test.ts`に、実リポジトリのdoc-indexを再構築し、登録簿個票の全`part_of`と`prj-0001:pjr-index`へのwikilinkが追跡文書へ解決することを確認する回帰テストを追加した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]: 追跡版一覧を非追跡化した変更
- [[prj-0001:pjr-9p5q-migrate-existing-register-items]]: 追跡版`pjr-index.md`を削除した変更
- [[prj-0001:pjr-gh26-ledger-review-alternative]]: 台帳参照手段の検討（評価対象が重なる）
