---
specdojo:
  id: prj-0001:xep-pjr-q9df-20261115t175308z-afc2cc8d
  type: exec-plan
  rulebook: none
  task_id: PJR-Q9DF
  name: "cnd-specdojo を grade の指摘で手直しする（コンテナ構成と配備の方針の基準）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
  approach: fully-guided
  targets:
    - cnd-specdojo
---

# Edit Plan: PJR-Q9DF

## 1. このフェーズで行うこと

最新の grade の指摘を取り込み、承認の基準となるコンテナ構成と配備の方針を本文で定める

## 2. 対象成果物

- `name`: C4コンテナ図（SpecDojo）
- `depends_on`:
  - [[cxd-specdojo]]
- `based_on`（対象成果物の frontmatter）: [[cxd-specdojo]]
- 個票の `入力`: 下記「個票の入力（前提）」を参照。
- `overview`: SpecDojo CLI・生成ドキュメントサイト（VitePress）・外部システム・リポジトリ（データストア）の関係を定義する
- `path`: `docs/ja/product/030-architecture/010-c4/cnd-specdojo.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-Q9DF/pjr-q9df-20261115T175308Z-afc2cc8d/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/cnd-rulebook.md`
- 併せて適用する rulebook（記法など）: `docs/ja/specdojo/rulebooks/cnd-mermaid-rulebook.md`
- recipe: `docs/ja/specdojo/recipes/cnd-recipe.md`
- sample: `docs/ja/specdojo/samples/cnd-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[major/vp-po-decision-readiness; line=74; anchor=`"サイトの構築・配備を CLI が直接起動するか、別の実行基盤が担うかは未確定である。閲覧先から CLI を操作する経路は本図の対象外とする。"`; cause=document\]: `Define the container and deployment baseline submitted for PO approval, identify which unresolved build and delivery assumptions may be accepted, and state which downstream activities remain on hold; the current handoffs do not establish an actionable approval scope.`
- F002 \[minor/vp-pm-plan-feasibility; line=132; anchor=``"| 実行・配備の仮定   | CLI、サイト、`REL-04`・`REL-06`。上位図はローカル実行も仮定としている | ARC        | `cpd-specdojo-cli` と `ifd-specdojo` の整備で CLI の実行単位、構築主体、配信先を具体化し、本図の仮定と照合する |"``; cause=document\]: `Add a deadline or downstream entry condition for each unresolved topic, such as before deployment design or integration acceptance; phrases referring only to future document preparation do not establish when PM must schedule and verify closure.`
- F003 \[major/vp-pm-control-reporting; line=130; anchor=`"| 対象・論点         | 影響範囲                                                              | 担当ロール | 解消条件・引き継ぎ先                                                                                           |"`; cause=document\]: `Classify the unresolved topics as issue, risk, or decision candidates, identify the reporting route to PM, and reference their PJR destination records or explicitly pending registration; technical-document handoffs alone do not support management tracking or distinguish an open proposal from a recorded decision.`
- F004 \[minor/vp-ba-stakeholder-clarity; line=121; anchor=`"| 確認区分     | 対象関係・境界                 | 観測する結果                                                                     | 主確認ロール |"`; cause=document\]: `Identify who performs BA and user-representative confirmation of the CLI and document-viewing scenarios, and who performs OPS confirmation of the build and delivery assumptions; the current technical verification assignments leave these stakeholder agreements unassigned.`
- F005 \[minor/vp-arc-conciseness; line=101; anchor=``"| `REL-04` | プロジェクト運営・承認者 → 生成ドキュメントサイト（VitePress）           | 共有文書の閲覧                     | 人間の `PO` が留保を承認した（2026-11-15。運用設計・非機能要件の整備まで）。ブラウザから閲覧する。公開範囲・到達先は未確定                     | `ifd-specdojo` へ引き継ぐ                                        |"``; cause=document\]: `Consolidate the identical PO reservation statement repeated at lines 72, 101, and 103 into one approval note covering the site and REL-04/REL-06, retaining its date and closure milestone; each relationship row can then retain only its distinct access and build conditions.`
- F006 \[minor/vp-dev-implementation-readiness; line=102; anchor=``"| `REL-05` | SpecDojo CLI → リポジトリ（仕様・判断・検証記録）                        | 仕様・記録の参照と更新             | ローカルファイルの読み書き。詳細な配置・構造は再定義しない                                                                                     | [[cxd-specdojo\\|上位コンテキスト図]] の中核責務、各記録の schema |"``; cause=document\]: `Replace the generic reference to each record's schema with a resolvable schema index or specific contract references covering REL-05, so developers can locate the authoritative repository input and output definitions without guessing.`
- F007 \[major/vp-qe-done-criteria; line=132; anchor=``"| 実行・配備の仮定   | CLI、サイト、`REL-04`・`REL-06`。上位図はローカル実行も仮定としている | ARC        | `cpd-specdojo-cli` と `ifd-specdojo` の整備で CLI の実行単位、構築主体、配信先を具体化し、本図の仮定と照合する |"``; cause=document\]: `Explicitly record DC-002 as outstanding and connect its closure to a reviewable deployment baseline and PO disposition of the build and delivery assumptions; the current future-work entries do not demonstrate that the catalog's configuration and deployment approval condition is met.`
- F008 \[major/vp-qe-verifiability; line=124; anchor=``"| AI 委譲      | `REL-07`                       | 外部 CLI 不在・拒否・応答欠落と、返された結果・途中変更を区別できるか            | QE / ARC     |"``; cause=document\]: `Define observable normal success outcomes for REL-07 and REL-08 through REL-10, including returned result and evidence, local history effects, and remote reflection; failure-oriented questions alone do not establish reproducible pass/fail expectations for these paths.`
- F009 \[major/vp-qe-omissions-consistency; line=123; anchor=``"| 正本と閲覧物 | `REL-05`、`REL-06`、`REL-04`   | 正本の変更と構築・配備後の閲覧内容を対応付け、構築失敗時の配信状態を識別できるか | QE / DEV     |"``; cause=document\]: `Add verification expectations for unreadable, unwritable, or interrupted repository access on REL-05 and REL-06, distinguishing failed operations from already persisted changes and identifying unresolved recovery expectations; the current checks cover build, AI, and Git failures but omit failure of the authoritative store itself.`
- F010 \[minor/vp-ux-user-flow; line=132; anchor=``"| 実行・配備の仮定   | CLI、サイト、`REL-04`・`REL-06`。上位図はローカル実行も仮定としている | ARC        | `cpd-specdojo-cli` と `ifd-specdojo` の整備で CLI の実行単位、構築主体、配信先を具体化し、本図の仮定と照合する |"``; cause=document\]: `Make the existing cpd-specdojo-cli and ifd-specdojo handoff references navigable links, including the infrastructure references in the relationship table; readers following the deployment-design handoff currently reach plain identifiers without a direct route to those documents.`
- F011 \[minor/vp-ops-release-readiness; line=115; anchor=`"- 文書生成や AI 作業の成功から成果物の承認を導かない。外部へ渡す情報と認証の管理は連携契約で確認し、本図に認証値や未確認の秘密情報非保持保証を置かない。"`; cause=document\]: `Reference the review and PO decision records, or explicitly state that they are pending, and identify the outstanding checks before ready promotion and publication, including OPS comparison of approved and published scopes.`
- F012 \[minor/vp-ops-operability; line=135; anchor=``"| AI 作業の結果不明  | `REL-07`。途中変更と外部へ渡す情報の扱い                              | ARC / QE   | 上位図の外部コマンド連携仕様を具体化する際に、結果欠落と保持記録の期待値を定め、結合検証へ渡す                 |"``; cause=document\]: `Add a concise maintenance handoff referencing the rulebook's revision procedure and identifying how ARC coordinates updates to cxd-specdojo, cpd-specdojo-cli, and ifd-specdojo, how DEV/QE refresh affected contracts and verification evidence, and where OPS obtains the approved revision for publication.`

`cause` は原因の所在を示す。`kata:<kind>` の指摘も成果物側の修正が必要なため、この plan に載るすべての指摘を扱う。Kata の手入れは対応する maintenance の段で行う。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。加えて、下記「実装エビデンスと未作成の依存」に列挙した実装の根拠を読み取り専用で参照する。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書・実装や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 実装エビデンスと未作成の依存

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の実装の根拠である。`targets`、変更許可範囲、commit 対象には含めない。

- `src/specdojo.ts`（implementation）: SpecDojo CLIコンテナが持つコマンド領域
- `packages/docs-site/.vitepress/config.mts`（implementation）: 生成ドキュメントサイト（VitePress）コンテナのビルド構成

実装エビデンスは現在動作の事実、rulebook は書き方、`depends_on` と個票の `入力` は意図された仕様の根拠として使い分ける。食い違いは実装へ無条件に合わせず、承認根拠のある現在動作だけを反映し、未承認の乖離は意図された仕様を保持して result に記録する。実装から目的・業務判断・将来方針を推測しない。

`depends_on` の「未作成」は参照できる本文がまだないことを示す。未作成の依存だけを理由に異常終了せず、存在する資料で進める。内容を推測で埋めず、必要な箇所は _TODO_ / _ASSUMPTION_ として、不足する根拠と次のアクションを残す。

### 4.1. 必要な実践の型が存在しない・内容が薄い場合

- `not-needed` ではない rulebook / recipe が存在しない、または基準として機能しないほど内容が薄い場合は、その事実と判断を result の `進め方と実践の型の適用` セクションに記録する。
- 不足分は、存在する他の実践の型と `depends_on` 成果物（いずれも plan 記載の文書）、および既存の対象成果物で補う。実践の型の欠落を理由にレビュー観点を未達にしない。
- 章構成は既存の対象成果物を骨組みとし、判断に迷う場合は rulebook の構成を正とする。
- 実践の型そのものの整備が必要と判断した場合でも、本タスクの範囲を超える整備は行わず、申し送りに残す。

### 4.2. 既存記述の扱い

- 対象成果物に既存の記述がある場合は、まず内容を確認し、既存記述を尊重する。既存記述の破棄や全面的な書き換えは原則として行わず、既存記述を基礎として不足分を加筆・補強する。
- 次のいずれかに該当する箇所は、既存記述であっても修正対象とする。修正はいずれも該当箇所に閉じた最小限にとどめる。
  - `depends_on` の最新の決定事項と明確に矛盾する箇所。
  - 手順1で確認した rulebook の必須要素が欠落している箇所、rulebook の禁止事項に抵触している箇所、および rulebook が定める章構成に適合していない箇所。
  - 同一成果物内で同じ内容が複数箇所に重複している箇所。
  - rulebook の必須要素にも「完了の狙い」に示された `done_criteria` にも寄与していない記述。
- 上記のいずれにも該当しない場合（完成度・整合性・読みやすさの向上など）は、それだけを理由に修正しない。既存記述が rulebook の許容範囲内（例: 複数の構成が認められている場合の一方の選択）であれば、他章との見た目の整合を理由に、より詳細な構成や長い記述へ書き換えない。
- rulebook 不適合の修正は、既存記述の内容を保持したまま rulebook の章構成へ移し替え、欠落した必須要素を補い、禁止事項に該当する記述形式を改める作業として行う。内容の全面書き換えはしない。移し替え先が定まらない既存記述は、下記の削除対象に該当しない限り削除せず、内容が最も近い章に残したうえで、その判断を result に記録する。
- 重複記述は、内容が最も適切な1箇所を正本と定めて統合し、他の箇所は要約または正本の章への参照に置き換える。統合で情報が失われる場合は、不足分を正本側に取り込んでから他方を整理する。
- rulebook の必須要素にも `done_criteria` にも寄与していない記述は削除する。削除は既存記述の尊重の例外であり、判断根拠を result に記録することで担保する。
- 既存記述が古いか判断できない場合、rulebook への不適合か意図的な逸脱か判断できない場合、および必須要素・`done_criteria` に寄与するか判断できない場合は、破棄せず _TODO_ / _ASSUMPTION_ で論点を残す。
- 加筆・修正・統合・削除の判断根拠を result の `進め方と実践の型の適用` セクションに残す。削除・統合した記述については、対象箇所と根拠が後から追える粒度で記録する。

### 4.3. 根拠のない具体化の禁止

- ファイルパス・コマンド・設定値など、実装や設定の実態を示す具体的な記述を新たに書き加える場合は、本セクションの宣言された参照範囲（rulebook / 併せて適用する rulebook / recipe、`depends_on` 成果物、`based_on`、プロジェクトコンテキスト、個票の `入力`、カタログの `brief`）で裏付けが取れる場合に限る。sample は別文脈の完成例であり、対象成果物の具体的な記述の裏付けにしない。
- 既存記述が曖昧・不完全（ファイル名のみでパスが無い、値が未確定など）であっても、裏付けが無ければ推測で具体化しない。完成度を上げる目的だけで、もっともらしい値を断定的に書き加えない。
- 裏付けが無く判断できない箇所は、既存の曖昧な記述を残したまま _TODO_ / _ASSUMPTION_ として論点を残す。

### 4.4. 判断根拠の記録

参照した文書・参照しなかった文書と、その判断根拠を result に残す。記録先は次のとおり。

- 参照した rulebook / recipe / sample の使い分け、矛盾時に rulebook を正とした箇所、欠落・薄い実践の型の扱い、既存記述の加筆・修正・統合・削除の根拠、具体化を見送った箇所とその理由: result の `進め方と実践の型の適用` セクション。

## 5. 完了の狙い

この成果物が満たすべき狙い（成果物カタログの `done_criteria`）を、owner ロールの狙いと下流ロールの入力適合に分けて示す。「進め方」に従って実践の型に沿って記述する中で、owner の狙いを作成目標として満たすことを目指す。下流ロールの項目は、その文書から各ロールが自分の責務の成果物を作成できるよう入力として最低限成立させる範囲にとどめ、各ロールの内容を成果物に作り込まない（一文書一責務）。下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる。

owner として達成する狙い:

- インフラ設計・デプロイ構成の入力として参照できること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [BA] 主要コンテナ構成・データフローが業務観点で理解できること
- [PO] コンテナ構成とデプロイ方針を承認できること
- [QE] コンテナ間結合テストの対象が識別できること
- [DEV] 実装コンポーネントの配備先・通信経路の参照として使えること

## 6. 完了手順

1. 「このフェーズで行うこと」と「進め方」に従って成果物を更新する。
2. 「完了の狙い」を満たしているかを確認し、不足があれば加筆・補強する（観点別の自己レビューや再確認ループは行わない）。
3. 共通規約に従って、必要な整形・静的検査を実行する。
4. result に実施内容・変更ファイル・進め方と実践の型の適用を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 7. 異常終了の条件

- 実行に必要なツール・パッケージの依存を解決できない、対象ファイルのパスが特定できない、または lint/test 未解消の場合は異常終了する（終了コード 1）。
- 未作成の `depends_on` と `evidence_refs` の欠落だけでは異常終了しない。未作成の依存の内容は推測せず _TODO_ / _ASSUMPTION_ と次のアクションを残す。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- kata-wave-1 の確定（T-KATA-WAVE-1-cnd-specdojo-140）で差し戻した（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 82 点で完了条件 4/5
- 主な指摘: コンテナ構成と配備の方針の基準が本文で定まっておらず、PO が承認できない（DC-002）。留保した範囲（文書サイトの閲覧の認証と配信、REL-10 は PJR-CJMN）と、今承認する範囲を区別する

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- PO が承認の基準にできる、コンテナ構成と配備の方針（何をどこで動かし、何を配備しないか）を本文で定めている。
- 今の時点で承認する範囲と、留保した範囲（文書サイトの閲覧の認証と配信は運用設計まで、REL-10 は PJR-CJMN）を区別し、留保の範囲で許される後続の作業と保留する作業が分かる。
- 本文に書いた人間の PO の判断と、期限付きの留保（追跡先の PJR）を消さずに保っている。
- 成果物の `status` は `draft` のまま変えない（確定は人が T-KATA-WAVE-1 の 140 で行う）。
- 直した後に `grade run --target deliverable` で grade し直し、成果物カタログの完了条件をすべて満たす（留保の範囲だけが未充足として残る場合は、その理由を対応結果に書く）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
