---
specdojo:
  id: prj-0001:xep-t-kata-slim-prj-charter-040-20261117t154110z-78ecba8b
  type: exec-plan
  rulebook: none
  task_id: T-KATA-SLIM-prj-charter-040
  name: "rulebook から運用の記述を外す"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: rulebook-maintenance
  targets:
    - prj-0001:prj-charter
    - specdojo:prj-charter-rulebook
---

# Edit Plan: T-KATA-SLIM-prj-charter-040

## 1. このフェーズで行うこと

対応する rulebook から、どの成果物にも共通する文書の運用の記述を外し、共通の正本への参照にする。 手本は sld の試行（[[prj-0001:pjr-8s4t-sld-kata-slim-pilot|PJR-8S4T]] の対応結果の「他の型へ広げるときの一覧」）と、 改訂済みの [[specdojo:sld-rulebook|sld-rulebook]] である。 外す記述: 役割の表と役割の段落、status の draft 維持・ready 昇格・PO の承認・agent の禁止・公開の承認条件・改訂と廃止の手順、 文書品質の検査（prettier・lint・見出し・wikilink）を業務の検証や受入条件に入れること、未決事項の表の管理台帳の区分・担当・判断時期・追跡先の列と台帳への登録の段落、 本文要件の言い直しだけの用語の表、共通規約と同じ禁止事項。 残す記述: その型固有の判断基準と区分、標準の列と章の受入条件、良い例・悪い例、型固有の禁止事項、業務の受入確認の手順と合格条件、未決事項の論点と影響。 参照の形: 全体方針に「共通の運用」を 1 項目だけ置き、役割は適用先のメンバー定義、status・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] を参照する。 章名と必須・条件付きの区分は、既存の成果物との対応を保つため原則として変えない。変える場合は理由を result に書く。 大きさは、空白を除いた文字数で今の 8 割以下を目安にし、前後の文字数を result に書く。成果物本体は変更しない。 共通の正本に足りない記述があれば、rulebook ではなく変更案として result に書く。 この段で直すのは rulebook だけとする。recipe・template・sample は commit の対象外のため変えず、合わせて直すべき点があれば変更案として result に書く。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: プロジェクト憲章
- `depends_on`:
  - [[prj-0001:prj-overview]]
  - [[prj-0001:prj-stakeholder-register]]
- `overview`: プロジェクトの正式な認可と権限委譲を文書化
- `path`: `docs/ja/projects/prj-0001/020-project-definition/prj-charter.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-SLIM-prj-charter-040/T-KATA-SLIM-prj-charter-040-20261117T154110Z-78ecba8b/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/prj-charter-rulebook.md`
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

- F001 \[minor/vp-arc-conciseness; line=120; anchor=`"- 認可しない範囲を明記し、憲章承認と本格実行開始を混同しない。"`\]: `H1直下に立ち上げ認可・権限委譲・本格実行開始を承認しない旨を書く規則は直後の6.1共通ルールでより具体的に再掲されているため、本行を削除または6.1への参照へ置き換えてください。`
- F002 \[minor/vp-qe-omissions-consistency; line=114; anchor=`""`\]: `全体方針と権限委譲の定義では「PO またはスポンサー」を判断主体としている一方、本行、recipe、成果物カタログの完了条件は PO のみを主体としているため、スポンサーが PO Role code を兼ねる必要があるのかを明記して責任定義を統一してください。`
- F003 \[minor/vp-qe-omissions-consistency; line=215; anchor=`"| 認可対象または認可しない範囲を記載しない             | PO が承認範囲を判断できないため              |"`\]: `frontmatterのstatusを文書状態の正本としつつ認可状態との関係を定義しておらず、sampleがstatus: readyのまま本文で「ドラフト」と表現しているため、statusは文書成熟度、承認履歴は認可状態という独立した状態軸であることを明記してください。`
- F004 \[minor/vp-qe-kata-conformance; line=129; anchor=``"- 承認に条件が付く場合は、`認可条件` を補足として 1 行追加してよい。ただし、承認章の代替にはせず、承認日・承認者・証跡リンクの管理は別途必要とする。"``\]: `作成済み参照先をwikilinkへ更新する規則に対し、完成例のsampleでは実在する参照先が相対MarkdownリンクまたはバッククォートIDのままなので、完成例が規則どおりの参照形式を示すよう整合させてください。`
- F005 \[minor/vp-qe-kata-conformance; line=170; anchor=`"### 6.5. 初期ステークホルダー"`\]: `AI Agentの支援範囲を含める規則がsampleとtemplateのハイレベルスコープに反映されていないため、適用条件を明記するか、該当する記入欄と完成例を追加してください。`
- F006 \[minor/vp-ux-readability; line=120; anchor=`"- 認可しない範囲を明記し、憲章承認と本格実行開始を混同しない。"`\]: `冒頭文の必須内容は直後の6.1で文数を含めて具体化されているため、本行を統合し、読者が同じ規則を二度確認しなくてよい構成にしてください。`
- F007 \[minor/vp-ux-language-consistency; line=133; anchor=`"| 項目            | 内容 |"`\]: `「PO またはスポンサー」を選択可能とする前段に対して本行以降は「人間のPO」だけを最終判断主体としているため、スポンサーをPO Role codeへ対応付けるのか、承認責任者という共通語へ統一するのかを明示してください。`

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

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
