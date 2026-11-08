---
specdojo:
  id: prj-0001:pjr-2srr-docs-build-heap-limit
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: easy
  registered_at: "2026-11-08T02:15:46Z"
  derived_from:
    - PJR-HMV6
---

# PJR-2SRR docs:build が既定のメモリの上限で止まらないようにする

## 1. 概要

npm run docs:build が既定の heap では JavaScript heap out of memory で止まる。手元の検査と CI で同じ上限になるよう、docs:build の実行にメモリの上限を設定する

## 2. 入力

- 2026-11-08 の PJR-HMV6 の確認で、既定の heap の docs:build が FATAL ERROR: Ineffective mark-compacts near heap limit で止まり、`NODE_OPTIONS=--max-old-space-size=8192` では 665 秒で通った（環境のメモリは 15GB）。
- CI の .github/workflows/deploy.yml は `NODE_OPTIONS:` --max-old-space-size=4096 を設定している。package.json の scripts には設定がない。
- package.json は保護された設定のため、executor は変更案を個票の対応結果と報告の handoff に書き、反映は利用者の承認のもと feature ブランチで行う。

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
