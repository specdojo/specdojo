---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-imp-interface-sample-040-20261123t123446z-c15e957d
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-imp-interface-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - specdojo:imp-interface-sample
    - specdojo:imp-interface-rulebook
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-imp-interface-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: I/F への影響調査の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、I/F への影響調査の完成例を示す
- `path`: `docs/ja/specdojo/samples/imp-interface-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-imp-interface-sample-040/T-KATA-WAVE-6-DESIGN-imp-interface-sample-040-20261123T123446Z-c15e957d/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/imp-interface-rulebook.md`
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

- F001 \[minor/vp-po-decision-readiness; line=87; anchor=`""`\]: `未解決事項に「判断者（Role code）」と「決定期限」を必須項目として加えるべきである。現状の論点・不足情報・影響・当面の扱いだけでは、誰がいつまでに承認・保留を判断するのかが読み取れず、sample の決定期限・担当の列とも食い違う。`
- F002 \[minor/vp-po-publication-accountability; line=91; anchor=`""`\]: `対応方針・未解決事項の担当欄に個人名や連絡先を書かず、Role code やメンバー定義の役割で表すことを禁止事項か記述ガイドで明記すべきである。今のままでは公開に不適切な情報が混ざっても防げない。`
- F003 \[minor/vp-pm-plan-feasibility; line=82; anchor=`"- 影響度の尺度を定義せずに高・中・低を混在させない。"`\]: `対応方針の各項目に完了条件（例: 互換試験の合格、連携先の受入確認）を書くよう求めるべきである。実施時期・担当・前提条件だけでは進捗と完了を判定できない。`
- F004 \[minor/vp-pm-dependency-risk; line=26; anchor=``"共通項目・必須性・型制約は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。`type` は `project`、`rulebook` は `specdojo:imp-interface-rulebook` とする。"``\]: `位置づけに、入力となる変更要求（登録簿の個票など）と、波及を委ねる後続文書（データ仕様・テスト仕様・運用手順にあたる成果物）の ID か名称を示すべきである。依存先が特定できず、スケジュールへの影響を追いにくい。`
- F005 \[minor/vp-ba-requirements-completeness; line=56; anchor=`"### 6.4. 影響詳細一覧"`\]: `目的と適用範囲に、対象外とする I/F や判断対象外の事項を書くよう加えるべきである。対象範囲だけでは、調べていないのか影響がないのかを読み手が区別できない。`
- F006 \[minor/vp-ba-stakeholder-clarity; line=82; anchor=`"- 影響度の尺度を定義せずに高・中・低を混在させない。"`\]: `対応方針の担当は適用先のメンバー定義にある Role code で書くと明記し、調整が必要な連携先（接続先）も書くよう求めるべきである。担当と調整相手が書き手ごとにばらつく。`
- F007 \[minor/vp-dev-testability; line=37; anchor=`"| 4   | 影響詳細一覧   | ○    | 影響対象 I/F ごとの変更要否・影響度を記録する |"`\]: ``Frontmatter の検証に使う schema（`docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml`）か検証手順への参照を示すべきである。今のままでは、作成後に何で適合を確かめればよいか分からない。``
- F008 \[minor/vp-qe-omissions-consistency; line=37; anchor=`"| 4   | 影響詳細一覧   | ○    | 影響対象 I/F ごとの変更要否・影響度を記録する |"`\]: ``推奨 Frontmatter に、対象の変更要求を `based_on` で宣言することを明記すべきである。6.1 の変更要求識別子と sample の `based_on` の使い方を rulebook から説明できない。``
- F009 \[major/vp-qe-kata-conformance; line=65; anchor=`"| 対応方針    | 実施・代替・見送りなどの方針                           |"`\]: `対応する sample の影響分析サマリが高・中・低の尺度を定義しておらず、6.3 と禁止事項「影響度の尺度を定義せずに高・中・低を混在させない」に反している。完成例が規則違反を手本として示しているため、sample を直すか rulebook の要件を見直して整合させるべきである。`
- F010 \[minor/vp-qe-kata-conformance; line=56; anchor=`"### 6.4. 影響詳細一覧"`\]: `6.1 は対象期間の明記を求めているが、sample の目的と適用範囲に対象期間がない。rulebook と sample のどちらかを直して整合させるべきである。`
- F011 \[minor/vp-qe-kata-conformance; line=87; anchor=`""`\]: `6.6 は判断・対応への影響を求めているが、sample の未解決事項の表には影響の列がなく、代わりに決定期限・担当がある。rulebook と sample で項目をそろえるべきである。`
- F012 \[minor/vp-ux-readability; line=26; anchor=``"共通項目・必須性・型制約は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。`type` は `project`、`rulebook` は `specdojo:imp-interface-rulebook` とする。"``\]: `位置づけに、この文書の前後にある成果物（変更要求の記録、データやテストの影響調査など）を wikilink か名称で示し、初めて読む人が次に見る文書をたどれるようにすべきである。`
- F013 \[minor/vp-ux-language-consistency; line=82; anchor=`"- 影響度の尺度を定義せずに高・中・低を混在させない。"`\]: `対応方針の「重要度が高い項目から順に」の「重要度」を、6.3 と 6.4 で定義した「影響度」にそろえるべきである。別の尺度があるように読めてしまう。`
- F014 \[minor/vp-ops-release-readiness; line=12; anchor=`""`\]: `` `recipe` と `template` が undecided のままで、`target_format` の宣言もない。ready にする前に、これらを決めるか、作らないなら作らないと明記すべきである。 ``

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
