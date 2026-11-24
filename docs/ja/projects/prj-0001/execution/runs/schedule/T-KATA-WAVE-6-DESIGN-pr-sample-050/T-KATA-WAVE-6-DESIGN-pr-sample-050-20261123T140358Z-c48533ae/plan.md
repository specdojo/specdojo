---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-pr-sample-050-20261123t140358z-c48533ae
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-pr-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: sample-maintenance
  targets:
    - specdojo:pr-sample
    - specdojo:pr-sample
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-pr-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 進捗報告の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、進捗報告の完成例を示す
- `path`: `docs/ja/specdojo/samples/pr-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-pr-sample-050/T-KATA-WAVE-6-DESIGN-pr-sample-050-20261123T140358Z-c48533ae/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/pr-sample.md`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=24; anchor=`"| 課題   | 一部商品の補充責任者が未確定         | 中     | 2026-04-21 定例で担当を決定する。               |"`\]: `課題「一部商品の補充責任者が未確定」の決定時期は示されているが、判断者（店主代表 / PO）と対象商品の範囲が書かれておらず、定例で何を誰が決めるかを事前に把握できないため、判断者と判断対象を明記すべきである。`
- F002 \[minor/vp-pm-plan-feasibility; line=16; anchor=`"- レジ締め手順の改訂案を作成中（進捗60%）。"`\]: `進行中事項にタスクID・担当者・完了見込み日がなく、完了事項や次期予定と同じ粒度で追跡できないため、少なくともタスクIDと完了見込みを併記すべきである。`
- F003 \[minor/vp-pm-plan-feasibility; line=17; anchor=`"- 日次報告テンプレートの項目統合を検討中。"`\]: `進行中事項「日次報告テンプレートの項目統合を検討中」に対応する行が次期予定の表になく、次期の作業として追跡できないため、次期予定へ担当者・期日付きで載せるか、保留の理由を明記すべきである。`
- F004 \[minor/vp-pm-dependency-risk; line=23; anchor=`"| リスク | 欠品データの入力遅延が発生する可能性 | 中     | 入力締切を16:00に統一し、遅延時は即時連絡する。 |"`\]: `リスク「欠品データの入力遅延が発生する可能性」は事象のみで、遅延時に何へ影響するか（補充判定の遅れ・欠品増加など）が書かれていないため、影響内容を明記すべきである。`
- F005 \[minor/vp-pm-control-reporting; line=24; anchor=`"| 課題   | 一部商品の補充責任者が未確定         | 中     | 2026-04-21 定例で担当を決定する。               |"`\]: `rulebook の位置づけで課題ログ・議事録との整合が求められているが、課題「一部商品の補充責任者が未確定」に課題ログの ID や転記先の記載がないため、対応する課題ログ項目または議事録への参照を添えるべきである。`
- F006 \[minor/vp-ba-business-value; line=11; anchor=`"| 1   | 在庫補充判定ルールの見直し案を確定した。 | task-042          |"`\]: `完了事項「在庫補充判定ルールの見直し案を確定した。」などが、共通サンプル文脈の期待効果（人気商品の欠品回数を月間50%削減）にどう寄与するかを示しておらず、進捗を業務価値と結び付けて判断できないため、対応する指標や現状値を一言添えるべきである。`
- F007 \[minor/vp-ba-stakeholder-clarity; line=1; anchor=`"# 進捗報告 サンプル"`\]: `報告者と報告先（定期レビューの参加者・確認者）が記載されておらず、誰が誰に向けて提出した進捗報告かが読み取れないため、報告者・報告先を冒頭に明記すべきである。`
- F008 \[minor/vp-qe-verifiability; line=16; anchor=`"- レジ締め手順の改訂案を作成中（進捗60%）。"`\]: `「進捗60%」という表記は判定基準が曖昧であり、具体的にどの状態をもって 60% としたかの根拠または定義が必要である。`
- F009 \[minor/vp-qe-verifiability; line=22; anchor=`"| ------ | ------------------------------------ | ------ | ----------------------------------------------- |"`\]: `影響度「中」の判定基準（高・中・低の定義）が示されておらず、リスク・課題の影響度の妥当性を判定できないため、基準を注記するか根拠を併記すべきである。`
- F010 \[minor/vp-qe-kata-conformance; line=16; anchor=`"- レジ締め手順の改訂案を作成中（進捗60%）。"`\]: `完成例である sample が rulebook の禁止事項「進捗率のみで根拠なく報告しない」に反する記述を示しており、型の見本として矛盾するため、進捗率の根拠を添えた記述例にすべきである。`
- F011 \[minor/vp-qe-kata-conformance; line=11; anchor=`"| 1   | 在庫補充判定ルールの見直し案を確定した。 | task-042          |"`\]: ``成果物ID/タスクIDの例「task-042」「doc-018」が rulebook の文書ID形式（`＜project-id＞:...`）やプロジェクトの ID 体系と対応しておらず、記入すべき ID の種類を誤解させるため、実際の ID 体系に沿った例にすべきである。``
- F012 \[minor/vp-ux-readability; line=17; anchor=`"- 日次報告テンプレートの項目統合を検討中。"`\]: `「項目統合を検討中」という記述は抽象的であり、何を統合しようとしているか、またはどのような判断を検討しているかの具体性が不足している。`
- F013 \[minor/vp-ux-readability; line=1; anchor=`"# 進捗報告 サンプル"`\]: `H1 直後に導入文がなく、対象プロジェクト（駄菓子屋きぬや）や報告の位置づけが初見の読者に伝わらないため、1〜2文の導入を置くべきである。`
- F014 \[minor/vp-ux-language-consistency; line=30; anchor=`"| 1   | 補充責任者の確定と周知を実施する。       | 店主     | 2026-04-21 |"`\]: `次期予定の担当者「店主」「業務担当」が sample-authoring-standard の共通登場人物の役割名（店主代表・開発担当など）と一致せず、「業務担当」は定義外で誰を指すか特定できないため、定義済みの役割名または Role code に統一すべきである。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の sample を読み込み、現状の粒度・文体・表の書き方を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 sample の frontmatter から辿れる rulebook と recipe、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。rulebook との構成不整合を指摘する finding では、成果物の有無にかかわらず rulebook を正として照合する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが完成例として適切かを見直す。
5. rulebook の必須項目・禁止事項を満たす最小の記述例になるよう再構成し、実成果物の丸写しを避ける。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した sample は [[specdojo:sample-authoring-standard]]（構成・記述ルール・禁止事項の正本）に従う。rulebook / recipe と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な sample メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 sample から辿れる rulebook / recipe、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で sample を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の sample が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って sample を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
