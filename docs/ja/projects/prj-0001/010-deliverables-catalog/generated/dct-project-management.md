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

**`pm-plan`** の完了条件:

- プロジェクト全体の管理方針・プロセスを承認できる粒度で記述されていること
- 計画・進捗・リスク管理の方針が記述されていること
- 業務プロセスとの整合が確認できること
- 構成管理・技術管理の観点が含まれていること
- レビュー方針・品質基準への参照が確認できること

**`pm-communication-plan`** の完了条件:

- 報告・連絡・会議体の計画を承認できる粒度で記述されていること
- 進捗・課題・リスクの報告経路が定義されていること
- 業務観点のコミュニケーション要件が含まれていること
- 技術チームへの連絡経路が識別されていること
- 品質関連の報告経路が確認できること

**`pm-quality-management-plan`** の完了条件:

- 品質目標・レビュー方針・品質基準を承認できる粒度で記述されていること
- 品質管理プロセスが全体計画と整合していること
- 業務品質基準との整合が確認できること
- コードレビュー・設計レビューなど技術品質基準が含まれていること
- 実施可能な検証・レビュー手順が記述されていること

## 2. 組織体制

- 配置先: `docs/ja/projects/prj-0001/030-project-management/020-organization`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pm-organization` | `ORG` | 組織定義 | work | `prj-overview` | ロール・メンバー構成の方針と設計根拠を定義 |
| `pm-roles` | `ROLE` | ロール定義 | work | `pm-organization` | 全 Role code を machine-readable な YAML として一覧化する |
| `pm-members` | `MBR` | メンバー定義 | work | `pm-organization`, `pm-roles` | yaml で実行主体（人間・agent）と担当ロールリスト（roles）を定義 |
| `pm-raci` | `RACI` | RACI | work | `pm-organization` | 成果物・プロセスごとの責任分担マトリクスを定義（中規模以上） |

**`pm-organization`** の完了条件:

- 兼務構成を含む組織設計の根拠と最終判断の集約先を承認できること
- pm-roles.yaml と pm-members.yaml への導線が整備されていること
- pm-roles.yaml と pm-members.yaml との構造整合が取れていること
- 禁止事項・見直し条件が実施可能な粒度で記述されていること

**`pm-roles`** の完了条件:

- 全ロールコードとプロジェクト固有メモを承認できること
- PM ロールが定義されていること
- BA ロールが定義されていること
- ARC ロールが定義されていること
- DEV ロールが定義されていること
- QE ロールが定義されていること
- UX ロールが定義されていること
- OPS ロールが定義されていること

**`pm-members`** の完了条件:

- 実行主体（人間・agent）と担当ロールリスト（roles）を承認できること
- PM ロールを担う member または兼務設定が確認できること
- BA ロールを担う member が定義されていること
- ARC ロールを担う member が定義されていること
- QE ロールを担う member が定義されていること

**`pm-raci`** の完了条件:

- 成果物・プロセスごとの責任分担マトリクスを承認できること
- 業務観点での責任分担が確認できること
- 技術観点での責任分担が確認できること
- 品質観点での責任分担が確認できること

## 3. 管理台帳

- 配置先: `docs/ja/projects/prj-0001/030-project-management/controls/project-register`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pjr-index` | `CTLIND` | プロジェクト登録簿 | control | - | 識別済み検討項目と対応策を管理（台帳） |
| `pjr-NNNN-TERM` | `CTLITM` | プロジェクト登録項目 | control | `pjr-index` | 識別済み検討項目と対応策を管理（個別課題） |

## 4. 管理台帳補助ビュー

- 配置先: `docs/ja/projects/prj-0001/030-project-management/controls/project-register/generated`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pjr-open-items` | `CTLOI` | 未完了項目一覧 | generated | `pjr-index`, `pjr-NNNN-TERM` | プロジェクト登録簿の未完了項目を一覧化 |
| `pjr-by-owner` | `CTLOB` | 担当者別一覧 | generated | `pjr-index`, `pjr-NNNN-TERM` | プロジェクト登録簿の担当者別項目を一覧化 |
| `pjr-by-priority` | `CTLPR` | 優先度別一覧 | generated | `pjr-index`, `pjr-NNNN-TERM` | プロジェクト登録簿の優先度別項目を一覧化 |
| `pjr-by-status` | `CTLST` | 状態別一覧 | generated | `pjr-index`, `pjr-NNNN-TERM` | プロジェクト登録簿の状態別項目を一覧化 |

## 5. 管理ビュー

- 配置先: `docs/ja/projects/prj-0001/030-project-management/controls/generated`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pm-risk-register` | `CTLRSK` | リスク登録簿 | generated | `pjr-NNNN-TERM` | 識別済みリスクと対応策を管理 |
| `pm-issue-log` | `CTLISS` | 課題ログ | generated | `pjr-NNNN-TERM` | 発生した課題と対応状況を管理 |
| `pm-change-request-log` | `CTLCRQ` | 変更要求ログ | generated | `pjr-NNNN-TERM` | 変更要求の申請・審査・決定を管理 |
| `pm-decision-log` | `CTLDEC` | 決定記録 | generated | `pjr-NNNN-TERM` | プロジェクト上の意思決定とその根拠を記録 |

## 6. スケジュール

- 配置先: `docs/ja/projects/prj-0001/030-project-management/schedule`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `sch-milestones` | `SCHMS` | マイルストーン定義 | work | - | プロジェクト全体のマイルストーンを定義 |
| `sch-defaults` | `SCHDEF` | スケジュールデフォルト定義 | work | - | スケジュールのデフォルト設定を定義 |
| `sch-track-launch` | `SCHTLNCH` | Launch スケジュール定義 | work | - | Launch フェーズの詳細スケジュールを定義 |

**`sch-milestones`** の完了条件:

- プロジェクト全体のマイルストーンを承認できること
- ビジネスマイルストーンが含まれていること
- 技術マイルストーンが含まれていること
- 品質ゲートが含まれていること

**`sch-defaults`** の完了条件:

- カレンダー・開始日などのデフォルト設定を承認できること
- 業務稼働日・休日設定が確認できること
- validate:schema を通過していること
- 設定値の妥当性が確認できること

**`sch-track-launch`** の完了条件:

- Launch フェーズのタスク・マイルストーン計画を承認できること
- ビジネスタスクの順序・依存関係が確認できること
- 技術タスクのスコープと順序が確認できること
- 品質ゲート・レビュータスクが含まれていること

## 7. レポート

### 7.1. 進捗報告

- 配置先: `docs/ja/projects/prj-0001/030-project-management/reporting/progress-reports`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pr-YYYY-MM-DD` | `PR` | 進捗報告 | control | - | 定期的な進捗状況の報告 |

### 7.2. 議事録

- 配置先: `docs/ja/projects/prj-0001/030-project-management/reporting/meeting-minutes`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `mm-YYYY-MM-DD` | `MM` | 議事録 | control | - | 会議の決定事項・アクションを記録 |
