---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-dmd-index-sample-050-20261123t072020z-c6f3367c
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-dmd-index-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:dmd-index-sample
    - specdojo:dmd-index-sample
---

# Edit Plan: T-KATA-WAVE-5-dmd-index-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: データ移行設計（全体構成）の完成例
- `depends_on`:
  - [[specdojo:mip-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、データ移行設計の全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/dmd-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-dmd-index-sample-050/T-KATA-WAVE-5-dmd-index-sample-050-20261123T072020Z-c6f3367c/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/dmd-index-sample.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=5; anchor=``"本書はデータ移行設計の入口（`dmd-index`）として、共通方針と対象別DMDへの導線を定義する最小サンプルである。"``\]: `概要が文書の役割（入口・導線）しか述べておらず、rulebook の受入条件である移行の目的（再現性・品質担保）と対象範囲（どのシステムからどのシステムへの移行か）を1〜3行で示していない。`
- F002 \[minor/vp-po-decision-readiness; line=20; anchor=`"| 記録先   | 移行ログ基盤（例: S3/logs）      |"`\]: ``記録先が「移行ログ基盤（例: S3/logs）」と例示のままで、確定値か `_UNDECIDED_` か区別されておらず、承認者が判断対象を特定できない。``
- F003 \[minor/vp-pm-plan-feasibility; line=33; anchor=`"| データ | 受注           | old.orders → new.orders   | フル              | Mig  | dmd-order-data   |"`\]: `対象一覧の担当列「Mig」はメンバー定義や共通登場人物の Role code に対応しない略称で、作業の担当割り当てに使えないため、定義済みの Role code に置き換える必要がある。`
- F004 \[minor/vp-pm-dependency-risk; line=31; anchor=`"| 区分   | 対象（論理名） | 旧→新                     | 方針（フル/増分） | 担当 | 対応DMD          |"`\]: ``対象一覧が `mip-index` の移行対象・成功条件とどう整合するか（どの対象を受けたか、非対象の判断根拠）を示しておらず、rulebook の受入条件「`mip-index` との整合」を満たしていない。``
- F005 \[major/vp-ba-business-value; line=33; anchor=`"| データ | 受注           | old.orders → new.orders   | フル              | Mig  | dmd-order-data   |"`\]: `移行対象が受注・請求・監査ログという汎用の業務システム題材で、共通サンプル文脈（駄菓子屋きぬやの販売記録・在庫・つけ台帳をノートから移行する）と対応せず、移行の業務上の価値を説明できない。`
- F006 \[major/vp-ba-requirements-completeness; line=25; anchor=`"- 検証種別: 件数照合 / サンプル照合 / 重要値照合"`\]: `検証の共通方針が種別名の列挙にとどまり、rulebook の受入条件である件数・サンプル・重要値それぞれの照合手順（何と何を比べるか）と、証跡の保管先・命名を欠いている。`
- F007 \[minor/vp-ba-requirements-completeness; line=12; anchor=`"- ログ: 抽出/変換/投入/照合レポートに run_id を付与する"`\]: `ログ方針が run_id の付与だけで、rulebook の受入条件「ログ必須項目」（例: 実行日時、件数、エラー件数、対象）を定義していない。`
- F008 \[minor/vp-ba-stakeholder-clarity; line=27; anchor=`"- 証跡: 照合レポート/検証ログを run_id 単位で保管する"`\]: `検証の合否を誰が確認し承認するか（確認者の Role code）が示されておらず、照合結果の合意者が読み取れない。`
- F009 \[minor/vp-arc-technical-constraints; line=11; anchor=`"- 冪等性: run_id を識別キーとして管理し、再実行時は別run_idを採番する"`\]: `冪等性の記述が run_id の採番規則にとどまり、再実行で同一結果となる条件（投入先の初期化や上書きの方式）を定義していないため、rulebook の全体方針を満たしていない。`
- F010 \[minor/vp-dev-implementation-readiness; line=18; anchor=``"| 命名     | `DMD-YYYYMMDD-<term>-NN`         |"``\]: ``run_id の命名で `＜term＞` に入る具体値（例: 対象の論理名）と NN の桁数・開始値が示されておらず、sample として採番結果の完成例が読み取れない。``
- F011 \[minor/vp-qe-verifiability; line=26; anchor=`"- 合格基準: 原則 差分0。許容差εを用いる場合は理由を明記する"`\]: `許容差εを用いる場合の具体例（対象・値・理由）が示されておらず、sample として差分0以外の合否判定の書き方を読み取れない。`
- F012 \[minor/vp-qe-omissions-consistency; line=35; anchor=`"| 非対象 | 監査ログ       | old.audit_log → -         | -                 | -    | -                |"`\]: `非対象行（監査ログ）に除外の理由が記載されておらず、対象外の判断根拠が読み取れない。`
- F013 \[major/vp-qe-kata-conformance; line=33; anchor=`"| データ | 受注           | old.orders → new.orders   | フル              | Mig  | dmd-order-data   |"`\]: `sample-authoring-standard の「共通の業務文脈以外の業種題材を混在させない」に反し、移行対象（受注・請求・監査ログ）と記録先（S3）が駄菓子屋きぬやの共通サンプル文脈（販売記録・在庫・つけ台帳）に統一されていない。`
- F014 \[minor/vp-qe-kata-conformance; line=5; anchor=``"本書はデータ移行設計の入口（`dmd-index`）として、共通方針と対象別DMDへの導線を定義する最小サンプルである。"``\]: ``sample が rulebook の受入条件（概要の目的と範囲、検証の照合手順・証跡保管先、`mip-index` との整合）を完成例として満たしておらず、型の手本として不足している。``
- F015 \[minor/vp-ux-readability; line=5; anchor=``"本書はデータ移行設計の入口（`dmd-index`）として、共通方針と対象別DMDへの導線を定義する最小サンプルである。"``\]: `概要から移行元・移行先と移行の目的が読み取れず、初見の読者が文書の対象と主要な判断を把握できないため、目的と範囲を1〜3行で追記する必要がある。`
- F016 \[minor/vp-ux-language-consistency; line=11; anchor=`"- 冪等性: run_id を識別キーとして管理し、再実行時は別run_idを採番する"`\]: `` `run_id` の表記がインラインコードあり・なし・「別run_id」の連結で揺れているため、識別子として一貫してインラインコードで表記する必要がある。 ``
- F017 \[minor/vp-ops-release-readiness; line=1; anchor=`"# データ移行設計 サンプル"`\]: ``ready 化の前に残る未解決事項（共通サンプル文脈への統一、検証手順の補完）が本文に `_TODO_` / `_UNDECIDED_` として示されておらず、公開判断の前提が読み取れない。``

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
