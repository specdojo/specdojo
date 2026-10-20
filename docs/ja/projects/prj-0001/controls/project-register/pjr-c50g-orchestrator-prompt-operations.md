---
specdojo:
  id: prj-0001:pjr-c50g-orchestrator-prompt-operations
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-20T12:03:24Z"
---

# PJR-C50G オーケストレーターの本文に、実行の運び方・close の前の確かめ方・止まったときの対処を書く

## 1. 概要

2026-10-18〜20 の運用で分かった一般的な勘どころを、配布するオーケストレーターの本文（.agents/specdojo-orchestrator.agent.md と 4 つのラッパー）に書く。実行の運び方（worktree・並行の上限・background と通知・自分に一致する pkill を避ける・dist の作り直し）、commit の作法（register の --commit を使い、統合中は普通の commit を避ける）、close の前の確かめ方（完了条件と差分の突き合わせ、agent の報告を実物で確かめる、保護された設定、runner を変えた項目の動作確認）、止まったときの対処の表、完了条件の書き方、agent は振り分けの設定に従って選ぶこと（2026-10-20、利用者が承認）

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
