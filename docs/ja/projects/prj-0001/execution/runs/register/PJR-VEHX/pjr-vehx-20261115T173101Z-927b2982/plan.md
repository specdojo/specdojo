---
specdojo:
  id: prj-0001:xep-pjr-vehx-20261115t173101z-927b2982
  type: exec-plan
  rulebook: none
  task_id: PJR-VEHX
  name: "sf-index を grade の指摘で手直しする（P-06 の境界のずれとテスト対象との照合）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
  approach: fully-guided
  targets:
    - sf-index
---

# Edit Plan: PJR-VEHX

## 1. このフェーズで行うこと

最新の grade の指摘を取り込み、機能の境界とテスト対象との対応を直す

## 2. 対象成果物

- `name`: システム化機能一覧（全体構成）
- `depends_on`:
  - `bps-init-required`（未作成）
  - `bps-register-required`（未作成）
  - `bps-planning-catalog-strategy-update`（未作成）
  - `bps-task-selection-preparation`（未作成）
  - `bps-routine-required`（未作成）
  - `bps-parallel-required`（未作成）
  - `bps-config-change-evaluation`（未作成）
  - `bps-derived-project-scoped`（未作成）
  - `bps-reporting-monitoring-detection`（未作成）
  - `bps-deprecation-process`（未作成）
  - `clis-index`（未作成）
- `based_on`（対象成果物の frontmatter）: なし
- 個票の `入力`: 下記「個票の入力（前提）」を参照。
- `overview`: システムで実現する機能の全体構成と一覧を定義する。行ごとに業務プロセス仕様（bps-*）・CLI仕様（clis-index配下のCLIコマンド群）を要約参照する
- `path`: `docs/ja/product/010-business-specs/050-system-functions/sf-index.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-VEHX/pjr-vehx-20261115T173101Z-927b2982/result.md`

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

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/sf-index-rulebook.md`
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `_MISSING_`
- sample: `docs/ja/specdojo/samples/sf-index-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[minor/vp-po-publication-accountability; line=14; anchor=`"- 読者: 機能分割とコンポーネント設計を行う ARC、実装範囲を確認する DEV、テスト対象を洗い出す QE、業務仕様との対応を確認する BA。"`; cause=document\]: `State the intended publication audience and confirm whether the document contains personal or non-public information so the PO can assess publication scope.`
- F002 \[major/vp-pm-plan-feasibility; line=62; anchor=``"| `Q-01` | 人間の `PO` が留保を承認した（2026-11-15。追跡先は PJR-AK5V）。業務プロセス仕様列の BPS と CLI 仕様 `clis-index` の多くが未作成のため、対応は成果物カタログの定義に基づく暫定とする。BPS が作成された時点で、各行の概要と処理ステップの対応を照合する                                                                                                                        | BA / PO       | BPS・`clis-index` の作成後に BA が各行を照合し、差異があれば本書を更新する                              |"``; cause=document\]: `Break the BPS and CLI mapping review into trackable work with an owner, completion condition, and decision timing so PM can schedule and monitor it.`
- F003 \[minor/vp-pm-dependency-risk; line=63; anchor=``"| `Q-02` | 成果物カタログ上の本書の `depends_on` に、`SF-PLAN-02`・`SF-ROUT-02`・`SF-EXEC-02`・`SF-ORCH-01` が参照する `P-04`・`P-06`・`P-08`・`P-14` の BPS が含まれていない。網羅の根拠とする範囲が一覧と一致しない。人間の `PO` が方針を決めた（2026-11-15）: カタログの `depends_on` には、領域ごとに代表の BPS だけを置く。一覧の各行が参照する BPS がすべて依存にあるとは限らない | BA / PM       | 判断済み。BPS が作成された時点で、代表の BPS の選び方が一覧と食い違わないかを PJR-AK5V の照合で確かめる |"``; cause=document\]: `Record the dependency-gap resolution and its schedule or downstream-deliverable impact in a traceable project item so affected work can be managed.`
- F004 \[minor/vp-pm-control-reporting; line=62; anchor=``"| `Q-01` | 人間の `PO` が留保を承認した（2026-11-15。追跡先は PJR-AK5V）。業務プロセス仕様列の BPS と CLI 仕様 `clis-index` の多くが未作成のため、対応は成果物カタログの定義に基づく暫定とする。BPS が作成された時点で、各行の概要と処理ステップの対応を照合する                                                                                                                        | BA / PO       | BPS・`clis-index` の作成後に BA が各行を照合し、差異があれば本書を更新する                              |"``; cause=document\]: `Add the PJR and Schedule tracking references for the open mapping, dependency, and deprecation issues so progress and decisions can be reported consistently.`
- F005 \[major/vp-ba-requirements-completeness; line=62; anchor=``"| `Q-01` | 人間の `PO` が留保を承認した（2026-11-15。追跡先は PJR-AK5V）。業務プロセス仕様列の BPS と CLI 仕様 `clis-index` の多くが未作成のため、対応は成果物カタログの定義に基づく暫定とする。BPS が作成された時点で、各行の概要と処理ステップの対応を照合する                                                                                                                        | BA / PO       | BPS・`clis-index` の作成後に BA が各行を照合し、差異があれば本書を更新する                              |"``; cause=document\]: `The provisional BPS mappings and missing catalog dependencies prevent BA from confirming that the function list covers the agreed business scope; complete the source mapping or define and justify the representative-source policy.`
- F006 \[minor/vp-ba-stakeholder-clarity; line=14; anchor=`"- 読者: 機能分割とコンポーネント設計を行う ARC、実装範囲を確認する DEV、テスト対象を洗い出す QE、業務仕様との対応を確認する BA。"`; cause=document\]: `Identify who maintains the index and where each role records its review or agreement, so readers can tell whether stakeholder confirmation is complete.`
- F007 \[major/vp-arc-cross-document-consistency; line=46; anchor=``"| `SF-ROUT-02`  | ジョブ実行         | 定義済みのジョブを runner が直接実行するか agent へ委譲し、成功条件に照らして結果を記録する       | `bps-routine-job-run`                                     | `job`                                   | 一覧行で要約                               |"``; cause=document\]: ``Reconcile SF-ROUT-02 with `prj-0001:dct-business-model-bps`, which defines P-06 as producing reusable job definitions, and `specdojo:command-reference` section 12, which assigns execution to `exec run —job`; the current row describes execution under P-06 and lists `job`, leaving definition responsibilities and the actual execution entry point inconsistent.``
- F008 \[minor/vp-arc-technical-constraints; line=36; anchor=``"CLI 列はトップレベルのコマンド名を示す。サブコマンド・引数・出力の詳細は CLI 仕様（`clis-index` 配下）と command-reference を正本とし、本書へ転記しない。"``; cause=document\]: `State or reference the technical assumptions and constraints that component design must preserve, or identify the authoritative source where ARC can find them.`
- F009 \[minor/vp-dev-implementation-readiness; line=56; anchor=``"- 個別仕様は代表 1 件（`sf-task-execution`）だけを作成する方針（PJR-2GD6）とし、その他の機能は一覧行の要約を正とする。詳細化が必要になった機能は、成果物カタログへ `sf-<term>` を追加してから作成する。"``; cause=document\]: `For functions without individual specifications, identify the authoritative source for the inputs, outputs, and constraints needed to establish implementation boundaries.`
- F010 \[major/vp-dev-implementation-readiness; line=46; anchor=``"| `SF-ROUT-02`  | ジョブ実行         | 定義済みのジョブを runner が直接実行するか agent へ委譲し、成功条件に照らして結果を記録する       | `bps-routine-job-run`                                     | `job`                                   | 一覧行で要約                               |"``; cause=document\]: ``Identify `exec run —job` as the execution entry point for SF-ROUT-02 and distinguish it from job-definition validation and inspection, so implementation work is assigned to the correct command boundary.``
- F011 \[minor/vp-dev-change-impact; line=56; anchor=``"- 個別仕様は代表 1 件（`sf-task-execution`）だけを作成する方針（PJR-2GD6）とし、その他の機能は一覧行の要約を正とする。詳細化が必要になった機能は、成果物カタログへ `sf-<term>` を追加してから作成する。"``; cause=document\]: `Add or reference a change-impact procedure that identifies which schemas, generated outputs, commands, and operating procedures must be checked when a function boundary changes.`
- F012 \[minor/vp-dev-testability; line=38; anchor=`"| 機能 ID       | 機能名             | 概要                                                                                              | 業務プロセス仕様                                          | CLI                                     | 個別仕様                                   |"`; cause=document\]: `Specify or reference the check that verifies function IDs, business-process mappings, and CLI references, including the expected pass condition.`
- F013 \[major/vp-qe-done-criteria; line=40; anchor=``"| `SF-SETUP-01` | 初期セットアップ   | 導入条件を確定し、Kata の配置と稼働構成・開発コンテナ構成を初期化する                             | `bps-init-required`                                       | `init`・`kata`・`devcontainer`          | 一覧行で要約                               |"``; cause=document\]: ``Provide evidence that every business-process area is mapped to the agreed scope and test targets, resolving the dependency gap recorded in `Q-02` before claiming coverage.``
- F014 \[major/vp-qe-verifiability; line=38; anchor=`"| 機能 ID       | 機能名             | 概要                                                                                              | 業務プロセス仕様                                          | CLI                                     | 個別仕様                                   |"`; cause=document\]: `Define a review check that compares every business-process area and function ID to its source and test target, with a recorded pass/fail result.`
- F015 \[major/vp-qe-omissions-consistency; line=38; anchor=`"| 機能 ID       | 機能名             | 概要                                                                                              | 業務プロセス仕様                                          | CLI                                     | 個別仕様                                   |"`; cause=document\]: `Resolve the missing BPS dependencies and provide a traceable check that the function list is covered by test targets, so omissions can be detected.`
- F016 \[minor/vp-ux-user-flow; line=36; anchor=``"CLI 列はトップレベルのコマンド名を示す。サブコマンド・引数・出力の詳細は CLI 仕様（`clis-index` 配下）と command-reference を正本とし、本書へ転記しない。"``; cause=document\]: ``Add resolvable document links for `command-reference`, PJR-2GD6, and PJR-AK5V at their points of use so readers can directly reach command details, the representative-specification decision, and deferred-review tracking.``
- F017 \[major/vp-ops-release-readiness; line=15; anchor=``"- 承認: 人間の PO（indie）がシステム化のスコープを承認する。本書の確定は `status` の昇格と同じく人間の判断とする。"``; cause=document\]: ``Define the publication audience and the checks the PO must complete before approving `ready`, including resolution or explicit exclusion of the open mapping and dependency questions.``
- F018 \[minor/vp-ops-operability; line=64; anchor=``"| `Q-03` | 人間の `PO` が留保を承認した（2026-11-15。追跡先は PJR-AK5V）。`SF-DEPR-01` は `deliverable` の保管移動を非推奨化・保管の機能とみなしている。非推奨化の反映（文書の `status` とカタログの更新）をシステムが担うかは `bps-deprecation-process` で確定する                                                                                                                     | BA / ARC      | `bps-deprecation-process` の作成時に、システムが担う範囲を照合する                                      |"``; cause=document\]: `Identify the role responsible for routine maintenance and the procedure or destination for reporting broken references and requesting updates.`

`cause` は原因の所在を示す。`kata:<kind>` の指摘も成果物側の修正が必要なため、この plan に載るすべての指摘を扱う。Kata の手入れは対応する maintenance の段で行う。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。加えて、下記「実装エビデンスと未作成の依存」に列挙した実装の根拠を読み取り専用で参照する。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書・実装や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 実装エビデンスと未作成の依存

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の実装の根拠である。`targets`、変更許可範囲、commit 対象には含めない。

- `src/specdojo.ts`（implementation）: CLIサブコマンド一覧（機能一覧の行と対応させる根拠）

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

- 機能分割・コンポーネント設計の入力として参照できること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [BA] 機能一覧が業務仕様と対応し、スコープが網羅されていること
- [PO] システム化機能のスコープを承認できること
- [QE] テスト対象機能の網羅性が確認できること
- [DEV] 実装スコープ・機能境界の参照として使えること

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

- kata-wave-1 の確定（T-KATA-WAVE-1-sf-index-140）で差し戻した（indie が 2026-11-15 に判断、PJR-TN43）。grade は needs-work 75 点で完了条件 0/5
- 主な指摘: SF-ROUT-02 が実行の行だが、対応する P-06 はジョブの定義の領域で境界がずれている。全機能 ID と業務領域をテスト対象と照らした記録がない。Q-01・Q-03 の留保（PJR-AK5V）は残す

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- `SF-ROUT-02` と P-06（ジョブの定義）の対応を正し、機能の境界と、業務プロセスの領域ごとの対応がずれていない。必要なら行を分けるか、定義と実行の機能を別の ID にする。
- 全機能 ID と業務領域を、テスト対象（どの検証で確かめるか）と照らした対応表がある。
- Q-02 の方針（領域ごとに代表の BPS だけを依存にする）と、一覧の各行の参照先が食い違っていない。
- 本文に書いた人間の PO の判断と、期限付きの留保（追跡先の PJR）を消さずに保っている。
- 成果物の `status` は `draft` のまま変えない（確定は人が T-KATA-WAVE-1 の 140 で行う）。
- 直した後に `grade run --target deliverable` で grade し直し、成果物カタログの完了条件をすべて満たす（留保の範囲だけが未充足として残る場合は、その理由を対応結果に書く）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
