---
specdojo:
  id: prj-0001:xep-pjr-jfrx-20261115t165136z-2ce5ab63
  type: exec-plan
  rulebook: none
  task_id: PJR-JFRX
  name: "bds-progress-report を grade の指摘で手直しする（kata-wave-2 の 2 回目）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: UX
  approach: fully-guided
  targets:
    - bds-progress-report
---

# Edit Plan: PJR-JFRX

## 1. このフェーズで行うこと

bds-progress-report を最新の grade の指摘で直す

## 2. 対象成果物

- `name`: 帳票仕様（週次進捗報告）
- `depends_on`:
  - `bds-index`（未作成）
  - [[sysd-job-execution]]
- `based_on`（対象成果物の frontmatter）: [[sysd-job-execution]]
- 個票の `入力`: 下記「個票の入力（前提）」を参照。
- `overview`: routine が週ごとに作る進捗報告（reporting/progress-reports/）の利用目的・読み手・表示項目・出力の時期と、元にする記録を定義する
- `path`: `docs/ja/product/010-business-specs/040-user-interface-model/bds-progress-report.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-JFRX/pjr-jfrx-20261115T165136Z-2ce5ab63/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **UX（UX / Documentation Designer）**
- 責務: 仕様作成者が迷わず使える導線、説明、文書体験を担う。小規模運用では BA 観点と合わせて扱い、必要時に専任化を検討する。

このロールが重視するレビュー観点:

- 読みやすさ・理解しやすさ: 初見の読者が、成果物固有の目的または上位文書への参照、名称、メタデータから、なぜ扱うか、役割、利用先、対象、主要な判断、次に見る文書を理解できるか。主旨または主要な判断点を読み取れない箇所を特定できる場合は major とする。同一主張の反復や正本の過剰な再掲など冗長性の判定は vp-arc-conciseness で行い、この観点では扱わない。
- 利用者導線: 利用者や将来貢献者が迷わず必要情報へ到達できる構成になっているか。目次から必要な章を見つけられるか、関連成果物への参照が適切な位置にあるか、前提から結論への説明順序が守られているかのいずれかの基準に照らして判定し、情報を見失う箇所を具体的に特定できる場合のみ不備とする。
- 用語・表現の一貫性: 用語、Role code、成果物名、状態、ラベルが読み手を混乱させない形で統一されているか。

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/bds-rulebook.md`
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/bds-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=23; anchor=``"- 再出力: 同じ週の再実行は同じ Job Run の再試行として扱い、別の報告を増やさない。手動では `exec run --job job-weekly-report` に期間を渡して作成できる。"``; cause=document\]: `Resolve whether the reporting period ends at the Friday 17:00 trigger or at week end, and specify how the resulting boundary affects the report’s scope before PO approval.`
- F002 \[minor/vp-po-decision-readiness; line=91; anchor=`"| 期間の終点       | 金曜 17 時以降の記録の扱いが未決であり、完了事項の境界を判定できない                                           | PO が終点を決め、QE が境界の期待結果を確かめるまで週末の記録の扱いを受入対象外とする      |"`; cause=document\]: `Define how the rulebook’s date-and-sequence filename maps to the Job’s ISO-week-unique report identity so the PO can approve one consistent naming and update policy.`
- F003 \[minor/vp-pm-plan-feasibility; line=91; anchor=`"| 期間の終点       | 金曜 17 時以降の記録の扱いが未決であり、完了事項の境界を判定できない                                           | PO が終点を決め、QE が境界の期待結果を確かめるまで週末の記録の扱いを受入対象外とする      |"`; cause=document\]: `Add a target date or review point for the unresolved follow-up actions so the PM can schedule and track them.`
- F004 \[minor/vp-pm-dependency-risk; line=91; anchor=`"| 期間の終点       | 金曜 17 時以降の記録の扱いが未決であり、完了事項の境界を判定できない                                           | PO が終点を決め、QE が境界の期待結果を確かめるまで週末の記録の扱いを受入対象外とする      |"`; cause=document\]: `State whether the listed open issues require PJR registration or affect scheduled work, so the PM can route and track their project-level impact.`
- F005 \[minor/vp-pm-control-reporting; line=91; anchor=`"| 期間の終点       | 金曜 17 時以降の記録の扱いが未決であり、完了事項の境界を判定できない                                           | PO が終点を決め、QE が境界の期待結果を確かめるまで週末の記録の扱いを受入対象外とする      |"`; cause=document\]: `Identify the reporting destination and which persistent issues should be transferred to the project register, including their tracking references.`
- F006 \[minor/vp-ba-requirements-completeness; line=23; anchor=``"- 再出力: 同じ週の再実行は同じ Job Run の再試行として扱い、別の報告を増やさない。手動では `exec run --job job-weekly-report` に期間を渡して作成できる。"``; cause=document\]: `Specify the reporting period’s end boundary so users can determine which records and work belong in the report.`
- F007 \[minor/vp-dev-implementation-readiness; line=91; anchor=`"| 期間の終点       | 金曜 17 時以降の記録の扱いが未決であり、完了事項の境界を判定できない                                           | PO が終点を決め、QE が境界の期待結果を確かめるまで週末の記録の扱いを受入対象外とする      |"`; cause=document\]: `Confirm and link the authoritative Job and routine definitions for report storage and execution so implementers can locate the complete inputs and behavior.`
- F008 \[minor/vp-dev-change-impact; line=91; anchor=`"| 期間の終点       | 金曜 17 時以降の記録の扱いが未決であり、完了事項の境界を判定できない                                           | PO が終点を決め、QE が境界の期待結果を確かめるまで週末の記録の扱いを受入対象外とする      |"`; cause=document\]: `Record the selected source of truth and affected definitions for the filename and integration-review issues so implementers can assess the required changes.`
- F009 \[minor/vp-dev-testability; line=23; anchor=``"- 再出力: 同じ週の再実行は同じ Job Run の再試行として扱い、別の報告を増やさない。手動では `exec run --job job-weekly-report` に期間を渡して作成できる。"``; cause=document\]: `Define the period-end rule and its expected inclusion behavior so QE can test records at the weekly boundary.`
- F010 \[minor/vp-qe-done-criteria; line=23; anchor=``"- 再出力: 同じ週の再実行は同じ Job Run の再試行として扱い、別の報告を増やさない。手動では `exec run --job job-weekly-report` に期間を渡して作成できる。"``; cause=document\]: `Resolve the period-end boundary so the report scope can be approved against an unambiguous set of records.`
- F011 \[minor/vp-qe-verifiability; line=23; anchor=``"- 再出力: 同じ週の再実行は同じ Job Run の再試行として扱い、別の報告を増やさない。手動では `exec run --job job-weekly-report` に期間を渡して作成できる。"``; cause=document\]: `Specify the period-end boundary and expected treatment of records after the Friday trigger to make boundary tests decidable.`
- F012 \[minor/vp-qe-omissions-consistency; line=23; anchor=``"- 再出力: 同じ週の再実行は同じ Job Run の再試行として扱い、別の報告を増やさない。手動では `exec run --job job-weekly-report` に期間を渡して作成できる。"``; cause=document\]: `Reconcile the ISO-week period definition with the Friday trigger by defining the reporting cutoff and its treatment of later records.`
- F013 \[minor/vp-ux-language-consistency; line=9; anchor=`"| 読み手                       | 利用目的                                           | 帳票から判断すること                                   |"`; cause=document\]: `Expand or link the role abbreviations at first use so future contributors can identify the responsibilities without relying on unstated role-code knowledge.`
- F014 \[minor/vp-ops-release-readiness; line=91; anchor=`"| 期間の終点       | 金曜 17 時以降の記録の扱いが未決であり、完了事項の境界を判定できない                                           | PO が終点を決め、QE が境界の期待結果を確かめるまで週末の記録の扱いを受入対象外とする      |"`; cause=document\]: `Resolve the reporting boundary and filename policy, or explicitly make them release-blocking conditions with a named approval point.`
- F015 \[minor/vp-ops-operability; line=36; anchor=`""`; cause=document\]: `Define how operators identify and update the report for a given ISO week, including the filename mapping, before enabling scheduled operation.`
- F016 \[major/vp-qe-config-validity; line=26; anchor=``"_ASSUMPTION_: 現在 `rtn-weekly-report` は `enabled: false` のサンプル定義であり、定期起動では報告が作られない。本書は有効化後の動作を記述する。"``; cause=document\]: `未解決の _TODO_ / _ASSUMPTION_ が残っています。`

`cause` は原因の所在を示す。`kata:<kind>` の指摘も成果物側の修正が必要なため、この plan に載るすべての指摘を扱う。Kata の手入れは対応する maintenance の段で行う。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。加えて、下記「実装エビデンスと未作成の依存」に列挙した実装の根拠を読み取り専用で参照する。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書・実装や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 実装エビデンスと未作成の依存

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の実装の根拠である。`targets`、変更許可範囲、commit 対象には含めない。

- `src/routine/storage.ts`（implementation）: 進捗報告の出力先と routine の実行記録の保存の規則
- `src/routine/definition.ts`（implementation）: 進捗報告を作る routine の定義の読込・検証

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

- 利用目的・読み手・表示項目・出力の時期が業務観点で記述されていること
- 報告の範囲と業務的妥当性を承認できること
- 報告の内容を記録から確かめるテストの設計に活用できること

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

- T-KATA-WAVE-2-bds-progress-report-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）
- 最新の grade の未充足の完了条件と major の指摘を取り込み、本文の未決の目印を片付ける（決められないものは留保として追跡先をつなぐ）

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く（留保の範囲だけが未充足として残る場合は、その理由を書く）。
- 本文の未決の目印（`_TODO_`・`_ASSUMPTION_`・`_UNDECIDED_`）は、決められるものは決め、決められないものは期限付きの留保として追跡先をつなぐ。
- 成果物の `status` は変えない（確定は人が 140 で行う）。
- 報告の期間の終わりの境界（いつまでの記録を含めるか）を定め、PO が範囲を承認できる。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
