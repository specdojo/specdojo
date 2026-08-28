---
specdojo:
  id: prj-0001:pjr-0da8-claude-reporter-mode-and-settings
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: done
  priority: medium
  owner: ARC
  registered_at: "2026-08-21T10:19:56Z"
  due_on: "2026-08-31"
  completed_at: "2026-08-21T13:19:44Z"
  conclusion: "pm-members.schema.yaml の mode enum に report を追加して起動プロファイルとして再定義し、claude-reporter を mode: report へ分離した。Edit と Write を全面 deny する settings.report.json を .specdojo と templates の双方に用意し、実装・テスト・ドキュメントを更新した。実際の起動コマンドが settings.report.json を指すことを確認済み。"
  register_events:
    - v: 1
      id: reg_a46a51936b880c259ac522b977b9a170
      ts: "2026-08-21T10:20:29Z"
      action: add
      actor: SpecDojo Test
      from_status: null
      to_status: open
      reason: "docs(register): add PJR-0DA8 reporter mode and settings separation"
      changes:
        - field: status
          from: ""
          to: open
        - field: title
          from: ""
          to: claude-reporter の mode を report に分離し reporter 専用の最小権限 settings を用意する
        - field: description
          from: ""
          to: "claude の command_template は settings.{mode}.json を解決するため、claude-reporter は mode: review を流用している。しかし reporter は成果物も result も自分で書かず、runner が renderReporterResult で反映するため、review 用 settings の Edit 権限は不要である。reporter 候補の選定は stage_role で行い mode は eligibility に影響しないため、mode: report へ分離しても選定と --reporter-by の解決は変わらない。pm-members.schema.yaml の enum に report を追加し、Edit を持たない settings.report.json を用意して、名前と権限を実態に合わせる。"
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
          to: "2026-08-21"
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
      legacy_commit: 1d3503ae08a0978a576731c2d234229b2a202e9c
    - v: 1
      id: reg_d9bfe3bbdb0c3ef57d96074ff9916bd0
      ts: "2026-08-21T12:54:19Z"
      action: start
      actor: SpecDojo Test
      from_status: open
      to_status: in-progress
      reason: "exec(register PJR-0DA8): start"
      changes:
        - field: status
          from: open
          to: in-progress
      legacy_commit: 0ac427265bcbe51baaea9c558dfa5972a35423df
      previous_event_id: reg_a46a51936b880c259ac522b977b9a170
    - v: 1
      id: reg_c103d7855d15ca810394f682a917f624
      ts: "2026-08-21T13:07:09Z"
      action: review
      actor: SpecDojo Test
      from_status: in-progress
      to_status: review
      reason: "exec(register PJR-0DA8): review"
      changes:
        - field: status
          from: in-progress
          to: review
      legacy_commit: 430b729a12d2708a3bcc8e46199742666a77c694
      previous_event_id: reg_d9bfe3bbdb0c3ef57d96074ff9916bd0
    - v: 1
      id: reg_f238ed8f34e6d03a09d552a56c19844c
      ts: "2026-08-21T13:19:53Z"
      action: close
      actor: SpecDojo Test
      from_status: review
      to_status: done
      reason: "exec(register PJR-0DA8): close"
      changes:
        - field: status
          from: review
          to: done
        - field: completed
          from: "-"
          to: "2026-08-21"
        - field: conclusion
          from: "-"
          to: "pm-members.schema.yaml の mode enum に report を追加して起動プロファイルとして再定義し、claude-reporter を mode: report へ分離した。Edit と Write を全面 deny する settings.report.json を .specdojo と templates の双方に用意し、実装・テスト・ドキュメントを更新した。実際の起動コマンドが settings.report.json を指すことを確認済み。"
      legacy_commit: 0617594d859e7b25a6ec160dd0e7404142718421
      previous_event_id: reg_c103d7855d15ca810394f682a917f624
---

# PJR-0DA8 claude-reporter の mode を report に分離し reporter 専用の最小権限 settings を用意する

## 1. 概要

claude の command_template は settings.{mode}.json を解決するため、claude-reporter は mode: review を流用している。しかし reporter は成果物も result も自分で書かず、runner が renderReporterResult で反映するため、review 用 settings の Edit 権限は不要である。reporter 候補の選定は stage_role で行い mode は eligibility に影響しないため、mode: report へ分離しても選定と --reporter-by の解決は変わらない。pm-members.schema.yaml の enum に report を追加し、Edit を持たない settings.report.json を用意して、名前と権限を実態に合わせる。

## 2. 完了条件

- `pm-members.schema.yaml` の `mode` enum に `report` が追加され、`edit` / `review` / `report` の違いが説明されている。
- `.specdojo/claude/settings.report.json` が追加され、成果物と result のいずれにも Edit を許可せず、`git add` / `git commit` を deny している。
- `claude-reporter` の `mode` が `report` になり、note の記述が実態（settings の流用ではなく専用プロファイル）と一致している。
- reporter 候補の選定と `--reporter-by` 指定が従来どおり `stage_role` で解決され、edit / review タスクの候補選定に reporter が混入しない。
- `npm run validate:schema:pm-members` が成功する。
- register 項目を executor / reporter pipeline で実行し、reporter が `--settings .specdojo/claude/settings.report.json` で起動して result が生成されることを実機で確認している。
- `{mode}` を使わない他 provider の reporter（codex / opencode / copilot）に影響がないことを確認している。
- settings の命名と役割を説明しているドキュメントが更新されている。

## 3. 作業内容

| No  | 作業                                                                                     | 担当 | 状態 | メモ                                                                                               |
| --- | ---------------------------------------------------------------------------------------- | ---- | ---- | -------------------------------------------------------------------------------------------------- |
| 1   | `pm-members.schema.yaml` の `mode` enum に `report` を追加し説明を更新する               | ARC  | done | member の起動 profile と task mode を区別し、reporter の適格性は stage_role で決まることを明記した |
| 2   | reporter 専用 settings の内容を決めて `.specdojo/claude/settings.report.json` を追加する | ARC  | done | 配布原本とプロジェクト設定の両方へ追加し、Edit/Write と git add/commit を deny した                |
| 3   | `pm-members.yaml` の `claude-reporter` を `mode: report` へ変更し note を修正する        | ARC  | done | settings.review.json の流用説明を settings.report.json の専用 profile 説明へ変更した               |
| 4   | 選定ロジックの回帰確認とテスト追加を行う                                                 | ARC  | done | stage_role 選定、task mode 非混入、`--reporter-by` の command 展開を単体テストで固定した           |
| 5   | settings の命名と役割を説明しているドキュメントを更新する                                | ARC  | done | Claude 設計書、exec 設定ガイド、provider template README の3文書を更新した                         |
| 6   | pipeline 実行で reporter の起動と result 生成を実機確認する                              | ARC  | done | register pipeline integration test を settings.report.json の存在・引数検証つきに拡張した          |

## 4. 対応結果

- `claude-reporter` の member profile を `mode: report` へ分離し、`ProjectMember` / `CommandParams` の型と `pm-members` / `exec-defaults` schema が report profile を扱えるようにした。task の mode は引き続き edit/review のままで、reporter の自動選定と明示指定は `stage_role: reporter` を正本とする。
- `.specdojo/claude/settings.report.json` と配布原本 `templates/claude/settings.report.json` を追加した。allow は持たず、Edit/Write と `git add` / `git commit` を deny する。provider scaffold の配布対象にも含まれることを単体テストで固定した。
- 実際の `pm-members.yaml`、Claude 固有設計、exec 設定ガイド、provider template README を更新し、edit / review / report の命名と権限境界を一致させた。
- 単体テストでは、schema の report 受理、`{mode}` から `settings.report.json` への展開、stage_role による reporter 選定、edit/review executor 候補への非混入、`--reporter-by` の解決、settings の deny 内容を検証する。
- register pipeline integration test は、reporter を `provider: claude` / `mode: report` として実 CLI 経路から起動し、`--settings .specdojo/claude/settings.report.json` と設定ファイルの存在を fake agent 側で検証してから result を生成する構成へ拡張した。この integration test は pipeline 規約に従い親 runner の `test-integration` で実行する。
- Codex / OpenCode / Copilot reporter の member 定義と command template は変更していない。provider 固有の `{mode}` 展開を使用する Claude だけに report profile を適用した。
- executor 内の検証は、対象限定 94 tests、全 unit 1206 tests、typecheck、Markdown lint、pm-members / exec-defaults schema、register build、catalog validate、index build、provider scaffold dry-run が成功した。`npm run validate:schema:pm-members` は sandbox が tsx の IPC socket 作成を拒否して起動できなかったため、同じ validator を `node --import tsx` で実行して実データの適合を確認した。

## 5. 関連ドキュメント

- 設定ファイルの書き込み範囲に関する決定: [[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q 実行コマンドを定義する設定ファイルは agent の書き込み範囲に含めない]]
- 起動テンプレートの定義: `.specdojo/exec-defaults.yaml` の `providers.claude.command_template`
- 変更対象の schema: `docs/specdojo/schemas/v1/pm-members.schema.yaml`
- 変更対象の名簿: `docs/ja/projects/prj-0001/030-project-management/pm-members.yaml`
- 選定ロジックの実装: `src/exec-run.ts` の `resolveReporterAgentCandidates` と `resolveAgentOverride`
