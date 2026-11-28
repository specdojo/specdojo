---
specdojo:
  id: prj-0001:pjr-4efh-register-commit-slow-investigation
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  registered_at: "2026-11-28T14:35:56Z"
---

# PJR-4EFH register の記帳の --commit が 1 件に 1 分前後かかる原因を調べる

## 1. 概要

register update/close --commit が 1 件に 50〜90 秒かかる。時間の内訳を測り、原因と短くする案をまとめる（調査のみ）

## 2. 入力

- indie の指摘（2026-11-28）: register の起票・記帳に時間がかかりすぎる
- 観測（2026-11-28 23:15〜23:26 JST）: 専用ブランチ project/prj-0001/sync/register への commit の間隔が、連続した register update --commit 1 件ごとに約 47〜90 秒だった。1 件（PJR-6V26 の update）はシェルの 120 秒の時間切れを超えた
- 出力には、1 件の記帳ごとに専用ブランチの worktree で pjr-index などの生成物の一式を作り直す Generated の行が並ぶ
- 担当・期限は未定（indie が朝に決める）

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
