---
id: prj-0001:dct-project-definition
type: project
status: draft
part_of: [prj-0001:dct-index]
rulebook: dct-rulebook
---

# 成果物カタログ: SpecDojo Handbook プロジェクト定義

Project Deliverables Catalog: Project Definition for SpecDojo Handbook

本ドキュメントは、プロジェクト定義に関する成果物の一覧とその説明をまとめたカタログです。各成果物の目的・内容・配置先・派生関係を定義します。

- project-id: `prj-0001`
- ドメイン: `project-definition`
- DOMAIN: `PJD`
- 配置先: `docs/ja/projects/prj-0001/020-project-definition`

| local-id                                       | ARTIFACT      | 成果物名                         | 種別 | 根拠                                                    | 概要                                         |
| ---------------------------------------------- | ------------- | -------------------------------- | ---- | ------------------------------------------------------- | -------------------------------------------- |
| `prj-overview`                                 | `OVERVIEW`    | プロジェクト概要                 | work | -                                                       | プロジェクトの目的・背景・ゴールを定義       |
| `prj-stakeholder-register`                     | `STAKEHOLDER` | ステークホルダー登録簿           | work | `prj-overview`                                          | 関係者の役割・関心・影響度を一覧化           |
| `prj-charter`                                  | `CHARTER`     | プロジェクト憲章                 | work | `prj-overview`, `prj-stakeholder-register`              | プロジェクトの正式な認可と権限委譲を文書化   |
| `prj-scope`                                    | `SCOPE`       | プロジェクトスコープ             | work | `prj-overview`                                          | プロジェクトの対象範囲と除外範囲を定義       |
| `prj-success-criteria-and-acceptance-criteria` | `SUCCESS`     | 成功基準と受入条件               | work | `prj-scope`                                             | プロジェクト成功の判定基準と受入条件を明確化 |
| `prj-assumptions-constraints-dependencies`     | `ACD`         | 前提・制約・依存関係             | work | `prj-scope`                                             | 前提条件・制約事項・外部依存を整理           |
| `prj-issues-and-approach`                      | `ISSUES`      | プロジェクト課題と解決アプローチ | work | `prj-scope`, `prj-assumptions-constraints-dependencies` | 主要課題の特定と解決アプローチを定義         |
| `prj-comparison-of-alternatives`               | `ALT`         | 代替案比較                       | work | `prj-scope`, `prj-issues-and-approach`                  | 技術的・方針的な代替案を比較評価             |
