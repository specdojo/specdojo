---
specdojo:
  id: prj-0001:xer-pjr-fnb7-20261125t132820z-ab165b91
  type: exec-result
  task_id: PJR-FNB7
  mode: edit
  status: complete
  project_id: prj-0001
  origin: register
  plan_ref: runs/register/PJR-FNB7/pjr-fnb7-20261125T132820Z-ab165b91/plan.md
  started_at: "2026-11-25T13:28:20.866Z"
  completed_at: "2026-11-25T13:39:36.032Z"
  agent: opus-executor
---

# Edit Result

## 1. 実施内容

- Quick Start の todo 起票の対話（固定の 3 発言）を実オーケストレーター（claude CLI の会話の継続）で一時 Git リポジトリに流すテストを追加した。承認の前は状態が変わっていないこと、承認の後は個票・イベント・commit があることを機械的に確かめ、N 回分の合格率・所要時間・費用を tmp/agent-test/ に JSON で記録する。npm test から外し、vitest.agent.config.ts で流す。実 agent での N 回の実行と PJR-3R8F への結果の記載は利用者に任せる。package.json の script 追加は保護ファイルのため申し送りにした。

## 2. 変更ファイル

- `.github/instructions/vitest.instructions.md`: 変更、+1 / -0 行
- `tests/vitest-config.test.ts`: 変更、+12 / -0 行
- `vitest.unit.config.ts`: 変更、+2 / -1 行
- `tests/agent/helpers/orchestrator-scenario.test.ts`: 追加、+106 / -0 行
- `tests/agent/helpers/orchestrator-scenario.ts`: 追加、+347 / -0 行
- `tests/agent/orchestrator-quick-start.agent.test.ts`: 追加、+128 / -0 行
- `vitest.agent.config.ts`: 追加、+18 / -0 行

## 3. 申し送り

- package.json は executor から編集できない保護ファイルのため、script `"test:agent": "npm run build && vitest run --config vitest.agent.config.ts"` の追加を利用者に任せる。追加までは `npm run build && npx vitest run --config vitest.agent.config.ts` で流す。
- N 回（既定 5、`SPECDOJO_AGENT_TEST_RUNS`、モデルは `SPECDOJO_AGENT_TEST_MODEL` 既定 sonnet）の実行は未実施。claude CLI へのログインと利用枠の消費が要るため、利用者が流し、`tmp/agent-test/orchestrator-quick-start-*.json` の合格率・所要時間・費用を PJR-3R8F の採択理由に書いて 3R8F を決める。個票 PJR-FNB7 の作業内容 No.3 は理由を書いて open のまま残した。
- fixture の準備（init と npx specdojo の symlink）と claude の引数（`--agent`、`--settings`、`--setting-sources project`、`--strict-mcp-config`、`--allowedTools`、`--session-id` / `--resume`）は実機で未確認。初回の実行で起動エラーが出たら tests/agent/helpers/orchestrator-scenario.ts の runOrchestratorTurn を直す。
- 人の確認が必要: `npm run build && npx vitest run --config vitest.agent.config.ts`（実 claude CLI を起動して利用枠を消費するため sandbox では流せない。利用者が 5 回流し、合格率・所要時間・費用を PJR-3R8F の採択理由に書く）
- 最上位に追加したファイル: `vitest.agent.config.ts`

## 4. 進め方

reporter を使わず、runner が executor の報告（`final_message`・`handoff`）と証跡から機械的に作成した（`pipeline.mechanical_result`）。
