---
specdojo:
  id: prj-0001:pjr-3dy1-night-orchestrator-autopilot
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: decision
  item_status: open
  priority: high
  owner: ARC
  registered_at: "2026-10-18T00:38:57Z"
  due_on: null
---

# PJR-3DY1 夜の間に承認済みの todo を実行・確認・close まで自動で進める方針を決める

## 1. 背景

orchestrator が行っている、次の項目の選択・実行・結果の確認・見つけた問題の起票・close を、承認済みの todo について夜の間に自動で進める方針を決める。実行のあとの review の agent と自動の close（段階 A）から入れ、承認済みの並びを夜の orchestrator が流しきる仕組み（段階 B）へ進める

## 2. 検討した選択肢

| 選択肢 | 内容   | 利点   | 懸念   |
| ------ | ------ | ------ | ------ |
| A      | _TODO_ | _TODO_ | _TODO_ |

## 3. 決定内容

_TODO_: 採択した内容を明確に記載する。

## 4. 採択理由

- _TODO_: 判断根拠を記載する。

## 5. 承認

| 項目     | 内容   |
| -------- | ------ |
| 決定者   | _TODO_ |
| 決定日   | _TODO_ |
| 承認方式 | _TODO_ |
| 証跡     | _TODO_ |

- 承認方式は `commit` または `PR` を記載する。`PR` の場合は証跡に PR URL と merge SHA を本文テキストで記載する。
- 不可逆・高リスク・framework schema 破壊的変更に該当する決定は `PR` 方式で承認する。

## 6. 影響範囲とフォローアップ

| 項目       | 内容   |
| ---------- | ------ |
| 影響範囲   | _TODO_ |
| 必要な対応 | _TODO_ |
| 追跡先     | _TODO_ |

## 7. 関連ドキュメント

- _TODO_: 根拠・影響先・追跡先を `[[doc-id]]` 形式で記載する。
