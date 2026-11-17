---
specdojo:
  id: prj-0001:pjr-3mts-uis-open-document-by-id
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: medium
  owner: BA
  registered_at: "2026-11-17T14:21:19Z"
  due_on: "2026-11-30"
  derived_from:
    - PJR-MNM5
  commit_type: docs
  commit_scope: kata
---

# PJR-3MTS uis の代表の画面仕様を書き、uis の rulebook と sample から運用の記述を外す

## 1. 概要

カタログに足した uis-open-document-by-id（VS Code の ID で文書を開く入力）を書き、kata-slim と同じ一覧で uis-rulebook と uis-sample を簡潔にする

## 2. 入力

- uis はカタログに代表の成果物がなかったため kata-slim の track に入らなかった。利用者が 2026-11-17 に、VS Code 拡張の「SpecDojo: Open Document by ID」を代表の画面にする案（A）を選び、orchestrator が dct-user-interface-model に uis-open-document-by-id を足した
- 実装は packages/vscode-specdojo/src/extension.ts の specdojo.openById。入力欄（prompt「Enter a SpecDojo document ID」）、索引がないときの警告「SpecDojo index not found. Run: specdojo index build」、ID が見つからないときの警告「ID not found: `<id>`」、索引の行番号つきの文書を開く処理がある

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
