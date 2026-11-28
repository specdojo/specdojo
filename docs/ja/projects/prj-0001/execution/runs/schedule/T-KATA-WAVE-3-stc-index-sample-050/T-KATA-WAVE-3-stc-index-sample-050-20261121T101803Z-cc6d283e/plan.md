---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-stc-index-sample-050-20261121t101803z-cc6d283e
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-stc-index-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:stc-index-sample
    - specdojo:stc-index-sample
---

# Edit Plan: T-KATA-WAVE-3-stc-index-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 総合テスト（全体構成）の完成例
- `depends_on`:
  - [[specdojo:tsp-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、総合テストの全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/stc-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-stc-index-sample-050/T-KATA-WAVE-3-stc-index-sample-050-20261121T101803Z-cc6d283e/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/stc-index-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、システム全体として業務シナリオが成立することを定義する（仕様）ための最小サンプルである。"`\]: ``目的の章が「最小サンプルである」という自己説明で終わっています。`stc-＜term＞` の粒度・責任範囲を揃える目的、UT/IT/ET/AT との境界、`tsp-index` との対応という rulebook の要求を、駄菓子屋の販売管理システムを題材にした完成例として書く必要があります。``
- F002 \[minor/vp-po-decision-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項が「要件詳細の補強」という抽象的な一行だけです。rulebook の「メモ / 将来課題」に沿って、具体的な論点（例: 証跡形式の統一、スモーク/回帰の分離）、影響、当面の扱い、確定時に見直す方針を示す必要があります。`
- F003 \[major/vp-pm-plan-feasibility; line=13; anchor=`"## 3. 記述内容"`\]: ``分割基準と対象別への分配方針（主担当 `stc-＜term＞` の割り当て）の例がありません。対象別カタログをどの単位で作業化するか判断できないため、業務シナリオ単位の分割例と分配表の例を加える必要があります。``
- F004 \[major/vp-pm-dependency-risk; line=1; anchor=`"# [総合テスト](../rulebooks/stc-index-rulebook.md) サンプル"`\]: ``Frontmatter に `based_on` がなく、rulebook の「推奨ルール」が求める `tsp-index` への依存が示されていません。上位 TSP との依存関係を完成例として示すため、`based_on: [tsp-index]` を加える必要があります。``
- F005 \[minor/vp-pm-control-reporting; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `未解決事項の表に「影響」と「確定時の見直し方針」の列がありません。登録簿へ引き継げるかを判断できないため、rulebook の「メモ / 将来課題」に沿って、影響と当面の扱いを書く必要があります。`
- F006 \[major/vp-ba-business-value; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `対象が「駄菓子屋の販売管理システム」の一語にとどまり、保証すべき業務シナリオ（例: 販売確定→在庫減算、つけ記録）と、業務影響を根拠にした採用理由が示されていません。テストが業務のどの価値を守るのか読み取れません。`
- F007 \[major/vp-ba-requirements-completeness; line=13; anchor=`"## 3. 記述内容"`\]: `対象外・除外理由の表（対象外、除外理由、代替レベル/代替手段、例外）がありません。総合テストの対象範囲と対象外を利用者の視点で確認できないため、厳密な性能や外部事業者の障害網羅などの例を表で示す必要があります。`
- F008 \[minor/vp-ba-stakeholder-clarity; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `必須観点に「責任者」と書きながら、本文に責任者・確認者の例が一つもありません。挙げた観点と記述が食い違っているので、例を示すか、この項目自体を見直す必要があります。`
- F009 \[major/vp-arc-technical-constraints; line=13; anchor=`"## 3. 記述内容"`\]: `環境（ST 専用環境、データ namespace、初期化・後始末）、外部依存（sandbox/スタブ）、観測点、証跡の共通方針を示す章がありません。総合テストの技術的前提が読み取れないため、駄菓子屋の例で記述する必要があります。`
- F010 \[minor/vp-arc-conciseness; line=24; anchor=`"| 主な内容     | エンドツーエンドの業務シナリオ、画面/API/バッチ/外部連携の通し観点、運用観点（ジョブ・監視・障害時）、非機能の観点（代表値）、合格基準 | 要点のみ記載                         |"`\]: `「主な内容」の記述が前の節の内容をそのまま反復しており、冗長である。`
- F011 \[major/vp-dev-implementation-readiness; line=13; anchor=`"## 3. 記述内容"`\]: ``ケース表の共通カラム（`case_id`、条件、手順（最小）、期待値と推奨カラム）と `case_id` の形式例がありません。対象別カタログを作る作業者が表の形式を決められないため、例を加える必要があります。``
- F012 \[minor/vp-dev-change-impact; line=5; anchor=`"本書は、システム全体として業務シナリオが成立することを定義する（仕様）ための最小サンプルである。"`\]: `` `stc-index` の共通方針が対象別カタログ `stc-＜term＞` の分割・分配・カラムに影響するという関係が示されていません。変更時の影響範囲を判断できないため、適用先を明記する必要があります。 ``
- F013 \[minor/vp-dev-testability; line=13; anchor=`"## 3. 記述内容"`\]: `テスト実施後の確認に使う証跡の形式（CI run、レポート、ログの相関キーなど）が示されていません。実施結果をどう確認するかが分からないため、境界/環境の章で例を示す必要があります。`
- F014 \[major/vp-qe-verifiability; line=20; anchor=`"| 項目         | 値                                                                                                                                     | 備考                                 |"`\]: `判定基準の具体例がなく、verifiability（検証可能性）を担保する記述方法のサンプルとして不十分である。`
- F015 \[major/vp-qe-verifiability; line=15; anchor=`"- 主な内容: エンドツーエンドの業務シナリオ、画面/API/バッチ/外部連携の通し観点、運用観点（ジョブ・監視・障害時）、非機能の観点（代表値）、合格基準"`\]: `「合格基準」を主な内容に挙げながら、P0/P1/P2 ごとの共通合格基準や、観測点を含む期待値の例がありません。pass / fail を判定できる表現の手本を示す必要があります。`
- F016 \[major/vp-qe-omissions-consistency; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `rulebook で定義された必須見出し構成（## 1 〜 ## 8）に従っておらず、第 2 章から 第 8 章までの必須項目がすべて欠落している。`
- F017 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# [総合テスト](../rulebooks/stc-index-rulebook.md) サンプル"`\]: ``Frontmatter に、rulebook の「推奨ルール」が最低限求める `based_on: [tsp-index]` がありません。rulebook のサンプル抜粋とも一致しません。``
- F018 \[major/vp-qe-kata-conformance; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `rulebook で定義された標準テンプレの見出し構成を無視しており、kata（種別）としての責務を果たすサンプルになっていない。`
- F019 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# [総合テスト](../rulebooks/stc-index-rulebook.md) サンプル"`\]: ``H1 と表のセルで、rulebook を相対パスの Markdown リンク `../rulebooks/stc-index-rulebook.md` で参照しています。対応関係は Frontmatter の `rulebook` で宣言済みなので、リンクを除くか id ベースの参照にする必要があります。``
- F020 \[major/vp-ux-readability; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `記述が抽象的すぎて、STC Index の具体的な書き方（特に共通ルールや判定基準の定義方法）を学習するためのガイドとして機能していない。`
- F021 \[minor/vp-ux-language-consistency; line=1; anchor=`"# [総合テスト](../rulebooks/stc-index-rulebook.md) サンプル"`\]: `H1 が「総合テスト サンプル」で、rulebook の成果物名「総合テストカタログ 概要」と一致していません。本文16行目の「必須観点」も、rulebook の観点・条件の用語と食い違っています。`
- F022 \[minor/vp-ops-release-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項「要件詳細の補強」が抽象的で、ready にするまでに解消すべき事項が特定できません。具体的な論点に分けて書く必要があります。`
- F023 \[minor/vp-ops-operability; line=18; anchor=`"## 4. 最小記述例"`\]: ``「最小記述例」の章に、`case_id` を変更しない規則や、`stc-＜term＞` へ方針を分配する運用の例がありません。継続して更新するときの扱いが読み取れません。``

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
