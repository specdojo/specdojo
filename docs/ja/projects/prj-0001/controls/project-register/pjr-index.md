---
specdojo:
  id: prj-0001:pjr-index
  type: project
  status: ready
  rulebook: specdojo:pjr-rulebook
---

# プロジェクト登録簿

Project Register

この文書は、プロジェクト登録簿です。

プロジェクト進行中に発生する TODO、要確認事項、リスク、課題、変更要求、決定事項、依存事項、備忘などの管理対象を一覧化します。

記載ルール、項目定義、type / status / priority の定義は [[specdojo:pjr-rulebook]] に従います。
登録の判断、状態遷移、個票分離などの使い方は [[specdojo:register-operation-guide]] を参照します。

## 1. 登録項目一覧

<!-- prettier-ignore -->
| ID | ステータス | タイトル | 説明 | 分類 | 優先度 | 担当 | 期限 | 完了日 | 結論 | 個票 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PJR-0001 | done | スケジュール展開スクリプト | 成果物カタログからスケジュールを展開するスクリプトを開発する | todo | high | ARC | 2026-05-10 | 2026-05-17 | wbsの削除やrolesの役割変更などを反映 | - |
| PJR-0002 | done | Launch スケジュール | Track=Launch のスケジュールを作成 | todo | high | PO | 2026-05-10 | 2026-05-24 | sch-strategy-launchを作成 | - |
| PJR-0003 | done | 役割・担当者の定義方法 | 役割と担当者の定義方法を整理する | todo | high | PO | 2026-05-10 | 2026-07-22 | pm-roles, pm-membersに設定 | - |
| PJR-0004 | done | pjr-\*->generated展開スクリプト | pjr-\* を generated に展開するスクリプトを開発する | todo | high | ARC | 2026-05-10 | 2026-05-23 | PJR-0059で対応 | - |
| PJR-0005 | done | specdojo:pjr-rulebook作成のtask化 | specdojo:pjr-rulebookの作成をスケジュールに記述 | todo | high | PO | 2026-05-10 | 2026-07-23 | specdojo:pjr-rulebookを個別に作成 | - |
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
| PJR-0016 | done | prj-scope-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0017 | done | prj-success-criteria-and-acceptance-criteria-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0018 | done | prj-issues-and-approach-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0019 | done | prj-assumptions-constraints-dependencies-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0020 | done | prj-comparison-of-alternatives-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0021 | done | pm-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0022 | done | pm-communication-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0023 | done | pm-quality-management-plan-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-24 | このtodoはschで管理 | - |
| PJR-0024 | done | pm-roles-*作成 | yamlを作る前提でrulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0025 | done | pm-members-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0026 | done | pm-raci-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
| PJR-0027 | done | プロジェクト名の見直し | 旧プロジェクト名となっている箇所を SpecDojo へ見直し | todo | high | PO | 2026-05-10 | 2026-05-05 | 関連ドキュメントを更新済み | - |
| PJR-0028 | done | pm-organization-*作成 | rulebookを作成して、instruction, sampleへ展開する | todo | high | PO | 2026-05-10 | 2026-05-05 | rulebook/instruction/sample作成済み | - |
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
| PJR-0041 | done | roles, membersの見直し | rolesに全ロールを記述して、membersに兼務を反映するように変更 | todo | high | PO | 2026-05-17 | 2026-05-17 | rolesとmembers, 関連文書を見直し | - |
| PJR-0042 | done | pm-roles, pm-membersのschema作成 | schemaを作成して、rolesとmembersの構造を定義 | todo | high | ARC | 2026-05-17 | 2026-05-17 | schemaを作成し、rolesとmembersの構造を定義 | - |
| PJR-0043 | done | specdojo scheduleコマンドの作成 | 成果物カタログ、strategyからスケジュールを生成するコマンドを作成 | todo | high | ARC | 2026-05-17 | 2026-05-17 | scheduleコマンドでスケジュール生成を自動化 | - |
| PJR-0044 | done | specdojo commandの稼働確認 | コマンドが実行できるか一通り確認 | todo | high | ARC | 2026-05-17 | 2026-05-17 | buildまで確認 | - |
| PJR-0045 | done | viewpoint_resultsの追加 | レビュー結果の記録を追加 | todo | high | ARC | 2026-05-19 | 2026-05-24 | review resultコマンドの追加 | - |
| PJR-0046 | done | draft agentの作成 | たたき台の内容を作成するAgentのinstructionを作成 | todo | high | ARC | 2026-05-19 | 2026-06-07 | pm-members.yamlにagentを定義 | - |
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
| PJR-0057 | done | `[[id]]`を別名表示できるようにする| `[[id\|alt]]`と別名を併記できるようにする | todo | high | ARC | 2026-05-24 | 2026-05-21 | \|でaltを指定可能に変更 | - |
| PJR-0058 | done | pjr-indexのスキーマ作成 | pjr-indexのフォーマットチェックできるようにする | todo | high | ARC | 2026-05-24 | 2026-05-23 | templateとスキーマを作成 | - |
| PJR-0059 | done | pjrのscaffold | pjr-index等を自動生成するためのscaffoldを作成 | todo | high | ARC | 2026-05-24 | 2026-05-23 | specdojo register scaffold, buildを追加 | - |
| PJR-0060 | done | pjr-indexのvscodeでのリアルタイム検証 | .remarkrc.yamlに追加してvscodeでリアルタイム検証 | todo | high | ARC | 2026-05-24 | 2026-05-23 | remark-md-content.cjsを追加し.remarkrc.yamlに設定 | - |
| PJR-0061 | done | sch-defaultsにあるstart_dateをsch-strategyへ移行 | sch-defaultsにはdefault_start_dateを設定、sch-strategyにはstart_dateを設定 | todo | high | ARC | 2026-05-24 | 2026-05-23 | default_start_date、start_dateを設定 | - |
| PJR-0063 | rejected | sch-strategyの名前変更 | sch-strategyをsch-configにリネーム | todo | high | ARC | 2026-05-24 | 2026-05-23 | claudeからstrategyの方が適切と指摘を受けた | - |
| PJR-0064 | done | register.tsのTABLE_HEADERのリファクタ | TABLE_HEADERが決め打ちになっているのを修正 | todo | medium | ARC | 2026-05-24 | 2026-07-23 | TABLE_HEADERをpjr-index.md由来に一本化し、章番号アンカーと派生ビューのtemplate駆動化で日本語ハードコードを除去（コミット18fc83db） | - |
| PJR-0065 | done | srcとtoolsが分かれているのを再考 | tools以下のコードもspecdojoのsrcに含めてもいいかを検討 | todo | medium | ARC | 2026-05-24 | 2026-05-23 | 依存しているコードを再整理。validate-templates.tsのテスト化が残 | - |
| PJR-0066 | done | テスト環境の構築 | vitestを導入 | todo | medium | ARC | 2026-05-23 | 2026-05-23 | vitestを導入し、instructionsを整備 | - |
| PJR-0067 | done | validate-templatesをテスト化 | validate-templatesをテストに移行 | todo | medium | ARC | 2026-05-24 | 2026-05-23 | catalog-scaffold, register, review-planのテストへ分解 | - |
| PJR-0068 | done | auto-generateを追加 | ファイルの変更を検知して自動生成する機能を追加 | todo | medium | ARC | 2026-05-24 | 2026-05-23 | specdojo watchコマンドを追加 | - |
| PJR-0069 | done | register close reject等を追加 | registerのコマンドを拡張 | todo | medium | ARC | 2026-05-24 | 2026-05-24 | start/wait/review/close/reject/defer/reopen/updateを追加 | - |
| PJR-0070 | done | sch-strategyに作成済み成果物を設定 | scheduleを生成するときに作成済みの成果物を考慮する | todo | medium | ARC | 2026-05-24 | 2026-05-23 | sch-strategyにinitial_stateを追加 | - |
| PJR-0071 | done | specdojo buildコマンドの追加 | 生成物の一括ビルドを行うコマンドを追加 | todo | medium | ARC | 2026-05-24 | 2026-05-23 | specdojo buildコマンドを実装 | - |
| PJR-0072 | done | 単体テストの追加 | specdojoコマンドの単体テストを追加 | todo | medium | ARC | 2026-05-24 | 2026-05-24 | vitestのコードを追加 | - |
| PJR-0073 | done | opencode用のagent memberを見直し | openspecに合わせたmemberに見直し | todo | medium | ARC | 2026-05-24 | 2026-06-07 | pm-members.yamlに定義 | - |
| PJR-0074 | done | claude用のagent memberを見直し | claudeに合わせたmemberに見直し | todo | medium | ARC | 2026-05-24 | 2026-06-07 | pm-members.yamlに定義 | - |
| PJR-0075 | done | worktreeに合わせたdevcontainer設定の変更 | マウントの変更等を実施 | todo | medium | ARC | 2026-05-24 | 2026-05-24 | specdojo-workspaceに配置するよう見直し | - |
| PJR-0076 | done | 完了成果物をscheduleへ反映 | specdojo scheduleに完了成果物を反映して初期値をずらす | todo | medium | ARC | 2026-05-26 | 2026-05-30 | 初期値をずらすのとgateの処理を追加 | - |
| PJR-0077 | done | specdojo exec runの追加 | agentの実行を管理するためのコマンドを追加 | todo | medium | ARC | 2026-05-26 | 2026-05-27 | specdojo exec runコマンドを実装 | - |
| PJR-0078 | done | scheduleにgateを導入 | first_pass後にsecond_passに進めるよう、phase_gatesを導入 | todo | medium | ARC | 2026-05-31 | 2026-05-30 | phase_gatesを導入、yamlとtsを修正 | - |
| PJR-0079 | done | taskをstep-by-stepで実行 | agentで実行する前にtaskをステップごとに実行 | todo | medium | ARC | 2026-05-31 | 2026-07-22 | LAUNCH track実行の中で検証 | - |
| PJR-0080 | done | 成果物のscaffoldの追加 | 成果物をprojectサイズ別に一括生成するコマンドを追加 | todo | medium | ARC | 2026-05-31 | 2026-07-23 | catalog generateコマンドを追加 | - |
| PJR-0081 | deferred | metadata.jsonの要否確認 | 少なくとも更新日付は不要、ファイル自体の用途も確認 | todo | medium | ARC | 2026-05-31 | - | 人向けなのでしばらく運用して不要であれば削除 | - |
| PJR-0082 | done | pjr-by-*の統合を検討 | コミットの変更が複数で発生するので統合を検討 | todo | medium | ARC | 2026-05-31 | 2026-05-30 | pjr-viewsに統合 | - |
| PJR-0083 | done | milestoneをtimelineの上部に表示 | milestoneの表示位置をtimelineの上部に変更 | todo | medium | ARC | 2026-05-31 | 2026-05-30 | 上部へ移動 | - |
| PJR-0084 | done | gateをtimelineに表示 | gateをtimelineのtaskの中に表示する | todo | medium | ARC | 2026-05-31 | 2026-05-30 | phase_gateをtaskの中に行表示 | - |
| PJR-0085 | done | specdojo:docs-structure-guideの不整合修正 | ネーミングなどの不整合を修正 | todo | medium | ARC | 2026-05-31 | 2026-05-30 | guideの内容とファイル配置を修正 | - |
| PJR-0086 | done | catalog-scaffold.test.tsの見直し | schemaでチェックできるようにしたのでテストは不要かどうかを検討 | todo | medium | ARC | 2026-05-31 | 2026-07-22 | schemaチェックもtestに追加 | - |
| PJR-0087 | done | dct-*-template.yamlのmarkdownの自動生成追加 | yamlでは可読性が低いのでmarkdown形式を自動生成する | todo | medium | ARC | 2026-05-31 | 2026-07-23 | yaml-pages の dct テンプレ表示ページを catalog build と同じ表形式（成果物表＋完了条件）で描画する実装を追加（コミットd8e1b346） | - |
| PJR-0088 | done | agent-config-guideを追加 | エージェントの設定を一箇所で記述 | todo | medium | ARC | 2026-05-31 | 2026-05-30 | exec-config-guide.mdに記述。設定ファイルも変更 | - |
| PJR-0089 | done | claude-agent-settingsの見直し | capability, proficiencyに対応して記述を見直し | todo | medium | ARC | 2026-06-05 | 2026-06-02 | agent file含めて整備 | - |
| PJR-0090 | done | agent-briefとreview planの見直し | 重複している部分があり、完全分離か統合を検討 | todo | medium | ARC | 2026-06-05 | 2026-06-02 | reviewをexecに統合 | - |
| PJR-0091 | done | taskのcompleteとcommit,pushの整理 | taskはcompleteで終了するが、その後のcommit, pushの関係を整理 | todo | medium | ARC | 2026-06-05 | 2026-07-22 | complete後にcommit, pushを実行する運用で当面実行 | - |
| PJR-0092 | done | VitePressのルートをrepoルートに変更 | 将来的にソースコードへのリンクを容易にするため。また、vscodeの絶対パスとの整合性も保てる | todo | medium | ARC | 2026-06-07 | 2026-06-10 | .vitepressをルートに移動 | - |
| PJR-0093 | done | sch-strategyのexecutionのautoを見直し | executionはauto/manualになっているがautoが単語として適切か確認 | todo | medium | ARC | 2026-06-07 | 2026-06-03 | manual/autoではなくhuman/agentに変更 | - |
| PJR-0094 | done | sch-strategyのexecutionが後続に反映されているか | executionがmanualの場合、agentが実行しないなど適切に処理がされるかを確認 | todo | medium | ARC | 2026-06-07 | 2026-06-07 | executionをhuman,agentに見直し後続へ反映 | - |
| PJR-0095 | done | specdojo exec buildの出力ログの修正 | ログで出力されるディレクトリが古い仕様なので修正 | todo | medium | ARC | 2026-06-07 | 2026-06-02 | ログとその他の出力を修正 | - |
| PJR-0096 | done | edit-planのfrontmatter, based_onのエラー修正 | frontmatter typeの追加とbased_onで何も表示されない不具合を修正 | todo | medium | ARC | 2026-06-07 | 2026-06-02 | .remarkrc.yamlでのschema適用優先順も含め修正 | - |
| PJR-0097 | done | xep-rulebookの追加 | edit plan用のrulebookを追加 | todo | medium | ARC | 2026-06-07 | 2026-07-23 | xep, xrpについては自動生成のためrulebook不要 | - |
| PJR-0098 | done | specdojo exec auto選択時にcapabilitiesのロジック変更 | 最小剰余を使用してcapabilitiesを選択->制約条件に変更 | todo | medium | ARC | 2026-06-07 | 2026-06-07 | priorityに基づいて選択するように変更 | - |
| PJR-0099 | done | exec planをcreation_mode毎に出力変更 | creation_modeを反映し、planテンプレートから生成 | todo | medium | ARC | 2026-06-13 | 2026-06-10 | creation_modeをapproach_modeに変更してmode毎にテンプレート作成 | - |
| PJR-0100 | done | *-instruction.mdを削除 | *-instruction.mdを廃止 | todo | medium | ARC | 2026-06-14 | 2026-06-13 | *-instruction.mdを廃止し、rulebook、標準、Skill、サイドバー、関連文書からinstruction参照を削除 | - |
| PJR-0101 | done | xep-freeform-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0102 | done | xep-fully-guided-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0103 | done | xep-recipe-guided-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0104 | done | xep-recipe-maintenance-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0105 | done | xep-rulebook-maintenance-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0106 | done | xep-sample-maintenance-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0107 | done | xep-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0108 | done | xer-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0109 | done | xrp-freeform-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0110 | done | xrp-fully-guided-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0111 | done | xrp-recipe-guided-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0112 | done | xrp-recipe-maintenance-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0113 | done | xrp-rulebook-maintenance-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0114 | done | xrp-sample-maintenance-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0115 | done | xrp-template-maintenance-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0116 | done | xrp-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0117 | done | xrr-templateの拡充 | agentへの指示を明確化 | todo | medium | ARC | 2026-06-14 | 2026-06-21 | idや参考資料の参照を見直し | - |
| PJR-0118 | done | Debian chromium 150のヘッドレス描画クラッシュ対応 | arm64 full版chromium 150.0.7871.46がヘッドレス描画時にbrk #0でクラッシュしmermaid SVG生成が失敗。chromium-headless-shellへ切替(Dockerfile変更済み)。| issue | high | ARC | 2026-07-08 | 2026-07-08 | Dockerfileを修正 | - |
| PJR-0119 | decided | プロジェクト憲章の承認 | prj-charter の立ち上げ認可と権限委譲を PO として承認する | decision | high | PO | 2026-07-17 | 2026-07-17 | コミットce44286c時点の憲章を承認。立ち上げ認可と権限委譲を確定 | [pjr-0119-charter-approval](./pjr-0119-charter-approval.md) |
| PJR-0120 | decided | 初期公開の範囲・ライセンス・貢献導線の確定 | 初期公開の対象範囲、ライセンス、貢献導線を PO の判断で確定する（旧 ACD-D03） | decision | high | PO | - | 2026-07-24 | 採用ライセンスを MIT、貢献導線を GitHub issue / pull request として確定 | - |
| PJR-0121 | decided | 公開先・公開範囲・変更提案受付方法の確定 | 公開リポジトリの公開先、公開範囲、変更提案の受付方法を確定し、公開資料に機密情報や対象外の業務情報が含まれないことを確認する（旧 ACD-D04） | decision | high | PO | - | 2026-07-24 | 公開先を GitHub + GitHub Pages、変更提案の受付方法を GitHub issue / pull request として確定 | - |
| PJR-0122 | done | launch trackの振り返り | workflowの改善点を振り返りまとめる。 | note | medium | PO | 2026-07-31 | 2026-07-26 | 改善点を一通り反映 | [pjr-0122-review-launch](./pjr-0122-review-launch.md) |
| PJR-0123 | done | registerの個票の内容を見直し | idや基本情報を見直し | todo | medium | QE | 2026-07-31 | 2026-07-26 | 重複した記述や個票間での違いを修正 | - |
| PJR-0124 | done | human実行時のplan非生成とresultへの統合 | execution:humanはplanを読まないため、human時はplanを生成せずresultへ統合し、commitスコープをresult由来に切替える | todo | medium | ARC | 2026-07-31 | 2026-07-25 | human実行時のplan生成を廃止し、done_criteria確認をresultへ集約。commitスコープはhumanではresult frontmatterのtargets由来へ切替え（コミット0e0db54a） | [pjr-0124-human-plan-integrate-result](./pjr-0124-human-plan-integrate-result.md) |
| PJR-0125 | done | specdojo:pjr-todo-templateのH1プレースホルダ不整合を修正 | pjr-todo-template.mdのH1がTASK_TITLE表記で、register addの生成ロジック（TODO_TITLE）と不一致。todo個票のタイトルが未置換で残る。他type同様のTYPE_TITLE規約へ揃える | todo | medium | ARC | 2026-07-31 | 2026-07-24 | pjr-todo-template.mdのH1を_TODO_TITLE_へ修正。他type同様にタイトルが置換されることを確認 | - |
| PJR-0126 | done | PO承認をpull requestベースにする承認フロー整備 | decision起票のみでは証跡が弱いため、charter等のPO留保事項の承認をpull requestレビューで行う運用を整備する。対象範囲・branch保護/CODEOWNERS・承認証跡の書き戻しを検討 | todo | medium | PM | 2026-07-31 | 2026-07-26 | pull requestで承認する運用を明記 | [pjr-0126-pr-based-po-approval](./pjr-0126-pr-based-po-approval.md) |
| PJR-0127 | done | prj-overviewのプロジェクトWhyを明確化 | 後続文書の論点を安定させるため、対象者・課題・中心仮説・価値仮説・判断原則をプロジェクト概要の正本として明確化する | todo | high | BA | 2026-07-31 | 2026-07-26 | IDを付与してトレースを明確化 | [pjr-0127-clarify-project-why](./pjr-0127-clarify-project-why.md) |
| PJR-0128 | done | exec planへproject contextを伝播 | 全ての対象成果物生成でprj-overviewを参照できるよう、depends_onと分離したproject contextをexec planへ追加する | todo | high | ARC | 2026-07-31 | 2026-07-26 | project contextをtemplateに追加 | [pjr-0128-propagate-project-context](./pjr-0128-propagate-project-context.md) |
| PJR-0129 | done | Why-What-How作成原則をrecipeへ反映 | Why・What・How・Traceを章順ではなく論理の骨格として定義し、各成果物recipeへ重複なく適用する | todo | medium | ARC | 2026-07-31 | 2026-07-26 | specdojo:recipe-authoring-standardにWhy/What/How/Traceを論理の骨格として定義し、全16 recipeへ成果物固有の問いと委譲境界を反映（コミット67f8049d） | [pjr-0129-why-what-how-recipes](./pjr-0129-why-what-how-recipes.md) |
| PJR-0130 | done | Whyの明確性を既存review viewpointsへ反映 | 重複観点を増やさず、目的整合・業務価値・可読性の既存観点にWhyの判定基準と証拠を具体化する | todo | medium | QE | 2026-07-31 | 2026-07-26 | whyの明確性をreview viewpointsに反映 | [pjr-0130-clarify-why-review-viewpoints](./pjr-0130-clarify-why-review-viewpoints.md) |
| PJR-0131 | done | 簡潔な文書作成の共通原則をdocumentation policyへ追加 | 文書全体に適用する簡潔性・重複回避・正本参照・文章量の目安をdocumentation policyの共通原則として定義する | todo | medium | ARC | 2026-07-31 | 2026-07-26 | 簡潔な文書作成の共通原則を追加 | [pjr-0131-concise-documentation-policy](./pjr-0131-concise-documentation-policy.md) |
| PJR-0132 | done | 既存review viewpointで文書の冗長性を検出 | 新しい観点を重複追加せず、vp-ux-readabilityに反復・一般論・表と本文の重複・正本の過剰再掲を検出する基準を追加する | todo | medium | UX | 2026-07-31 | 2026-07-26 | review-viewpointsに反映 | [pjr-0132-detect-document-redundancy](./pjr-0132-detect-document-redundancy.md) |
| PJR-0133 | done | bootstrap後に成果物間の重複を整理する横断passを追加 | bootstrap完了後、refine前に成果物群を横断して正本を選択し、重複記述を要約と参照へ置き換える直列passを設ける | todo | high | ARC | 2026-07-31 | 2026-07-26 | 横断pass, dedup approachを追加 | [pjr-0133-cross-deliverable-dedup-pass](./pjr-0133-cross-deliverable-dedup-pass.md) |
| PJR-0134 | done | exec run --autoを連続worker pool化 | parallel実行でagentが完了するたびに空いた実行枠へ次のReady taskを投入できるようにする | todo | high | ARC | 2026-07-31 | 2026-07-26 | 連続worker pool方式へ変更 | [pjr-0134-exec-auto-worker-pool](./pjr-0134-exec-auto-worker-pool.md) |
| PJR-0135 | done | exec run --registerの複数ID直列実行 | 複数のPJR-IDを指定順に実行し、ID単位のcommit有無と失敗時の継続方針を選択できるようにする | todo | high | ARC | 2026-07-31 | 2026-07-25 | exec run --register を複数PJR-IDの指定順直列実行へ拡張し、ID単位commitと失敗時の停止・継続を選択可能にした | [pjr-0135-exec-register-multiple-ids](./pjr-0135-exec-register-multiple-ids.md) |
| PJR-0136 | done | agent利用制限後の自動再開 | 利用制限で継続できないtaskの再開可能時刻を記録し、定時routineから安全に再実行できるようにする | todo | high | ARC | 2026-07-31 | 2026-07-26 | 利用制限に達した場合にroutineで再開 | [pjr-0136-exec-limit-resume](./pjr-0136-exec-limit-resume.md) |
| PJR-0137 | done | pjr-indexの重複ID検知と再採番 | 並行作業でPJR-IDが重複しても検知できないため、schemaでID一意性を検証し、重複時に表・個票ファイル名・リンク・plan/resultのtargetsを一括更新するrenumberコマンドを追加する | todo | medium | ARC | 2026-07-31 | 2026-07-26 | PJR idの重複検知と再採番を追加 | [pjr-0137-register-id-uniqueness](./pjr-0137-register-id-uniqueness.md) |
| PJR-0138 | done | 起票を統合ブランチへ委譲するregister add | 作業worktreeを離れずにPJR-IDを予約できるよう、register addが統合ブランチのworktreeへ登録行だけを追記・commitするモードを追加し、表末尾の追記競合を解消する | todo | low | ARC | 2026-07-31 | 2026-07-26 | idの--reserveオプションを追加 | [pjr-0138-register-add-on-integration-branch](./pjr-0138-register-add-on-integration-branch.md) |
| PJR-0139 | done | 個票frontmatterのstatus遷移を自動化 | 個票のstatus遷移時期が規約に無くコマンドも更新しないため全件がdraftのまま残る。close/rejectで個票をready/deprecatedへ更新し、遷移基準をrulebookへ明記する | todo | medium | ARC | 2026-07-31 | 2026-07-26 | 個票frontmatterのstatus遷移をcloseで実行 | [pjr-0139-register-ticket-status-transition](./pjr-0139-register-ticket-status-transition.md) |
| PJR-0140 | done | register commitがhook整形差分と失敗残骸を取りこぼす | pathspec commitでhookの整形差分がindexに残り、次ID実行の開始前スナップショットに載って commit 対象から丸ごと除外される。失敗試行の残骸とrunner自身の状態遷移も同様に取りこぼす | issue | high | ARC | 2026-07-31 | 2026-07-26 | hook整形差分が出る場合は再度commitするように変更 | [pjr-0140-register-commit-missed-paths](./pjr-0140-register-commit-missed-paths.md) |
| PJR-0141 | done | guide/reference-content.schema.yamlを言語別に整備 | schemaを言語別に分けてチェックできるように変更（.remarkrc.yamlで設定） | todo | medium | ARC | 2026-07-31 | 2026-08-05 | content系schema（guide/reference/philosophy）をdocs/ja/specdojo/schemas/v1へ言語別に分離し、.remarkrc.yamlで言語別に適用済み。英語版schemaはdocs/en立ち上げ時に別途対応 | - |
| PJR-0142 | open | ドキュメント編集ガイドにVS Code拡張とSpecDojo拡張の説明を追加 | specdojo:docs-editing-guide に、必要な VS Code extension（Markdown All in One 等）と SpecDojo extension（tools/vscode-specdojo）の導入・設定・使い方を追記する | todo | low | ARC | 2026-08-31 | - | - | - |
| PJR-0143 | open | VS Code拡張のMarketplace登録 | tools/vscode-specdojo 拡張を Visual Studio Marketplace へ公開する（発行者登録・vsce publish・公開手順/CIの整備） | todo | medium | ARC | 2026-08-31 | - | - | - |
| PJR-0144 | open | fmt-md-table を VS Code 拡張へ統合 | 現在 .vscode/tasks.json のタスク（Format Markdown Table）として提供している fmt-md-table を vscode-specdojo 拡張のコマンドとして統合する | todo | medium | ARC | 2026-08-31 | - | - | - |
| PJR-0145 | open | README.md / docs/index.md / docs/`<lang>`/index.md の責務再整理と記述見直し | READMEおよびdocs配下のindex.mdの役割分担を再整理し、記述内容を見直す | todo | medium | PO | 2026-08-31 | - | - | - |
| PJR-0146 | done | 履歴蓄積ファイル（plan/result/pjr-NNNN-`<topic>`等）はMarkdownリンクを禁止し[[id]]/パス表記に統一するルール化 | plan/result/pjr-NNNN-`<topic>`等の履歴として蓄積されるファイルは、リンク先のファイル名変更時に修正が発生してしまうため、Markdownリンク`[]()`を使わず、docs/配下の参照は`[[id]]`、docs/外の参照・外部URLはパス表記/URLのままとするルールを定め、関連する記述ルール文書（例: markdown.instructions.md等）へ反映する | todo | medium | ARC | 2026-08-31 | 2026-08-05 | 履歴蓄積ファイル(plan/result/個票)のMarkdownリンク禁止・[[id]]/パス表記統一ルールをmarkdown.instructions.mdへ追加し、検知CLI(validate-history-links)とunit testを実装、npm run checkへ組み込み。既存違反0件のため一括遡及移行は不要 | [pjr-0146-forbid-links-in-history-files](./pjr-0146-forbid-links-in-history-files.md) |
| PJR-0147 | open | 実装先行（コード先行）時に設計書/仕様書/要件書へ反映・新設するapproachの整備 | 実装が既に存在するにもかかわらず対応する設計書/仕様書/要件書が未整備、または内容が乖離している場合に、実装内容を既存文書へ反映するか、文書が存在しない場合は新設するための判断基準・手順（approach）を策定する | todo | medium | ARC | 2026-08-31 | - | - | [pjr-0147-retrofit-design-docs-for-existing-implementation](./pjr-0147-retrofit-design-docs-for-existing-implementation.md) |
| PJR-0148 | open | docs/外への[[id]]（wikilink）解決範囲拡張の要否検討 | 現状specdojo index buildの走査対象はdocs/配下のみで、.github/instructions/やREADME.md等docs/外のファイルは[[id]]で参照できない。docs/外への[[id]]解決範囲拡張が必要かどうかを、走査対象拡大に伴う除外ロジック変更・frontmatter契約の非互換・ID衝突リスク等を踏まえて検討する | todo | low | ARC | 2026-09-30 | - | - | [pjr-0148-extend-wikilink-id-resolution-beyond-docs-scope](./pjr-0148-extend-wikilink-id-resolution-beyond-docs-scope.md) |
| PJR-0149 | open | 各プロジェクトにダッシュボードページを追加（schedule進捗・register状況・routine実行状況の一覧化） | 現状はschedule進捗(timeline.md)、register登録/消化状況(pjr-index.md/pjr-views.md)、routine実行状況(specdojo routine list等CLI出力のみ)を個別に確認する必要があり、一目で把握できるページがない。schedule進捗・register登録/消化状況・routine実行状況を一覧できるダッシュボードページを各プロジェクトに追加し、VitePressサイドバーの各プロジェクトメニューから導線を張る | todo | medium | ARC | 2026-08-31 | - | - | [pjr-0149-project-dashboard-page](./pjr-0149-project-dashboard-page.md) |
| PJR-0150 | done | pm-members.yaml のnicknameスキーマ検証欠落によるcommand_templateインジェクションリスクの解消 | pm-members.schema.yamlはnicknameに安全な文字パターン`^[a-z0-9][a-z0-9_-]{0,62}$`を定義しているが、loadMemberRoster(src/specdojo-config.ts)はyaml.loadのみで検証せず、package.jsonのvalidate:schema集約にもpm-members.schema.yamlが含まれていない。resolveMemberCommand(src/exec-agent-config.ts)はnicknameをcommand_templateへ無エスケープでプレースホルダ展開しshell:trueで実行するため、pm-members.yamlの書き換え権限があればコマンドインジェクションが可能。validate:schemaへのpm-members追加と、resolveMemberCommand側での再検証を行う | todo | medium | ARC | 2026-08-31 | 2026-08-02 | resolveMemberCommandにnickname再検証を追加し多層防御を実装。validate:schemaへpm-members追加済み。specdojo:exec-config-guideへ反映済み | [pjr-0150-pm-members-nickname-schema-validation-gap](./pjr-0150-pm-members-nickname-schema-validation-gap.md) |
| PJR-0151 | open | specdojo index buildの重複ID「あと勝ち」をエラー検知に変更 | src/doc-index.tsのID登録処理(scanFile/collectFromFields)は既存キーの存在チェックをせず、Markdown/YAML/ネストIDいずれも無条件上書き(あと勝ち)になっている。同一Unit内の重複IDをエラーにし、衝突したIDと全ファイルパスを表示し、Markdown/YAML/ネストIDを同じ基準で検証し、specdojo index buildと総合validateの両方で失敗させるようにする。あわせて多言語文書(docs/en等)を言語別インデックスにするか同一論理IDの言語variantとして扱うかを決定する | todo | medium | ARC | 2026-08-31 | - | - | [pjr-0151-index-build-duplicate-id-error-detection](./pjr-0151-index-build-duplicate-id-error-detection.md) |
| PJR-0152 | done | 未エスケープの山括弧プレースホルダ（`<lang>`等）を検知するlintルールの追加 | markdown.instructions.mdは山括弧付きプレースホルダをインラインコードで囲むことを必須としているが、機械的な検知手段がない。MD033(インラインHTML禁止)は`<br>`や`<details>`等の正規HTML利用と衝突するため有効化できない。実在HTMLタグ名の許可リストを用いたカスタムルールを、既存のremarkプラグイン基盤(tools/docs/src配下、.remarkrc.yaml、lint:fm)またはmarkdownlintのcustomRulesに追加し、docs:build失敗(Vueコンパイラのタグ未クローズエラー)を未然に防ぐ | todo | medium | ARC | 2026-08-31 | 2026-08-05 | 未エスケープ山括弧プレースホルダ検知のremarkプラグイン(remark-no-unescaped-angle-placeholder)を実装しroot .remarkrc.yamlへ配線。HTMLタグ許可リストで正規HTML(br/details等)を非検知、`<lang>`/`<topic>`等を検知。unit test10件・全docs誤検知ゼロ・npm run check通過を確認 | [pjr-0152-lint-unescaped-angle-bracket-placeholder](./pjr-0152-lint-unescaped-angle-bracket-placeholder.md) |
| PJR-0153 | rejected | dct.schema.yaml: done_criteria のデフォルト指定(group/top)を可能にする | done_criteria を local_id 単位だけでなく、group 単位およびトップレベルでデフォルトとして指定できるようにスキーマを拡張する。 | todo | medium | ARC | 2026-08-31 | 2026-08-04 | 既存dctは全件で成果物ごとにdone_criteriaを個別記述しており、group/topレベルの共通デフォルトは設計方針（成果物内容に即した検証可能な条件）と逆行するため見送り。dct-data-flow.yaml側の重複はdone_criteriaの個別化で解消済み | [pjr-0153-dct-schema-yaml-done-criteria-group-top](./pjr-0153-dct-schema-yaml-done-criteria-group-top.md) |
| PJR-0154 | decided | シビックテックサービスの運用設計（090-operationsドメイン）の対応時期を決定 | 運用設計について、prj-0001での対応方針を決定する | decision | medium | PO | 2026-08-31 | 2026-08-04 | シビックテックサービスの運用設計（090-operations相当）はprj-0001の対象外とし、代表試行（SC-01〜SC-03）確認後の後続プロジェクトで検討する | [pjr-0154-operations-domain-timing](./pjr-0154-operations-domain-timing.md) |
| PJR-0155 | in-progress | dctカタログの1 domain複数ファイル分割（物理分割）対応 | domain一意制約を緩和し、同一domainの複数dctファイルをbuild時にマージ可能にする | todo | medium | ARC | 2026-08-31 | - | - | [pjr-0155-dct-domain-multifile](./pjr-0155-dct-domain-multifile.md) |

## 2. 派生ビュー

以下のファイルは、プロジェクト登録簿から生成される補助一覧です。
正本は `pjr-index.md` と各 `pjr-XXXX-<topic>.md` とし、派生ビューは正本の内容に従属します。

### 2.1. 登録簿内の補助一覧

- [[pjr-views|台帳ビュー（状態別・優先度別・担当者別）]]

### 2.2. controls 全体の派生管理ビュー

- [[pm-risk-register|リスク登録簿]]
- [[pm-issue-log|課題ログ]]
- [[pm-change-request-log|変更要求ログ]]
- [[pm-decision-log|決定記録]]
