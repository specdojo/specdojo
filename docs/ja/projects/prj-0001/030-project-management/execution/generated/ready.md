# Ready Tasks

- schedule_path: `docs/ja/projects/prj-0001/030-project-management/schedule`
- execution_path: `docs/ja/projects/prj-0001/030-project-management/execution`
- ready_count: `13`
- default_strategy: `critical-first`

## Claim Targets

| strategy | next_task_id |
|---|---|
| critical-first | `T-LAUNCH-pm-roles-070-I01` |
| fifo | `T-LAUNCH-pm-communication-plan-080-I01` |

## Ready Order (critical-first)

| rank | id | owner | slack | ES | schedule_file |
|---:|---|---|---:|---:|---|
| 1 | `T-LAUNCH-pm-roles-070-I01` | PO | 0 | 4.0009999999999994 | sch-track-launch.yaml |
| 2 | `T-LAUNCH-prj-assumptions-constraints-dependencies-070-I01` | ARC | 0 | 4.0009999999999994 | sch-track-launch.yaml |
| 3 | `T-LAUNCH-prj-charter-070-I01` | PO | 0 | 4.0009999999999994 | sch-track-launch.yaml |
| 4 | `T-LAUNCH-prj-comparison-of-alternatives-070-I01` | ARC | 0 | 4.0009999999999994 | sch-track-launch.yaml |
| 5 | `T-LAUNCH-prj-issues-and-approach-070-I01` | BA | 0 | 4.0009999999999994 | sch-track-launch.yaml |
| 6 | `T-LAUNCH-prj-scope-070-I01` | BA | 0 | 4.0009999999999994 | sch-track-launch.yaml |
| 7 | `T-LAUNCH-prj-stakeholder-register-070-I01` | BA | 0 | 4.0009999999999994 | sch-track-launch.yaml |
| 8 | `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-070-I01` | BA | 0 | 4.0009999999999994 | sch-track-launch.yaml |
| 9 | `T-LAUNCH-pm-communication-plan-080-I01` | PM | 0 | 4.2509999999999994 | sch-track-launch.yaml |
| 10 | `T-LAUNCH-pm-members-080-I01` | PO | 0 | 4.2509999999999994 | sch-track-launch.yaml |
| 11 | `T-LAUNCH-pm-organization-080-I01` | PO | 0 | 4.2509999999999994 | sch-track-launch.yaml |
| 12 | `T-LAUNCH-pm-plan-080-I01` | PM | 0 | 4.2509999999999994 | sch-track-launch.yaml |
| 13 | `T-LAUNCH-pm-quality-management-plan-080-I01` | PM | 0 | 4.2509999999999994 | sch-track-launch.yaml |

## FIFO Order

- `T-LAUNCH-pm-communication-plan-080-I01`
- `T-LAUNCH-pm-members-080-I01`
- `T-LAUNCH-pm-organization-080-I01`
- `T-LAUNCH-pm-plan-080-I01`
- `T-LAUNCH-pm-quality-management-plan-080-I01`
- `T-LAUNCH-pm-roles-070-I01`
- `T-LAUNCH-prj-assumptions-constraints-dependencies-070-I01`
- `T-LAUNCH-prj-charter-070-I01`
- `T-LAUNCH-prj-comparison-of-alternatives-070-I01`
- `T-LAUNCH-prj-issues-and-approach-070-I01`
- `T-LAUNCH-prj-scope-070-I01`
- `T-LAUNCH-prj-stakeholder-register-070-I01`
- `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-070-I01`
