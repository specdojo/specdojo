---
specdojo:
  id: prj-0001:xep-t-kata-slim-2-cxd-specdojo-040-20261118t042028z-f6e26535
  type: exec-plan
  rulebook: none
  task_id: T-KATA-SLIM-2-cxd-specdojo-040
  name: "rulebook から運用の記述を外す"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: rulebook-maintenance
  targets:
    - cxd-specdojo
    - specdojo:cxd-rulebook
---

# Edit Plan: T-KATA-SLIM-2-cxd-specdojo-040

## 1. このフェーズで行うこと

対応する rulebook から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照にする。 手本は sld の試行（[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の対応結果の「他の型へ広げるときの一覧」）と、 改訂済みの [[specdojo:sld-rulebook|sld-rulebook]] である。 外す記述: 役割の表と役割の段落、status の draft 維持・ready 昇格・PO の承認・agent の禁止・公開の承認条件・改訂と廃止の手順、 文書品質の検査（prettier・lint・見出し・wikilink）を業務の検証や受入条件に入れること、未決事項の表の管理台帳の区分・担当・判断時期・追跡先の列と台帳への登録の段落、 本文要件の言い直しだけの用語の表、共通規約と同じ禁止事項。 残す記述: その型固有の判断基準と区分、標準の列と章の受入条件、良い例・悪い例、型固有の禁止事項、業務の受入確認の手順と合格条件、未決事項の論点と影響。 参照の形: 全体方針に「共通の運用」を 1 項目だけ置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] を参照する。 章名と必須・条件付きの区分は、既存の成果物との対応を保つため原則として変えない。変える場合は理由を result に書く。 大きさは、空白を除いた文字数で今の 8 割以下を目安にし、前後の文字数を result に書く。成果物本体は変更しない。 共通の正本に足りない記述があれば、rulebook ではなく変更案として result に書く。 この段で直すのは rulebook だけとする。recipe・template・sample は commit の対象外のため変えず、合わせて直すべき点があれば変更案として result に書く。 rulebook が frontmatter の includes で取り込む記法の rulebook（`*-mermaid`・`*-d2` など）があれば、同じ段で同じ一覧に沿って簡潔にする。ただし cdfd-mermaid-rulebook と cdfd-d2-rulebook は cdfd-rulebook の段（cdfd-jibungoto-planet）だけが直し、cdfd-overview と cdfd-uc の段では変えない。非推奨の rulebook（cld・cstd・tml）と、扱いを決める decision がある ntp・dec は変えない。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: C4コンテキスト図（SpecDojo）
- `depends_on`:  -
- `overview`: SpecDojo CLIと、境界外の人・外部システム（AI provider CLI、Git/GitHub）との関係を俯瞰的に定義する
- `path`: `docs/ja/product/030-architecture/010-c4/cxd-specdojo.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-SLIM-2-cxd-specdojo-040/T-KATA-SLIM-2-cxd-specdojo-040-20261118T042028Z-f6e26535/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/cxd-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 仕様を書く人と読む人の利用者視点から、文書体系への要求、利用場面、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 主要な定義・判断がどの対象者のどの業務課題・期待価値に応えるかを説明でき、主要な成果・方針がその目的に対応しているか。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、確認者、合意対象が読み取れるか。

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

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
