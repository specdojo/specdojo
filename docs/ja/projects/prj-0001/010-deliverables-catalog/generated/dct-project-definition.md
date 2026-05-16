---
id: prj-0001:dct-project-definition
type: project
status: draft
part_of:
  - 'prj-0001:dct-index'
rulebook: dct-rulebook
---

# 成果物カタログ: project-definition

- project-id: `prj-0001`
- ドメイン: `project-definition`
- DOMAIN: `PJD`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `prj-overview` | `OVERVIEW` | プロジェクト概要 | work | - | プロジェクトの目的・背景・ゴールを定義 |
| `prj-stakeholder-register` | `STAKEHOLDER` | ステークホルダー登録簿 | work | `prj-overview` | 関係者の役割・関心・影響度を一覧化 |
| `prj-charter` | `CHARTER` | プロジェクト憲章 | work | `prj-overview`, `prj-stakeholder-register` | プロジェクトの正式な認可と権限委譲を文書化 |
| `prj-scope` | `SCOPE` | プロジェクトスコープ | work | `prj-overview` | プロジェクトの対象範囲と除外範囲を定義 |
| `prj-success-criteria-and-acceptance-criteria` | `SUCCESS` | 成功基準と受入条件 | work | `prj-scope` | プロジェクト成功の判定基準と受入条件を明確化 |
| `prj-assumptions-constraints-dependencies` | `ACD` | 前提・制約・依存関係 | work | `prj-scope` | 前提条件・制約事項・外部依存を整理 |
| `prj-issues-and-approach` | `ISSUES` | プロジェクト課題と解決アプローチ | work | `prj-scope`, `prj-assumptions-constraints-dependencies` | 主要課題の特定と解決アプローチを定義 |
| `prj-comparison-of-alternatives` | `ALT` | 代替案比較 | work | `prj-scope`, `prj-issues-and-approach` | 技術的・方針的な代替案を比較評価 |

**`prj-overview`** の完了条件:

- PO/BA がプロジェクトの目的・背景・ゴールを業務観点で確認できる粒度で記述されていること
- ARC が技術的前提・制約を読み取れる情報が含まれていること
- QE が成功判定の輪郭を確認できること

**`prj-stakeholder-register`** の完了条件:

- PO/BA が業務観点で関係者の役割・関心・影響度を確認できる形で一覧化されていること
- ARC が技術的意思決定者・承認者を識別できること
- QE が品質に影響するステークホルダーを確認できること

**`prj-charter`** の完了条件:

- PO/BA がプロジェクトの正式認可・権限委譲・予算枠を業務観点で確認できること
- ARC が技術的制約・前提を読み取れること
- QE が品質目標・受入基準への参照を確認できること

**`prj-scope`** の完了条件:

- PO/BA が対象範囲と除外範囲を業務観点で確認できること
- ARC が技術的スコープ境界を識別できること
- QE がテスト対象・対象外の境界を判断できること

**`prj-success-criteria-and-acceptance-criteria`** の完了条件:

- PO/BA がプロジェクト成功の判定基準を業務観点で確認できること
- ARC が技術的受入条件を確認できること
- QE が検証可能な形で受入条件が記述されていること

**`prj-assumptions-constraints-dependencies`** の完了条件:

- PO/BA が業務上の前提・制約を業務観点で識別できること
- ARC が技術的制約・外部依存を識別できること
- QE がテスト実施上の前提・制約を確認できること

**`prj-issues-and-approach`** の完了条件:

- PO/BA が主要課題と解決アプローチを業務観点で確認できること
- ARC が技術的課題と実現方式の方向性を識別できること
- QE が解決アプローチの検証可能性を確認できること

**`prj-comparison-of-alternatives`** の完了条件:

- PO/BA が代替案の比較軸・評価根拠・推奨案を業務観点で確認できること
- ARC が技術的実現可能性・影響の評価を確認できること
- QE が選択された案に対する検証方針を確認できること
