---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-pm-risk-register-sample-050-20261123t075012z-dc2fcc93
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: sample-maintenance
  targets:
    - specdojo:pm-risk-register-sample
    - specdojo:pm-risk-register-sample
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: リスク登録簿の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、リスク登録簿の完成例を示す
- `path`: `docs/ja/specdojo/samples/pm-risk-register-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-050/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-050-20261123T075012Z-dc2fcc93/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/pm-risk-register-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=35; anchor=``"- `pm-change-request-log`"``\]: ``関連ドキュメントに、リスクの根拠となるプロジェクト概要やスケジュール（例: `prj-overview`）への参照がなく、各リスクがどの目的・目標に影響するかを辿れない。``
- F002 \[major/vp-po-decision-readiness; line=18; anchor=`"- 優先度: 発生確率と影響度の積で判定"`\]: `評価基準に、再評価の条件と評価を変える判断をする者が記載されておらず、優先度や対応方針を誰が承認・変更するかを判断できない。`
- F003 \[major/vp-pm-plan-feasibility; line=24; anchor=`"| RK-001   | 低減     | 負荷試験追加     | 2026-04-15 | 閾値以内 |"`\]: `完了条件「閾値以内」に確認手段と合格基準（例: 負荷試験で想定ピーク時の応答時間 N 秒以内）がなく、rulebook の「完了条件は確認の手段と合格の基準で書く」を満たさないため、タスク完了を判定できない。`
- F004 \[minor/vp-pm-dependency-risk; line=30; anchor=`"- 更新トリガー: 新規兆候発生、期限超過、影響度変更"`\]: ``顕在化を判定するトリガーと、顕在化時に `pm-issue-log` へ起票する条件が書かれておらず、リスクから課題・スケジュールへの影響の連携を判断できない。``
- F005 \[minor/vp-pm-control-reporting; line=30; anchor=`"- 更新トリガー: 新規兆候発生、期限超過、影響度変更"`\]: `モニタリングに、見直しが行われなかったときの連絡先（報告先の Role code）が記載されていない。`
- F006 \[minor/vp-ba-business-value; line=11; anchor=`"| RK-001   | 繁忙期の性能劣化 | 中       | 高     | 高     | 負荷試験追加     | 開発リード | 対応中     |"`\]: `影響度「高」とした理由（どの業務がどう止まるか）が記載されておらず、リスクの業務上の重大さを利用者視点で確認できない。`
- F007 \[major/vp-ba-requirements-completeness; line=18; anchor=`"- 優先度: 発生確率と影響度の積で判定"`\]: `「発生確率と影響度の積で判定」としているが、低/中/高の段階ごとの判定条件と、組み合わせから優先度を決める対応表がなく、rulebook 6.3 の要求を満たさず優先度を再現できない。`
- F008 \[minor/vp-ba-stakeholder-clarity; line=12; anchor=`"| RK-002   | 業務側確認の遅延 | 高       | 中     | 高     | 合意期限の前倒し | PM         | 監視中     |"`\]: `RK-002 の「業務側」が誰か（店主代表・家族利用者代表など）が記載されておらず、確認・合意の相手を特定できない。`
- F009 \[minor/vp-arc-technical-constraints; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトの潜在リスクと対応策を管理する最小サンプルである。"`\]: ``本書がプロジェクト登録簿を使わない単独のリスク登録簿の例であり、登録簿を使う場合は `item_type: risk` の個票から `register build` で生成する、という前提が概要に示されていない。``
- F010 \[minor/vp-arc-conciseness; line=11; anchor=`"| RK-001   | 繁忙期の性能劣化 | 中       | 高     | 高     | 負荷試験追加     | 開発リード | 対応中     |"`\]: `リスク登録簿一覧と対応計画の両方に同じ「対応策」が書かれ二重管理になっているため、一方に寄せる。`
- F011 \[minor/vp-dev-implementation-readiness; line=11; anchor=`"| RK-001   | 繁忙期の性能劣化 | 中       | 高     | 高     | 負荷試験追加     | 開発リード | 対応中     |"`\]: ``優先度「高」やステータス「対応中」「監視中」が `priority`・`item_status` の値ではなく、このまま転用すると値の不一致を招く。``
- F012 \[minor/vp-dev-change-impact; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトの潜在リスクと対応策を管理する最小サンプルである。"`\]: ``登録簿を使うプロジェクトでは `pm-risk-register.md` が生成物で直接編集しないことへの言及がなく、sample を手本に生成物を手修正する誤用を招く。``
- F013 \[minor/vp-qe-verifiability; line=24; anchor=`"| RK-001   | 低減     | 負荷試験追加     | 2026-04-15 | 閾値以内 |"`\]: `「閾値以内」という表現は具体的数値や判定基準が不明確であり、客観的な検証可能性が低い。`
- F014 \[minor/vp-qe-verifiability; line=25; anchor=`"| RK-002   | 回避     | 合意期限の前倒し | 2026-04-10 | 合意完了 |"`\]: `「合意完了」という表現は、誰が誰に、何を合意すれば完了とするのかが不明確である。`
- F015 \[major/vp-qe-verifiability; line=18; anchor=`"- 優先度: 発生確率と影響度の積で判定"`\]: `低/中/高の値に対して「積」で優先度を判定するとしているが、段階の数値化や対応表がなく、優先度が正しいかを判定できない。`
- F016 \[major/vp-qe-omissions-consistency; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトの潜在リスクと対応策を管理する最小サンプルである。"`\]: `概要に「見直し頻度」と「責任者」の記述が不足している。`
- F017 \[minor/vp-qe-omissions-consistency; line=17; anchor=`"- 影響度: 低/中/高"`\]: `評価基準に「再評価条件」の記述が不足している。`
- F018 \[minor/vp-qe-omissions-consistency; line=30; anchor=`"- 更新トリガー: 新規兆候発生、期限超過、影響度変更"`\]: `モニタリングに「状態更新ルール」の記述が不足している。`
- F019 \[major/vp-qe-omissions-consistency; line=11; anchor=`"| RK-001   | 繁忙期の性能劣化 | 中       | 高     | 高     | 負荷試験追加     | 開発リード | 対応中     |"`\]: ``優先度「高」、ステータス「対応中」「監視中」は rulebook 6.2 が求める `priority`・`item_status` の値ではなく、言い換え禁止に反する。``
- F020 \[minor/vp-qe-omissions-consistency; line=34; anchor=``"- `pm-issue-log`"``\]: ``関連ドキュメントが文書 ID（wikilink）ではなく `pm-issue-log` 等の名称で記載され、rulebook 6.6 の「文書 ID で示す」に合わない。``
- F021 \[blocker/vp-qe-kata-conformance; line=1; anchor=`"# リスク登録簿 サンプル"`\]: `本書は rulebook に基づき手動作成の形式をとっているが、対応するテンプレート（specdojo:pm-risk-register-template）では自動生成ビューとして定義されており、成果物の種別と責務が根本的に矛盾している。`
- F022 \[minor/vp-ux-readability; line=5; anchor=`"本書は、駄菓子屋の販売管理システム構築プロジェクトの潜在リスクと対応策を管理する最小サンプルである。"`\]: `概要が管理対象の 1 文のみで、記録単位・見直し頻度・形態（単独登録簿）が示されず、初見の読者が本書の使いどころを把握しにくい。`
- F023 \[minor/vp-ux-language-consistency; line=11; anchor=`"| RK-001   | 繁忙期の性能劣化 | 中       | 高     | 高     | 負荷試験追加     | 開発リード | 対応中     |"`\]: `` `担当` 列が「開発リード」「PM」と表記ゆれしており、メンバー定義の Role code に統一されていない。 ``
- F024 \[minor/vp-ux-language-consistency; line=25; anchor=`"| RK-002   | 回避     | 合意期限の前倒し | 2026-04-10 | 合意完了 |"`\]: `RK-002 の対応方針「回避」に対し、対応策「合意期限の前倒し」はリスク要因を除去せず発生確率を下げる低減策であり、方針区分と内容が一致しない。`
- F025 \[major/vp-ops-release-readiness; line=1; anchor=`"# リスク登録簿 サンプル"`\]: `rulebook・template との種別不整合や評価基準の不足が未解消であり、ready 化の前提が満たされていない。`
- F026 \[minor/vp-ops-operability; line=29; anchor=`"- 監視周期: 週次"`\]: `週次の見直しが行われなかった場合の連絡先と、顕在化時に課題ログへ起票する手順がなく、運用の例外時の対応が分からない。`

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
