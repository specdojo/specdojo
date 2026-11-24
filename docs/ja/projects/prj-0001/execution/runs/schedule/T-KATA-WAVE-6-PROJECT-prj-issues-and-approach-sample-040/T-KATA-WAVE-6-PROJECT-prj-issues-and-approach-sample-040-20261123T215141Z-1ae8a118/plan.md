---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-prj-issues-and-approach-sample-040-20261123t215141z-1ae8a118
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-prj-issues-and-approach-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PO
  approach: rulebook-maintenance
  targets:
    - specdojo:prj-issues-and-approach-sample
    - specdojo:prj-issues-and-approach-rulebook
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-prj-issues-and-approach-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: プロジェクト課題と解決アプローチの完成例
- `depends_on`:
  - [[specdojo:prj-overview-sample]]
  - [[specdojo:prj-scope-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、プロジェクト課題と解決アプローチの完成例を示す
- `path`: `docs/ja/specdojo/samples/prj-issues-and-approach-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-prj-issues-and-approach-sample-040/T-KATA-WAVE-6-PROJECT-prj-issues-and-approach-sample-040-20261123T215141Z-1ae8a118/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/prj-issues-and-approach-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PO（Project Owner）**
- 責務: 公開可能な SpecDojo 文書基盤としての目的・スコープ・優先順位・公開方針を最終判断する。

このロールが重視するレビュー観点:

- 目的・スコープとの整合: 成果物の主要な定義・判断が、プロジェクト目的、スコープ、優先順位、公開方針と矛盾せず、成果物固有の目的または上位文書への参照から必要性を説明できるか。対応する目的・成果のない手段を目的として扱っていないか。
- 承認判断に必要な情報: PO が承認、保留、差し戻しを判断するための論点、未決事項、影響範囲が明示されているか。文書の役割の割り当てと承認の進み具合は登録簿で追うため、本文に求めない。
- 公開可否と説明責任: 公開してよい情報だけで構成され、最終判断と説明責任を人間の PO が担う前提になっているか。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-publication-accountability; line=146; anchor=`"## 7. 禁止事項"`\]: `課題・原因・リスクは観察事実や聞き取りに基づくのに、禁止事項に個人や特定組織を識別できる情報・非公開の観察事実を書かない規定がなく、recipe の仕上げチェックにしか条件がないため、rulebook の禁止事項に公開不適切情報の項目を追加して正本から公開可否を判定できるようにする。`
- F002 \[minor/vp-pm-plan-feasibility; line=132; anchor=`"- 次の意思決定に必要な追加調査・確認・承認事項と、その目的を列挙します。"`\]: `「次の検討事項（ToDo）」は目的と責任ロールしか求めておらず、recipe が問う完了条件と期限（判断タイミング）を書く欄がないため、表に完了条件と期限または判断タイミングの列を追加し、ToDo を進捗確認できる粒度にする。`
- F003 \[minor/vp-qe-verifiability; line=92; anchor=`"| 課題ID | 課題 | 影響 | 優先度 | 備考 |"`\]: ``課題一覧で優先度は必須なのに、例が `High` だけで取りうる値（例: `High` / `Medium` / `Low`）が定義されていないため、値の範囲を明記し、優先度が妥当かを判定できるようにする。``
- F004 \[minor/vp-qe-kata-conformance; line=76; anchor=`"| 見直しと変更管理     | 任意 | 本書の合意を見直す契機、確認する観点、対応方針。見直しの記録は共通の運用に従い、ここで定めない |"`\]: `rulebook は見直しの記録を共通の運用に委ねて本書では定めないとする一方、template の「見直しと変更管理」は記録先と責任ロールの記述を求めており矛盾するため、rulebook と template のどちらかに揃えて Kata 内の規定を一意にする。`

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
