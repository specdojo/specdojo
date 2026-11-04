---
specdojo:
  id: prj-0001:xep-pjr-1799-20261104t233955z-38d13e06
  type: exec-plan
  rulebook: none
  task_id: PJR-1799
  name: "stsd-task-execution を現行の実装をもとに下書きする"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: BA
  approach: draft
  targets:
    - prj-0001:stsd-task-execution
---

# Edit Plan: PJR-1799

## 1. このフェーズで行うこと

stsd の試行（3APD）の段 2。代表の 1 件 stsd-task-execution を、現行の実装（src/exec のイベントと状態の導出）をもとに draft で下書きする

## 2. 対象成果物

- `name`: ステータス定義（タスク実行）
- `depends_on`:
  - [[bdd-exec-state]]
  - [[bdd-exec-event]]
- `based_on`（対象成果物の frontmatter）: [[prj-0001:bdd-exec-state]]、[[prj-0001:bdd-exec-event]]
- 個票の `入力`: 下記「個票の入力（前提）」を参照。
- `overview`: タスク実行が取り得る状態（todo / ready / doing / blocked / done / cancelled）と状態遷移を一覧・図で定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/pjr-1799-20261104T233955Z-38d13e06-result.md`

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

- rulebook（構造・必須要素・禁止事項）: `docs/ja/specdojo/rulebooks/stsd-rulebook.md`
- 併せて適用する rulebook（記法など）: `docs/ja/specdojo/rulebooks/stsd-mermaid-rulebook.md`
- recipe（問い・組み立て方）: `docs/ja/specdojo/recipes/stsd-recipe.md`
- sample（完成例の粒度・文体・表現）: `docs/ja/specdojo/samples/stsd-sample.md`
- template（開始時の雛形）: `docs/ja/specdojo/templates/stsd-template.md`
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

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- 業務仕様は現行の実装をもとに記述する（2026-11-04 利用者の方針）
- カタログの根拠は src/exec/events.ts（イベント列から状態を再構成し、依存の充足から ready を導く）と src/exec/types.ts（ExecState・ExecEventType）。状態は todo / ready / doing / blocked / done / cancelled（PJR-FMYK）
- `based_on` の bdd-exec-state・bdd-exec-event はまだない

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- [[stsd-task-execution]] の `_TODO_` とプレースホルダー（`_STATE_CODE_` など）を、現行の実装（`src/exec/events.ts`・`src/exec/types.ts` と、それらが使う状態の導出）をもとに埋めている。状態一覧には todo / ready / doing / blocked / done / cancelled が載り、`ready` が記録された状態ではなく依存の充足から導かれることが分かる。
- 遷移の説明の各行が、実装のイベントの種類（`ExecEventType`）と対応している。実装で確かめられないことは推測で埋めず、`_UNDECIDED_` で残して理由を書く。
- 状態遷移図は Mermaid の `stateDiagram-v2` で、状態一覧の全状態を含み、lint-mermaid を通る。
- `docs/ja/product/010-business-specs/020-data-model/stsd-task-execution.md` 以外の成果物と Kata は変えていない。Kata に直すべき点を見つけた場合は、変えずに個票の対応結果に書く。
- `npm run -s lint:md` と `npm run -s lint:fm` が通っている。

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
