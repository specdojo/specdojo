---
specdojo:
  id: prj-0001:xer-pjr-77fh-20261124t005755z-760a1ba5
  type: exec-result
  task_id: PJR-77FH
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-77FH/pjr-77fh-20261124T005755Z-760a1ba5/plan.md
  started_at: "2026-11-24T00:59:03.627Z"
  completed_at: "2026-11-24T01:16:58.298Z"
  agent: sol-executor
---

# Edit Result

## 1. 実施内容

- 参照用の `references` 設定、local の差し替え・追加、主 worktree 基準のパス解決、provider 別の編集拒否、`config show` を実装しました。変更は src/shared/{reference-directories,specdojo-config,local-config}.ts、src/commands/orchestrator.ts、src/exec/opencode-permissions.ts、設定・evidence の schema 2件、テスト4件、設定リファレンス・コマンドリファレンス・運用ガイド、個票の計15ファイルです。executor 側の検証は成功しました。単体テスト・型検査・lint は親 runner が実行します。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/orchestrator-operation-guide.md`: 変更、+4 / -0 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+5 / -3 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+39 / -3 行
- `docs/specdojo/schemas/v1/exec-evidence.schema.yaml`: 変更、+22 / -1 行
- `docs/specdojo/schemas/v1/specdojo-config.schema.yaml`: 変更、+18 / -0 行
- `src/commands/orchestrator.ts`: 変更、+46 / -1 行
- `src/exec/opencode-permissions.ts`: 変更、+9 / -1 行
- `src/shared/local-config.ts`: 変更、+65 / -7 行
- `src/shared/specdojo-config.ts`: 変更、+11 / -1 行
- `tests/docs/specdojo/schemas/specdojo-config-schema.test.ts`: 変更、+21 / -0 行
- `tests/src/commands/orchestrator.test.ts`: 変更、+132 / -0 行
- `tests/src/shared/local-config.test.ts`: 変更、+8 / -1 行
- `src/shared/reference-directories.ts`: 追加、+90 / -0 行
- `tests/src/shared/reference-directories.test.ts`: 追加、+211 / -0 行

## 3. 申し送り

- 設定名はトップレベルの `references` としました。全 project で参照先を共有し、編集用の `repos`、起票用の `external_projects` と用途を分けるためです。別名ごとに `path` を指定し、local では差し替え・追加後に同じ検証を行います。存在しないパス・ファイル・絶対パスは拒否します。実パスで管理リポジトリや起動場所と重なる参照先も拒否し、書き込み許可との重複を防ぎます。
- exec の executor・reviewer には参照先を追加公開しません。今回は対話時の調査を対象とし、実行時の権限を広げない判断です。参照先は worktree・setup・commit・統合の対象にしません。local の由来は `reference-path`・`reference-added` として表示と evidence に記録します。
- 保護された指示の変更案: 利用者の承認後、オーケストレーターが .agents/specdojo-orchestrator.agent.md の該当箇条書きへ『トップレベルの `references` に宣言されたディレクトリ（local の追加・差し替えを含む）は読み取りだけを許す。参照先で編集・起票・worktree 作成・commit・統合を行わない。有効な別名とパスは `specdojo config show` で確かめる。`repos`・`external_projects`・`references` のいずれにも宣言していないリポジトリは参照も変更もしない』を反映してください。既存の実装者指定・feature branch・push 禁止条件を維持し、`npm run orchestrator:sync` で同期します。個票5.2にも記録済みです。
- 統合後、オーケストレーターが `exec smoke` を実行し、参照先を宣言した共有/local 設定で `config show` と実 provider CLI を確認してから close してください。launch に dry-run はありません。読み取り成功と書き込み拒否を確認します。Copilot はパス glob 対応版、OpenCode は既存の V1 権限形式が対象です。Claude Code・Copilot・OpenCode の拒否はファイルツールの規則であり、任意の shell・MCP の OS レベル隔離ではありません。制約は設定リファレンスと個票5.3に記録済みです。
- CHANGELOG に書く事項（v0.10.0、追加）: 共有・local 設定の `references` で読むだけのディレクトリを宣言できるようにした。local のパス差し替え・別名追加、主 worktree 基準の解決、`config show` の実パス表示と provider 別の参照権限に対応した。参照先は exec の worktree・commit・統合の対象にしない。CHANGELOG と保護された設定、版番号、result、登録簿の状態は変更していません。
- 人の確認が必要: `specdojo exec smoke --project prj-0001 --targets PJR-77FH`（統合後にオーケストレーターが実 agent を使って実施する確認。）
- 人の確認が必要: `specdojo orchestrator launch --provider claude --project prj-0001 -- --agent specdojo-orchestrator`（参照先を宣言した設定で、各 provider の実 CLI による読み取り・書き込み拒否を sandbox 外で確認する。）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
