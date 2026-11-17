---
specdojo:
  id: prj-0001:pjr-8nb8-exec-smoke-command
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  difficulty: medium
  registered_at: "2026-11-17T12:21:33Z"
  derived_from:
    - PJR-JSEY
  commit_type: feat
  commit_scope: exec
---

# PJR-8NB8 runner の変更の統合後の動作確認（JSEY の手順）を specdojo のコマンドにする

## 1. 概要

確認用の項目の対象一覧への追記・開き直し・exec run・actor の確認を、orchestrator の手作業から 1 つのコマンドへ移す

## 2. 入力

- 運用メモの「JSEY（runner の動作確認）」の手順（対象一覧への ID の追記と commit、register reopen、claude-executor での exec run --register、start から review までと actor の実体名の確認、close）を、orchestrator が毎回手で流している。2026-11-17 も 2 回流した
- 利用者が 2026-11-17 に、npm script にするか specdojo のコマンドに足す案を出し、specdojo のコマンドにする形で起票を依頼した
- orchestrator のスクリプトや手作業は specdojo のコマンドへ移す方針である

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
