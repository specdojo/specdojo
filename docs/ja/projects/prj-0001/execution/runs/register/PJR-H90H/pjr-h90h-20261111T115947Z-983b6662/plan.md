---
specdojo:
  id: prj-0001:xep-pjr-h90h-20261111t115947z-983b6662
  type: exec-plan
  rulebook: none
  task_id: PJR-H90H
  name: "代表の ifx-cmd-ai-provider-cli を、確定した型で磨き込む"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  approach: fully-guided
  targets:
    - prj-0001:ifx-cmd-ai-provider-cli
---

# Edit Plan: PJR-H90H

## 1. このフェーズで行うこと

business-specs-kata で確定した型（specdojo:ifx-cmd-rulebook と sample）に合わせて、代表の ifx-cmd-ai-provider-cli を磨き込み、冗長さを整理する。review は schedule の review の段で流す

## 2. 対象成果物

- `name`: 外部コマンド連携仕様（AI provider CLI）
- `depends_on`:
  - `ifx-index`（未作成）
- `based_on`（対象成果物の frontmatter）: [[specdojo:exec-config-guide]]、[[sysd-agent-settings]]、[[opr-agent-cli-update]]
- 個票の `入力`: 下記「個票の入力（前提）」を参照。
- `overview`: AI provider CLI（Claude Code / Codex CLI / opencode 等）を外部プロセスとして起動・連携するための実行契約、正本の参照、入出力の約束（渡すもの・受け取るもの・終了コードの意味・作るファイル・副作用・失敗の扱い）、認証注入を定義する
- `path`: `docs/ja/product/020-external-interface-specs/ifx-cmd-ai-provider-cli.yaml`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-H90H/pjr-h90h-20261111T115947Z-983b6662/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **_MISSING_**
- 責務: _MISSING_

このロールが重視するレビュー観点:

- _MISSING_

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/ifx-cmd-rulebook.md`
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `docs/ja/specdojo/recipes/ifx-cmd-recipe.md`
- sample: `docs/ja/specdojo/samples/ifx-cmd-sample.yaml`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=147; anchor=`"契約がなく、連携設計の承認者による判断が必要。reporter の形式不正は exec設定ガイドの"`; cause=document\]: `Replace the generic integration-design approver with a responsible Role code or responsibility reference, and identify when the pending timeout and malformed-output decisions must be accepted or deferred.`
- F002 \[minor/vp-pm-plan-feasibility; line=140; anchor=`"_UNDECIDED_: 起動時間の上限を設けるか、また上限到達時に子プロセスを終了するか、"`; cause=document\]: `Associate the unresolved timeout and malformed-output work with responsible Role codes and observable completion conditions so these decisions can be scheduled and tracked before finalization.`
- F003 \[minor/vp-pm-dependency-risk; line=141; anchor=`"不完全出力をどう扱うかは未決定。現在は終了まで待ち続ける。連携設計の承認者が"`; cause=document\]: `Record that waiting indefinitely can retain a worktree and occupy an execution or provider slot, and identify the planning decision or operational dependency needed to manage that risk.`
- F004 \[minor/vp-pm-control-reporting; line=146; anchor=`"_UNDECIDED_: タグ内 JSON の解析失敗時の完了判定・変更保持・再開条件は宣言資料に個別の"`; cause=document\]: `Identify the PJR handoff destination or tracking reference for the pending malformed-output and execution-policy decisions, including the reporting Role code, so they remain traceable outside this draft.`
- F005 \[major/vp-ba-requirements-completeness; line=146; anchor=`"_UNDECIDED_: タグ内 JSON の解析失敗時の完了判定・変更保持・再開条件は宣言資料に個別の"`; cause=document\]: `Define the caller-visible outcome when evidence-tag JSON cannot be parsed, including whether the task may complete, whether edits are retained, and what action permits resumption; the current undecided branch leaves users without a complete failure-handling contract.`
- F006 \[minor/vp-ba-stakeholder-clarity; line=147; anchor=`"契約がなく、連携設計の承認者による判断が必要。reporter の形式不正は exec設定ガイドの"`; cause=document\]: `Identify the human confirmation role for the pending integration behavior and distinguish it from the CLI user who performs reauthentication, so readers can determine who must agree to the remaining contract decisions.`
- F007 \[major/vp-arc-cross-document-consistency; line=101; anchor=`"- 各 provider CLI のログインプロファイル（claude / codex / copilot / opencode / agy）"`; cause=document\]: `This specification includes opencode among providers requiring login profiles and persistent authentication state at lines 97–104, whereas docs/ja/product/040-system-design/sysd-opencode-agent-settings.md section 1 explicitly defines ollama-local without an API key or external cloud LLM; represent the unauthenticated OpenCode path and scope login-profile requirements to providers that need them.`
- F008 \[major/vp-arc-technical-constraints; line=97; anchor=`"method: provider_login"`; cause=document\]: `Make the authentication mechanism conditional on the selected provider configuration, including a no-authentication mechanism for local OpenCode/Ollama, instead of requiring provider_login and cli_profile for every invocation.`
- F009 \[major/vp-dev-implementation-readiness; line=146; anchor=`"_UNDECIDED_: タグ内 JSON の解析失敗時の完了判定・変更保持・再開条件は宣言資料に個別の"`; cause=document\]: `Specify the state transition and processing sequence after evidence JSON parsing fails, including parent validation, reporter execution, preservation of edits, and resume eligibility, so implementations do not choose incompatible behaviors.`
- F010 \[minor/vp-dev-testability; line=1; anchor=`"# yaml-language-server: $schema=../../../specdojo/schemas/v1/ifx-cmd.schema.yaml"`; cause=document\]: `Add a concise verification reference identifying the schema-validation command and the relevant launch, failure-classification, and report-parsing test entry points, so maintainers can select the checks required after changing this contract.`
- F011 \[major/vp-qe-done-criteria; line=97; anchor=`"method: provider_login"`; cause=document\]: `Correct the universal login-profile assumption before claiming DC-003 is satisfied; the declared authentication design must accommodate the supported local OpenCode/Ollama configuration.`
- F012 \[major/vp-qe-done-criteria; line=146; anchor=`"_UNDECIDED_: タグ内 JSON の解析失敗時の完了判定・変更保持・再開条件は宣言資料に個別の"`; cause=document\]: `Complete the malformed-evidence contract before treating DC-001, DC-004, or DC-005 as satisfied; the current text provides no defined completion outcome, downstream processing sequence, or recovery expectation for invalid evidence-tag JSON.`
- F013 \[major/vp-qe-verifiability; line=146; anchor=`"_UNDECIDED_: タグ内 JSON の解析失敗時の完了判定・変更保持・再開条件は宣言資料に個別の"`; cause=document\]: `Define observable pass/fail expectations for invalid JSON inside the evidence tag, including completion state, retained changes, retry behavior, and permitted downstream stages; an undecided disposition cannot serve as a test oracle.`
- F014 \[major/vp-qe-omissions-consistency; line=146; anchor=`"_UNDECIDED_: タグ内 JSON の解析失敗時の完了判定・変更保持・再開条件は宣言資料に個別の"`; cause=document\]: `Replace the undecided invalid-JSON branch with a defined disposition or an authoritative reference that specifies it; malformed_output_action currently omits the caller behavior for a recognized output-parsing failure.`
- F015 \[minor/vp-ux-user-flow; line=24; anchor=`"[[prj-0001:sysd-agent-settings|エージェント実行・共通設計]] を入口とする。"`; cause=document\]: `Change the links prj-0001:sysd-agent-settings at line 24 and prj-0001:opr-agent-cli-update at line 151 to their declared IDs sysd-agent-settings and opr-agent-cli-update, or use valid relative paths, so readers can reach the provider-design entry point and update recovery procedure.`
- F016 \[minor/vp-ops-release-readiness; line=4; anchor=`"status: draft"`; cause=document\]: `State the ready gate for the unresolved timeout, schema-representation, and malformed-output items, identifying which require resolution and which may be deferred by an accountable human decision.`
- F017 \[major/vp-ops-operability; line=146; anchor=`"_UNDECIDED_: タグ内 JSON の解析失敗時の完了判定・変更保持・再開条件は宣言資料に個別の"`; cause=document\]: `Provide an operational disposition for malformed executor evidence that identifies what to preserve, how to establish task state, who confirms recovery, and when executor resume is allowed; the current pending decision leaves this failure without a usable recovery procedure.`

`cause` は原因の所在を示す。`kata:<kind>` の指摘も成果物側の修正が必要なため、この plan に載るすべての指摘を扱う。Kata の手入れは対応する maintenance の段で行う。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。加えて、下記「実装エビデンスと未作成の依存」に列挙した実装の根拠を読み取り専用で参照する。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書・実装や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 実装エビデンスと未作成の依存

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の実装の根拠である。`targets`、変更許可範囲、commit 対象には含めない。

- `src/exec/run/agent.ts`（implementation）: AI provider CLI の起動コマンド組み立て・非対話プロセス実行・エラー検知の実装
- `src/exec/agent-config.ts`（implementation）: プロバイダ別コマンドテンプレートとモデル・実行時引数の解決処理の実装

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

- AI provider CLI の実行契約・入出力の約束・エラー処理が業務観点で整理されていること
- AI provider CLI との連携スコープと方式を承認できること
- 外部コマンド連携仕様（正本参照・入出力の約束・認証注入）の設計として妥当であること
- 外部 CLI 起動テスト・結合テスト設計に活用できること
- プロセス起動・連携エラー処理実装の基礎として参照できること

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

- 型一式の確定（2026-11-10、indie が決定）の後に、代表を磨き込みから流し直す。schedule の磨き込み・condense の段はゲートで bes・br・clis の段まで巻き戻すことになるため、register の todo で行う（orchestrator の判断、indie に報告）。
- 夜間の register の routine で流す（indie が承認）。review は T-BUSINESS-SPECS-REPS-ifx-cmd-ai-provider-cli-090 を reopen 済みで、6:00 の exec cycle で流す。

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 代表の [[prj-0001:ifx-cmd-ai-provider-cli]] を、確定した型 [[specdojo:ifx-cmd-rulebook]] と [[specdojo:ifx-cmd-sample]] に合わせて磨き込んでいる。型の本文要件の章立て・必須の項目・記述ガイドの判断の基準に沿い、型が禁止することを書いていない。
- 冗長さを整理している（判断に要る背景・制約・例外と意味は保ち、新しい内容を足さない）。
- 実装・schema・リファレンスと同じことを書かず、正本を参照する方針（PJR-2GD6）を保っている。
- 決められない点は `_UNDECIDED_` か `_ASSUMPTION_` のまま、理由（どの成果物がない、誰の判断が要る）を書いて残してよい。依存の成果物がないことを理由に未完了としない。
- これまでの review の指摘のうち、確定した型の範囲で直せるものを直し、直さないものは理由を個票の対応結果に書いている。
- 型と、ほかの成果物とカタログを変えていない。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- CHANGELOG.md は変えず、利用者に影響する変更を個票の対応結果の「CHANGELOG に書く事項」の節（番号付きの見出し）に、区分と行の文案で書いている（PJR-EPQ3）。影響がなければ「なし」と書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`specdojo catalog validate --project prj-0001` が通っている。
- 2 回目の実行（2026-11-11 追加）: 1 回目の後の grade（run id `reps5-20261111`）は needs-work 73 だった。次を直し、grade で pass になっている（grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない）。
  - executor の報告の evidence タグの JSON が壊れているときの扱い（task を完了にしてよいか、編集を残すか、再試行するか、利用者が取る行動）が未定義という指摘。実装の振る舞いを確かめて書くか、正本を参照し、`_UNDECIDED_` のまま残さない。
  - すべての provider にログインのプロファイルと認証の状態が要る前提になっているという指摘。認証の要否を provider の設定で分け、ローカルの OpenCode / Ollama のように認証が要らない場合を含める。docs/ja/product の関連仕様と矛盾させない。
  - そのほかの grade の指摘のうち、確定した型の範囲で直せるもの。

### 夜間 autopilot の制約

この個票は人が記載済みの完了条件だけを承認した。次の操作は行わない。必要になった場合は、理由を result の申し送りへ記録して異常終了する。

- decision の決定、保護された設定の変更、公開・tag・push。
- 公開済み CHANGELOG 節の変更、未承認項目の実行、完了条件や変更範囲の拡張。
- 別の登録項目を自分で実行すること。見つけた別問題は夜間 orchestrator が承認待ちとして起票する。

## 再開時の追加の指示（orchestrator、2026-11-11）

- evidence タグの中の JSON が壊れているときの振る舞いは、`src/exec/evidence.ts` の `parseExecutorReport` を読み取り専用の根拠として加えるので、そこで確かめて書く。orchestrator が読んだ範囲では次のとおり。
  - 最後の evidence タグの JSON の解析に失敗すると、報告は空として扱われ、タグがないときと同じになる（コメント「A malformed optional report must not discard the executor's process outcome」）。`completion_status`・`handoff`・`validations`・`target_coverage` は無いものとして扱い、`final_message` は標準出力からタグを除いた本文になる。
  - そのため、完了の判定は executor のプロセスの結果と親の検証で決まり、編集は保たれる。タグがないときの既存の振る舞いと同じ契約として書き、正本としてこの関数を参照する。新しい失敗方針は作らない。
- 時間の上限・子プロセスの終了・部分出力の扱いなど、この 2 回目の完了条件にない未決の事項は `_UNDECIDED_` のまま残してよく、未完了の理由にしない。
- grade は統合の後に orchestrator が流す。grade を流せないことを理由に未完了としない。

`共通規約 sha256:52952054ce0f0bcec27dc5a05d69342eab31a2b80e422ca13ed16d4fd9537d5a` `docs/ja/projects/prj-0001/execution/conventions/52952054ce0f0bcec27dc5a05d69342eab31a2b80e422ca13ed16d4fd9537d5a.txt`
