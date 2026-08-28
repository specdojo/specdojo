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
  register_events:
    - v: 1
      id: reg_b3d5531de54f6a68d3020fcd3916a9f4
      ts: "2026-08-10T06:36:41Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): add executor reporter pipeline todos"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: executor / reporter用エージェントを追加する
        - field: description
          from: ""
          to: 既存のopencode-edit-agent等を変更せず、opencode-executor、opencode-reporter、codex-expert-executor等の設定と役割別プロンプトを追加する。
        - field: type
          from: ""
          to: todo
        - field: priority
          from: ""
          to: medium
        - field: owner
          from: ""
          to: ARC
        - field: registered
          from: ""
          to: "2026-08-10"
        - field: due
          from: ""
          to: "2026-08-31"
        - field: completed
          from: ""
          to: "-"
        - field: conclusion
          from: ""
          to: "-"
        - field: block_reason
          from: ""
          to: "-"
      legacy_commit: 05c3d3781552e051565e003506dd009eb1312db5
    - v: 1
      id: reg_063f8c0ec051361df8c73ea5090377a2
      ts: "2026-08-10T06:51:09Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-NSXT): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 39f3604835dc69e17a97eacd90ca744d34a3c0eb
      previous_event_id: reg_b3d5531de54f6a68d3020fcd3916a9f4
    - v: 1
      id: reg_15f17b21418297741d8d8b38a90046d0
      ts: "2026-08-10T07:03:31Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-NSXT): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 61c33bb86bc72ff756f22121f46ae4353c237772
      previous_event_id: reg_063f8c0ec051361df8c73ea5090377a2
    - v: 1
      id: reg_ce1b7f5cec6dbbcc0785c8c3c3873e26
      ts: "2026-08-10T22:46:50Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-TC43): executor / reporterパイプラインのE2E検証と文書化"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-11"
        - field: conclusion
          from: "-"
          to: pm-members.yamlにstage_role付きのopencode-executor/opencode-reporter/codex-expert-executorを追加し、既存agent定義は変更せず候補選択を分離。対象34件成功、provider scaffold dry-runでも配布対象を確認済み。
      legacy_commit: 095189d5df7fcb58163a4c5c1f6e847a113a1db3
      previous_event_id: reg_15f17b21418297741d8d8b38a90046d0
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
