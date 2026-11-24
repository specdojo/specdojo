---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-tsp-index-sample-050-20261121t082409z-61621b6d
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-tsp-index-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:tsp-index-sample
    - specdojo:tsp-index-sample
---

# Edit Plan: T-KATA-WAVE-3-tsp-index-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: テスト戦略・方針の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、テスト戦略・方針の完成例を示す
- `path`: `docs/ja/specdojo/samples/tsp-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-tsp-index-sample-050/T-KATA-WAVE-3-tsp-index-sample-050-20261121T082409Z-61621b6d/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/tsp-index-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、全体テストの考え方を示す（要件）ための最小サンプルである。"`\]: `サンプルでは、実際のテスト目的、品質目標、またはプロジェクトの目標に沿ったスコープが指定されておらず、メタレベルの記述のみが提供されています。`
- F002 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、全体テストの考え方を示す（要件）ための最小サンプルである。"`\]: ``「概要」として、駄菓子屋販売管理システムのどの品質（販売・在庫・つけ等）をどのテストレベルで担保するかを1〜3文で示し、`based_on` に根拠の BAC/SAC/NFR を挙げて目的との対応を説明できるようにする必要がある。``
- F003 \[major/vp-po-decision-readiness; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `未解決の課題や決定基準において、POの承認に必要な具体的なトレードオフ、影響分析、または次のアクションが不足しています。`
- F004 \[minor/vp-po-publication-accountability; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `ドキュメントには責任者が必要であると記されていますが、実際の承認者やレビューの責任が定義されていません。`
- F005 \[major/vp-pm-plan-feasibility; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `テスト活動、フェーズ、および依存関係が、プロジェクト計画に適した実行可能なワークユニットや割り当てられたロールコードに分解されていません。`
- F006 \[major/vp-pm-dependency-risk; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `主要な技術的およびスケジュールのリスク、ならびに外部インターフェースや下流のテストカタログへの依存関係が特定されていません。`
- F007 \[major/vp-pm-control-reporting; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `課題の深刻化ルート、レポート担当ロール、および変更管理項目などのプロジェクト管理要素が、課題テーブルから完全に欠落しています。`
- F008 \[major/vp-ba-business-value; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `ドキュメントでは、テスト戦略が保護すべきビジネス上の課題、重要な業務ワークフロー、またはビジネス価値が明確に述べられていません。`
- F009 \[major/vp-ba-requirements-completeness; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `テストのスコープ、受け入れ条件、および除外範囲が完全に欠落しているため、ユーザーの視点からの検証ができません。`
- F010 \[major/vp-ba-stakeholder-clarity; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `ステークホルダーのロール、テスト参加者、システムオペレーター、および合意の対象が特定されていません。`
- F011 \[major/vp-arc-technical-constraints; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `テスト環境、スタブ/Mockポリシー、および外部インターフェースの境界を含む、アーキテクチャおよび技術的な制約が省略されています。`
- F012 \[major/vp-arc-conciseness; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `サンプルとして具体的に示すべき各項目の記載内容が欠落しており、項目名の列挙にとどまっている。`
- F013 \[minor/vp-arc-conciseness; line=24; anchor=`"| 主な内容     | テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策 | 要点のみ記載                         |"`\]: `「最小記述例」の表の「目的」「主な内容」は「目的と適用範囲」「記述内容」の本文をそのまま繰り返しているため、どちらか一方にまとめるか、具体的な記述例に置き換える必要がある。`
- F014 \[major/vp-dev-implementation-readiness; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `ドキュメントには、開発者がテストを実装するために必要な実行可能なインプット、ツールの構成、自動化基準、またはテストレベルの制約が提供されていません。`
- F015 \[major/vp-dev-change-impact; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `下流のテストスイートおよびCIパイプラインに対する変更の影響分析と回帰の境界が完全に欠落しています。`
- F016 \[major/vp-dev-testability; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `検証コマンド、CI実行手順、および期待されるPass/Failの出力がドキュメント化されていません。`
- F017 \[major/vp-qe-verifiability; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `テストレベルの目的や出口条件など, 具体的に pass/fail を判定できる表現が一切含まれていない。`
- F018 \[blocker/vp-qe-verifiability; line=15; anchor=`"- 主な内容: テストレベルと目的、対象/対象外（スコープ）、品質目標、体制/役割、環境、使用ツール、テストデータ方針、入口/出口条件、進め方・優先度、リスクと対策"`\]: `入口／出口条件（品質ゲート）の表がなく、「失敗 0 件、Blocker/Critical 0 件」のような判定可能な基準が一つも示されていないため、品質ゲートを示すサンプルとして成立していない。`
- F019 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# [テスト戦略・方針](../rulebooks/tsp-index-rulebook.md) サンプル"`\]: `ルールブックで定義された必須構成（概要、テストレベル一覧、スコープ、入口／出口条件等）がすべて欠落している。`
- F020 \[minor/vp-qe-omissions-consistency; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: `「handbook の共通方針」は参照先の文書 id が特定できないため、wikilink で正本を示すか、記述を削除する必要がある。`
- F021 \[minor/vp-qe-omissions-consistency; line=23; anchor=`"| 目的         | 全体テストの考え方を示す（要件）                                                                                                                  | specdojo:deliverables-reference 準拠 |"`\]: ``備考の `specdojo:deliverables-reference` が wikilink になっておらず、参照として解決されないため、`[[specdojo:deliverables-reference]]` の形式にする必要がある。``
- F022 \[blocker/vp-qe-kata-conformance; line=1; anchor=`"# [テスト戦略・方針](../rulebooks/tsp-index-rulebook.md) サンプル"`\]: `成果物の実例ではなく「何を書くべきか」の説明書となっており、サンプルの責務を全く果たしていない。`
- F023 \[major/vp-qe-kata-conformance; line=1; anchor=`"# [テスト戦略・方針](../rulebooks/tsp-index-rulebook.md) サンプル"`\]: `成果物の実例を示すサンプルとしての責務ではなく、構成要素を説明するガイドとしての記述となっており、役割が混同している。`
- F024 \[major/vp-qe-kata-conformance; line=1; anchor=`"# [テスト戦略・方針](../rulebooks/tsp-index-rulebook.md) サンプル"`\]: `rulebook の「サンプル（最小）」にある完成例（テストレベル一覧、入口／出口条件など）よりも sample ファイルの内容が乏しく、Kata 間で完成例の正本がどちらか矛盾しているため、sample 側に完成例を置き、rulebook 側との重複を整理する必要がある。`
- F025 \[major/vp-ux-readability; line=20; anchor=`"| 項目         | 値                                                                                                                                                | 備考                                 |"`\]: `最小記述例として表形式で提示されているが、内容が抽象的（例：「要点のみ記載」）であり、具体的な書き方の指針が得られない。`
- F026 \[minor/vp-ux-language-consistency; line=5; anchor=`"本書は、全体テストの考え方を示す（要件）ための最小サンプルである。"`\]: `The parenthetical phrasing '全体テストの考え方を示す（要件）' introduces confusing terminology regarding whether this is a requirement or a test policy.`
- F027 \[major/vp-ops-release-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `サンプルをドラフトからReadyの状態へ移行するために必要な、明確な前提条件、完了条件、および受け入れ基準が定義されていません。`
- F028 \[major/vp-ops-operability; line=11; anchor=``"- 参照: `../rulebooks/tsp-index-rulebook.md`"``\]: `サンプルを更新するためのメンテナンス手順、所有権、および変更管理のガイドラインが指定されていません。`

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
