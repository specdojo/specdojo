---
specdojo:
  id: prj-0001:pjr-qqxp-docs-search-index-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T23:38:14Z"
---

# PJR-QQXP VitePress のローカル検索から不要な文書を外して高速化する

## 1. 概要

サイト（VitePress）の検索が遅い。ローカル検索は、ビルド時に作ったインデックスを検索を開いたときにブラウザが読み込んで展開する方式である。2026-09-26 のビルドで、ja のインデックス（`@localSearchIndexja.*.js`）は 9,783,822 byte、9,133 セクションあった。

インデックスに入っている主な文書と、元になる Markdown の容量は次のとおりである。

| 対象                                                         | セクション数 | 元の Markdown | 検索での必要性                                        |
| ------------------------------------------------------------ | ------------ | ------------- | ----------------------------------------------------- |
| 登録簿の個票（`controls/project-register/pjr-*.md`、430 件） | 3,453        | 約 2.6MB      | 不要。一覧 `pjr-index` から個票へ辿る（利用者の判断） |
| 登録簿の生成ビュー（`pjr-views-by-*` の 3 本）               | 25           | 約 0.9MB      | 不要。`pjr-index` を並べ替えただけで内容が重複する    |
| 登録簿の一覧（`pjr-index`）                                  | 5            | 約 0.3MB      | 必要。登録簿の検索の入口にする                        |
| 管理ログ（`controls/generated/pm-*`）                        | 4            | 約 42KB       | 不要。登録簿から生成しており、内容は個票と重複する    |
| specdojo の文書（rulebook / standard / guide など）          | 残りの大半   | 約 3.1MB      | 必要                                                  |

登録簿は、一覧 `pjr-index` だけを検索対象とし、個票へはそのリンクから辿る。利用者がこの方針を決めた。個票の本文（検討した選択肢、採択理由、対応結果など）は検索できなくなる。また、`pjr-index` は 1 つの見出しの下に全項目が並ぶため、検索で飛んだ先から該当する行を探すにはブラウザのページ内検索を使う。

実行記録（`execution/exec/` 配下）は、`renderSearchHtml` によってすでにインデックスから除外している。`specdojo/templates/generated/` は YAML テンプレートを表示するための唯一のページなので、検索対象に残す。

`tokenizeSearchText` は空白と記号だけで区切る。日本語の文は区切られずに長い語のまま登録されるため、インデックスが大きくなり、前方一致・あいまい検索も遅くなっている可能性がある。ただし、分かち書きを変えると検索の当たり方が変わるので、本項目では扱わない。必要なら別の項目として起票する。

## 2. 完了条件

- 登録簿の個票、派生ビュー（`pjr-views-by-*`）、管理ログ（`controls/generated/pm-*`）が検索インデックスに含まれない。ページそのものは引き続き公開される。
- 登録簿の一覧 `pjr-index` は検索インデックスに残り、項目のタイトル・説明・結論の語で検索するとヒットする。
- `pjr-index` の個票列のリンクから、各個票へ移動できる。
- 除外の判定が、個票を 1 件ずつ列挙する形ではなく、パスのパターンか、生成時に付ける frontmatter の `search: false` で表されている。`pjr-index` も `generated/` 配下にあるため、`generated/` 配下を一律に除外する条件にはしない。どの方式を採ったかと、その理由を対応結果に記録する。
- 変更前後の ja インデックスの容量とセクション数を、対応結果に記録する。
- 残した文書（例: rulebook の ID、specdojo の文書 ID、`specdojo:pjr-rulebook` のような doc id）が、変更後も検索で見つかる。
- `npm run docs:build` と `npm run typecheck` が成功する。

## 3. 作業内容

| No  | 作業                                                                | 担当 | 状態 | メモ                                   |
| --- | ------------------------------------------------------------------- | ---- | ---- | -------------------------------------- |
| 1   | 登録簿の個票を検索対象に残すか、利用者に確認する                    | DEV  | done | 方針通り除外する                       |
| 1   | `renderSearchHtml` の除外条件へ、個票・派生ビュー・管理ログを加える | DEV  | done | `isExcludedSearchPath` を新設して対応  |
| 2   | 変更前後のインデックス容量・セクション数を計測する                  | DEV  | done | 対応結果に記録                         |
| 3   | 残した文書が検索で見つかることを確認する                            | DEV  | done | `pjr-index` 等のインデックス内包を確認 |

## 4. 対応結果

`packages/docs-site/.vitepress/config.mts` の `renderSearchHtml` にて、`isExcludedSearchPath` 関数を追加し、パスパターンによって対象のファイルを除外する方式を採択した。
理由は、各 Markdown ファイルの frontmatter (`search: false`) で制御する場合、生成処理側のテンプレート変更が必要であり、また `pjr-index.md` は残すといった細かな条件を管理するには `config.mts` 側でパスを元に一元判定する方が確実かつ見通しが良いと判断したためである。

**変更前後の ja インデックス容量**

- 変更前: 9,783,822 byte (9,133 セクション)
- 変更後: 5,927,919 byte (5,621 セクション)

## 5. 関連ドキュメント

- `packages/docs-site/.vitepress/config.mts`（`renderSearchHtml`、`tokenizeSearchText`）
- PJR-E8FY（docs:build のサイドバー軽量化。同じ設定ファイルを変更する）
