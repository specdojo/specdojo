---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-opd-index-sample-050-20261123t072133z-76ada6a6
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-opd-index-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:opd-index-sample
    - specdojo:opd-index-sample
---

# Edit Plan: T-KATA-WAVE-5-opd-index-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用方針・設計（全体構成）の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、運用方針・設計の全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/opd-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-opd-index-sample-050/T-KATA-WAVE-5-opd-index-sample-050-20261123T072133Z-76ada6a6/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/opd-index-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **OPS（Operations / Release Manager）**
- 責務: 文書群とツールのリリース・公開・配布・変更管理を担う。公開可否の最終判断は PO に残し、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- リリース・公開準備: 公開、配布、ready 化、リリース判断に必要な前提や未解決事項が明示されているか。
- 運用しやすさ: 継続更新、再生成、変更管理、問い合わせ対応、障害時対応に必要な情報が読み取れるか。
- agent 委任境界: agent に最終承認、公開可否判断、説明責任を委ねる記述になっていないか。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-po-purpose-alignment; line=13; anchor=`"| 可用性      | 99.9%以上    | 月次     | 監視SaaSの稼働率集計     | 監視レポート | 運用責任者     |"`\]: `SLO・SLA・KPI の可用性 99.9%・API p95・監視SaaS/APM という SaaS 前提の目標値は、駄菓子屋きぬやの単一店舗・タブレット 1 台・記録定着優先という共通サンプル文脈の目的から必要性を説明できないため、店頭販売・在庫・つけ記録の継続に対応する目標値へ置き換え、プロジェクトの目的との対応を示すべきである。`
- F002 \[major/vp-po-decision-readiness; line=5; anchor=`"## 1. 概要（index）"`\]: ``運用方針として PO が判断すべき論点（オフライン時の運用、停止判断の承認者、RTO/RPO など）と未決事項が `_UNDECIDED_` / `_ASSUMPTION_` で明示されておらず、承認・保留の判断材料が欠けているため、未決事項と判断者を明記すべきである。``
- F003 \[minor/vp-pm-plan-feasibility; line=5; anchor=`"## 1. 概要（index）"`\]: `具体的な業務単位、定期的なスケジュール、および完了条件が不足しており、タスクの計画と追跡の実現可能性を下げています。`
- F004 \[minor/vp-pm-dependency-risk; line=5; anchor=`"## 1. 概要（index）"`\]: ``運用方針の設計判断の根拠となる上位成果物（`nfr-*` / `sac-*` 等）が `based_on` にも本文にも示されず、運用リスクや後続 `opr-*` への依存も識別されていないため、依存とリスクを明記すべきである。``
- F005 \[minor/vp-pm-control-reporting; line=9; anchor=`"## 2. SLO・SLA・KPI"`\]: `SLO・SLA・KPI の未達時に誰へ報告し、課題・変更要求としてどこへ転記するかが示されていないため、未達時の報告先と対応方針を明記すべきである。`
- F006 \[major/vp-ba-business-value; line=9; anchor=`"## 2. SLO・SLA・KPI"`\]: `SLO・SLA・KPI が技術指標のみで、店主代表・家族利用者代表の業務課題（記録継続、つけ残高確認、店主不在時の運営継続）や共通サンプル文脈の期待効果と対応しておらず、運用方針の業務価値を説明できないため、業務成果に結び付く KPI を含めるべきである。`
- F007 \[major/vp-ba-requirements-completeness; line=5; anchor=`"## 1. 概要（index）"`\]: `業務範囲、前提条件、および対象外の境界が完全に欠落しており、ステークホルダーが要件の網羅性と受け入れ境界を検証できない状態になっています。`
- F008 \[major/vp-ba-stakeholder-clarity; line=19; anchor=`"| 対象          | R（実行） | A（責任） | C（相談） | I（共有） | 備考           |"`\]: `RACI の担い手が Ops / Ops Lead / Dev Lead / Biz という共通サンプル文脈に存在しない体制で、当番体制と優先度別エスカレーション条件も欠けているため、Role code（PO / DEV 等）と共通登場人物の役割名で当番・連絡系統・エスカレーション条件を明記すべきである。`
- F009 \[minor/vp-arc-technical-constraints; line=5; anchor=`"## 1. 概要（index）"`\]: `技術的な制約、外部システムへの依存関係、およびリカバリ目標（RTO/RPO）が指定されていません。`
- F010 \[major/vp-arc-technical-constraints; line=13; anchor=`"| 可用性      | 99.9%以上    | 月次     | 監視SaaSの稼働率集計     | 監視レポート | 運用責任者     |"`\]: `監視SaaS・APM・API p95 を前提とする測定方法は、店内タブレット 1 台・EC や外部システム連携は対象外という共通サンプル文脈の技術前提と矛盾するため、前提とする構成に合った測定手段へ改めるべきである。`
- F011 \[minor/vp-arc-conciseness; line=3; anchor=``"- 参照: `../rulebooks/opd-rulebook.md`"``\]: ``本文冒頭の「参照: `../rulebooks/opd-rulebook.md`」は Frontmatter の `rulebook` 宣言の再掲で判断情報を持たないため、削除して Frontmatter の宣言に一本化すべきである。``
- F012 \[major/vp-dev-implementation-readiness; line=5; anchor=`"## 1. 概要（index）"`\]: `監視のしきい値、アラートの送信先、および変更の承認基準などの不可欠な実装パラメータが不足しており、設定要件が不完全な状態です。`
- F013 \[minor/vp-dev-change-impact; line=5; anchor=`"## 1. 概要（index）"`\]: `変更管理の基準とロールバックのトリガーが不足しており、システムや設定変更の影響評価プロセスが定義されていません。`
- F014 \[minor/vp-qe-verifiability; line=15; anchor=`"| 一次応答    | P1: 30分以内 | 月次     | チケット初回応答時刻集計 | 問合せ台帳   | サポート責任者 |"`\]: `一次応答の目標が P1 のみで P2/P3 の基準がなく、RACI 備考の「即時連絡」も判定可能な時間基準になっていないため、優先度ごとに数値で目標を定義すべきである。`
- F015 \[major/vp-qe-omissions-consistency; line=5; anchor=`"## 1. 概要（index）"`\]: `必須章（2, 5, 6, 7, 8, 9, 10, 11）が大幅に欠落している。`
- F016 \[major/vp-qe-omissions-consistency; line=9; anchor=`"## 2. SLO・SLA・KPI"`\]: `章番号が不整合であり、SLO・SLA・KPI は ## 3 であるべきだが ## 2 となっている。`
- F017 \[major/vp-qe-omissions-consistency; line=17; anchor=`"## 3. 体制・責任分界（RACI・当番・エスカレーション）"`\]: `章番号が不整合であり、体制・責任分界 は ## 4 であるべきだが ## 3 となっている。`
- F018 \[major/vp-qe-omissions-consistency; line=25; anchor=``"## 4. 関連ドキュメント導線（`opr` 等）"``\]: `章番号が不整合であり、関連ドキュメント導線 は ## 12 であるべきだが ## 4 となっている。`
- F019 \[major/vp-qe-kata-conformance; line=5; anchor=`"## 1. 概要（index）"`\]: `ルールブックで定義された必須構成に従っておらず、サンプルとしての整合性が欠如している。`
- F020 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# 運用方針・設計: 全体 サンプル"`\]: `Frontmatter の rulebook 参照 ID が specdojo:opd-index-rulebook と不整合である。`
- F021 \[major/vp-qe-kata-conformance; line=13; anchor=`"| 可用性      | 99.9%以上    | 月次     | 監視SaaSの稼働率集計     | 監視レポート | 運用責任者     |"`\]: `SLO 表・RACI が監視SaaS/APM/API と Ops / Biz 体制という汎用 SaaS の題材で書かれ、sample-authoring-standard の共通サンプル文脈（駄菓子屋きぬや）への統一と、責務項目に Role code を使う規約に違反しているため、駄菓子屋きぬやの文脈と Role code で書き直すべきである。`
- F022 \[major/vp-ux-readability; line=5; anchor=`"## 1. 概要（index）"`\]: `必須構成の大幅な省略により、運用方針の SSOT としての十分な情報を備えておらず、可読性と完結性に欠ける。`
- F023 \[minor/vp-ux-language-consistency; line=13; anchor=`"| 可用性      | 99.9%以上    | 月次     | 監視SaaSの稼働率集計     | 監視レポート | 運用責任者     |"`\]: `SLO 表の判定者（運用責任者・サポート責任者）と RACI の担い手（Ops Lead・Dev Lead・Biz）の呼称が対応付けられておらず表記が混在しているため、Role code に統一して同一の担い手を同じラベルで示すべきである。`
- F024 \[minor/vp-ops-release-readiness; line=5; anchor=`"## 1. 概要（index）"`\]: `ドキュメントのステータスを draft から ready へ移行するために必要な未解決の項目および前提条件が文書化されていません。`
- F025 \[major/vp-ops-operability; line=5; anchor=`"## 1. 概要（index）"`\]: `インシデント対応、変更管理、定期的な運用、および問い合わせ対応を含む主要な運用ポリシーが不足しており、運用担当者が継続的な運用に必要なガイドラインを得られない状態になっています。`

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
