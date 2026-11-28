---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-opr-index-sample-050-20261123t092437z-d583f05c
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-opr-index-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:opr-index-sample
    - specdojo:opr-index-sample
---

# Edit Plan: T-KATA-WAVE-5-opr-index-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用手順（全体構成）の完成例
- `depends_on`:
  - [[specdojo:opd-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、運用手順の全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/opr-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-opr-index-sample-050/T-KATA-WAVE-5-opr-index-sample-050-20261123T092437Z-d583f05c/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/opr-index-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=1; anchor=`"# 運用手順: 全体 サンプル"`\]: `ドキュメントには、標準化された手順における明確な運用の範囲（スコープ内およびスコープ外のシステムまたは運用環境）が定義されていません。`
- F002 \[minor/vp-po-purpose-alignment; line=5; anchor=`"## 1. 概要（index）"`\]: `1章「概要（index）」に rulebook の受入条件である対象運用と利用者（店番・運用担当など）が書かれておらず、どの運用の手順群の入口なのかを読み取れないため、対象運用・目的・利用者を明記する必要がある。`
- F003 \[minor/vp-po-decision-readiness; line=1; anchor=`"# 運用手順: 全体 サンプル"`\]: `POの承認またはレビューに必要な未解決の課題、前提条件、および運用の影響範囲が文書化されていません。`
- F004 \[minor/vp-pm-plan-feasibility; line=9; anchor=`"## 2. 日次/週次/月次点検手順"`\]: `日常的な点検手順において、運用のスケジューリングと追跡に必要な詳細な実行ステップ、具体的なタイミングや期限、および所要時間の見積もりが不足しています。`
- F005 \[minor/vp-pm-dependency-risk; line=9; anchor=`"## 2. 日次/週次/月次点検手順"`\]: `運用のリスク、外部ツールへの依存関係、および点検やレビューの遅延がその後の運用スケジュールに与える影響が特定されていません。`
- F006 \[minor/vp-pm-control-reporting; line=17; anchor=`"## 3. 証跡（ログ、チケット、チェックリスト、実施記録）"`\]: `具体的な報告先、エスカレーションのワークフロー、および運用のリスクや変更要求をプロジェクト管理の追跡に転送するための基準が明記されていません。`
- F007 \[minor/vp-ba-business-value; line=5; anchor=`"## 1. 概要（index）"`\]: `ドキュメントには、具体的なビジネス上の問題、影響を受けるビジネスステークホルダー、運用の放置による結果、または提供されたビジネス価値を測定するための基準が記載されていません。`
- F008 \[major/vp-ba-requirements-completeness; line=9; anchor=`"## 2. 日次/週次/月次点検手順"`\]: `ドキュメントには、必要な運用ドメイン全体における運用の範囲、システムの前提条件、および手順の受け入れ基準が欠落しており、手順の完全性の検証ができません。`
- F009 \[minor/vp-ba-stakeholder-clarity; line=9; anchor=`"## 2. 日次/週次/月次点検手順"`\]: `外部ステークホルダー、ビジネスシステムの所有者、検証の承認者、および役割をまたいだ合意された運用のインターフェースの詳細が不十分です。`
- F010 \[minor/vp-arc-technical-constraints; line=17; anchor=`"## 3. 証跡（ログ、チケット、チェックリスト、実施記録）"`\]: `具体的な技術プラットフォーム、ツールチェーンの依存関係、ログスキーマ、およびストレージシステムの制約が明記されていません。`
- F011 \[major/vp-dev-implementation-readiness; line=9; anchor=`"## 2. 日次/週次/月次点検手順"`\]: `手順には、オペレーターが日常的なタスクを実行するために必要な具体的な点検対象、ツールの設定、入出力仕様、およびステップバイステップの指示が不足しています。`
- F012 \[minor/vp-dev-change-impact; line=25; anchor=``"## 4. 関連ドキュメント導線（`opd` 参照、`mip` / `otp` / `cop` 連携）"``\]: `日常的な手順や証跡保持ルールの変更が、既存のシステム、ツール、および運用のワークフローに与える影響が特定されていません。`
- F013 \[minor/vp-dev-testability; line=9; anchor=`"## 2. 日次/週次/月次点検手順"`\]: `運用の実行と証跡の記録を検証するための検証方法、テスト手順、および期待される結果が提供されていません。`
- F014 \[minor/vp-qe-verifiability; line=11; anchor=`"| 頻度 | 手順                         | 実施者   | 完了条件                           | 証跡               |"`\]: `週次の「誤検知が棚卸し済み」と月次の「棚卸し完了」には完了と判定する基準（対象範囲、記録項目、差異があったときの扱い）がなく pass / fail を判定できないため、判定可能な条件へ具体化する必要がある。`
- F015 \[major/vp-qe-omissions-consistency; line=11; anchor=`"| 頻度 | 手順                         | 実施者   | 完了条件                           | 証跡               |"`\]: `ルールブックで必須とされている本文構成（2, 4-10章）が欠落しており、サンプルとして不完全である。`
- F016 \[major/vp-qe-omissions-consistency; line=9; anchor=`"## 2. 日次/週次/月次点検手順"`\]: `rulebook の禁止事項「優先度別障害対応を未定義のまま確定しない」に対し、障害対応手順（P1/P2 の初動 SLA・段階別操作・連絡条件）の章も分冊への参照による充足も示されていないため、障害対応手順の章を置く必要がある。`
- F017 \[minor/vp-qe-omissions-consistency; line=25; anchor=``"## 4. 関連ドキュメント導線（`opd` 参照、`mip` / `otp` / `cop` 連携）"``\]: ``4章の見出しが rulebook の「関連ドキュメント導線（`opd-index` 参照）」と一致せず、`mip` / `otp` / `cop` 連携という rulebook にない範囲を見出しに含めているため、rulebook の見出しにそろえる必要がある。``
- F018 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 運用手順: 全体 サンプル"`\]: ``Frontmatter の `rulebook` 指定が `opd-rulebook` になっており、対象成果物の種別と不整合である。``
- F019 \[minor/vp-qe-kata-conformance; line=3; anchor=``"- 参照: `../rulebooks/opr-rulebook.md`"``\]: ``参照先のパスおよびファイル名（`opr-rulebook.md`）が、実際のルールブック（`opr-index-rulebook.md`）と一致していない。``
- F020 \[major/vp-qe-kata-conformance; line=11; anchor=`"| 頻度 | 手順                         | 実施者   | 完了条件                           | 証跡               |"`\]: `sample の業務文脈が共通サンプル文脈（駄菓子屋きぬや）ではなく Ops/Sec/Dev 体制や監視ダッシュボードを持つ一般的な Web サービスになっており、sample-authoring-standard の文脈統一に反するため、きぬやの店頭運用（店番・タブレット 1 台など）に合わせて書き直す必要がある。`
- F021 \[minor/vp-ux-readability; line=27; anchor=`"| 種別 | ドキュメントID     | 目的                                  | 備考       |"`\]: `導線表の備考「該当時」「必要時のみ」がどの条件で該当するかを示しておらず、初見の読者が次に読む分冊を判断できないため、参照する条件を具体的に記す必要がある。`
- F022 \[minor/vp-ux-language-consistency; line=11; anchor=`"| 頻度 | 手順                         | 実施者   | 完了条件                           | 証跡               |"`\]: `実施者・参照権限が「Ops当番」「Ops Lead」「Sec/Ops」「Ops/Dev」と表記ゆれしており Role code との対応も示されていないため、Role code にそろえ、「監視ダッシュ」の略記も正式名へ統一する必要がある。`
- F023 \[minor/vp-ops-release-readiness; line=1; anchor=`"# 運用手順: 全体 サンプル"`\]: `未解決の課題、前提条件の検証項目、およびドキュメントをドラフトから準備完了へと昇格させるための基準が明記されていません。`
- F024 \[major/vp-ops-operability; line=9; anchor=`"## 2. 日次/週次/月次点検手順"`\]: `インシデント対応、変更の実行、および問い合わせのエスカレーションを含む不可欠な運用のランブック手順がインデックスから漏れており、運用の実行を妨げています。`

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
