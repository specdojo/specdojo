---
specdojo:
  id: prj-0001:pjr-e8fy-docs-build-sidebar-scope
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: DEV
  registered_at: "2026-09-26T23:23:14Z"
  completed_at: "2026-09-27T04:02:11Z"
  block_reason: "agent exited with non-zero code: The sandbox refused edits to `packages/docs-site/.vitepress/config.mts`, preventing the primary sidebar changes required by the plan. Additionally, the runner validati…"
  conclusion: サイドバーから実行記録を外しパス別に分割、metaChunk でサイト設定を切り出した。既定ヒープで docs:build が成功し dist は 2.9GB→568MB、代表ページは 1.4MB→120KB。実行記録は exec-records.md から辿れる
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
| 1   | `packages/docs-site/.vitepress/config.mts` のサイドバー生成で、実行記録を除外する                | DEV  | done | `isExecRecordPath` と同じ判定を再利用する |
| 2   | 実行記録ページを一覧ページから辿れることを確認し、辿れない場合は既存の生成一覧への導線を追加する | DEV  | done | dashboard / execution/generated を確認    |
| 3   | `sidebar` をパスをキーとする形式へ変更し、specdojo と各 project を分ける                         | DEV  | done | ja / en の両方                            |
| 4   | 変更前後の dist 容量・代表ページ容量・ビルド時間を計測する                                       | DEV  | done | -                                         |

## 4. 対応結果

- 実行記録の除外（案 A）: `transformSidebar` で `isExecRecordPath` に当たる項目をサイドバーから除き、子が空になった「実行プラン」「実行結果」グループも表示しないようにした。
- 実行記録への導線: 既存の一覧ページには plan / result へのリンクがなかった。そこで `specdojo dashboard build` が `execution/generated/exec-records.md`（実行記録一覧。開始日時の新しい順に plan / result へリンク）を生成し、ダッシュボードの「実行記録」節からリンクするようにした。サイドバーでは「実行記録一覧」として実行管理の下に出る。
- パスごとの分割（案 B）: `sidebar` をパスをキーとする形式に変えた。`/ja/specdojo/` は specdojo の節だけ、`/ja/projects/<id>/` はその project の節だけ、その他のトップレベル（product など）はそのディレクトリの節だけを出す。`/ja/` のトップは各節の入口リンクだけを出す。英語版も同じ関数で分割する。
- サイト設定のインライン展開の解消: VitePress は既定でサイト設定（サイドバー全体を含む）とページのハッシュ表を全ページの HTML にインラインで埋め込む。パスごとに分けても全キーが各ページへ載るため、`metaChunk: true` で共有の JS チャンク（`metadata.*.js`、約 344KB）へ切り出した。
- 確認結果（ビルド出力 2,175 ページを走査）:
  - どのページのサイドバーにも実行記録（plan / result / events）へのリンクはない。サイト設定のチャンクにも含まれない。
  - `/ja/specdojo/` 配下で project の節を含むページは 0 件だった。`/ja/projects/prj-0001/` 配下で project の節を欠くページも 0 件だった。
  - 実行記録のページは引き続きビルドされ、実行記録一覧から result 555 件へリンクしている。
- `.github/workflows/deploy.yml` は `npm run docs:build` を `NODE_OPTIONS` なしで実行しており、変更は不要である。

| 項目                                    | 変更前                                | 変更後                                  |
| --------------------------------------- | ------------------------------------- | --------------------------------------- |
| 既定ヒープでの `npm run docs:build`     | メモリ不足で失敗                      | 成功（`NODE_OPTIONS` 未設定）           |
| dist 容量                               | 2.9GB                                 | 568MB                                   |
| `specdojo-overview-guide.html`          | 1,405,099 byte                        | 119,895 byte                            |
| 最大ページ                              | 未計測                                | 775,429 byte（`sch-track-launch.html`） |
| ビルド時間（`docs:build` 全体、実時間） | 193 秒（`--max-old-space-size=8192`） | 413 秒（user 205 秒、sys 20 秒）        |

- 変更前の値は本個票の概要に記録された計測値である。ビルド時間は計測環境（agent サンドボックス内）が異なり、実時間は CPU 時間を大きく上回っていた。同じ条件で比較できていないため、時間の増減は判断できない。同じ環境で変更前後を計測し直す必要がある。
- 初回のビルドでは Mermaid SVG の再生成が走ったため 686 秒かかった。2 回目の計測値を上表に記載した。

## 5. 関連ドキュメント

- `packages/docs-site/.vitepress/config.mts`（サイドバーと検索の設定）
- `.github/workflows/deploy.yml`（公開時のビルド）
