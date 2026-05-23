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
| `prj-scope` | `SCOPE` | プロジェクトスコープ | work | `prj-overview` | プロジェクトの対象範囲と除外範囲を定義 |
| `prj-success-criteria-and-acceptance-criteria` | `SUCCESS` | 成功基準と受入条件 | work | `prj-scope` | プロジェクト成功の判定基準と受入条件を明確化 |
| `prj-stakeholder-register` | `STAKEHOLDER` | ステークホルダー登録簿 | work | `prj-overview` | 関係者の役割・関心・影響度を一覧化 |
| `prj-charter` | `CHARTER` | プロジェクト憲章 | work | `prj-overview`, `prj-stakeholder-register` | プロジェクトの正式な認可と権限委譲を文書化 |
| `prj-assumptions-constraints-dependencies` | `ACD` | 前提・制約・依存関係 | work | `prj-scope` | 前提条件・制約事項・外部依存を整理 |
| `prj-issues-and-approach` | `ISSUES` | プロジェクト課題と解決アプローチ | work | `prj-scope`, `prj-assumptions-constraints-dependencies` | 主要課題の特定と解決アプローチを定義 |
| `prj-comparison-of-alternatives` | `ALT` | 代替案比較 | work | `prj-scope`, `prj-issues-and-approach` | 技術的・方針的な代替案を比較評価 |

**`prj-overview`** の完了条件:

- プロジェクトの目的・背景・ゴールが業務観点で確認できる粒度で記述されていること
- プロジェクトの目的・スコープを承認できる情報が含まれていること
- 技術的前提・制約を読み取れる情報が含まれていること
- 成功判定の輪郭が確認できること
- プロジェクトの目的・スコープを計画立案の基礎として確認できること

**`prj-scope`** の完了条件:

- 業務スコープ・除外範囲・利用者影響が業務観点で確認できること
- 対象範囲・対象外を承認できること
- 技術的スコープ境界が識別できること
- テスト対象・対象外の境界が判断できること
- スコープ境界をスケジュール計画の前提として確認できること

**`prj-success-criteria-and-acceptance-criteria`** の完了条件:

- 業務価値と受入条件が対応していること
- 成功基準を承認できること
- 技術的受入条件が確認できること
- 受入条件が検証可能な形で記述されていること

**`prj-stakeholder-register`** の完了条件:

- 関係者の役割・関心・影響度が業務観点で確認できる形で一覧化されていること
- 合意対象と意思決定者が識別できること
- 技術的意思決定者・承認者が識別できること
- 品質に影響するステークホルダーが確認できること

**`prj-charter`** の完了条件:

- 業務上の目的・認可条件・期待効果が明確であること
- 正式認可・権限委譲・予算枠を承認できる情報が含まれていること
- 技術的制約・前提が読み取れること
- 品質目標・受入基準への参照が確認できること

**`prj-assumptions-constraints-dependencies`** の完了条件:

- 業務上の前提・制約が業務観点で識別できること
- 重要な前提・制約を受け入れられる情報が含まれていること
- 技術的制約・外部依存が識別できること
- テスト実施上の前提・制約が確認できること
- 実装上の技術制約・外部依存が確認できること

**`prj-issues-and-approach`** の完了条件:

- 業務課題と解決アプローチが業務観点で対応していること
- 主要課題と解決方針を承認できること
- 技術的課題と実現方式の方向性が識別できること
- 解決アプローチが検証可能な形で記述されていること

**`prj-comparison-of-alternatives`** の完了条件:

- 比較軸・評価根拠が業務価値と対応していること
- 推奨案を判断できる情報が含まれていること
- 技術的実現可能性・影響が評価されていること
- 選択された案に対する検証方針が確認できること
