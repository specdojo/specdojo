---
specdojo:
  id: prj-0001:xep-jbr-night-approved-register-a56f170ee9d8
  type: exec-plan
  rulebook: none
  task_id: JBR-night-approved-register-a56f170ee9d8
  name: "承認済み登録項目の夜間実行"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-night-approved-register
  run_id: JBR-night-approved-register-a56f170ee9d8
  owner: ARC
---

# Job Plan: 承認済み登録項目の夜間実行

## 1. このRunで行うこと

コマンドの終了結果を evidence として記録する。agent による判断は行わない。

## 2. job run

- `job_id`: job-night-approved-register
- `run_id`: JBR-night-approved-register-a56f170ee9d8
- `scheduled_at`: 2026-11-22T15:00:00.000Z
- `result`: `docs/ja/projects/prj-0001/execution/runs/job/JBR-night-approved-register-a56f170ee9d8/JBR-night-approved-register-a56f170ee9d8/result.md`

入力:

```json
{
  "max_items": 10,
  "parallel": 2,
  "max_consecutive_failures": 2,
  "on_rate_limit": "fallback",
  "fallback_executor": "opus-executor"
}
```

## 3. 対象成果物

- -

対象パス:

- -

### 3.1. 決定論的コマンド

runner が次の解決済みコマンドを agent の sandbox 外で直接実行する。

```sh
'/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' orchestrator night --project "prj-0001" --scheduled-at "2026-11-22T15:00:00.000Z" --max-items "10" --parallel "2" --max-consecutive-failures "2" --on-rate-limit "fallback" --fallback-executor-by "opus-executor"
```

コマンドの終了コードから Run の成否を直接決定する。

## 4. 完了手順

1. 指示と入力に従って対象成果物を更新する。
2. 必要な整形・静的検査を実行する。
3. resultの必須セクションを記入し、`_TODO_`を残したまま終了しない。

## 5. 異常終了の条件

- 入力不足、対象不明、検査未解消の場合は異常終了する。
- agent自身はjob runの状態やcheckpointを変更しない。runnerが終了結果を反映する。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
