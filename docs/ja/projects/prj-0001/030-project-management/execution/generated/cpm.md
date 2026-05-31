# CPM

- project_duration_days: `5.625`

| id | owner | kind | dur | ES | EF | LS | LF | slack | depends_on |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| `T-LAUNCH-pm-plan-010` | PM | task | 0.25 | 0 | 0.25 | 3.25 | 3.5 | 3.25 |  |
| `T-LAUNCH-prj-overview-010` | BA | task | 0.25 | 0 | 0.25 | 0 | 0.25 | 0 |  |
| `T-LAUNCH-sch-defaults-000` | ARC | task | 0.001 | 0 | 0.001 | 5.624 | 5.625 | 5.624 |  |
| `T-LAUNCH-sch-strategy-launch-000` | PM | task | 0.001 | 0 | 0.001 | 5.624 | 5.625 | 5.624 |  |
| `T-LAUNCH-pm-plan-020` | PM | task | 0.5 | 0.25 | 0.75 | 3.5 | 4 | 3.25 | T-LAUNCH-pm-plan-010 |
| `T-LAUNCH-prj-overview-020` | BA | task | 0.5 | 0.25 | 0.75 | 0.25 | 0.75 | 0 | T-LAUNCH-prj-overview-010 |
| `T-LAUNCH-pm-plan-030` | PM | task | 0.25 | 0.75 | 1 | 4 | 4.25 | 3.25 | T-LAUNCH-pm-plan-020 |
| `T-LAUNCH-prj-overview-030` | BA | task | 0.25 | 0.75 | 1 | 0.75 | 1 | 0 | T-LAUNCH-prj-overview-020 |
| `T-LAUNCH-pm-communication-plan-010` | PM | task | 0.25 | 1 | 1.25 | 4.25 | 4.5 | 3.25 | T-LAUNCH-pm-plan-030 |
| `T-LAUNCH-pm-organization-010` | PO | task | 0.25 | 1 | 1.25 | 2.25 | 2.5 | 1.25 | T-LAUNCH-prj-overview-030 |
| `T-LAUNCH-pm-quality-management-plan-010` | PM | task | 0.25 | 1 | 1.25 | 4.25 | 4.5 | 3.25 | T-LAUNCH-pm-plan-030 |
| `T-LAUNCH-prj-scope-010` | BA | task | 0.25 | 1 | 1.25 | 1 | 1.25 | 0 | T-LAUNCH-prj-overview-030 |
| `T-LAUNCH-prj-stakeholder-register-010` | BA | task | 0.25 | 1 | 1.25 | 3.25 | 3.5 | 2.25 | T-LAUNCH-prj-overview-030 |
| `T-LAUNCH-pm-communication-plan-020` | PM | task | 0.5 | 1.25 | 1.75 | 4.5 | 5 | 3.25 | T-LAUNCH-pm-communication-plan-010 |
| `T-LAUNCH-pm-organization-020` | PO | task | 0.5 | 1.25 | 1.75 | 2.5 | 3 | 1.25 | T-LAUNCH-pm-organization-010 |
| `T-LAUNCH-pm-quality-management-plan-020` | PM | task | 0.5 | 1.25 | 1.75 | 4.5 | 5 | 3.25 | T-LAUNCH-pm-quality-management-plan-010 |
| `T-LAUNCH-prj-scope-020` | BA | task | 0.5 | 1.25 | 1.75 | 1.25 | 1.75 | 0 | T-LAUNCH-prj-scope-010 |
| `T-LAUNCH-prj-stakeholder-register-020` | BA | task | 0.5 | 1.25 | 1.75 | 3.5 | 4 | 2.25 | T-LAUNCH-prj-stakeholder-register-010 |
| `T-LAUNCH-pm-communication-plan-030` | PM | task | 0.25 | 1.75 | 2 | 5 | 5.25 | 3.25 | T-LAUNCH-pm-communication-plan-020 |
| `T-LAUNCH-pm-organization-030` | PO | task | 0.25 | 1.75 | 2 | 3 | 3.25 | 1.25 | T-LAUNCH-pm-organization-020 |
| `T-LAUNCH-pm-quality-management-plan-030` | PM | task | 0.25 | 1.75 | 2 | 5 | 5.25 | 3.25 | T-LAUNCH-pm-quality-management-plan-020 |
| `T-LAUNCH-prj-scope-030` | BA | task | 0.25 | 1.75 | 2 | 1.75 | 2 | 0 | T-LAUNCH-prj-scope-020 |
| `T-LAUNCH-prj-stakeholder-register-030` | BA | task | 0.25 | 1.75 | 2 | 4 | 4.25 | 2.25 | T-LAUNCH-prj-stakeholder-register-020 |
| `T-LAUNCH-pm-raci-010` | PM | task | 0.25 | 2 | 2.25 | 4.25 | 4.5 | 2.25 | T-LAUNCH-pm-organization-030 |
| `T-LAUNCH-pm-roles-010` | PO | task | 0.25 | 2 | 2.25 | 3.25 | 3.5 | 1.25 | T-LAUNCH-pm-organization-030 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-010` | ARC | task | 0.25 | 2 | 2.25 | 2 | 2.25 | 0 | T-LAUNCH-prj-scope-030 |
| `T-LAUNCH-prj-charter-010` | PO | task | 0.25 | 2 | 2.25 | 4.25 | 4.5 | 2.25 | T-LAUNCH-prj-overview-030, T-LAUNCH-prj-stakeholder-register-030 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-010` | BA | task | 0.25 | 2 | 2.25 | 4.25 | 4.5 | 2.25 | T-LAUNCH-prj-scope-030 |
| `T-LAUNCH-pm-raci-020` | PM | task | 0.5 | 2.25 | 2.75 | 4.5 | 5 | 2.25 | T-LAUNCH-pm-raci-010 |
| `T-LAUNCH-pm-roles-020` | PO | task | 0.5 | 2.25 | 2.75 | 3.5 | 4 | 1.25 | T-LAUNCH-pm-roles-010 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-020` | ARC | task | 0.5 | 2.25 | 2.75 | 2.25 | 2.75 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-010 |
| `T-LAUNCH-prj-charter-020` | PO | task | 0.5 | 2.25 | 2.75 | 4.5 | 5 | 2.25 | T-LAUNCH-prj-charter-010 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-020` | BA | task | 0.5 | 2.25 | 2.75 | 4.5 | 5 | 2.25 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-010 |
| `T-LAUNCH-pm-raci-030` | PM | task | 0.25 | 2.75 | 3 | 5 | 5.25 | 2.25 | T-LAUNCH-pm-raci-020 |
| `T-LAUNCH-pm-roles-030` | PO | task | 0.25 | 2.75 | 3 | 4 | 4.25 | 1.25 | T-LAUNCH-pm-roles-020 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-030` | ARC | task | 0.25 | 2.75 | 3 | 2.75 | 3 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-020 |
| `T-LAUNCH-prj-charter-030` | PO | task | 0.25 | 2.75 | 3 | 5 | 5.25 | 2.25 | T-LAUNCH-prj-charter-020 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-030` | BA | task | 0.25 | 2.75 | 3 | 5 | 5.25 | 2.25 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-020 |
| `T-LAUNCH-pm-members-010` | PO | task | 0.25 | 3 | 3.25 | 4.25 | 4.5 | 1.25 | T-LAUNCH-pm-organization-030, T-LAUNCH-pm-roles-030 |
| `T-LAUNCH-prj-issues-and-approach-010` | BA | task | 0.25 | 3 | 3.25 | 3 | 3.25 | 0 | T-LAUNCH-prj-scope-030, T-LAUNCH-prj-assumptions-constraints-dependencies-030 |
| `T-LAUNCH-pm-members-020` | PO | task | 0.5 | 3.25 | 3.75 | 4.5 | 5 | 1.25 | T-LAUNCH-pm-members-010 |
| `T-LAUNCH-prj-issues-and-approach-020` | BA | task | 0.5 | 3.25 | 3.75 | 3.25 | 3.75 | 0 | T-LAUNCH-prj-issues-and-approach-010 |
| `T-LAUNCH-pm-members-030` | PO | task | 0.25 | 3.75 | 4 | 5 | 5.25 | 1.25 | T-LAUNCH-pm-members-020 |
| `T-LAUNCH-prj-issues-and-approach-030` | BA | task | 0.25 | 3.75 | 4 | 3.75 | 4 | 0 | T-LAUNCH-prj-issues-and-approach-020 |
| `T-LAUNCH-prj-comparison-of-alternatives-010` | ARC | task | 0.5 | 4 | 4.5 | 4 | 4.5 | 0 | T-LAUNCH-prj-scope-030, T-LAUNCH-prj-issues-and-approach-030 |
| `T-LAUNCH-prj-comparison-of-alternatives-020` | ARC | task | 0.5 | 4.5 | 5 | 4.5 | 5 | 0 | T-LAUNCH-prj-comparison-of-alternatives-010 |
| `T-LAUNCH-prj-comparison-of-alternatives-030` | ARC | task | 0.25 | 5 | 5.25 | 5 | 5.25 | 0 | T-LAUNCH-prj-comparison-of-alternatives-020 |
| `GATE-LAUNCH-FP` | PM | gate | 0 | 5.25 | 5.25 | 5.25 | 5.25 | 0 | T-LAUNCH-prj-overview-030, T-LAUNCH-prj-scope-030, T-LAUNCH-prj-success-criteria-and-acceptance-criteria-030, T-LAUNCH-prj-stakeholder-register-030, T-LAUNCH-prj-charter-030, T-LAUNCH-prj-assumptions-constraints-dependencies-030, T-LAUNCH-prj-issues-and-approach-030, T-LAUNCH-prj-comparison-of-alternatives-030, T-LAUNCH-pm-plan-030, T-LAUNCH-pm-communication-plan-030, T-LAUNCH-pm-quality-management-plan-030, T-LAUNCH-pm-organization-030, T-LAUNCH-pm-roles-030, T-LAUNCH-pm-members-030, T-LAUNCH-pm-raci-030 |
| `T-LAUNCH-pm-communication-plan-040` | PM | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-pm-communication-plan-030, GATE-LAUNCH-FP |
| `T-LAUNCH-pm-members-040` | PO | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-pm-members-030, GATE-LAUNCH-FP |
| `T-LAUNCH-pm-organization-040` | PO | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-pm-organization-030, GATE-LAUNCH-FP |
| `T-LAUNCH-pm-plan-040` | PM | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-pm-plan-030, GATE-LAUNCH-FP |
| `T-LAUNCH-pm-quality-management-plan-040` | PM | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-pm-quality-management-plan-030, GATE-LAUNCH-FP |
| `T-LAUNCH-pm-raci-040` | PM | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-pm-raci-030, GATE-LAUNCH-FP |
| `T-LAUNCH-pm-roles-040` | PO | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-pm-roles-030, GATE-LAUNCH-FP |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-040` | ARC | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-030, GATE-LAUNCH-FP |
| `T-LAUNCH-prj-charter-040` | PO | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-prj-charter-030, GATE-LAUNCH-FP |
| `T-LAUNCH-prj-comparison-of-alternatives-040` | ARC | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-prj-comparison-of-alternatives-030, GATE-LAUNCH-FP |
| `T-LAUNCH-prj-issues-and-approach-040` | BA | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-prj-issues-and-approach-030, GATE-LAUNCH-FP |
| `T-LAUNCH-prj-overview-040` | BA | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-prj-overview-030, GATE-LAUNCH-FP |
| `T-LAUNCH-prj-scope-040` | BA | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-prj-scope-030, GATE-LAUNCH-FP |
| `T-LAUNCH-prj-stakeholder-register-040` | BA | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-prj-stakeholder-register-030, GATE-LAUNCH-FP |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-040` | BA | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-030, GATE-LAUNCH-FP |
| `T-LAUNCH-pm-communication-plan-050` | PM | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-pm-communication-plan-040 |
| `T-LAUNCH-pm-members-050` | PO | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-pm-members-040 |
| `T-LAUNCH-pm-organization-050` | PO | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-pm-organization-040 |
| `T-LAUNCH-pm-plan-050` | PM | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-pm-plan-040 |
| `T-LAUNCH-pm-quality-management-plan-050` | PM | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-pm-quality-management-plan-040 |
| `T-LAUNCH-pm-raci-050` | PM | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-pm-raci-040 |
| `T-LAUNCH-pm-roles-050` | PO | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-pm-roles-040 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-050` | ARC | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-040 |
| `T-LAUNCH-prj-charter-050` | PO | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-prj-charter-040 |
| `T-LAUNCH-prj-comparison-of-alternatives-050` | ARC | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-prj-comparison-of-alternatives-040 |
| `T-LAUNCH-prj-issues-and-approach-050` | BA | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-prj-issues-and-approach-040 |
| `T-LAUNCH-prj-overview-050` | BA | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-prj-overview-040 |
| `T-LAUNCH-prj-scope-050` | BA | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-prj-scope-040 |
| `T-LAUNCH-prj-stakeholder-register-050` | BA | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-prj-stakeholder-register-040 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-050` | BA | task | 0.125 | 5.5 | 5.625 | 5.5 | 5.625 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-040 |
| `M-LAUNCH-PJD-900` | PM | milestone | 0 | 5.625 | 5.625 | 5.625 | 5.625 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-050, T-LAUNCH-prj-charter-050, T-LAUNCH-prj-comparison-of-alternatives-050 |
| `M-LAUNCH-PJM-PLAN-900` | PM | milestone | 0 | 5.625 | 5.625 | 5.625 | 5.625 | 0 | T-LAUNCH-pm-communication-plan-050, T-LAUNCH-pm-quality-management-plan-050, T-LAUNCH-pm-members-050, T-LAUNCH-pm-raci-050, T-LAUNCH-sch-defaults-000, T-LAUNCH-sch-strategy-launch-000 |
