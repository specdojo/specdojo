---
specdojo:
  id: prj-0001:xep-pjr-v681-20261111t122838z-e25e3b54
  type: exec-plan
  rulebook: none
  task_id: PJR-V681
  name: "代表の bes-task-ready-selected を、grade の指摘で磨き込む"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: sol-executor
  approach: fully-guided
  targets:
    - prj-0001:bes-task-ready-selected
---

# Edit Plan: PJR-V681

## 1. このフェーズで行うこと

grade（reps5-20261111）needs-work 88 の指摘（並列の要求の対応付けの項目・範囲の前提・残った目印）を直す

## 2. 対象成果物

- `name`: 業務イベント仕様（実行可能タスクの選択）
- `depends_on`:
  - `bes-index`（未作成）
  - [[cdfd-overview]]
  - [[prj-0001:stsd-task-execution]]
- `based_on`（対象成果物の frontmatter）: [[cdfd-overview]]、[[prj-0001:stsd-task-execution]]
- 個票の `入力`: 下記「個票の入力（前提）」を参照。
- `overview`: 実行可能なタスクが選択されたイベント（単発／自動／並列など起点が一意にならない）を定義する
- `path`: `docs/ja/product/010-business-specs/030-business-model/bes-task-ready-selected.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-V681/pjr-v681-20261111T122838Z-e25e3b54/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **sol-executor**
- 責務: _MISSING_

このロールが重視するレビュー観点:

- _MISSING_

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/bes-rulebook.md`
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `docs/ja/specdojo/recipes/bes-recipe.md`
- sample: `docs/ja/specdojo/samples/bes-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[minor/vp-po-publication-accountability; line=23; anchor=``"| 承認者の識別 | _UNDECIDED_: 業務定義の妥当性と公開可否（`status: ready` への昇格を含む）を承認する人間の PO の Member ID または氏名は、宣言された参照範囲から確認できない         | PM が業務レビューの依頼前に人間の PO を特定し、その識別と承認結果をレビュー結果に記録する。AI Agent による承認で代替しない                                                                        |"``; cause=document\]: `Identify the human PO responsible for approving the event definition and its publication readiness.`
- F002 \[minor/vp-ba-requirements-completeness; line=87; anchor=``"_UNDECIDED_: [[prj-0001:stsd-task-execution|ステータス定義（タスク実行）]] が根拠（`based_on`）に挙げる実行記録モデル（`prj-0001:bdd-exec-event` および `prj-0001:bdd-exec-state`）は本タスクの参照範囲外のため未照合である。主な照合先候補 `prj-0001:bdd-exec-event`（実行イベント）での「並列選択要求識別子」の対応項目と、「同じ要求で確定した件数」の観測時点（各対象の確定時点までの件数か、要求終了時の件数か）は未決定である。実行 1 回の ID が一括要求と同じ単位とは限らないため、既存項目で表せるとも新規フィールドが必要とも断定しない。発生後にしか分からない最終件数を、途中の発生時点の確定データとして扱わない。"``; cause=document\]: `Specify the event-data field that correlates selections made by the same parallel request, based on the execution-record model.`
- F003 \[minor/vp-ba-requirements-completeness; line=70; anchor=`"| 同じ要求で確定した件数     | 一括要求での選択数。集計時点は下記の未決事項                                                                                                         | 並列。発生時点で観測可能な範囲に限る |"`; cause=document\]: `Define whether the selection count is cumulative at each event or determined when the request finishes, and specify when that value is available or omitted.`
- F004 \[minor/vp-arc-technical-constraints; line=87; anchor=``"_UNDECIDED_: [[prj-0001:stsd-task-execution|ステータス定義（タスク実行）]] が根拠（`based_on`）に挙げる実行記録モデル（`prj-0001:bdd-exec-event` および `prj-0001:bdd-exec-state`）は本タスクの参照範囲外のため未照合である。主な照合先候補 `prj-0001:bdd-exec-event`（実行イベント）での「並列選択要求識別子」の対応項目と、「同じ要求で確定した件数」の観測時点（各対象の確定時点までの件数か、要求終了時の件数か）は未決定である。実行 1 回の ID が一括要求と同じ単位とは限らないため、既存項目で表せるとも新規フィールドが必要とも断定しない。発生後にしか分からない最終件数を、途中の発生時点の確定データとして扱わない。"``; cause=document\]: `Resolve the parallel-request correlation field against the execution-record data model so the event payload can be represented consistently.`
- F005 \[minor/vp-dev-implementation-readiness; line=87; anchor=``"_UNDECIDED_: [[prj-0001:stsd-task-execution|ステータス定義（タスク実行）]] が根拠（`based_on`）に挙げる実行記録モデル（`prj-0001:bdd-exec-event` および `prj-0001:bdd-exec-state`）は本タスクの参照範囲外のため未照合である。主な照合先候補 `prj-0001:bdd-exec-event`（実行イベント）での「並列選択要求識別子」の対応項目と、「同じ要求で確定した件数」の観測時点（各対象の確定時点までの件数か、要求終了時の件数か）は未決定である。実行 1 回の ID が一括要求と同じ単位とは限らないため、既存項目で表せるとも新規フィールドが必要とも断定しない。発生後にしか分からない最終件数を、途中の発生時点の確定データとして扱わない。"``; cause=document\]: `Define the parallel-request correlation field against the execution-record model before using this event specification as an implementation reference.`
- F006 \[major/vp-qe-done-criteria; line=21; anchor=``"| 対象系統     | _UNDECIDED_: 3 系統（schedule・register・routine）と実行サイクル全体で同一イベントとするかは、一覧と各系統の起点イベント仕様が揃っておらず、人間の PO の判断も未了 | BA が `bes-index`（`prj-0001:bes-index`）と各系統の起点イベント仕様を照合し、人間の PO が実装・テスト設計への引き渡し前に判断する。PM は判断結果と未解決事項を登録簿（`pjr-*`）でも追跡・報告する |"``; cause=document\]: `Resolve the task-flow scope and obtain business approval of the event’s applicability before claiming the event specification is complete.`
- F007 \[major/vp-qe-done-criteria; line=87; anchor=``"_UNDECIDED_: [[prj-0001:stsd-task-execution|ステータス定義（タスク実行）]] が根拠（`based_on`）に挙げる実行記録モデル（`prj-0001:bdd-exec-event` および `prj-0001:bdd-exec-state`）は本タスクの参照範囲外のため未照合である。主な照合先候補 `prj-0001:bdd-exec-event`（実行イベント）での「並列選択要求識別子」の対応項目と、「同じ要求で確定した件数」の観測時点（各対象の確定時点までの件数か、要求終了時の件数か）は未決定である。実行 1 回の ID が一括要求と同じ単位とは限らないため、既存項目で表せるとも新規フィールドが必要とも断定しない。発生後にしか分からない最終件数を、途中の発生時点の確定データとして扱わない。"``; cause=document\]: `Specify the parallel-request correlation field and verify it against the execution-record model so the event can support implementation and test design.`
- F008 \[minor/vp-qe-verifiability; line=87; anchor=``"_UNDECIDED_: [[prj-0001:stsd-task-execution|ステータス定義（タスク実行）]] が根拠（`based_on`）に挙げる実行記録モデル（`prj-0001:bdd-exec-event` および `prj-0001:bdd-exec-state`）は本タスクの参照範囲外のため未照合である。主な照合先候補 `prj-0001:bdd-exec-event`（実行イベント）での「並列選択要求識別子」の対応項目と、「同じ要求で確定した件数」の観測時点（各対象の確定時点までの件数か、要求終了時の件数か）は未決定である。実行 1 回の ID が一括要求と同じ単位とは限らないため、既存項目で表せるとも新規フィールドが必要とも断定しない。発生後にしか分からない最終件数を、途中の発生時点の確定データとして扱わない。"``; cause=document\]: `Define the observation point and expected per-event value for the parallel selection count so two selections from one request have unambiguous pass/fail expectations.`
- F009 \[minor/vp-qe-omissions-consistency; line=22; anchor=``"| 一覧との接続 | _UNDECIDED_: 依存の `bes-index`（`prj-0001:bes-index`）が未作成であり、対応行・成果物カタログ定義との整合・双方向リンクは未確認                                    | 一覧が作成された時点で ARC が `P-07` の「実行指示された」および成果物カタログの本イベント定義との整合を確認し、一覧と本書の双方向リンクを設定して、業務仕様の完成判断前に PM へ報告する           |"``; cause=document\]: `Add the event-index link when the index is created and verify this event’s catalog entry against the specification.`
- F010 \[minor/vp-qe-omissions-consistency; line=22; anchor=``"| 一覧との接続 | _UNDECIDED_: 依存の `bes-index`（`prj-0001:bes-index`）が未作成であり、対応行・成果物カタログ定義との整合・双方向リンクは未確認                                    | 一覧が作成された時点で ARC が `P-07` の「実行指示された」および成果物カタログの本イベント定義との整合を確認し、一覧と本書の双方向リンクを設定して、業務仕様の完成判断前に PM へ報告する           |"``; cause=document\]: `Complete and verify the BEL event link when the index is available so the event catalog and specification remain connected.`
- F011 \[major/vp-qe-config-validity; line=17; anchor=``"_ASSUMPTION_: 本書の未決事項における確認・判断の担当割当は未承認の進め方案である。判断結果は本書の該当箇所と本成果物のレビュー結果に記録し、PM が未解決事項や変更要求を登録簿（`pjr-*`）への転記候補と併せて追跡・報告する。"``; cause=document\]: `未解決の _TODO_ / _ASSUMPTION_ が残っています。`

`cause` は原因の所在を示す。`kata:<kind>` の指摘も成果物側の修正が必要なため、この plan に載るすべての指摘を扱う。Kata の手入れは対応する maintenance の段で行う。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。加えて、下記「実装エビデンスと未作成の依存」に列挙した実装の根拠を読み取り専用で参照する。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書・実装や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 実装エビデンスと未作成の依存

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の実装の根拠である。`targets`、変更許可範囲、commit 対象には含めない。

なし（`evidence_refs` 未指定またはカタログなし）。

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

- イベント内容・発生条件・タイミングが業務観点で正確に記述されていること
- イベント仕様の業務的妥当性を承認できること
- イベント処理実装・メッセージ設計の基礎として参照できること
- イベントテスト設計への活用が確認できること
- イベントハンドラ・パブリッシャー実装の参照として使えること

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

- 代表の確定の段の材料で、bes は needs-work 88（major 3）だった。indie が 2026-11-11 に推奨の進め方（再実行）を承認した

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 代表の [[prj-0001:bes-task-ready-selected]] を、確定した型 [[specdojo:bes-rulebook]] と [[specdojo:bes-sample]] に合わせ、grade（run id `reps5-20261111`、needs-work 88）の指摘を直している。
  - 並列の要求を実行の記録と対応付ける項目を決め、実行の記録の正本（schema・業務データ辞書）で確かめて書いている。正本にない場合は `_UNDECIDED_` のまま理由を書く。
  - このイベントを使うタスクの流れの範囲を、業務の承認が要る前提として `_ASSUMPTION_` に明示している（承認は確定の段で人が行う。executor が承認済みとしない）。
  - 残っている `_TODO_` を、確定した型の範囲で解消している。決められないものは `_UNDECIDED_` か `_ASSUMPTION_` にして理由を書く。
  - そのほかの grade の指摘のうち、確定した型の範囲で直せるものを直し、直さないものは理由を個票の対応結果に書いている。
- 冗長さを整理し、実装・schema・リファレンスと同じことを書かず正本を参照する方針（PJR-2GD6）を保っている。
- 型と、ほかの成果物とカタログを変えていない。
- grade で pass になっている（grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`specdojo catalog validate --project prj-0001` が通っている。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
