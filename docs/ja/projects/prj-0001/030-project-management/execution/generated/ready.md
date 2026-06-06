# Ready Tasks

- schedule_path: `docs/ja/projects/prj-0001/030-project-management/schedule`
- execution_path: `docs/ja/projects/prj-0001/030-project-management/execution`
- ready_count: `2`
- default_strategy: `critical-first`

## Claim Targets

| strategy | next_task_id |
|---|---|
| critical-first | `T-LAUNCH-prj-overview-020` |
| fifo | `T-LAUNCH-pm-plan-010` |

## Ready Order (critical-first)

| rank | id | owner | slack | ES | schedule_file |
|---:|---|---|---:|---:|---|
| 1 | `T-LAUNCH-prj-overview-020` | BA | 0 | 0.25 | sch-track-launch.yaml |
| 2 | `T-LAUNCH-pm-plan-010` | PM | 3.25 | 0 | sch-track-launch.yaml |

## FIFO Order

- `T-LAUNCH-pm-plan-010`
- `T-LAUNCH-prj-overview-020`
