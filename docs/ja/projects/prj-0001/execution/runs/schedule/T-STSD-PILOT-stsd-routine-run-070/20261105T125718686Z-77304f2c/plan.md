---
specdojo:
  id: prj-0001:xep-t-stsd-pilot-stsd-routine-run-070
  type: exec-plan
  rulebook: none
  task_id: T-STSD-PILOT-stsd-routine-run-070
  name: "磨き込み・整合性確認"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  on_critical_path: true
  approach: fully-guided
  targets:
    - stsd-routine-run
---

# Edit Plan: T-STSD-PILOT-stsd-routine-run-070

## 1. このフェーズで行うこと

PJR-PT5N（[[prj-0001:pjr-pt5n-stsd-kata-confirm]]）で確定した stsd の Kata に従う。
図は [[specdojo:stsd-mermaid-rulebook]] の閾値を超える場合だけ分け、小さな図は分けない。
整備済みの実践の型と先行・隣接成果物を参照し、既存の草案を保守的に磨き込む。
責務境界と `depends_on` に沿った情報の受け渡しを確認し、不足や不整合だけを最小限修正して
`done_criteria` を満たす状態へ整える。

## 2. 対象成果物

- `name`: ステータス定義（定期処理の実行結果）
- `depends_on`:
  - `bdd-routine-definition`（未作成）
- `based_on`（対象成果物の frontmatter）: なし
- 個票の `入力`: なし
- `overview`: 定期処理の実行結果（running / success / partial / failure / skipped）が取り得る状態と実行開始から結果確定までの遷移を一覧・図で定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/stsd-routine-run.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/T-STSD-PILOT-stsd-routine-run-070-result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 仕様を書く人と読む人の利用者視点から、文書体系への要求、利用場面、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 主要な定義・判断がどの対象者のどの業務課題・期待価値に応えるかを説明でき、主要な成果・方針がその目的に対応しているか。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、確認者、合意対象が読み取れるか。

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/stsd-rulebook.md`
- 併せて適用する rulebook（記法など）: `docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/stsd-recipe.md`
- sample: `docs/ja/specdojo/samples/stsd-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=103; anchor=`""`; cause=document\]: ``成果物カタログが依存先とする `bdd-routine-definition` が未作成で `based_on` も空のため、主要な状態・遷移を上位の業務定義から必要と説明できる参照を追加する必要がある。``
- F002 \[major/vp-po-decision-readiness; line=100; anchor=`""`; cause=document\]: `試行中状態の復旧方針について選択肢、各案の業務影響、PO の判断対象、具体的な次アクションがなく、決定時期も「後続の仕様判断時」に留まるため承認可否を判断できない。`
- F003 \[major/vp-pm-plan-feasibility; line=100; anchor=`""`; cause=document\]: `復旧方針の決定と overlap 方針の決定を個別タスクとして識別できる owner、成果、完了条件、判断期限がなく、「PM、ARC、QE」「後続の仕様判断時」だけでは順序付けや進捗確認に使えない。`
- F004 \[major/vp-pm-dependency-risk; line=103; anchor=`""`; cause=document\]: ``未作成の `bdd-routine-definition` への依存について PJR 登録先、作成順序、Schedule への影響、解消条件がなく、依存未解消のまま後続設計が進むリスクを管理できない。``
- F005 \[major/vp-pm-control-reporting; line=96; anchor=`""`; cause=document\]: `復旧不能リスク、overlap 方針、仮置き状態値、未作成依存について、PJR 転記候補、報告先、対応方針、単一の担当 Role code を明示する必要がある。`
- F006 \[minor/vp-ba-business-value; line=15; anchor=`"| 定義・経路         | 起動条件と選択                                                                                                                                                                                 | 実行後の次回判定                                                                                          |"`; cause=document\]: `定期処理状態を一意に管理できない場合に誰のどの業務判断が阻害されるかと、上位目的・期待効果への参照を補い、状態定義が生む業務価値を明示する必要がある。`
- F007 \[major/vp-ba-requirements-completeness; line=28; anchor=`"- register / task 系 action の委譲対象がない場合、および完了済みの同一 Job Run を再実行しない場合は成功として記録する。project busy による skip と Job の precondition skip は skip として記録する。"`; cause=document\]: `` `src/routine.ts` が受理・実行する `policy.missed_run: skip` の起動条件と次回判定が cron 行から欠落しており、取りこぼしを実行しない経路の業務要件を確認できない。 ``
- F008 \[major/vp-ba-requirements-completeness; line=45; anchor=`""`; cause=document\]: ``新しい `last_run` の記録時も以前の `last_result` が保持され、両者を対応付ける識別情報がないため、成立条件だけでは「直前結果あり」と「新しい試行の結果未反映」を区別して試行中を一意判定できない。``
- F009 \[minor/vp-ba-stakeholder-clarity; line=15; anchor=`"| 定義・経路         | 起動条件と選択                                                                                                                                                                                 | 実行後の次回判定                                                                                          |"`; cause=document\]: `利用者として PM・運用担当・ARC・QE・DEV は示されているが、状態遷移の業務妥当性を確認し合意する BA・PO の役割と確認タイミングを明記する必要がある。`
- F010 \[major/vp-arc-cross-document-consistency; line=103; anchor=`""`; cause=document\]: `` `docs/ja/projects/prj-0001/010-deliverables-catalog/dct-data-model-stsd.yaml` は `depends_on: bdd-routine-definition` を宣言する一方、対象の Frontmatter は `based_on: []` で本文も同文書を未作成としており、カタログと成果物の依存関係が一致していない。 ``
- F011 \[major/vp-arc-technical-constraints; line=45; anchor=`""`; cause=document\]: `` `last_run` と `last_result` の対応を保証する run ID、結果対象時刻、または開始時の結果クリア規則が定義されておらず、`running` を状態遷移実装の基礎として一意に導出できない。 ``
- F012 \[major/vp-dev-implementation-readiness; line=45; anchor=`""`; cause=document\]: ``現行の保存項目だけでは新しい試行に対応する結果の有無を判定できないため、対応キーの追加、開始時の `last_result` 更新、または履歴との照合規則のいずれかを確定しなければ状態管理を実装できない。``
- F013 \[major/vp-dev-change-impact; line=102; anchor=`""`; cause=document\]: `` `never` と `running` を業務上の仮置き値として導入する変更について、`src/routine.ts`、routine state, run history、表示・監視処理、既存データ互換性への影響を列挙する必要がある。 ``
- F014 \[major/vp-dev-testability; line=96; anchor=`""`; cause=document\]: `状態遷移変更後に実行するテスト、lint、schema または生成コマンド、対象ファイル、期待結果、失敗時対応が記載されておらず、実装変更の確認手順として利用できない。`
- F015 \[major/vp-qe-done-criteria; line=100; anchor=`""`; cause=document\]: `試行中の一意判定と復旧方針が未決のままであり、状態遷移の正確性、業務承認、実装基礎、状態テスト、実装参照という done criteria を満たしたと判定できない。`
- F016 \[major/vp-qe-verifiability; line=45; anchor=`""`; cause=document\]: `` `last_result` が現在の `last_run` に対応するかを示す値がないため、同じ保存状態を「試行中」と「前回結果確定済み」のどちらにも解釈でき、状態ベーステストの期待状態を一意に判定できない。 ``
- F017 \[major/vp-qe-omissions-consistency; line=28; anchor=`"- register / task 系 action の委譲対象がない場合、および完了済みの同一 Job Run を再実行しない場合は成功として記録する。project busy による skip と Job の precondition skip は skip として記録する。"`; cause=document\]: ``実装が許容する `missed_run: skip` が due 判定、遷移条件、補足のいずれにもなく、許容設定と本文の経路網羅性が一致していない。``
- F018 \[minor/vp-qe-omissions-consistency; line=44; anchor=`"### 3.1. 初回実行と結果反映（T-01〜T-05）"`; cause=document\]: `` `never` と `running` は実装上のコードを持たないにもかかわらず値に指定されており、ルールブックの「コードを持たない場合は `-`」に反している。 ``
- F019 \[minor/vp-qe-omissions-consistency; line=103; anchor=`""`; cause=document\]: `` `stsd-recipe.md` の仕上げチェックは今後の検討メモに `_TODO_` を残さないことを求めているため、依存文書の作成または追跡可能な未決事項への置換が必要である。 ``
- F020 \[minor/vp-ux-readability; line=20; anchor=`"| disabled           | due 一括選択から除外する。                                                                                                                                                                     | 状態を更新せず、明示 ID 実行または定義変更を待つ                                                          |"`; cause=document\]: ``「`last_run` に対応する `last_result`」を識別する項目や照合方法が説明されておらず、初見の読者は直前値が残る場合に現在状態を判定できない。``
- F021 \[minor/vp-ux-user-flow; line=18; anchor=``"| cron               | timezone 上の5フィールド cron に一致し、`last_scheduled_for` より後から現在分までの予定時刻を選ぶ。`missed_run: latest` または未指定は最新一件、`all` は取りこぼした各予定時刻を古い順に扱う。 | 委譲前に各 scheduled time を `last_scheduled_for` へ記録する。初回は直近の一致一件だけを選ぶ              |"``; cause=document\]: `` `stsd-task-execution` と `stsd-job-run` はリンク形式でなく、現時点では対応ファイルも存在しないため、利用者が対象外の状態定義へ到達できる有効な参照または未作成表示を設ける必要がある。 ``
- F022 \[major/vp-ops-release-readiness; line=96; anchor=`""`; cause=document\]: `復旧方針、overlap 方針、仮置き状態値、未作成 BDD のうち何を解消すれば ready にできるか、確認者・承認者・公開前検証を明示する必要がある。`
- F023 \[major/vp-ops-operability; line=100; anchor=`""`; cause=document\]: ``試行記録後に例外終了して `running` 相当で残った routine の検知方法、確認証跡、再試行または結果補正の手順、実施担当、問い合わせ・エスカレーション先を定義する必要がある。``
- F024 \[major/vp-qe-config-validity; line=92; anchor=``"| _ASSUMPTION_: 未実行・試行中の値（`never`、`running`）は本書で導入した業務上の区分であり、routine 実行状態に同名のフィールド値は存在しない                                              | 未実行、試行中         | ARC         | 本書のレビュー時                |"``; cause=document\]: `未解決の _TODO_ / _ASSUMPTION_ が残っています。`

`cause` は原因の所在を示す。`kata:<kind>` の指摘も成果物側の修正が必要なため、この plan に載るすべての指摘を扱う。Kata の手入れは対応する maintenance の段で行う。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。加えて、下記「実装エビデンスと未作成の依存」に列挙した実装の根拠を読み取り専用で参照する。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書・実装や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 実装エビデンスと未作成の依存

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の実装の根拠である。`targets`、変更許可範囲、commit 対象には含めない。

- `src/routine/routine.ts`（implementation）: routine 実行結果（last_result＝running/success/partial/failure/skipped）の判定・更新規則
- `src/routine/definition.ts`（implementation）: routine 実行状態・実行結果の型定義（RoutineStateResult, RoutineExecutionResult）

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

- ステータス名・意味・成立条件と、遷移・イベント・条件が業務観点で正確に定義されていること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [PO] 状態遷移の業務的妥当性を承認できること
- [ARC] 状態遷移実装の基礎として参照できること
- [QE] 状態ベースのテスト設計に活用できること
- [DEV] 状態管理実装の参照として使えること

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

## 共通: 記法・成果物規約

作業を始める前に、共通の規約の詳細 `docs/ja/specdojo/exec-templates/xp-common-conventions-template.md`、`docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を読み、その内容に従う。次の箇条書きは、そのうち守らないと失敗に直結する要点である。

- result（review plan の場合は review result）への記入は、タスク完了に必須の作業である。成果物の編集とは別に、最後に必ず実施する。
- 終了コード 0 で完了する前に、result の必須セクションをすべて実際の内容で埋め、プレースホルダ（_TODO_ など）や未記入のセクションを残さない。
- 文書へのリンクは、対象文書が既に存在する場合は `[[id|title]]` 形式で記載する（`id` は project 修飾 doc id）。
- リンクを表（テーブル）のセル内に置く場合は、区切りの `|` を `[[id\|title]]` のようにエスケープする。エスケープしないと列がずれて表が壊れ、prettier 整形でセルが分割されて固定化される。
- まだ存在しない文書を参照する場合は、`[[...]]` ではなく `` `id` `` または `` `filename` `` のようにバッククォートで仮置きする。
- Markdown の自由記述では、`_` を含む識別子・フィールド名（例: `depends_on`）を必ずインラインコードで囲む。result に描画される executor evidence や reporter の自由記述も同じ記法にする。
- 成果物 frontmatter の `status` を `ready` に変更しない。`ready` への昇格は人間のみが行うため、`draft` のまま据え置く（exec のコミット時ガードでも昇格はブロックされる）。
- ファイルの読み取り・書き込み・編集は、作業ディレクトリ（カレントディレクトリ）からの相対パスで指定する。絶対パスを自分で組み立てたり、作業ディレクトリ名を推測して指定したりしない（作業ディレクトリ名の取り違えは外部パス扱いになり拒否される）。
- 検査を実行する前に、リポジトリの `package.json`、`.specdojo/specdojo.config.json`、hook 設定（`lefthook.yml` など）を読み、本共通規約の詳細にある検査表の適用条件で、実行する検査を決める。
- 適用条件を満たさない検査は実行せず、executor evidence の validations に `not_applicable` と非適用の理由を `reason` へ記録する。適用される検査が 1 つもない場合も同じく、該当する検査ごとに `not_applicable` と理由を記録する。
- `not_run` は、適用される検査を実行できたのに実行しなかった場合だけに使う。runner は `not_run` を検証失敗として扱い、タスクを先へ進めない。
- `pipeline.parent_validations` に設定された検査は executor evidence の validations に含めなくてよい。executor が同じ検査を `not_run` または `not_applicable` として含めても、同じリポジトリで実行した親 runner の結果を正とする。
- 冗長さの判定は [[specdojo:pm-review-viewpoints|共通レビュー観点一覧]] の `vp-arc-conciseness` を正本とする。
- 同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲は書かず、既存の記述は削る・まとめる・参照に置き換える。
- 判断に要る背景・制約・例外・完了条件は残し、長さだけでは削らない。
