---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-stc-sample-050-20261121t111237z-9f006389
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-stc-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:stc-sample
    - specdojo:stc-sample
---

# Edit Plan: T-KATA-WAVE-3-stc-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 総合テスト（対象別）の完成例
- `depends_on`:
  - [[specdojo:stc-index-sample]]
- `overview`: 駄菓子屋の店頭販売の業務を題材に、総合テストの対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/stc-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-stc-sample-050/T-KATA-WAVE-3-stc-sample-050-20261121T111237Z-9f006389/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/stc-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、総合テスト仕様をシナリオ/業務単位で分割して定義する（仕様）ための最小サンプルである。"`\]: `このサンプルは、STCがエンドツーエンドのビジネスワークフローをどのように検証するかを実証できておらず、STCのアーティファクトという目的を果たさず、抽象的なメタ記述を提供しているに過ぎません。`
- F002 \[minor/vp-po-decision-readiness; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `未解決の問題のセクションには、承認の意思決定に必要な意思決定者、影響の範囲、および具体的な次のアクションが不足しています。`
- F003 \[minor/vp-po-publication-accountability; line=1; anchor=`"# [総合テスト対象別](../rulebooks/stc-rulebook.md) サンプル"`\]: `サンプルの公開または確定に関する説明責任と人間による承認の責任が明示的に指定されていません。`
- F004 \[major/vp-pm-plan-feasibility; line=20; anchor=`"| 項目         | 値                                                                                                     | 備考                                 |"`\]: `このサンプルには、計画やスケジュールの対象となる実行可能なテストユニット、依存関係、または完了基準が含まれていません。`
- F005 \[major/vp-pm-dependency-risk; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決事項による下流のリスク、上流の仕様への依存関係、およびスケジュールの影響が特定されていません。`
- F006 \[minor/vp-pm-control-reporting; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `未解決の問題のテーブルには、プロジェクト管理制御に必要な報告先やロールコードが不足しています。`
- F007 \[major/vp-ba-business-value; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `このサンプルは、菓子店の販売管理システムにおけるビジネス価値、ユーザーペルソナ、または対象となる運用シナリオを記述していません。`
- F008 \[major/vp-ba-requirements-completeness; line=11; anchor=``"- 参照: `../rulebooks/stc-rulebook.md`"``\]: `要件、受け入れ基準、および明確なスコープ外の境界がサンプルに含まれていません。`
- F009 \[major/vp-ba-stakeholder-clarity; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `このドキュメントは、関連するステークホルダー、運用ユーザー、またはテストレビュアーを特定できていません。`
- F010 \[major/vp-arc-technical-constraints; line=7; anchor=`"## 2. 入力情報"`\]: `テストカタログに必要な技術的制約、環境の前提条件、および外部依存関係が完全に欠落しています。`
- F011 \[minor/vp-arc-conciseness; line=7; anchor=`"## 2. 入力情報"`\]: `具体例を提示せず記述項目の列挙に留まっており、実例としての有用性が低い。`
- F012 \[minor/vp-arc-conciseness; line=23; anchor=`"| 目的         | 総合テスト仕様をシナリオ/業務単位で分割して定義する（仕様）                                            | specdojo:deliverables-reference 準拠 |"`\]: `本文5行目の目的文と15行目の「主な内容」を表の目的行・主な内容行でほぼ同文のまま再掲しており、表か箇条書きのどちらかに統合して重複を削れる。`
- F013 \[minor/vp-arc-single-responsibility; line=1; anchor=`"# [総合テスト対象別](../rulebooks/stc-rulebook.md) サンプル"`\]: `「STCの作成ガイド」と「STCの具体例」の役割が混在しており、主題が不明確である。`
- F014 \[major/vp-dev-implementation-readiness; line=20; anchor=`"| 項目         | 値                                                                                                     | 備考                                 |"`\]: `テストの実施に必要なテスト入力、前提条件、期待される出力、および完了基準が提供されていません。`
- F015 \[minor/vp-dev-change-impact; line=20; anchor=`"| 項目         | 値                                                                                                     | 備考                                 |"`\]: `このサンプルは、変更の影響範囲や、影響を受けるコンポーネント/テストスイートを特定していません。`
- F016 \[major/vp-dev-testability; line=20; anchor=`"| 項目         | 値                                                                                                     | 備考                                 |"`\]: `検証コマンド、自動テストスクリプトの参照、およびエビデンスの場所が指定されていません。`
- F017 \[major/vp-qe-verifiability; line=15; anchor=`"- 主な内容: 個別シナリオの前提、データ準備、テスト条件、期待結果、合格基準、関連する業務仕様ID/受入条件ID/入条件ID"`\]: `判定基準を列挙しているが、具体的な判定可能な値や状態が記述されておらず検証不能である。`
- F018 \[blocker/vp-qe-omissions-consistency; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `ルールブックで定義された必須章（2〜6）がすべて欠落している。`
- F019 \[minor/vp-qe-omissions-consistency; line=1; anchor=`"# [総合テスト対象別](../rulebooks/stc-rulebook.md) サンプル"`\]: ``前回の Frontmatter の指摘のうち `type: test` は rulebook の指定と一致し `title:` は記述ルール上禁止のため問題ではないが、rulebook「推奨ルール」が最低限とする `based_on: [tsp-index, stc-index]` は未記載のままであり追加が必要である。``
- F020 \[blocker/vp-qe-kata-conformance; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `` `stc-rulebook` が規定する固定順序の見出し構成を完全に無視しており、サンプルとしての責務を果たしていない。 ``
- F021 \[major/vp-qe-kata-conformance; line=3; anchor=`"## 1. 目的と適用範囲"`\]: ``参照先 `stc-rulebook.md` で定義された必須構成（章番号および項目）と矛盾している。``
- F022 \[major/vp-qe-kata-conformance; line=1; anchor=`"# [総合テスト対象別](../rulebooks/stc-rulebook.md) サンプル"`\]: ``H1 が rulebook「ファイル命名・ID規則」の指定 `# 総合テストカタログ: ＜対象名＞` に従っておらず、rulebook へのリンクを含む独自形式になっているため、駄菓子屋の具体的な対象名（例: 店頭販売の会計）を用いた規定形式の H1 に改める必要がある。``
- F023 \[major/vp-ux-readability; line=1; anchor=`"# [総合テスト対象別](../rulebooks/stc-rulebook.md) サンプル"`\]: `具体的な STC の構成例が示されていないため、ルールブック適用時の参考にならない。`
- F024 \[minor/vp-ux-language-consistency; line=15; anchor=`"- 主な内容: 個別シナリオの前提、データ準備、テスト条件、期待結果、合格基準、関連する業務仕様ID/受入条件ID/入条件ID"`\]: `用語に不一致や、標準的な受け入れ基準のキーであるべき箇所が "入条件ID" になっているといった誤字があります。`
- F025 \[minor/vp-ux-language-consistency; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: ``「handbook の共通方針」が指す文書を特定できないため、共通サンプル文脈の正本（`sample-authoring-standard` の「共通サンプル文脈」等）を名称で明示する必要がある。``
- F026 \[minor/vp-ops-release-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `ドラフトからReadyステータスへ移行するための前提条件と基準が定義されていません。`
- F027 \[minor/vp-ops-operability; line=11; anchor=``"- 参照: `../rulebooks/stc-rulebook.md`"``\]: `テストカタログの継続的な更新のための運用手順とメンテナンスガイドラインが不足しています。`

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
