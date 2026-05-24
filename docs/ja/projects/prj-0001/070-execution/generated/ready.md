# Ready Tasks

- schedule_path: `docs/ja/projects/prj-0001/030-project-management/schedule`
- execution_path: `docs/ja/projects/prj-0001/070-execution`
- ready_count: `4`
- default_strategy: `critical-first`

## Claim Targets

| strategy | next_task_id |
|---|---|
| critical-first | `T-LAUNCH-PJD-OVERVIEW-010` |
| fifo | `T-LAUNCH-PJD-OVERVIEW-010` |

## Ready Order (critical-first)

| rank | id | owner | slack | ES | schedule_file |
|---:|---|---|---:|---:|---|
| 1 | `T-LAUNCH-PJD-OVERVIEW-010` | BA | 0 | 0 | sch-track-launch.yaml |
| 2 | `T-LAUNCH-PJM-PLAN-010` | PM | 1.5 | 0 | sch-track-launch.yaml |
| 3 | `T-LAUNCH-PJM-SCHDEF-010` | ARC | 2.0625 | 0 | sch-track-launch.yaml |
| 4 | `T-LAUNCH-PJM-SCHSTG-010` | PM | 2.0625 | 0 | sch-track-launch.yaml |

## FIFO Order

- `T-LAUNCH-PJD-OVERVIEW-010`
- `T-LAUNCH-PJM-PLAN-010`
- `T-LAUNCH-PJM-SCHDEF-010`
- `T-LAUNCH-PJM-SCHSTG-010`
