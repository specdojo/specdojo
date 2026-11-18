---
specdojo:
  id: prj-0001:pjr-5ctm-npm-audit-high
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-18T12:18:01Z"
  due_on: "2026-11-30"
---

# PJR-5CTM npm audit の high を解消する（配る依存を先に）

## 1. 概要

npm audit の high 15 件を解消する。配る依存（tinyglobby・fdir・picomatch・fast-uri）を先に直し、開発用は依存ごとに上げるか外すかを決める。古い版へ下げる直し方は使わない

## 2. 入力

- 利用者の依頼（2026-11-18）: npm audit で high が多く出るようになったので直したい
- orchestrator の調べ（2026-11-18）: npm audit は high 15・moderate 18・low 3・critical 0。--omit=dev では high 3（tinyglobby・fdir・picomatch）と moderate 1（fast-uri）。tinyglobby は実行時の依存
- orchestrator の調べ（2026-11-18）: 開発用の high は vitest・markdownlint-cli・remark-cli・ajv-cli・vite・markdown-it などの推移的な依存。npm audit の直し方には vitest@3.1.4・markdownlint-cli@0.33.0 など今より古い版へ下げる案が混じる
- 利用者の決定（2026-11-18）: 直し方は推奨の案 1。executor が依存ごとの直し方を調べて個票の対応結果に書き、package.json・package-lock.json（保護された設定）への反映は利用者の承認のもと orchestrator が feature ブランチで行う

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
