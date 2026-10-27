---
specdojo:
  id: prj-0001:xep-pjr-evae-20261027t131038z-cd540a5d
  type: exec-plan
  rulebook: none
  task_id: PJR-EVAE
  name: "tsd-sample を新しい tsd-rulebook に合わせて見直す"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:tsd-sample
---

# Edit Plan: PJR-EVAE

## 1. このフェーズで行うこと

tsd-sample は技術の一覧を並べる初期の作りのままで、見直した tsd-rulebook の技術領域ごとの詳細定義（構成、採用設定、導入、動作確認、継続利用）と合っていない。rulebook に沿った完成例に作り直す。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: _MISSING_
- `depends_on`:  _MISSING_
- `overview`: _MISSING_
- `path`: `_MISSING_`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/pjr-evae-20261027T131038Z-cd540a5d-result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/tsd-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の反復、一般論、表と本文の内容重複、正本からの過剰な再掲がないか。判断に必要な背景、制約、例外、done_criteria が残されていれば下限を満たしているとする。長さだけでは fail にせず、削除または統合しても判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 [major/vp-po-purpose-alignment; line=3; anchor="## 1. 目的と適用範囲"]: 記載された目的はドメイン固有の技術詳細の定義ではなくスタックのインベントリを定義しており、ルールブックの意図されたスコープと矛盾しています。
- F002 [major/vp-po-decision-readiness; line=26; anchor="## 5. 未解決事項"]: セクション5には、承認または延期の決定に必要な意思決定基準、ステークホルダーへの影響分析、および実行可能な次のステップが不足しています。
- F003 [minor/vp-po-publication-accountability; line=13; anchor="## 3. 記述内容"]: サンプルではセクション3において責任ある役割を必須の視点としてリストしていますが、例の内容に所有権や承認の責任が含まれていません。
- F004 [major/vp-pm-plan-feasibility; line=18; anchor="## 4. 最小記述例"]: ドキュメントには、タスクの分解と計画に必要な実行可能なセットアップ手順、前提条件、完了基準、および役割の割り当てが不足しています。
- F005 [major/vp-pm-dependency-risk; line=7; anchor="## 2. 入力情報"]: 技術的な依存関係、環境の制約、およびアーキテクチャのリスクが、入力またはコンテンツのセクションで特定されていません。
- F006 [minor/vp-pm-control-reporting; line=26; anchor="## 5. 未解決事項"]: セクション5では未解決の問題を表に分けていますが、追跡候補、報告対象、および割り当てられた役割コードが不足しています。
- F007 [major/vp-ba-business-value; line=7; anchor="## 2. 入力情報"]: サンプルでは、テクノロジースタックの選択を正当化するビジネス上の問題、運用上の利点、またはユーザー価値が説明されていません。
- F008 [major/vp-ba-requirements-completeness; line=7; anchor="## 2. 入力情報"]: ドキュメントには、ユーザーから見える要件、受け入れ条件、明示的なスコープの境界、および除外の定義が不足しています。
- F009 [major/vp-ba-stakeholder-clarity; line=7; anchor="## 2. 入力情報"]: 対象となるステークホルダー、オペレーター、レビュワー、および合意の参加者が明確に特定されていません。
- F010 [major/vp-arc-technical-constraints; line=13; anchor="## 3. 記述内容"]: 不可欠な技術的制約、バージョン仕様、ランタイムの依存関係、およびアーキテクチャのパラメータが完全に欠落しています。
- F011 [minor/vp-arc-conciseness; line=18; anchor="## 4. 最小記述例"]: セクション1、3、および4では、実質的な情報を提供することなく、テクノロジのカテゴリに関する一般的な説明が重複して繰り返されています。
- F012 [blocker/vp-arc-single-responsibility; line=1; anchor=`# [技術スタック一覧](../rulebooks/tsd-rulebook.md) サンプル`]: 特定領域詳細定義のサンプルとしての責務を放棄し、インデックス形式のメタ記述となっており、主題と責務が乖離している。
- F013 [blocker/vp-dev-implementation-readiness; line=18; anchor="## 4. 最小記述例"]: 具体的なセットアップコマンド、設定パラメータ、および環境の前提条件が完全に欠落しており、実装ができません。
- F014 [major/vp-dev-change-impact; line=18; anchor="## 4. 最小記述例"]: ドキュメントには、技術スタックを変更する際の、影響の範囲、スキーマ/パイプラインへの影響、または互換性の検討事項が記載されていません。
- F015 [blocker/vp-dev-testability; line=18; anchor="## 4. 最小記述例"]: 設定されたテクノロジースタックの正当性を検証するためのテストコマンド、検証手順、または期待される出力が指定されていません。
- F016 [blocker/vp-qe-verifiability; line=26; anchor="## 5. 未解決事項"]: TSD詳細定義に必須となる具体的な設定値や動作確認手順などの検証可能な基準が全く記載されていない。
- F017 [blocker/vp-qe-omissions-consistency; line=3; anchor="## 1. 目的と適用範囲"]: ID `specdojo:tsd-sample` は rulebook で規定された `tsd-＜term＞` パターン（例: `tsd-ollama`）に準拠していない。
- F018 [blocker/vp-qe-omissions-consistency; line=4; anchor=""]: Frontmatter の `type` が `architecture` ではなく `project` となっており、かつ必須項目 `part_of` が欠落している。
- F019 [blocker/vp-qe-kata-conformance; line=1; anchor=`# [技術スタック一覧](../rulebooks/tsd-rulebook.md) サンプル`]: rulebook が定義する「特定領域詳細定義」の構成を無視し、「技術スタック一覧（インデックス）」の構成となっており、種別としての責務を守っていない。
- F020 [blocker/vp-ux-readability; line=1; anchor=`# [技術スタック一覧](../rulebooks/tsd-rulebook.md) サンプル`]: 詳細定義のサンプルとして機能しておらず, 読者が正解となる記述形式を理解できないため、実用上の blocker となる。
- F021 [major/vp-ux-language-consistency; line=1; anchor=`# [技術スタック一覧](../rulebooks/tsd-rulebook.md) サンプル`]: The document title '技術スタック一覧' contradicts the governing rulebook's terminology '特定領域 技術スタック詳細定義（TSD）', causing terminology confusion.
- F022 [major/vp-ops-release-readiness; line=26; anchor="## 5. 未解決事項"]: ready ステータスを達成するための基準と、未解決事項に対する具体的な解決経路が定義されていません。
- F023 [major/vp-ops-operability; line=18; anchor="## 4. 最小記述例"]: メンテナンス手順、運用のトラブルシューティングガイダンス、およびアップデートのワークフローが省略されています。

1. 見直し対象の sample を読み込み、現状の粒度・文体・表の書き方を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 sample の frontmatter から辿れる rulebook と recipe、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。rulebook との構成不整合を指摘する finding では、成果物の有無にかかわらず rulebook を正として照合する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが完成例として適切かを見直す。
5. rulebook の必須項目・禁止事項を満たす最小の記述例になるよう再構成し、実成果物の丸写しを避ける。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した sample は [[specdojo:sample-authoring-standard]]（構成・記述ルール・禁止事項の正本）に従う。rulebook / recipe と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な sample メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 sample から辿れる rulebook / recipe、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で sample を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の sample が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って sample を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

1. `docs/ja/specdojo/samples/tsd-sample.md` を、[[specdojo:tsd-rulebook]] の必須の本文要件（概要・位置づけ、対象環境・前提条件、採用技術・設定、動作確認、制約・トラブルシュート）を満たす完成例に作り直す。条件付きの本文要件は、題材に必要なものだけを含める。
2. 題材は、PJR-9SXH で `specdojo:tsd-index-sample` が `tsd-sample` の題材に決めた技術領域とする。
3. frontmatter の `type` を、[[prj-0001:pjr-xsm8-sample-maintenance-target-kind]] の原則に従い rulebook の推奨値 `architecture` に直す。`part_of` に `specdojo:tsd-index-sample` を入れる。`id` は変えない。
4. rulebook の記述ガイドに沿い、採用値・推奨値・未決事項を区別する。採用設定の表に反映・確認方法を含め、動作確認の表（確認対象・実行場所・期待結果・失敗時の確認先）を設ける。秘密値は記載せず、プレースホルダーで示す。
5. [[specdojo:sample-authoring-standard]] に従う。`tsd-index-sample.md` は変更しない。食い違いを見つけた場合は、本個票の対応結果と pipeline の報告の `handoff` に書く。
6. `npm run lint:md`・`npm run lint:fm` と、親の検証が通る。
7. `CHANGELOG.md` の未公開の版の節に変更を書く。公開済みの版の節は変えない。

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
