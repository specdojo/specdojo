---
specdojo:
  id: prj-0001:pjr-k7qf-dependabot-minor-2026-11-20
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  owner: DEV
  registered_at: "2026-11-20T14:15:54Z"
  derived_from:
    - PJR-P318
---

# PJR-K7QF Dependabot の週次の更新のうち minor と patch を取り込む（2026-11-20 分）

## 1. 概要

PR #36〜#39 の minor と patch の更新を、GitHub で merge せず develop の feature ブランチで取り込み、PR を閉じる

## 2. 入力

- 利用者の決定（2026-11-20、案 A）: 週次の更新は minor・patch の取り込みと major の評価の 2 件に分ける。minor・patch は orchestrator が日中に feature ブランチで取り込む。期限は未定
- orchestrator の調べ（2026-11-20）: #37 commander 15.0.0→15.1.0、#38 dotenv 18.0.4→18.0.10、#39 prettier 3.9.9→3.10.1（どれもルートの package-lock.json だけ）。#36 は開発用の依存の 4 か所分で、commitlint 21.2.4・typescript-eslint 8.73.0・lefthook 2.2.2・cloc 2.11.0 などの minor と、TypeScript 7・vitest 5・@types/node 26 の major が混ざる
- 運用メモの決まり: Dependabot の PR は merge せず、同じ変更を develop 系の feature ブランチで取り込み、PR を閉じる。package.json・package-lock.json は保護された設定のため、agent の run ではなく orchestrator が行う

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
