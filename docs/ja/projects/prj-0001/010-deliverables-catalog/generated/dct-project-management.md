---
id: prj-0001:dct-project-management
type: project
status: draft
part_of:
  - 'prj-0001:dct-index'
rulebook: dct-rulebook
---

# 成果物カタログ: project-management

- project-id: `prj-0001`
- ドメイン: `project-management`
- DOMAIN: `PJM`

## 1. 管理計画

- 配置先: `docs/ja/projects/prj-0001/030-project-management/010-management-plan`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pm-plan` | `PLAN` | プロジェクト管理計画 | work | - | プロジェクト全体の管理方針・プロセスを定義 |
| `pm-communication-plan` | `COMM` | コミュニケーション計画 | work | `pm-plan` | 報告・連絡・会議体の計画を定義 |
| `pm-quality-management-plan` | `QLTY` | 品質管理計画 | work | `pm-plan` | 品質目標・レビュー方針・品質基準を定義 |

## 2. 組織体制

- 配置先: `docs/ja/projects/prj-0001/030-project-management/020-organization`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pm-organization` | `ORG` | 組織定義 | work | `prj-overview` | ロール・責務境界・兼務方針・意思決定責任を定義 |
| `pm-roles` | `ROLE` | ロール定義 | work | `pm-organization` | 採用 Role code を machine-readable な YAML として一覧化する |
| `pm-members` | `MBR` | メンバー定義 | work | `pm-organization`, `pm-roles` | yaml で実行主体（人間・agent）とロール対応を定義 |
| `pm-raci` | `RACI` | RACI | work | `pm-organization` | 成果物・プロセスごとの責任分担マトリクスを定義（中規模以上） |

## 3. 管理台帳

- 配置先: `docs/ja/projects/prj-0001/030-project-management/controls/project-register`

WBS への落とし込み対象外。

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pjr-index` | `CTLIND` | プロジェクト登録簿 | control | - | 識別済み検討項目と対応策を管理（台帳） |
| `pjr-<NNNN>-<term>` | `CTLITM` | プロジェクト登録項目 | control | `pjr-index` | 識別済み検討項目と対応策を管理（個別課題） |

## 4. 管理台帳補助ビュー

- 配置先: `docs/ja/projects/prj-0001/030-project-management/controls/project-register/generated`

WBS への落とし込み対象外。

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pjr-open-items` | `CTLOI` | 未完了項目一覧 | generated | `pjr-index`, `pjr-item` | プロジェクト登録簿の未完了項目を一覧化 |
| `pjr-by-owner` | `CTLOB` | 担当者別一覧 | generated | `pjr-index`, `pjr-item` | プロジェクト登録簿の担当者別項目を一覧化 |
| `pjr-by-priority` | `CTLPR` | 優先度別一覧 | generated | `pjr-index`, `pjr-item` | プロジェクト登録簿の優先度別項目を一覧化 |
| `pjr-by-status` | `CTLST` | 状態別一覧 | generated | `pjr-index`, `pjr-item` | プロジェクト登録簿の状態別項目を一覧化 |

## 5. 管理ビュー

- 配置先: `docs/ja/projects/prj-0001/030-project-management/controls/generated`

WBS への落とし込み対象外。

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pm-risk-register` | `CTLRSK` | リスク登録簿 | generated | `pjr-item` | 識別済みリスクと対応策を管理 |
| `pm-issue-log` | `CTLISS` | 課題ログ | generated | `pjr-item` | 発生した課題と対応状況を管理 |
| `pm-change-request-log` | `CTLCRQ` | 変更要求ログ | generated | `pjr-item` | 変更要求の申請・審査・決定を管理 |
| `pm-decision-log` | `CTLDEC` | 決定記録 | generated | `pjr-item` | プロジェクト上の意思決定とその根拠を記録 |

## 6. WBS

- 配置先: `docs/ja/projects/prj-0001/030-project-management/wbs`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `wbs-project-management` | `WBSPJM` | WBS 定義（プロジェクト管理） | work | - | プロジェクトマネジメント成果物作成の作業分解構造を YAML で定義 |
| `wbs-project-definition` | `WBSPJD` | WBS 定義（プロジェクト定義） | work | - | プロジェクト定義成果物作成の作業分解構造を YAML で定義 |

## 7. スケジュール

- 配置先: `docs/ja/projects/prj-0001/030-project-management/schedule`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `sch-milestones` | `SCHMS` | マイルストーン定義 | work | - | プロジェクト全体のマイルストーンを定義 |
| `sch-defaults` | `SCHDEF` | スケジュールデフォルト定義 | work | `wbs-project-management`, `wbs-project-definition` | スケジュールのデフォルト設定を定義 |
| `sch-track-launch` | `SCHTLNCH` | Launch スケジュール定義 | work | `wbs-project-management`, `wbs-project-definition` | Launch フェーズの詳細スケジュールを定義 |
| `sch-config-launch` | `SCHCFG` | Launch スケジュール設定 | work | `wbs-project-management`, `wbs-project-definition` | Launch フェーズの詳細スケジュールの設定を定義 |
| `sch-agent-overrides-launch` | `SCHAOV` | Launch スケジュールエージェント上書き設定 | work | `wbs-project-management`, `wbs-project-definition` | Launch フェーズの詳細スケジュールのエージェント上書き設定を定義 |

## 8. レポート

WBS への落とし込み対象外。

### 8.1. 進捗報告

- 配置先: `docs/ja/projects/prj-0001/030-project-management/reporting/progress-reports`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pr-<yyyy-mm-dd>` | `PR` | 進捗報告 | control | - | 定期的な進捗状況の報告 |

### 8.2. 議事録

- 配置先: `docs/ja/projects/prj-0001/030-project-management/reporting/meeting-minutes`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `mm-<yyyy-mm-dd>` | `MM` | 議事録 | control | - | 会議の決定事項・アクションを記録 |
