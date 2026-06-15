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

<!-- prettier-ignore -->
| local-id | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- |
| `prj-overview` | プロジェクト概要 | work | - | プロジェクトの目的・背景・ゴールを定義 |
| `prj-scope` | プロジェクトスコープ | work | `prj-overview` | プロジェクトの対象範囲と除外範囲を定義 |
| `prj-success-criteria-and-acceptance-criteria` | 成功基準と受入条件 | work | `prj-scope` | プロジェクト成功の判定基準と受入条件を明確化 |
| `prj-stakeholder-register` | ステークホルダー登録簿 | work | `prj-overview` | 関係者の役割・関心・影響度を一覧化 |
| `prj-charter` | プロジェクト憲章 | work | `prj-overview`, `prj-stakeholder-register` | プロジェクトの正式な認可と権限委譲を文書化 |
| `prj-assumptions-constraints-dependencies` | 前提・制約・依存関係 | work | `prj-scope` | 前提条件・制約事項・外部依存を整理 |
| `prj-issues-and-approach` | プロジェクト課題と解決アプローチ | work | `prj-scope`, `prj-assumptions-constraints-dependencies` | 主要課題の特定と解決アプローチを定義 |
| `prj-comparison-of-alternatives` | 代替案比較 | work | `prj-scope`, `prj-issues-and-approach` | 技術的・方針的な代替案を比較評価 |

**`prj-overview`** の完了条件:

- プロジェクトの目的・背景・ゴールが業務観点で確認できる粒度で記述されていること
- プロジェクトの目的・スコープを承認できる情報が含まれていること
- プロジェクトの目的・スコープを計画立案の基礎として確認できること

**`prj-scope`** の完了条件:

- 業務スコープ・除外範囲・利用者影響が業務観点で確認できること
- 対象範囲・対象外を承認できること
- 技術的スコープ境界（外部連携の有無など）が識別できること
- スコープ境界をスケジュール計画の前提として確認できること

**`prj-success-criteria-and-acceptance-criteria`** の完了条件:

- 業務価値と受入条件が対応していること
- 成功基準を承認できること
- 技術的受入条件が確認できること
- 受入条件が検証可能な形で記述されていること

**`prj-stakeholder-register`** の完了条件:

- 関係者の役割・関心・影響度が業務観点で確認できる形で一覧化されていること
- 合意対象と意思決定者が識別できること
- 関与方針・合意事項がコミュニケーション統制の入力として確認できること

**`prj-charter`** の完了条件:

- 業務上の目的・認可条件・期待効果が明確であること
- 正式認可・権限委譲・予算枠を承認できる情報が含まれていること
- 委譲された権限範囲が詳細計画策定の前提として確認できること

**`prj-assumptions-constraints-dependencies`** の完了条件:

- 業務上の前提・制約が業務観点で識別できること
- 重要な前提・制約を受け入れられる情報が含まれていること
- 技術的制約・外部依存が識別できること
- 依存関係・リスクが計画・統制の観点で識別できること

**`prj-issues-and-approach`** の完了条件:

- 業務課題と解決アプローチが業務観点で対応していること
- 主要課題と解決方針を承認できること
- 技術的課題と実現方式の方向性が識別できること
- 課題が後続作業・リスクに与える影響が識別できること

**`prj-comparison-of-alternatives`** の完了条件:

- 比較軸・評価根拠が業務価値と対応していること
- 推奨案を判断できる情報が含まれていること
- 技術的実現可能性・影響が評価されていること
- 案ごとのリスク・トレードオフが比較されていること
