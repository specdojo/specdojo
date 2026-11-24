---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-opr-sample-060-20261123t104424z-82c8ccaa
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-opr-sample-060
  name: "template を rulebook に合わせる"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: template-maintenance
  targets:
    - specdojo:opr-sample
    - specdojo:opr-template
---

# Edit Plan: T-KATA-WAVE-5-opr-sample-060

## 1. このフェーズで行うこと

直した rulebook と厚くした sample に沿って template を同期する。骨組みに責務を絞り、必須の章・項目・表の列名をそろえ、説明や完成例を写さない。rulebook と sample はこの段で変更しない。template が not-needed・undecided なら変更せず、その旨を result に書いて完了する。
PJR-76N9 の決まりに従い、文書の役割の割り当てと承認の進み具合の記入欄を置かない。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用手順の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、運用手順の完成例を示す
- `path`: `docs/ja/specdojo/samples/opr-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-opr-sample-060/T-KATA-WAVE-5-opr-sample-060-20261123T104424Z-82c8ccaa/result.md`

編集対象（rulebook frontmatter の template 宣言から解決）:

- `kind`: template
- `path`: `docs/ja/specdojo/templates/opr-template.md`
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

参照の向きを「成果物 → template」に切り替え、対象成果物に紐づく template を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=26; anchor=`"| 優先度 | 初動目標 | 切り分け | 一次対応 | 復旧   | エスカレーション |"`\]: `エスカレーション条件と意思決定者、および該当する場合は停止またはロールバックの基準と承認者に関する指示または項目を追加してください。現在のインシデントテーブルはエスカレーション先のみで完成できてしまい、ルールブックのセクション6.4で要求されている決定事項が未指定のままになっています。`
- F002 \[minor/vp-pm-plan-feasibility; line=38; anchor=`"_TODO_: バックアップ確認、リストア、演習の順に、実施条件、完了条件、証跡を記述する。RTO / RPO がある場合は達成可否の判定方法を含める。"`\]: `ルールブックのセクション6.6で要求されているリストア演習の頻度を明示的に要求してください。実行条件だけでは定期的なスケジュールは確立されないため、作成者はリカバリ演習をスケジュール可能なものにすることなく、このセクションを完成させることができます。`
- F003 \[minor/vp-pm-dependency-risk; line=46; anchor=`"| 変更種別 | 承認者 | 実施条件 | 完了条件 | ロールバック条件 | 証跡   |"`\]: `ルールブックのセクション6.8の要求に従い、重大な変更に事前通知が必要かどうか、およびその通知方法を記録するためのプロンプトを追加してください。既存の承認および実行条件のフィールドでは、この調整の依存関係を明示的に捉えることができません。`
- F004 \[minor/vp-dev-implementation-readiness; line=46; anchor=`"| 変更種別 | 承認者 | 実施条件 | 完了条件 | ロールバック条件 | 証跡   |"`\]: `実行手順のフィールドを追加するか、セクション8で維持されている変更指示への明示的な参照を追加してください。変更の種類、承認、実行条件、完了基準、ロールバック条件、およびエビデンスはすべて、変更の実行方法を指定することなく記入できてしまい、ルールブックの再現性の目的を損なっています。`
- F005 \[minor/vp-qe-omissions-consistency; line=68; anchor=`"| _TODO_ | _TODO_          | _TODO_ | _TODO_ |"`\]: ``セクション12において、ルールブックのセクション6.12では、運用ポリシーとの不一致を防ぐために `opd-index` への必須リンクが明示的に要求されていますが、テンプレートのテーブルには、作成者に `opd-index` を含めるよう指示することなく、一般的な `_TODO_` のプレースホルダーのみが提供されています。``
- F006 \[minor/vp-qe-omissions-consistency; line=66; anchor=`"| 種別   | ドキュメント ID | 目的   | 備考   |"`\]: ``ルールブックのセクション6.12の要求に従い、別の巻が存在しない場合は `（本書のみ）` または `（なし）` と記載する指示を追加してください。一般的な関連文書のテーブルでは、意図的に巻が存在しない場合と、参照が漏れている場合を区別できません。``
- F007 \[minor/vp-qe-kata-conformance; line=5; anchor=``"_TODO_: `_DELIVERABLE_OVERVIEW_` を基に、対象となる運用作業と、この手順によって再現可能にする結果を記述する。`opr-<term>` の場合は `opr-index` のどの共通規約を参照し、何を具体化する文書かを明示する。"``\]: ``セクション1では、`opr-＜term＞` の成果物を作成する作成者に対し、ルールブックのセクション5の要求に従って、すべての必須セクションを保持し、該当しないものには理由と共に `なし`、`opr-index 参照`、または `本書の範囲外` と記載するように指示していません。``
- F008 \[minor/vp-ops-operability; line=32; anchor=`"| 段階   | 手順   | 完了条件 | 証跡   |"`\]: `ルールブックのセクション6.5の要求に従い、クローズ基準やしきい値の調整または抑制を含む、誤検知（false-positive）の取り扱いに関する明示的なプロンプトまたは行を追加してください。一般的なステージテーブルは、確認、一時的な対応、および恒久的な対応だけで完成できてしまい、誤検知の操作が定義されないままになっています。`

### 成果物から届いた Kata が原因の finding

- source=condense; result=`prj-0001:xer-pjr-df38-20261104t143905z-e48dd61f`; document=`opr-agent-cli-update`; location=`H1直下の導入文（13行目）と ## 1. 概要（agent-cli-update）（17行目）`; category=`repetition`; action=`merge`; reason=`H1直下の導入文と## 1. 概要が目的・対象の記述で重複していたため、## 1. 概要へ統合して文脈と目的・対象の記述をすべて維持した。`; cause=kata:template; location=``docs/ja/specdojo/templates/opr-template.md:18-23 (`_DELIVERABLE_OVERVIEW_` と ## 1. 概要 の二重配置)``

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の template を読み込み、現状の章構成の骨組みとプレースホルダの配置・網羅性を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 template の frontmatter から辿れる rulebook / recipe / sample、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが成果物作成の開始点として適切かを見直す。
5. 成果物間で共通する定型部分は雛形の本文に取り込み、成果物ごとに内容が異なる部分は _TODO_ などのプレースホルダとして配置する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した template は [[specdojo:template-authoring-standard]]（構成・プレースホルダ規約・禁止事項の正本）に従う。rulebook / recipe / sample と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な template メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 template から辿れる rulebook / recipe / sample、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で template を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の template が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って template を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
