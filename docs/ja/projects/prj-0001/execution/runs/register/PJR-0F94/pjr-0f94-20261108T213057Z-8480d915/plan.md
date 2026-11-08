---
specdojo:
  id: prj-0001:xep-pjr-0f94-20261108t213057z-8480d915
  type: exec-plan
  rulebook: none
  task_id: PJR-0F94
  name: "ダッシュボードを、人の対応とおすすめと実行中の epic を先に見せる構成に直す"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
---

# Edit Plan: PJR-0F94 ダッシュボードを、人の対応とおすすめと実行中の epic を先に見せる構成に直す

## 1. このタスクで行うこと

プロジェクト登録簿の項目 PJR-0F94「ダッシュボードを、人の対応とおすすめと実行中の epic を先に見せる構成に直す」に対応する。

dashboard build が作るダッシュボードを、人の対応が要るもの・おすすめの登録項目（リンク付き）・実行中の epic を先に出し、終わった epic・routine の定義・Grade の表・全体の集計を折りたたむ構成に直す

## 2. 対象項目

- `id`: PJR-0F94
- `type`: todo
- `priority`: medium
- `owner`: _TODO_
- `due`: _TODO_
- `個票`: `docs/ja/projects/prj-0001/controls/project-register/pjr-0f94-dashboard-action-first-layout.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-0F94/pjr-0f94-20261108T213057Z-8480d915/result.md`

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 利用者の要望（2026-11-08）: 見たいものが表示されておらず使っていない。最初はおすすめの register をリンク付きで、schedule は今実行中の epic を表示し、epic ごとに完了したものは折りたたみ、Grade も折りたたむ。
- orchestrator の案を indie が推奨どおりと決定（2026-11-08）: 先頭に「人の対応が要るもの」を足す。おすすめは先行の項目がそろったものだけにし deferred を外す。実行中の epic は段ごとの数と次に流せるタスク 3 件まで。
- 今の問題: 集計が先でおすすめは 6 番目、ID がコードの書式でリンクがない、review と人の判断待ちが出ない、進捗率がプロジェクト全体の 1 つだけ、終わった epic も並ぶ、routine の定義が全部出る、Grade が 327 行、登録簿の件数は判断に使わない。

## 3. 進め方

1. 個票（存在する場合）を読み、目的・完了条件・制約を把握する。登録簿の一覧は大きいため読まない。
2. 個票に完了条件がある場合はそれを作業の基準にする。無い場合はタイトルと説明から完了条件の仮説を立て、記録する。pipeline では個票の対応結果と executor の報告の `handoff` に書き、result を直接書ける実行形式では result に明記する。
3. 関連する成果物・設計書・実装を確認し、対象ファイルを特定して変更する。
4. 個票が存在する場合は、個票の作業内容・対応結果セクションを実施内容で更新する。
5. 個票の完了条件が result への記載を求める場合、pipeline の executor は個票の対応結果と報告の `handoff` の両方に書く。reporter と runner が result の申し送りへ反映する。executor は result を直接編集しない。
6. 判断に迷う箇所は _TODO_ / _ASSUMPTION_ で残し、根拠と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。

### grade result から展開された finding

- なし

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを記録する。pipeline では個票の対応結果と報告の `handoff` に書き、result を直接書ける実行形式では result に書く。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

## 4. 完了手順

1. 「進め方」に従って対応を完了する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result に実施内容・変更ファイル・申し送りを記入する。pipeline では executor は実施内容・変更ファイル・検証結果を報告し、申し送りを `handoff` に記載する。reporter と runner が result を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。
4. 登録簿（`pjr-index.md`）の行と個票のステータス項目は変更しない。状態遷移（review / close など）は runner と人間が行う。

## 5. 異常終了の条件

- 前提不足・対象ファイル不明・静的検査未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は登録簿の状態を変更せず、終了コードと標準エラー出力で runner に結果を返す。

## 再開時の追加の指示（orchestrator、2026-11-09）

- 個票の完了条件に足した 2 回目の分（epic の開始日・終了日・稼働日数を戻し、外した日付のテストを戻す）を行う。
- 空のリポジトリでの確かめは、`mktemp -d` などで作った一時ディレクトリの中だけで行い、終わったら消す。`/tmp` の直下や一時ディレクトリの外に `config init` などの出力を書かない。前回の実行中に `/tmp` の直下へ init の出力が残り、ほかの run のテストが落ちた（PJR-5FTV）。
- 経緯を報告の `handoff` に書く。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
