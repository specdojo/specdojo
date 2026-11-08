---
specdojo:
  id: prj-0001:pjr-0f94-dashboard-action-first-layout
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-08T14:34:25Z"
---

# PJR-0F94 ダッシュボードを、人の対応とおすすめと実行中の epic を先に見せる構成に直す

## 1. 概要

dashboard build が作るダッシュボードを、人の対応が要るもの・おすすめの登録項目（リンク付き）・実行中の epic を先に出し、終わった epic・routine の定義・Grade の表・全体の集計を折りたたむ構成に直す

## 2. 入力

- 利用者の要望（2026-11-08）: 見たいものが表示されておらず使っていない。最初はおすすめの register をリンク付きで、schedule は今実行中の epic を表示し、epic ごとに完了したものは折りたたみ、Grade も折りたたむ。
- orchestrator の案を indie が推奨どおりと決定（2026-11-08）: 先頭に「人の対応が要るもの」を足す。おすすめは先行の項目がそろったものだけにし deferred を外す。実行中の epic は段ごとの数と次に流せるタスク 3 件まで。
- 今の問題: 集計が先でおすすめは 6 番目、ID がコードの書式でリンクがない、review と人の判断待ちが出ない、進捗率がプロジェクト全体の 1 つだけ、終わった epic も並ぶ、routine の定義が全部出る、Grade が 327 行、登録簿の件数は判断に使わない。

## 3. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 4. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 5. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 6. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
