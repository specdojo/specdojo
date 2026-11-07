---
specdojo:
  id: prj-0001:pjr-c4kf-agent-history-links-run-records
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  registered_at: "2026-11-07T23:52:58Z"
  derived_from:
    - PJR-5ZNK
---

# PJR-C4KF agent へ渡す検査の適用条件の文に、今の実行記録の plan・result を足す

## 1. 概要

src/exec/run/agent.ts が executor へ渡す validate:history-links の適用条件の文が、履歴ファイルとして旧来の exec/plans・exec/results だけを挙げ、実装が対象にする execution/runs の plan.md・result.md を挙げていない

## 2. 入力

- PJR-5ZNK の確認で、src/exec/run/agent.ts の 251〜253 行目に旧来の書き方が残っていると分かった（2026-11-08）。判定の実装は src/exec/reporter.ts の isHistoryLinkTargetPath。

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
