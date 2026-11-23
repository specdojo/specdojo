---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-pr-sample-040-20261123t124310z-5b62dd19
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-pr-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: rulebook-maintenance
  targets:
    - specdojo:pr-sample
    - specdojo:pr-rulebook
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-pr-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 進捗報告の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、進捗報告の完成例を示す
- `path`: `docs/ja/specdojo/samples/pr-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-pr-sample-040/T-KATA-WAVE-6-DESIGN-pr-sample-040-20261123T124310Z-5b62dd19/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/pr-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PM（Project Manager）**
- 責務: 参考資料整備と成果物作成の計画・進捗・課題・リスクを管理する。小規模運用では専任化せず、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- 計画化可能性: 成果物の内容がタスク化、順序付け、所要時間見積もり、進捗確認に使える粒度になっているか。
- 依存関係・リスク・課題化: 後続成果物、Schedule、PJR に影響する依存、リスク、課題、変更要求が識別されているか。
- 管理・報告への接続: 進捗、課題、リスク、変更要求、決定記録へ転記すべき事項が分離されているか。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=7; anchor=`"- 報告期間の進捗、リスク、次アクションを定点観測できる形で記録する。"`\]: `フォーマットを標準化する目的だけでなく、進捗報告の対象範囲（例：どのプロジェクトフェーズやチームを対象とするか）を明記することを推奨します。`
- F002 \[minor/vp-po-decision-readiness; line=12; anchor=`"## 2. 位置づけ"`\]: `レビュー中に誰が（例：POやマネージャー）、どのような意思決定や承認（例：次期計画の承認、リスク対応への合意）を行うべきかを明確にすることを推奨します。`
- F003 \[minor/vp-po-decision-readiness; line=23; anchor=`"## 4. 本文構成（標準テンプレ）"`\]: `本文構成に、PO の承認・保留・差し戻しの判断を求める事項と未決事項を示す章（例：「判断依頼事項」、任意）を設けるかどうかを定め、定期レビューで判断対象を取り出せるようにすることを推奨する。`
- F004 \[minor/vp-po-publication-accountability; line=7; anchor=`"- 報告期間の進捗、リスク、次アクションを定点観測できる形で記録する。"`\]: `報告内容の公開範囲（例：社内限定、顧客向け）と、機密情報の取り扱いに関するガイドラインを提供することを推奨します。`
- F005 \[minor/vp-pm-plan-feasibility; line=37; anchor=`"- 次期予定は担当者と期日を設定する。"`\]: `次期予定の「担当者」を Role code で記すか個人名を許すかを定め、公開リポジトリで個人名を避けつつ担当を追跡できるようにすることを推奨する。報告周期と提出期限も明記するとよい。`
- F006 \[minor/vp-pm-dependency-risk; line=15; anchor=`"- 議事録、課題ログ、変更要求ログと整合を取る。"`\]: `「議事録、課題ログ、変更要求ログと整合を取る」の具体的な方法（PJR 項目 ID での参照、新規リスクの登録簿への起票、スケジュール影響の記載要否）を定め、依存とリスクを追跡できるようにすることを推奨する。`
- F007 \[minor/vp-pm-control-reporting; line=36; anchor=`"- リスク・課題は影響度と対応方針を明記する。"`\]: `リスク・課題の章で「区分（リスク／課題／変更要求）」を必須の列として定め、PJR や決定記録へ転記する対象と転記先を明記することを推奨する。sample の区分列と rulebook の規定もこれで揃う。`
- F008 \[minor/vp-ba-business-value; line=7; anchor=`"- 報告期間の進捗、リスク、次アクションを定点観測できる形で記録する。"`\]: `進捗報告の読み手（例：PO・定期レビューの参加者）と、解決したい業務課題（進捗の不透明さ、リスク対応の遅れなど）を一文で示し、記述ガイドの各規則がどの効果に対応するかを説明できるようにすることを推奨する。`
- F009 \[minor/vp-ba-requirements-completeness; line=7; anchor=`"- 報告期間の進捗、リスク、次アクションを定点観測できる形で記録する。"`\]: `進捗報告に含まれる項目の粒度と、報告の必要がない対象外の項目（例：軽微な日次アップデート）の基準を明記することを推奨します。`
- F010 \[minor/vp-ba-requirements-completeness; line=27; anchor=`"| 1    | 報告期間     | ○    |"`\]: `「報告期間」章に記す内容（開始日・終了日の形式、週次・月次などの期間の長さ、前回報告との連続性）を定め、期間の抜けや重なりを確認できるようにすることを推奨する。`
- F011 \[minor/vp-ba-stakeholder-clarity; line=12; anchor=`"## 2. 位置づけ"`\]: `想定される読者や、レビューおよび合意形成の責任を負うロールなど、進捗報告のステークホルダーを明示することを推奨します。`
- F012 \[minor/vp-dev-implementation-readiness; line=23; anchor=`"## 4. 本文構成（標準テンプレ）"`\]: `` `template: not-needed` の系統なので、本文構成の各章に推奨表の列（例：リスク・課題は区分・内容・影響度・対応方針、次期予定は内容・担当・期日）を rulebook で定め、sample に頼らず作成できるようにすることを推奨する。 ``
- F013 \[minor/vp-dev-change-impact; line=15; anchor=`"- 議事録、課題ログ、変更要求ログと整合を取る。"`\]: `進捗報告と議事録・PJR が食い違ったときにどちらを正とし、何を追従修正するか（例：PJR の状態を正とし、報告側を訂正版で更新する）を定めることを推奨する。`
- F014 \[minor/vp-dev-change-impact; line=10; anchor=``"- 共通の運用: Frontmatter の項目（`specdojo.type` は `project`）、`status` の昇格と承認、改訂と廃止は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従い、本書と成果物で言い直さない。"``\]: `rulebook 作成標準は各 rulebook に自系統の追従対象と役割分担の定義を求めるため、ready 化後の進捗報告を訂正するときの扱い（版を上書きするか訂正版を新規に起こすか、参照元の議事録・PJR のどこを追従させるか、担当 Role code）を共通標準への参照に添えて定めることを推奨する。`
- F015 \[minor/vp-dev-testability; line=23; anchor=`"## 4. 本文構成（標準テンプレ）"`\]: ``作成後に実行する検証（`npm run lint:md`・`npm run lint:fm`）と、必須章・担当・期日の欠落を確かめるチェック項目を記述ガイドまたは禁止事項に添えることを推奨する。``
- F016 \[minor/vp-qe-verifiability; line=33; anchor=`"## 5. 記述ガイド"`\]: `記述ガイドにおいて、完了事項やリスクなどの報告における「根拠」として具体的に何を提示すべきか（成果物ID、定量値など）の基準を明記することを推奨する。`
- F017 \[minor/vp-qe-verifiability; line=36; anchor=`"- リスク・課題は影響度と対応方針を明記する。"`\]: `リスク・課題の「影響度」の段階（例：高・中・低）と各段階の判定基準を定め、記載の妥当性を判定できるようにすることを推奨する。`
- F018 \[minor/vp-qe-verifiability; line=35; anchor=`"- 完了事項は成果物IDまたはタスクIDと紐づける。"`\]: ``完了事項に紐づける「成果物ID」「タスクID」の形式（例：project 修飾の文書 ID、PJR 項目 ID、schedule のタスク ID）を定め、sample の `task-042`・`doc-018` のような識別子が妥当かどうかを判定できるようにすることを推奨する。``
- F019 \[minor/vp-qe-omissions-consistency; line=17; anchor=`"## 3. ファイル命名・ID規則"`\]: ``ファイル命名規則だけでなく、推奨される配置ディレクトリ（例: `docs/ja/projects/＜project-id＞/progress-reports/`）を明記することを推奨する。``
- F020 \[minor/vp-qe-omissions-consistency; line=19; anchor=``"- 推奨: `pr-<yyyy-mm-dd>-<nn>.md`"``\]: `ファイル名は「推奨」、文書 ID は「とする」と規範の強さが揃っていないため、ファイル名と ID の対応（ID の local 部とファイル名を一致させるかなど）と、必須か推奨かを統一して明記することを推奨する。`
- F021 \[minor/vp-qe-kata-conformance; line=25; anchor=`"| 番号 | 見出し       | 必須 |"`\]: `` `template: not-needed` の系統では rulebook 作成標準が本文要件に各章の目的・内容を求めるため、本文構成の表に「内容（要点）」列を追加し、章名も標準の「本文要件」との対応が分かるようにすることを推奨する。 ``
- F022 \[minor/vp-qe-kata-conformance; line=41; anchor=`"- 進捗率のみで根拠なく報告しない。"`\]: ``禁止事項「進捗率のみで根拠なく報告しない」に対し、`pr-sample` の進行中事項が「進捗60%」と根拠なしで書かれており、完成例が規則に反しているため、sample に根拠（完了した節や件数など）を添えるか、規則の適用範囲を明確にすることを推奨する。``
- F023 \[minor/vp-qe-kata-conformance; line=33; anchor=`"## 5. 記述ガイド"`\]: `rulebook 作成標準の「内容充実化」は推奨表のカラム定義を少なくとも 1 つ求めるが、記述ガイドにも本文構成にも列定義がなく、sample の完了事項・リスク・課題・次期予定の表の列が rulebook 側に根拠を持たないため、記述ガイドに推奨表の列定義を置くことを推奨する。`
- F024 \[minor/vp-ux-readability; line=12; anchor=`"## 2. 位置づけ"`\]: `位置づけにおいて、報告のサイクル（頻度）および想定読者を明記し、運用の目的を明確にすることを推奨する。`
- F025 \[minor/vp-ux-readability; line=33; anchor=`"## 5. 記述ガイド"`\]: `記述ガイドにおいて、各項目の書き方のポイントや、避けるべき具体例などを詳細に記述し、作成者の迷いを減らす工夫をすることを推奨する。`
- F026 \[minor/vp-ux-language-consistency; line=43; anchor=`"- 予定に期限や責任者を欠いたまま確定しない。"`\]: ``次期予定の「担当者」（37行）と禁止事項の「責任者」の表記を統一し、「確定」が `status: ready` 化を指すのか予定の合意を指すのかを明記することを推奨する。``
- F027 \[minor/vp-ux-language-consistency; line=15; anchor=`"- 議事録、課題ログ、変更要求ログと整合を取る。"`\]: `「課題ログ」「変更要求ログ」が指す成果物（例：PJR の項目種別）を成果物名または ID で示し、用語のぶれを防ぐことを推奨する。`
- F028 \[minor/vp-ops-release-readiness; line=43; anchor=`"- 予定に期限や責任者を欠いたまま確定しない。"`\]: `進捗報告に特有の ready 条件（必須章 5 つと ID・影響度・対応方針・担当・期日がそろっていること、報告期間の終了から何日以内に ready にするか）を、共通の昇格手順への参照に添えて定めることを推奨する。`
- F029 \[minor/vp-ops-operability; line=12; anchor=`"## 2. 位置づけ"`\]: `進捗報告の作成責任者や、フォーマットに関する問い合わせ先を含む、運用体制を明確にすることを推奨します。`

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
