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
| ID | ステータス | タイトル | 説明 | 分類 | 優先度 | 担当 | 期限 | 完了日 | 結論 | 個票 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PJR-0001 | done | スケジュール展開スクリプト | 成果物カタログからスケジュールを展開するスクリプトを開発する | todo | high | ARC | 2026-05-10 | 2026-05-17 | wbsの削除やrolesの役割変更などを反映 | - |
| PJR-0002 | open | Launch スケジュール | Track=Launch のスケジュールを作成 | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0003 | open | 役割・担当者の定義方法 | 役割と担当者の定義方法を整理する | todo | high | PM | 2026-05-10 | - | - | - |
| PJR-0004 | open | pjr-\*->generated展開スクリプト | pjr-\* を generated に展開するスクリプトを開発する | todo | high | PM | 2026-05-10 | - | - | - |
| PJR-0005 | open | pjr-rulebook作成のtask化 | pjr-rulebookの作成をスケジュールに記述 | todo | high | PM | 2026-05-10 | - | - | - |
| PJR-0006 | done | `sch-<TRACK>-<DOMAIN>-<ARTIFACT>`にした影響 | スクリプトへの影響を確認する | todo | high | PM | 2026-05-10 | 2026-05-04 | スクリプト影響なし | - |
| PJR-0007 | open | `pjr-index`のスキーマ | `pjr-index`をvalidationできるようスキーマを作成する | todo | high | ARC | 2026-05-10 | - | - | - |
| PJR-0008 | open | `sch-config-<track>.yaml`のスキーマ | 完了したtaskやtask分解ルールを設定できるように修正 | todo | high | ARC | 2026-05-10 | - | - | - |
| PJR-0009 | rejected | WBS作成プロンプト | WBS統合により不要 | todo | high | ARC | 2026-05-10 | 2026-05-17 | WBS統合により却下 | - |
| PJR-0010 | done | claude, codex対応 | claude, codexで使えるように.agent/に設定をまとめる | todo | high | ARC | 2026-05-10 | 2026-05-05 | .agent/設定を整備 | - |
| PJR-0011 | done | StakeholderのID体系 | StakeholderのIDをわかりやすい体系に修正する | todo | high | PM | 2026-05-10 | 2026-05-04 | ID体系を修正済み | - |
| PJR-0012 | done | claudeのSKILL対応 | .agent/skillsにSKILLを格納して.claude/skillsから参照する構成に変更する | todo | high | ARC | 2026-05-10 | 2026-05-05 | 構成変更済み | - |
| PJR-0013 | done | prj-overview-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0014 | done | prj-stakeholder-register-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0015 | done | prj-charter-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0016 | open | prj-scope-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0017 | open | prj-success-criteria-and-acceptance-criteria-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0018 | open | prj-issues-and-approach-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0019 | open | prj-assumptions-constraints-dependencies-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0020 | open | prj-comparison-of-alternatives-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0021 | open | pm-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0022 | open | pm-communication-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0023 | open | pm-quality-management-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0024 | done | pm-roles-*作成 | yamlを作る前提でrulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0025 | done | pm-members-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0026 | done | pm-raci-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0027 | done | プロジェクト名の見直し | 旧プロジェクト名となっている箇所を SpecDojo へ見直し | done | high | PO | 2026-05-10 | 2026-05-05 | 関連ドキュメントを更新済み | - |
| PJR-0028 | done | pm-organization-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0029 | done | devcontainerの見直し | claude, codex, copilot用にdevcontainerの設定を見直す | todo | high | PO | 2026-05-10 | 2026-05-05 | devcontainer設定更新済み | - |
| PJR-0030 | rejected | wbs to schedule strategyの見直し | WBS統合により不要 | todo | high | PO | 2026-05-10 | 2026-05-17 | WBS統合により却下 | - |
| PJR-0031 | done | wbs strategyの見直し | deliverable wbsへの展開をドメイン別に作成するように見直し | todo | high | PO | 2026-05-10 | 2026-05-15 | ドメイン別展開方針を策定済み | - |
| PJR-0032 | done | wbs を成果物カタログに統合 | 成果物カタログをyaml化して統合 | todo | high | PO | 2026-05-17 | 2026-05-17 | dct-*.yaml として統合完了 | - |
| PJR-0033 | done | 成果物カタログのyamlからmd生成 | 可読性向上のため、yamlからmdへの変換を自動化 | todo | high | PO | 2026-05-17 | 2026-05-17 | `specdojo catalog build` で自動生成 | - |
| PJR-0034 | done | wbsの削除 | 不要になったwbsファイルとその記述を削除 | todo | high | PO | 2026-05-17 | 2026-05-16 | wbs関連ファイル・記述をすべて削除済み | - |
| PJR-0035 | done | `dct-<domain>`雛形作成 | `dct-<domain>`のプロジェクト横断での雛形を作成 | todo | high | PO | 2026-05-17 | 2026-05-16 | `docs/specdojo/templates/` に small/medium/large 対応テンプレートを作成 | - |
| PJR-0036 | done | pjr-indexの一覧見直し | 一覧に完了日や結果を記入する欄の追加検討 | todo | high | PO | 2026-05-17 | 2026-05-16 | `完了日` と `結論` 列を追加 | - |
| PJR-0037 | done | schedule strategyの検討 | スケジュール展開戦略の追加の検討 | todo | high | PO | 2026-05-17 | 2026-05-17 | strategy yamlを作成 | - |
| PJR-0038 | done | `pjr-<domain>.md`にdone_criteria追加 | done_criteriaをMarkdownに追加 | todo | high | PO | 2026-05-17 | 2026-05-17 | done_criteriaの追加をscriptで自動化 | - |
| PJR-0039 | done | frontmatterのtypeの見直し | deliverables-catalogなどを追加するかを検討 | todo | high | PO | 2026-05-17 | 2026-05-18 | productの小分類を見直し | - |
| PJR-0040 | open | pjrの個票雛形作成 | todoなどのpjrの個票の雛形を作成 | todo | high | PO | 2026-05-17 | - | - | - |
| PJR-0041 | done | roles, membersの見直し | rolesに全ロールを記述して、membersに兼務を反映するように変更 | todo | high | PO | 2026-05-17 | 2026-05-17 | rolesとmembers, 関連文書を見直し | - |
| PJR-0042 | done | pm-roles, pm-membersのschema作成 | schemaを作成して、rolesとmembersの構造を定義 | todo | high | PO | 2026-05-17 | 2026-05-17 | schemaを作成し、rolesとmembersの構造を定義 | - |
| PJR-0043 | done | specdojo scheduleコマンドの作成 | 成果物カタログ、strategyからスケジュールを生成するコマンドを作成 | todo | high | PO | 2026-05-17 | 2026-05-17 | scheduleコマンドでスケジュール生成を自動化 | - |
| PJR-0044 | done | specdojo commandの稼働確認 | コマンドが実行できるか一通り確認 | todo | high | ARC | 2026-05-17 | 2026-05-17 | buildまで確認 | - |
| PJR-0045 | open | viewpoint_resultsの追加 | レビュー結果の記録を追加 | todo | high | PM | 2026-05-19 | - | - | - |
| PJR-0046 | open | draft agentの作成 | たたき台の内容を作成するAgentのinstructionを作成 | todo | high | PM | 2026-05-19 | - | - | [PJR-0046-draft-agent](./pjr-0046-draft-agent.md) |
| PJR-0047 | open | guidelines/ -> guides/へ変更 | ディレクトリ名とリンクの更新 | todo | high | PM | 2026-05-19 | - | - | -|
| PJR-0048 | done | pm-review-policy.mdの要否確認 | pm-review-policy.mdの必要性を確認 | todo | high | PM | 2026-05-19 | 2026-05-18 | 不要なため削除 | - |
| PJR-0049 | open | specdojo reviewコマンドの作成 | reviewのplan作成などのコマンドを作成 | todo | high | PM | 2026-05-19 | - | - | - |
| PJR-0050 | open | review-viewpointsのtemplate化 | review-viewpointsをテンプレートに加える | todo | high | PM | 2026-05-19 | - | - | - |

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
