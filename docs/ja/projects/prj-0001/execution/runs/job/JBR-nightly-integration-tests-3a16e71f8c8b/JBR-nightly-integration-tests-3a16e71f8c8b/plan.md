---
specdojo:
  id: prj-0001:xep-jbr-nightly-integration-tests-3a16e71f8c8b
  type: exec-plan
  rulebook: none
  task_id: JBR-nightly-integration-tests-3a16e71f8c8b
  name: "統合テストの全件実行"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: job
  job_id: job-nightly-integration-tests
  run_id: JBR-nightly-integration-tests-3a16e71f8c8b
  owner: DEV
---

# Job Plan: 統合テストの全件実行

## 1. このRunで行うこと

コマンドの終了結果を evidence として記録する。agent による判断は行わない。

## 2. job run

- `job_id`: job-nightly-integration-tests
- `run_id`: JBR-nightly-integration-tests-3a16e71f8c8b
- `scheduled_at`: 2026-11-23T04:22:37.700Z
- `result`: `docs/ja/projects/prj-0001/execution/runs/job/JBR-nightly-integration-tests-3a16e71f8c8b/JBR-nightly-integration-tests-3a16e71f8c8b/result.md`

入力:

```json
{}
```

## 3. 対象成果物

- -

対象パス:

- -

### 3.1. 決定論的コマンド

runner が次の解決済みコマンドを agent の sandbox 外で直接実行する。

```sh
# integration-tests
'/usr/local/bin/node' '/usr/local/share/npm-global/bin/specdojo' orchestrator integration-tests --project "prj-0001" --scheduled-at "2026-11-23T04:22:37.700Z"
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
