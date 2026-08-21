---
specdojo:
  id: prj-0001:pjr-0da8-claude-reporter-mode-and-settings
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: in-progress
  priority: medium
  owner: ARC
  registered_at: "2026-08-21T10:19:56Z"
  due_on: "2026-08-31"
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

| No  | 作業                                                                                     | 担当 | 状態 | メモ                                                                                    |
| --- | ---------------------------------------------------------------------------------------- | ---- | ---- | --------------------------------------------------------------------------------------- |
| 1   | `pm-members.schema.yaml` の `mode` enum に `report` を追加し説明を更新する               | ARC  | open | 配布物の schema のため互換性への影響を明記する                                          |
| 2   | reporter 専用 settings の内容を決めて `.specdojo/claude/settings.report.json` を追加する | ARC  | open | `.specdojo` 配下は agent の書き込み範囲外のため、内容を result へ申し送り人手で適用する |
| 3   | `pm-members.yaml` の `claude-reporter` を `mode: report` へ変更し note を修正する        | ARC  | open | `docs/` 配下のため agent が直接編集できる                                               |
| 4   | 選定ロジックの回帰確認とテスト追加を行う                                                 | ARC  | open | stage_role による選定、`--reporter-by`、edit / review 候補への非混入を検証する          |
| 5   | settings の命名と役割を説明しているドキュメントを更新する                                | ARC  | open | 対応表が古いままにならないようにする                                                    |
| 6   | pipeline 実行で reporter の起動と result 生成を実機確認する                              | ARC  | open | 起動コマンドに `settings.report.json` が現れることをログで確認する                      |

## 4. 対応結果

_TODO_: 完了時に、実施内容・成果物・残課題を記載する。未完了の場合は `-` とする。

## 5. 関連ドキュメント

- 設定ファイルの書き込み範囲に関する決定: [[prj-0001:pjr-3s8q-agent-writable-config-scope|PJR-3S8Q 実行コマンドを定義する設定ファイルは agent の書き込み範囲に含めない]]
- 起動テンプレートの定義: `.specdojo/exec-defaults.yaml` の `providers.claude.command_template`
- 変更対象の schema: `docs/specdojo/schemas/v1/pm-members.schema.yaml`
- 変更対象の名簿: `docs/ja/projects/prj-0001/030-project-management/pm-members.yaml`
- 選定ロジックの実装: `src/exec-run.ts` の `resolveReporterAgentCandidates` と `resolveAgentOverride`
