---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-pm-change-request-log-sample-050-20261123t072251z-159d7365
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-pm-change-request-log-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: sample-maintenance
  targets:
    - specdojo:pm-change-request-log-sample
    - specdojo:pm-change-request-log-sample
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-pm-change-request-log-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 変更要求ログの完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、変更要求ログの完成例を示す
- `path`: `docs/ja/specdojo/samples/pm-change-request-log-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-pm-change-request-log-sample-050/T-KATA-WAVE-6-PROJECT-pm-change-request-log-sample-050-20261123T072251Z-159d7365/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/pm-change-request-log-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=23; anchor=`"| 変更ID | 審査結果     | 決定者 | 決定日     | 実施条件         |"`\]: ``審査・決定の表に `pm-plan` のスコープ・優先順位との対応（どのスコープ項目・優先度に照らして承認したか）が書かれておらず、決定がプロジェクト目的に沿う根拠を示せていない。``
- F002 \[major/vp-po-decision-readiness; line=11; anchor=`"| CR-001 | 在庫一覧にカテゴリ絞り込みを追加 | 業務PO     | 2026-04-01 | 審査中 |"`\]: `CR-001 の状態が変更要求一覧では「審査中」だが、審査・決定では 2026-04-04 に「承認」、実施追跡では「対応中」となっており、現在の判断状態が矛盾している。`
- F003 \[major/vp-po-decision-readiness; line=12; anchor=`"| CR-002 | 日次売上CSVの列順を変更          | 店舗責任者 | 2026-04-03 | 承認   |"`\]: `CR-002 の状態が変更要求一覧では「承認」だが、審査・決定では「条件付き承認」であり、実施条件付きであることが一覧から読み取れない。`
- F004 \[minor/vp-po-decision-readiness; line=16; anchor=`"| 変更ID | 影響範囲  | 工数見積 | 納期影響 | 評価 |"`\]: `影響評価に、採否判断の材料として rulebook が求める「見送ったときの影響」と「期待効果」、および影響量の根拠がない。`
- F005 \[minor/vp-po-publication-accountability; line=26; anchor=`"| CR-002 | 条件付き承認 | PM     | 2026-04-05 | 連携先へ仕様通知 |"`\]: `CR-002 は納期 1 日延長を伴うのに決定者が PM のみで、スコープ・納期変更の最終承認と説明責任を PO が担う前提（承認者または合意者）が示されていない。`
- F006 \[minor/vp-pm-plan-feasibility; line=32; anchor=`"| CR-001 | 開発リード | 2026-04-10 | 対応中 | 受入テスト合格 |"`\]: `完了条件「受入テスト合格」「取込確認完了」が、rulebook の求める確認手段と合格基準の形（例: 受入テストで新しい列順を会計ソフトへ取り込めること）になっていない。`
- F007 \[minor/vp-pm-dependency-risk; line=37; anchor=``"- `pm-plan`: 全体管理方針"``\]: `関連ドキュメントが文書種別の一般説明だけで、CR-002 の納期延長や連携先影響から起票したリスク・課題、影響先文書を変更 ID と結び付けて示していない。`
- F008 \[minor/vp-pm-control-reporting; line=37; anchor=``"- `pm-plan`: 全体管理方針"``\]: ``変更から生じたリスク・課題として `pm-risk-register`・`pm-issue-log` へ転記すべき事項が特定されず、転記先の項目 ID も示されていない。``
- F009 \[major/vp-ba-business-value; line=9; anchor=`"| 変更ID | 要求内容                         | 申請者     | 申請日     | 状態   |"`\]: `変更要求一覧に rulebook 必須の変更理由（応える業務課題・期待価値）の列がなく、各変更がどの利用者のどの課題に応えるか説明できない。`
- F010 \[minor/vp-ba-requirements-completeness; line=12; anchor=`"| CR-002 | 日次売上CSVの列順を変更          | 店舗責任者 | 2026-04-03 | 承認   |"`\]: `CR-002 の要求内容「日次売上CSVの列順を変更」が、どの順へどう変えるか（例: 会計ソフトの取込順に合わせる）を示しておらず、受入可否を利用者視点で確認できない。`
- F011 \[minor/vp-ba-stakeholder-clarity; line=12; anchor=`"| CR-002 | 日次売上CSVの列順を変更          | 店舗責任者 | 2026-04-03 | 承認   |"`\]: `申請者「店舗責任者」「業務PO」や実施担当「IF担当」が共通サンプル文脈の登場人物・Role code と対応せず、仕様通知先の「連携先」も特定されていない。`
- F012 \[minor/vp-dev-implementation-readiness; line=27; anchor=`""`\]: `CR-002 の変更後の列順や対象ファイルなど実施に必要な入力がなく、実施条件「連携先へ仕様通知」の通知内容・期限も示されていないため作業を確定できない。`
- F013 \[minor/vp-dev-change-impact; line=19; anchor=`"| CR-002 | 帳票・IF  | 2人日    | 1日延長  | 中   |"`\]: `CR-002 の影響範囲「帳票・IF」について、既存の取込処理や連携先との互換性への影響が評価されていない。`
- F014 \[minor/vp-dev-testability; line=33; anchor=`"| CR-002 | IF担当     | 2026-04-09 | 完了   | 取込確認完了   |"`\]: `CR-002 の完了条件「取込確認完了」が、どの取込先で何を確認すれば合格かを示しておらず、変更後の確認手順と期待結果が分からない。`
- F015 \[minor/vp-qe-verifiability; line=18; anchor=`"| CR-001 | 画面・API | 3人日    | なし     | 軽微 |"`\]: `影響評価の「評価」列（軽微・中）に判定基準や尺度がなく、評価結果を再現・検証できない。`
- F016 \[minor/vp-qe-omissions-consistency; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトにおける変更要求の申請・審査・決定・実施追跡を管理する最小サンプルである。"`\]: `概要に「運用期間」と「記録単位」の記載が不足している。`
- F017 \[minor/vp-qe-omissions-consistency; line=19; anchor=`"| CR-002 | 帳票・IF  | 2人日    | 1日延長  | 中   |"`\]: `影響評価の一覧に, rulebook で指定されている「品質」への影響項目が不足している。`
- F018 \[major/vp-qe-omissions-consistency; line=11; anchor=`"| CR-001 | 在庫一覧にカテゴリ絞り込みを追加 | 業務PO     | 2026-04-01 | 審査中 |"`\]: `変更要求一覧の状態（CR-001: 審査中、CR-002: 承認）が審査・決定の結果（CR-001: 承認、CR-002: 条件付き承認）と一致せず、章間で記録が矛盾している。`
- F019 \[minor/vp-qe-omissions-consistency; line=9; anchor=`"| 変更ID | 要求内容                         | 申請者     | 申請日     | 状態   |"`\]: ``変更要求一覧に rulebook 必須の「変更理由」列がなく、審査・決定に `pm-plan` との対応の記載もない。``
- F020 \[minor/vp-qe-kata-conformance; line=2; anchor=`""`\]: `テンプレートで定義されている「個票から生成された派生ビュー（再生成可能）」という性質や注記が反映されておらず、手動管理のログ形式となっている。`
- F021 \[minor/vp-ux-readability; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトにおける変更要求の申請・審査・決定・実施追跡を管理する最小サンプルである。"`\]: `概要が一般的な 1 文のみで、対象プロジェクト名（駄菓子屋きぬや）や本ログの利用者・利用時点が分からず、文書の位置づけを初見で把握しにくい。`
- F022 \[minor/vp-ux-language-consistency; line=18; anchor=`"| CR-001 | 画面・API | 3人日    | なし     | 軽微 |"`\]: `影響評価の「評価」列で「軽微」と「中」という異なる尺度の語が混在し、ロール表記も Role code ではなく呼称がばらついている。`
- F023 \[minor/vp-ops-release-readiness; line=11; anchor=`"| CR-001 | 在庫一覧にカテゴリ絞り込みを追加 | 業務PO     | 2026-04-01 | 審査中 |"`\]: ``ready 化の前に、状態列と審査結果の矛盾、および rulebook 必須項目（変更理由・品質影響・`pm-plan` 対応）の欠落を解消する必要がある。``
- F024 \[minor/vp-ops-operability; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトにおける変更要求の申請・審査・決定・実施追跡を管理する最小サンプルである。"`\]: `本ログの更新単位・更新タイミングや、登録簿の個票から再生成する運用か手動更新の単独ログかが示されず、継続更新の方法が読み取れない。`

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
