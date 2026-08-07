_FRONTMATTER_

# Job Plan: _JOB_NAME_

## 1. このRunで行うこと

_JOB_DESCRIPTION_

## 2. Job Run

- `job_id`: _JOB_ID_
- `run_id`: _RUN_ID_
- `scheduled_at`: _SCHEDULED_AT_
- `result`: `_RESULT_REF_`

入力:

```json
_JOB_INPUTS_
```

## 3. 対象成果物

_JOB_TARGETS_

対象パス:

_JOB_PATHS_

## 4. 完了手順

1. 指示と入力に従って対象成果物を更新する。
2. 必要な整形・静的検査を実行する。
3. resultの必須セクションを記入し、`_TODO_`を残したまま終了しない。

## 5. 異常終了の条件

- 入力不足、対象不明、検査未解消の場合は異常終了する。
- agent自身はJob Runの状態やcheckpointを変更しない。runnerが終了結果を反映する。

_COMMON_CONVENTIONS_
