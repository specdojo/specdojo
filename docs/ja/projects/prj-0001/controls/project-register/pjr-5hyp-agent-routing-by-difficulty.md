---
specdojo:
  id: prj-0001:pjr-5hyp-agent-routing-by-difficulty
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  owner: DEV
  registered_at: "2026-10-20T12:03:52Z"
  derived_from:
    - PJR-ZM1K
---

# PJR-5HYP 作業の難しさで agent を振り分ける設定を加える

## 1. 概要

exec-defaults.yaml に、難しさ（hard・medium・easy）ごとの executor・reporter・rate limit のときの扱い・代わりの agent を書く振り分けの表を加え、個票に difficulty を持たせる。exec run --register で agent を指定しないときと夜間の orchestrator は、この表で agent を選ぶ。今の自動選択は priority の小さい順で、普通の難しさに qwen-executor が選ばれるため、あわせて直す（2026-10-20、利用者が承認）

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
