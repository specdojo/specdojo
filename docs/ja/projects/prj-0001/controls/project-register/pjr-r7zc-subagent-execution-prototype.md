---
specdojo:
  id: prj-0001:pjr-r7zc-subagent-execution-prototype
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-21T02:21:37Z"
  derived_from:
    - PJR-DEF1
  depends_on:
    - PJR-DEF1
---

# PJR-R7ZC 段ごとのコマンドと Claude Code の skill で、register の項目を 1 件流す試作をする

## 1. 概要

exec の段を agent を起動しないコマンド（prepare・finish など）に分け、Claude Code の skill と subagent で register の項目を 1 件、start から review・統合まで流す

## 2. 入力

- 前提の decision（PJR-DEF1）で方式を採ると決めてから着手する
- 試作は Claude Code から始める。.claude/agents/ に executor・reviewer・reporter の定義があり、この場で確かめられるため。agy は Google に確かめてから、Codex と schedule の --task はそのあとに広げる
- 段の例: exec step prepare --register `<ID>` が start の記帳・worktree・plan・result の雛形を作りパスを出す。exec step finish --register `<ID>` --evidence `<file>` が親の検証・commit と保護された設定の検査・統合・review の記帳を行い、失敗したら waiting にする（名前は executor が決める）
- 今ある手動のコマンド: schedule 向けの exec worktree prepare・commit・merge と exec claim・complete。register の項目と親の検証にはつながっていない

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
