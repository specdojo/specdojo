---
specdojo:
  id: prj-0001:xep-pjr-cpzh-20261116t163755z-6cd1ab40
  type: exec-plan
  rulebook: none
  task_id: PJR-CPZH
  name: "prj-comparison-of-alternatives を grade の指摘で手直しする（project-kata の 140 の差し戻し）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: PM
  approach: fully-guided
  targets:
    - prj-0001:prj-comparison-of-alternatives
---

# Edit Plan: PJR-CPZH

## 1. このフェーズで行うこと

prj-comparison-of-alternatives を最新の grade の指摘で直す

## 2. 対象成果物

- `name`: 代替案比較
- `depends_on`:
  - [[prj-0001:prj-scope]]
  - [[prj-0001:prj-issues-and-approach]]
- `based_on`（対象成果物の frontmatter）: [[prj-0001:prj-scope]]、[[prj-0001:prj-issues-and-approach]]、[[prj-0001:prj-assumptions-constraints-dependencies]]
- 個票の `入力`: 下記「個票の入力（前提）」を参照。
- `overview`: 技術的・方針的な代替案を比較評価
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-comparison-of-alternatives.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-CPZH/pjr-cpzh-20261116T163755Z-6cd1ab40/result.md`

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

- rulebook: `docs/ja/specdojo/rulebooks/prj-comparison-of-alternatives-rulebook.md`
- 併せて適用する rulebook（記法など）: _MISSING_
- recipe: `docs/ja/specdojo/recipes/prj-comparison-of-alternatives-recipe.md`
- sample: `docs/ja/specdojo/samples/prj-comparison-of-alternatives-sample.md`

1. rulebook: `_MISSING_` でなければ指定された rulebook を読み込み、成果物が必須要素をすべて満たし、禁止事項に抵触していないかを構造面の基準として確認する。
2. 併せて適用する rulebook: `_MISSING_` でない場合は各ファイルを読み込み、記法など主 rulebook が委譲したルールに従う。主 rulebook と矛盾する場合は主 rulebook を正とする。
3. recipe: `_MISSING_` でなければ指定された recipe を読み込み、示された問い・観点・深掘り手順に沿って内容を組み立てる。
4. sample: `_MISSING_` でなければ指定された sample を読み込み、rulebook の要求を満たす完成例の形式（章・表・記述の粒度）を確認する。sample は形式の参照に限って使い、sample の業務内容・固有名詞・値を対象成果物へ転記しない。

磨き込みでは template は読み込まない。粒度・文体・表現・章構成は、既存の対象成果物を基準としてそろえる。sample は既存の対象成果物に該当する記述が無い箇所や、rulebook の要求を形式に落とす方法が判断できない箇所の参考に限る。既存の対象成果物と sample の形式が異なる場合は、rulebook の許容範囲内である限り既存の対象成果物を優先する。書き方が複数の文書間で矛盾する場合は rulebook を正とする。

### grade result から展開された finding

- F001 \[minor/vp-arc-cross-document-consistency; line=226; anchor=``"検証手順（実行する検証、対象、期待結果）の正本は、前提・制約・依存関係の ACD-D04 で `ARC` が特定する（品質管理計画の検証方針が候補）。正本が特定されるまで、D-01・D-02 の「検証エラー 0 件」の確認と WP-02 を完了扱いにしない。"``; cause=document\]: `本文は検証手順の正本を ARC が今後特定し、品質管理計画を「候補」としていますが、docs/ja/projects/prj-0001/020-project-definition/prj-assumptions-constraints-dependencies.md の ACD-D04 は既に prj-0001:pm-quality-management-plan の検証方針を正本に指定しています。「正本未特定」と「正本指定済み」の不整合を解消し、確定済みの参照先と、その手順の充足・実行確認を分けて記述してください。`
- F002 \[minor/vp-arc-technical-constraints; line=192; anchor=`"| SDD-04 | 成果物適合は Middle。IDE 内で仕様をレビューでき人間の統制は High。IDE 外での取り扱いに一部変換を要し可逆性は Middle                                    | IDE への依存で中立性が Low となり、特定製品へ過度に固定されない条件に反するため非採択                      | IDE 統合が必須になった場合                                                   |"`; cause=document\]: `SDD-04 の「IDE 外での取り扱いに一部変換を要する」と、193行の SDD-05 の「体系の置換を要する」は、評価対象の版・構成や必要となる変換・置換対象が示されていません。Kiro 公式資料は CLI 等での Specs 利用と Markdown ファイルを、BMAD 公式資料は機能群の個別利用を説明しているため、製品一般の制約と、本試行で選ぶ構成に生じる負荷を区別して評価根拠を補ってください。`
- F003 \[major/vp-qe-verifiability; line=142; anchor=`"- 尺度: High・Middle・Low は順序尺度で、数値に換算しない。各セルは評価軸の表の判定基準のうち、最初の条件を満たせば High、2番目の条件に当たれば Middle、3番目の条件に当たれば Low とする。条件を確認できない、または High の条件を一部しか確認できない場合は Middle とし、未確認事項を High としない。"`; cause=document\]: `High・Middle・Lowの判定境界、各セルの根拠、D-01の重みを総合評価と採否へ反映する規則がなく比較結果を再現できないため、尺度・証拠・集約規則を明記してください。判定境界と集約規則は今回追加されていますが、各セルの根拠については未解消です。未確認を Middle とする規則を改め、確認済みの中間評価と未判定を分離し、根拠資料の該当箇所または観察結果と確認作業を記録して、未判定の採否への扱いも定めてください。`
- F004 \[minor/vp-qe-omissions-consistency; line=201; anchor=`"| TSK-02 | Middle | Middle   | Middle     | High       | High     | High     | Middle     | High   | 段階採用       |"`; cause=document\]: `TSK-02 の運用負荷を High としていますが、134行の High は同期等の追加作業を要しない状態であり、224行では Issue ごとの正本への転記とクローズ後の照合を必要としています。この追加管理作業を評価に含めて Middle 等へ見直すか、High の条件を満たす仕組みと根拠を示し、採否理由も整合させてください。`

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

owner として達成する狙い:

- 案ごとのリスク・トレードオフが比較されていること

下流ロールの入力適合（最低ライン。各ロールの内容は作り込まず、入力として成立させる）:

- [BA] 比較軸・評価根拠が業務価値と対応していること
- [PO] 推奨案を判断できる情報が含まれていること
- [ARC] 技術的実現可能性・影響が評価されていること

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

- T-PROJECT-KATA-prj-comparison-of-alternatives-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43 の 1.4 の D）。2026-11-15 の grade で完了条件を満たしていない
- 最新の grade の未充足の完了条件と major の指摘を取り込む。本文は status: ready のまま差し戻したため、直す間の status の扱いも決める
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade の未充足の完了条件と major の指摘を取り込み、成果物カタログの完了条件をすべて満たす。直した後に `grade run --target deliverable` で grade し直し、結果を対応結果に書く。
- 本文はすでに `status: ready` のため、直す間に `draft` へ戻すか、`ready` のまま直すかを決め、理由を対応結果に書く（確定は人が 140 で行う）。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の後）: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target deliverable`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。
- 3 回目の実行（2026-11-17、2 回目の再 grade の指摘を取り込む回）: `docs/ja/projects/prj-0001/execution/grade/results/prj-0001.prj-comparison-of-alternatives.yaml` の major のうち、F003（各セルの根拠）を直す。未確認を Middle とする規則を改め、確認済みの中間評価と未判定を分け、各セルに根拠資料の該当箇所または観察結果と確認作業を記録し、未判定の採否への扱いを定める。作業内容の表を実績に合わせる。再 grade は orchestrator が流すため、executor はその行を open のまま残す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
