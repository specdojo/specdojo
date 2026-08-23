---
specdojo:
  id: prj-0001:pjr-qvgx-codex-sandbox-tsx-ipc-eperm
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-08-23T07:24:17Z"
  due_on: "2026-08-31"
---

# PJR-QVGX codex sandboxでvalidate:schemaがtsxのIPC EPERMにより常に失敗する問題を解消する

## 1. 概要

codex-expert-executor の sandbox 内では tsx が IPC ソケット /tmp/tsx-1000/<pid>.pipe を作成できず EPERM となり、npm run validate:schema が成果物の内容と無関係に常に failed となる。PJR-K4TA では reporter のブロック理由の一つになった。sandbox 設定で当該パスを許可するか、validate:schema を tsx の IPC に依存しない実行方式へ変更する。

## 2. 完了条件

- _TODO_: 完了と判断できる具体的な条件を記載する。

## 3. 作業内容

| No  | 作業   | 担当   | 状態 | メモ |
| --- | ------ | ------ | ---- | ---- |
| 1   | _TODO_ | _TODO_ | open | -    |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
