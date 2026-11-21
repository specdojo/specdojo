---
specdojo:
  id: prj-0001:xep-t-kata-slim-2-gl-common-040-20261118t013237z-f60edc2a
  type: exec-plan
  rulebook: none
  task_id: T-KATA-SLIM-2-gl-common-040
  name: "rulebook から運用の記述を外す"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: rulebook-maintenance
  targets:
    - gl-common
    - specdojo:gl-rulebook
---

# Edit Plan: T-KATA-SLIM-2-gl-common-040

## 1. このフェーズで行うこと

対応する rulebook から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照にする。 手本は sld の試行（[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の対応結果の「他の型へ広げるときの一覧」）と、 改訂済みの [[specdojo:sld-rulebook|sld-rulebook]] である。 外す記述: 役割の表と役割の段落、status の draft 維持・ready 昇格・PO の承認・agent の禁止・公開の承認条件・改訂と廃止の手順、 文書品質の検査（prettier・lint・見出し・wikilink）を業務の検証や受入条件に入れること、未決事項の表の管理台帳の区分・担当・判断時期・追跡先の列と台帳への登録の段落、 本文要件の言い直しだけの用語の表、共通規約と同じ禁止事項。 残す記述: その型固有の判断基準と区分、標準の列と章の受入条件、良い例・悪い例、型固有の禁止事項、業務の受入確認の手順と合格条件、未決事項の論点と影響。 参照の形: 全体方針に「共通の運用」を 1 項目だけ置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] を参照する。 章名と必須・条件付きの区分は、既存の成果物との対応を保つため原則として変えない。変える場合は理由を result に書く。 大きさは、空白を除いた文字数で今の 8 割以下を目安にし、前後の文字数を result に書く。成果物本体は変更しない。 共通の正本に足りない記述があれば、rulebook ではなく変更案として result に書く。 この段で直すのは rulebook だけとする。recipe・template・sample は commit の対象外のため変えず、合わせて直すべき点があれば変更案として result に書く。 rulebook が frontmatter の includes で取り込む記法の rulebook（`*-mermaid`・`*-d2` など）があれば、同じ段で同じ一覧に沿って簡潔にする。ただし cdfd-mermaid-rulebook と cdfd-d2-rulebook は cdfd-rulebook の段（cdfd-jibungoto-planet）だけが直し、cdfd-overview と cdfd-uc の段では変えない。非推奨の rulebook（cld・cstd・tml）と、扱いを決める decision がある ntp・dec は変えない。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 用語集（共通）
- `depends_on`:  -
- `overview`: 業務・システムで使用する用語の意味を、ドメインを横断して統一的に定義する
- `path`: `docs/ja/product/010-business-specs/060-glossary/gl-common.yaml`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-SLIM-2-gl-common-040/T-KATA-SLIM-2-gl-common-040-20261118T013237Z-f60edc2a/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/gl-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 仕様を書く人と読む人の利用者視点から、文書体系への要求、利用場面、受入条件を整理する。

このロールが重視するレビュー観点:

- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、確認者、合意対象が読み取れるか。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=72; anchor=``"| `status`       | 用語の採用状態。`official` / `deprecated` / `candidate` | 任意 |"``\]: `Define who confirms a candidate term, what evidence supports promotion to official, and how unresolved definitions are returned for clarification; listing statuses alone does not establish the glossary-specific approval decision.`
- F002 \[minor/vp-pm-control-reporting; line=116; anchor=``"- 未確定の内容には共通ラベル（`_TODO_` / `_UNDECIDED_` / `_ASSUMPTION_`）を使い、確定時には解消する。"``\]: `Add the required handoff for persistent unresolved definitions, assumptions, and terminology decisions to the appropriate PJR issue, risk, change, or decision record, identifying the responsible Role code and destination record.`
- F003 \[minor/vp-ba-stakeholder-clarity; line=131; anchor=`"意味の変更・廃止では、共通メタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」に従い、BA が用語 ID を参照するデータ辞書・業務ルール・画面や CLI の用語を洗い出し、DEV が実装、QE がテスト・受入条件の追従を確認する。廃止・確定は PO が判断し、PM が移行作業を管理する。schema にない変更管理項目は YAML に増やさず、個票などの変更記録へ残す。"`\]: `Identify the Role codes responsible for collecting and maintaining terms, confirming business meanings with domain stakeholders, and reviewing affected technical references; project-level maintenance alone does not identify who must participate in agreement.`
- F004 \[minor/vp-arc-conciseness; line=75; anchor=``"必須は `id`・`term`・`definition` の 3 項目とする。任意項目は説明に必要なものだけ記載し、用語の `status` とルートの文書成熟度を混同しない。"``\]: `Remove the sentence restating that id, term, and definition are required, because the table's required-column markers already provide that information; retain the guidance on optional fields and the distinction between document maturity and term status.`
- F005 \[minor/vp-dev-change-impact; line=131; anchor=`"意味の変更・廃止では、共通メタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」に従い、BA が用語 ID を参照するデータ辞書・業務ルール・画面や CLI の用語を洗い出し、DEV が実装、QE がテスト・受入条件の追従を確認する。廃止・確定は PO が判断し、PM が移行作業を管理する。schema にない変更管理項目は YAML に増やさず、個票などの変更記録へ残す。"`\]: `Define the follow-up changes required when a term ID, meaning, or lifecycle state changes, including BDD and BR references, affected implementation and tests, and generated glossary pages, with responsible Role codes; the authoring standard requires glossary-specific impact tracking.`
- F006 \[minor/vp-dev-testability; line=127; anchor=``"- `validate:schema` はファイル内の用語 ID の重複と参照先の存在を検証する。用語集をまたぐ ID の一意性と同じ概念の重複定義は、別途横断で照合する。"``\]: `Provide executable schema and glossary-reference validation commands, explain the required YAML schema modeline or explicit schema selection, and state expected results; also clarify that the glossary-reference validator checks references within each glossary and does not verify downstream BDD or BR references.`
- F007 \[minor/vp-qe-omissions-consistency; line=11; anchor=``"- 領域別に分ける場合は、横断の用語を `gl-common`（対象名を付ける場合は `gl-<対象>-common`）へ集め、同じ概念を複数の用語集に定義しない。"``\]: `Define an explicit translation exception to the prohibition on representing the same concept in multiple glossaries, and specify translated-term ID handling; separate translation files are required at line 25, while line 32 requires term IDs to be unique across project glossaries.`
- F008 \[minor/vp-qe-kata-conformance; line=31; anchor=``"- 用語 ID は `^tm-[a-z0-9-]+$` に従う。新規採番では `tm-<領域>-<概念>` とし、共通用語には `common` など共有範囲を示す接頭辞を使う。"``\]: ``新規採番は `tm-＜領域＞-＜概念＞` とする規則に対して、完成例 gl-sample の `tm-reorder-point`・`tm-standard-product`・`tm-inventory`・`tm-shop-owner` などには領域の接頭辞がなく、既存 ID 維持の例外に当たる根拠もないため、sample の ID を規則に合わせるか、分類用の用語や既存 ID の扱いを rulebook に明記して整合させる。``
- F009 \[minor/vp-ops-release-readiness; line=47; anchor=``"`status` は schema 上は省略可能だが、共通メタ情報の規約に従って記載する。`ready` への昇格は人間が行う。"``\]: `Define the ready gate for a glossary, including successful structural and reference checks, review of business definitions, disposition of unresolved labels and candidate terms, and human PO confirmation; the status enumeration alone does not establish release prerequisites.`
- F010 \[minor/vp-ops-operability; line=131; anchor=`"意味の変更・廃止では、共通メタ情報標準の「文書の改訂・廃止とライフサイクル変更管理」に従い、BA が用語 ID を参照するデータ辞書・業務ルール・画面や CLI の用語を洗い出し、DEV が実装、QE がテスト・受入条件の追従を確認する。廃止・確定は PO が判断し、PM が移行作業を管理する。schema にない変更管理項目は YAML に増やさず、個票などの変更記録へ残す。"`\]: `Add a glossary maintenance procedure covering change intake, term deprecation or replacement without ID reuse, validation, regeneration of generated display pages from YAML, and responsible Role codes; the current maintenance statement does not explain how to perform an update.`

### 成果物から届いた Kata が原因の finding

- なし

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

`共通規約 sha256:49eac627d50989b27745d047415c0d26226f3a7a2b8b90ec1b8818862593d575` `docs/ja/projects/prj-0001/execution/conventions/49eac627d50989b27745d047415c0d26226f3a7a2b8b90ec1b8818862593d575.txt`
