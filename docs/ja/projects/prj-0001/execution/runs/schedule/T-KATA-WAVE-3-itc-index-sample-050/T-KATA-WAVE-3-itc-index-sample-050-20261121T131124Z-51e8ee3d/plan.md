---
specdojo:
  id: prj-0001:xep-t-kata-wave-3-itc-index-sample-050-20261121t131124z-51e8ee3d
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-3-itc-index-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: QE
  approach: sample-maintenance
  targets:
    - specdojo:itc-index-sample
    - specdojo:itc-index-sample
---

# Edit Plan: T-KATA-WAVE-3-itc-index-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 内部結合テスト（全体構成）の完成例
- `depends_on`:
  - [[specdojo:tsp-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、内部結合テストの全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/itc-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-3-itc-index-sample-050/T-KATA-WAVE-3-itc-index-sample-050-20261121T131124Z-51e8ee3d/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/itc-index-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=11; anchor=``"- 参照: `../rulebooks/itc-index-rulebook.md`"``\]: `The sample fails to reference tsp-index as the foundational test strategy document, weakening alignment with higher-level project test objectives.`
- F002 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、内部コンポーネント間の連携を確認する観点・条件を定義するための最小サンプルである。"`\]: ``目的が対象別カタログ（`itc-＜term＞`）の役割である「観点・条件の定義」になっています。rulebook の定める `itc-index` の目的（対象別カタログの品質・粒度・責任範囲を揃える共通方針）と、UT/ET/ST/AT との責務分界に書き換えてください。``
- F003 \[minor/vp-po-decision-readiness; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `未解決事項のセクションにおいて、POの意思決定に必要な具体的な意思決定責任者、影響範囲、および具体的な次のアクションが不足しています。`
- F004 \[major/vp-pm-plan-feasibility; line=14; anchor=`""`\]: `サンプルには、タスクのスケジューリングと進捗管理に必要な具体的な作業分解基準、役割の割り当て、および完了条件が不足しています。`
- F005 \[minor/vp-pm-dependency-risk; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `Dependencies on upstream deliverables (tsp-index) and risks affecting downstream test catalog implementation are not identified.`
- F006 \[minor/vp-pm-control-reporting; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `The unresolved issue lacks reporting destinations, responsible Role codes, and clear classification for transfer to project risk registers or decision records.`
- F007 \[minor/vp-ba-business-value; line=11; anchor=``"- 参照: `../rulebooks/itc-index-rulebook.md`"``\]: `統合テスト戦略によって、セールス管理システムにおけるどのようなビジネス上の問題やリスクに対処するのかが説明されていません。`
- F008 \[major/vp-ba-requirements-completeness; line=14; anchor=`""`\]: `スコープの境界、一般的な対象外事項、および受け入れ基準が欠落しており、ユーザーがテスト網羅性の完全性を検証できないようになっています。`
- F009 \[major/vp-ba-requirements-completeness; line=13; anchor=`"## 3. 記述内容"`\]: `rulebook が必須とする「対象外・除外理由（共通）」の4点セット表（対象外・除外理由・代替レベル/代替手段・例外）がありません。駄菓子屋文脈の例（外部決済との実疎通を ET へ、性能・負荷を NFR へ、など）を示してください。`
- F010 \[minor/vp-ba-stakeholder-clarity; line=14; anchor=`""`\]: `テストカタログインデックスの合意に責任を持つステークホルダー、ターゲットユーザー、およびレビュアーが明確に特定されていません。`
- F011 \[major/vp-arc-technical-constraints; line=14; anchor=`""`\]: `結合テストに必要な技術的な制約、アーキテクチャの境界ポリシー（DB、mocks、stubsの扱い）、および環境実行ポリシーが指定されていません。`
- F012 \[minor/vp-arc-conciseness; line=21; anchor=`"| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |"`\]: `セクション4の表は、独自の意思決定や参照情報を提供することなく、セクション1と3のテキストをそのまま重複して記載しています。`
- F013 \[major/vp-dev-implementation-readiness; line=21; anchor=`"| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |"`\]: `The sample fails to provide the case table column schema, case_id format, or implementation constraints necessary for developers to create concrete test catalogs.`
- F014 \[minor/vp-dev-change-impact; line=21; anchor=`"| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |"`\]: `共有テストインデックスポリシーの変更が、下流のテストカタログおよびCIパイプラインに与える影響が特定されていません。`
- F015 \[minor/vp-dev-testability; line=21; anchor=`"| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |"`\]: `統合テストカタログを検証するためのバリデーションコマンド、lintステップ、および期待される検証結果が提供されていません。`
- F016 \[minor/vp-qe-verifiability; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `最小記述例の具体性が不十分であり、判定可能な合格基準や設定値の記述例を示す必要がある。`
- F017 \[major/vp-qe-verifiability; line=15; anchor=`"- 主な内容: 対象コンポーネントと結合範囲、インターフェース（API/イベント/DB）観点、主要フロー/例外フロー、トランザクション・整合性、エラー処理、ログ/監視観点、合格基準"`\]: `合格基準が語の列挙にとどまっています。rulebook の良い例の水準（観測点を含む判定可能な期待値。例: つけ残高更新APIの一意制約違反で409応答とDB差分なし）で、具体例を少なくとも1つ示してください。`
- F018 \[blocker/vp-qe-omissions-consistency; line=11; anchor=``"- 参照: `../rulebooks/itc-index-rulebook.md`"``\]: `rulebook で定義された必須構成（## 1 〜 ## 9 の固定見出し）が欠落している。`
- F019 \[blocker/vp-qe-kata-conformance; line=1; anchor=`"# [内部結合テスト](../rulebooks/itc-index-rulebook.md) サンプル"`\]: `rulebook で指定された構造および Frontmatter 定義に準拠しておらず、itc-index のサンプルとして不適切である。`
- F020 \[major/vp-qe-kata-conformance; line=1; anchor=`"# [内部結合テスト](../rulebooks/itc-index-rulebook.md) サンプル"`\]: ``Frontmatter に rulebook 推奨の `based_on`（`tsp-index` を含む）がありません。H1 も `# 内部結合テストカタログ: 概要（駄菓子屋きぬや 販売管理システム）` の形式ではなく、rulebook へのリンクを埋め込んでいるため、両方を直してください。``
- F021 \[major/vp-ux-readability; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `必須構成に従っていないため、itc-index 作成時の参照サンプルとして機能していない。`
- F022 \[minor/vp-ux-language-consistency; line=1; anchor=`"# [内部結合テスト](../rulebooks/itc-index-rulebook.md) サンプル"`\]: `The document title and table labels use '内部結合テスト' instead of the standardized deliverable name '内部結合テストカタログ概要' (itc-index).`
- F023 \[minor/vp-ops-release-readiness; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `このサンプルには、draftからreadyステータスへ移行するために必要な、明示的な準備基準、リリース前提条件、および承認者の定義が不足しています。`
- F024 \[minor/vp-ops-operability; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `継続的なメンテナンスのための運用指示、再生成のトリガー、および変更管理のワークフローが欠落しています。`

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
