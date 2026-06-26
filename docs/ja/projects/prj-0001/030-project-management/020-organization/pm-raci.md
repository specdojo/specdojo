---
id: prj-0001:pm-raci
type: project
status: ready
rulebook: pm-raci-rulebook
based_on:
  - people-and-organization-definition-standard
  - prj-0001:pm-organization
---

# RACI

本書は、SpecDojo プロジェクトにおける主要成果物と主要プロセスの責任分担を、PM が計画化、進捗確認、課題・リスク管理に使える粒度で定義する。

## 1. 目的

本 RACI は、成果物と主要プロセスごとに、作成責任、承認責任、相談先、共有先を分離し、Schedule、課題、リスク、変更要求、決定記録へ接続できる責務境界を示す。

採用する Role code の語彙は [[prj-0001:pm-organization|組織定義]] を正とする。RACI は、Role code の一覧や実行主体の割り当てを複製する文書ではなく、採用済み Role code を使って成果物・プロセス単位の責任分担を確認する文書である。

## 2. 適用方針

- RACI の列には、[[prj-0001:pm-organization|組織定義]] で採用した Role code のみを使用する。
- 本書では、Schedule の `owner` や責任分担で使う可能性がある採用済み Role code を列に置く。
- 小規模運用で実行主体が兼務する場合でも、責務境界を確認できるよう `PO` と `PM` の責務を分けて記載する。
- `A` は 1 成果物・1 プロセスにつき 1 Role code に限定する。
- Agent は `R`、`C` の支援を行ってよいが、`A` は担わない。
- 実際の member、agent、兼務割り当ては [[prj-0001:pm-members|メンバー定義]] を正本とし、本書には複製しない。

## 3. RACI の定義

| 記号 | 意味        | 説明                                               |
| ---- | ----------- | -------------------------------------------------- |
| R    | Responsible | 実作業を担当する                                   |
| A    | Accountable | 最終責任を持ち、承認または判断する                 |
| C    | Consulted   | 作成前または判断前に相談・レビューへ参加する       |
| I    | Informed    | 結果、変更、決定の共有を受ける                     |

## 4. 成果物別 RACI

| 成果物                                         | PO  | PM  | BA  | ARC | DEV | QE  | UX  | OPS |
| ---------------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| `prj-overview`                                 | A   | C   | R   | C   | I   | C   | C   | I   |
| `prj-scope`                                    | A   | C   | R   | C   | I   | C   | C   | I   |
| `prj-stakeholder-register`                     | A   | C   | R   | I   | I   | C   | C   | I   |
| `prj-success-criteria-and-acceptance-criteria` | A   | C   | R   | C   | I   | C   | C   | I   |
| `pm-organization`                              | A   | R   | C   | C   | I   | C   | I   | I   |
| `pm-roles.yaml`                                | A   | R   | I   | C   | I   | C   | I   | I   |
| `pm-members.yaml`                              | A   | R   | I   | C   | I   | C   | I   | I   |
| `pm-raci`                                      | C   | A/R | C   | C   | I   | C   | I   | I   |
| `pm-plan`                                      | C   | A/R | C   | C   | I   | C   | I   | C   |
| `pm-communication-plan`                        | C   | A/R | C   | I   | I   | C   | C   | C   |
| `pm-quality-management-plan`                   | C   | C   | C   | C   | I   | A/R | C   | I   |
| `pm-risk-register`                             | C   | A/R | C   | C   | C   | C   | C   | C   |
| `pm-issue-log`                                 | C   | A/R | C   | C   | C   | C   | C   | C   |
| `pm-change-request-log`                        | C   | A/R | C   | C   | C   | C   | C   | C   |
| Schedule                                       | C   | A/R | C   | C   | C   | C   | C   | C   |
| `dct-index` / 成果物カタログ                   | C   | C   | C   | A/R | I   | C   | I   | I   |

## 5. プロセス別 RACI

| プロセス                                 | PO  | PM  | BA  | ARC | DEV | QE  | UX  | OPS |
| ---------------------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 目的・スコープ・優先順位の判断           | A   | R   | C   | C   | I   | C   | C   | I   |
| 成果物作成の計画化・順序付け             | C   | A/R | C   | C   | C   | C   | C   | C   |
| 成果物草案作成                           | C   | A   | R   | R   | R   | C   | R   | C   |
| 文書構成・命名・配置の判断               | C   | C   | C   | A/R | I   | C   | C   | I   |
| 進捗確認・報告                           | I   | A/R | C   | C   | C   | C   | C   | C   |
| 課題・リスクの識別と登録                 | C   | A/R | C   | C   | C   | C   | C   | C   |
| 成果物レビュー                           | C   | C   | C   | C   | C   | A/R | C   | I   |
| 変更要求の起票・影響整理                 | C   | A/R | C   | C   | C   | C   | C   | C   |
| 変更要求の採否判断                       | A   | R   | C   | C   | I   | C   | C   | C   |
| 決定記録・申し送りの更新                 | C   | A/R | C   | C   | I   | C   | I   | I   |
| 公開可否判断                             | A   | C   | C   | C   | I   | C   | C   | R   |

## 6. 見直し条件

| 更新トリガー                                              | 見直し内容                                                     |
| --------------------------------------------------------- | -------------------------------------------------------------- |
| [[prj-0001:pm-organization\|組織定義]] で採用ロールを変更した | RACI 列、全行の `A`、Schedule の `owner` との整合を確認する     |
| 実行主体または兼務割り当てを変更した                      | [[prj-0001:pm-members\|メンバー定義]] と RACI の責務境界を確認する |
| 成果物カタログまたは WBS の対象成果物を大きく変更した      | 成果物別 RACI の行を追加、削除、統合する                       |
| 進捗遅延、課題滞留、リスク顕在化が継続した                | `PM` の `R` と `A`、エスカレーション先、報告対象を見直す        |
| 変更要求または公開判断の頻度が増えた                      | `PO`、`PM`、`OPS`、`QE` の判断・実行・確認責任を見直す          |

## 7. 禁止事項

- [[prj-0001:pm-organization|組織定義]] で採用していない Role code を RACI 列に使わない。
- member nickname、人名、agent 名を RACI 列に使わない。
- Agent に `A` を割り当てない。
- 各行の `A` を省略しない。
- 1 行に複数の `A` を置かない。
- 兼務を理由に、最終判断者である `A` を曖昧にしない。
- Schedule の `owner`、課題・リスク・変更要求の管理単位と矛盾する責任分担を記載しない。
