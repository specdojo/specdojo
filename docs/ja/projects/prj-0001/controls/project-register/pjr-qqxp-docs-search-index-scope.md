---
specdojo:
  id: prj-0001:pjr-qqxp-docs-search-index-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T23:38:14Z"
---

# PJR-QQXP VitePress のローカル検索から不要な文書を外して高速化する

## 1. 概要

サイト（VitePress）の検索が遅い。ローカル検索は、ビルド時に作ったインデックスを検索を開いたときにブラウザが読み込んで展開する方式である。2026-09-26 のビルドで、ja のインデックス（`@localSearchIndexja.*.js`）は 9,783,822 byte、9,133 セクションあった。

インデックスに入っている主な文書と、元になる Markdown の容量は次のとおりである。

| 対象                                                            | セクション数 | 元の Markdown | 検索での必要性                                             |
| --------------------------------------------------------------- | ------------ | ------------- | ---------------------------------------------------------- |
| 登録簿の個票（`controls/project-register/pjr-*.md`、430 件）    | 3,453        | 約 2.6MB      | _UNDECIDED_ 個票を検索対象に残すかは作業前に利用者が決める |
| 登録簿の生成ビュー（`pjr-index` と `pjr-views-by-*` の計 4 本） | 30           | 約 1.2MB      | 不要。個票の一覧を並べ替えただけで、内容は個票と重複する   |
| 管理ログ（`controls/generated/pm-*`）                           | 4            | 約 42KB       | 不要。登録簿から生成しており、内容は個票と重複する         |
| specdojo の文書（rulebook / standard / guide など）             | 残りの大半   | 約 3.1MB      | 必要                                                       |

実行記録（`execution/exec/` 配下）は、`renderSearchHtml` によってすでにインデックスから除外している。`specdojo/templates/generated/` は YAML テンプレートを表示するための唯一のページなので、検索対象に残す。

`tokenizeSearchText` は空白と記号だけで区切る。日本語の文は区切られずに長い語のまま登録されるため、インデックスが大きくなり、前方一致・あいまい検索も遅くなっている可能性がある。ただし、分かち書きを変えると検索の当たり方が変わるので、本項目では扱わない。必要なら別の項目として起票する。

## 2. 完了条件

- 登録簿の生成ビュー（`pjr-index`、`pjr-views-by-*`）と管理ログ（`controls/generated/pm-*`）が検索インデックスに含まれない。ページそのものは引き続き公開される。
- 登録簿の個票の扱いは、作業前に利用者が決めた方針（残す / 外す）に従っている。
- 除外の判定が、特定のファイル名の列挙ではなく、生成物であることを示す条件（`generated/` 配下など）か frontmatter の `search: false` で表されている。どちらを使うかと、その理由が対応結果に記録されている。
- 変更前後の ja インデックスの容量とセクション数を、対応結果に記録する。
- 残した文書（例: rulebook の ID、specdojo の文書 ID、`specdojo:pjr-rulebook` のような doc id）が、変更後も検索で見つかる。
- `npm run docs:build` と `npm run typecheck` が成功する。

## 3. 作業内容

| No  | 作業                                                                  | 担当 | 状態 | メモ                                |
| --- | --------------------------------------------------------------------- | ---- | ---- | ----------------------------------- |
| 1   | 登録簿の個票を検索対象に残すか、利用者に確認する                      | DEV  | open | 作業前に確認する                    |
| 2   | `renderSearchHtml` の除外条件へ、登録簿の生成ビューと管理ログを加える | DEV  | open | `isExecRecordPath` と同じ場所で扱う |
| 3   | 変更前後のインデックス容量・セクション数を計測する                    | DEV  | open | -                                   |
| 4   | 残した文書が検索で見つかることを確認する                              | DEV  | open | -                                   |

## 4. 対応結果

-

## 5. 関連ドキュメント

- `packages/docs-site/.vitepress/config.mts`（`renderSearchHtml`、`tokenizeSearchText`）
- PJR-E8FY（docs:build のサイドバー軽量化。同じ設定ファイルを変更する）
