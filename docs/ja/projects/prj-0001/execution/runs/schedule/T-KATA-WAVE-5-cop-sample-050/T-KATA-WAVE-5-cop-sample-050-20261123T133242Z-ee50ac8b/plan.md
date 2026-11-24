---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-cop-sample-050-20261123t133242z-ee50ac8b
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-cop-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: sample-maintenance
  targets:
    - specdojo:cop-sample
    - specdojo:cop-sample
---

# Edit Plan: T-KATA-WAVE-5-cop-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: カットオーバー計画（対象別）の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、カットオーバー計画の対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/cop-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-cop-sample-050/T-KATA-WAVE-5-cop-sample-050-20261123T133242Z-ee50ac8b/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/cop-sample.md`
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

- F001 \[major/vp-po-purpose-alignment; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `ドキュメントには、具体的な切り替え目標、スコープの境界、および対象システムの切り替えに関する正当性が欠けています。`
- F002 \[major/vp-po-decision-readiness; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `ドキュメントには、具体的なGO/NO-GOの意思決定ポイント、意思決定者、および基準が欠けており、実際の実プロジェクトで具体化されるべき曖昧で未解決の問題のみが示されています。`
- F003 \[minor/vp-po-publication-accountability; line=1; anchor=`"# カットオーバー計画（本番切替手順） サンプル"`\]: `ドキュメントには、切り替え実行に対する人間のPOによる最終承認権限と責任が明確に指定されていません。`
- F004 \[major/vp-pm-plan-feasibility; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `ドキュメントには、切り替えスケジュールの策定に必要な実行タスク、分単位のタイムラインの順序、完了条件、および所要時間の見積もりが完全に欠けています。`
- F005 \[major/vp-pm-dependency-risk; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `事前の移行成果物に対する運用上の依存関係や、切り替えの失敗またはスケジュール超過に関連するリスクが特定されていません。`
- F006 \[major/vp-pm-control-reporting; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `ドキュメントには、報告ライン、責任のあるRoleコード、およびリスク、イシュー、またはプロジェクトジャーナルの記録のための分離された追跡項目が欠けています。`
- F007 \[major/vp-ba-business-value; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `ドキュメントには、ビジネスの運用ウィンドウ、ダウンタイムの制約、または対象となる店舗システムに対する期待されるビジネス価値と影響が記載されていません。`
- F008 \[major/vp-ba-requirements-completeness; line=15; anchor=`"- 主な内容: 対象固有の切替手順、判定ポイント、ロールバック手順、責務分担"`\]: `ユーザーおよびオペレーターの観点から、切り替えの前提条件、受け入れ基準、および特定のインスコープ/アウトオブスコープの運用境界が欠落しています。`
- F009 \[major/vp-ba-stakeholder-clarity; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `ステークホルダー、切り替えオペレーター、ビジネス検証者、および通知の受信者が完全に省略されています。`
- F010 \[major/vp-arc-technical-constraints; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `切り替えのための技術的な制約、インフラの前提条件、システムの依存関係、および検証手順が完全に省略されています。`
- F011 \[minor/vp-arc-conciseness; line=20; anchor=`"| 項目         | 値                                                           | 備考                                 |"`\]: `セクション4は、具体的な運用の意思決定を追加することなく、セクション1とセクション3の一般的な記述を表形式で重複させているだけです。`
- F012 \[major/vp-dev-implementation-readiness; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `ドキュメントには、切り替え変更の実行に必要な運用コマンド、設定、対象ファイル、または完了条件が提供されていません。`
- F013 \[major/vp-dev-change-impact; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `既存の運用システム、スキーマ、インターフェース、およびサービスのダウンタイムに対するシステム切り替えの影響が特定されていません。`
- F014 \[major/vp-dev-testability; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `切り替え後の検証手順、スモークテストケース、期待される結果、およびロールバックの検証チェックが完全に欠落しています。`
- F015 \[major/vp-qe-verifiability; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `最小記述例の「値」が抽象的な説明に留まっており、ルールブックが求める「分単位の時刻」や「具体的判定基準」などの検証可能な表現を提示できていない。`
- F016 \[blocker/vp-qe-omissions-consistency; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `ルールブックで必須とされている本文構成（見出し1〜10）がすべて欠落しており、成果物としての最低限の構成を満たしていない。`
- F017 \[minor/vp-qe-omissions-consistency; line=11; anchor=``"- 参照: `../rulebooks/cop-rulebook.md`"``\]: ``参照が相対パス `../rulebooks/cop-rulebook.md` で書かれており、Frontmatter の `rulebook` 宣言と重複している。本文の参照は削除するか、id 基準の wikilink に置き換えるべきである。``
- F018 \[blocker/vp-qe-kata-conformance; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `サンプルとしての責務（完成例の提示）を果たしておらず、ルールブックで定義された構造や記述ガイドを完全に無視した内容となっている。`
- F019 \[major/vp-qe-kata-conformance; line=23; anchor=`"| 目的         | 当日作業の対象別詳細手順を定義する                           | specdojo:deliverables-reference 準拠 |"`\]: ``目的の備考が `specdojo:deliverables-reference` 準拠となっており、ルールブックが正本と定める `cop-index`・`mip-index` との責務境界に整合していない。また共通サンプル文脈（駄菓子屋きぬやの店頭タブレット・店番体制）も反映されていない。``
- F020 \[major/vp-ux-readability; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `初見の読者が本サンプルを参考にしても、ルールブックが規定する切替計画の具体的な記述方法（タイムラインや判定ポイント等）を理解することができず、ガイドとして機能していない。`
- F021 \[minor/vp-ux-language-consistency; line=5; anchor=``"本書は、対象別カットオーバー計画（`cop-<term>`）として、当日作業の詳細手順を定義する最小サンプルである。"``\]: ``サンプルなのに `cop-＜term＞` がプレースホルダのまま使われ、具体的な id（例: `cop-cutover-day`）になっていない。「handbook の共通方針」も参照先が特定できないため、用語を具体化すべきである。``
- F022 \[major/vp-ops-release-readiness; line=28; anchor=`"| 論点           | 処理方針                 |"`\]: `ドラフトから準備完了への移行のための前提条件と基準が明確に定義されておらず、抽象的な未解決の問題だけが残されています。`
- F023 \[major/vp-ops-operability; line=9; anchor=`"- 対象: 駄菓子屋の販売管理システム"`\]: `ドキュメントには、継続的なメンテナンスおよび緊急対応のための運用上のエスカレーション手順、連絡手段、および変更管理のワークフローが欠けています。`

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
