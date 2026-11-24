---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-pm-communication-plan-sample-040-20261124t015049z-f37c23f3
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-pm-communication-plan-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: rulebook-maintenance
  targets:
    - specdojo:pm-communication-plan-sample
    - specdojo:pm-communication-plan-rulebook
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-pm-communication-plan-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: コミュニケーション計画の完成例
- `depends_on`:
  - [[specdojo:prj-stakeholder-register-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、コミュニケーション計画の完成例を示す
- `path`: `docs/ja/specdojo/samples/pm-communication-plan-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-pm-communication-plan-sample-040/T-KATA-WAVE-6-PROJECT-pm-communication-plan-sample-040-20261124T015049Z-f37c23f3/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/pm-communication-plan-rulebook.md`
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

- F001 \[minor/vp-pm-control-reporting; line=66; anchor=`"公開、限定共有、記録禁止など必要な区分を定義し、各手段で扱える情報と記録先を対応させます。"`\]: `情報管理と公開の記述ガイドは「必要な区分を定義し記録先を対応させる」とだけ書いており、判断・課題・リスク・変更要求をそれぞれ課題ログ・リスク登録簿・変更要求ログなどの管理記録へ分けて転記する要求も、口頭決定の転記責任を Role code で示す要求もないため、転記先の分離と転記担当を記述させる規定を追加する。`
- F002 \[minor/vp-dev-change-impact; line=70; anchor=`"- ステークホルダー、判断ゲート、公開方針、連絡手段が変わった場合に見直します。"`\]: `共通の変更管理規則は参照されているが、連絡時期・判断経路・共有手段を変更した際に影響確認するScheduleの確認・承認タスク、責任分担、チャネル設定などの追従対象が示されていないため、適用先で該当する対象と更新担当Role codeを特定する要件を追記する。`
- F003 \[minor/vp-qe-verifiability; line=36; anchor=`"| コミュニケーション機会 | ○    | 情報要求に対応する実施機会と結果を追跡できること |"`\]: `コミュニケーション機会の受入条件「情報要求に対応する実施機会と結果を追跡できること」は判定基準が曖昧で、各行が登録簿の情報要求（ステークホルダー ID）に対応し、責任に採用済み Role code、証跡に記録先が必ず記入されていることを pass/fail 条件として明記する。`
- F004 \[minor/vp-qe-kata-conformance; line=70; anchor=`"- ステークホルダー、判断ゲート、公開方針、連絡手段が変わった場合に見直します。"`\]: `Rulebook記述標準の「各 rulebook は自系統の成果物における具体的な追従対象と役割分担を定義する」という要件に対し、本書は共通標準への参照と見直しトリガーのみで、コミュニケーション計画の変更時に確認する管理計画・ステークホルダー登録簿・Schedule等の該当箇所と担当Role codeを定義していないため、系統固有の追従要件を補う。`
- F005 \[minor/vp-qe-kata-conformance; line=71; anchor=``"- 未決事項は `_UNDECIDED_` を付し、論点と伝達先・時期・手段への影響を示します。"``\]: `template の未決事項は「決定時期と判断者を添える」、方針と適用範囲は「人間とAI Agentの境界を記述する」を求め sample も両方を記述しているが、rulebook の記述ガイド（方針と適用範囲・見直し条件と未決事項）はどちらも要求しておらず、Kata 内で記載要件がずれているため、rulebook 側に両要件を追加して整合させる。`
- F006 \[minor/vp-ops-operability; line=70; anchor=`"- ステークホルダー、判断ゲート、公開方針、連絡手段が変わった場合に見直します。"`\]: `見直しの契機は定義されているが、本計画の更新担当と、変更後の伝達先・時期・手段が実際の連絡運用へ反映されたことを確認する担当を記載させる規定がないため、採用済みRole codeによる担当と反映確認の証跡を定める要件を追加する。`
- F007 \[minor/vp-ops-agent-boundary; line=45; anchor=`"対象プロジェクト、主要な関係者、必要な合意の種類を要約し、常設会議か作業節目の非同期確認かを示します。"`\]: `方針と適用範囲の記述ガイドに、AI Agent は記録整理や草案を支援するだけで、合意・承認・公開判断は人間の Role code が担うことを明記させる要求がなく、recipe・template にのみ存在するため、rulebook 側で人間と AI Agent の判断境界の記述を必須化する。`

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
