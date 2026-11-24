---
specdojo:
  id: prj-0001:xep-t-kata-wave-4-nfr-reliability-sample-050-20261123t130923z-9019bdc7
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-4-nfr-reliability-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:nfr-reliability-sample
    - specdojo:nfr-reliability-sample
---

# Edit Plan: T-KATA-WAVE-4-nfr-reliability-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 信頼性要件の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、信頼性要件の完成例を示す
- `path`: `docs/ja/specdojo/samples/nfr-reliability-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-4-nfr-reliability-sample-050/T-KATA-WAVE-4-nfr-reliability-sample-050-20261123T130923Z-9019bdc7/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/nfr-reliability-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=5; anchor=`"本書は、障害抑止と誤動作防止を定義するための最小サンプルである。"`\]: `ハイレベルな目的は述べられていますが、対象システムのスコープの境界、優先順位、および期待される成果が定義されていません。`
- F002 \[major/vp-po-decision-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項のセクションでは、決定権者、基準、影響、または具体的な次のアクションを指定することなく、要件の詳細を後回しにしています。`
- F003 \[minor/vp-po-publication-accountability; line=5; anchor=`"本書は、障害抑止と誤動作防止を定義するための最小サンプルである。"`\]: `ドキュメントには、ステータスを draft から ready へ移行するための人間の承認責任や所有権が定義されていません。`
- F004 \[major/vp-pm-plan-feasibility; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `作業単位、完了基準、担当ロールコード、およびタイムラインが完全に欠落しており、タスクの分解と見積もりができません。`
- F005 \[major/vp-pm-dependency-risk; line=11; anchor=``"- 参照: `../rulebooks/nfr-reliability-rulebook.md`"``\]: `関連する成果物に対する下流への依存関係、スケジュールの影響、およびリスクが特定されていません。`
- F006 \[major/vp-pm-dependency-risk; line=11; anchor=``"- 参照: `../rulebooks/nfr-reliability-rulebook.md`"``\]: ``rulebook の「関連ドキュメント導線」が必須とする `nfr-index`・`sac-*`・`opr-*`・`dec-*` への導線がなく、信頼性要件の検証先と障害時運用への接続を示せていないため、導線の章を追加すべきです。``
- F007 \[minor/vp-pm-control-reporting; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決の課題が、報告先、対応方針、または割り当てられたロールコードなどの追跡属性なしにリストされています。`
- F008 \[major/vp-ba-business-value; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `ドキュメントでは、具体的なビジネス上の課題、障害による運用への影響、または対象システムの期待されるビジネス価値について説明されていません。`
- F009 \[blocker/vp-ba-requirements-completeness; line=15; anchor=`"- 主な内容: 故障率、平均故障間隔(MTBF)、エラー率、データ検証ルール"`\]: `要件、受け入れ基準、および明示的なスコープの境界が完全に欠落しており、ハイレベルなトピックのタイトルのみが残っています。`
- F010 \[major/vp-ba-stakeholder-clarity; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `ステークホルダー、ユースケース、レビューア、および対象となる合意当事者が、抽象的なプレースホルダー以外に指定されていません。`
- F011 \[major/vp-arc-technical-constraints; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: `技術的な制約、外部依存関係、稼働時間、およびアーキテクチャの前提条件が指定されていません。`
- F012 \[minor/vp-arc-conciseness; line=22; anchor=`"| ドキュメント | [非機能要件 / 信頼性](../rulebooks/nfr-reliability-rulebook.md) | 最小サンプル                         |"`\]: `セクション 3 とセクション 4 は、独自の情報を追加することなく、目的と主要なトピックに関する全く同じ説明を重複して記載しています。`
- F013 \[major/vp-dev-implementation-readiness; line=15; anchor=`"- 主な内容: 故障率、平均故障間隔(MTBF)、エラー率、データ検証ルール"`\]: `具体的なパラメータ、閾値、および実装の制約が提供されていないため、開発者が信頼性メカニズムを実装することができません。`
- F014 \[minor/vp-dev-change-impact; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `信頼性の要件が更新された際の、既存のコンポーネントへの変更の影響や影響範囲が記述されていません。`
- F015 \[major/vp-dev-testability; line=15; anchor=`"- 主な内容: 故障率、平均故障間隔(MTBF)、エラー率、データ検証ルール"`\]: `信頼性の要件に関する検証コマンド、期待されるテスト結果、およびバリデーション手順が完全に省略されています。`
- F016 \[major/vp-qe-verifiability; line=16; anchor=`"- 必須観点: 対象、条件、判定基準、責任者"`\]: `信頼性要件に必須とされる測定可能な指標（数値基準など）や検証方法が具体的に記述されておらず、合否判定不可能な状態である。`
- F017 \[blocker/vp-qe-omissions-consistency; line=6; anchor=`""`\]: `ルールブック第5章で定義された必須構成（概要、適用範囲、要件一覧、検証方法、導線）に準拠していない。`
- F018 \[minor/vp-qe-omissions-consistency; line=1; anchor=`"# [非機能要件 / 信頼性](../rulebooks/nfr-reliability-rulebook.md) サンプル"`\]: ``H1 にルールブックへの相対 Markdown リンクが埋め込まれており、タイトルとして不適切なため、H1 は成果物名のみとし、rulebook との対応は Frontmatter の `rulebook` に委ねるべきです。``
- F019 \[blocker/vp-qe-kata-conformance; line=6; anchor=`""`\]: `信頼性要件の具体例を示すべきサンプルでありながら、形式的な要約に留まっており、ルールブックを適用した成果物の正解例となっていない。`
- F020 \[major/vp-qe-kata-conformance; line=22; anchor=`"| ドキュメント | [非機能要件 / 信頼性](../rulebooks/nfr-reliability-rulebook.md) | 最小サンプル                         |"`\]: `rulebook の「サンプル」章にある輪郭の最小例（要件一覧・測定方法表を含む）より sample の内容が乏しく、「完成例は sample を正とする」という Kata 間の役割分担が逆転しているため、sample を rulebook の最小例以上の完成例へ拡充すべきです。`
- F021 \[major/vp-ux-readability; line=6; anchor=`""`\]: `具体的かつ実用的な記述パターンが示されていないため、作成者が参照して模倣できるサンプルとして機能していない。`
- F022 \[minor/vp-ux-language-consistency; line=15; anchor=`"- 主な内容: 故障率、平均故障間隔(MTBF)、エラー率、データ検証ルール"`\]: `指標名を「故障率」と記載しているが rulebook は「障害率（処理失敗・異常終了の発生割合）」に統一しているため、用語を rulebook に揃えるべきです。`
- F023 \[minor/vp-ops-release-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `ドキュメントのステータスを draft から ready へ移行するための条件と基準が定義されていません。`
- F024 \[minor/vp-ops-operability; line=5; anchor=`"本書は、障害抑止と誤動作防止を定義するための最小サンプルである。"`\]: `ドキュメントを更新するためのメンテナンス手順、連絡先、および担当ロールコードが文書化されていません。`

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
