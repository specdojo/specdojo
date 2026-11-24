---
specdojo:
  id: prj-0001:xep-t-kata-wave-4-trc-requirements-to-specs-sample-050-20261123t185906z-abcbaf6e
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-4-trc-requirements-to-specs-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: sample-maintenance
  targets:
    - specdojo:trc-requirements-to-specs-sample
    - specdojo:trc-requirements-to-specs-sample
---

# Edit Plan: T-KATA-WAVE-4-trc-requirements-to-specs-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: トレーサビリティ（要求→仕様）の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、要求から仕様へのトレーサビリティの完成例を示す
- `path`: `docs/ja/specdojo/samples/trc-requirements-to-specs-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-4-trc-requirements-to-specs-sample-050/T-KATA-WAVE-4-trc-requirements-to-specs-sample-050-20261123T185906Z-abcbaf6e/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/trc-requirements-to-specs-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 仕様を書く人と読む人の利用者視点から、文書体系への要求、利用場面、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 主要な定義・判断がどの対象者のどの業務課題・期待価値に応えるかを説明でき、主要な成果・方針がその目的に対応しているか。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、合意対象が読み取れるか。文書を確かめる・承認する役割の割り当ては本文に求めない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=5; anchor=`"本書は、駄菓子屋の販売管理システムにおける主要要求と対応仕様の関係を可視化し、要求漏れ・仕様漏れを防ぐためのトレーサビリティを示す。対象は 2026 年度第 1 リリースで扱う会計、在庫、値引き、監査の要求と仕様とする。"`\]: `目的と適用範囲に、本ビューを誰がどのレビュー・変更判断（仕様レビュー時の要求漏れ検出など）で使うかが書かれておらず、rulebook の判断基準「誰がどのレビュー・変更判断に使うか」を満たしていない。`
- F002 \[minor/vp-po-decision-readiness; line=31; anchor=``"優先対応は `req-r1-004`（法令・監査影響）および `req-r1-002`（運用継続性影響）とする。"``\]: `優先対応とする判断や NFR との合意を誰が承認・判断するのかが書かれておらず、未決事項の判断者が読み取れない。`
- F003 \[minor/vp-pm-plan-feasibility; line=37; anchor=``"| req-r1-002 | 障害時の再送仕様が未確定             | IF 仕様に再送条件と重複排除条件を追記する    | IF 設計担当 | 2026-05-10 | `ifx-msg-stock` に再送節が追加される   |"``\]: `ギャップの担当が「IF 設計担当」「アーキ担当」という通称で、メンバー定義の Role code になっておらず、割り当てと進捗確認に使えない。`
- F004 \[minor/vp-pm-dependency-risk; line=21; anchor=`"| req-r1-004 | 監査ログを 1 年保持する          | bes-audit-log                       | 未着手   | _UNDECIDED_: 保持先ストレージ方針が未決定 | NFR 側と整合確認が必要     |"`\]: `` `req-r1-004` が依存する NFR 側の文書 ID が示されておらず `based_on` にも含まれないため、依存先と影響範囲を辿れない。 ``
- F005 \[minor/vp-pm-control-reporting; line=35; anchor=`"| 要求ID     | ギャップ内容                         | 解消方針                                     | 担当        | 期限       | 判定条件                               |"`\]: `ギャップの担当・期限を本ビュー内で管理しており、rulebook が求める登録簿（PJR）での追跡への転記先・参照が示されていない。`
- F006 \[minor/vp-ba-business-value; line=5; anchor=`"本書は、駄菓子屋の販売管理システムにおける主要要求と対応仕様の関係を可視化し、要求漏れ・仕様漏れを防ぐためのトレーサビリティを示す。対象は 2026 年度第 1 リリースで扱う会計、在庫、値引き、監査の要求と仕様とする。"`\]: `要求漏れ・仕様漏れを防ぐことでどの関係者のどの業務リスクを下げるかが書かれておらず、本ビューの期待価値を説明できない。`
- F007 \[minor/vp-ba-requirements-completeness; line=12; anchor=``"- 対象外: 次期リリース要求（`req-r2-*`）は対象外とする"``\]: ``対象外（次期リリース要求 `req-r2-*`）に理由が書かれておらず、rulebook の「対象外（理由付き）」の受入条件を満たしていない。``
- F008 \[minor/vp-ba-stakeholder-clarity; line=5; anchor=`"本書は、駄菓子屋の販売管理システムにおける主要要求と対応仕様の関係を可視化し、要求漏れ・仕様漏れを防ぐためのトレーサビリティを示す。対象は 2026 年度第 1 リリースで扱う会計、在庫、値引き、監査の要求と仕様とする。"`\]: `本ビューの利用者・確認者（仕様レビュー担当や PO など）が書かれておらず、誰が何に合意するのかが読み取れない。`
- F009 \[major/vp-arc-technical-constraints; line=7; anchor=`"## 2. トレース対象の前提"`\]: ``トレース対象の前提に生成手段（コマンドまたは手順）、生成日、`relations.satisfies` からの導出が書かれておらず、rulebook の禁止事項「生成元と生成手段を書かずに表を示す」に抵触している。``
- F010 \[major/vp-dev-implementation-readiness; line=38; anchor=``"| req-r1-004 | 監査ログ保持先ストレージ方針が未決定 | NFR 要件と合意し、保持先と保持期間を確定する | アーキ担当  | 2026-05-15 | `bes-audit-log` に保持方針が追記される |"``\]: `` `req-r1-004` の解消方針に、`bes-audit-log` の `relations.satisfies` へ要求 ID を持たせる変更と、再生成で `充足` になることを判定条件にすることが書かれておらず、生成元の成果物で行う作業と完了条件が読み取れない。 ``
- F011 \[minor/vp-dev-change-impact; line=40; anchor=`"## 6. 変更履歴と更新ルール"`\]: `変更履歴と更新ルールに生成日と前回から充足状況が変わった要求 ID が書かれておらず、rulebook の判断基準を満たしていない。`
- F012 \[minor/vp-dev-testability; line=37; anchor=``"| req-r1-002 | 障害時の再送仕様が未確定             | IF 仕様に再送条件と重複排除条件を追記する    | IF 設計担当 | 2026-05-10 | `ifx-msg-stock` に再送節が追加される   |"``\]: `ギャップの判定条件が生成元への追記の有無だけで、再生成したマトリクスで充足状況が変わることを確かめる検証手順になっていない。`
- F013 \[major/vp-qe-verifiability; line=21; anchor=`"| req-r1-004 | 監査ログを 1 年保持する          | bes-audit-log                       | 未着手   | _UNDECIDED_: 保持先ストレージ方針が未決定 | NFR 側と整合確認が必要     |"`\]: `` `req-r1-004` は対応仕様 `bes-audit-log` があるのに充足状況が `未着手` で、「充足状況の判定」（`未着手` は対応仕様がない場合）と矛盾し、`充足` 行の備考にも参照先 `status` の根拠がない。 ``
- F014 \[major/vp-qe-omissions-consistency; line=14; anchor=`"## 3. トレースマトリクス"`\]: ``どの要求にも対応しない仕様の行・別表がなく、`based_on` の `bes-product-master` がマトリクスに現れないため、仕様漏れ（対応先のない仕様）を識別できない。``
- F015 \[major/vp-qe-kata-conformance; line=3; anchor=`"## 1. 目的と適用範囲"`\]: ``Frontmatter の `based_on` と本文のトレースマトリクスで参照されている仕様 ID が不整合である。``
- F016 \[major/vp-qe-kata-conformance; line=35; anchor=`"| 要求ID     | ギャップ内容                         | 解消方針                                     | 担当        | 期限       | 判定条件                               |"`\]: `ギャップと対応方針に担当・期限列があり、rulebook の「担当・期限は登録簿で追跡し、本ビューに列を設けません」に反している。`
- F017 \[major/vp-qe-kata-conformance; line=44; anchor=`"- 更新時は備考欄に参照チケット ID を追記する。"`\]: `更新ルール「備考欄に参照チケット ID を追記する」は生成ビューの手編集を前提とし、rulebook の派生ビューの位置づけと禁止事項「生成した表を手編集」に反している。`
- F018 \[minor/vp-qe-kata-conformance; line=10; anchor=``"- 仕様参照元: 業務受入条件 `bac-*`、外部 IF 仕様 `ifx-*`、業務仕様 `bes-*`"``\]: ``仕様参照元に `bac-*` を含めているが、rulebook の位置づけでは `bac-*` は要求（業務の受入基準）であり、要求と仕様の区分が rulebook と食い違っている。``
- F019 \[minor/vp-ux-readability; line=9; anchor=``"- 要求参照元: 要求一覧 `req-2026-r1`"``\]: ``要求参照元 `req-2026-r1` とマトリクスの要求 ID `req-r1-*` の ID 体系の関係が説明されておらず、生成元と各行の対応が読み取りにくい。``
- F020 \[minor/vp-ux-language-consistency; line=19; anchor=`"| req-r1-002 | 在庫引当をリアルタイムで更新する | bes-stock-allocation, ifx-msg-stock | 一部充足 | _TODO_: 障害時の再送仕様が未確定          | 再送方針は IF 仕様で検討中 |"`\]: ``ギャップ欄に rulebook で指定された `_UNDECIDED_:` ではなく `_TODO_:` が使用されており、語彙が統一されていない。``
- F021 \[minor/vp-ux-language-consistency; line=38; anchor=``"| req-r1-004 | 監査ログ保持先ストレージ方針が未決定 | NFR 要件と合意し、保持先と保持期間を確定する | アーキ担当  | 2026-05-15 | `bes-audit-log` に保持方針が追記される |"``\]: `担当表記「アーキ担当」「IF 設計担当」が通称で、Role code による表記に統一されていない。`
- F022 \[minor/vp-ops-operability; line=42; anchor=`"- 要求または仕様の更新が入った場合、同一レビュー単位で本トレースを更新する。"`\]: `更新ルールに再生成の手順（コマンドまたは手順）と再生成後の照合方法がなく、継続更新を再現可能な形で運用できない。`

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
