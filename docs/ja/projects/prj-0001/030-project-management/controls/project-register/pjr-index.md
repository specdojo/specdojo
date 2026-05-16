---
id: prj-0001:pjr-index
type: project
status: ready
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
| PJR-0001 | open | スケジュール展開スクリプト | 成果物カタログからスケジュールを展開するスクリプトを開発する | todo | high | ARC | 2026-05-10 | - |
| PJR-0002 | open | Launch スケジュール | Track=Launch のスケジュールを作成 | todo | high | PO | 2026-05-10 | - |
| PJR-0003 | open | 役割・担当者の定義方法 | 役割と担当者の定義方法を整理する | todo | high | PM | 2026-05-10 | - |
| PJR-0004 | open | pjr-\*->generated展開スクリプト | pjr-\* を generated に展開するスクリプトを開発する | todo | high | PM | 2026-05-10 | - |
| PJR-0005 | open | pjr-rulebook作成のtask化 | pjr-rulebookの作成をスケジュールに記述 | todo | high | PM | 2026-05-10 | - |
| PJR-0006 | done | `sch-<TRACK>-<DOMAIN>-<ARTIFACT>`にした影響 | スクリプトへの影響を確認する | todo | high | PM | 2026-05-10 | - |
| PJR-0007 | open | `pjr-index`のスキーマ | `pjr-index`をvalidationできるようスキーマを作成する | todo | high | ARC | 2026-05-10 | - |
| PJR-0008 | open | `sch-config-<track>.yaml`のスキーマ | 完了したtaskやtask分解ルールを設定できるように修正 | todo | high | ARC | 2026-05-10 | - |
| PJR-0009 | rejected | WBS作成プロンプト | WBS統合により不要 | todo | high | ARC | 2026-05-10 | - |
| PJR-0010 | done | claude, codex対応 | claude, codexで使えるように.agent/に設定をまとめる  | todo | high | ARC | 2026-05-10 | - |
| PJR-0011 | done | StakeholderのID体系 | StakeholderのIDをわかりやすい体系に修正する | todo | high | PM | 2026-05-10 | - |
| PJR-0012 | done | claudeのSKILL対応| .agent/skillsにSKILLを格納して.claude/skillsから参照する構成に変更する | todo | high | ARC | 2026-05-10 | - |
| PJR-0013 | done | prj-overview-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0014 | done | prj-stakeholder-register-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0015 | done | prj-charter-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0016 | open | prj-scope-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0017 | open | prj-success-criteria-and-acceptance-criteria-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0018 | open | prj-issues-and-approach-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0019 | open | prj-assumptions-constraints-dependencies-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0020 | open | prj-comparison-of-alternatives-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0021 | open | pm-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0022 | open | pm-communication-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0023 | open | pm-quality-management-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0024 | done | pm-roles-*作成 | yamlを作る前提でrulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0025 | done | pm-members-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0026 | done | pm-raci-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0027 | done | プロジェクト名の見直し | 旧プロジェクト名となっている箇所を SpecDojo へ見直し | done | high | PO | 2026-05-10 | 関連ドキュメントを更新済み |
| PJR-0028 | done | pm-organization-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - |
| PJR-0029 | done | devcontainerの見直し | claude, codex, copilot用にdevcontainerの設定を見直す | todo | high | PO | 2026-05-10 | - |
| PJR-0030 | rejected | wbs to schedule strategyの見直し | WBS統合により不要 | todo | high | PO | 2026-05-10 | - |
| PJR-0031 | done | wbs strategyの見直し | deliverable wbsへの展開をドメイン別に作成するように見直し | todo | high | PO | 2026-05-10 | - |
| PJR-0032 | done | wbs を成果物カタログに統合 | 成果物カタログをyaml化して統合 | todo | high | PO | 2026-05-17 | - |
| PJR-0033 | done | 成果物カタログのyamlからmd生成 | 可読性向上のため、yamlからmdへの変換を自動化 | todo | high | PO | 2026-05-17 | - |
| PJR-0034 | done | wbsの削除| 不要になったwbsファイルとその記述を削除 | todo | high | PO | 2026-05-17 | - |
| PJR-0035 | done | `dct-<domain>`雛形作成 | `dct-<domain>`のプロジェクト横断での雛形を作成 | todo | high | PO | 2026-05-17 | - |

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
