---
specdojo:
  id: prj-0001:xep-jbr-night-approved-register-a8a4379f38e2
  type: exec-plan
  rulebook: none
  task_id: JBR-night-approved-register-a8a4379f38e2
  name: "承認済み登録項目の夜間実行"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-night-approved-register
  run_id: JBR-night-approved-register-a8a4379f38e2
  owner: ARC
---

# Job Plan: 承認済み登録項目の夜間実行

## 1. このRunで行うこと

コマンドの終了結果を evidence として記録する。agent による判断は行わない。

## 2. Job Run

- `job_id`: job-night-approved-register
- `run_id`: JBR-night-approved-register-a8a4379f38e2
- `scheduled_at`: 2026-11-11T15:18:41.094Z
- `result`: `docs/ja/projects/prj-0001/execution/runs/job/JBR-night-approved-register-a8a4379f38e2/JBR-night-approved-register-a8a4379f38e2/result.md`

入力:

```json
{
  "max_items": 10,
  "parallel": 2,
  "max_consecutive_failures": 2,
  "on_rate_limit": "fallback",
  "fallback_executor": "argon-executor"
}
```

## 3. 対象成果物

- -

対象パス:

- -

### 3.1. 決定論的コマンド

runner が次の解決済みコマンドを agent の sandbox 外で直接実行する。

```sh
'/usr/local/bin/node' '/home/node/.npm/_npx/ea1e984cde0ed137/node_modules/.bin/specdojo' orchestrator night --project "prj-0001" --scheduled-at "2026-11-11T15:18:41.094Z" --max-items "10" --parallel "2" --max-consecutive-failures "2" --on-rate-limit "fallback" --fallback-executor-by "argon-executor"
```

コマンドの終了コードから Run の成否を直接決定する。

## 4. 完了手順

1. 指示と入力に従って対象成果物を更新する。
2. 必要な整形・静的検査を実行する。
3. resultの必須セクションを記入し、`_TODO_`を残したまま終了しない。

## 5. 異常終了の条件

- 入力不足、対象不明、検査未解消の場合は異常終了する。
- agent自身はJob Runの状態やcheckpointを変更しない。runnerが終了結果を反映する。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
