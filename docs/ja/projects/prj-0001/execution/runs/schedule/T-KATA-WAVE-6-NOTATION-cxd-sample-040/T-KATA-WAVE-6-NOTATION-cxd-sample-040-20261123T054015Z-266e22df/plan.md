---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-notation-cxd-sample-040-20261123t054015z-266e22df
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-NOTATION-cxd-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - specdojo:cxd-sample
    - specdojo:cxd-rulebook
---

# Edit Plan: T-KATA-WAVE-6-NOTATION-cxd-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: C4 コンテキスト図の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、C4 コンテキスト図の完成例を示す
- `path`: `docs/ja/specdojo/samples/cxd-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-NOTATION-cxd-sample-040/T-KATA-WAVE-6-NOTATION-cxd-sample-040-20261123T054015Z-266e22df/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/cxd-rulebook.md`
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

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-arc-conciseness; line=12; anchor=``"- 内部コンテナ分割は C4 コンテナ図（`cnd`）、内部コンポーネント構造は C4 コンポーネント図（`cpd`）、実行環境・ネットワーク配置はインフラ構成図（`ifd`）、採用技術一覧は技術スタック一覧（`tsd-index`）、外部連携や操作の詳細は外部インターフェース仕様（`ifx-*`）や CLI 仕様（`clis`）・画面仕様（`uis`）を正本とし、CXD には境界判断に必要な要点と参照先だけを残します。"``\]: `The opening policy bullet repeats the document-by-document delegation mapping already provided in “正本の選び方と参照の境界”; replace this enumeration with a reference to that section, retaining the boundary-summary principle and preserving all mapping details in the table.`
- F002 \[minor/vp-dev-testability; line=159; anchor=`"## 8. 運用ルール"`\]: ``Add a validation instruction or a direct reference for checking CXD Mermaid syntax after edits, including a supported command such as `npm run lint:mermaid — ＜document-path＞` and the requirement for no syntax errors or unchecked diagrams; the current guidance covers diagram content but provides no Mermaid validation procedure.``

### 成果物から届いた Kata が原因の finding

- source=condense; result=`prj-0001:xer-t-kata-wave-1-cxd-specdojo-080-20261114t124526z-e35312ed`; document=`cxd-specdojo`; location=`## 1. 概要 (L18-23) と ## 3.2. Person（人・ロール） (L73-77)`; category=`repetition`; action=`retain`; reason=`1章の表は文書読者（ステークホルダー）ごとの確認観点を示し、3.2節の表はシステム利用アクター（Person）としての利用目的と境界上の確認責務を定義しており、対象読者とモデル要素で目的・役割が異なるため保持する。`; cause=kata:rulebook; location=`1.1 / 6.3.2`
- source=condense; result=`prj-0001:xer-t-kata-wave-1-cxd-specdojo-080-20261114t124526z-e35312ed`; document=`cxd-specdojo`; location=`## 1. 概要 (L16)、## 3.1. 対象システムとシステム境界 (L67)、## 4.1. 技術前提・制約 (L105)、## 4.2. システム境界・外部依存の検証観点 (L114)`; category=`repetition`; action=`retain`; reason=`概要における人間責任とシステム責任の基本分界、境界定義における委譲先、draft/ready昇格自動化禁止という技術制約、下流検証設計へ渡す確認観点として、各節で固有の判断・合意の役割を担っており判断情報を損なわないため保持する。`; cause=kata:rulebook; location=`6.1 / 6.3.1 / 6.4`
- source=condense; result=`prj-0001:xer-t-kata-wave-1-cxd-specdojo-080-20261114t124526z-e35312ed`; document=`cxd-specdojo`; location=`## 2. C4コンテキスト図（Mermaid） (L56)`; category=`figure-prose`; action=`retain`; reason=`図の矢印関係を文章でなぞる記述ではなく、矢印の向きの意味（主たる利用方向、応答の省略）および複合ノード（Git / GitHub）の意図を補足する図の読解に必要な注記（Rulebook 6.2 準拠）であるため保持する。`; cause=kata:rulebook; location=`6.2`
- source=condense; result=`prj-0001:xer-t-kata-wave-1-cxd-specdojo-080-20261114t124526z-e35312ed`; document=`cxd-specdojo`; location=`## 3.1. 対象システムとシステム境界 (L69) と ## 5. メモ / 将来課題 (L122)`; category=`repetition`; action=`retain`; reason=`3.1節のASSUMPTIONでは境界定義の前提となるローカル実行仮定を明示し、5章では下位C4図・インフラ図整備時に実行境界を照合して仮定を更新する将来課題・引き継ぎ先として管理しており、仮定の宣言と課題管理で役割が分担されているため保持する。`; cause=kata:rulebook; location=`6.3.1 / 6.5`
- source=condense; result=`prj-0001:xer-t-kata-wave-1-cxd-specdojo-080-20261114t124526z-e35312ed`; document=`cxd-specdojo`; location=`## 3.3. External Software System（外部システム） (L88)`; category=`unneeded-background`; action=`retain`; reason=`目的に不要な背景ではなく、同一端末実行時でも責務を境界外に置くアーキテクチャ境界判断の根拠、および異常時保証を連携契約へ委ねる責任分界の限定を明記する必須情報であるため保持する。`; cause=kata:rulebook; location=`6.3.3`
- source=condense; result=`prj-0001:xer-t-kata-wave-1-cxd-specdojo-080-20261114t124526z-e35312ed`; document=`cxd-specdojo`; location=`## 3.4. Relationship（関係・連携契約） (L92-98)`; category=`canonical-restatement`; action=`retain`; reason=`CLI構文やコマンド引数・外部IF電文の詳細を再掲せず、概要の要点のみを示して既存の正本（CLIコマンドリファレンス、実行制御コマンド群CLI仕様、外部コマンド連携仕様等）への参照に留めているため、適切な参照関係として保持する。`; cause=kata:rulebook; location=`6.3.5 / 7`

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の rulebook を読み込み、現状の章構成・必須項目・禁止事項・判定基準を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 rulebook の frontmatter から辿れる recipe / sample / template、`併せて適用する rulebook`、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが成果物の実態と合っているかを見直す。
5. 成果物側で繰り返し守られていない規定は、規定が過剰なのか成果物側の不備なのかを判断し、根拠とともに rulebook へ反映するか result に記録する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した rulebook は [[specdojo:rulebook-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従う。recipe / sample / template と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な rulebook メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 rulebook から辿れる関連文書、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で rulebook を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の rulebook が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って rulebook を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

## 変更範囲による実行待ち

- 2026-11-23T05:30:04.685Z: `T-KATA-WAVE-6-NOTATION-cxd-sample-040` は `T-KATA-WAVE-6-PROJECT-prj-overview-sample-040` の統合を待った。重複: `project:cause.location <> project:cause.location`。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
