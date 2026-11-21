---
specdojo:
  id: prj-0001:pjr-nje4-hotfix-0-9-2-block-antigravity
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: open
  priority: high
  difficulty: hard
  owner: DEV
  registered_at: "2026-11-21T00:32:31Z"
  derived_from:
    - PJR-5V0T
---

# PJR-NJE4 0.9.2 で Antigravity（agy）の起動を止める

## 1. 概要

hotfix 0.9.2 で、exec・grade・orchestrator などから agy を起動しようとしたら起動前にエラーで止め、init で antigravity を選べないようにする。文書に注意書きを足す

## 2. 入力

- PJR-5V0T の決定（2026-11-21、indie）: 0.9.2 では警告にとどめず、agy の起動そのものを止める
- consumer plan では、他社の agent や application の中から agy を起動することを Antigravity の FAQ が対象外、Additional Terms Section 6 が契約違反としている（根拠の URL は PJR-5V0T の入力）
- 0.9.1 では init で antigravity を選んだ利用者だけに agy の member と `command_template` が入る（既定の provider は codex）。init 済みの利用者の .specdojo/ の設定は新しい版を入れても残るため、実行時に止める必要がある
- prj-0001 では名簿の disabled と `command_template` の削除で止めている（afbebe967）。exec run が名前で指定された disabled の member を断らない件は PJR-77JB

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
