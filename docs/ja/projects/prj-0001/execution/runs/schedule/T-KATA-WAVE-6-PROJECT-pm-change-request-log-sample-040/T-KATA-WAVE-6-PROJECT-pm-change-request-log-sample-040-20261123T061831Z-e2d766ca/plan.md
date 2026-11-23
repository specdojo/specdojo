---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-pm-change-request-log-sample-040-20261123t061831z-e2d766ca
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-pm-change-request-log-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: rulebook-maintenance
  targets:
    - specdojo:pm-change-request-log-sample
    - specdojo:pm-change-request-log-rulebook
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-pm-change-request-log-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 変更要求ログの完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、変更要求ログの完成例を示す
- `path`: `docs/ja/specdojo/samples/pm-change-request-log-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-pm-change-request-log-sample-040/T-KATA-WAVE-6-PROJECT-pm-change-request-log-sample-040-20261123T061831Z-e2d766ca/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/pm-change-request-log-rulebook.md`
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

- F001 \[minor/vp-po-decision-readiness; line=57; anchor=``"- 審査結果は「承認・条件付き承認・却下・保留」のいずれかとし、決定者・決定日・実施条件と、`pm-plan` のスコープ・優先順位との対応を書く。"``\]: `審査結果「保留」を選んだ場合に、再審査の期限または条件と、追加で必要な判断材料を記録する基準がなく、保留が未決事項として追跡されないおそれがある。`
- F002 \[minor/vp-po-publication-accountability; line=47; anchor=`"- 変更 ID、要求内容、申請者、申請日、状態に加え、変更理由（応える業務課題・期待価値）を書く。"`\]: `申請者・決定者・実施担当を個人名ではなく Role code（役割名）で記載する指定がなく、公開文書に個人名が載る余地が残っている。`
- F003 \[minor/vp-ba-requirements-completeness; line=9; anchor=`"- 変更要求ごとに、申請から影響評価、審査・決定、実施追跡までを判定できる形で残す。"`\]: ``変更要求として起票する対象（合意済みスコープ・スケジュール・品質基準の変更など）と対象外（不具合修正や課題対応など）の線引きがなく、`pm-issue-log` との使い分けが判断できない。``
- F004 \[minor/vp-ba-stakeholder-clarity; line=52; anchor=`"- スコープ・工数・品質・納期の観点ごとに、影響の有無と量（人日・日数など）と根拠を書く。"`\]: `影響評価の記録項目に評価者（Role code）がなく、工数・納期影響の見積もりと根拠の責任者や確認先が読み取れない。`
- F005 \[minor/vp-dev-implementation-readiness; line=26; anchor=``"- 許可キーと型は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] を正本とし、`type` は `project` とする。"``\]: ``登録簿を使わない単独の変更要求ログについて、配置ディレクトリと Frontmatter の `rulebook` 値（`specdojo:pm-change-request-log-rulebook` か）が示されておらず、作成時の設定値が決まらない。``
- F006 \[minor/vp-qe-verifiability; line=47; anchor=`"- 変更 ID、要求内容、申請者、申請日、状態に加え、変更理由（応える業務課題・期待価値）を書く。"`\]: ``変更要求一覧の「状態」と実施追跡の「進捗」に入れる値が定義されておらず、審査結果4区分や個票の `item_status` との対応を判定できない。``
- F007 \[minor/vp-qe-omissions-consistency; line=16; anchor=`"- 本書の章ごとの判断基準は、個票の同名の節と、登録簿を使わない単独の変更要求ログの両方に適用する。"`\]: ``個票（`pjr-rulebook` の change-request）の節は「変更要求・入力」で、本書の「概要・変更要求一覧」と同名ではないため、「同名の節に適用する」という対応づけが成り立たず、当てはめる先が不明確である。``
- F008 \[major/vp-qe-kata-conformance; line=47; anchor=`"- 変更 ID、要求内容、申請者、申請日、状態に加え、変更理由（応える業務課題・期待価値）を書く。"`\]: ``sample が本書の記述ガイドを満たしておらず（変更理由列なし、影響評価に品質・根拠・見送り時影響・期待効果なし、審査に `pm-plan` 対応なし、完了条件が手段と基準の形でない）、rulebook と sample の整合が取れていない。``
- F009 \[minor/vp-ops-operability; line=22; anchor=``"- 変更 ID は登録簿では `PJR-XXXX`、単独のログでは `CR-NNN` とし、再利用しない。"``\]: `変更要求の取下げや、決定後の内容変更による再審査の扱い（同一 ID で記録を改めるか、新しい ID で起票するか）が定義されておらず、継続運用時の変更管理が判断できない。`
- F010 \[minor/vp-ops-agent-boundary; line=57; anchor=``"- 審査結果は「承認・条件付き承認・却下・保留」のいずれかとし、決定者・決定日・実施条件と、`pm-plan` のスコープ・優先順位との対応を書く。"``\]: `決定者を人間の役割（PO・PM など）に限る旨がなく、agent が変更要求の承認・却下を決定したと記録される余地が残っている。`

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

## 変更範囲による実行待ち

- 2026-11-23T05:30:16.991Z: `T-KATA-WAVE-6-PROJECT-pm-change-request-log-sample-040` は `T-KATA-WAVE-6-PROJECT-prj-overview-sample-040` の統合を待った。重複: `project:cause.location <> project:cause.location`。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
