---
specdojo:
  id: prj-0001:xep-t-data-flow-data-flow-dedup-060
  type: exec-plan
  rulebook: none
  task_id: T-DATA-FLOW-data-flow-dedup-060
  name: CDFD間の正本選択・重複整理
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  on_critical_path: true
  approach: cross-deliverable-dedup
  targets:
    - prj-0001:cdfd-overview
    - prj-0001:cdfd-init
    - prj-0001:cdfd-register-operation
    - prj-0001:cdfd-catalog-planning
    - prj-0001:cdfd-task-execution
    - prj-0001:cdfd-routine
    - prj-0001:cdfd-multi-project
    - prj-0001:cdfd-agent-config-operation
    - prj-0001:cdfd-derived-content
    - prj-0001:cdfd-reporting
---

# Cross-deliverable Dedup Plan: T-DATA-FLOW-data-flow-dedup-060

## 1. このフェーズで行うこと

全 CDFD を横断し、同じプロセス・状態遷移・入力・出力・データストアの説明が
複数文書へ重複していないか確認する。各情報の正本を選び、他の文書は必要な要約と参照へ整理する。
各 CDFD の固有責務と done_criteria は維持し、領域間の受け渡しと用語を統一する。

bootstrap 完了後の成果物群を一度だけ横断し、各論点の正本を選択する。正本へ詳細を集約し、他文書の重複記述を、単独可読性に必要な短い要約と正本への参照へ置き換える。

## 2. 対象成果物

frontmatter の `targets` と以下の一覧が、このタスクで変更できる全成果物である。対象外ファイルは変更しない。

### prj-0001:cdfd-overview

- document: [[prj-0001:cdfd-overview]]
- name: 概念データフロー図（全体概要）
- path: `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- overview: SpecDojoを用いたプロジェクト推進とオペレーション推進について、主要プロセス領域の関係と情報・イベントの流れを可視化し定義する
- depends_on: -
- done_criteria:
  - [BA / vp-ba-business-value] 初期セットアップ・登録簿運用・計画展開・タスク実行・定期運用・並行運用・構成変更・派生生成・報告の各プロセス領域と相互の情報の流れが表と図で確認できること
  - [PO / vp-po-purpose-alignment] 対象とするプロセス領域、および独立した業務フローに含めない補助操作の境界を承認できること
  - [ARC / vp-arc-technical-constraints] 各領域の起点イベント・主要入力・主要出力・データストアが識別でき、領域別CDFDの構成方針として参照できること
  - [QE / vp-qe-omissions-consistency] 領域別CDFDへの分割に重複または欠落がないことを、全体図との対応で確認できること

### prj-0001:cdfd-init

- document: [[prj-0001:cdfd-init]]
- name: 概念データフロー図（初期セットアップ）
- path: `docs/ja/product/010-business-specs/010-data-flow/cdfd-init.md`
- overview: config・register・catalog・実行補助設定を初期化し、プロジェクトの計画と実行を開始できる状態にする流れを可視化し定義する
- depends_on:
  - [[prj-0001:cdfd-overview]]
- done_criteria:
  - [BA / vp-ba-business-value] config init・register scaffold・catalog scaffoldと、必要に応じたexec scaffoldの起動条件・入力・生成物が表と図で確認できること
  - [PO / vp-po-purpose-alignment] 必須の初期化と任意のprovider・実行補助設定の境界を承認できること
  - [ARC / vp-arc-technical-constraints] 初期化対象ごとの正本ファイル、生成先、後続プロセスへの引き渡しが識別できること
  - [QE / vp-qe-omissions-consistency] 既存ファイルがある場合、設定が不足する場合、生成に失敗した場合の分岐が確認できること

### prj-0001:cdfd-register-operation

- document: [[prj-0001:cdfd-register-operation]]
- name: 概念データフロー図（登録簿ライフサイクル）
- path: `docs/ja/product/010-business-specs/010-data-flow/cdfd-register-operation.md`
- overview: 立ち上げ時の未整理事項と運用中の計画外事項を個票へ登録し、判断・実行・待機・レビュー・承認・終了・再開、派生ビュー生成・履歴確認と例外復旧まで継続管理する流れを可視化し定義する
- depends_on:
  - [[prj-0001:cdfd-init]]
- done_criteria:
  - [BA / vp-ba-requirements-completeness] todo・question・risk・issue・change-request・decision・noteの登録判断と、scheduleで管理する計画済み作業との境界が表と図で確認できること
  - [ARC / vp-arc-technical-constraints] 個票Frontmatterを正本としてopen・in-progress・waiting・review・done/decided・rejected・deferredを遷移し、登録日・完了日・結論、生成一覧・派生ビューおよびregister historyへ反映する流れが識別できること
  - [QE / vp-qe-omissions-consistency] agent実行の成功時・失敗時の遷移、個票の重複IDまたはファイル名と文書IDの不整合の検出、renumberによる個票・参照・実行記録の復旧、およびworktreeの同期・統合失敗時の例外経路が確認できること
  - [PO / vp-po-decision-readiness] type別の承認者とreviewからclose・reject・defer・waitへの遷移、commit承認とPR承認の適用境界、および留保・却下・延期・再開の判断に必要な情報が識別できること

### prj-0001:cdfd-catalog-planning

- document: [[prj-0001:cdfd-catalog-planning]]
- name: 概念データフロー図（カタログ〜計画展開）
- path: `docs/ja/product/010-business-specs/010-data-flow/cdfd-catalog-planning.md`
- overview: 成果物カタログとスケジュール戦略を検証し、Scheduleと実行状態・Ready・CPM・timelineへ展開する流れを可視化し定義する
- depends_on:
  - [[prj-0001:cdfd-init]]
- done_criteria:
  - [BA / vp-ba-business-value] カタログと戦略の準備からcatalog validate・schedule build・exec refreshを経て計画情報を利用可能にする流れが表と図で確認できること
  - [ARC / vp-arc-technical-constraints] dct・strategy・schedule・eventからstate・Ready・CPM・timelineへ至る入力、出力、依存関係が識別できること
  - [QE / vp-qe-verifiability] カタログ検証失敗・戦略不足・依存解決失敗により計画展開を停止するゲートが判定可能な形で確認できること

### prj-0001:cdfd-task-execution

- document: [[prj-0001:cdfd-task-execution]]
- name: 概念データフロー図（タスク実行ライフサイクル）
- path: `docs/ja/product/010-business-specs/010-data-flow/cdfd-task-execution.md`
- overview: Readyタスクの選択・claimからhuman/agentによる実行、レビュー・ready確定、完了記録、中断・訂正・再実行までの流れを可視化し定義する
- depends_on:
  - [[prj-0001:cdfd-catalog-planning]]
- done_criteria:
  - [BA / vp-ba-business-value] Ready選択・claim・plan/result生成・実行・レビュー・finalize・completeの正常経路が、担当と入出力を含めて表と図で確認できること
  - [ARC / vp-arc-technical-constraints] human/agent、in-place/worktree、単発/自動/並列の実行経路、登録済みnicknameによるagent選択と、各経路で更新される成果物・event・resultが識別できること
  - [QE / vp-qe-omissions-consistency] project実行中のskip/wait/fail、blockedからのunblock/release、todoからのcancel、doneからのreopen、レートリミット後のresume --due、worktreeの依存導入・統合失敗の分岐が確認できること
  - [PO / vp-po-decision-readiness] ready確定、差し戻し、前提不足時のPJR登録とPO判断に必要な情報が識別できること

### prj-0001:cdfd-routine

- document: [[prj-0001:cdfd-routine]]
- name: 概念データフロー図（定期実行）
- path: `docs/ja/product/010-business-specs/010-data-flow/cdfd-routine.md`
- overview: routine定義とdue判定に基づき、既存の登録項目・Scheduleタスク、順次実行cycle、またはJobから生成した実行単位を起動し結果を反映する流れを可視化し定義する
- depends_on:
  - [[prj-0001:cdfd-register-operation]]
  - [[prj-0001:cdfd-task-execution]]
- done_criteria:
  - [BA / vp-ba-business-value] routine定義の選択・due判定・register/schedule実行への委譲、resumeから状態再計算・autoへ進むexec-cycleに加え、Job Run生成を伴う反復作業との境界・実行結果更新の流れが表と図で確認できること
  - [ARC / vp-arc-technical-constraints] rtn-\*.yamlのaction kind・filter・interval・limit、個票Frontmatterを正本とするregister対象選択、exec-cycleのstrategy・parallel・loop、Job連携時のcron・timezone・missed/overlap policyと、委譲先へ渡す入力および返却される結果が識別できること
  - [QE / vp-qe-omissions-consistency] projectがbusyの場合、対象なし・利用制限・cycleのstep別失敗・再開時刻待ち・重複Job Run・取りこぼしの場合に、last_run・last_resultと次回判定がどのように記録されるか確認できること

### prj-0001:cdfd-multi-project

- document: [[prj-0001:cdfd-multi-project]]
- name: 概念データフロー図（複数プロジェクト・ブランチ並行運用）
- path: `docs/ja/product/010-business-specs/010-data-flow/cdfd-multi-project.md`
- overview: project develop・feature・execの各ブランチとworktreeを用いて複数プロジェクト・タスクを分離し、同期・統合する流れを可視化し定義する
- depends_on:
  - [[prj-0001:cdfd-init]]
- done_criteria:
  - [BA / vp-ba-business-value] project develop・feature・execの作成、作業、同期、統合、後片付けの各プロセスと担当が表と図で確認できること
  - [ARC / vp-arc-technical-constraints] 各ブランチ・worktreeが読み書きするプロジェクト成果物、実行記録、commitと統合方向が識別できること
  - [QE / vp-qe-omissions-consistency] ID競合・merge競合・同期失敗・未commit変更がある場合の停止条件と復旧経路が確認できること

### prj-0001:cdfd-agent-config-operation

- document: [[prj-0001:cdfd-agent-config-operation]]
- name: 概念データフロー図（agent・provider構成の運用変更）
- path: `docs/ja/product/010-business-specs/010-data-flow/cdfd-agent-config-operation.md`
- overview: 作業要件と実行結果に応じてagent・provider・phaseの構成を評価し、承認・変更・検証する流れを可視化し定義する
- depends_on:
  - [[prj-0001:cdfd-task-execution]]
- done_criteria:
  - [BA / vp-ba-requirements-completeness] 作業要件または実行上の問題を起点として、構成案作成・権限確認・承認・設定変更・検証へ進む流れが表と図で確認できること
  - [ARC / vp-arc-cross-document-consistency] pm-members.yaml・exec-defaults.yaml・provider設定・sch-strategyの変更責務と相互参照が識別できること
  - [PO / vp-po-decision-readiness] agent・providerの権限範囲、認証情報を設定文書から分離する境界、プロンプトインジェクション対策を承認できること
  - [QE / vp-qe-omissions-consistency] capability不足・provider利用不能・設定不整合・権限超過を検知した場合の差し戻し経路が確認できること

### prj-0001:cdfd-derived-content

- document: [[prj-0001:cdfd-derived-content]]
- name: 概念データフロー図（成果物・派生ビュー・索引生成）
- path: `docs/ja/product/010-business-specs/010-data-flow/cdfd-derived-content.md`
- overview: カタログ・登録簿・実行状態などの正本から、成果物本体・表示ビュー・YAML表示ページ・文書索引を生成し同期する流れを可視化し定義する
- depends_on:
  - [[prj-0001:cdfd-register-operation]]
  - [[prj-0001:cdfd-catalog-planning]]
  - [[prj-0001:cdfd-task-execution]]
- done_criteria:
  - [BA / vp-ba-business-value] deliverable scaffold・catalog build・register build・exec refresh・yaml-pages build・index buildと一括build/watchの役割および起動関係が表と図で確認できること
  - [ARC / vp-arc-technical-constraints] 個票Frontmatterから生成する登録項目一覧・状態別・優先度別・担当者別ビューを含め、各正本と生成先の対応、直接編集してはならない派生成果物、再生成時の上書き境界が識別できること
  - [QE / vp-qe-verifiability] 正本不足・検証失敗・部分生成失敗・生成物の陳腐化を検知した場合の停止条件と再実行経路が確認できること

### prj-0001:cdfd-reporting

- document: [[prj-0001:cdfd-reporting]]
- name: 概念データフロー図（進捗監視・報告・ログ管理）
- path: `docs/ja/product/010-business-specs/010-data-flow/cdfd-reporting.md`
- overview: 実行状態・CPM・マイルストーン・登録簿を監視し、遅延や滞留を検知して進捗報告・議事録・管理ログへ反映する流れを可視化し定義する
- depends_on:
  - [[prj-0001:cdfd-register-operation]]
  - [[prj-0001:cdfd-task-execution]]
  - [[prj-0001:cdfd-derived-content]]
- done_criteria:
  - [BA / vp-ba-business-value] Ready・CPM・マイルストーン・blocked/doing・登録項目を確認し、遅延や滞留への対応と報告へつなげる流れが表と図で確認できること
  - [PM / vp-pm-dependency-risk] 遅延・滞留の検知条件、エスカレーション先、進捗報告・議事録を作成する契機が計画運用に使える粒度で定義されていること
  - [ARC / vp-arc-cross-document-consistency] 人が作成する進捗報告・議事録と、register buildで生成する登録項目一覧・課題・リスク・変更要求・決定ログ、およびregister historyで再構成する監査履歴の入力と更新責務が識別できること
  - [QE / vp-qe-omissions-consistency] 更新漏れ・古い生成ビュー・未報告の遅延・未転記の決定事項を検知する確認経路が識別できること

- `result`: `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-data-flow-dedup-060-result.md`

## 3. 進め方

1. 対象成果物をすべて読み、同じ事実・判断・理由・手順を詳述している重複候補を論点単位で抽出する。文字列一致や長さだけで重複と判定しない。
2. 文書の責務、成果物カタログの `overview` / `done_criteria`、既存の `based_on` / `depends_on`、下流からの参照方向を基準に、各論点の正本を一つ選ぶ。
3. 正本に、論点の結論・判断理由・制約・例外・必要な追跡情報を集約する。既存の正しい固有記述は尊重し、全面的に書き直さない。
4. 他文書では、単独で責務を理解するための短い要約を残し、詳細を正本への `[[id|title]]` 参照へ置き換える。参照先が存在することを確認する。
5. 対象成果物ごとに `done_criteria`、文書固有の観点、rulebook / schema の必須情報、`based_on` / `depends_on` とトレーサビリティが維持されていることを確認する。不足や矛盾は憶測で埋めず、_TODO_ / _ASSUMPTION_ として根拠と次の行動を残す。

短さ自体を目的にしない。背景、判断理由、例外、制約、成果物固有の責務、単独可読性に必要な要約は保持する。review viewpoint は後続 review で重複の再発を検出するために使い、この pass は検出済みの重複を実際に修正する。

## 4. result への記録

result には、次を論点と文書が追跡できる粒度で記録する。

- 詳細を集約・変更した正本文書と論点
- 要約・参照へ置き換えた文書、置換前の重複論点、参照先
- 意図的に残した重複、その文書固有の必要性
- `done_criteria`、トレーサビリティ、文書責務、`based_on` / `depends_on` を確認した結果

## 5. 完了手順

1. 「進め方」に従って対象成果物だけを更新する。
2. 対象成果物ごとの必須情報と追跡性が維持されていることを確認する。
3. 共通規約に従って、必要な整形・静的検査を実行する。
4. result の必須セクションを実際の内容で埋め、_TODO_ を残さない。

## 6. 異常終了の条件

- 対象不足・正本を選べない重大な矛盾・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

この規約は、生成される全 exec plan に共通で適用される。result の完了条件、他文書を参照する際のリンク記法、成果物の状態（status）の扱いを統一する。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 成果物に変更が不要と判断した場合でも、result の記入は省略しない。変更不要と判断した理由と根拠を result に記入してから完了する。
- result が未記入・プレースホルダのまま終了コード 0 で終了すると、runner は成果物未完了（block）として扱い、タスクはやり直しになる。完了前に result の記入漏れがないことを必ず確認する。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- plan に「プロジェクトコンテキスト」章がある場合、そこに挙がる文書はプロジェクト共通の前提を読むための参照であり、成果物 frontmatter の `based_on` へ転記しない。参照して得た前提は本文の記述内容へ反映する。
- 成果物 frontmatter の `based_on` に書けるのは、その成果物の `depends_on` の推移閉包に含まれる先行成果物だけである。閉包外の ID を書くと `catalog validate` が「`based_on` が `depends_on` の推移閉包に含まれていません」としてエラーになり、コミットがブロックされる。`based_on` を増やす必要が生じた場合は、自分で転記せず、根拠不足として result に記録する。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 編集・書き込みが作業ディレクトリ外（`external_directory`）として拒否された場合、原因はパス指定の誤り（誤った絶対パス・ディレクトリ名の取り違え）である。bash の heredoc などへ回避的に切り替えず、相対パスに直したうえで同じ編集ツールで再実行する。
- 整形・静的検査は、この plan の完了手順または本共通規約で明示されたコマンドを実行する。変更対象に必要な test、build、schema 検証は、plan に個別記載がなくても実行してよい。対象を限定できる場合は対象限定の手順を優先し、プロジェクト標準または変更内容から全体 test / build が必要な場合は実行してよい。実行したコマンド・対象・結果は result に記録する。
- Markdown 成果物を編集した後は、`npx prettier --write <対象ファイル>` で整形し、`npx markdownlint <対象ファイル>` で静的検査を実施する。検査でエラーが出た場合は修正してから完了とする。
- 終了する前に、コミット時に実行される検査（pre-commit 相当）を先回りで実行し、失敗をすべて修正してから完了する。コミット時に初めて失敗が判明すると commit がブロックされ、成果物の内容が完成していてもタスクは block になる。
- 実行対象は、変更したファイルの種別で判断する。下表のうち、変更したファイルが該当する行の検査をすべて実行する。該当行がない場合は追加の検査は不要である。
- 検査コマンドの正本はリポジトリの hook 設定（`lefthook.yml` など）である。下表と設定が食い違う場合は設定側に合わせ、実行したコマンドと結果を result に記録する。`specdojo` コマンドは、リポジトリで定められた起動方法（`npx tsx src/specdojo.ts <subcommand>` など）で実行する。

| 変更したファイル                                                   | 実行する検査                                                             |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `*.md`                                                             | `npx prettier --write <対象ファイル>`、`npx markdownlint <対象ファイル>` |
| `*.ts` / `*.js` / `*.json` / `*.yaml` / `*.yml`                    | `npx prettier --write <対象ファイル>`                                    |
| `src/`、`tests/`、`scripts/`、`tools/`、`tsconfig*.json`           | `npm run typecheck`                                                      |
| `src/`、`tests/`、`docs/ja/specdojo/templates/`、`vitest.config.*` | `npm test`                                                               |
| `docs/ja/projects/` 配下                                           | `specdojo catalog validate`                                              |
| `dct-*.yaml`                                                       | `specdojo catalog build`                                                 |
| `pjr-index.md`                                                     | `specdojo register build`                                                |
| `sch-*.yaml`                                                       | `specdojo exec refresh`                                                  |
| `docs/` 配下                                                       | `specdojo index build`                                                   |
