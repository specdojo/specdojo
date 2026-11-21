---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-atc-sample-050-20261121t163721z-af060413
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-atc-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:atc-sample
    - specdojo:atc-sample
---

# Edit Plan: T-KATA-WAVE-3-atc-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 受入テスト（対象別）の完成例
- `depends_on`:
  - [[specdojo:atc-index-sample]]
- `overview`: 駄菓子屋の現金販売を題材に、受入テストの対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/atc-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-atc-sample-050/T-KATA-WAVE-3-atc-sample-050-20261121T163721Z-af060413/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/atc-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、受入テスト仕様を業務シナリオ/受入条件単位で分割して定義する（仕様）ための最小サンプルである。"`\]: `Frontmatter に based_on が存在せず、上位文書（tsp-index, atc-index）との目的整合を確認できない。`
- F002 \[major/vp-po-decision-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決事項の論点に判断者、影響範囲、次アクションが記載されておらず、PO が承認判断を行えない。`
- F003 \[major/vp-pm-plan-feasibility; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `完了条件、担当 Role code、依存関係が未記載で、タスク化や進捗確認に使える粒度になっていない。`
- F004 \[major/vp-pm-plan-feasibility; line=18; anchor=`"## 4. 最小記述例"`\]: `「最小記述例」が目的と主な内容の言い直しにとどまり、case_id・優先度・実施形態・証跡を持つケース行がないため、受入実施の作業単位と進捗判定の手本を示せていない。`
- F005 \[major/vp-pm-dependency-risk; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `depends_on/based_on が未定義で、後続成果物・スケジュールへの影響やリスクが識別されていない。`
- F006 \[major/vp-pm-control-reporting; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `PJR 転記候補、報告先、対応方針、担当 Role code が未記載で、進捗管理や課題追跡に使えない。`
- F007 \[major/vp-ba-business-value; line=5; anchor=`"本書は、受入テスト仕様を業務シナリオ/受入条件単位で分割して定義する（仕様）ための最小サンプルである。"`\]: `対象者の業務課題、期待価値、成功基準が明示されておらず、ビジネス価値の説明が不十分。`
- F008 \[major/vp-ba-business-value; line=13; anchor=`"## 3. 記述内容"`\]: `受入の責務（観測できる成果 3〜7 個、正常系と代表的な失敗・復帰）がなく、受入で保証する業務価値を示せていない。`
- F009 \[major/vp-ba-requirements-completeness; line=15; anchor=`"- 主な内容: 個別受入シナリオの前提、テスト条件、期待結果、合格基準、関連する業務受入条件ID/システム受入条件ID"`\]: `rulebook が求める受入条件・対象範囲・対象外の具体的記述例が欠落しており、サンプルとして要件の完成像を示せていない。`
- F010 \[major/vp-ba-requirements-completeness; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `用語定義が存在せず、受入テスト固有の概念（観点、ケース、trace_key等）の定義がサンプル内で確認できない。`
- F011 \[major/vp-ba-stakeholder-clarity; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `関係者（PO、QA、利用部門等）、確認者、合意対象がサンプル内に記載されていない。`
- F012 \[minor/vp-arc-technical-constraints; line=11; anchor=``"- 参照: `../rulebooks/atc-rulebook.md`"``\]: `schema 参照（deliverable-frontmatter.schema.yaml）や validate 手順への言及がなく、技術的な前提の確認が困難。`
- F013 \[major/vp-arc-technical-constraints; line=13; anchor=`"## 3. 記述内容"`\]: `必須章「環境/データ/外部依存」が欠落し、環境・データセット ID・外部依存の確認手段と判定保留条件の記述例がない。`
- F014 \[minor/vp-arc-conciseness; line=20; anchor=`"| 項目         | 値                                                                                                | 備考                                 |"`\]: `「## 4. 最小記述例」の表の内容が「## 1. 目的と適用範囲」「## 3. 記述内容」と重複しており、統合可能。`
- F015 \[major/vp-dev-implementation-readiness; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `rulebook 標準テンプレ（## 1. 概要 〜 ## 6. 受入観点とケース）に沿った具体的な記述例がなく、作成者が参照して ATC を実装できない。`
- F016 \[major/vp-dev-implementation-readiness; line=15; anchor=`"- 主な内容: 個別受入シナリオの前提、テスト条件、期待結果、合格基準、関連する業務受入条件ID/システム受入条件ID"`\]: `入力情報にケース表の具体例、trace_key の使い方、case_id の採番方法等の実装に必要な詳細がない。`
- F017 \[major/vp-dev-change-impact; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `変更時の影響範囲（関連する schema、生成物、コマンド、他成果物）が識別されていない。`
- F018 \[major/vp-dev-testability; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `lint、schema validation、生成コマンド等の検証手段と期待結果が記載されておらず、成果物の正しさを確認できない。`
- F019 \[blocker/vp-qe-verifiability; line=15; anchor=`"- 主な内容: 個別受入シナリオの前提、テスト条件、期待結果、合格基準、関連する業務受入条件ID/システム受入条件ID"`\]: `受入カタログのサンプルでありながら、判定基準やテストケースの具体的記述例が全く含まれておらず、pass/fail判定の手本を示せていない。`
- F020 \[blocker/vp-qe-omissions-consistency; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `rulebook で定義された必須構成（## 1. 概要 〜 ## 6. 受入観点とケース）がすべて欠落している。`
- F021 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `Frontmatter に based_on（tsp-index・atc-index）が欠落している。前回指摘の title は Markdown 規約で Frontmatter 記載禁止のため不成立とし、based_on 欠落のみが残るため blocker から major に引き下げる。`
- F022 \[blocker/vp-qe-kata-conformance; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `本文構成が rulebook の標準テンプレ（## 1. 概要 〜 ## 6. 受入観点とケース）に準拠していない。`
- F023 \[major/vp-qe-kata-conformance; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `Frontmatter の relations.verifies に指定した bac-order-registration に対応する sample が存在せず、対応する業務受入条件 sample（specdojo:bac-sample、現金販売）と整合していない。`
- F024 \[major/vp-ux-readability; line=5; anchor=`"本書は、受入テスト仕様を業務シナリオ/受入条件単位で分割して定義する（仕様）ための最小サンプルである。"`\]: `ATCの具体的な書き方を示すサンプルとして機能しておらず、初見の読者が作成方法を理解できない。`
- F025 \[major/vp-ux-readability; line=18; anchor=`"## 4. 最小記述例"`\]: `本文の見出し構成が rulebook と異なるため、読者が rulebook との対応関係を把握できない。`
- F026 \[minor/vp-ux-language-consistency; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `成果物タイトルが「受入テスト対象別 サンプル」であり、rulebook で定義された「受入テストカタログ: ＜対象名＞」形式に準拠していない。`
- F027 \[minor/vp-ux-language-consistency; line=5; anchor=`"本書は、受入テスト仕様を業務シナリオ/受入条件単位で分割して定義する（仕様）ための最小サンプルである。"`\]: `「定義する（仕様）」の括弧書きが意味不明瞭で、rulebook の用語（受入テストカタログ 対象別）とも表記がそろっていない。`
- F028 \[major/vp-ops-release-readiness; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `ready 化の条件、承認者、公開前確認事項が明示されておらず、リリース判断に必要な前提が不足している。`
- F029 \[major/vp-ops-operability; line=1; anchor=`"# [受入テスト対象別](../rulebooks/atc-rulebook.md) サンプル"`\]: `継続更新・再生成手順・変更管理・問い合わせ導線・担当 Role code が未記載で、運用に必要な情報が不足している。`

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
