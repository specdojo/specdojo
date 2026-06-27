# Ready Tasks

- schedule_path: `docs/ja/projects/prj-0001/030-project-management/schedule`
- execution_path: `docs/ja/projects/prj-0001/030-project-management/execution`
- ready_count: `6`
- default_strategy: `critical-first`

## Claim Targets

| strategy | next_task_id |
|---|---|
| critical-first | `T-LAUNCH-prj-scope-010` |
| fifo | `T-LAUNCH-pm-communication-plan-080-I01` |

## Ready Order (critical-first)

| rank | id | owner | slack | ES | schedule_file |
|---:|---|---|---:|---:|---|
| 1 | `T-LAUNCH-prj-scope-010` | BA | -5.542441505745899e-16 | 0.001 | sch-track-launch.yaml |
| 2 | `T-LAUNCH-pm-roles-010` | PO | -4.440892098500626e-16 | 1.001 | sch-track-launch.yaml |
| 3 | `T-LAUNCH-pm-communication-plan-080-I01` | PM | 0 | 4.2509999999999994 | sch-track-launch.yaml |
| 4 | `T-LAUNCH-pm-members-080-I01` | PO | 0 | 4.2509999999999994 | sch-track-launch.yaml |
| 5 | `T-LAUNCH-pm-roles-080-I01` | PO | 0 | 4.2509999999999994 | sch-track-launch.yaml |
| 6 | `T-LAUNCH-prj-stakeholder-register-010` | BA | 1.9999999999999996 | 0.001 | sch-track-launch.yaml |

## FIFO Order

- `T-LAUNCH-pm-communication-plan-080-I01`
- `T-LAUNCH-pm-members-080-I01`
- `T-LAUNCH-pm-roles-010`
- `T-LAUNCH-pm-roles-080-I01`
- `T-LAUNCH-prj-scope-010`
- `T-LAUNCH-prj-stakeholder-register-010`
