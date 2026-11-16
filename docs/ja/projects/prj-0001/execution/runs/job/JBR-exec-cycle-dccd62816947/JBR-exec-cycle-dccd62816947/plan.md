---
specdojo:
  id: prj-0001:xep-jbr-exec-cycle-dccd62816947
  type: exec-plan
  rulebook: none
  task_id: JBR-exec-cycle-dccd62816947
  name: "延期 task 再開と Ready task 自動実行"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-exec-cycle
  run_id: JBR-exec-cycle-dccd62816947
  owner: ARC
---

# Job Plan: 延期 task 再開と Ready task 自動実行

## 1. このRunで行うこと

コマンドの終了結果を evidence として記録する。agent による判断は行わない。

## 2. Job Run

- `job_id`: job-exec-cycle
- `run_id`: JBR-exec-cycle-dccd62816947
- `scheduled_at`: 2026-11-14T21:00:00.000Z
- `result`: `docs/ja/projects/prj-0001/execution/runs/job/JBR-exec-cycle-dccd62816947/JBR-exec-cycle-dccd62816947/result.md`

入力:

```json
{
  "strategy": "critical-first",
  "parallel": 1,
  "loop": true,
  "max_rounds": 100,
  "edit_by": "sol-executor",
  "review_by": "sol-review-executor"
}
```

## 3. 対象成果物

- -

対象パス:

- -

### 3.1. 決定論的コマンド

runner が次の解決済みコマンドを agent の sandbox 外で直接実行する。

```sh
set -- exec cycle --project "prj-0001" --strategy "critical-first" --parallel "1" --if-busy skip
if [ "true" = "true" ]; then
  set -- "$@" --loop
  if [ -n "100" ]; then
    set -- "$@" --max-rounds "100"
  fi
fi
if [ -n "sol-executor" ]; then
  set -- "$@" --edit-by "sol-executor"
fi
if [ -n "sol-review-executor" ]; then
  set -- "$@" --review-by "sol-review-executor"
fi
'/usr/local/bin/node' '/workspaces/specdojo-workspace/specdojo/dist/specdojo.js' "$@"
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
