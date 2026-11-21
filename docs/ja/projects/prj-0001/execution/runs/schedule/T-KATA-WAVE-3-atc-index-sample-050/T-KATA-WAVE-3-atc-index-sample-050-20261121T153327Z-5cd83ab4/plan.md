---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-atc-index-sample-050-20261121t153327z-5cd83ab4
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-atc-index-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:atc-index-sample
    - specdojo:atc-index-sample
---

# Edit Plan: T-KATA-WAVE-3-atc-index-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 受入テスト（全体構成）の完成例
- `depends_on`:
  - [[specdojo:tsp-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、受入テストの全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/atc-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-atc-index-sample-050/T-KATA-WAVE-3-atc-index-sample-050-20261121T153327Z-5cd83ab4/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/atc-index-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=3; anchor=`"## 1. 目的と適用範囲"`\]: ``成果物固有の目的、期待効果、および根拠となる `tsp-index` との対応が示されておらず、この成果物が必要な理由を判断できない。``
- F002 \[major/vp-po-decision-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `「要件詳細の補強」の判断対象、判断者、影響範囲、判断時期、次アクションがなく、PO が承認・保留・差し戻しを判断できない。`
- F003 \[minor/vp-po-publication-accountability; line=1; anchor=`"# [受入テスト](../rulebooks/atc-index-rulebook.md) サンプル"`\]: `` `status: draft` 以外に公開対象と最終承認者が示されておらず、公開可否の説明責任を誰が負うか確認できない。 ``
- F004 \[major/vp-pm-plan-feasibility; line=13; anchor=`"## 3. 記述内容"`\]: `タスクの割り当て、順序付け、時間見積もり、担当するRoleコード、および完了基準が不足しているため、進捗の追跡や計画の立案に使用することができません。`
- F005 \[major/vp-pm-dependency-risk; line=7; anchor=`"## 2. 入力情報"`\]: ``必須依存である `tsp-index` が `based_on` に記録されず、参照先も「handbook の共通方針」としか特定されていないため、上位方針への影響を追跡できない。``
- F006 \[minor/vp-pm-control-reporting; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決事項に報告先、担当 Role code、PJR 転記要否、対応期限がなく、進捗・課題管理へ引き継げない。`
- F007 \[major/vp-ba-business-value; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `駄菓子屋の誰のどの業務課題を解決し、どの状態を価値実現とするかが示されていないため、主要方針の妥当性を評価できない。`
- F008 \[major/vp-ba-requirements-completeness; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `対象範囲、除外範囲、受入条件、用語、および具体的な共通ルールが欠落しており、受入テストカタログの完成例として要件を確認できない。`
- F009 \[major/vp-ba-stakeholder-clarity; line=13; anchor=`"## 3. 記述内容"`\]: `関係者の名称と責務、利用場面、確認者、合意対象が具体化されておらず、誰が受入判断に関与するか読み取れない。`
- F010 \[major/vp-arc-technical-constraints; line=13; anchor=`"## 3. 記述内容"`\]: `受入環境、代表構成、テストデータの準備・初期化・後始末、外部依存の検証方法が欠落し、再現可能な構成条件を確認できない。`
- F011 \[minor/vp-arc-conciseness; line=15; anchor=`"- 主な内容: 業務受入シナリオ、受入条件（合格基準）、利用者視点の操作・期待結果、例外時の扱い、データ準備、役割分担、エビデンス要件、判定/承認フロー"`\]: `「主な内容」の列挙が最小記述例の表でそのまま反復されているため、どちらかへ統合しても判断情報を失わない。`
- F012 \[major/vp-dev-implementation-readiness; line=1; anchor=`"# [受入テスト](../rulebooks/atc-index-rulebook.md) サンプル"`\]: ``必須メタデータ、標準章、ケース表の共通カラム、環境・データ制約が実例として提示されておらず、`atc-index` 作成作業の入力と完了条件を読み取れない。``
- F013 \[major/vp-dev-change-impact; line=1; anchor=`"# [受入テスト](../rulebooks/atc-index-rulebook.md) サンプル"`\]: `既存の成果物、スキーマ、および運用手順に対する変更の影響が特定されていないため、影響範囲の追跡が不可能です。`
- F014 \[major/vp-dev-testability; line=13; anchor=`"## 3. 記述内容"`\]: `実装後に確認すべきリンティング、スキーマ検証、およびテスト実行コマンドが不足しているため、検証方法が不明確な状態です。`
- F015 \[major/vp-qe-verifiability; line=13; anchor=`"## 3. 記述内容"`\]: `具体的な受入条件、期待値、観測点、証跡要件が記載されておらず、pass / fail を再現可能に判定できない。`
- F016 \[minor/vp-qe-verifiability; line=22; anchor=`"| ドキュメント | [受入テスト](../rulebooks/atc-index-rulebook.md)                                                                                        | 最小サンプル                         |"`\]: `表の「ドキュメント」項目の値にルールブックへのリンクが指定されており、具体的にどのような成果物を指すべきかの例示になっていない。`
- F017 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# [受入テスト](../rulebooks/atc-index-rulebook.md) サンプル"`\]: `ルールブックで定義されている必須見出し（特に2〜8章）が完全に欠落しており、成果物の構成として不十分である。`
- F018 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# [受入テスト](../rulebooks/atc-index-rulebook.md) サンプル"`\]: ``ルールブックで定義された `title`、`based_on`、`supersedes` がなく、必須または推奨される上位仕様との対応を確認できない。``
- F019 \[minor/vp-qe-omissions-consistency; line=23; anchor=`"| 目的         | 業務として受け入れ可能であることを確認する観点・条件を定義する（仕様）                                                                  | specdojo:deliverables-reference 準拠 |"`\]: ``備考の `specdojo:deliverables-reference` が wikilink ではなく素の識別子で記載されており、参照先を辿れず参照の整合を確認できない。``
- F020 \[major/vp-qe-kata-conformance; line=1; anchor=`"# [受入テスト](../rulebooks/atc-index-rulebook.md) サンプル"`\]: `ルールブック第5章で定義された標準テンプレの見出し構成および順序に準拠していない。`
- F021 \[major/vp-qe-kata-conformance; line=1; anchor=`"# [受入テスト](../rulebooks/atc-index-rulebook.md) サンプル"`\]: ``sample が rulebook の「サンプル（最小）」より情報量が少なく、`based_on`・全必須章・合格基準・ケース表の共通カラムを含む完成例になっていないため、sample と rulebook の責務分担が逆転している。``
- F022 \[major/vp-ux-readability; line=1; anchor=`"# [受入テスト](../rulebooks/atc-index-rulebook.md) サンプル"`\]: `ルールブックの必須構成を無視した形式となっており、正解例としての提示内容が不適切であるため、読者に誤解を与える。`
- F023 \[major/vp-ux-language-consistency; line=1; anchor=`"# [受入テスト](../rulebooks/atc-index-rulebook.md) サンプル"`\]: `` `type` は `test` に修正済みで ID もサンプル命名規約に沿うが、H1 の成果物名が「受入テスト」のままで rulebook の「受入テストカタログ 概要」と一致せず、対象別カタログ（`atc-＜term＞`）との区別がつかないため対象成果物を一意に識別できない。 ``
- F024 \[major/vp-ops-release-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決事項を解消したと判定する条件、ready 化の確認項目、承認者、公開対象がなく、公開・配布の可否を判断できない。`
- F025 \[major/vp-ops-operability; line=13; anchor=`"## 3. 記述内容"`\]: `対象別カタログへの分配、データの初期化・後始末、証跡管理、将来課題の昇格方法がなく、継続運用や変更管理を実施できない。`

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
