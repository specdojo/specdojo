---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-imp-data-sample-040-20261123t121906z-db173ba1
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-imp-data-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: rulebook-maintenance
  targets:
    - specdojo:imp-data-sample
    - specdojo:imp-data-rulebook
---

# Edit Plan: T-KATA-WAVE-5-imp-data-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: データへの影響調査の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、データへの影響調査の完成例を示す
- `path`: `docs/ja/specdojo/samples/imp-data-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-imp-data-sample-040/T-KATA-WAVE-5-imp-data-sample-040-20261123T121906Z-db173ba1/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/imp-data-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 仕様を書く人と読む人の利用者視点から、文書体系への要求、利用場面、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 主要な定義・判断がどの対象者のどの業務課題・期待価値に応えるかを説明でき、主要な成果・方針がその目的に対応しているか。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、合意対象が読み取れるか。文書を確かめる・承認する役割の割り当ては本文に求めない。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=79; anchor=`"論点・不足情報・判断や対応への影響・当面の扱いを示す。なければ「なし」とする。"`\]: `未解決事項に判断者（Role code）と決定期限の記載が求められておらず、PO が承認時に保留論点の決着見込みを判断できないため、論点ごとに判断者と決定期限を必須項目として追加する必要がある。`
- F002 \[minor/vp-pm-control-reporting; line=79; anchor=`"論点・不足情報・判断や対応への影響・当面の扱いを示す。なければ「なし」とする。"`\]: `未解決事項や見送りの再評価条件を課題・リスク・決定記録として登録簿へ転記する基準や記録方法が示されておらず、管理対象から漏れるおそれがあるため、PJR 等への転記条件と参照の残し方を追加する必要がある。`
- F003 \[minor/vp-ba-stakeholder-clarity; line=9; anchor=`"- データ責任者とプロジェクト管理者が合意できる粒度で、影響と判断根拠を記載する。"`\]: `合意者を「データ責任者とプロジェクト管理者」という一般名称で示しており、カタログの done_criteria が定める確認ロール（BA・PO・ARC・QE・DEV）や PO による承認との対応が読み取れないため、確認者・承認者を Role code で示す必要がある。`
- F004 \[minor/vp-qe-verifiability; line=53; anchor=`"- 高: データ欠損・不整合、許容時間を超える停止、復旧不能な移行、代替不能な業務停止のいずれかがある。"`\]: `「高」の条件「データ欠損・不整合」と「中」の条件「補正・移行手順が必要」が重なり、補正で解消できる軽微な不整合を高と中のどちらにするか作成者によって分かれるため、「補正しても解消できない、または業務判断に誤りを生む不整合」など高の不整合の範囲を限定する必要がある。`
- F005 \[minor/vp-qe-omissions-consistency; line=24; anchor=``"共通項目・必須性・型制約は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。`type` は `project`、`rulebook` は `specdojo:imp-data-rulebook` とする。`based_on` には直接の根拠とした作成済みの `<project-id>:imp-business` を必須とし、追加の根拠もカタログの `depends_on` の推移閉包内に限る。"``\]: `` `based_on` の追加根拠をカタログの depends_on の推移閉包内に限っているため、目的と適用範囲で識別子を求める変更要求そのものを直接の根拠として記録できず、メタデータ上の参照方法も定めていないので、変更要求の参照先（`based_on` の例外または `relations` 等）を明記する必要がある。 ``
- F006 \[minor/vp-qe-kata-conformance; line=47; anchor=`"背景・要求・狙いと判定可能な成功条件を要約する（例: 移行前後の売上合計の差額0円）。"`\]: `変更要求の概要に成功条件を要求しているが、参照 sample には背景・要求内容・狙いしかなく成功条件がないため、判定可能な成功条件を sample に追加する必要がある。`
- F007 \[major/vp-qe-kata-conformance; line=51; anchor=`"整合性・可用性・移行難易度・利用者影響を次の尺度で評価し、最も高い判定を採る。許容停止時間など案件の境界値を先に示し、高・中・低の件数と優先対象をまとめる。"`\]: `影響分析サマリの評価観点を整合性・可用性・移行難易度・利用者影響とし、案件の境界値を先に示すよう定めているが、参照 sample は「データ整合性、移行影響、運用負荷」という異なる観点を使い境界値も示していないため、sample をRulebookの尺度に合わせる必要がある。`
- F008 \[major/vp-qe-kata-conformance; line=24; anchor=``"共通項目・必須性・型制約は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。`type` は `project`、`rulebook` は `specdojo:imp-data-rulebook` とする。`based_on` には直接の根拠とした作成済みの `<project-id>:imp-business` を必須とし、追加の根拠もカタログの `depends_on` の推移閉包内に限る。"``\]: `` `based_on` に `＜project-id＞:imp-business` を必須としているが、参照 sample の `based_on` は `cr-2026-004` のみで `imp-business` を含まないため、sample の Frontmatter を Rulebook に合わせる必要がある。 ``
- F009 \[major/vp-qe-kata-conformance; line=70; anchor=`"「判断根拠」に構造・整合性、データ検証・移行テスト、実装変更への影響を必ず示す。影響なしも理由を残す。"`\]: `判断根拠に構造・整合性、データ検証・移行テスト、実装変更への影響を必ず示し、備考に波及先の成果物 ID を示すよう求めているが、参照 sample の判断根拠は移行テスト・実装変更への影響に触れず備考にも成果物 ID がなく、対応方針に受入確認もないため、sample をこれらの必須要件に合わせて更新する必要がある。`

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
