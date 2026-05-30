# 担当者別一覧

> このファイルは `pjr-index.md` から生成された派生ビューです。正本は `pjr-index.md` と各 `pjr-XXXX-<topic>.md` であり、このファイルは再生成可能です。

## 1. ARC

<!-- prettier-ignore -->
| ID | ステータス | タイトル | 説明 | 分類 | 優先度 | 担当 | 期限 | 完了日 | 結論 | 個票 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PJR-0001 | done | スケジュール展開スクリプト | 成果物カタログからスケジュールを展開するスクリプトを開発する | todo | high | ARC | 2026-05-10 | 2026-05-17 | wbsの削除やrolesの役割変更などを反映 | - |
| PJR-0004 | done | pjr-\*->generated展開スクリプト | pjr-\* を generated に展開するスクリプトを開発する | todo | high | ARC | 2026-05-10 | 2026-05-23 | PJR-0059で対応 | - |
| PJR-0006 | done | `sch-<TRACK>-<DOMAIN>-<ARTIFACT>`にした影響 | スクリプトへの影響を確認する | todo | high | ARC | 2026-05-10 | 2026-05-04 | スクリプト影響なし | - |
| PJR-0007 | done | `pjr-index`のスキーマ | `pjr-index`をvalidationできるようスキーマを作成する | todo | high | ARC | 2026-05-10 | 2026-05-23 | PJR-0058で対応 | - |
| PJR-0008 | done | `sch-config-<track>.yaml`のスキーマ | 完了したtaskやtask分解ルールを設定できるように修正 | todo | high | ARC | 2026-05-10 | 2026-05-23 | PJR-0037 | - |
| PJR-0009 | rejected | WBS作成プロンプト | WBS統合により不要 | todo | high | ARC | 2026-05-10 | 2026-05-17 | WBS統合により却下 | - |
| PJR-0010 | done | claude, codex対応 | claude, codexで使えるように.agent/に設定をまとめる | todo | high | ARC | 2026-05-10 | 2026-05-05 | .agent/設定を整備 | - |
| PJR-0011 | done | StakeholderのID体系 | StakeholderのIDをわかりやすい体系に修正する | todo | high | ARC | 2026-05-10 | 2026-05-04 | ID体系を修正済み | - |
| PJR-0012 | done | claudeのSKILL対応 | .agent/skillsにSKILLを格納して.claude/skillsから参照する構成に変更する | todo | high | ARC | 2026-05-10 | 2026-05-05 | 構成変更済み | - |
| PJR-0013 | done | prj-overview-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | ARC | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0014 | done | prj-stakeholder-register-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | ARC | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0015 | done | prj-charter-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | ARC | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0029 | done | devcontainerの見直し | claude, codex, copilot用にdevcontainerの設定を見直す | todo | high | ARC | 2026-05-10 | 2026-05-05 | devcontainer設定更新済み | - |
| PJR-0030 | rejected | wbs to schedule strategyの見直し | WBS統合により不要 | todo | high | ARC | 2026-05-10 | 2026-05-17 | WBS統合により却下 | - |
| PJR-0031 | done | wbs strategyの見直し | deliverable wbsへの展開をドメイン別に作成するように見直し | todo | high | ARC | 2026-05-10 | 2026-05-15 | ドメイン別展開方針を策定済み | - |
| PJR-0032 | done | wbs を成果物カタログに統合 | 成果物カタログをyaml化して統合 | todo | high | ARC | 2026-05-17 | 2026-05-17 | dct-*.yaml として統合完了 | - |
| PJR-0033 | done | 成果物カタログのyamlからmd生成 | 可読性向上のため、yamlからmdへの変換を自動化 | todo | high | ARC | 2026-05-17 | 2026-05-17 | `specdojo catalog build` で自動生成 | - |
| PJR-0034 | done | wbsの削除 | 不要になったwbsファイルとその記述を削除 | todo | high | ARC | 2026-05-17 | 2026-05-16 | wbs関連ファイル・記述をすべて削除済み | - |
| PJR-0035 | done | `dct-<domain>`雛形作成 | `dct-<domain>`のプロジェクト横断での雛形を作成 | todo | high | ARC | 2026-05-17 | 2026-05-16 | `docs/specdojo/templates/` に small/medium/large 対応テンプレートを作成 | - |
| PJR-0036 | done | pjr-indexの一覧見直し | 一覧に完了日や結果を記入する欄の追加検討 | todo | high | ARC | 2026-05-17 | 2026-05-16 | `完了日` と `結論` 列を追加 | - |
| PJR-0037 | done | schedule strategyの検討 | スケジュール展開戦略の追加の検討 | todo | high | ARC | 2026-05-17 | 2026-05-17 | strategy yamlを作成 | - |
| PJR-0038 | done | `pjr-<domain>.md`にdone_criteria追加 | done_criteriaをMarkdownに追加 | todo | high | ARC | 2026-05-17 | 2026-05-17 | done_criteriaの追加をscriptで自動化 | - |
| PJR-0039 | done | frontmatterのtypeの見直し | deliverables-catalogなどを追加するかを検討 | todo | high | ARC | 2026-05-17 | 2026-05-18 | productの小分類を見直し | - |
| PJR-0040 | done | pjrの個票雛形作成 | todoなどのpjrの個票の雛形を作成 | todo | high | ARC | 2026-05-17 | 2026-05-18 | 種類ごとの個票テンプレートを作成 | - |
| PJR-0042 | done | pm-roles, pm-membersのschema作成 | schemaを作成して、rolesとmembersの構造を定義 | todo | high | ARC | 2026-05-17 | 2026-05-17 | schemaを作成し、rolesとmembersの構造を定義 | - |
| PJR-0043 | done | specdojo scheduleコマンドの作成 | 成果物カタログ、strategyからスケジュールを生成するコマンドを作成 | todo | high | ARC | 2026-05-17 | 2026-05-17 | scheduleコマンドでスケジュール生成を自動化 | - |
| PJR-0044 | done | specdojo commandの稼働確認 | コマンドが実行できるか一通り確認 | todo | high | ARC | 2026-05-17 | 2026-05-17 | buildまで確認 | - |
| PJR-0045 | done | viewpoint_resultsの追加 | レビュー結果の記録を追加 | todo | high | ARC | 2026-05-19 | 2026-05-24 | review resultコマンドの追加 | - |
| PJR-0046 | open | draft agentの作成 | たたき台の内容を作成するAgentのinstructionを作成 | todo | high | ARC | 2026-05-19 | - | - | [PJR-0046-draft-agent](../pjr-0046-draft-agent.md) |
| PJR-0047 | done | guidelines/ -> guides/へ変更 | ディレクトリ名とリンクの更新 | todo | high | ARC | 2026-05-19 | 2026-05-19 | guidelines/ を guides/ にリネームし全参照を更新 | - |
| PJR-0048 | done | pm-review-policy.mdの要否確認 | pm-review-policy.mdの必要性を確認 | todo | high | ARC | 2026-05-19 | 2026-05-18 | 不要なため削除 | - |
| PJR-0049 | done | specdojo reviewコマンドの作成 | reviewのplan作成などのコマンドを作成 | todo | high | ARC | 2026-05-19 | 2026-05-21 | specdojo review plan等を作成 | - |
| PJR-0050 | done | review-viewpointsのtemplate化 | review-viewpointsをテンプレートに加える | todo | high | ARC | 2026-05-19 | 2026-05-18 | テンプレートとスキーマを作成 | - |
| PJR-0051 | done | specdojo reviewコマンドの仕様作成 | reviewコマンドの仕様を作成 | todo | high | ARC | 2026-05-20 | 2026-05-19 | command usage guideに仕様を作成 | - |
| PJR-0052 | done | idからパスを解決するコマンドの作成 | idからファイルのパスを解決するためのDB構築と検索コマンドを作成 | todo | high | ARC | 2026-05-20 | 2026-05-21 | specdojo index コマンドを作成 | - |
| PJR-0053 | done | templateのプレースホルダーの変更 | _CAPITAL_CASE_の形式に見直し | todo | high | ARC | 2026-05-20 | 2026-05-21 | PJR-0055, 0056が残件 | - |
| PJR-0054 | done | idのリンクをMarkdown previewへ反映 | Markdown previewにidリンクを反映する機能を追加 | todo | high | ARC | 2026-05-20 | 2026-05-21 | Markdown preview,VitePressにidリンクを反映 | - |
| PJR-0055 | done | pjr個票生成コマンド作成 | pjr個票をテンプレートから生成するコマンドとvalidationを作成 | todo | high | ARC | 2026-05-24 | 2026-05-23 | specdojo register addを追加 | - |
| PJR-0056 | done | レビュー観点生成コマンド作成 | レビュー観点yamlをテンプレートから生成するコマンドとvalidationを作成 | todo | high | ARC | 2026-05-24 | 2026-05-21 | specdojo review scaffoldを作成 | - |
| PJR-0057 | done | `[[id]]`を別名表示できるようにする | `[[id\|alt]]`と別名を併記できるようにする | todo | high | ARC | 2026-05-24 | 2026-05-21 | \|でaltを指定可能に変更 | - |
| PJR-0058 | done | pjr-indexのスキーマ作成 | pjr-indexのフォーマットチェックできるようにする | todo | high | ARC | 2026-05-24 | 2026-05-23 | templateとスキーマを作成 | - |
| PJR-0059 | done | pjrのscaffold | pjr-index等を自動生成するためのscaffoldを作成 | todo | high | ARC | 2026-05-24 | 2026-05-23 | specdojo register scaffold, buildを追加 | - |
| PJR-0060 | done | pjr-indexのvscodeでのリアルタイム検証 | .remarkrc.yamlに追加してvscodeでリアルタイム検証 | todo | high | ARC | 2026-05-24 | 2026-05-23 | remark-md-content.cjsを追加し.remarkrc.yamlに設定 | - |
| PJR-0061 | done | sch-defaultsにあるstart_dateをsch-strategyへ移行 | sch-defaultsにはdefault_start_dateを設定、sch-strategyにはstart_dateを設定 | todo | high | ARC | 2026-05-24 | 2026-05-23 | default_start_date、start_dateを設定 | - |
| PJR-0063 | rejected | sch-strategyの名前変更 | sch-strategyをsch-configにリネーム | todo | high | ARC | 2026-05-24 | 2026-05-23 | claudeからstrategyの方が適切と指摘を受けた | - |
| PJR-0064 | open | register.tsのTABLE_HEADERのリファクタ | TABLE_HEADERが決め打ちになっているのを修正 | todo | medium | ARC | 2026-05-24 | - | - | - |
| PJR-0065 | done | srcとtoolsが分かれているのを再考 | tools以下のコードもspecdojoのsrcに含めてもいいかを検討 | todo | medium | ARC | 2026-05-24 | 2026-05-23 | 依存しているコードを再整理。validate-templates.tsのテスト化が残 | - |
| PJR-0066 | done | テスト環境の構築 | vitestを導入 | todo | medium | ARC | 2026-05-23 | 2026-05-23 | vitestを導入し、instructionsを整備 | - |
| PJR-0067 | done | validate-templatesをテスト化 | validate-templatesをテストに移行 | todo | medium | ARC | 2026-05-24 | 2026-05-23 | catalog-scaffold, register, review-planのテストへ分解 | - |
| PJR-0068 | done | auto-generateを追加 | ファイルの変更を検知して自動生成する機能を追加 | todo | medium | ARC | 2026-05-24 | 2026-05-23 | specdojo watchコマンドを追加 | - |
| PJR-0069 | done | register close reject等を追加 | registerのコマンドを拡張 | todo | medium | ARC | 2026-05-24 | 2026-05-24 | start/wait/review/close/reject/defer/reopen/updateを追加 | - |
| PJR-0070 | done | sch-strategyに作成済み成果物を設定 | scheduleを生成するときに作成済みの成果物を考慮する | todo | medium | ARC | 2026-05-24 | 2026-05-23 | sch-strategyにinitial_stateを追加 | - |
| PJR-0071 | done | specdojo buildコマンドの追加 | 生成物の一括ビルドを行うコマンドを追加 | todo | medium | ARC | 2026-05-24 | 2026-05-23 | specdojo buildコマンドを実装 | - |
| PJR-0072 | done | 単体テストの追加 | specdojoコマンドの単体テストを追加 | todo | medium | ARC | 2026-05-24 | 2026-05-24 | vitestのコードを追加 | - |
| PJR-0073 | open | opencode用のagent memberを見直し | openspecに合わせたmemberに見直し | todo | medium | ARC | 2026-05-24 | - | - | - |
| PJR-0074 | open | claude用のagent memberを見直し | claudeに合わせたmemberに見直し | todo | medium | ARC | 2025-05-24 | - | - | - |
| PJR-0075 | done | worktreeに合わせたdevcontainer設定の変更 | マウントの変更等を実施 | todo | medium | ARC | 2025-05-24 | 2026-05-24 | specdojo-workspaceに配置するよう見直し | - |
| PJR-0076 | open | 完了成果物をscheduleへ反映 | specdojo scheduleに完了成果物を反映して初期値をずらす | todo | medium | ARC | 2026-05-26 | - | - | - |
| PJR-0077 | done | specdojo exec runの追加 | agentの実行を管理するためのコマンドを追加 | todo | medium | ARC | 2026-05-26 | 2026-05-27 | specdojo exec runコマンドを実装 | - |
| PJR-0078 | done | scheduleにgateを導入 | first_pass後にsecond_passに進めるよう、phase_gatesを導入 | todo | medium | ARC | 2026-05-31 | 2026-05-30 | phase_gatesを導入、yamlとtsを修正 | - |
| PJR-0079 | open | taskをstep-by-stepで実行 | agentで実行する前にtaskをステップごとに実行 | todo | medium | ARC | 2026-05-31 | - | - | - |
| PJR-0080 | open | 成果物のscaffoldの追加 | 成果物をprojectサイズ別に一括生成するコマンドを追加 | todo | medium | ARC | 2026-05-31 | - | - | - |
| PJR-0081 | deferred | metadata.jsonの要否確認 | 少なくとも更新日付は不要、ファイル自体の用途も確認 | todo | medium | ARC | 2026-05-31 | - | 人向けなのでしばらく運用して不要であれば削除 | - |
| PJR-0082 | open | pjr-by-*の統合を検討 | コミットの変更が複数で発生するので統合を検討 | todo | medium | ARC | 2026-05-31 | - | - | - |
| PJR-0083 | done | milestoneをtimelineの上部に表示 | milestoneの表示位置をtimelineの上部に変更 | todo | medium | ARC | 2026-05-31 | 2026-05-30 | 上部へ移動 | - |
| PJR-0084 | done | gateをtimelineに表示 | gateをtimelineのtaskの中に表示する | todo | medium | ARC | 2026-05-31 | 2026-05-30 | phase_gateをtaskの中に行表示 | - |

## 2. PO

<!-- prettier-ignore -->
| ID | ステータス | タイトル | 説明 | 分類 | 優先度 | 担当 | 期限 | 完了日 | 結論 | 個票 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PJR-0002 | done | Launch スケジュール | Track=Launch のスケジュールを作成 | todo | high | PO | 2026-05-10 | 2026-05-24 | sch-strategy-launchを作成 | - |
| PJR-0003 | open | 役割・担当者の定義方法 | 役割と担当者の定義方法を整理する | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0005 | open | pjr-rulebook作成のtask化 | pjr-rulebookの作成をスケジュールに記述 | todo | high | PO | 2026-05-10 | - | - | - |
| PJR-0016 | done | prj-scope-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0017 | done | prj-success-criteria-and-acceptance-criteria-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0018 | done | prj-issues-and-approach-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0019 | done | prj-assumptions-constraints-dependencies-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0020 | done | prj-comparison-of-alternatives-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0021 | done | pm-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0022 | done | pm-communication-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0023 | done | pm-quality-management-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | - | このtodoはschで管理 | - |
| PJR-0024 | done | pm-roles-*作成 | yamlを作る前提でrulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0025 | done | pm-members-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0026 | done | pm-raci-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0027 | done | プロジェクト名の見直し | 旧プロジェクト名となっている箇所を SpecDojo へ見直し | todo | high | PO | 2026-05-10 | 2026-05-05 | 関連ドキュメントを更新済み | - |
| PJR-0028 | done | pm-organization-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0041 | done | roles, membersの見直し | rolesに全ロールを記述して、membersに兼務を反映するように変更 | todo | high | PO | 2026-05-17 | 2026-05-17 | rolesとmembers, 関連文書を見直し | - |
