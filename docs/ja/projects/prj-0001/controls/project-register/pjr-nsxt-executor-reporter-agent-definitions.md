---
specdojo:
  id: prj-0001:pjr-nsxt-executor-reporter-agent-definitions
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-10T06:28:42Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-10T22:42:14Z"
  conclusion: pm-members.yamlにstage_role付きのopencode-executor/opencode-reporter/codex-expert-executorを追加し、既存agent定義は変更せず候補選択を分離。対象34件成功、provider scaffold dry-runでも配布対象を確認済み。
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

- `pm-members.yaml` に `stage_role` 付きの `opencode-executor`、`opencode-reporter`、`codex-expert-executor` を追加した。既存 agent は `stage_role` 未指定のまま維持し、従来フローと pipeline の候補を分離した。
- OpenCode executor は成果物の編集・検証に限定し、result パスを edit deny とする実設定と配布原本を追加した。OpenCode reporter は全ツールを deny とし、渡された plan、evidence、出力スキーマだけから構造化結果を返す実設定と配布原本を追加した。
- Codex expert executor は `proficiency: expert` の pipeline member と、result を更新しない役割別プロンプトを持つ custom subagent 配布原本を追加した。Codex worker は設計どおり member 属性と command template から起動し、custom subagent ファイルを直接選択しない。
- 追加した3つの nickname を使う候補選択テストで、従来フローには既存 agent だけ、pipeline には一致する `stage_role` と `proficiency` の agent だけが選ばれることを固定した。

## 5. 関連ドキュメント

- [[prj-0001:pjr-jfwq-executor-reporter-pipeline-schema]]
- [[specdojo:exec-config-guide]]
- [[specdojo:pm-members-rulebook]]
