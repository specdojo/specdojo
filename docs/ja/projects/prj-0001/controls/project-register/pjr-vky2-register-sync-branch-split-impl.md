---
specdojo:
  id: prj-0001:pjr-vky2-register-sync-branch-split-impl
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-27T10:11:56Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-EVWA
---

# PJR-VKY2 register_sync のブランチを sync/register と sync/exec-events に分ける

## 1. 概要

PJR-EVWA の決定に従い、register_sync の専用ブランチを project/`<id>`/sync/register と project/`<id>`/sync/exec-events の 2 本に分け、設定・コマンド・CI・hook を対応させる

## 2. 入力

- PJR-EVWA で D を採った（indie、2026-11-27）。名前は exec-events とし、exec は使わない
- 登録簿の個票とイベント（controls/project-register/）は sync/register、execution/exec/events/ は sync/exec-events に載せる
- 今の作りでは exec run --register は登録簿だけ、schedule の task の実行は exec の events だけを記帳する。両方へ書く場合の順番と片方が失敗したときの扱いはこの todo で決めて個票の対応結果に記録する
- 今の project/`<id>`/register からの移し替えは、実行中の run がない時に行う

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
