# CPM

- project_duration_days: `11.125`

| id | owner | kind | dur | ES | EF | LS | LF | slack | depends_on |
|---|---|---:|---:|---:|---:|---:|---:|---:|---|
| `T-LAUNCH-prj-overview-010` | BA | task | 0.25 | 0 | 0.25 | 0 | 0.25 | 0 |  |
| `T-LAUNCH-sch-defaults-000` | ARC | task | 0.001 | 0 | 0.001 | 11.124 | 11.125 | 11.124 |  |
| `T-LAUNCH-sch-strategy-launch-000` | PM | task | 0.001 | 0 | 0.001 | 11.124 | 11.125 | 11.124 |  |
| `T-LAUNCH-prj-overview-020` | BA | task | 0.5 | 0.25 | 0.75 | 0.25 | 0.75 | 0 | T-LAUNCH-prj-overview-010 |
| `T-LAUNCH-prj-overview-030` | BA | task | 0.25 | 0.75 | 1 | 0.75 | 1 | 0 | T-LAUNCH-prj-overview-020 |
| `T-LAUNCH-prj-overview-040` | BA | task | 0.25 | 1 | 1.25 | 1 | 1.25 | 0 | T-LAUNCH-prj-overview-030 |
| `T-LAUNCH-prj-overview-050` | BA | task | 0.25 | 1.25 | 1.5 | 1.25 | 1.5 | 0 | T-LAUNCH-prj-overview-040 |
| `T-LAUNCH-prj-overview-060` | BA | task | 0.25 | 1.5 | 1.75 | 1.5 | 1.75 | 0 | T-LAUNCH-prj-overview-050 |
| `T-LAUNCH-pm-organization-010` | PO | task | 0.25 | 1.75 | 2 | 1.75 | 2 | 0 | T-LAUNCH-prj-overview-060 |
| `T-LAUNCH-prj-scope-010` | BA | task | 0.25 | 1.75 | 2 | 1.75 | 2 | 0 | T-LAUNCH-prj-overview-060 |
| `T-LAUNCH-prj-stakeholder-register-010` | BA | task | 0.25 | 1.75 | 2 | 5.25 | 5.5 | 3.5 | T-LAUNCH-prj-overview-060 |
| `T-LAUNCH-pm-organization-020` | PO | task | 0.5 | 2 | 2.5 | 2 | 2.5 | 0 | T-LAUNCH-pm-organization-010 |
| `T-LAUNCH-prj-scope-020` | BA | task | 0.5 | 2 | 2.5 | 2 | 2.5 | 0 | T-LAUNCH-prj-scope-010 |
| `T-LAUNCH-prj-stakeholder-register-020` | BA | task | 0.5 | 2 | 2.5 | 5.5 | 6 | 3.5 | T-LAUNCH-prj-stakeholder-register-010 |
| `T-LAUNCH-pm-organization-030` | PO | task | 0.25 | 2.5 | 2.75 | 2.5 | 2.75 | 0 | T-LAUNCH-pm-organization-020 |
| `T-LAUNCH-prj-scope-030` | BA | task | 0.25 | 2.5 | 2.75 | 2.5 | 2.75 | 0 | T-LAUNCH-prj-scope-020 |
| `T-LAUNCH-prj-stakeholder-register-030` | BA | task | 0.25 | 2.5 | 2.75 | 6 | 6.25 | 3.5 | T-LAUNCH-prj-stakeholder-register-020 |
| `T-LAUNCH-pm-organization-040` | PO | task | 0.25 | 2.75 | 3 | 2.75 | 3 | 0 | T-LAUNCH-pm-organization-030 |
| `T-LAUNCH-prj-scope-040` | BA | task | 0.25 | 2.75 | 3 | 2.75 | 3 | 0 | T-LAUNCH-prj-scope-030 |
| `T-LAUNCH-prj-stakeholder-register-040` | BA | task | 0.25 | 2.75 | 3 | 6.25 | 6.5 | 3.5 | T-LAUNCH-prj-stakeholder-register-030 |
| `T-LAUNCH-pm-organization-050` | PO | task | 0.25 | 3 | 3.25 | 3 | 3.25 | 0 | T-LAUNCH-pm-organization-040 |
| `T-LAUNCH-prj-scope-050` | BA | task | 0.25 | 3 | 3.25 | 3 | 3.25 | 0 | T-LAUNCH-prj-scope-040 |
| `T-LAUNCH-prj-stakeholder-register-050` | BA | task | 0.25 | 3 | 3.25 | 6.5 | 6.75 | 3.5 | T-LAUNCH-prj-stakeholder-register-040 |
| `T-LAUNCH-pm-organization-060` | PO | task | 0.25 | 3.25 | 3.5 | 3.25 | 3.5 | 0 | T-LAUNCH-pm-organization-050 |
| `T-LAUNCH-prj-scope-060` | BA | task | 0.25 | 3.25 | 3.5 | 3.25 | 3.5 | 0 | T-LAUNCH-prj-scope-050 |
| `T-LAUNCH-prj-stakeholder-register-060` | BA | task | 0.25 | 3.25 | 3.5 | 6.75 | 7 | 3.5 | T-LAUNCH-prj-stakeholder-register-050 |
| `T-LAUNCH-pm-raci-010` | PM | task | 0.25 | 3.5 | 3.75 | 7 | 7.25 | 3.5 | T-LAUNCH-pm-organization-060 |
| `T-LAUNCH-pm-roles-010` | PO | task | 0.25 | 3.5 | 3.75 | 3.5 | 3.75 | 0 | T-LAUNCH-pm-organization-060 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-010` | ARC | task | 0.25 | 3.5 | 3.75 | 3.5 | 3.75 | 0 | T-LAUNCH-prj-scope-060 |
| `T-LAUNCH-prj-charter-010` | PO | task | 0.25 | 3.5 | 3.75 | 7 | 7.25 | 3.5 | T-LAUNCH-prj-overview-060, T-LAUNCH-prj-stakeholder-register-060 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-010` | BA | task | 0.25 | 3.5 | 3.75 | 7 | 7.25 | 3.5 | T-LAUNCH-prj-scope-060 |
| `T-LAUNCH-pm-raci-020` | PM | task | 0.5 | 3.75 | 4.25 | 7.25 | 7.75 | 3.5 | T-LAUNCH-pm-raci-010 |
| `T-LAUNCH-pm-roles-020` | PO | task | 0.5 | 3.75 | 4.25 | 3.75 | 4.25 | 0 | T-LAUNCH-pm-roles-010 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-020` | ARC | task | 0.5 | 3.75 | 4.25 | 3.75 | 4.25 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-010 |
| `T-LAUNCH-prj-charter-020` | PO | task | 0.5 | 3.75 | 4.25 | 7.25 | 7.75 | 3.5 | T-LAUNCH-prj-charter-010 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-020` | BA | task | 0.5 | 3.75 | 4.25 | 7.25 | 7.75 | 3.5 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-010 |
| `T-LAUNCH-pm-raci-030` | PM | task | 0.25 | 4.25 | 4.5 | 7.75 | 8 | 3.5 | T-LAUNCH-pm-raci-020 |
| `T-LAUNCH-pm-roles-030` | PO | task | 0.25 | 4.25 | 4.5 | 4.25 | 4.5 | 0 | T-LAUNCH-pm-roles-020 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-030` | ARC | task | 0.25 | 4.25 | 4.5 | 4.25 | 4.5 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-020 |
| `T-LAUNCH-prj-charter-030` | PO | task | 0.25 | 4.25 | 4.5 | 7.75 | 8 | 3.5 | T-LAUNCH-prj-charter-020 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-030` | BA | task | 0.25 | 4.25 | 4.5 | 7.75 | 8 | 3.5 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-020 |
| `T-LAUNCH-pm-raci-040` | PM | task | 0.25 | 4.5 | 4.75 | 8 | 8.25 | 3.5 | T-LAUNCH-pm-raci-030 |
| `T-LAUNCH-pm-roles-040` | PO | task | 0.25 | 4.5 | 4.75 | 4.5 | 4.75 | 0 | T-LAUNCH-pm-roles-030 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-040` | ARC | task | 0.25 | 4.5 | 4.75 | 4.5 | 4.75 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-030 |
| `T-LAUNCH-prj-charter-040` | PO | task | 0.25 | 4.5 | 4.75 | 8 | 8.25 | 3.5 | T-LAUNCH-prj-charter-030 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-040` | BA | task | 0.25 | 4.5 | 4.75 | 8 | 8.25 | 3.5 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-030 |
| `T-LAUNCH-pm-raci-050` | PM | task | 0.25 | 4.75 | 5 | 8.25 | 8.5 | 3.5 | T-LAUNCH-pm-raci-040 |
| `T-LAUNCH-pm-roles-050` | PO | task | 0.25 | 4.75 | 5 | 4.75 | 5 | 0 | T-LAUNCH-pm-roles-040 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-050` | ARC | task | 0.25 | 4.75 | 5 | 4.75 | 5 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-040 |
| `T-LAUNCH-prj-charter-050` | PO | task | 0.25 | 4.75 | 5 | 8.25 | 8.5 | 3.5 | T-LAUNCH-prj-charter-040 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-050` | BA | task | 0.25 | 4.75 | 5 | 8.25 | 8.5 | 3.5 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-040 |
| `T-LAUNCH-pm-raci-060` | PM | task | 0.25 | 5 | 5.25 | 8.5 | 8.75 | 3.5 | T-LAUNCH-pm-raci-050 |
| `T-LAUNCH-pm-roles-060` | PO | task | 0.25 | 5 | 5.25 | 5 | 5.25 | 0 | T-LAUNCH-pm-roles-050 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-060` | ARC | task | 0.25 | 5 | 5.25 | 5 | 5.25 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-050 |
| `T-LAUNCH-prj-charter-060` | PO | task | 0.25 | 5 | 5.25 | 8.5 | 8.75 | 3.5 | T-LAUNCH-prj-charter-050 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-060` | BA | task | 0.25 | 5 | 5.25 | 8.5 | 8.75 | 3.5 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-050 |
| `T-LAUNCH-pm-members-010` | PO | task | 0.25 | 5.25 | 5.5 | 7 | 7.25 | 1.75 | T-LAUNCH-pm-organization-060, T-LAUNCH-pm-roles-060 |
| `T-LAUNCH-pm-plan-010` | PM | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-pm-organization-060, T-LAUNCH-pm-roles-060 |
| `T-LAUNCH-prj-issues-and-approach-010` | BA | task | 0.25 | 5.25 | 5.5 | 5.25 | 5.5 | 0 | T-LAUNCH-prj-scope-060, T-LAUNCH-prj-assumptions-constraints-dependencies-060 |
| `T-LAUNCH-pm-members-020` | PO | task | 0.5 | 5.5 | 6 | 7.25 | 7.75 | 1.75 | T-LAUNCH-pm-members-010 |
| `T-LAUNCH-pm-plan-020` | PM | task | 0.5 | 5.5 | 6 | 5.5 | 6 | 0 | T-LAUNCH-pm-plan-010 |
| `T-LAUNCH-prj-issues-and-approach-020` | BA | task | 0.5 | 5.5 | 6 | 5.5 | 6 | 0 | T-LAUNCH-prj-issues-and-approach-010 |
| `T-LAUNCH-pm-members-030` | PO | task | 0.25 | 6 | 6.25 | 7.75 | 8 | 1.75 | T-LAUNCH-pm-members-020 |
| `T-LAUNCH-pm-plan-030` | PM | task | 0.25 | 6 | 6.25 | 6 | 6.25 | 0 | T-LAUNCH-pm-plan-020 |
| `T-LAUNCH-prj-issues-and-approach-030` | BA | task | 0.25 | 6 | 6.25 | 6 | 6.25 | 0 | T-LAUNCH-prj-issues-and-approach-020 |
| `T-LAUNCH-pm-members-040` | PO | task | 0.25 | 6.25 | 6.5 | 8 | 8.25 | 1.75 | T-LAUNCH-pm-members-030 |
| `T-LAUNCH-pm-plan-040` | PM | task | 0.25 | 6.25 | 6.5 | 6.25 | 6.5 | 0 | T-LAUNCH-pm-plan-030 |
| `T-LAUNCH-prj-issues-and-approach-040` | BA | task | 0.25 | 6.25 | 6.5 | 6.25 | 6.5 | 0 | T-LAUNCH-prj-issues-and-approach-030 |
| `T-LAUNCH-pm-members-050` | PO | task | 0.25 | 6.5 | 6.75 | 8.25 | 8.5 | 1.75 | T-LAUNCH-pm-members-040 |
| `T-LAUNCH-pm-plan-050` | PM | task | 0.25 | 6.5 | 6.75 | 6.5 | 6.75 | 0 | T-LAUNCH-pm-plan-040 |
| `T-LAUNCH-prj-issues-and-approach-050` | BA | task | 0.25 | 6.5 | 6.75 | 6.5 | 6.75 | 0 | T-LAUNCH-prj-issues-and-approach-040 |
| `T-LAUNCH-pm-members-060` | PO | task | 0.25 | 6.75 | 7 | 8.5 | 8.75 | 1.75 | T-LAUNCH-pm-members-050 |
| `T-LAUNCH-pm-plan-060` | PM | task | 0.25 | 6.75 | 7 | 6.75 | 7 | 0 | T-LAUNCH-pm-plan-050 |
| `T-LAUNCH-prj-issues-and-approach-060` | BA | task | 0.25 | 6.75 | 7 | 6.75 | 7 | 0 | T-LAUNCH-prj-issues-and-approach-050 |
| `T-LAUNCH-pm-communication-plan-010` | PM | task | 0.25 | 7 | 7.25 | 7 | 7.25 | 0 | T-LAUNCH-pm-plan-060 |
| `T-LAUNCH-pm-quality-management-plan-010` | PM | task | 0.25 | 7 | 7.25 | 7 | 7.25 | 0 | T-LAUNCH-pm-plan-060 |
| `T-LAUNCH-prj-comparison-of-alternatives-010` | ARC | task | 0.25 | 7 | 7.25 | 7 | 7.25 | 0 | T-LAUNCH-prj-scope-060, T-LAUNCH-prj-issues-and-approach-060 |
| `T-LAUNCH-pm-communication-plan-020` | PM | task | 0.5 | 7.25 | 7.75 | 7.25 | 7.75 | 0 | T-LAUNCH-pm-communication-plan-010 |
| `T-LAUNCH-pm-quality-management-plan-020` | PM | task | 0.5 | 7.25 | 7.75 | 7.25 | 7.75 | 0 | T-LAUNCH-pm-quality-management-plan-010 |
| `T-LAUNCH-prj-comparison-of-alternatives-020` | ARC | task | 0.5 | 7.25 | 7.75 | 7.25 | 7.75 | 0 | T-LAUNCH-prj-comparison-of-alternatives-010 |
| `T-LAUNCH-pm-communication-plan-030` | PM | task | 0.25 | 7.75 | 8 | 7.75 | 8 | 0 | T-LAUNCH-pm-communication-plan-020 |
| `T-LAUNCH-pm-quality-management-plan-030` | PM | task | 0.25 | 7.75 | 8 | 7.75 | 8 | 0 | T-LAUNCH-pm-quality-management-plan-020 |
| `T-LAUNCH-prj-comparison-of-alternatives-030` | ARC | task | 0.25 | 7.75 | 8 | 7.75 | 8 | 0 | T-LAUNCH-prj-comparison-of-alternatives-020 |
| `T-LAUNCH-pm-communication-plan-040` | PM | task | 0.25 | 8 | 8.25 | 8 | 8.25 | 0 | T-LAUNCH-pm-communication-plan-030 |
| `T-LAUNCH-pm-quality-management-plan-040` | PM | task | 0.25 | 8 | 8.25 | 8 | 8.25 | 0 | T-LAUNCH-pm-quality-management-plan-030 |
| `T-LAUNCH-prj-comparison-of-alternatives-040` | ARC | task | 0.25 | 8 | 8.25 | 8 | 8.25 | 0 | T-LAUNCH-prj-comparison-of-alternatives-030 |
| `T-LAUNCH-pm-communication-plan-050` | PM | task | 0.25 | 8.25 | 8.5 | 8.25 | 8.5 | 0 | T-LAUNCH-pm-communication-plan-040 |
| `T-LAUNCH-pm-quality-management-plan-050` | PM | task | 0.25 | 8.25 | 8.5 | 8.25 | 8.5 | 0 | T-LAUNCH-pm-quality-management-plan-040 |
| `T-LAUNCH-prj-comparison-of-alternatives-050` | ARC | task | 0.25 | 8.25 | 8.5 | 8.25 | 8.5 | 0 | T-LAUNCH-prj-comparison-of-alternatives-040 |
| `T-LAUNCH-pm-communication-plan-060` | PM | task | 0.25 | 8.5 | 8.75 | 8.5 | 8.75 | 0 | T-LAUNCH-pm-communication-plan-050 |
| `T-LAUNCH-pm-quality-management-plan-060` | PM | task | 0.25 | 8.5 | 8.75 | 8.5 | 8.75 | 0 | T-LAUNCH-pm-quality-management-plan-050 |
| `T-LAUNCH-prj-comparison-of-alternatives-060` | ARC | task | 0.25 | 8.5 | 8.75 | 8.5 | 8.75 | 0 | T-LAUNCH-prj-comparison-of-alternatives-050 |
| `G-LAUNCH-bootstrap-pass` | PM | gate | 0 | 8.75 | 8.75 | 8.75 | 8.75 | 0 | T-LAUNCH-prj-overview-060, T-LAUNCH-prj-scope-060, T-LAUNCH-prj-success-criteria-and-acceptance-criteria-060, T-LAUNCH-prj-stakeholder-register-060, T-LAUNCH-prj-charter-060, T-LAUNCH-prj-assumptions-constraints-dependencies-060, T-LAUNCH-prj-issues-and-approach-060, T-LAUNCH-prj-comparison-of-alternatives-060, T-LAUNCH-pm-organization-060, T-LAUNCH-pm-roles-060, T-LAUNCH-pm-plan-060, T-LAUNCH-pm-communication-plan-060, T-LAUNCH-pm-quality-management-plan-060, T-LAUNCH-pm-members-060, T-LAUNCH-pm-raci-060 |
| `T-LAUNCH-pm-communication-plan-070-I01` | PM | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-pm-communication-plan-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-pm-members-070-I01` | PO | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-pm-members-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-pm-organization-070-I01` | PO | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-pm-organization-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-pm-plan-070-I01` | PM | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-pm-plan-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-pm-quality-management-plan-070-I01` | PM | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-pm-quality-management-plan-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-pm-raci-070-I01` | PM | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-pm-raci-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-pm-roles-070-I01` | PO | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-pm-roles-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-070-I01` | ARC | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-prj-charter-070-I01` | PO | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-prj-charter-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-prj-comparison-of-alternatives-070-I01` | ARC | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-prj-comparison-of-alternatives-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-prj-issues-and-approach-070-I01` | BA | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-prj-issues-and-approach-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-prj-overview-070-I01` | BA | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-prj-overview-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-prj-scope-070-I01` | BA | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-prj-scope-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-prj-stakeholder-register-070-I01` | BA | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-prj-stakeholder-register-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-070-I01` | BA | task | 0.25 | 8.75 | 9 | 8.75 | 9 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-060, G-LAUNCH-bootstrap-pass |
| `T-LAUNCH-pm-communication-plan-080-I01` | PM | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-pm-communication-plan-070-I01 |
| `T-LAUNCH-pm-members-080-I01` | PO | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-pm-members-070-I01 |
| `T-LAUNCH-pm-organization-080-I01` | PO | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-pm-organization-070-I01 |
| `T-LAUNCH-pm-plan-080-I01` | PM | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-pm-plan-070-I01 |
| `T-LAUNCH-pm-quality-management-plan-080-I01` | PM | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-pm-quality-management-plan-070-I01 |
| `T-LAUNCH-pm-raci-080-I01` | PM | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-pm-raci-070-I01 |
| `T-LAUNCH-pm-roles-080-I01` | PO | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-pm-roles-070-I01 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-080-I01` | ARC | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-070-I01 |
| `T-LAUNCH-prj-charter-080-I01` | PO | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-prj-charter-070-I01 |
| `T-LAUNCH-prj-comparison-of-alternatives-080-I01` | ARC | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-prj-comparison-of-alternatives-070-I01 |
| `T-LAUNCH-prj-issues-and-approach-080-I01` | BA | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-prj-issues-and-approach-070-I01 |
| `T-LAUNCH-prj-overview-080-I01` | BA | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-prj-overview-070-I01 |
| `T-LAUNCH-prj-scope-080-I01` | BA | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-prj-scope-070-I01 |
| `T-LAUNCH-prj-stakeholder-register-080-I01` | BA | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-prj-stakeholder-register-070-I01 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-080-I01` | BA | task | 0.25 | 9 | 9.25 | 9 | 9.25 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-070-I01 |
| `T-LAUNCH-pm-communication-plan-070-I02` | PM | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-pm-communication-plan-080-I01 |
| `T-LAUNCH-pm-members-070-I02` | PO | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-pm-members-080-I01 |
| `T-LAUNCH-pm-organization-070-I02` | PO | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-pm-organization-080-I01 |
| `T-LAUNCH-pm-plan-070-I02` | PM | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-pm-plan-080-I01 |
| `T-LAUNCH-pm-quality-management-plan-070-I02` | PM | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-pm-quality-management-plan-080-I01 |
| `T-LAUNCH-pm-raci-070-I02` | PM | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-pm-raci-080-I01 |
| `T-LAUNCH-pm-roles-070-I02` | PO | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-pm-roles-080-I01 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-070-I02` | ARC | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-080-I01 |
| `T-LAUNCH-prj-charter-070-I02` | PO | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-prj-charter-080-I01 |
| `T-LAUNCH-prj-comparison-of-alternatives-070-I02` | ARC | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-prj-comparison-of-alternatives-080-I01 |
| `T-LAUNCH-prj-issues-and-approach-070-I02` | BA | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-prj-issues-and-approach-080-I01 |
| `T-LAUNCH-prj-overview-070-I02` | BA | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-prj-overview-080-I01 |
| `T-LAUNCH-prj-scope-070-I02` | BA | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-prj-scope-080-I01 |
| `T-LAUNCH-prj-stakeholder-register-070-I02` | BA | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-prj-stakeholder-register-080-I01 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-070-I02` | BA | task | 0.25 | 9.25 | 9.5 | 9.25 | 9.5 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-080-I01 |
| `T-LAUNCH-pm-communication-plan-080-I02` | PM | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-pm-communication-plan-070-I02 |
| `T-LAUNCH-pm-members-080-I02` | PO | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-pm-members-070-I02 |
| `T-LAUNCH-pm-organization-080-I02` | PO | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-pm-organization-070-I02 |
| `T-LAUNCH-pm-plan-080-I02` | PM | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-pm-plan-070-I02 |
| `T-LAUNCH-pm-quality-management-plan-080-I02` | PM | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-pm-quality-management-plan-070-I02 |
| `T-LAUNCH-pm-raci-080-I02` | PM | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-pm-raci-070-I02 |
| `T-LAUNCH-pm-roles-080-I02` | PO | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-pm-roles-070-I02 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-080-I02` | ARC | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-070-I02 |
| `T-LAUNCH-prj-charter-080-I02` | PO | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-prj-charter-070-I02 |
| `T-LAUNCH-prj-comparison-of-alternatives-080-I02` | ARC | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-prj-comparison-of-alternatives-070-I02 |
| `T-LAUNCH-prj-issues-and-approach-080-I02` | BA | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-prj-issues-and-approach-070-I02 |
| `T-LAUNCH-prj-overview-080-I02` | BA | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-prj-overview-070-I02 |
| `T-LAUNCH-prj-scope-080-I02` | BA | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-prj-scope-070-I02 |
| `T-LAUNCH-prj-stakeholder-register-080-I02` | BA | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-prj-stakeholder-register-070-I02 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-080-I02` | BA | task | 0.25 | 9.5 | 9.75 | 9.5 | 9.75 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-070-I02 |
| `G-LAUNCH-refine-pass` | PM | gate | 0 | 9.75 | 9.75 | 9.75 | 9.75 | 0 | T-LAUNCH-prj-overview-080-I02, T-LAUNCH-prj-scope-080-I02, T-LAUNCH-prj-success-criteria-and-acceptance-criteria-080-I02, T-LAUNCH-prj-stakeholder-register-080-I02, T-LAUNCH-prj-charter-080-I02, T-LAUNCH-prj-assumptions-constraints-dependencies-080-I02, T-LAUNCH-prj-issues-and-approach-080-I02, T-LAUNCH-prj-comparison-of-alternatives-080-I02, T-LAUNCH-pm-organization-080-I02, T-LAUNCH-pm-roles-080-I02, T-LAUNCH-pm-plan-080-I02, T-LAUNCH-pm-communication-plan-080-I02, T-LAUNCH-pm-quality-management-plan-080-I02, T-LAUNCH-pm-members-080-I02, T-LAUNCH-pm-raci-080-I02 |
| `T-LAUNCH-pm-communication-plan-090` | PM | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-pm-communication-plan-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-pm-members-090` | PO | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-pm-members-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-pm-organization-090` | PO | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-pm-organization-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-pm-plan-090` | PM | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-pm-plan-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-pm-quality-management-plan-090` | PM | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-pm-quality-management-plan-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-pm-raci-090` | PM | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-pm-raci-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-pm-roles-090` | PO | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-pm-roles-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-090` | ARC | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-prj-charter-090` | PO | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-prj-charter-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-prj-comparison-of-alternatives-090` | ARC | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-prj-comparison-of-alternatives-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-prj-issues-and-approach-090` | BA | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-prj-issues-and-approach-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-prj-overview-090` | BA | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-prj-overview-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-prj-scope-090` | BA | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-prj-scope-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-prj-stakeholder-register-090` | BA | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-prj-stakeholder-register-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-090` | BA | task | 0.25 | 9.75 | 10 | 9.75 | 10 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-080-I02, G-LAUNCH-refine-pass |
| `T-LAUNCH-pm-communication-plan-100` | PM | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-pm-communication-plan-090 |
| `T-LAUNCH-pm-members-100` | PO | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-pm-members-090 |
| `T-LAUNCH-pm-organization-100` | PO | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-pm-organization-090 |
| `T-LAUNCH-pm-plan-100` | PM | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-pm-plan-090 |
| `T-LAUNCH-pm-quality-management-plan-100` | PM | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-pm-quality-management-plan-090 |
| `T-LAUNCH-pm-raci-100` | PM | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-pm-raci-090 |
| `T-LAUNCH-pm-roles-100` | PO | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-pm-roles-090 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-100` | ARC | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-090 |
| `T-LAUNCH-prj-charter-100` | PO | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-prj-charter-090 |
| `T-LAUNCH-prj-comparison-of-alternatives-100` | ARC | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-prj-comparison-of-alternatives-090 |
| `T-LAUNCH-prj-issues-and-approach-100` | BA | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-prj-issues-and-approach-090 |
| `T-LAUNCH-prj-overview-100` | BA | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-prj-overview-090 |
| `T-LAUNCH-prj-scope-100` | BA | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-prj-scope-090 |
| `T-LAUNCH-prj-stakeholder-register-100` | BA | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-prj-stakeholder-register-090 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-100` | BA | task | 0.25 | 10 | 10.25 | 10 | 10.25 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-090 |
| `T-LAUNCH-pm-communication-plan-110` | PM | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-pm-communication-plan-100 |
| `T-LAUNCH-pm-members-110` | PO | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-pm-members-100 |
| `T-LAUNCH-pm-organization-110` | PO | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-pm-organization-100 |
| `T-LAUNCH-pm-plan-110` | PM | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-pm-plan-100 |
| `T-LAUNCH-pm-quality-management-plan-110` | PM | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-pm-quality-management-plan-100 |
| `T-LAUNCH-pm-raci-110` | PM | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-pm-raci-100 |
| `T-LAUNCH-pm-roles-110` | PO | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-pm-roles-100 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-110` | ARC | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-100 |
| `T-LAUNCH-prj-charter-110` | PO | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-prj-charter-100 |
| `T-LAUNCH-prj-comparison-of-alternatives-110` | ARC | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-prj-comparison-of-alternatives-100 |
| `T-LAUNCH-prj-issues-and-approach-110` | BA | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-prj-issues-and-approach-100 |
| `T-LAUNCH-prj-overview-110` | BA | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-prj-overview-100 |
| `T-LAUNCH-prj-scope-110` | BA | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-prj-scope-100 |
| `T-LAUNCH-prj-stakeholder-register-110` | BA | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-prj-stakeholder-register-100 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-110` | BA | task | 0.25 | 10.25 | 10.5 | 10.25 | 10.5 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-100 |
| `T-LAUNCH-pm-communication-plan-120` | PM | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-pm-communication-plan-110 |
| `T-LAUNCH-pm-members-120` | PO | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-pm-members-110 |
| `T-LAUNCH-pm-organization-120` | PO | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-pm-organization-110 |
| `T-LAUNCH-pm-plan-120` | PM | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-pm-plan-110 |
| `T-LAUNCH-pm-quality-management-plan-120` | PM | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-pm-quality-management-plan-110 |
| `T-LAUNCH-pm-raci-120` | PM | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-pm-raci-110 |
| `T-LAUNCH-pm-roles-120` | PO | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-pm-roles-110 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-120` | ARC | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-110 |
| `T-LAUNCH-prj-charter-120` | PO | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-prj-charter-110 |
| `T-LAUNCH-prj-comparison-of-alternatives-120` | ARC | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-prj-comparison-of-alternatives-110 |
| `T-LAUNCH-prj-issues-and-approach-120` | BA | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-prj-issues-and-approach-110 |
| `T-LAUNCH-prj-overview-120` | BA | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-prj-overview-110 |
| `T-LAUNCH-prj-scope-120` | BA | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-prj-scope-110 |
| `T-LAUNCH-prj-stakeholder-register-120` | BA | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-prj-stakeholder-register-110 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-120` | BA | task | 0.25 | 10.5 | 10.75 | 10.5 | 10.75 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-110 |
| `T-LAUNCH-pm-communication-plan-130` | PM | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-pm-communication-plan-120 |
| `T-LAUNCH-pm-members-130` | PO | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-pm-members-120 |
| `T-LAUNCH-pm-organization-130` | PO | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-pm-organization-120 |
| `T-LAUNCH-pm-plan-130` | PM | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-pm-plan-120 |
| `T-LAUNCH-pm-quality-management-plan-130` | PM | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-pm-quality-management-plan-120 |
| `T-LAUNCH-pm-raci-130` | PM | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-pm-raci-120 |
| `T-LAUNCH-pm-roles-130` | PO | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-pm-roles-120 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-130` | ARC | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-120 |
| `T-LAUNCH-prj-charter-130` | PO | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-prj-charter-120 |
| `T-LAUNCH-prj-comparison-of-alternatives-130` | ARC | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-prj-comparison-of-alternatives-120 |
| `T-LAUNCH-prj-issues-and-approach-130` | BA | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-prj-issues-and-approach-120 |
| `T-LAUNCH-prj-overview-130` | BA | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-prj-overview-120 |
| `T-LAUNCH-prj-scope-130` | BA | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-prj-scope-120 |
| `T-LAUNCH-prj-stakeholder-register-130` | BA | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-prj-stakeholder-register-120 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-130` | BA | task | 0.25 | 10.75 | 11 | 10.75 | 11 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-120 |
| `T-LAUNCH-pm-communication-plan-140` | PM | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-pm-communication-plan-130 |
| `T-LAUNCH-pm-members-140` | PO | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-pm-members-130 |
| `T-LAUNCH-pm-organization-140` | PO | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-pm-organization-130 |
| `T-LAUNCH-pm-plan-140` | PM | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-pm-plan-130 |
| `T-LAUNCH-pm-quality-management-plan-140` | PM | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-pm-quality-management-plan-130 |
| `T-LAUNCH-pm-raci-140` | PM | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-pm-raci-130 |
| `T-LAUNCH-pm-roles-140` | PO | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-pm-roles-130 |
| `T-LAUNCH-prj-assumptions-constraints-dependencies-140` | ARC | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-prj-assumptions-constraints-dependencies-130 |
| `T-LAUNCH-prj-charter-140` | PO | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-prj-charter-130 |
| `T-LAUNCH-prj-comparison-of-alternatives-140` | ARC | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-prj-comparison-of-alternatives-130 |
| `T-LAUNCH-prj-issues-and-approach-140` | BA | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-prj-issues-and-approach-130 |
| `T-LAUNCH-prj-overview-140` | BA | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-prj-overview-130 |
| `T-LAUNCH-prj-scope-140` | BA | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-prj-scope-130 |
| `T-LAUNCH-prj-stakeholder-register-140` | BA | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-prj-stakeholder-register-130 |
| `T-LAUNCH-prj-success-criteria-and-acceptance-criteria-140` | BA | task | 0.125 | 11 | 11.125 | 11 | 11.125 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-130 |
| `M-LAUNCH-project-definition` | PM | milestone | 0 | 11.125 | 11.125 | 11.125 | 11.125 | 0 | T-LAUNCH-prj-success-criteria-and-acceptance-criteria-140, T-LAUNCH-prj-charter-140, T-LAUNCH-prj-comparison-of-alternatives-140 |
| `M-LAUNCH-project-management` | PM | milestone | 0 | 11.125 | 11.125 | 11.125 | 11.125 | 0 | T-LAUNCH-pm-communication-plan-140, T-LAUNCH-pm-quality-management-plan-140, T-LAUNCH-pm-members-140, T-LAUNCH-pm-raci-140, T-LAUNCH-sch-defaults-000, T-LAUNCH-sch-strategy-launch-000 |
