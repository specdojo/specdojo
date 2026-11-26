---
specdojo:
  id: prj-0001:pjr-zfca-exec-release-force-orchestrator-idle-claim
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: medium
  owner: DEV
  registered_at: "2026-11-26T22:16:41Z"
  due_on: "2026-12-31"
  derived_from:
    - PJR-E189
---

# PJR-ZFCA exec release の --force を、動いていない run の claim に限ってオーケストレーターに許す

## 1. 概要

PJR-E189 の決定（候補 A）を実装する。specdojo-orchestrator の --force は、claim を持つ run が動いていないと CLI が確かめられるときだけ通し、判定できないときは断る。--reset-worktree と --all-blocked は利用者の承認を得て使う運用のまま。

## 2. 入力

- PJR-E189 で候補 A を採った（indie、2026-11-26）
- いまの CLI は、--force を人の actor のときだけ通す（src/exec/events.ts の canOverrideCrossActor）
- 2026-11-26 に、opus-executor が claim したまま止まった review 9 件と imp-interface-140 を、indie が --force で戻した
- 担当 DEV・期限 2026-12-31 は indie の指示（2026-11-26）

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
