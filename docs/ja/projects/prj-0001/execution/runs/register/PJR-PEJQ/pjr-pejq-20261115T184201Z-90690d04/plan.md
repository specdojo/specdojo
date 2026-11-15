---
specdojo:
  id: prj-0001:xep-pjr-pejq-20261115t184201z-90690d04
  type: exec-plan
  rulebook: none
  task_id: PJR-PEJQ
  name: "cdsd-execution を grade の指摘で手直しする（後回しの 4 つのデータストア）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
  approach: fully-guided
  targets:
    - cdsd-execution
---

# Edit Plan: PJR-PEJQ

## 1. このフェーズで行うこと

最新の grade の指摘を取り込み、4 つのデータストアと検証の基準を書く

## 2. 対象成果物

- `name`: 概念データストア定義（プロジェクト実行）
- `depends_on`:
  - `bdd-exec-event`（未作成）
  - `bdd-exec-state`（未作成）
  - `bdd-exec-plan-result`（未作成）
  - `bdd-exec-evidence`（未作成）
  - `bdd-worktree-branch`（未作成）
  - `bdd-routine-definition`（未作成）
  - `bdd-job-run`（未作成）
- `based_on`（対象成果物の frontmatter）: なし
- 個票の `入力`: 下記「個票の入力（前提）」を参照。
- `overview`: プロジェクト実行で扱うデータストア（実行イベント・状態、plan/result、worktree、定期処理、Job Run等）を一覧で定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/cdsd-execution.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-PEJQ/pjr-pejq-20261115T184201Z-90690d04/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/cdsd-rulebook.md`
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/cdsd-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[major/vp-po-purpose-alignment; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: ``成果物カタログ `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdsd.yaml` が対象とする実行状態、plan/result、evidence、worktree を追加するか、カタログ側のスコープを変更して目的と対象範囲を一致させる必要がある。``
- F002 \[major/vp-po-decision-readiness; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: `未収録の4領域について、追加の判断者、判断時期、既存設計への影響、次アクションを明記しないと承認または保留を判断できない。`
- F003 \[minor/vp-po-publication-accountability; line=25; anchor=`"| 実行 event       | task 状態遷移の正本                   | タスク実行           | 報告・監視では参照のみ行い、状態訂正はタスク実行へ委譲する                                | task owner、PM     |"`; cause=document\]: `` `ready` 化または公開時の対象範囲、非公開情報確認、最終承認を担う人間の PO を明記する必要がある。 ``
- F004 \[minor/vp-pm-plan-feasibility; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: `未収録データストアの追加を、担当 Role code、依存順序、判断時期、完了条件を持つ作業単位として具体化する必要がある。`
- F005 \[minor/vp-pm-dependency-risk; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: ``「対応する業務データ辞書」をカタログ上の `bdd-exec-state`、`bdd-exec-plan-result`、`bdd-exec-evidence`、`bdd-worktree-branch` と対応付け、Schedule または PJR で追跡する必要がある。``
- F006 \[minor/vp-pm-control-reporting; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: `未収録データストアの追加を PJR の課題または変更要求として転記する条件、報告先、担当 Role code を明記する必要がある。`
- F007 \[minor/vp-ba-business-value; line=25; anchor=`"| 実行 event       | task 状態遷移の正本                   | タスク実行           | 報告・監視では参照のみ行い、状態訂正はタスク実行へ委譲する                                | task owner、PM     |"`; cause=document\]: `実行記録の管理単位や正本区分が解決する業務課題、未整備時の影響、期待する確認結果を上位文書への参照または本文で補う必要がある。`
- F008 \[major/vp-ba-requirements-completeness; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: `実行状態、plan/result、evidence、worktree の役割、内容、更新タイミング、粒度、用途、正本区分を追加しない限り、成果物カタログが要求する対象範囲は完結しない。`
- F009 \[minor/vp-ba-stakeholder-clarity; line=29; anchor=`"| Job Run 履歴     | Job Run・attempt と checkpoint の正本 | 定期処理、タスク実行 | 完了済みの同一 Run は変更しない。checkpoint は成功した attempt の許可された範囲だけ進める | 運用担当、実行担当 |"`; cause=document\]: `` `運用担当`、`実行担当`、`Job owner` を組織定義上の Role code に対応付け、定義変更の確認者と合意対象を明記する必要がある。 ``
- F010 \[major/vp-arc-cross-document-consistency; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: `` `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-cdsd.yaml` の `cdsd-execution.overview` および `depends_on` は実行状態、plan/result、evidence、worktree を対象とする一方、本文は追加予定として未収録なので、いずれかを修正して整合させる必要がある。 ``
- F011 \[major/vp-arc-technical-constraints; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: `実行状態、plan/result、evidence、worktree の正本・派生区分、生成元、更新制約、外部依存を定義しないと、実行系データストア全体の設計基礎として利用できない。`
- F012 \[major/vp-dev-implementation-readiness; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: `` `src/exec.ts` が扱う実行状態、plan/result、evidence、worktree について、入力、出力、正本、更新制約、対象ファイルまたは保存単位を定義する必要がある。 ``
- F013 \[minor/vp-dev-change-impact; line=31; anchor=`"Schedule・マイルストーンは [[prj-0001:cdsd-planning|概念データストア定義（プロジェクトの立上と計画）]]、実行 event から再生成する state・Ready・CPM・timeline は [[prj-0001:cdsd-sharing|概念データストア定義（活用と共有）]] で扱う。"`; cause=document\]: ``各データストアの変更時に影響する `src/exec.ts`、`src/routine.ts`、`src/job.ts`、関連 schema、生成物またはコマンドを識別できる参照を追加する必要がある。``
- F014 \[major/vp-dev-testability; line=28; anchor=`"| Job Definition   | 反復実行単位の定義の正本              | 人間による定義変更   | Run 生成前の検証に合格した定義だけを使う                                                  | Job owner          |"`; cause=document\]: `Job Definition を含む各正本について、検証コマンド、対象ファイルまたは schema、期待結果、エラー時の停止・修正手順を明記する必要がある。`
- F015 \[major/vp-qe-done-criteria; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: `成果物カタログで定義された実行状態などの対象データストアが未定義であり、完了条件を満たしていない箇所が残存している。`
- F016 \[major/vp-qe-verifiability; line=28; anchor=`"| Job Definition   | 反復実行単位の定義の正本              | 人間による定義変更   | Run 生成前の検証に合格した定義だけを使う                                                  | Job owner          |"`; cause=document\]: `Job Definition の合否条件、idempotency・checkpoint・precondition の必須項目と許容値、検証手順を pass/fail 判定可能な形で定義する必要がある。`
- F017 \[major/vp-qe-omissions-consistency; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: ``カタログで `cdsd-execution` の対象とされた4領域を「概念データストア一覧」と「正本区分と更新責務」の双方へ追加し、必須情報の欠落を解消する必要がある。``
- F018 \[major/vp-qe-omissions-consistency; line=19; anchor=`"| Job Run 履歴     | 定期処理、タスク実行       | Job Run ID、idempotency key、attempt、Run の状態、解決済み入力、checkpoint              | イベント（Run 生成時・attempt 終了時） | Job Run・attempt 毎 | 重複実行の防止、反復位置の引き継ぎ、実行結果の監査 |"`; cause=document\]: `未解決の _TODO_ / _ASSUMPTION_ が残っています。`
- F019 \[major/vp-qe-omissions-consistency; line=9; anchor=`"- _TODO_: 実行状態（Ready）、plan / result、evidence、worktree のデータストアは、対応する業務データ辞書の作成時に追加する。"`; cause=document\]: `未解決の _TODO_ / _ASSUMPTION_ が残っています。`
- F020 \[minor/vp-qe-omissions-consistency; line=15; anchor=`"| 実行 event       | タスク実行、定期処理、報告 | task の claim・complete・block・release・reopen 等の状態遷移、actor、理由、日時         | イベント（状態変更時）                 | 状態遷移毎          | task 状態の再構成、進捗・滞留の監視根拠            |"`; cause=document\]: `Rulebook 2.4に反して、last_scheduled_forのような物理的な名前がcontentカラムに直接記載されています。physicalNameカラムを追加するか、概念的な内容を日本語で記載する必要があります。`
- F021 \[minor/vp-ux-language-consistency; line=25; anchor=`"| 実行 event       | task 状態遷移の正本                   | タスク実行           | 報告・監視では参照のみ行い、状態訂正はタスク実行へ委譲する                                | task owner、PM     |"`; cause=document\]: `` `実行 event`、`task`、`routine`、`Job Definition`、`Job Run` の正式名称と使い分けを用語定義で示すか、日本語の業務名称へ統一する必要がある。 ``
- F022 \[minor/vp-ops-release-readiness; line=9; anchor=`"- _TODO_: 実行状態（Ready）、plan / result、evidence、worktree のデータストアは、対応する業務データ辞書の作成時に追加する。"`; cause=document\]: `TODO 解消後の ready 条件、公開前に確認する項目、最終承認者を明記する必要がある。`
- F023 \[minor/vp-ops-operability; line=29; anchor=`"| Job Run 履歴     | Job Run・attempt と checkpoint の正本 | 定期処理、タスク実行 | 完了済みの同一 Run は変更しない。checkpoint は成功した attempt の許可された範囲だけ進める | 運用担当、実行担当 |"`; cause=document\]: `正本に不整合や更新失敗が発生した場合の問い合わせ先、変更申請先、訂正・復旧手順への参照を追加する必要がある。`
- F024 \[major/vp-qe-config-validity; line=9; anchor=`"- _TODO_: 実行状態（Ready）、plan / result、evidence、worktree のデータストアは、対応する業務データ辞書の作成時に追加する。"`; cause=document\]: `未解決の _TODO_ / _ASSUMPTION_ が残っています。`

`cause` は原因の所在を示す。`kata:<kind>` の指摘も成果物側の修正が必要なため、この plan に載るすべての指摘を扱う。Kata の手入れは対応する maintenance の段で行う。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。加えて、下記「実装エビデンスと未作成の依存」に列挙した実装の根拠を読み取り専用で参照する。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書・実装や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 実装エビデンスと未作成の依存

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の実装の根拠である。`targets`、変更許可範囲、commit 対象には含めない。

- `src/exec/exec.ts`（implementation）: exec コマンド入口から到達する実行イベントストアのスキーマ・追記規則、実行状態（Ready）ストアの算出、plan/resultストアのscaffold規則、worktreeストアの命名・配置
- `src/routine/routine.ts`（implementation）: 定期処理ストアのスキーマ
- `src/job/job.ts`（implementation）: Job Runストアのスキーマ

実装エビデンスは現在動作の事実、rulebook は書き方、`depends_on` と個票の `入力` は意図された仕様の根拠として使い分ける。食い違いは実装へ無条件に合わせず、承認根拠のある現在動作だけを反映し、未承認の乖離は意図された仕様を保持して result に記録する。実装から目的・業務判断・将来方針を推測しない。

`depends_on` の「未作成」は参照できる本文がまだないことを示す。未作成の依存だけを理由に異常終了せず、存在する資料で進める。内容を推測で埋めず、必要な箇所は _TODO_ / _ASSUMPTION_ として、不足する根拠と次のアクションを残す。

### 4.1. 必要な実践の型が存在しない・内容が薄い場合

- `not-needed` ではない rulebook / recipe が存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を result の `進め方と実践の型の適用` セクションに記録する。
- 不足分は、存在する他の実践の型と `depends_on` 成果物（いずれも plan 記載の文書）、および既存の対象成果物で補う。実践の型の欠落を理由にレビュー観点を未達にしない。
- 章構成は既存の対象成果物を骨組みとし、判断に迷う場合は rulebook の構成を正とする。
- 実践の型そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、申し送りに残す。

### 4.2. 既存記述の扱い

- 対象成果物に既存の記述がある場合は、まず内容を確認し、既存記述を尊重する。既存記述の破棄や全面的な書き換えは原則として行わず、既存記述を基礎として不足分を加筆・補強する。
- 次のいずれかに該当する箇所は、既存記述であっても修正対象とする。修正はいずれも該当箇所に閉じた最小限にとどめる。
  - `depends_on` の最新の決定事項と明確に矛盾する箇所。
  - 手順1で確認した rulebook の必須要素が欠落している箇所、rulebook の禁止事項に抵触している箇所、および rulebook が定める章構成に適合していない箇所。
  - 同一成果物内で同じ内容が複数箇所に重複している箇所。
  - rulebook の必須要素にも「完了の狙い」に示された `done_criteria` にも寄与していない記述。
- 上記のいずれにも該当しない場合（完成度・整合性・読みやすさの向上など）は、それだけを理由に修正しない。既存記述が rulebook の許容範囲内（例: 複数の構成が認められている場合の一方の選択）であれば、他章との見た目の整合を理由に、より詳細な構成や長い記述へ書き換えない。
- rulebook 不適合の修正は、既存記述の内容を保持したまま rulebook の章構成へ移し替え、欠落した必須要素を補い、禁止事項に該当する記述形式を改める作業として行う。内容の全面書き換えはしない。移し替え先が定まらない既存記述は、下記の削除対象に該当しない限り削除せず、内容が最も近い章に残したうえで、その判断を result に記録する。
- 重複記述は、内容が最も適切な1箇所を正本と定めて統合し、他の箇所は要約または正本の章への参照に置き換える。統合で情報が失われる場合は、不足分を正本側に取り込んでから他方を整理する。
- rulebook の必須要素にも `done_criteria` にも寄与していない記述は削除する。削除は既存記述の尊重の例外であり、判断根拠を result に記録することで担保する。
- 既存記述が古いか判断できない場合、rulebook への不適合か意図的な逸脱か判断できない場合、および必須要素・`done_criteria` に寄与するか判断できない場合は、破棄せず _TODO_ / _ASSUMPTION_ で論点を残す。
- 加筆・修正・統合・削除の判断根拠を result の `進め方と実践の型の適用` セクションに残す。削除・統合した記述については、対象箇所と根拠が後から追える粒度で記録する。

### 4.3. 根拠のない具体化の禁止

- ファイルパス・コマンド・設定値など、実装や設定の実態を示す具体的な記述を新たに書き加える場合は、本セクションの宣言された参照範囲（rulebook / 併せて適用する rulebook / recipe、`depends_on` 成果物、`based_on`、プロジェクトコンテキスト、個票の `入力`、カタログの `brief`）で裏付けが取れる場合に限る。sample は別文脈の完成例であり、対象成果物の具体的な記述の裏付けにしない。
- 既存記述が曖昧・不完全（ファイル名のみでパスが無い、値が未確定など）であっても、裏付けが無ければ推測で具体化しない。完成度を上げる目的だけで、もっともらしい値を断定的に書き加えない。
- 裏付けが無く判断できない箇所は、既存の曖昧な記述を残したまま _TODO_ / _ASSUMPTION_ として論点を残す。

### 4.4. 判断根拠の記録

参照した文書・参照しなかった文書と、その判断根拠を result に残す。記録先は次のとおり。

- 参照した rulebook / recipe / sample の使い分け、矛盾時に rulebook を正とした箇所、欠落・薄い実践の型の扱い、既存記述の加筆・修正・統合・削除の根拠、具体化を見送った箇所とその理由: result の `進め方と実践の型の適用` セクション。

## 5. 完了の狙い

この成果物が満たすべき狙い（成果物カタログの `done_criteria`）を、owner ロールの狙いと下流ロールの入力適合に分けて示す。「進め方」に従って実践の型に沿って記述する中で、owner の狙いを作成目標として満たすことを目指す。下流ロールの項目は、その文書から各ロールが自分の責務の成果物を作成できるよう入力として最低限成立させる範囲にとどめ、各ロールの内容を成果物に作り込まない（一文書一責務）。下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる。

owner として達成する狙い:

- データストア構成を設計の基礎として参照できること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [BA] データストアの業務的役割・内容・粒度が記述されていること
- [QE] データ検証・整合性確認の対象が識別できること

## 6. 完了手順

1. 「このフェーズで行うこと」と「進め方」に従って成果物を更新する。
2. 「完了の狙い」を満たしているかを確認し、不足があれば加筆・補強する（観点別の自己レビューや再確認ループは行わない）。
3. 共通規約に従って、必要な整形・静的検査を実行する。
4. result に実施内容・変更ファイル・進め方と実践の型の適用を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 7. 異常終了の条件

- 実行に必要なツール・パッケージの依存を解決できない、対象ファイルのパスが特定できない、または lint/test 未解消の場合は異常終了する（終了コード 1）。
- 未作成の `depends_on` と `evidence_refs` の欠落だけでは異常終了しない。未作成の依存の内容は推測せず _TODO_ / _ASSUMPTION_ と次のアクションを残す。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- T-BUSINESS-SPECS-KATA-2-cdsd-execution-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 65 点で完了条件 0/3
- 主な指摘: 実行状態・plan と result・evidence・worktree の 4 つのデータストアが `_TODO_` のまま。技術的な制約と正本・派生の区別、検証の合否の基準がない

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 実行状態・plan と result・evidence・worktree の 4 つのデータストアについて、役割・内容・正本と派生の区別・技術的な制約・検証の合否の基準を書いている。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
