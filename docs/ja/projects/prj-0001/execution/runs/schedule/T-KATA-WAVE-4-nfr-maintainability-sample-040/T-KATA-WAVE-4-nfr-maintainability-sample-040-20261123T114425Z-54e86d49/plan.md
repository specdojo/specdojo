---
specdojo:
  id: prj-0001:xep-t-kata-wave-4-nfr-maintainability-sample-040-20261123t114425z-54e86d49
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-4-nfr-maintainability-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - specdojo:nfr-maintainability-sample
    - specdojo:nfr-maintainability-rulebook
---

# Edit Plan: T-KATA-WAVE-4-nfr-maintainability-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 保守性要件の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、保守性要件の完成例を示す
- `path`: `docs/ja/specdojo/samples/nfr-maintainability-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-4-nfr-maintainability-sample-040/T-KATA-WAVE-4-nfr-maintainability-sample-040-20261123T114425Z-54e86d49/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/nfr-maintainability-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

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

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=5; anchor=``"非機能要件のうち保守性（変更容易性・障害解析容易性）を定義する `nfr-maintainability` の作成ルールを定めます。"``\]: ``導入文と全体方針に、保守性要件を定める目的（受入判定 `sac-*` や運用設計 `opd-*` の前提を揃えるなど）と利用先を明記し、成果物の必要性を上位文書との対応で説明できるようにする。``
- F002 \[minor/vp-po-decision-readiness; line=1; anchor=`"# 非機能要件 / 保守性 作成ルール"`\]: `` `recipe` / `template` が `undecided` のままで sample も標準テンプレに未整合なので、要否の判断対象と次アクションを PJR に登録し、PO が承認や差し戻しを判断する材料が分かるようにする。 ``
- F003 \[minor/vp-pm-plan-feasibility; line=73; anchor=`"- 要件 ID ごとに、測定方法（監視記録、障害レポート、訓練、CI の計測など）・判定タイミング・判定者を示す。"`\]: `測定・検証方法の判定者は適用先メンバー定義の Role code で記述すると明記し、サンプル例の「SRE / PM」「テックリード」などの職名も Role code の表記にそろえる。`
- F004 \[minor/vp-pm-dependency-risk; line=77; anchor=``"- `opd-*`、`opr-*`、`dec-*` への導線を必ず置く。"``\]: ``関連ドキュメント導線で必須とする `dec-*` を位置づけにも加え、保守性要件の閾値を変えたときに `sac-*` や `opd-*`/`opr-*` へ波及する依存の扱いを明記する。``
- F005 \[minor/vp-pm-control-reporting; line=73; anchor=`"- 要件 ID ごとに、測定方法（監視記録、障害レポート、訓練、CI の計測など）・判定タイミング・判定者を示す。"`\]: ``測定・検証で閾値未確定や基準未達が判明した場合に、課題・リスク・決定記録（`dec-*`）のどれへ転記するかを記述ガイドで区別する。``
- F006 \[minor/vp-ba-business-value; line=60; anchor=`"- どの変更・障害対応の効率を担保するかを示す。"`\]: `概要（対象・目的）の記述ガイドに、対象者と業務影響（障害で業務が止まる時間、変更待ちの影響など）を書き、閾値の根拠と結び付けることを求める。`
- F007 \[minor/vp-ba-requirements-completeness; line=63; anchor=`""`\]: `適用範囲・前提条件に対象外（可用性・性能など他の NFR との境界）を記載するよう記述ガイドで求め、要件の重複や漏れを防ぐ。`
- F008 \[minor/vp-ba-stakeholder-clarity; line=64; anchor=`"- 対象システム、対象運用時間、チーム体制前提を記述する。"`\]: `適用範囲・前提条件に、閾値の合意者と、保守作業を担う運用者・開発者を Role code で記載するよう求める。`
- F009 \[minor/vp-arc-technical-constraints; line=40; anchor=``"- `specdojo.type` は `requirement`、`specdojo.rulebook` は `specdojo:nfr-maintainability-rulebook` とする。"``\]: `` `deliverable_type` と生成物の `specdojo.type` の関係を明記し、監視・ログ基盤など測定の前提となる外部依存を適用範囲・前提条件に記載するよう求める。 ``
- F010 \[minor/vp-dev-implementation-readiness; line=73; anchor=`"- 要件 ID ごとに、測定方法（監視記録、障害レポート、訓練、CI の計測など）・判定タイミング・判定者を示す。"`\]: ``測定・検証方法の記述ガイドに、表形式の列（`要件ID` / `測定方法` / `判定タイミング` / `判定者`）を保守性要件一覧と同じように明記する。``
- F011 \[minor/vp-dev-change-impact; line=34; anchor=``"- 要件IDは `nfr-mnt-<連番>` を推奨する。"``\]: ``要件 ID を廃止・改訂したときに連番を再利用しないことと、参照元（`sac-*`、`opr-*`）の追従方法を ID 規則に明記する。``
- F012 \[minor/vp-dev-testability; line=12; anchor=``"- **共通の運用**: 役割の割り当ては適用先のメンバー定義に、`status` の昇格と承認、改訂と廃止、未決事項の登録簿への引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従い、本書と成果物で言い直さない。文書の整形・lint はリポジトリの検証で扱い、「測定・検証方法」に含めない。"``\]: ``成果物作成後に確認する検証コマンド（`npm run -s lint:md`、`npm run lint:fm` など）の所在を、正本への参照として1行示す。``
- F013 \[minor/vp-qe-verifiability; line=68; anchor=``"- 表形式（`id` / `内容` / `指標` / `基準` / `備考`）で記述する。"``\]: `保守性要件一覧の基準に、集計方法（平均・最大・パーセンタイル）と集計期間を併記するよう求め、判定のぶれを防ぐ。`
- F014 \[minor/vp-qe-omissions-consistency; line=14; anchor=`"## 2. 位置づけと用語定義（必要に応じて）"`\]: ``2章の見出しから「（必要に応じて）」を外して必須性を本文で明示し、位置づけの一覧へ関連ドキュメント導線で必須とする `dec-*` を加えて章間の不整合を解消する。``
- F015 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 非機能要件 / 保守性 作成ルール"`\]: ``指定されているサンプル成果物 `specdojo:nfr-maintainability-sample` が、本書で定義した標準テンプレの構成に従っていない。``
- F016 \[minor/vp-qe-kata-conformance; line=87; anchor=`"## 8. サンプル"`\]: `「サンプル」章の 8.1・8.2 は H3 見出しと表を本文に直接置いているので、authoring standard に従い最小例をコードブロック内に自己完結させる。`
- F017 \[minor/vp-ux-readability; line=18; anchor=``"- `nfr-maintainability`：保守性要求の正本"``\]: `位置づけの各項目に本書との関係（上位の入口、運用手順への入力、受入判定での参照など）を一言添え、初見の読者が次に見る文書を判断できるようにする。`
- F018 \[minor/vp-ux-language-consistency; line=25; anchor=`"| 用語             | 定義                           |"`\]: `用語定義に「一次切り分け時間」「ロールバック時間」を加え、サンプル内の判定者表記を Role code に統一する。`
- F019 \[minor/vp-ops-release-readiness; line=1; anchor=`"# 非機能要件 / 保守性 作成ルール"`\]: ``ready 化の前に、sample の標準テンプレ準拠への改訂と `recipe` / `template` の要否判断を未解決事項として PJR で管理し、解消条件を明確にする。``
- F020 \[minor/vp-ops-operability; line=73; anchor=`"- 要件 ID ごとに、測定方法（監視記録、障害レポート、訓練、CI の計測など）・判定タイミング・判定者を示す。"`\]: ``測定・検証方法の記述ガイドに、測定結果に基づいて閾値を見直すきっかけと、見直し結果の記録先（`dec-*`）を記載するよう求める。``
- F021 \[minor/vp-ops-agent-boundary; line=73; anchor=`"- 要件 ID ごとに、測定方法（監視記録、障害レポート、訓練、CI の計測など）・判定タイミング・判定者を示す。"`\]: `測定・検証方法の判定者は人間の Role code とし、agent には測定値の集計補助までを担わせることを明記する。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の rulebook を読み込み、現状の章構成・必須項目・禁止事項・判定基準を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 rulebook の frontmatter から辿れる recipe / sample / template、`併せて適用する rulebook`、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが成果物の実態と合っているかを見直す。
5. 成果物側で繰り返し守られていない規定は、規定が過剰なのか成果物側の不備なのかを判断し、根拠とともに rulebook へ反映するか result に記録する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した rulebook は [[specdojo:rulebook-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従う。recipe / sample / template と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な rulebook メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 rulebook から辿れる関連文書、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で rulebook を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の rulebook が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って rulebook を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
