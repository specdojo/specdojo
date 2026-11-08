---
specdojo:
  id: prj-0001:pjr-0f94-dashboard-action-first-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: waiting
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T14:34:25Z"
  block_reason: "parent validation failed: test-integration"
---

# PJR-0F94 ダッシュボードを、人の対応とおすすめと実行中の epic を先に見せる構成に直す

## 1. 概要

dashboard build が作るダッシュボードを、人の対応が要るもの・おすすめの登録項目（リンク付き）・実行中の epic を先に出し、終わった epic・routine の定義・Grade の表・全体の集計を折りたたむ構成に直す

## 2. 入力

- 利用者の要望（2026-11-08）: 見たいものが表示されておらず使っていない。最初はおすすめの register をリンク付きで、schedule は今実行中の epic を表示し、epic ごとに完了したものは折りたたみ、Grade も折りたたむ。
- orchestrator の案を indie が推奨どおりと決定（2026-11-08）: 先頭に「人の対応が要るもの」を足す。おすすめは先行の項目がそろったものだけにし deferred を外す。実行中の epic は段ごとの数と次に流せるタスク 3 件まで。
- 今の問題: 集計が先でおすすめは 6 番目、ID がコードの書式でリンクがない、review と人の判断待ちが出ない、進捗率がプロジェクト全体の 1 つだけ、終わった epic も並ぶ、routine の定義が全部出る、Grade が 327 行、登録簿の件数は判断に使わない。

## 3. 完了条件

- `specdojo dashboard build` が作る `dashboard.md` の章を、次の順と既定の開き方にしている。折りたたみは VitePress の `::: details` で書く。
  1. 人の対応が要るもの（開く）: `review` の項目（close の確認待ち）、人の判断を待つ open の `decision`・`question`、`waiting` の項目、人が行う schedule のタスク（execution が human のもの）。それぞれ個票または plan へのリンクと、次にすることを 1 行で書く。
  2. おすすめの登録項目（開く）: 先行の項目（`depends_on`）がすべて終わり、`deferred`・`rejected`・終端でない着手できるものだけを、今のおすすめ順で 10 件。個票へのリンクと理由を書く。
  3. 実行中の epic（開く）: open の epic ごとに、track の段ごとの done と全体の数（例: 作成 3/8）、次に流せる schedule のタスクを 3 件まで、子の項目の状態。終わった子の項目は折りたたむ。
  4. 終わった epic（折りたたみ）: 一覧。
  5. routine（開く）: 直近 24 時間に失敗したものと、次に動くもの。失敗がなければその旨を 1 行で書く。routine の定義の一覧は折りたたむ。
  6. Grade（開く）: verdict ごとの件数と、点の低い 5 件。全体の表は折りたたむ。
  7. 全体の集計（折りたたみ）: Schedule の進捗率と状態別の件数、登録簿の状態別・優先度別の件数、ガントチャート。
  8. 実行記録（開く）: 一覧へのリンク 1 行。
- 個票・plan・成果物へのリンクは、`dashboard.md` からの相対パスで、文書サイトで開けるものにしている。ID はリンクの表示名にする。
- 項目がない章は、章を消さずに「ありません」の 1 行を出す。
- 単体テスト（`tests/src/dashboard/dashboard.test.ts` など）で、章の順、折りたたみ、おすすめから先行の項目がそろわないものと `deferred` が外れること、人の対応が要るものに review と人の判断待ちが出ることを確かめている。
- 空のリポジトリ（`config init` と `register scaffold` の直後）で `dashboard build` を流し、項目のない章が「ありません」で出て、エラーにならないことを確かめ、結果を個票の対応結果に書いている。
- prj-0001 で `dashboard build` を流し、生成された `dashboard.md` が `npm run lint:md` を通り、文書サイトで折りたたみとリンクが働くことを確かめている（`npm run docs:build` が通る）。
- ガイドやリファレンスにダッシュボードの章の説明があれば、新しい構成に合わせている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。
- `npm run typecheck`・`npm run lint:ts`・`npm run test:unit` が通り、親の検証 `test-integration` も通る。

## 4. 作業内容

| No  | 作業                                                            | 担当   | 状態 | メモ |
| --- | --------------------------------------------------------------- | ------ | ---- | ---- |
| 1   | 今の生成の処理と、人の対応・おすすめ・epic の材料の取り方を読む | _TODO_ | open | -    |
| 2   | 章の順と折りたたみとリンクを直し、テストを足す                  | _TODO_ | open | -    |
| 3   | 空のリポジトリと prj-0001 で生成して確かめ、対応結果に書く      | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- 生成物: `docs/ja/projects/prj-0001/execution/generated/dashboard.md`
- コマンド: [[specdojo:command-reference]] の `dashboard build`
