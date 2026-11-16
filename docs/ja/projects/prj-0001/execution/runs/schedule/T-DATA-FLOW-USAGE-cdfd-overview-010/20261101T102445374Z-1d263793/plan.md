---
specdojo:
  id: prj-0001:xep-t-data-flow-usage-cdfd-overview-010
  type: exec-plan
  rulebook: none
  task_id: T-DATA-FLOW-USAGE-cdfd-overview-010
  name: "全体概要の改訂・ユースケース CDFD の書き直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  on_critical_path: true
  approach: fully-guided
  targets:
    - cdfd-overview
---

# Edit Plan: T-DATA-FLOW-USAGE-cdfd-overview-010

## 1. このフェーズで行うこと

PJR-SJQC の決定に基づき、cdfd-overview は共通・基盤と 3 系統の関係を描く形へ改訂し、
cdfd-uc-register はプロセス領域の単位と入口のイベント（未整理事項の発見など）を描く形へ
書き直す。既存の草案記述と Kata（cdfd-overview-rulebook / cdfd-uc-rulebook）を尊重し、
fully-guided で磨き込む。

## 2. 対象成果物

- `name`: 概念データフロー図（全体概要）
- `depends_on`:  -
- `based_on`（対象成果物の frontmatter）: なし
- 個票の `入力`: なし
- `overview`: SpecDojo を活用したプロジェクト運営について、共通・基盤（Onboarding、Kata、稼働構成、非推奨化）と register 系・schedule 系・routine 系の関係、および register と schedule が epic と track でつながる全体関係、routine が Job を通じて両者を動かす関係を可視化し定義する
- `path`: `docs/ja/product/010-business-specs/010-data-flow/cdfd-overview.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-USAGE-cdfd-overview-010-result.md`

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

- rulebook: `docs/ja/specdojo/rulebooks/cdfd-overview-rulebook.md`
- 併せて適用する rulebook（記法など）: `docs/ja/specdojo/rulebooks/cdfd-mermaid-rulebook.md`, `docs/ja/specdojo/rulebooks/cdfd-d2-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/cdfd-overview-recipe.md`
- sample: `docs/ja/specdojo/samples/cdfd-overview-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。複数の文書間で記述に矛盾がある場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[major/vp-po-decision-readiness; line=17; anchor=`"業務は 14 のプロセス領域に分かれ、六つのプロセスグループにまとめる。受け渡しは「概念データフロー（概要）」の図を正本とする。主な担当は [[prj-0001:pm-roles|ロール一覧]] の Role code に統一する。"`\]: `PO が承認対象とする境界は示されているが、現行 14 領域・六グループに対する承認状態、未解決の Action の文書間不整合、その影響と差し戻し時の次アクションが明示されず、承認・保留・差し戻しを判断できない。`
- F002 \[major/vp-arc-cross-document-consistency; line=59; anchor=``"| `P-12` | 稼働構成管理 | SpecDojo の稼働構成を変更管理する。 | ARC | 稼働構成の変更要求が発生した |"``\]: ``本書は Action の主要入力を「参加者からの構成変更要求と承認結果」「参加者からの非推奨化の判断」とする一方、`cdfd-action` は承認結果と非推奨化判断を Action 内部で生成しており、人間の判断境界を統一する必要がある。``
- F003 \[minor/vp-arc-cross-document-consistency; line=205; anchor=`"Kata -->|\"rulebook・template\"| Plan"`\]: ``本書の Plan は Kata からの入力と図 5.2 のエッジを「rulebook・template」とする一方、`cdfd-plan.md` は P-04 のスケジュール戦略定義で「Kata grade・作成要件」を必須入力としているため, Plan の主要入力とエッジへ Kata grade を反映する必要がある。``
- F004 \[minor/vp-arc-cross-document-consistency; line=210; anchor=`"Catalog -->|\"完了条件・rulebook 参照\"| Orchestrator"`\]: ``本書は Orchestrator の成果物カタログ入力を「完了条件・rulebook 参照」とする一方、`cdfd-orchestrator.md` は `done_criteria`・`evidence_refs` を参照して要求を判定するため、成果物カタログから受け取る根拠情報の名称を統一する必要がある。``
- F005 \[major/vp-qe-done-criteria; line=17; anchor=`"業務は 14 のプロセス領域に分かれ、六つのプロセスグループにまとめる。受け渡しは「概念データフロー（概要）」の図を正本とする。主な担当は [[prj-0001:pm-roles|ロール一覧]] の Role code に統一する。"`\]: `DC-002（PO による対象範囲と領域分割の承認）を満たす承認記録が特定できず、未充足である。`
- F006 \[major/vp-qe-omissions-consistency; line=17; anchor=`"業務は 14 のプロセス領域に分かれ、六つのプロセスグループにまとめる。受け渡しは「概念データフロー（概要）」の図を正本とする。主な担当は [[prj-0001:pm-roles|ロール一覧]] の Role code に統一する。"`\]: `現行の 14 領域・六グループへの改訂を PO が承認した記録を特定できず、現在の境界に対する承認記録を追加する必要がある。`
- F007 \[major/vp-ops-release-readiness; line=5; anchor=`"## 1. 目的"`\]: ``現行 14 領域・六グループに対する PO 承認記録がなく、Action の major な文書間不整合も残るため、`status: ready` の公開・配布判断を裏付ける前提が満たされていない。``

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

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

- 共通・基盤（Onboarding、Kata、稼働構成、非推奨化）と register 系・schedule 系・routine 系の関係、および 14 のプロセス領域とデータストアの流れが表と図で確認できること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [PO] register と schedule が epic と track でつながる全体関係、および routine が Job を通じて両者を動かす業務境界を承認できること
- [ARC] プロセス領域の表・データストアの表・凡例が整理され、各系統の入口イベントと詳細 3 文書（cdfd-uc-register、cdfd-uc-schedule、cdfd-uc-routine）への構成方針として参照できること
- [QE] 共通・基盤と 3 系統の詳細 CDFD への分割に重複または欠落がないことを、詳細 CDFD 一覧と各領域の対応で確認できること

## 6. 完了手順

1. 「このフェーズで行うこと」と「進め方」に従って成果物を更新する。
2. 「完了の狙い」を満たしているかを確認し、不足があれば加筆・補強する（観点別の自己レビューや再確認ループは行わない）。
3. 共通規約に従って、必要な整形・静的検査を実行する。
4. result に実施内容・変更ファイル・進め方と実践の型の適用を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 7. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 共通: 記法・成果物規約

作業を始める前に、共通の規約の詳細 `docs/ja/specdojo/exec-templates/xep-common-conventions-template.md` を読み、その内容に従う。次の箇条書きは、そのうち守らないと失敗に直結する要点である。

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
