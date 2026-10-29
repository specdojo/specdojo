---
specdojo:
  id: prj-0001:xep-pjr-9sxh-20261027t124444z-ad0d65a8
  type: exec-plan
  rulebook: none
  task_id: PJR-9SXH
  name: "tsd-index-sample を新しい tsd-index-rulebook に合わせて見直す"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:tsd-index-sample
---

# Edit Plan: PJR-9SXH

## 1. このフェーズで行うこと

tsd-index-sample を、見直した tsd-index-rulebook の技術スタック一覧の列（区分、採用技術、担当責務、版・正本、適用範囲）と参照の要件に合わせて見直す。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 技術スタック定義（全体構成）
- `depends_on`:  -
- `overview`: SpecDojoが採用する技術の全体インベントリ（既存文書、retrofit対象）
- `path`: `docs/ja/product/030-architecture/020-infrastructure/tsd-index.md`
- `result`: `docs/ja/projects/prj-0001/execution/exec/results/pjr-9sxh-20261027T124444Z-ad0d65a8-result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/tsd-index-sample.md`
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

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 [major/vp-qe-omissions-consistency; line=20; anchor="- DB の詳細設定・バージョン固定手順は `tsd-database.md` を参照。"]: rulebook が要求する詳細文書へのリンクが欠落し、記載された2つの参照先も存在しないため、利用可能な Markdown リンクを設けるか、参照記述を現在の成果物構成に合わせて修正してください。
- F002 [major/vp-qe-kata-conformance; line=20; anchor="- DB の詳細設定・バージョン固定手順は `tsd-database.md` を参照。"]: 完成例の補足がファイル名のコード表記だけで、rulebook の「詳細ドキュメントへのリンクを記載する」を実演していないため、実在する sample 詳細文書への Markdown リンクとして提示してください。
- F003 [minor/vp-ux-readability; line=20; anchor="- DB の詳細設定・バージョン固定手順は `tsd-database.md` を参照。"]: 次に見る文書名は識別できるもののリンクとして移動できないため、参照先を Markdown リンクにして読者が詳細へ辿れるようにしてください。

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

1. `docs/ja/specdojo/samples/tsd-index-sample.md` が [[specdojo:tsd-index-rulebook]] の本文要件（冒頭の概要、技術スタック一覧、補足・詳細への導線）と、技術スタック一覧の列の要件（区分・採用技術・担当責務は必須、版・正本と適用範囲は条件付き）を満たす。
2. 実行基盤だけでなく、開発・検証・文書化・運用の技術を対象範囲に応じて含め、採用済みの必須構成と任意利用の構成を区別する。依存パッケージを網羅的に列挙しない。
3. 版の粒度を揃え、正確な版を管理する正本（lockfile など）を示す。
4. 技術構成が [[specdojo:sample-authoring-standard]] の `共通サンプル文脈`（駄菓子屋きぬやの販売管理）の規模に合うかを見直す。構成を変えた場合は、理由を本個票の対応結果に書く。
5. 補足から参照する詳細 TSD のうち 1 つを、`specdojo:tsd-sample`（PJR-EVAE）の題材として決める。題材とした詳細 TSD の名前と選んだ理由を本個票の対応結果に書く。
6. H1 を rulebook の名称に合わせ、「技術スタック一覧（TSD Index）サンプル」とする。
7. [[specdojo:sample-authoring-standard]] に従う。`tsd-sample.md` は変更しない。
8. `npm run lint:md`・`npm run lint:fm` と、親の検証が通る。
9. `CHANGELOG.md` の未公開の版の節に変更を書く。公開済みの版の節は変えない。

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
