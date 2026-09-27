---
specdojo:
  id: prj-0001:pjr-e8fy-docs-build-sidebar-scope
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T23:23:14Z"
  block_reason: "agent exited with non-zero code: The sandbox refused edits to `packages/docs-site/.vitepress/config.mts`, preventing the primary sidebar changes required by the plan. Additionally, the runner validati…"
---

# PJR-E8FY docs:build のサイドバーから実行記録を外しパスごとに分割する

## 1. 概要

`npm run docs:build` が既定ヒープでメモリ不足になる。`NODE_OPTIONS=--max-old-space-size=8192` では通るが、193 秒かかる。

原因はサイドバーである。全 2,038 項目のサイドバーが、2,167 ページすべての HTML に埋め込まれている。

- 1 ページの HTML は約 1.4MB あり、大半がサイドバーである（例: `specdojo-overview-guide.html` は 1,405,099 byte）。
- 出力先 `packages/docs-site/.vitepress/dist` は 2.9GB になる。ページ数 × サイドバーの大きさでほぼ説明できる。
- サイドバー項目の内訳は、実行記録（`execution/exec/` 配下の plan / result）が 1,067、登録簿の個票が 425、specdojo の文書が 174 である。

ページ内検索は `renderSearchHtml` で実行記録をすでに除外している。登録簿の生成ビュー（各約 300KB、4 本）はページ数が少なく、主因ではない。

利用者は次の 2 案を組み合わせて採る判断をした。

- A: 実行記録（plan / result / events）をサイドバーから外す。ページは公開したまま、dashboard などの一覧ページから辿れるようにする。
- B: サイドバーをパスごとに分ける。`/ja/specdojo/` の配下には specdojo の節だけを、`/ja/projects/<id>/` の配下にはその project の節だけを出す。英語版の構成も同じ方針に揃える。

実行記録を `srcExclude` で公開対象から外す案（C）は、サイトで記録を閲覧できなくなる設計判断を伴うため、本項目の範囲外とする。

## 2. 完了条件

- 実行記録（`execution/exec/` 配下の plan / result / events）へのリンクが、どのページのサイドバーにも含まれない。
- 実行記録のページは引き続きビルドされ、サイトのいずれかの一覧ページから辿れる。
- `/ja/specdojo/` 配下のページのサイドバーには specdojo の節だけが出て、project の節が出ない。
- `/ja/projects/<id>/` 配下のページのサイドバーには、その project の節が出る。
- `NODE_OPTIONS` を指定しない既定の状態で `npm run docs:build` が成功する。
- 変更前後の dist 容量、代表ページ（`specdojo-overview-guide.html`）の HTML 容量、ビルド時間を対応結果へ記録する。
- `.github/workflows/deploy.yml` の `docs:build` が、変更なしでそのまま通る構成になっている。
- `npm run typecheck` と `npm run lint:md` が成功する。

## 3. 作業内容

| No  | 作業                                                                                             | 担当 | 状態 | メモ                                      |
| --- | ------------------------------------------------------------------------------------------------ | ---- | ---- | ----------------------------------------- |
| 1   | `packages/docs-site/.vitepress/config.mts` のサイドバー生成で、実行記録を除外する                | DEV  | open | `isExecRecordPath` と同じ判定を再利用する |
| 2   | 実行記録ページを一覧ページから辿れることを確認し、辿れない場合は既存の生成一覧への導線を追加する | DEV  | open | dashboard / execution/generated を確認    |
| 3   | `sidebar` をパスをキーとする形式へ変更し、specdojo と各 project を分ける                         | DEV  | open | ja / en の両方                            |
| 4   | 変更前後の dist 容量・代表ページ容量・ビルド時間を計測する                                       | DEV  | open | -                                         |

## 4. 対応結果

-

## 5. 関連ドキュメント

- `packages/docs-site/.vitepress/config.mts`（サイドバーと検索の設定）
- `.github/workflows/deploy.yml`（公開時のビルド）
