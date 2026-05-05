---
id: prj-0001:pjr-index
type: project
status: draft
rulebook: pjr-index-rulebook
---

# プロジェクト登録簿

Project Register

この文書は、プロジェクト登録簿です。

プロジェクト進行中に発生する TODO、要確認事項、リスク、課題、変更要求、決定事項、依存事項、備忘などの管理対象を一覧化します。

記載ルール、項目定義、type / status / priority の定義は `pjr-index-rulebook.md` に従います。

## 1. 登録項目一覧

<!-- prettier-ignore -->
| ID | ステータス | タイトル | 説明 | 分類 | 優先度 | 担当 | 期限 | 個票 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PJR-0001 | open | WBS->スケジュール展開スクリプト | WBSをスケジュールに展開するスクリプトを開発する | todo | high | ARC | 2026-05-10 | - |
| PJR-0002 | open | LaunchのWBS, スケジュール | Track=LaunchのWBS、スケジュールを作成 | todo | high | PO | 2026-05-10 | - |
| PJR-0003 | open | 役割・担当者の定義方法 | 役割と担当者の定義方法を整理する | todo | high | PM | 2026-05-10 | - |
| PJR-0004 | open | pjr-\*->generated展開スクリプト | pjr-\* を generated に展開するスクリプトを開発する | todo | high | PM | 2026-05-10 | - |
| PJR-0005 | open | pjr-rulebook作成のtask化 | pjr-rulebookの作成をWBS, スケジュールに記述 | todo | high | PM | 2026-05-10 | - |
| PJR-0006 | done | `sch-<TRACK>-<DOMAIN>-<ARTIFACT>`にした影響 | スクリプトへの影響を確認する | todo | high | PM | 2026-05-10 | - |
| PJR-0007 | open | `pjr-index`のスキーマ | `pjr-index`をvalidationできるようスキーマを作成する | todo | high | ARC | 2026-05-10 | - |
| PJR-0008 | open | `sch-config-<track>.yaml`のスキーマ | 完了したtaskやtask分解ルールを設定できるように修正 | todo | high | ARC | 2026-05-10 | - |
| PJR-0009 | open | WBS作成プロンプト | dctからwbsを作成するinstructions, SKILL, promptを作成する | todo | high | ARC | 2026-05-10 | - |
| PJR-0010 | done | claude, codex対応 | claude, codexで使えるように.agent/に設定をまとめる  | todo | high | ARC | 2026-05-10 | - |
| PJR-0011 | done | StakeholderのID体系 | StakeholderのIDをわかりやすい体系に修正する | todo | high | PM | 2026-05-10 | - |

## 4. 派生ビュー

以下のファイルは、プロジェクト登録簿から生成される補助一覧です。
正本は `pjr-index.md` と各 `pjr-XXXX-<topic>.md` とし、派生ビューは正本の内容に従属します。

### 4.1. 登録簿内の補助一覧

- `[未完了項目一覧](./generated/pjr-open-items.md)`
- `[担当者別一覧](./generated/pjr-by-owner.md)`
- `[優先度別一覧](./generated/pjr-by-priority.md)`
- `[状態別一覧](./generated/pjr-by-status.md)`

### 4.2. controls 全体の派生管理ビュー

- `[リスク登録簿](../generated/pm-risk-register.md)`
- `[課題ログ](../generated/pm-issue-log.md)`
- `[変更要求ログ](../generated/pm-change-request-log.md)`
- `[決定記録](../generated/pm-decision-log.md)`
