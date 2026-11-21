---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-utc-sample-050-20261121t110214z-2c3b1615
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-utc-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:utc-sample
    - specdojo:utc-sample
---

# Edit Plan: T-KATA-WAVE-3-utc-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 単体テスト（対象別）の完成例
- `depends_on`:
  - [[specdojo:utc-index-sample]]
- `overview`: 駄菓子屋の販売管理システムの 1 対象を題材に、単体テストの対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/utc-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-utc-sample-050/T-KATA-WAVE-3-utc-sample-050-20261121T110214Z-2c3b1615/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/utc-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **QE（Quality Engineer）**
- 責務: 成果物と参考資料の品質基準、レビュー観点、schema 適合、文書間整合を確認する。

このロールが重視するレビュー観点:

- done_criteria 充足: 成果物カタログの done_criteria を満たしているか、未充足条件が明示されているか。
- 検証可能性: 成功基準、受入条件、品質基準、設定値が pass / fail を判定できる表現になっているか。
- 抜け漏れ・矛盾: 必須章、必須キー、参照、責務、禁止事項に抜け漏れや矛盾がないか。
- 設定値の妥当性: 設定値・必須キー・参照が schema と整合し、妥当な値で過不足なく定義されているか。
- 実践の型としての適合性: rulebook、recipe、sample、template が種別ごとの責務を守り、Kata 内部、Kata 相互、および参照する組織定義や生成物を含む適用先との関係が矛盾なく定義されているか。Kata に関するこれらの整合はこの観点で判定し、vp-arc-cross-document-consistency では扱わない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-po-purpose-alignment; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `ドキュメントは対象システムの具体的なスコープとテスト目的を定義できておらず、上流プロジェクトの目標との整合性が取れていません。`
- F002 \[major/vp-po-decision-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決事項のセクションには、POの承認に必要な具体的な意思決定ポイント、影響分析、および割り当てられた意思決定者が不足しています。`
- F003 \[minor/vp-po-publication-accountability; line=1; anchor=`"# [単体テスト対象別](../rulebooks/utc-rulebook.md) サンプル"`\]: `人間の承認責任、および公開やサンプルの採用に関する明確な基準が文書化されていません。`
- F004 \[major/vp-pm-plan-feasibility; line=7; anchor=`"## 2. 入力情報"`\]: `ドキュメントには、ユニットテストの計画と見積もりに必要なタスク分解、作業単位、完了基準、および割り当てられたロールコードが不足しています。`
- F005 \[major/vp-pm-dependency-risk; line=1; anchor=`"# [単体テスト対象別](../rulebooks/utc-rulebook.md) サンプル"`\]: `Upstream dependencies (e.g., tsp-index, utc-index) and downstream implementation risks are missing from both Frontmatter and the body.`
- F006 \[minor/vp-pm-control-reporting; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決事項のテーブルには、プロジェクト管理に必要な担当ロールコードと報告チャネルが不足しています。`
- F007 \[major/vp-ba-business-value; line=7; anchor=`"## 2. 入力情報"`\]: `サンプルでは、対象となるユーザーのドメインの問題や、ユニットテストによって保証されるビジネス価値について説明されていません。`
- F008 \[major/vp-ba-requirements-completeness; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `対象ドメインの機能要件と受け入れ基準が完全に欠落しています。`
- F009 \[major/vp-ba-requirements-completeness; line=7; anchor=`"## 2. 入力情報"`\]: `スコープ内およびスコープ外の境界が、ステークホルダーによって検証可能なレベルで指定されていません。`
- F010 \[minor/vp-ba-stakeholder-clarity; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `ドキュメントでは、このカタログの意図されたステークホルダー、レビュアー、または利用者が明確に特定されていません。`
- F011 \[major/vp-arc-technical-constraints; line=13; anchor=`"## 3. 記述内容"`\]: `技術的な境界、依存関係、および分離戦略（mockやstubなど）が定義されていません。`
- F012 \[minor/vp-arc-conciseness; line=18; anchor=`"## 4. 最小記述例"`\]: `セクション 3 の箇条書きが、セクション 4 のテーブル内でそのまま重複して繰り返されています。`
- F013 \[major/vp-arc-single-responsibility; line=1; anchor=`"# [単体テスト対象別](../rulebooks/utc-rulebook.md) サンプル"`\]: `ドキュメントはメタレベルの補足説明と具体的なサンプルアーティファクトを混同しており、UTCサンプルの単一責任を果たせていません。`
- F014 \[major/vp-dev-implementation-readiness; line=13; anchor=`"## 3. 記述内容"`\]: `テスト実装に必要な具体的な技術的インターフェース、関数、および入力が完全に欠落しています。`
- F015 \[major/vp-dev-implementation-readiness; line=18; anchor=`"## 4. 最小記述例"`\]: `開発者がテストコードを書くための、実行可能なテストケースやセットアップ条件が提供されていません。`
- F016 \[major/vp-dev-change-impact; line=7; anchor=`"## 2. 入力情報"`\]: `仕様書とコードコンポーネントへのトレーサビリティリンクが欠落しており、変更の影響分析ができません。`
- F017 \[major/vp-dev-testability; line=18; anchor=`"## 4. 最小記述例"`\]: `実行コマンド、テストフレームワーク、および検証手順が指定されていません。`
- F018 \[major/vp-qe-verifiability; line=1; anchor=`"# [単体テスト対象別](../rulebooks/utc-rulebook.md) サンプル"`\]: `具体的なテストケースと判定可能な期待値の記述例がなく、検証可能性の提示がなされていない。`
- F019 \[blocker/vp-qe-omissions-consistency; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `ルールブックで規定された必須の本文構成 (概要〜テスト観点とケース) がすべて欠落している。`
- F020 \[minor/vp-qe-omissions-consistency; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `「必須観点: 対象、条件、判定基準、責任者」は utc-rulebook に定義がなく、rulebook の観点（責務を分解した切り口）やケース表の必須カラムと矛盾するため、削除するか rulebook の定義に合わせる必要がある。`
- F021 \[blocker/vp-qe-kata-conformance; line=1; anchor=`"# [単体テスト対象別](../rulebooks/utc-rulebook.md) サンプル"`\]: `ルールブックの標準テンプレートに従っておらず、UTC サンプルとしての正当な構成を満たしていない。`
- F022 \[major/vp-qe-kata-conformance; line=1; anchor=`"# [単体テスト対象別](../rulebooks/utc-rulebook.md) サンプル"`\]: ``前回指摘のうち type・title・ID 形式は rulebook と metadata 標準に適合しており誤りだったが、rulebook が推奨する `based_on: [tsp-index, utc-index]` が Frontmatter に欠けているため追加が必要である。``
- F023 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# [単体テスト対象別](../rulebooks/utc-rulebook.md) サンプル"`\]: `H1 は rulebook の規定「単体テストカタログ: ＜対象名＞」形式に従わず rulebook への Markdown リンクを含んでいるため、駄菓子屋の具体的な対象名を用いた規定形式に改める必要がある。`
- F024 \[major/vp-ux-readability; line=1; anchor=`"# [単体テスト対象別](../rulebooks/utc-rulebook.md) サンプル"`\]: `ルールブックの構成と乖離しており, 正しく適用する方法を理解させるためのガイドとして機能していない。`
- F025 \[minor/vp-ux-language-consistency; line=20; anchor=`"| 項目         | 値                                                                         | 備考                                 |"`\]: `Section 4 uses non-standard table headers ('ドキュメント', '主な内容') that diverge from the standardized vocabulary in utc-rulebook.`
- F026 \[minor/vp-ux-language-consistency; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `「必須観点」の「観点」が rulebook の定義（責務を分解した切り口）と異なる意味で使われているため、用語を rulebook に合わせる必要がある。`
- F027 \[major/vp-ops-release-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `ドキュメントをドラフトから準備完了状態に移行するために必要な、明確な準備基準と前提条件のチェックポイントが不足しています。`
- F028 \[minor/vp-ops-operability; line=1; anchor=`"# [単体テスト対象別](../rulebooks/utc-rulebook.md) サンプル"`\]: `将来のルールブックの変更に合わせてサンプルを維持および同期するための運用ガイダンスが提供されていません。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

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

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
