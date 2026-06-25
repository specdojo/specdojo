# Ready Tasks

- schedule_path: `docs/ja/projects/prj-0001/030-project-management/schedule`
- execution_path: `docs/ja/projects/prj-0001/030-project-management/execution`
- ready_count: `4`
- default_strategy: `critical-first`

## Claim Targets

| strategy | next_task_id |
|---|---|
| critical-first | `T-LAUNCH-pm-roles-010` |
| fifo | `T-LAUNCH-pm-raci-010` |

## Ready Order (critical-first)

| rank | id | owner | slack | ES | schedule_file |
|---:|---|---|---:|---:|---|
| 1 | `T-LAUNCH-pm-roles-010` | PO | -4.440892098500626e-16 | 1.001 | sch-track-launch.yaml |
| 2 | `T-LAUNCH-prj-issues-and-approach-010` | BA | -4.440892098500626e-16 | 2.001 | sch-track-launch.yaml |
| 3 | `T-LAUNCH-pm-raci-010` | PM | 1.9999999999999996 | 1.001 | sch-track-launch.yaml |
| 4 | `T-LAUNCH-prj-charter-010` | PO | 1.9999999999999996 | 1.001 | sch-track-launch.yaml |

## FIFO Order

- `T-LAUNCH-pm-raci-010`
- `T-LAUNCH-pm-roles-010`
- `T-LAUNCH-prj-charter-010`
- `T-LAUNCH-prj-issues-and-approach-010`
