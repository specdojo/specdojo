---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-dmd-sample-050-20261123t083237z-1042ddf1
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-dmd-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:dmd-sample
    - specdojo:dmd-sample
---

# Edit Plan: T-KATA-WAVE-5-dmd-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: データ移行設計（対象別）の完成例
- `depends_on`:
  - [[specdojo:dmd-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、データ移行設計の対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/dmd-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-dmd-sample-050/T-KATA-WAVE-5-dmd-sample-050-20261123T083237Z-1042ddf1/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/dmd-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=``"本書は受注データの対象別移行設計（`dmd-<term>`）として、抽出・変換・投入・検証方法を定義する最小サンプルである。"``\]: `移行対象が数百万件規模の受注データと S3 で、共通サンプル文脈「駄菓子屋きぬや 販売管理システム構築」（ノートと記憶による運用からの記録化、単一店舗）と結び付いていない。きぬやの既存記録（販売ノート、つけ帳、在庫メモなど）を移す題材に置き換え、プロジェクト目的との対応を概要に示す必要がある。`
- F002 \[minor/vp-po-decision-readiness; line=42; anchor=`"- 停止許容時間内で完了するように実行順序を固定する"`\]: ``「停止許容時間内で完了する」とあるが停止許容時間の値も出典（`mip-index` の該当条件）もないため、所要時間見積が許容範囲内か PO が判断できない。値と参照先を明記する必要がある。``
- F003 \[minor/vp-pm-plan-feasibility; line=41; anchor=`"- 1,000,000 件あたり 45 分（並列度 4）"`\]: `件数あたりの単価だけで、対象全体（orders と order_item の合計件数）の総所要時間と目標時間が書かれておらず、スケジュール見積りに使えない。総所要時間とその算出前提を示す必要がある。`
- F004 \[minor/vp-pm-dependency-risk; line=42; anchor=`"- 停止許容時間内で完了するように実行順序を固定する"`\]: `停止許容時間を超過するリスクとその暫定対策（分割、先行移行など）が識別されておらず、スケジュールへの影響を後続成果物に引き継げない。想定リスクと対策方針を追記する必要がある。`
- F005 \[major/vp-ba-business-value; line=29; anchor=`"- 取消済みかつ 3 年経過のデータは除外（業務上不要）"`\]: `除外理由が「業務上不要」だけで、誰のどの業務に影響しないのか（参照のみで足りるか、代替手段があるか）が示されていない。共通サンプル文脈の業務（販売、在庫、つけ）に沿って、除外の影響を説明する必要がある。`
- F006 \[minor/vp-ba-requirements-completeness; line=29; anchor=`"- 取消済みかつ 3 年経過のデータは除外（業務上不要）"`\]: `「3 年経過」の起算日（取消日か受注日か）と基準日（移行実施日か）が定まっておらず、除外対象を一意に特定できない。起算日と基準日を明記する必要がある。`
- F007 \[minor/vp-ba-stakeholder-clarity; line=56; anchor=`"| 検証種別     | 検証項目                | 方法            | 合格基準（差分0 / 許容差ε） | 証跡             |"`\]: `検証の証跡（照合レポートなど）を誰が確認して合否を判定するのかが示されていない。確認者の Role code か役割名を検証表か備考に示す必要がある。`
- F008 \[minor/vp-arc-technical-constraints; line=35; anchor=`"| 1    | 抽出 | 旧DB             | 抽出ファイル（CSV） | job: export_orders          | S3に配置   |"`\]: `抽出ファイルを S3 に配置する前提が、共通サンプル文脈の構成（店内タブレット1台、小規模運用）と合わず、技術前提として誤読を招く。題材に合った置き場と実行手段を示す必要がある。`
- F009 \[minor/vp-dev-implementation-readiness; line=24; anchor=`"- 状態コードは旧→新の変換表に従う"`\]: `「旧→新の変換表に従う」とあるが、変換表の所在（参照表名または仕様ID）がなく、rulebook の記述ガイド「変換ルール」が求める根拠への導線が欠けている。参照先を明記するか、代表的なコード対応を示す必要がある。`
- F010 \[minor/vp-dev-change-impact; line=18; anchor=`"| orders.order_id     | orders.id            | 主キー維持（連番維持）         |"`\]: `「主キー維持（連番維持）」としているが、移行後に新規採番を移行済みの最大値から続けるといった影響と扱いが示されず、移行後の運用で主キーが重複する恐れを判断できない。採番の扱いを補足する必要がある。`
- F011 \[minor/vp-dev-testability; line=58; anchor=`"| 件数照合     | orders件数              | 旧/新件数比較   | 差分0                       | 照合レポート     |"`\]: `件数照合が orders だけで、対象データ表にある order_item（8,900,000 件）の件数照合がない。移行対象すべてに件数照合を設ける必要がある。`
- F012 \[minor/vp-qe-verifiability; line=56; anchor=`"| 検証種別     | 検証項目                | 方法            | 合格基準（差分0 / 許容差ε） | 証跡             |"`\]: `合格基準が差分0だけで、rulebook の記述ガイド「検証方法」が求める理由1行（なぜ許容差εではなく差分0か）が書かれていない。理由を併記する必要がある。`
- F013 \[minor/vp-qe-verifiability; line=59; anchor=`"| サンプル照合 | 重要顧客100件の受注明細 | 旧/新の明細突合 | 差分0                       | 抜取検証ログ     |"`\]: `「重要顧客100件」の選定基準がなく、抜取対象を再現できない。選定条件を明記する必要がある。`
- F014 \[minor/vp-qe-omissions-consistency; line=5; anchor=``"本書は受注データの対象別移行設計（`dmd-<term>`）として、抽出・変換・投入・検証方法を定義する最小サンプルである。"``\]: `rulebook の記述ガイド「概要」が求める依存前提（移行方式、移行期間、上位の成功条件）が概要に書かれていない。1〜3行で前提を追記する必要がある。`
- F015 \[major/vp-qe-kata-conformance; line=9; anchor=`"| 対象       | 期間/抽出条件   | 方式（フル/増分） | 増分基準（カラム/キー/基準時刻） | 概算件数  | 備考       |"`\]: `数百万件の受注・明細と S3・ジョブ基盤という題材が、sample-authoring-standard の共通サンプル文脈（駄菓子屋きぬや）に統一されておらず、同標準の禁止事項に抵触している。きぬやの既存記録の移行を題材にして書き直す必要がある。`
- F016 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# データ移行設計 サンプル"`\]: ``H1 が「データ移行設計 サンプル」で、rulebook の「ファイル命名・ID規則」が定める `# データ移行設計: ＜対象名＞` の書式に従っていない。手本になるように対象名を含む書式にする必要がある。``
- F017 \[minor/vp-ux-readability; line=5; anchor=``"本書は受注データの対象別移行設計（`dmd-<term>`）として、抽出・変換・投入・検証方法を定義する最小サンプルである。"``\]: `概要が「最小サンプルである」という自己説明にとどまり、なぜこのデータを移すのか、主要な判断（フル移行、主キー維持、差分0）の理由を初見の読者が把握できない。目的と主要判断を1〜3行で示す必要がある。`
- F018 \[minor/vp-ux-language-consistency; line=20; anchor=`"| order_item.order_id | order_items.order_id | orders投入後に投入（参照整合） |"`\]: ``旧 `order_item` から新 `order_items` へのテーブル名変更が変換/補足に明記されておらず、表記ゆれと誤読される。名称変更であることを補足する必要がある。``
- F019 \[minor/vp-ops-release-readiness; line=9; anchor=`"| 対象       | 期間/抽出条件   | 方式（フル/増分） | 増分基準（カラム/キー/基準時刻） | 概算件数  | 備考       |"`\]: `共通サンプル文脈との不整合が未解決のままで、ready 化の前提を満たしていない。題材を修正してから昇格を判断する必要がある。`

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
