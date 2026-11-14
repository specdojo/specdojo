---
specdojo:
  id: prj-0001:xep-t-kata-wave-1-sysd-cross-cutting-policy-005-20261114t024759z-bb17cdab
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-sysd-cross-cutting-policy-005
  name: "代表成果物・実践の型の初期整備"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: bootstrap
  targets:
    - sysd-cross-cutting-policy
    - specdojo:sysd-cross-cutting-policy-rulebook
    - specdojo:sysd-cross-cutting-policy-sample
---

# Edit Plan: T-KATA-WAVE-1-sysd-cross-cutting-policy-005

## 1. このフェーズで行うこと

新しく作った型の文書（rulebook・recipe・sample・template）は、packages/docs-site/.vitepress/sidebar-config.ts の型のメニューにも足す（tests/packages/docs-site/sidebar-kata.test.ts が確かめる）。
対象の成果物を代表として、対応する rulebook・sample（必要なら recipe・template）を起こし直すか、型に沿う代表の初版を作る。代表がすでにある場合は、その実績から型を整え、代表は型との整合に必要な範囲だけ直す。代表がない場合は、型に沿って SpecDojo（prj-0001）の代表の初版を作る。機械的な複写を避け、他の案件に使える型にする。業務判断は確定しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 対象成果物と実践の型

このフェーズは、成果物とその実践の型一式を一貫した一組として作成・整備する。成果物本体と、それに紐づく rulebook / recipe / sample / template を同一タスクで編集する。

成果物（主対象）:

- `name`: システム設計（横断ルール）
- `depends_on`:
  - [[sysd-index]]
- `overview`: 実装全体に影響する共通ルール（エラー・タイムアウト・冪等・トレーシング・設定上書き階層・モジュール境界等）をSSOT化する
- `path`: `docs/ja/product/040-system-design/sysd-cross-cutting-policy.md`

実践の型（rulebook frontmatter の宣言から解決）:

- rulebook: `docs/ja/specdojo/rulebooks/sysd-cross-cutting-policy-rulebook.md`（state: `existing`）
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `_MISSING_`（state: `unresolved`）
- sample: `docs/ja/specdojo/samples/sysd-cross-cutting-policy-sample.md`（state: `existing`）
- template: `_MISSING_`（state: `unresolved`）

`existing` は既存文書の編集対象、`missing` は宣言されたパスにファイルが無い新規作成対象、`unresolved` は宣言からパスを解決できず要否・宣言の確認が必要な状態を表す。`unresolved` のパスを命名規則から推測して作成しない。

result: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-sysd-cross-cutting-policy-005/T-KATA-WAVE-1-sysd-cross-cutting-policy-005-20261114T024759Z-bb17cdab/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

成果物本体は frontmatter の `owner` に記載された role の視点で記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

まず実践の型の作成条件に照らして rulebook / recipe / sample / template の要否を判断する。必要な型だけを成果物と相互に矛盾しない一組として作成・整備し、不要な recipe / sample / template は rulebook frontmatter へ `not-needed` と宣言する。rulebook 自体が不要なら成果物カタログへ `rulebook: not-needed` と宣言する。成果物を主対象とし、そこから一般化した規定・作り方・例・雛形を必要な実践の型に反映する。各対象は実際に読み込んだうえで、既存があれば評価し、維持/修正/作り直しを判断する。必要だが既存が無ければ新規作成する。

作成条件は [[specdojo:kata-guide]] の `実践の型を作る条件` を正本とする。`_MISSING_` の参照は、rulebook frontmatter で `not-needed` と宣言済みなら作成しない。`undecided` なら要否を判断し、必要な型を整備して ID を宣言するか、不要として `not-needed` へ更新する。項目省略は必要だが未整備であるため作成対象に含める。

### grade result から展開された finding

- F001 \[major/vp-po-decision-readiness; line=194; anchor=`"| OPD / NFR / DEC | （なし）                  | 後続成果物で接続        | 現時点 |"`\]: `` `OPD / NFR / DEC`を「後続成果物で接続」とするだけで、未決事項ごとの判断者、判断期限、影響範囲、次アクションがなく、POが承認・保留・差し戻しを選べる状態になっていない。 ``
- F002 \[minor/vp-po-publication-accountability; line=163; anchor=`"- **Rule（MUST NOT）**: 通常運用で確認回避、repository外の無制限書き込み、review agentの成果物編集、agentによる最終承認を許可しない。"`\]: `` `scp-SEC-001`はagentによる最終承認を禁止しているが、公開可否を最終判断し説明責任を負う人間のRole codeをPO等へ一意に割り当てていない。 ``
- F003 \[minor/vp-pm-plan-feasibility; line=11; anchor=`"## 2. ルール一覧（ID/カテゴリ/要約/必須度）"`\]: `ルール一覧にはRule IDとOwnerがある一方、各ルールの実装済み・未実装、依存順、着手または確認タイミングがなく、進捗確認可能な作業計画へ直接展開できない。`
- F004 \[minor/vp-pm-dependency-risk; line=194; anchor=`"| OPD / NFR / DEC | （なし）                  | 後続成果物で接続        | 現時点 |"`\]: `OPD・NFR・DECへの接続を将来へ送っているが、作成対象ID、担当、ScheduleまたはPJRへの登録、未整備による後続影響を特定していない。`
- F005 \[minor/vp-pm-control-reporting; line=181; anchor=`"現時点で恒久例外はない。例外を追加する場合は、Rule ID、影響範囲、期限、承認者、復帰条件、DECまたは登録項目IDを記録する。"`\]: `例外についてDECまたは登録項目IDを要求しているが、ルール違反、リスク、課題、変更要求をどの種別へ記録し誰が報告・追跡するかを区別していない。`
- F006 \[minor/vp-ba-business-value; line=3; anchor=`"SpecDojo CLI、agent、実行runner、Git worktreeへ横断的に適用する責務、設定解決、状態遷移、失敗処理、権限のルールを定義する。実装・設定を一次情報とし、本書は設計意図と検証可能な制約のSSOTである。"`\]: `文書目的と各Rationaleは技術的効果を示す一方、どのプロジェクト対象者の課題とBV・成功基準に寄与するかを上位文書参照または対応関係で示していない。`
- F007 \[major/vp-ba-requirements-completeness; line=11; anchor=`"## 2. ルール一覧（ID/カテゴリ/要約/必須度）"`\]: `利用者が確認すべき共通エラー、冪等、タイムアウト、ログ・監査ログ、トレーシング、設定上書き階層、モジュール境界の要件と受入条件がなく、これらを対象外とする記述もない。`
- F008 \[minor/vp-ba-stakeholder-clarity; line=14; anchor=`"| Rule ID | Category | Summary | Level | Owner |"`\]: `ルール一覧のOwner列はARC・QE・PM・OPSを示すだけで、文書を利用するDEV、確認者、最終承認者、および各Roleが合意する対象を定義していない。`
- F009 \[major/vp-arc-cross-document-consistency; line=3; anchor=`"SpecDojo CLI、agent、実行runner、Git worktreeへ横断的に適用する責務、設定解決、状態遷移、失敗処理、権限のルールを定義する。実装・設定を一次情報とし、本書は設計意図と検証可能な制約のSSOTである。"`\]: `成果物カタログはエラー・タイムアウト・冪等・トレーシング・設定上書き階層・モジュール境界を対象として宣言しているが、本文はSpecDojoのagent実行規範に限定されているため、カタログまたは本文の適用範囲を一致させる必要がある。`
- F010 \[minor/vp-arc-cross-document-consistency; line=190; anchor=``"| CDFD            | `cdfd-task-execution`     | task状態の概念フロー    | 参照   |"``\]: ``関連文書表がstatus=deprecatedかつtrash配下へ移動済みの`cdfd-task-execution`、`cdfd-register-lifecycle`、`cdfd-multi-project`を現行参照としているため、後継SSOTへの更新または履歴参照である旨の明示が必要である。``
- F011 \[major/vp-arc-technical-constraints; line=109; anchor=`"- **Rule（MUST）**: policyはtaskのcriticalityと正規化signalに従い、上限付きretry、適合memberへのfallback、またはblockを選ぶ。独立したReady taskと別providerは継続できる。"`\]: `` `scp-RET-002`が依存するcriticality区分、正規化signalとの対応、attempt・backoff上限の設定キーが定義されておらず、retry・fallback・blockを選択する構成判断を実装へ固定できない。 ``
- F012 \[minor/vp-arc-conciseness; line=154; anchor=``"- **Rule（MUST）**: agent、agent配下の子プロセス、親検証、Vitest workerへ`GIT_DIR`、`GIT_WORK_TREE`その他のrepository固有環境変数を継承しない。Vitestは全設定の共通setupでtest module読込前にこれらを除去し、個々のTypeScriptテストからGitを起動する場合も`gitEnvironment()`から作った環境を明示する。executorにはcommitとGit設定を親runnerへ委ねるよう明示し、agent起動前後でagent worktreeのHEADと共有local configを比較して、差分があれば親検証・reporter・統合へ進めずblockする。runnerが作成したbranchの表示用metadataは比較から除外するが、`core.bare`を含むrepository動作に関わる設定は除外しない。テストfixtureのidentityはプロセス環境だけに注入し、local configへ書き込まない。"``\]: `` `scp-GIT-004`はRule・Scope・EnforcementでVitest setup、`gitEnvironment()`、HEAD・local config比較などを反復し、実装ファイルで管理できる低レベル手順まで再掲しているため、Ruleを不変条件に絞り検証詳細をEnforcementと参照先へ集約する必要がある。 ``
- F013 \[major/vp-dev-implementation-readiness; line=11; anchor=`"## 2. ルール一覧（ID/カテゴリ/要約/必須度）"`\]: `実装対象として必要な冪等、タイムアウトの設定・打切り、ログ方針がなく、既存のprovider retry規則にもattempt・backoff上限の値または設定キーがないため、DEVが必要な設定変更を確定できない。`
- F014 \[minor/vp-dev-change-impact; line=183; anchor=`"## 5. 関連ドキュメント導線（SYSD/SYSD-CF/NFR/OPD/OPR/DEC）"`\]: `関連文書表と各Referencesは参照先を列挙するだけで、Rule変更時に更新すべきschema、生成物、CLI互換性、移行手順、回帰対象の対応関係を示していない。`
- F015 \[major/vp-dev-testability; line=109; anchor=`"- **Rule（MUST）**: policyはtaskのcriticalityと正規化signalに従い、上限付きretry、適合memberへのfallback、またはblockを選ぶ。独立したReady taskと別providerは継続できる。"`\]: `` `scp-RET-002`のEnforcementはattempt上限、backoff上限、候補順、on_exhaustedのテスト名を列挙するだけで、入力別の期待動作、上限値または設定キー、実行する検証コマンドがなく、変更後の合否を再現できない。 ``
- F016 \[major/vp-qe-done-criteria; line=11; anchor=`"## 2. ルール一覧（ID/カテゴリ/要約/必須度）"`\]: `DC-002が要求する冪等方針、タイムアウトの設定・打切り方針、ログ方針がルール一覧および詳細に存在せず、provider障害の判定・retry規則だけでは条件を満たさない。`
- F017 \[major/vp-qe-done-criteria; line=194; anchor=`"| OPD / NFR / DEC | （なし）                  | 後続成果物で接続        | 現時点 |"`\]: `DC-004が要求する監視およびトレーシングの運用観点がなく、関連文書表でもOPDを「なし」としているため、セキュリティ規則だけでは条件を満たさない。`
- F018 \[major/vp-qe-verifiability; line=109; anchor=`"- **Rule（MUST）**: policyはtaskのcriticalityと正規化signalに従い、上限付きretry、適合memberへのfallback、またはblockを選ぶ。独立したReady taskと別providerは継続できる。"`\]: `` `scp-RET-002`はcriticalityと正規化signalに応じてretry・fallback・blockを選ぶとしているが, criticality区分、signalとの対応表、attempt・backoff上限の値または設定キーがなく、実装・テストのpass/failを一意に判定できない。 ``
- F019 \[major/vp-qe-omissions-consistency; line=11; anchor=`"## 2. ルール一覧（ID/カテゴリ/要約/必須度）"`\]: `rulebookと成果物カタログが要求する共通エラー、冪等、タイムアウト、ログ・監査ログ、トレーシング、設定上書き階層、モジュール境界のルールが欠落しているため、必須領域を追加するか適用範囲の正式な変更が必要である。`
- F020 \[minor/vp-ux-readability; line=154; anchor=``"- **Rule（MUST）**: agent、agent配下の子プロセス、親検証、Vitest workerへ`GIT_DIR`、`GIT_WORK_TREE`その他のrepository固有環境変数を継承しない。Vitestは全設定の共通setupでtest module読込前にこれらを除去し、個々のTypeScriptテストからGitを起動する場合も`gitEnvironment()`から作った環境を明示する。executorにはcommitとGit設定を親runnerへ委ねるよう明示し、agent起動前後でagent worktreeのHEADと共有local configを比較して、差分があれば親検証・reporter・統合へ進めずblockする。runnerが作成したbranchの表示用metadataは比較から除外するが、`core.bare`を含むrepository動作に関わる設定は除外しない。テストfixtureのidentityはプロセス環境だけに注入し、local configへ書き込まない。"``\]: `` `scp-GIT-004`のRuleが環境変数除去、Vitest setup、Git起動環境、executor権限、HEAD・config比較、除外条件、fixture identityを一段落に集約しているため, 同一Rule内の条件別箇条書きへ分けて判断点を追いやすくする必要がある。 ``
- F021 \[minor/vp-ux-user-flow; line=96; anchor=``"- **References（参照）**: `cdfd-task-execution`、登録簿運用ガイド。"``\]: `` `登録簿運用ガイド`および複数箇所の`provider別子設計`が文書ID・相対パス・リンクを持たず参照先を一意に特定できないため、正式なIDまたはリポジトリ相対パスへ置き換える必要がある。 ``
- F022 \[minor/vp-ux-language-consistency; line=20; anchor=`"| scp-CFG-002 | Configuration | 設定と秘密情報の責務を分離する | MUST NOT | ARC / OPS |"`\]: `` `scp-CFG-002`の要約「設定と秘密情報の責務を分離する」に`MUST NOT`を組み合わせると責務分離を禁止する意味になるため、詳細規則に合わせて要約を「秘密情報を設定・文書へ保存しない」等へ修正する必要がある。 ``
- F023 \[major/vp-ops-release-readiness; line=1; anchor=`"# SpecDojo システム設計横断ルール"`\]: `statusがdraftのまま、未充足の横断領域、deprecated参照、未接続のOPD・NFR・DECを解消するready条件、承認者、公開前確認手順が本文にない。`
- F024 \[major/vp-ops-operability; line=194; anchor=`"| OPD / NFR / DEC | （なし）                  | 後続成果物で接続        | 現時点 |"`\]: `DC-004が要求する監視およびトレーシングの運用観点がなく、関連文書表でもOPDを「なし」としているため、セキュリティ規則だけでは条件を満たさない。`

1. 既存文書の finding: plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み、指摘された問題を解消するよう該当箇所を修正する。修正後、問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。修正後は `grade plan --changed-only` の対象になるため、再評価で構造・整合性が劣化していないことを確認する。
2. 成果物（主対象）: `depends_on` の決定事項・用語・制約と整合させ、owner ロールの責務に集中して記述する。既存記述があれば内容を評価し、活かせる部分は維持、古い・矛盾する部分は修正、前提と合わない場合は作り直す。内部情報だけで判断できない一般的な観点・用語・標準があり、実行 agent が Web 検索能力を持つ場合は、関連情報を取得して出典を添える。
3. rulebook: 必要と判断した場合だけ、成果物の構造を一般化し、章構成・必須項目・禁止事項・判定基準を、同種成果物へ適用できる規定として整理する。rulebook は [[specdojo:rulebook-authoring-standard]]（章立て・Frontmatter 規約・記述ルール・禁止事項の正本）に従う。
4. recipe: 必要と判断した場合だけ、良い成果物を作るための問い・観点・深掘り手順・レビュー観点を、再利用できる作成手順として整理する。
5. sample: 必要と判断した場合だけ、粒度・文体・表の書き方が伝わる最小の完成例にする。プロジェクト固有の値は一般化またはプレースホルダ化する。sample は [[specdojo:sample-authoring-standard]]（構成・記述ルール・共通サンプル文脈・禁止事項の正本）に従い、rulebook / recipe と矛盾しないように作成する。
6. template: 必要と判断した場合だけ、章構成の骨組みとプレースホルダを配置した雛形にする。成果物固有の内容は持ち込まない。template は [[specdojo:template-authoring-standard]]（構成・プレースホルダ規約・禁止事項の正本）に従い、埋めた結果が rulebook の本文構成と矛盾しないように作成する。

実践の型は成果物の丸写しにせず、同種成果物に再利用できる形に一般化する。構造・必須項目・禁止事項は rulebook を正とし、recipe / sample / template は rulebook と矛盾しないように揃える。

内容の根拠としてよい文書は、この plan に記載された対象（成果物・rulebook / 併せて適用する rulebook / recipe / sample / template）、`対象成果物` セクションの `depends_on` 成果物、プロジェクトコンテキストに限定する。これら以外を成果物の内容の根拠にしない。ただし bootstrap では例外として、同種で `status: ready` の文書を手本として参照してよい（次項参照）。判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

ここで整備した実践の型は後続の refine-pass で凍結し、編集しない。本タスクの実行に必要な bootstrap の進め方は、このセクションで完結する。approach 全体の定義を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 4.1. 同種の ready 文書を手本にする

bootstrap では実践の型が未整備なため、構造・記法・慣行の揺れ（毎回ゼロから設計し直すことによる churn）を避ける目的で、同種で `status: ready` の文書を手本にする。

- 成果物・rulebook・recipe・sample・template のそれぞれについて、同じ種別で `status: ready` の文書があれば、その章構成・粒度・文体・表の書き方・プレースホルダの置き方などを手本にし、確立済みの形に倣う。
- 手本にするのは形（構造・記法・慣行）であり、内容は丸写ししない。当該成果物の内容は `depends_on` とプロジェクト文脈に基づいて書く。
- 手本が複数ある場合は、対象に最も近い種別・粒度のものを優先する。`status: ready` の同種文書が無い場合は、手本なしで `depends_on` と対象領域の慣行から組み立てる。
- 手本にした文書は result の `進め方と実践の型の適用` セクションに記録する。

### 4.2. 既存物の評価と作り直しの判断

- 各対象に既存記述がある場合は、まず内容を読み、根拠（成果物・`depends_on`・同種の `ready` 文書・対象領域の慣行）と整合するかを評価する。
- 整合するものは維持し、過不足・陳腐化・矛盾がある部分のみ修正する。基準として機能しないほど内容が古い・薄い場合に限り作り直す。
- 既存が無い、または参照範囲から外れた対象は、成果物・`depends_on`・同種の `ready` 文書を手本に新規作成する。

### 4.3. 判断根拠の記録

成果物と各実践の型について、評価・作成・修正・維持の判断根拠を result に残す。記録先は次のとおり。

- 成果物と各実践の型の作成・修正・維持の判断、手本にした同種 `ready` 文書、相互整合の取り方、矛盾時に rulebook を正とした箇所、丸写しを避けるための一般化、Web 出典: result の `進め方と実践の型の適用` セクション。

## 5. 完了の狙い

この成果物が満たすべき狙い（成果物カタログの `done_criteria`）を、owner ロールの狙いと下流ロールの入力適合に分けて示す。「進め方」に従って成果物と実践の型を整備する中で、owner の狙いを作成目標として満たすことを目指す。下流ロールの項目は、その文書から各ロールが自分の責務の成果物を作成できるよう入力として最低限成立させる範囲にとどめ、各ロールの内容を成果物に作り込まない（一文書一責務）。下流ロールの適合性検証や観点別の自己レビュー・修正ループは行わず、多観点での検証は後続の独立した review task に委ねる。

owner として達成する狙い:

- 横断ルールが実装上の制約として確認できること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [DEV] エラー処理・冪等・タイムアウト・ログ方針が記述されていること
- [QE] 横断ルールのテスト・検証方針が確認できること
- [OPS] 監視・トレーシング・セキュリティの運用観点が確認できること

## 6. 仕上げの品質チェック

成果物と実践の型の更新が一通り終わった後、内容の質を上げる仕上げとして、次の4操作を1回だけ通しで実施する。これは単発の仕上げ操作であり、観点別の自己レビュー・修正ループではない。同じ観点での再確認を繰り返さず1巡で終え、多観点での検証は後続の独立した review task に委ねる。

1. 不要記述の削除: rulebook の必須要素にも「完了の狙い」に示された `done_criteria` にも寄与していない記述を削除する。
2. 重複記述の統合: 同じ内容が同一文書内、または成果物と実践の型の間で重複している場合は、内容が最も適切な1箇所を正本と定めて統合し、他は要約または正本への参照に置き換える。統合で情報が失われる場合は、不足分を正本側へ取り込んでから他方を整理する。
3. 可読性のための分割: 1つの節・段落・表に複数の論点が混在して読み取りにくい箇所を、節・箇条書き・表へ分割する。分割は rulebook が定める章構成の範囲内で行い、章構成そのものを崩さない。
4. 論理整合の確認: 用語・定義・前提・手順の順序が、文書内および成果物と実践の型の間で矛盾していないかを確認し、矛盾があれば整える（構造・必須項目・禁止事項は rulebook を正とする）。

この4操作は既存の記述の整理として行い、「進め方」で定めた根拠の範囲を超える内容は追記しない。削除・統合・分割の可否を判断できない箇所は、無理に整理せず _TODO_ / _ASSUMPTION_ として論点を残す。実施した削除・統合・分割と、その判断根拠は result の `進め方と実践の型の適用` セクションに記録する。

## 7. 完了手順

1. 「このフェーズで行うこと」と「進め方」に従って、成果物と必要な rulebook / recipe / sample / template、成果物カタログの rulebook 宣言、および rulebook frontmatter の3種の要否宣言を更新する。
2. 「完了の狙い」を満たしているかを確認し、不足があれば加筆・補強する（観点別の自己レビューや再確認ループは行わない）。
3. 「仕上げの品質チェック」の4操作を1回だけ実施する（成果物と各実践の型の相互整合の確認を含む）。
4. 共通規約に従って、必要な整形・静的検査を実行する。
5. result に実施内容・変更ファイル・進め方と実践の型の適用を記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 8. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
