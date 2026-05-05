---
id: prj-0001:pm-raci
type: project
status: draft
rulebook: pm-raci-rulebook
based_on:
  - people-and-organization-definition-standard
  - prj-0001:pm-organization
---

# RACI

## 1. 目的

本書は、SpecDojo プロジェクトにおける主要成果物と主要プロセスの責任分担を、必要最小限の RACI として定義する。

本プロジェクトは個人・小規模運用を前提とするため、RACI は詳細な組織統制ではなく、作成、レビュー、承認、変更判断の責務境界を確認するために使用する。
採用ロールと未採用ロールは [pm-organization.md](pm-organization.md) を正とする。

## 2. 適用方針

- RACI の列には、`pm-organization.md` で採用した Role code のみを使用する。
- 現時点で使用する Role code は `PO`、`BA`、`ARC`、`QE` に限定する。
- `PM`、`DEV`、`UX`、`OPS` は未採用ロールのため、本書の RACI 列には含めない。
- 小規模運用では `PO` が `PM` 的な計画、進捗、課題、リスク管理を兼務する。
- `A` は原則として `PO` に集約する。品質観点の実作業は `QE` が担うが、最終判断は `PO` が行う。
- Agent は `R`、`C` の支援を行ってよいが、`A` は担わない。

## 3. RACI の定義

| 記号 | 意味        | 説明                     |
| ---- | ----------- | ------------------------ |
| R    | Responsible | 実作業を担当する         |
| A    | Accountable | 最終責任を持ち、承認する |
| C    | Consulted   | 相談・レビューに参加する |
| I    | Informed    | 結果の共有を受ける       |

## 4. 成果物別 RACI

| 成果物                       | PO  | BA  | ARC | QE  |
| ---------------------------- | --- | --- | --- | --- |
| `prj-overview`               | A/R | C   | I   | C   |
| `prj-stakeholder-register`   | A   | R   | I   | C   |
| `prj-charter`                | A/R | C   | C   | C   |
| `pm-organization`            | A   | C   | R   | C   |
| `pm-members`                 | A   | I   | R   | C   |
| `pm-raci`                    | A   | C   | C   | R   |
| `dct-index` / 成果物カタログ | A   | C   | R   | C   |
| `pm-plan`                    | A/R | C   | C   | C   |
| WBS / Schedule               | A   | R   | R   | C   |

## 5. プロセス別 RACI

| プロセス                       | PO  | BA  | ARC | QE  |
| ------------------------------ | --- | --- | --- | --- |
| 目的・スコープ・優先順位の判断 | A/R | C   | C   | C   |
| 成果物草案作成                 | A   | R   | R   | C   |
| 文書構成・命名・配置の判断     | A   | C   | R   | C   |
| 成果物レビュー                 | A   | C   | C   | R   |
| 品質基準確認                   | A   | C   | C   | R   |
| 変更要求判断                   | A/R | C   | C   | C   |
| 公開可否判断                   | A/R | C   | C   | C   |

## 6. 見直し条件

| 更新トリガー                                          | 見直し内容                                          |
| ----------------------------------------------------- | --------------------------------------------------- |
| `pm-organization.md` で採用ロールを変更した           | RACI 列と各成果物の責任分担を更新する               |
| `PM` を独立ロールとして採用した                       | `PO` に集約している管理責務を `PM` へ移すか確認する |
| `DEV`、`UX`、`OPS` を採用した                         | 成果物別 RACI に該当ロールの責任分担を追加する      |
| 成果物カタログまたは WBS の対象成果物を大きく変更した | 成果物別 RACI の行を追加、削除、統合する            |
| 外部参加者または複数人での継続運用を開始した          | `A`、`R`、`C` の分離が十分か確認する                |

## 7. 禁止事項

- `pm-organization.md` で未採用の Role code を RACI 列に使わない。
- member nickname、人名、agent 名を RACI 列に使わない。
- Agent に `A` を割り当てない。
- 兼務を理由に、最終判断者である `A` を曖昧にしない。
- WBS / Schedule の `owner` と矛盾する責任分担を記載しない。
