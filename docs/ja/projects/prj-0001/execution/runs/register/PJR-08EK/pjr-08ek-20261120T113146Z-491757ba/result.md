---
specdojo:
  id: prj-0001:xer-pjr-08ek-20261120t113146z-491757ba
  type: exec-result
  task_id: PJR-08EK
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-08EK/pjr-08ek-20261120T113146Z-491757ba/plan.md
  started_at: "2026-11-20T11:31:47.261Z"
  completed_at: "2026-11-20T11:51:13.663Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- exec の opencode 起動（`withAgentExtraRoots`）で、その run のプロダクトの worktree だけに `OPENCODE_CONFIG_CONTENT` で許可を渡すようにした。`external_directory` は絶対パス、`edit` は起動場所からの相対パス `../&lt;repo&gt;/**`。`orchestrator launch` も同じモジュール（`src/exec/opencode-permissions.ts`）を使う形に直した。claude・codex・antigravity・copilot の起動の引数は変えていない。単体テスト、参照文書、e2e の fixture、個票の対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/orchestrator-operation-guide.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/command-reference.md`: 変更、+1 / -1 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+11 / -9 行
- `src/commands/orchestrator.ts`: 変更、+11 / -87 行
- `src/exec/run/agent.ts`: 変更、+1 / -0 行
- `src/exec/run/in-place.ts`: 変更、+1 / -0 行
- `src/exec/task-repos.ts`: 変更、+30 / -3 行
- `src/exec/worktree-command.ts`: 変更、+3 / -1 行
- `tests/src/commands/orchestrator.test.ts`: 変更、+3 / -2 行
- `tests/src/exec/register-pipeline-e2e.integration.test.ts`: 変更、+2 / -1 行
- `tests/src/exec/task-repos.test.ts`: 変更、+97 / -0 行
- `src/exec/opencode-permissions.ts`: 追加、+137 / -0 行
- `tests/src/exec/opencode-permissions.test.ts`: 追加、+48 / -0 行

## 3. 申し送り

- 照合の形（`external_directory` は絶対パス、`edit` は起動場所からの相対パス）と、`OPENCODE_CONFIG_CONTENT` が `.opencode/agents/&lt;name&gt;.md` の frontmatter より後に効くことは、実機の opencode では確かめていない。sandbox から opencode CLI を起動できないため。前者は報告（opencode 1.19.5）の試験結果、後者は公式ドキュメント <https://opencode.ai/docs/config> に合わせた。足した許可が `"*": deny` より後のルールとして効くかどうか（マージがキーの順を保つか）も未確認。`repos` を宣言した project で opencode-executor を流し、プロダクトの worktree を編集できるか人が確かめる必要がある。
- 対応策の 2 点目（開始前に止める・doctor で警告）: 許可の注入を実装したので、一律に止める処理は入れていない。opencode の起動コマンドに `--agent &lt;name&gt;` が無いと許可の範囲を決められないため、その場合だけ `withAgentExtraRoots` がエラーで起動前に止める。doctor の警告は追加していない。
- `orchestrator launch` の `edit` に絶対パスが入っていて exec と同じ問題があったため、同じ関数を使う形に直し、`edit` を相対パスにした（別項目は起票していない）。
- CHANGELOG に書く事項（不具合修正）: `repos` を宣言した project で、exec の opencode の executor がプロダクトの worktree を編集できなかった問題を修正。runner は起動時の `OPENCODE_CONFIG_CONTENT` で、その run のプロダクトの worktree だけに `external_directory` と `edit` の許可を渡す。`orchestrator launch` の `edit` の許可も、起動場所からの相対パスにそろえた。opencode の `command_template` には `--agent &lt;name&gt;` が必要になった（PJR-08EK）
- 互換性への影響: `repos` を宣言した project で opencode の `command_template` に `--agent` が無い場合、起動前にエラーで止まるようになる。e2e の fixture は `--agent fake-opencode-agent` を足して対応した。
- 適用外の検証: `specdojo catalog validate`（成果物の変更は個票（controls/project-register）と docs/ja/specdojo の参照文書だけで、カタログの対象になる成果物の変更はない）

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
