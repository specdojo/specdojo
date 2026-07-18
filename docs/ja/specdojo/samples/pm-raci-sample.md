---
specdojo:
  id: pm-raci-sample
  type: project
  status: ready
  rulebook: pm-raci-rulebook
  based_on:
    - pm-organization-sample
    - pm-roles-sample
    - pm-members-sample
---

# RACI: 駄菓子屋きぬや 販売管理システム

本書は、駄菓子屋きぬや販売管理システム構築プロジェクトにおける主要成果物と主要プロセスの責任分担を、PM が計画化、進捗確認、課題・リスク管理に使える粒度で定義する。

## 1. 目的

本 RACI は、販売、在庫、つけ管理の初期リリースに向けて、成果物作成、レビュー、承認、変更判断の責務境界を明確にするために使用する。

採用する Role code の語彙は [[pm-organization-sample|組織定義]] を正とする。RACI は実行主体や兼務割り当てを複製せず、成果物・プロセス単位の責任分担だけを扱う。

## 2. 適用方針

- RACI 列には、[[pm-organization-sample|組織定義]] で採用済みの Role code のみを使用する。
- 小規模運用で同じ人が複数責務を兼務する場合でも、`PO` と `PM` の責務境界は分けて記載する。
- `A` は 1 成果物・1 プロセスにつき 1 Role code に限定する。
- Agent は `R`、`C` の支援を行ってよいが、`A` は担わない。
- 実際の member、agent、兼務割り当ては [[pm-members-sample|メンバー定義]] を正本とする。

## 3. RACI の定義

| 記号 | 意味        | 説明                                         |
| ---- | ----------- | -------------------------------------------- |
| R    | Responsible | 実作業を担当する                             |
| A    | Accountable | 最終責任を持ち、承認または判断する           |
| C    | Consulted   | 作成前または判断前に相談・レビューへ参加する |
| I    | Informed    | 結果、変更、決定の共有を受ける               |

## 4. 成果物別 RACI

| 成果物                       | PO  | PM  | BA  | ARC | DEV | QE  | UX  | OPS |
| ---------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| `prj-overview`               | A   | C   | R   | C   | I   | C   | C   | I   |
| `prj-scope`                  | A   | C   | R   | C   | I   | C   | C   | I   |
| `pm-organization`            | A   | R   | C   | C   | I   | C   | I   | I   |
| `pm-raci`                    | C   | A/R | C   | C   | I   | C   | I   | I   |
| `pm-plan`                    | C   | A/R | C   | C   | I   | C   | I   | C   |
| `pm-risk-register`           | C   | A/R | C   | C   | C   | C   | C   | C   |
| `pm-quality-management-plan` | A   | C   | C   | C   | I   | R   | C   | I   |
| Schedule                     | C   | A/R | C   | C   | C   | C   | C   | C   |
| `dct-index` / 成果物カタログ | C   | C   | C   | A/R | I   | C   | I   | I   |

## 5. プロセス別 RACI

| プロセス                     | PO  | PM  | BA  | ARC | DEV | QE  | UX  | OPS |
| ---------------------------- | --- | --- | --- | --- | --- | --- | --- | --- |
| 初期リリース範囲の判断       | A   | R   | C   | C   | I   | C   | C   | I   |
| 成果物作成の計画化・順序付け | C   | A/R | C   | C   | C   | C   | C   | C   |
| 成果物草案作成               | C   | A   | R   | R   | R   | C   | R   | C   |
| 進捗確認・報告               | I   | A/R | C   | C   | C   | C   | C   | C   |
| 課題・リスクの識別と登録     | C   | A/R | C   | C   | C   | C   | C   | C   |
| 成果物レビュー               | C   | C   | C   | C   | C   | A/R | C   | I   |
| 変更要求の起票・影響整理     | C   | A/R | C   | C   | C   | C   | C   | C   |
| 変更要求の採否判断           | A   | R   | C   | C   | I   | C   | C   | C   |
| 公開可否判断                 | A   | C   | C   | C   | I   | C   | C   | R   |

## 6. 見直し条件

| 更新トリガー                                                       | 見直し内容                                                  |
| ------------------------------------------------------------------ | ----------------------------------------------------------- |
| [[pm-organization-sample\|組織定義]] の採用 Role code が変更された | RACI 列、全行の `A`、Schedule の `owner` との整合を確認する |
| [[pm-members-sample\|メンバー定義]] の兼務割り当てが変更された     | 実行主体の変更が RACI の責務境界を変えないか確認する        |
| 成果物カタログまたは WBS が大幅変更された                          | 成果物別 RACI の行を追加、削除、統合する                    |
| 進捗遅延、課題滞留、リスク顕在化が継続した                         | `PM` の `R` と `A`、エスカレーション先、報告対象を見直す    |
| 公開判断または変更要求の頻度が増えた                               | `PO`、`PM`、`OPS`、`QE` の判断・実行・確認責任を見直す      |

## 7. 禁止事項

- [[pm-organization-sample|組織定義]] で採用していない Role code を RACI 列に使わない。
- member nickname、人名、agent 名を RACI 列に使わない。
- Agent に `A` を割り当てない。
- 各行の `A` を省略しない。
- 1 行に複数の `A` を置かない。
- Schedule の `owner`、課題・リスク・変更要求の管理単位と矛盾する責任分担を記載しない。
