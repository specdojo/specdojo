---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-pm-issue-log-sample-040-20261123t063755z-63f9fb35
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: rulebook-maintenance
  targets:
    - specdojo:pm-issue-log-sample
    - specdojo:pm-issue-log-rulebook
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 課題ログの完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、課題ログの完成例を示す
- `path`: `docs/ja/specdojo/samples/pm-issue-log-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-040/T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-040-20261123T063755Z-63f9fb35/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/pm-issue-log-rulebook.md`
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

- F001 \[minor/vp-pm-plan-feasibility; line=45; anchor=`"- 課題 ID、発生日、内容、優先度、対応策、担当、期限、ステータスを一覧にする。"`\]: `課題ログ一覧の「担当」を Role code（適用先のメンバー定義の role）で書くことが規定されておらず、個人名の混入や表記ゆれを防げないため、担当欄の記述形式を明記する。`
- F002 \[minor/vp-pm-control-reporting; line=62; anchor=``"- 根拠、影響先、課題から起票したリスク・変更要求を文書 ID で示す。なければ `（本書のみ）` と書く。"``\]: `課題対応で生じた決定事項を決定記録（decision）へ転記する基準・参照方法がなく、課題ログ内に判断が埋もれるおそれがあるため、決定記録への転記条件を追記する。`
- F003 \[minor/vp-ba-business-value; line=9; anchor=`"- 顕在化した課題ごとに、未解決かどうかと次の対応を判定できる形で残す。"`\]: `課題ログを誰（PM・PO・担当など）がどの判断（対応順の決定、エスカレーション、完了確認）に使うかが示されておらず、各記述項目がどの利用者価値に応えるか説明できないため、利用者と利用場面を全体方針に追記する。`
- F004 \[minor/vp-ba-requirements-completeness; line=5; anchor=`"顕在化した課題の優先度・期限・対応・状態を追跡する課題ログの記述基準を定める。"`\]: `対象外（未顕在のリスク、仕様変更要求）と課題との区別基準が明示されておらず、同じ事象を課題ログとリスク登録簿・変更要求ログの両方に記録する誤用を招くため、対象範囲と対象外を全体方針に追記する。`
- F005 \[minor/vp-dev-implementation-readiness; line=24; anchor=``"- 許可キーと型は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] を正本とし、`type` は `project` とする。"``\]: ``単独の課題ログで Frontmatter の `rulebook` に何を宣言するか（生成物は `specdojo:pjr-rulebook`）が書かれておらず、作成者が値を取り違えるおそれがあるため、単独ログの `rulebook` 値を明記する。``
- F006 \[minor/vp-dev-change-impact; line=20; anchor=``"- 課題 ID は登録簿では `PJR-XXXX`、単独のログでは `IS-NNN` とし、再利用しない。"``\]: ``単独ログ（`IS-NNN`）から登録簿（`PJR-XXXX`）へ移行する場合の ID 対応・既存記録の扱い・単独ファイルの廃止手順が示されておらず、運用形態変更時の影響を判断できないため、移行時の扱いを追記する。``
- F007 \[minor/vp-qe-omissions-consistency; line=15; anchor=`"- 本書の判断基準は、個票と、登録簿を使わない単独の課題ログの両方に適用する。"`\]: ``「本書の判断基準は個票と単独ログの両方に適用する」としつつ、本文構成（6章）は個票の必須節（`pjr-rulebook` の issue 必須節）と異なり、どの規定が個票に適用されるか曖昧なため、本文構成は単独ログ専用で個票には記述ガイドの判断基準のみ適用する等の適用範囲を明記する。``
- F008 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 課題ログ 作成ルール"`\]: `連携するテンプレートファイルの内容が、本ルールブックで定義する構成を無視して自動生成ビューとして定義されており、実効的な乖離がある。`
- F009 \[major/vp-qe-kata-conformance; line=46; anchor=``"- 優先度とステータスは登録簿の `priority`・`item_status` の値を使い、言い換えない。"``\]: ``sample が優先度「高/中」・ステータス「未着手/対応中」を使い、登録簿の `priority`・`item_status` の値を言い換えないという本ルールに違反しているため、sample を規定値へ修正する。``
- F010 \[major/vp-qe-kata-conformance; line=50; anchor=`"- 優先度の基準、期限の決め方、期限超過時のエスカレーション先、優先度の変更を決める者を書く。"`\]: `sample の優先度と期限・進捗レビューに、期限超過時のエスカレーション先以外の必須事項（優先度の変更を決める者、完了を判定する者と判定の観点）がなく、完了条件にも確認手段がないため、sample を記述ガイドの必須事項に合わせる。`
- F011 \[minor/vp-qe-kata-conformance; line=62; anchor=``"- 根拠、影響先、課題から起票したリスク・変更要求を文書 ID で示す。なければ `（本書のみ）` と書く。"``\]: ``sample の関連ドキュメントが `pm-risk-register` 等の local 名で記載され、文書 ID で示す規定と一致しないため、sample を project 修飾の文書 ID 表記へ修正する。``
- F012 \[minor/vp-ux-language-consistency; line=46; anchor=``"- 優先度とステータスは登録簿の `priority`・`item_status` の値を使い、言い換えない。"``\]: ``登録簿を使わない単独ログでも `priority`・`item_status` の値を使うとするが、値の一覧または定義元 schema への参照がなく、表記ゆれ（sample の「高」「対応中」等）を防げないため、許容値の参照先を明記する。``

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

- 2026-11-23T05:30:20.052Z: `T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-040` は `T-KATA-WAVE-6-PROJECT-prj-overview-sample-040` の統合を待った。重複: `project:cause.location <> project:cause.location`。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
