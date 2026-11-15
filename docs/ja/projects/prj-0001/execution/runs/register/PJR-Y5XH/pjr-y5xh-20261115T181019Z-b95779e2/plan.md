---
specdojo:
  id: prj-0001:xep-pjr-y5xh-20261115t181019z-b95779e2
  type: exec-plan
  rulebook: none
  task_id: PJR-Y5XH
  name: "pm-raci を grade の指摘で手直しする（project-kata の 140 の差し戻し）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: PM
  approach: fully-guided
  targets:
    - prj-0001:pm-raci
---

# Edit Plan: PJR-Y5XH

## 1. このフェーズで行うこと

pm-raci を最新の grade の指摘で直す

## 2. 対象成果物

- `name`: RACI
- `depends_on`:
  - [[prj-0001:pm-organization]]
- `based_on`（対象成果物の frontmatter）: [[specdojo:people-and-organization-definition-standard]]、[[prj-0001:pm-organization]]
- 個票の `入力`: 下記「個票の入力（前提）」を参照。
- `overview`: 成果物・プロセスごとの責任分担マトリクスを定義（中規模以上）
- `path`: `docs/ja/projects/prj-0001/030-project-management/pm-raci.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-Y5XH/pjr-y5xh-20261115T181019Z-b95779e2/result.md`

### プロジェクトコンテキスト

以下は `depends_on` とは独立したプロジェクト共通の文脈であり、実行順序・成果物間の根拠関係を表さない。作業開始前に実際に読み、プロジェクトレベルの Why、用語、判断原則と成果物の内容を整合させる。

- [[prj-0001:prj-overview]]

プロジェクトレベルの Why は判断軸として参照し、全文を成果物へ再掲しない。対象成果物の責務に必要な結論・影響だけを反映する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PM（Project Manager）**
- 責務: 参考資料整備と成果物作成の計画・進捗・課題・リスクを管理する。小規模運用では専任化せず、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- 計画化可能性: 成果物の内容がタスク化、順序付け、所要時間見積もり、進捗確認に使える粒度になっているか。
- 依存関係・リスク・課題化: 後続成果物、Schedule、PJR に影響する依存、リスク、課題、変更要求が識別されているか。
- 管理・報告への接続: 進捗、課題、リスク、変更要求、決定記録へ転記すべき事項が分離されているか。

## 4. 進め方

fully-guided は既存成果物の磨き込み専用である。雛形からの下書きや、調査して新しい値を選ぶ作業は draft で行う。対象成果物が未作成、または文脈だけの状態なら、下書きが必要なことを result に記録し、draft へ申し送る。

成果物内に `_CONTEXT_:` が残っている場合は、その指示を本文へ反映・削除せず、元の指示、未反映の箇所、必要な下書きを論点として result の `進め方と実践の型の適用` セクションに残し、draft へ申し送る。executor / reporter pipeline では報告の `handoff` に記載し、reporter と runner が result へ転記する。

対象成果物に必要と宣言された rulebook / recipe / sample は、指定されたファイルを実際に読み込んだうえで、次の役割に沿って参照する。読み込まずに記憶や推測で代替しない。

参照ファイル（成果物カタログの rulebook ID と rulebook frontmatter から解決。`_MISSING_` は `undecided`、`not-needed`、未整備、または `kind: generated` による非適用を表す。fully-guided では通常 `not-needed` の項目だけが該当する）:

- rulebook: `docs/ja/specdojo/rulebooks/pm-raci-rulebook.md`
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `docs/ja/specdojo/recipes/pm-raci-recipe.md`
- sample: `docs/ja/specdojo/samples/pm-raci-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[major/vp-po-decision-readiness; line=38; anchor=`"| 成果物作成                         | C   | A   | R   | R   | R   | C   | R   | C   |"`; cause=document\]: `Define whether PM's A covers workflow coordination or content approval, and explicitly preserve each deliverable row's content approver; the current creation-process row permits conflicting approval interpretations.`
- F002 \[major/vp-pm-plan-feasibility; line=28; anchor=`"| 成果物カタログ                                                | C   | C   | A/R | R   | I   | C   | I   | I   |"`; cause=document\]: `Specify the work led by BA and ARC for the deliverable catalog and the work led by BA, ARC, DEV, and UX in line 38; without one lead Role code per work unit, task assignment and progress tracking remain ambiguous.`
- F003 \[minor/vp-pm-dependency-risk; line=52; anchor=``"採用 Role code、成果物区分、Schedule の owner、主要判断、参加者、兼務の継続可能性が変わった場合に見直す。特に、実装・体験・公開運用が増えた場合は `DEV`、`UX`、`OPS` の専任化と責任分離を確認する。"``; cause=document\]: `Add a review step identifying affected unfinished tasks, dependencies, and approval gates, with unresolved responsibility changes referred to the project register before dependent work proceeds.`
- F004 \[minor/vp-pm-control-reporting; line=37; anchor=`"| 作業順序、進捗、課題・リスク管理   | C   | A/R | C   | C   | C   | C   | C   | C   |"`; cause=document\]: `Reference the project register or management plan and distinguish where PM records progress updates, existing responsibility issues, future handover risks, change requests, and decisions, including the responsible Role and next action.`
- F005 \[minor/vp-ba-requirements-completeness; line=5; anchor=``"初期公開と代表試行に必要な責任境界を示す。列は [[prj-0001:pm-roles|ロール定義]] の Role code を用い、各行の `A` は1ロールとする。AI Agent は `R` または `C` の作業を支援できるが、`A` は担わない。"``; cause=document\]: `State which initial-publication responsibilities are intentionally omitted and why, or identify their covering rows, particularly for CLI/schema work and publication preparation; the broad scope and line 52's future-growth wording otherwise leave coverage uncertain.`
- F006 \[major/vp-arc-cross-document-consistency; line=24; anchor=`"| RACI、管理計画、コミュニケーション計画、Launch Track Strategy | C   | A/R | C   | C   | I   | C   | I   | C   |"`; cause=document\]: ``「Launch Track Strategy」を `PM=A/R`、`ARC=C` としているが、Schedule の `sch-strategy-launch` は `owner=ARC` であり、44行目の「owner は主たる R と一致」方針に反するため、RACI または Schedule の正本を整合させる必要がある。``
- F007 \[minor/vp-arc-technical-constraints; line=44; anchor=``"- Schedule の `owner` は、成果物または作業を主導する `R` の Role code と一致させる。"``; cause=document\]: `Qualify the R-to-owner rule with explicit WBS-owner precedence and separate approval, review, and external-wait tasks that may use the corresponding A or C; reference the standard's Schedule assignment rules.`
- F008 \[major/vp-dev-implementation-readiness; line=38; anchor=`"| 成果物作成                         | C   | A   | R   | R   | R   | C   | R   | C   |"`; cause=document\]: `Provide work-specific lead roles or an explicit mapping to the deliverable rows before using this process row to assign implementation, configuration, or documentation tasks; four undifferentiated R roles do not provide an executable assignment.`
- F009 \[minor/vp-dev-change-impact; line=52; anchor=``"採用 Role code、成果物区分、Schedule の owner、主要判断、参加者、兼務の継続可能性が変わった場合に見直す。特に、実装・体験・公開運用が増えた場合は `DEV`、`UX`、`OPS` の専任化と責任分離を確認する。"``; cause=document\]: `Identify the authoritative organization, role/member definitions, Schedule strategy or task sources, and communication plan that PM must check after a responsibility change, and require follow-up owners for affected updates.`
- F010 \[major/vp-qe-done-criteria; line=24; anchor=`"| RACI、管理計画、コミュニケーション計画、Launch Track Strategy | C   | A/R | C   | C   | I   | C   | I   | C   |"`; cause=document\]: ``Schedule owner と異なる責任配置を含むため、成果物・プロセス別マトリクスを承認可能にするには `sch-strategy-launch` の `ARC` owner と本行の `PM=A/R` のどちらを正とするか確定して整合させる必要がある。``
- F011 \[major/vp-qe-done-criteria; line=38; anchor=`"| 成果物作成                         | C   | A   | R   | R   | R   | C   | R   | C   |"`; cause=document\]: `Although every matrix row contains exactly one A, PM's unrestricted creation-process A overlaps the deliverable-specific A assignments; define the separate decision scopes before claiming that each deliverable has one unambiguous Accountable.`
- F012 \[major/vp-qe-verifiability; line=38; anchor=`"| 成果物作成                         | C   | A   | R   | R   | R   | C   | R   | C   |"`; cause=document\]: ``「成果物作成」の `PM=A` が各成果物行の Accountable とどう異なるか、また `BA`・`ARC`・`DEV`・`UX` のどれが主たる R か判定できないため、作成プロセスの対象範囲と内容の最終判断との差、主担当の決定方法を明記する必要がある。``
- F013 \[major/vp-qe-verifiability; line=28; anchor=`"| 成果物カタログ                                                | C   | C   | A/R | R   | I   | C   | I   | I   |"`; cause=document\]: `Define the catalog work led by BA and the catalog work led by ARC, with one lead Role code for each task type, so an owner assignment can be judged correct or incorrect without inference.`
- F014 \[major/vp-qe-omissions-consistency; line=24; anchor=`"| RACI、管理計画、コミュニケーション計画、Launch Track Strategy | C   | A/R | C   | C   | I   | C   | I   | C   |"`; cause=document\]: `` `sch-track-planning.yaml` の `sch-strategy-launch` は `owner=ARC` だが本行では `ARC=C` であり、Schedule owner と主たる R を矛盾させないという rulebook の必須制約を満たしていない。 ``
- F015 \[major/vp-qe-omissions-consistency; line=28; anchor=`"| 成果物カタログ                                                | C   | C   | A/R | R   | I   | C   | I   | I   |"`; cause=document\]: `Add work-specific lead-role and responsibility notes for both multiple-R rows at lines 28 and 38; the declared rulebook sections 5 and 6.4 require these distinctions, but neither row supplies them.`
- F016 \[minor/vp-ux-readability; line=38; anchor=`"| 成果物作成                         | C   | A   | R   | R   | R   | C   | R   | C   |"`; cause=document\]: ``「成果物作成」が各成果物別行と重複して見え、`PM=A` と成果物ごとの A の関係を読み分けにくいため、「作成フローの運営」など対象を限定する説明を加える必要がある。``
- F017 \[minor/vp-ux-user-flow; line=44; anchor=``"- Schedule の `owner` は、成果物または作業を主導する `R` の Role code と一致させる。"``; cause=document\]: `Schedule owner との照合を要求しているが参照対象の Schedule／strategy が特定されていないため、対応する正本の文書IDまたはリンクを示す必要がある。`
- F018 \[minor/vp-ux-language-consistency; line=24; anchor=`"| RACI、管理計画、コミュニケーション計画、Launch Track Strategy | C   | A/R | C   | C   | I   | C   | I   | C   |"`; cause=document\]: ``「Launch Track Strategy」は成果物カタログの「Launch スケジュール戦略定義」と表記が異なり対象の照合を曖昧にするため、正式名称または `sch-strategy-launch` local_id に統一する必要がある。``
- F019 \[minor/vp-ops-release-readiness; line=39; anchor=`"| 成果物・品質ゲートの確認           | C   | C   | C   | C   | C   | A/R | C   | I   |"`; cause=document\]: `Explain that QE's A covers the completeness and outcome of quality confirmation, distinguish it from PO's acceptance and publication decisions, and reference the quality plan for handling unmet gates and exception requests.`
- F020 \[minor/vp-ops-operability; line=48; anchor=`"- 生成される登録簿ビューや Schedule は直接編集せず、正本の登録簿または戦略・設定を更新する。"`; cause=document\]: `Define who investigates an assignment mismatch and how to choose between correcting RACI, a task-definition source, or generation behavior; require unresolved cases to receive a register owner and decision timing.`

`cause` は原因の所在を示す。`kata:<kind>` の指摘も成果物側の修正が必要なため、この plan に載るすべての指摘を扱う。Kata の手入れは対応する maintenance の段で行う。

plan に展開された finding は、message と同じ viewpoint ID の判定根拠に照らして解消する。未解消、根拠不足、または判断不能の場合は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。

参照してよい文書は、宣言された文書だけに限る。具体的には、対象成果物、本セクションの rulebook / 併せて適用する rulebook / recipe / sample、`対象成果物` セクションの `depends_on` 成果物、対象成果物の frontmatter の `based_on`、プロジェクトコンテキスト（`project_context`）、個票の `入力`、カタログの `brief` である。加えて、下記「実装エビデンスと未作成の依存」に列挙した実装の根拠を読み取り専用で参照する。`入力` と `brief` は値が無いときは載せない。これらに宣言されていない他のプロジェクト文書・実装や外部の情報を独自に探索・参照しない。磨き込みは宣言された資料とこの plan 自身の記述（フェーズ説明・完了の狙い）だけを根拠に行い、不足があっても未宣言の文書を追加で読んで補わない。それでも判断できない箇所は憶測で埋めず _TODO_ / _ASSUMPTION_ として論点を残す。

本タスクの実行に必要な fully-guided の参照方針は、このセクションで完結する。approach 全体の定義（他 approach との対比や review への適用）を確認したい場合のみ、参考として [[specdojo:ryu-guide]] を参照する。

### 実装エビデンスと未作成の依存

次の参照は成果物カタログの `evidence_refs` から展開した読み取り専用の実装の根拠である。`targets`、変更許可範囲、commit 対象には含めない。

なし（`evidence_refs` 未指定またはカタログなし）。

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

- 成果物・プロセスごとの責任分担マトリクスを承認できること
- 確認者・合意対象など業務観点での責任分担が読み取れること
- RACI の Role code が組織定義の採用ロールと整合していること
- A の集約（1 成果物 1 Accountable）と R/C の抜け漏れがないこと

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

- T-PROJECT-KATA-pm-raci-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43 の 1.4 の D）。2026-11-15 の grade で完了条件を満たしていない
- 最新の grade の未充足の完了条件と major の指摘を取り込む。本文は status: ready のまま差し戻したため、直す間の status の扱いも決める

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く。
- 本文はすでに `status: ready` のため、直す間に `draft` へ戻すか、`ready` のまま直すかを決め、理由を対応結果に書く（確定は人が 140 で行う）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
