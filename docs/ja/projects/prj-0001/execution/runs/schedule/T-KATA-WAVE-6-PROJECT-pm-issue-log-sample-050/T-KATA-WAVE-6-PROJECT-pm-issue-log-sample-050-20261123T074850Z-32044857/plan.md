---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-pm-issue-log-sample-050-20261123t074850z-32044857
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: sample-maintenance
  targets:
    - specdojo:pm-issue-log-sample
    - specdojo:pm-issue-log-sample
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 課題ログの完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、課題ログの完成例を示す
- `path`: `docs/ja/specdojo/samples/pm-issue-log-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-050/T-KATA-WAVE-6-PROJECT-pm-issue-log-sample-050-20261123T074850Z-32044857/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/pm-issue-log-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトで発生した課題を追跡管理する最小サンプルである。"`\]: ``概要で、本サンプルが登録簿を使わない単独の課題ログ（`IS-NNN` 形式）の完成例であると書いていない。登録簿を使うプロジェクトでは個票から生成する、という使い分けと必要性を概要で示すべきである。``
- F002 \[minor/vp-po-decision-readiness; line=14; anchor=`"## 3. 優先度と期限"`\]: ``優先度の変更を決める者と、エスカレーション後に対応方針を判断する者が書かれていないため、承認・保留・差し戻しの判断者が分からない。Role code（例: `PO`）で明示すべきである。``
- F003 \[minor/vp-pm-plan-feasibility; line=11; anchor=`"| IS-001 | 2026-04-02 | テストデータ不足     | 高     | データ生成スクリプト追加 | QA担当   | 2026-04-08 | 対応中     |"`\]: ``担当欄の「QA担当」「業務担当」は共通登場人物の役割名でも Role code でもない。責務を表す欄なので、`QE`・`BA` などの Role code、または共通サンプル文脈の役割名で書くべきである。``
- F004 \[minor/vp-pm-dependency-risk; line=25; anchor=`"| IS-001 | データ生成スクリプト追加 | DB管理者承認 | テスト全件実行可能 |"`\]: `依存事項「DB管理者承認」は共通サンプル文脈にない役割である。満たされない場合の期限への影響やリスク起票の要否も書かれていない。共通文脈の役割か Role code に置き換え、影響を書くべきである。`
- F005 \[minor/vp-pm-control-reporting; line=34; anchor=`"## 6. 関連ドキュメント"`\]: ``関連ドキュメントが文書種別の羅列にとどまっている。各課題から起票したリスク・変更要求、根拠、影響先を、プロジェクトで修飾した文書 ID（例: `＜project-id＞:pm-risk-register`）で示すべきである。起票がない場合はそのことを書くべきである。``
- F006 \[minor/vp-ba-business-value; line=18; anchor=`"| IS-001 | 高     | 2026-04-08 | テスト遅延影響が大 |"`\]: `判定根拠「テスト遅延影響が大」「業務確認待ち」は、どの業務やリリース判断に影響するかを示していない。優先度の妥当性を業務影響（例: 店頭販売の受入確認が止まる）で説明すべきである。`
- F007 \[minor/vp-ba-requirements-completeness; line=25; anchor=`"| IS-001 | データ生成スクリプト追加 | DB管理者承認 | テスト全件実行可能 |"`\]: `完了条件「テスト全件実行可能」「承認済み文言反映」に確認の手段と合格の基準がない。rulebook の対応計画の記述ガイドに沿って、「代表シナリオのテストを全件実行してエラー0件」のような判定できる形にすべきである。`
- F008 \[minor/vp-ba-stakeholder-clarity; line=32; anchor=`"- 期限超過時: PMへ即時エスカレーション"`\]: `関係者の表記（QA担当・業務担当・DB管理者・PO・PM）が役割名と Role code で混在しており、共通登場人物との対応も分からない。担当・確認者・エスカレーション先を Role code で統一すべきである。`
- F009 \[minor/vp-arc-conciseness; line=16; anchor=`"| 課題ID | 優先度 | 期限       | 判定根拠           |"`\]: `「優先度と期限」の表が一覧の優先度・期限を課題ごとに再掲している。再掲をやめ、優先度の基準・期限の決め方・エスカレーション先・変更決定者の記述に置き換えるべきである。`
- F010 \[major/vp-qe-verifiability; line=16; anchor=`"| 課題ID | 優先度 | 期限       | 判定根拠           |"`\]: `優先度「高」「中」を割り当てる基準がない。「テスト遅延影響が大」は主観的な表現で、優先度の妥当性を判定できない。影響範囲や期限までの日数などで、判定できる基準を書くべきである。`
- F011 \[minor/vp-qe-verifiability; line=32; anchor=`"- 期限超過時: PMへ即時エスカレーション"`\]: `「期限超過時: PMへ即時エスカレーション」の「即時」に時間の基準（例: 超過当日中）がなく、遵守したかどうかを判定できない。`
- F012 \[minor/vp-qe-omissions-consistency; line=11; anchor=`"| IS-001 | 2026-04-02 | テストデータ不足     | 高     | データ生成スクリプト追加 | QA担当   | 2026-04-08 | 対応中     |"`\]: `更新責任者が未記載である（rulebook 6.1 違反）。`
- F013 \[major/vp-qe-omissions-consistency; line=14; anchor=`"## 3. 優先度と期限"`\]: `優先度基準および期限設定ルールが未記載である（rulebook 6.3 違反）。`
- F014 \[minor/vp-qe-omissions-consistency; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトで発生した課題を追跡管理する最小サンプルである。"`\]: `概要に、rulebook 6.1 が求めるレビュー頻度と記録単位（課題1件を1行で記録するなど）が書かれていない。`
- F015 \[minor/vp-qe-omissions-consistency; line=28; anchor=`"## 5. 進捗レビュー"`\]: `進捗レビューに、rulebook 6.5 が求める完了を判定する者・判定の観点・状態を更新する契機が書かれていない。レビュー周期と状態の値の列挙だけになっている。`
- F016 \[major/vp-qe-kata-conformance; line=11; anchor=`"| IS-001 | 2026-04-02 | テストデータ不足     | 高     | データ生成スクリプト追加 | QA担当   | 2026-04-08 | 対応中     |"`\]: ``優先度「高/中」とステータス「未着手/対応中/完了」が、rulebook 6.2 の「登録簿の `priority`・`item_status` の値を使い、言い換えない」に反している。schema の値（`high`・`medium`、`open`・`in-progress`・`done` など）を使うべきである。``
- F017 \[minor/vp-qe-kata-conformance; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトで発生した課題を追跡管理する最小サンプルである。"`\]: ``template は個票から生成するビュー（`pjr-rulebook` 準拠）で、sample は単独の課題ログの章構成になっている。sample がどちらの形の完成例なのかを示さないと、Kata 内で形の対応が読み取れない。``
- F018 \[minor/vp-ux-readability; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトで発生した課題を追跡管理する最小サンプルである。"`\]: `概要が1文だけで、記録単位・レビュー頻度・利用場面（単独のログとして使うこと）と、登録簿を使う場合に参照する文書が分からない。1〜3行で補うべきである。`
- F019 \[minor/vp-ux-language-consistency; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトで発生した課題を追跡管理する最小サンプルである。"`\]: `プロジェクト名「駄菓子屋の販売管理システム構築プロジェクト」が、共通サンプル文脈の名称「駄菓子屋きぬや 販売管理システム構築」と異なる。名称をそろえるべきである。`
- F020 \[minor/vp-ops-operability; line=31; anchor=`"- 状態更新: 未着手 / 対応中 / 完了"`\]: `「状態更新」が状態の値の列挙だけになっている。更新する者（Role code）と状態を変える契機（着手、依存の解消、完了条件の確認など）を書くべきである。`

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
