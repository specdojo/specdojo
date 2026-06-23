# Ready Tasks

- schedule_path: `docs/ja/projects/prj-0001/030-project-management/schedule`
- execution_path: `docs/ja/projects/prj-0001/030-project-management/execution`
- ready_count: `3`
- default_strategy: `critical-first`

## Claim Targets

| strategy | next_task_id |
|---|---|
| critical-first | `T-LAUNCH-pm-organization-010` |
| fifo | `T-LAUNCH-pm-organization-010` |

## Ready Order (critical-first)

| rank | id | owner | slack | ES | schedule_file |
|---:|---|---|---:|---:|---|
| 1 | `T-LAUNCH-pm-organization-010` | PO | -5.542441505745899e-16 | 0.001 | sch-track-launch.yaml |
| 2 | `T-LAUNCH-prj-scope-010` | BA | -5.542441505745899e-16 | 0.001 | sch-track-launch.yaml |
| 3 | `T-LAUNCH-prj-stakeholder-register-010` | BA | 1.9999999999999996 | 0.001 | sch-track-launch.yaml |

## FIFO Order

- `T-LAUNCH-pm-organization-010`
- `T-LAUNCH-prj-scope-010`
- `T-LAUNCH-prj-stakeholder-register-010`
