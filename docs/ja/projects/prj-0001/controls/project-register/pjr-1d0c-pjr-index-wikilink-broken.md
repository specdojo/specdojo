---
specdojo:
  id: prj-0001:pjr-1d0c-pjr-index-wikilink-broken
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: issue
  item_status: in-progress
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

| 項目     | 内容                                                                                                                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 原因     | `doc-index build`が`generated/`配下を走査しないため、非追跡になった一覧を指すIDが解決先を持たなくなった                                                                                                                                                                                                            |
| 対応策   | _TODO_: 候補は (a) `doc-index build`の走査対象へ`generated/`を含める、(b) `part_of`とwikilinkの参照先IDを廃止し登録簿への参照方法自体を変える、(c) 追跡ファイルとして`prj-0001:pjr-index`専用の薄いプレースホルダ文書を残す。[[prj-0001:pjr-gh26-ledger-review-alternative]]の台帳参照手段の検討と合わせて評価する |
| 依存事項 | [[prj-0001:pjr-gh26-ledger-review-alternative]]（台帳参照手段の決定）と評価対象が重なる                                                                                                                                                                                                                            |
| 完了条件 | `prj-0001:pjr-index`を参照する全箇所（個票`part_of`60件、wikilink10箇所）が解決可能になっている。wikilink解決を検証する自動チェックが追加され、再発時にCIで検知できる                                                                                                                                              |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-es57-register-file-ssot-migration]]: 分割元の移行タスク
- [[prj-0001:pjr-rzr3-pjr-index-as-generated-view]]: 追跡版一覧を非追跡化した変更
- [[prj-0001:pjr-9p5q-migrate-existing-register-items]]: 追跡版`pjr-index.md`を削除した変更
- [[prj-0001:pjr-gh26-ledger-review-alternative]]: 台帳参照手段の検討（評価対象が重なる）
