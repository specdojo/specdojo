---
id: prj-0001-prj-deliverables-catalog-001-project-definition
type: project
status: draft
rulebook: prj-deliverables-catalog-rulebook
---

# 成果物カタログ: SpecDojo Handbook プロジェクト定義

Project Deliverables Catalog: Project Definition for SpecDojo Handbook

本ドキュメントは、プロジェクト定義に関する成果物の一覧とその説明をまとめたカタログです。各成果物の目的・内容・配置先・派生関係を定義します。

## 1. 共通

- `<name>.md` もしくは、`<name>.yaml` 形式で作成し、配置先に保存します。
- Frontmatter の `id` は `prj-0001-<name>` とし、`based_on` には直接根拠として参照した文書のみを記載します。

## 2. プロジェクト管理

プロジェクト定義に関する運営・管理の成果物です。プロジェクト定義フェーズに絞った管理計画、WBS、スケジュールなどを定義します。

### 2.1. 管理計画

- 配置先: `docs/ja/projects/prj-0001/030-project-management/010-management-plan`

- ドメイン: `project-definition-management`

| name                            | 成果物名                       | 概要                                                                 |
| ------------------------------- | ------------------------------ | -------------------------------------------------------------------- |
| `pm-plan`                       | プロジェクト管理計画           | プロジェクト全体の管理方針・プロセスを定義                           |
| `pm-communication-plan`         | コミュニケーション計画         | 報告・連絡・会議体の計画を定義                                       |
| `pm-quality-management-plan`    | 品質管理計画                   | 品質目標・レビュー方針・品質基準を定義                               |
| `pm-organization-and-raci`      | 組織体制と RACI                | 体制図と責任分担マトリクスを定義                                     |
| `pm-wbs-decomposition-strategy` | WBS 分解戦略                   | 成果物カタログから WBS への分解粒度・命名・分割方針を定義            |
| `pm-wbs-to-schedule-strategy`   | WBS から Schedule への展開戦略 | WBS を実行可能タスクへ展開する際の依存関係・タスク長・命名規則を定義 |

### 2.2. WBS

WBS 定義ファイル（YAML 形式）です。スコープ分割単位ごとにファイルを作成します。

- 配置先: `docs/ja/projects/prj-0001/030-project-management/030-wbs`

| name                     | 成果物名 | 概要                                     |
| ------------------------ | -------- | ---------------------------------------- |
| `wbs-project-definition` | WBS 定義 | スコープ単位の作業分解構造を YAML で定義 |

### 2.3. スケジュール

- 配置先: `docs/ja/projects/prj-0001/030-project-management/040-schedule`

スケジュール定義ファイル（YAML 形式）です。マイルストーンおよびスコープ単位で作成します。

| name                     | 成果物名           | 概要                                   |
| ------------------------ | ------------------ | -------------------------------------- |
| `sch-milestones`         | マイルストーン定義 | プロジェクト全体のマイルストーンを定義 |
| `sch-project-definition` | スケジュール定義   | スコープ単位の詳細スケジュールを定義   |

## 3. プロジェクト定義

プロジェクト定義に関する成果物です。

- ドメイン: `project-definition`

- 配置先: `docs/ja/projects/prj-0001/010-project-definition`

| name                                           | 成果物名                         | 概要                                             |
| ---------------------------------------------- | -------------------------------- | ------------------------------------------------ |
| `prj-scope`                                    | プロジェクトスコープ             | プロジェクトの対象範囲と除外範囲を定義           |
| `prj-success-criteria-and-acceptance-criteria` | 成功基準と受入条件               | プロジェクト成功の判定基準と受入条件を明確化     |
| `prj-deliverables-catalog`                     | 成果物カタログ                   | プロジェクト成果物の一覧と説明（本ドキュメント） |
| `prj-issues-and-approach`                      | プロジェクト課題と解決アプローチ | 主要課題の特定と解決アプローチを定義             |
| `prj-assumptions-constraints-dependencies`     | 前提・制約・依存関係             | 前提条件・制約事項・外部依存を整理               |
| `prj-comparison-of-alternatives`               | 代替案比較                       | 技術的・方針的な代替案を比較評価                 |
