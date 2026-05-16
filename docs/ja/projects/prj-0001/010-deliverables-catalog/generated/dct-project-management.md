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

- PO がプロジェクト全体の管理方針・プロセスを承認できる粒度で記述されていること
- BA が業務プロセスとの整合を確認できること
- ARC が構成管理・技術的負債管理など技術管理上の観点が含まれていることを確認できること
- QE がレビュー方針・品質基準への参照を確認できること

**`pm-communication-plan`** の完了条件:

- PO が報告・連絡・会議体の計画を承認できる粒度で記述されていること
- BA が業務観点のコミュニケーション要件が含まれていることを確認できること
- ARC が技術チームへの連絡経路が識別されていることを確認できること
- QE が品質関連の報告経路が確認できること

**`pm-quality-management-plan`** の完了条件:

- PO が品質目標・レビュー方針・品質基準を承認できる粒度で記述されていること
- BA が業務品質基準との整合を確認できること
- ARC がコードレビュー・設計レビューなど技術品質基準が含まれていることを確認できること
- QE が実施可能な検証・レビュー手順が記述されていることを確認できること

## 2. 組織体制

- 配置先: `docs/ja/projects/prj-0001/030-project-management/020-organization`

| local-id | ARTIFACT | 成果物名 | 種別 | 根拠 | 概要 |
| --- | --- | --- | --- | --- | --- |
| `pm-organization` | `ORG` | 組織定義 | work | `prj-overview` | ロール・責務境界・兼務方針・意思決定責任を定義 |
| `pm-roles` | `ROLE` | ロール定義 | work | `pm-organization` | 採用 Role code を machine-readable な YAML として一覧化する |
| `pm-members` | `MBR` | メンバー定義 | work | `pm-organization`, `pm-roles` | yaml で実行主体（人間・agent）とロール対応を定義 |
| `pm-raci` | `RACI` | RACI | work | `pm-organization` | 成果物・プロセスごとの責任分担マトリクスを定義（中規模以上） |

**`pm-organization`** の完了条件:

- PO がロール・責務境界・意思決定責任を承認できる粒度で記述されていること
- BA が業務担当者のロールと責務が識別されていることを確認できること
- ARC が技術チームのロールと責務が識別されていることを確認できること
- QE が品質保証に関わるロールと責務が識別されていることを確認できること

**`pm-roles`** の完了条件:

- PO が採用ロールコードの一覧を承認できること
- BA が業務ロールが網羅されていることを確認できること
- ARC が技術ロールが網羅されていることを確認できること
- QE が QE ロールが明確に定義されていることを確認できること

**`pm-members`** の完了条件:

- PO が実行主体（人間・agent）とロール対応を承認できること
- BA が業務担当者の割り当てが確認できること
- ARC が技術担当者の割り当てが確認できること
- QE が QE 担当者の割り当てが確認できること

**`pm-raci`** の完了条件:

- PO が成果物・プロセスごとの責任分担マトリクスを承認できること
- BA が業務観点での責任分担が確認できること
- ARC が技術観点での責任分担が確認できること
- QE が品質観点での責任分担が確認できること

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
| `sch-config-launch` | `SCHCFG` | Launch スケジュール設定 | work | - | Launch フェーズの詳細スケジュールの設定を定義 |
| `sch-agent-overrides-launch` | `SCHAOV` | Launch スケジュールエージェント上書き設定 | work | - | Launch フェーズの詳細スケジュールのエージェント上書き設定を定義 |

**`sch-milestones`** の完了条件:

- PO がプロジェクト全体のマイルストーンを承認できること
- BA がビジネスマイルストーンが含まれていることを確認できること
- ARC が技術マイルストーンが含まれていることを確認できること
- QE が品質ゲートが含まれていることを確認できること

**`sch-defaults`** の完了条件:

- PO がカレンダー・開始日などのデフォルト設定を承認できること
- BA が業務稼働日・休日設定が確認できること
- ARC が validate:schema を通過していることを確認できること
- QE が設定値の妥当性を確認できること

**`sch-track-launch`** の完了条件:

- PO が Launch フェーズのタスク・マイルストーン計画を承認できること
- BA がビジネスタスクの順序・依存関係が確認できること
- ARC が技術タスクのスコープと順序が確認できること
- QE が品質ゲート・レビュータスクが含まれていることを確認できること

**`sch-config-launch`** の完了条件:

- PO が担当チーム・エージェントモードなどトラック設定を承認できること
- BA が担当割り当てが確認できること
- ARC が validate:schema を通過していることを確認できること
- QE が設定値の妥当性を確認できること

**`sch-agent-overrides-launch`** の完了条件:

- PO が例外的なエージェントモード上書き設定を承認できること
- BA が手動確認が必要なタスクが識別されていることを確認できること
- ARC が validate:schema を通過していることを確認できること
- QE が品質関連タスクのエージェントモードが適切であることを確認できること

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
