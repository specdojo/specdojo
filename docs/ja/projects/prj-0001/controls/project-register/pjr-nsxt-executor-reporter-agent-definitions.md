---
specdojo:
  id: prj-0001:pjr-nsxt-executor-reporter-agent-definitions
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:42Z"
  due_on: "2026-08-31"
---

# PJR-NSXT executor / reporter用エージェントを追加する

## 1. 概要

既存のopencode-edit-agent等を変更せず、opencode-executor、opencode-reporter、codex-expert-executor等の設定と役割別プロンプトを追加する。

## 2. 完了条件

- 既存エージェント定義を変更せず、`opencode-executor`、`opencode-reporter`、`codex-expert-executor` を選択できる。
- executor の指示から result 更新責務が除かれ、成果物の編集と検証に集中できる。
- reporter は成果物を編集せず、渡された evidence から定義済みの構造化結果だけを返す。
- 新規エージェントが従来フローの自動選択候補へ混入しないことをテストで確認できる。

## 3. 作業内容

| No  | 作業                                        | 担当 | 状態 | メモ                                  |
| --- | ------------------------------------------- | ---- | ---- | ------------------------------------- |
| 1   | OpenCode の executor と reporter を定義する | ARC  | open | どちらもローカル LLM を選択可能にする |
| 2   | Codex の expert executor を定義する         | ARC  | open | expert proficiency とする             |
| 3   | 役割別プロンプトと権限境界を定義する        | ARC  | open | reporter に書き込み権限を与えない     |
| 4   | 従来エージェントとの選択分離を検証する      | ARC  | open | 既存設定はそのまま維持する            |

## 4. 対応結果

-

## 5. 関連ドキュメント

- [[prj-0001:pjr-jfwq-executor-reporter-pipeline-schema]]
- [[specdojo:exec-config-guide]]
- [[specdojo:pm-members-rulebook]]
