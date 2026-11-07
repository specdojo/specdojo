---
specdojo:
  id: prj-0001:xrp-t-data-flow-cdfd-routine-090
  type: exec-plan
  rulebook: none
  task_id: T-DATA-FLOW-cdfd-routine-090
  name: 完成版レビュー
  mode: review
  status: ready
  project_id: prj-0001
  owner: BA
  on_critical_path: true
  approach: fully-guided
  targets:
    - prj-0001:cdfd-routine
---

# Review Plan: T-DATA-FLOW-cdfd-routine-090

## 1. このフェーズで行うこと

完成版の CDFD を変更せず、DCT の evidence_refs が示す現在動作、既存成果物・決定記録・
プロジェクト文脈が示す意図された仕様、および done_criteria を照合する。cdfd-overview は
領域粒度、領域間フロー、領域別 CDFD への分割を確認し、領域別 cdfd-<area> はプロセス粒度、
正常系・主要例外、担当と入出力の追跡性を確認する。実装との一致・乖離・未確認範囲を判定し、
根拠と修正対象候補を review result に記録する。

## 2. 対象成果物

- `name`: 概念データフロー図（定期実行）
- `depends_on`:
  - [[prj-0001:cdfd-register-operation]]
  - [[prj-0001:cdfd-task-execution]]
- `overview`: routine定義とdue判定に基づき、既存の登録項目・Scheduleタスク、順次実行cycle、またはJobから生成した実行単位を起動し結果を反映する流れを可視化し定義する
- `path`: `docs/ja/product/010-business-specs/010-data-flow/cdfd-routine.md`
- `rulebook`: `docs/ja/specdojo/rulebooks/cdfd-rulebook.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-cdfd-routine-090-result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. レビュー観点

<!-- markdownlint-disable MD055 MD056 -->

<!-- prettier-ignore-start -->
| ID  | ロール | viewpoint_id | 確認基準 |
| --- | ------ | ------------ | -------- |
| RVP-001 | BA | vp-ba-business-value | routine定義の選択・due判定・register/schedule実行への委譲、resumeから状態再計算・autoへ進むexec-cycleに加え、Job Run生成を伴う反復作業との境界・実行結果更新の流れが表と図で確認できること |
| RVP-002 | ARC | vp-arc-technical-constraints | rtn-*.yamlのaction kind・filter・interval・limit、個票Frontmatterを正本とするregister対象選択、exec-cycleのstrategy・parallel・loop、Job連携時のcron・timezone・missed/overlap policyと、委譲先へ渡す入力および返却される結果が識別できること |
| RVP-003 | QE | vp-qe-omissions-consistency | projectがbusyの場合、対象なし・利用制限・cycleのstep別失敗・再開時刻待ち・重複Job Run・取りこぼしの場合に、last_run・last_resultと次回判定がどのように記録されるか確認できること |
<!-- prettier-ignore-end -->

<!-- markdownlint-enable MD055 MD056 -->

### RVP-001（BA: vp-ba-business-value）

**確認基準**: routine定義の選択・due判定・register/schedule実行への委譲、resumeから状態再計算・autoへ進むexec-cycleに加え、Job Run生成を伴う反復作業との境界・実行結果更新の流れが表と図で確認できること

**coverage_required:**

- business_goal: 業務目的、課題、期待効果、成功条件との対応が説明できるか。
- traceability: 上位目的から要求、要件、仕様、設計、テスト、運用までの対応を追跡できるか。

**チェック観点:** 業務価値を定義・展開する成果物で、主要な定義・判断がどの対象者のどの業務課題・期待価値に応えるかを説明でき、主要な成果・方針がその目的に対応しているか。構造・設定中心の成果物では、上位目的への参照と下流利用の整合を確認し、業務上の Why の詳細な再掲を要求しない。

**エビデンス例:** 対象者、業務課題、放置時の影響、期待価値・効果、成功基準、判断理由、主要な成果・方針との対応、上位文書への参照。

### RVP-002（ARC: vp-arc-technical-constraints）

**確認基準**: rtn-\*.yamlのaction kind・filter・interval・limit、個票Frontmatterを正本とするregister対象選択、exec-cycleのstrategy・parallel・loop、Job連携時のcron・timezone・missed/overlap policyと、委譲先へ渡す入力および返却される結果が識別できること

**coverage_required:**

- scope_boundary: 対象範囲、対象外、前提、制約、依存関係が判断できるか。
- data: 入力、出力、データ項目、保持、更新、削除、整合性の扱いが確認できるか。
- integration: 外部システム、API、ファイル、通知、手動連携などの依存が識別されているか。
- non_functional: 性能、可用性、セキュリティ、保守性、拡張性、互換性などの品質要求が確認できるか。

**チェック観点:** 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。

**エビデンス例:** 技術制約、外部依存、schema、validate 手順、構成方針。

### RVP-003（QE: vp-qe-omissions-consistency）

**確認基準**: projectがbusyの場合、対象なし・利用制限・cycleのstep別失敗・再開時刻待ち・重複Job Run・取りこぼしの場合に、last_run・last_resultと次回判定がどのように記録されるか確認できること

**チェック観点:** 必須章、必須キー、参照、責務、禁止事項に抜け漏れや矛盾がないか。

**エビデンス例:** rulebook、schema、関連文書、禁止事項、レビュー履歴。

owner ロールの観点は、成果物がその責務を果たしているかを確認する。owner 以外のロールの観点は、その文書から各ロールが自分の責務の成果物を作成できるかという入力適合性の最低限の確認とし、各ロールの内容まで踏み込む過剰な再レビューはしない（一文書一責務）。

## 4. 進め方

対象成果物に紐づく rulebook / recipe / sample / template は、いずれも指定されたファイルを実際に読み込んだうえで、次の役割に沿って確認の基準にする。読み込まずに記憶や推測で代替しない。レビューでは成果物を組み立てるのではなく、成果物が基準を満たすかを照合する。

参照ファイル（rulebook frontmatter から解決。`_MISSING_` の項目は未宣言・未整備のため「実践の型が存在しない・内容が薄い場合」に従う）:

- rulebook: `docs/ja/specdojo/rulebooks/cdfd-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/cdfd-recipe.md`
- sample: `docs/ja/specdojo/samples/cdfd-sample.md`
- template: `docs/ja/specdojo/templates/cdfd-template.md`

1. rulebook: 指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. recipe: 指定された recipe を読み込み、示された問い・観点に対して成果物の内容が十分かを確認する。
3. sample: 指定された sample を読み込み、粒度・文体・表現・表の書き方と整合しているかを確認する。
4. template: 指定された template を読み込み、章構成と整合しているか、_TODO_ などのプレースホルダが残っていないかを確認する。

複数の文書間で記述に矛盾がある場合は rulebook を正として判定する（template の章構成が rulebook と食い違う場合も rulebook を正とする）。

参照してよい文書は、この plan に記載されたものに限定する。具体的には、本セクションの rulebook / recipe / sample / template、`対象成果物` セクションの `depends_on` 成果物、プロジェクトコンテキストである。クロス文書整合を確認するレビュー観点では、`depends_on` 成果物を実際に読み込み、対象成果物と突き合わせて整合を判定する。目的整合の判断ではプロジェクトコンテキストを参照する。plan に列挙されていない他のプロジェクト文書を独自に探索・参照しない。レビューの判定は plan に記載された資料とこの plan 自身の記述（フェーズ説明・レビュー観点）だけを根拠に行い、不足があっても未記載の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず、該当レビュー観点を unclear とし理由を残す。

本タスクの実行に必要な fully-guided の確認方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や edit への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 4.1. 実践の型が存在しない・内容が薄い場合

- 指定された rulebook / recipe / sample / template のいずれかが存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を review result の `実践の型との整合確認` セクションに記録する。
- 欠落を理由にレビュー観点を unclear のまま放置しない。存在する他の実践の型と `depends_on` 成果物・プロジェクト文脈を基準にして判定根拠を補う。
- template が欠落する場合は、rulebook の構造を骨組みとして整合を確認する。
- 実践の型そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、findings または申し送りに残す。

### 4.2. 判断根拠の記録

確認した文書・確認しなかった文書と、その判断根拠を review result に残す。記録先は次のとおり。

- レビュー観点ごとの pass / fail / unclear 判定と根拠: review result の `レビュー観点別結果` セクション（各 `RVP-NNN`）。
- 参照した rulebook / recipe / sample / template の使い分け、矛盾時に rulebook を正とした箇所、欠落・薄い実践の型の扱い: review result の `実践の型との整合確認` セクション。
- 検出した問題点・指摘事項: review result の `findings` セクション。

## 5. 完了手順

1. レビュー観点ごとに pass / fail / unclear を判定し、根拠を記入する。
2. result の各レビュー観点セクションに記入する。result には各 RVP の `### RVP-NNN（ロール: viewpoint_id）` と `確認基準` が展開済みなので、`result` / `evidence` / `notes` を埋める。レビュー結果の記入はタスク完了に必須であり、未記入のまま終了しない（詳細は共通規約を参照）。
3. `evidence` の参照は `[[id]]` 形式（Obsidian wikilink）で記載する。行番号アンカー（`#L12-L18` など）や絶対パスは使わない。位置の補足が必要な場合は `evidence` 本文で述べる。
4. fail / unclear、または recommendation が revise / reject でも、レビュー結果を記録できた場合は正常終了する（終了コード 0）。

## 6. 異常終了の条件

- 対象ファイル不明・依存未解決・result 更新不能など、レビュー自体を完了できない場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `review-blocked: <reason>; criterion=<id>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

この規約は、生成される全 exec plan に共通で適用される。result の完了条件、他文書を参照する際のリンク記法、成果物の状態（status）の扱いを統一する。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 成果物に変更が不要と判断した場合でも、result の記入は省略しない。変更不要と判断した理由と根拠を result に記入してから完了する。
- result が未記入・プレースホルダのまま終了コード 0 で終了すると、runner は成果物未完了（block）として扱い、タスクはやり直しになる。完了前に result の記入漏れがないことを必ず確認する。
- result の frontmatter は scaffold 済みの構造を正本とする。`id` / `task_id` / `mode` / `project_id` / `plan_ref` / `agent` / `execution` / `approach` / `targets` はキーの追加・削除・改名をせず、scaffold された値のまま維持する。見出し構成（`# Edit Result` などの H1、`## 1.` 以降の章立て）も独自の構成に置き換えない。埋めるのは本文セクションの `_TODO_` プレースホルダの中身だけである。`status` と `completed_at` は完了処理（runner 側）が更新するため、自分で書き換えない。
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
