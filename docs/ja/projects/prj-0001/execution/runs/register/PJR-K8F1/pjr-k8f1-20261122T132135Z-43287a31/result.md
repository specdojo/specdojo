---
specdojo:
  id: prj-0001:xer-pjr-k8f1-20261122t132135z-43287a31
  type: exec-result
  task_id: PJR-K8F1
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-K8F1/pjr-k8f1-20261122T132135Z-43287a31/plan.md
  started_at: "2026-11-22T13:21:36.869Z"
  completed_at: "2026-11-22T13:33:07.120Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- `providers.&lt;provider&gt;.agent_timeout_seconds`（既定は上限なし）を追加。上限に達すると agent の CLI のプロセスグループを SIGTERM、10 秒後に SIGKILL で止め、キーを理由に残して block にする。executor・reporter・in-place・register・Job の in-place 起動と `src/exec/agent-plan.ts` に適用した。schema・exec-config-guide・specdojo-config-reference・単体テスト・統合テスト・個票の対応結果を更新した。

## 2. 変更ファイル

- `docs/ja/specdojo/guides/exec-config-guide.md`: 変更、+10 / -0 行
- `docs/ja/specdojo/references/specdojo-config-reference.md`: 変更、+2 / -0 行
- `docs/specdojo/schemas/v1/exec-defaults.schema.yaml`: 変更、+9 / -0 行
- `src/exec/agent-config.ts`: 変更、+35 / -0 行
- `src/exec/agent-plan.ts`: 変更、+3 / -0 行
- `src/exec/run/agent.ts`: 変更、+28 / -8 行
- `src/exec/run/in-place.ts`: 変更、+21 / -9 行
- `src/exec/run/job.ts`: 変更、+19 / -3 行
- `src/exec/run/register-core.ts`: 変更、+5 / -1 行
- `src/exec/run/shared.ts`: 変更、+2 / -0 行
- `src/exec/run/agent-timeout.ts`: 追加、+93 / -0 行
- `tests/src/exec/run/agent-timeout.integration.test.ts`: 追加、+165 / -0 行
- `tests/src/exec/run/agent-timeout.test.ts`: 追加、+149 / -0 行

## 3. 申し送り

- prj-0001 の `.specdojo/exec-defaults.yaml` は保護された設定のため変更していない。値の案: `providers.claude.agent_timeout_seconds: 7200`、`providers.codex.agent_timeout_seconds: 7200`、`providers.copilot.agent_timeout_seconds: 7200`、`providers.opencode.agent_timeout_seconds: 5400`。実測ではなく仮定（`_ASSUMPTION_`）なので、過去の run の所要時間を見て人が決める。
- executor が決めた点: SIGTERM から SIGKILL までの猶予は 10 秒、SIGKILL 後に pipe の close を待つのは 5 秒に固定し、設定のキーは足していない。キーは provider 別だけに置き、全体の既定は置いていない。上限なしの起動は従来どおり runner と同じプロセスグループで起動する（専用グループにすると Ctrl-C が届かないため）。不正な値は上限なしへ戻さずエラーで止める。
- CHANGELOG に書く事項（区分: 追加）: `providers.&lt;provider&gt;.agent_timeout_seconds` で agent の CLI の起動の時間の上限を設定できる。上限に達すると、CLI とその子のプロセスを SIGTERM、10 秒後に SIGKILL で止め、run を block にして理由に設定のキーを残す。未設定なら上限はない（PJR-K8F1）。文案は個票の対応結果にある。
- 完了条件どおり、統合の後にオーケストレーターが JSEY を流して確かめてから close する。個票のこの行は `open` のまま残している。
- `src/exec/run/job.ts` は変更前から 1,000 行を超えている（ESLint の `max-lines` の warn）。今回 16 行増えたが、分割は範囲外とした。

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
