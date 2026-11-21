---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-itc-sample-050-20261121t142207z-be88803e
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-itc-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:itc-sample
    - specdojo:itc-sample
---

# Edit Plan: T-KATA-WAVE-3-itc-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 内部結合テスト（対象別）の完成例
- `depends_on`:
  - [[specdojo:itc-index-sample]]
- `overview`: 駄菓子屋の販売管理システムの 1 対象を題材に、内部結合テストの対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/itc-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-itc-sample-050/T-KATA-WAVE-3-itc-sample-050-20261121T142207Z-be88803e/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/itc-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=3; anchor=`"## 1. 目的と適用範囲"`\]: ``sample の目的は `itc-＜term＞` の完成例を示すことだが、本文は記述項目を抽象的に説明するだけで、駄菓子屋きぬや販売管理システムの結合単位（例: 販売登録→在庫減算→つけ残高更新）を対象にした具体例がない。目的に合う成果を示す内容に書き直す必要がある。``
- F002 \[major/vp-po-decision-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項「要件詳細の補強／実案件適用時に具体化する」は、補強の対象・判断者（Role code）・判断の時期・影響する章がなく、判断に使えない。具体的な論点と次のアクションを書く必要がある。`
- F003 \[major/vp-pm-plan-feasibility; line=18; anchor=`"## 4. 最小記述例"`\]: ``最小記述例が文書属性を3行並べた表だけで、`case_id`・優先度・自動化の区分を持つケース表がない。テスト実装をタスク化・見積もりする単位として使えない。``
- F004 \[major/vp-pm-dependency-risk; line=7; anchor=`"## 2. 入力情報"`\]: ``入力情報に `tsp-index` や `itc-index`、根拠仕様（`br-*` / `bac-*` / `spec-*`）への依存が示されておらず、トレース章もない。上位方針や仕様が変わったときの影響が追えない。``
- F005 \[minor/vp-pm-control-reporting; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項が登録簿（PJR）への引き継ぎ候補かどうかと担当 Role code を示しておらず、管理の記録へ転記する判断ができない。`
- F006 \[major/vp-ba-business-value; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `対象を「駄菓子屋の販売管理システム」と書くだけで、どの業務（販売記録・在庫減算・つけ残高）の結合を保証し、どの業務リスクを防ぐのかが分からない。共通サンプル文脈に沿った具体的な対象を示す必要がある。`
- F007 \[major/vp-ba-requirements-completeness; line=18; anchor=`"## 4. 最小記述例"`\]: `責務（結合として保証する振る舞い）、対象外（理由・代替）、期待値つきのケースがない。保証範囲と除外範囲を利用者の視点で確認できない。`
- F008 \[major/vp-ba-stakeholder-clarity; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `必須観点に「責任者」を挙げながら、本文に責任者・レビューア・テスト実装者の Role code がない。必須観点を自分で満たしていない。`
- F009 \[major/vp-arc-technical-constraints; line=13; anchor=`"## 3. 記述内容"`\]: `結合境界（入口・出口・結合対象）、依存ごとの扱い（DB=実、時刻=固定 等）、環境前提が記述されておらず、技術的な制約が読み取れない。`
- F010 \[minor/vp-arc-conciseness; line=23; anchor=`"| 目的         | 内部結合テスト仕様を対象（機能/連携）ごとに分割して定義する                     | specdojo:deliverables-reference 準拠 |"`\]: `最小記述例の表の「目的」「主な内容」の行が、目的と適用範囲・記述内容の章の文をそのまま繰り返している。削除するか、具体例に置き換えても情報は失われない。`
- F011 \[major/vp-dev-implementation-readiness; line=18; anchor=`"## 4. 最小記述例"`\]: ``条件（入力・状態・環境）、抽象手順、判定できる期待値、観測点、`case_id` を持つケース表がなく、テストコードを実装するための入力にならない。``
- F012 \[major/vp-dev-change-impact; line=18; anchor=`"## 4. 最小記述例"`\]: `` `trace_key`（TR-xx）と仕様ID を対応づけるトレース表がなく、仕様変更がどのケースに影響するかを識別できない。 ``
- F013 \[major/vp-dev-testability; line=18; anchor=`"## 4. 最小記述例"`\]: `ケースごとの証跡（テストコードのパス、CI run ID）の例がなく、実装後に何を実行してどの結果を確認するかが分からない。`
- F014 \[major/vp-qe-verifiability; line=13; anchor=`"## 3. 記述内容"`\]: `合格基準と期待値が名前として並ぶだけで、レスポンス・DB 状態・イベント等で判定できる期待値が一つもなく、pass / fail を判定できない。`
- F015 \[blocker/vp-qe-omissions-consistency; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `Rulebook 第 5 節で定義された必須見出し構成（1.概要 〜 6.テスト観点とケース）に従っておらず、必要な章がすべて不足している。`
- F016 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# [内部結合テスト対象別](../rulebooks/itc-rulebook.md) サンプル"`\]: ``H1 が rulebook の定める `# 内部結合テストカタログ: ＜対象名＞` の形式ではなく、相対パスの Markdown リンクを含む「内部結合テスト対象別 サンプル」になっている。``
- F017 \[blocker/vp-qe-kata-conformance; line=1; anchor=`"# [内部結合テスト対象別](../rulebooks/itc-rulebook.md) サンプル"`\]: `sample 種別の責務である「完成例」を提示せず、記述内容の抽象的な説明に留まっており、実例として不適切である。`
- F018 \[major/vp-qe-kata-conformance; line=7; anchor=`"## 2. 入力情報"`\]: ``必須項目である `title` および `based_on` が Frontmatter に不足している。``
- F019 \[minor/vp-qe-kata-conformance; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: ``参照が相対パス表記（`../rulebooks/itc-rulebook.md`）と、解決先が不明な「handbook の共通方針」「`specdojo:deliverables-reference` 準拠」になっている。`[[specdojo:itc-rulebook]]` などの id ベースの wikilink に統一する必要がある。``
- F020 \[major/vp-ux-readability; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `文書構造が rulebook の定義と乖離しており, 初見の読者が正しい作成手順や構成を把握できない。`
- F021 \[minor/vp-ux-language-consistency; line=1; anchor=`"# [内部結合テスト対象別](../rulebooks/itc-rulebook.md) サンプル"`\]: `文書名「内部結合テスト対象別」と用語「テスト条件（シナリオ）」が、rulebook の「内部結合テストカタログ」「観点・ケース」と一致しておらず、読み手が同じものか迷う。`
- F022 \[major/vp-ops-release-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決事項に ready 化の条件（必須6章とケース表の完成例を揃える等）と承認者がなく、何を満たせば公開できるかが判断できない。`
- F023 \[minor/vp-ops-operability; line=26; anchor=`"## 5. 未解決事項"`\]: `` `case_id` や `trace_key` を採番・維持する例がなく、継続更新や改訂の運用を sample から読み取れない。 ``

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
