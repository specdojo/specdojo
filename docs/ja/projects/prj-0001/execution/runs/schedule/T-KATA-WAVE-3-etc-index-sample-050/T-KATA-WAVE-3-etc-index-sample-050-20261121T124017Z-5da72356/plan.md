---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-etc-index-sample-050-20261121t124017z-5da72356
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-etc-index-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:etc-index-sample
    - specdojo:etc-index-sample
---

# Edit Plan: T-KATA-WAVE-3-etc-index-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 外部結合テスト（全体構成）の完成例
- `depends_on`:
  - [[specdojo:tsp-index-sample]]
- `overview`: 駄菓子屋の販売管理システムと外部サービスの連携を題材に、外部結合テストの全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/etc-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-etc-index-sample-050/T-KATA-WAVE-3-etc-index-sample-050-20261121T124017Z-5da72356/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/etc-index-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、外部システム連携を含む結合観点・条件を定義する（仕様）ための最小サンプルである。"`\]: ``目的を、rulebook の全体方針どおり「`tsp-index` を根拠に `etc-＜term＞` 共通の分割基準・観点/条件・外部依存境界・合格基準・証跡を定める SSOT」として書き直してください。あわせて、個別ケースは `etc-＜term＞` に置く責務分担を明示してください。``
- F002 \[minor/vp-po-purpose-alignment; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: ``「handbook の共通方針」は参照先を特定できないため、`tsp-index` や共通サンプル文脈など、具体的な上位文書の wikilink に置き換えてください。``
- F003 \[major/vp-po-decision-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項は「要件詳細の補強」だけで論点が特定できないため、具体的な論点ごとに外部結合テストへの影響・当面の扱い・判断の場を書いてください（例: sandbox が不安定な場合の fallback、テストデータのクリーンアップ）。`
- F004 \[major/vp-pm-plan-feasibility; line=15; anchor=`"- 主な内容: 対象I/F（API/ファイル/メッセージ）、契約（スキーマ/コード/制約）、正常/異常（タイムアウト・リトライ・冪等・順序）、セキュリティ（認証/認可）、性能/レート制限、監査ログ、合格基準"`\]: ``分割基準と対象別への分配方針の具体例がなく、`etc-＜term＞` 作成のタスク分割や担当割当に使えません。駄菓子屋の例（例: 決済端末連携、仕入れ先への発注ファイル連携）で `＜term＞` の分割と主担当の割当を示してください。``
- F005 \[major/vp-pm-dependency-risk; line=1; anchor=`"# [外部結合テスト](../rulebooks/etc-index-rulebook.md) サンプル"`\]: ``上位の `tsp-index` への依存（`based_on`）と後続の `etc-＜term＞` との関係が示されていないため、Frontmatter に `based_on` を加え、本文で外部依存のリスク（sandbox の不安定さ、事業者側の障害）を示してください。``
- F006 \[major/vp-pm-control-reporting; line=26; anchor=`"## 5. 未解決事項"`\]: `未決事項の章を rulebook の「メモ / 将来課題」に合わせ、論点・外部結合テストへの影響・当面の扱いの列を持つ形にしてください。登録簿へ転記できる粒度の論点を書いてください。`
- F007 \[major/vp-ba-business-value; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `駄菓子屋きぬやのどの外部連携のどの業務リスク（二重課金、在庫数の不一致など）を外部結合テストで防ぐのかを示し、観点の採用理由として業務影響を書いてください。`
- F008 \[major/vp-ba-requirements-completeness; line=13; anchor=`"## 3. 記述内容"`\]: `対象外・除外理由（共通）を「対象外／除外理由／代替／例外」の表で記述し、本番決済への実課金を対象外とするなど、駄菓子屋の例で責任境界を示してください。`
- F009 \[major/vp-ba-requirements-completeness; line=3; anchor=`"## 1. 目的と適用範囲"`\]: ``適用対象（`etc-index` / `etc-＜term＞`）と非適用（ST/AT は `stc-index` / `atc-index` で扱う）を明記してください。``
- F010 \[major/vp-ba-stakeholder-clarity; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `「責任者」を必須観点としながら関係者が示されていません。外部事業者・店主・テスト担当など、外部境界ごとの運用責任と確認者を示してください。`
- F011 \[major/vp-arc-technical-constraints; line=15; anchor=`"- 主な内容: 対象I/F（API/ファイル/メッセージ）、契約（スキーマ/コード/制約）、正常/異常（タイムアウト・リトライ・冪等・順序）、セキュリティ（認証/認可）、性能/レート制限、監査ログ、合格基準"`\]: `外部依存の扱い（sandbox とスタブの使い分け、テスト用資格情報の secret 管理、タイムアウトとリトライの規定値、テストデータの分離）を、rulebook のサンプル（最小）の水準で具体的に書いてください。`
- F012 \[minor/vp-arc-conciseness; line=24; anchor=`"| 主な内容     | 対象I/F（API/ファイル/メッセージ）、契約（スキーマ/コード/制約）、正常/異常（タイムアウト・リトライ・冪等・順序）、セキュリティ（認証/認可）、性能/レート制限、監査ログ、合格基準 | 要点のみ記載                         |"`\]: `「主な内容」と「目的」が導入部（本文5行目・15行目）と最小記述例の表で重複しています。表を削るか、完成例の本文に置き換えてください。`
- F013 \[major/vp-dev-implementation-readiness; line=18; anchor=`"## 4. 最小記述例"`\]: ``ケース表の共通カラムと `case_id` の形式が示されていません。rulebook の「ケース表の共通カラム」に沿って、必須・推奨カラムと記入例（例: `et-payment-gateway-idempotency-001`）を書いてください。``
- F014 \[major/vp-dev-change-impact; line=1; anchor=`"# [外部結合テスト](../rulebooks/etc-index-rulebook.md) サンプル"`\]: `H1 と本文22行目で rulebook を相対パスで参照しているため、H1 からリンクを外し、参照が必要な場合は id 基準の wikilink にしてください。`
- F015 \[minor/vp-dev-change-impact; line=22; anchor=`"| ドキュメント | [外部結合テスト](../rulebooks/etc-index-rulebook.md)                                                                                                                              | 最小サンプル                         |"`\]: ``共通方針の変更が `etc-＜term＞`（ケース表、`case_id`）やテストコードに与える影響、たとえば `case_id` を変えない原則を示してください。``
- F016 \[major/vp-dev-testability; line=15; anchor=`"- 主な内容: 対象I/F（API/ファイル/メッセージ）、契約（スキーマ/コード/制約）、正常/異常（タイムアウト・リトライ・冪等・順序）、セキュリティ（認証/認可）、性能/レート制限、監査ログ、合格基準"`\]: `監査ログや合格基準を語として挙げるだけで、観測点と証跡（外部リクエストID・相関ID・CI run の参照方法）が示されていないため、確認方法を具体的に書いてください。`
- F017 \[major/vp-qe-verifiability; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `判定基準や合格基準の具体的にどのような表現を用いて定義すべきか、実例を記述してください。`
- F018 \[major/vp-qe-verifiability; line=24; anchor=`"| 主な内容     | 対象I/F（API/ファイル/メッセージ）、契約（スキーマ/コード/制約）、正常/異常（タイムアウト・リトライ・冪等・順序）、セキュリティ（認証/認可）、性能/レート制限、監査ログ、合格基準 | 要点のみ記載                         |"`\]: `共通合格基準の例として、タイムアウト上限・リトライ回数・冪等性の観測結果など、数値や状態で判定できる条件を書いてください。`
- F019 \[blocker/vp-qe-omissions-consistency; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `rulebook で規定された必須構成（1. 目的、2. 分割基準、3. 対象外、4. 観点、5. 条件、6. 採用/分配、7. 境界/依存/環境、8. 共通カラム）をすべて実装してください。`
- F020 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# [外部結合テスト](../rulebooks/etc-index-rulebook.md) サンプル"`\]: ``rulebook の推奨ルールに従い、Frontmatter の `based_on` に `tsp-index` を含めてください。``
- F021 \[blocker/vp-qe-kata-conformance; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `rulebook で定義された標準テンプレート構成（## 1. 〜 ## 8.）に従って構成を全面的に再構築してください。`
- F022 \[major/vp-qe-kata-conformance; line=1; anchor=`"# [外部結合テスト](../rulebooks/etc-index-rulebook.md) サンプル"`\]: `H1 を、rulebook の設定内容どおり「外部結合テストカタログ: 概要（駄菓子屋きぬや 販売管理システム）」の形式にしてください。`
- F023 \[major/vp-qe-kata-conformance; line=7; anchor=`"## 2. 入力情報"`\]: ``sample は完成例を示す型ですが、「入力情報」「記述内容」という手引きの章になっています。駄菓子屋きぬやの `etc-index` を完成した文書として書いてください。``
- F024 \[major/vp-ux-readability; line=15; anchor=`"- 主な内容: 対象I/F（API/ファイル/メッセージ）、契約（スキーマ/コード/制約）、正常/異常（タイムアウト・リトライ・冪等・順序）、セキュリティ（認証/認可）、性能/レート制限、監査ログ、合格基準"`\]: `項目を列挙するだけでなく、各節で具体的にどのように方針や基準を記述すべきか、詳細な例文を提示してください。`
- F025 \[minor/vp-ux-language-consistency; line=1; anchor=`"# [外部結合テスト](../rulebooks/etc-index-rulebook.md) サンプル"`\]: ``成果物名を「外部結合テストカタログ: 概要」に統一し、「（仕様）」の括弧書きや、地の文に埋め込まれた `specdojo:deliverables-reference` の書き方を整理してください。``
- F026 \[major/vp-ops-release-readiness; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `ready 化の前に解消すべき事項（必須8章の充足、未決論点の具体化）が識別できないため、未解決事項を ready 判断に使える粒度で書いてください。`
- F027 \[major/vp-ops-operability; line=18; anchor=`"## 4. 最小記述例"`\]: ``継続運用に必要な規律（`case_id` を変えない、テストデータの分離と廃棄、sandbox が不安定なときの代替手段、運用責任の担当）を示してください。``

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
