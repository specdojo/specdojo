---
specdojo:
  id: prj-0001:xep-t-data-flow-usage-cdfd-uc-routine-010
  type: exec-plan
  rulebook: none
  task_id: T-DATA-FLOW-USAGE-cdfd-uc-routine-010
  name: "系統別詳細 CDFD のドラフト新規作成"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  on_critical_path: true
  approach: draft
  targets:
    - cdfd-uc-routine
---

# Edit Plan: T-DATA-FLOW-USAGE-cdfd-uc-routine-010

## 1. このフェーズで行うこと

PJR-SJQC の決定に基づき、cdfd-overview と Kata（cdfd-uc-rulebook / sample / template）を
骨組みにして、系統別詳細 CDFD（schedule 系・routine 系）をドラフト作成する。
プロセス領域の単位、入口のイベント、データストアとの読み書きを定義する。
プロセス領域の区分・名称・起点イベントの文言は cdfd-overview の「プロセス領域」の章（7 区分）と
同じにし、実行サイクル（P-07・P-08・P-11）と Orchestrator（P-14）は 3 系統が共用する領域として
同じ領域 ID・名称で描き、内部を複製しない。routine 系の入口の起点イベントは、定義のきっかけ
ではなく Orchestrator（P-14）の「PDCA の各サイクルが到来した」とする（PJR-SJQC）。
図は cdfd-d2-rulebook に従い direction: down、プロセスは上から P・D・C・A の順に並べ、
配色と凡例は cdfd-overview の凡例を参照して再掲しない。本文は表を中心に端的に書く。
cdfd-uc-schedule は cdfd-uc-deliverable を引き継ぐ新しい ID であり、cdfd-uc-deliverable は変えない。

## 2. 対象成果物

- `name`: 概念データフロー図（定期処理・自動運転）
- `depends_on`:
  - [[cdfd-overview]]
- `based_on`（対象成果物の frontmatter）: なし
- 個票の `入力`: なし
- `overview`: Orchestrator による PDCA 到来から定期実行判定、Job によるタスク生成・委譲、自動実行、状態更新までの routine 系の流れを、プロセス領域の単位と入口のイベントを含めて可視化し定義する
- `path`: `docs/ja/product/010-business-specs/010-data-flow/cdfd-uc-routine.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/T-DATA-FLOW-USAGE-cdfd-uc-routine-010-result.md`

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

draft は、文脈で任された範囲を調べて成果物を下書きする進め方である。雛形に人が記入した文脈を読み、調査・選定を任された範囲と、既に決まっている前提を区別する。未作成なら template を骨組みにし、既存の下書きがあればそれを尊重して加筆する。必要な型の新規整備は本タスクの範囲に含めず、申し送る。

人による文脈の記入が無い場合も、未作成なら template から下書きする。rulebook / recipe / sample と宣言された先行成果物・前提で根拠を確認できる内容を埋め、文脈が無いことを調査・選定の委任とは解釈しない。根拠のない値や未委任の判断は _TODO_ / _ASSUMPTION_ と次のアクションを残す。

### 4.1. 参照範囲

次の文書・情報を実際に読み込む。宣言の無い項目は推測で補わない。

- rulebook（構造・必須要素・禁止事項）: `docs/ja/specdojo/rulebooks/cdfd-uc-rulebook.md`
- 併せて適用する rulebook（記法など）: `docs/ja/specdojo/rulebooks/cdfd-mermaid-rulebook.md`, `docs/ja/specdojo/rulebooks/cdfd-d2-rulebook.md`
- recipe（問い・組み立て方）: `docs/ja/specdojo/recipes/cdfd-uc-recipe.md`
- sample（完成例の粒度・文体・表現）: `docs/ja/specdojo/samples/cdfd-uc-sample.md`
- template（開始時の雛形）: `docs/ja/specdojo/templates/cdfd-uc-template.md`
- 対象成果物の `depends_on` 成果物と frontmatter の `based_on`（「対象成果物」に表示）。
- プロジェクトコンテキスト（`project_context`）。
- 個票の `入力` とカタログの `brief`（「対象成果物」に表示。値が無いときは載せない）。
- 対象成果物内の文脈（`_CONTEXT_:` など、人が記入した指示）。
- 文脈で任された調査・選定に必要な外部の情報（出典つき）。

rulebook を構造の基準とし、文書間に矛盾がある場合は rulebook を正とする。sample は形式の参考とし、その業務内容・固有名詞・値を対象成果物の事実として転記しない。`_MISSING_` は未宣言・未整備または非適用を示す。必要な型の欠落や内容の薄さは result に記録し、存在する型・対象成果物・上記の文脈を用いて進める。

### 4.2. 調査・下書きと具体化の許可

1. 文脈から、対象成果物の責務、固定された前提、調査・選定を任された範囲を特定する。指示が曖昧なら、任されていない範囲まで選定を広げない。
2. 文脈で任された範囲に限り「根拠のない具体化の禁止」を外し、外部の情報を調べて値を決めてよい。技術・設定値などを選ぶ場合は、出典を確認し、対象の前提と選定理由を説明する。
3. 選んだ値は成果物で「提案」と分かる形で示す。既存の決定事項や実装済みの事実として断定しない。出典と選定理由を result の `進め方と実践の型の適用` セクションに残す。
4. 任されていない範囲は従来どおり _TODO_ / _ASSUMPTION_ で残し、不足する根拠と次のアクションを記録する。外部調査で得た情報を理由に、未委任の業務判断や将来方針を決めない。
5. 成果物内の `_CONTEXT_:` は、指示を本文へ反映したら目印と元の指示を消し、元の指示を result に写す。元の指示と反映箇所を対にして記録する。executor / reporter pipeline では、元の指示と反映箇所を報告の `handoff` に書き、reporter と runner が result へ転記する。反映できない指示は削除せず、未反映の理由と次の行動を記録する。

### grade result から展開された finding

- なし

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result に記録する。grade result サイドカーは本タスクでは直接編集しない。

### 4.3. 判断根拠の記録

result の `進め方と実践の型の適用` セクションに、任された範囲、参照した型と文脈、選んだ提案値ごとの出典と選定理由、本文へ反映した元の指示、未決事項を記録する。外部の情報には URL・文書名など、後から出典へ到達できる情報を付ける。下書きの後は fully-guided で磨き込み、finalize で人が確定する。

## 5. 完了の狙い

この成果物が満たすべき狙い（成果物カタログの `done_criteria`）を、owner ロールの狙いと下流ロールの入力適合に分けて示す。「進め方」に従って実践の型に沿って記述する中で、owner の狙いを作成目標として満たすことを目指す。下流ロールの項目は、その文書から各ロールが自分の責務の成果物を作成できるよう入力として最低限成立させる範囲にとどめ、各ロールの内容を成果物に作り込まない（一文書一責務）。下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる。

owner として達成する狙い:

- Orchestrator のサイクル到来イベントから routine 定義判定、Job Run 生成、register/schedule への委譲、自動実行、状態記録までの routine 系の流れが、プロセス領域の単位で表と図で確認できること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [ARC] 各プロセス領域とデータストア（定期実行定義、ジョブ定義、Job Run、実行記録、稼働構成など）の読み書き、および委譲先（register/schedule）との境界が識別できること
- [QE] busy 時のスキップ、利用制限、重複実行防止、取りこぼし検知などの分岐と次回判定の記録が確認できること
- [PO] 自動運転の許容範囲、人間による停止・再開介入の境界が承認できること

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
