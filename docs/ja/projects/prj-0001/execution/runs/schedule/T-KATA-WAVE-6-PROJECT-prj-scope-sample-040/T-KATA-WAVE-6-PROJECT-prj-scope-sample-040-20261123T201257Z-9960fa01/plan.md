---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-prj-scope-sample-040-20261123t201257z-9960fa01
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-prj-scope-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PO
  approach: rulebook-maintenance
  targets:
    - specdojo:prj-scope-sample
    - specdojo:prj-scope-rulebook
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-prj-scope-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: プロジェクトスコープの完成例
- `depends_on`:
  - [[specdojo:prj-overview-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、プロジェクトスコープの完成例を示す
- `path`: `docs/ja/specdojo/samples/prj-scope-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-prj-scope-sample-040/T-KATA-WAVE-6-PROJECT-prj-scope-sample-040-20261123T201257Z-9960fa01/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/prj-scope-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PO（Project Owner）**
- 責務: 公開可能な SpecDojo 文書基盤としての目的・スコープ・優先順位・公開方針を最終判断する。

このロールが重視するレビュー観点:

- 目的・スコープとの整合: 成果物の主要な定義・判断が、プロジェクト目的、スコープ、優先順位、公開方針と矛盾せず、成果物固有の目的または上位文書への参照から必要性を説明できるか。対応する目的・成果のない手段を目的として扱っていないか。
- 承認判断に必要な情報: PO が承認、保留、差し戻しを判断するための論点、未決事項、影響範囲が明示されているか。文書の役割の割り当てと承認の進み具合は登録簿で追うため、本文に求めない。
- 公開可否と説明責任: 公開してよい情報だけで構成され、最終判断と説明責任を人間の PO が担う前提になっているか。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-publication-accountability; line=153; anchor=`"| スコープ外の未記載                  | 境界が曖昧になり手戻りの原因になる        |"`\]: `禁止事項に「個人名・連絡先などの個人情報や非公開情報の記載」を追加し、recipe の仕上げチェック（個人情報・機密情報を含めない）および prj-overview-rulebook の禁止事項と公開適性の基準を揃えるべきである。`
- F002 \[minor/vp-pm-dependency-risk; line=111; anchor=`"- マイルストーンやスケジュール定義がある場合は、期間判断の根拠として参照リンクを付けます。"`\]: `対象期間の根拠としてスケジュール等の後続成果物へ参照リンクを付ける規定は、based_on を depends_on の推移閉包内に限定するルールと関係が不明確で逆依存を招くため、「参照のみで based_on には含めない」等の扱いを明記すべきである。`
- F003 \[minor/vp-arc-conciseness; line=86; anchor=`"- UI、API、DB、テストケース、運用手順などの詳細は、対象となる後続文書へ委譲します。"`\]: `記述ガイド「共通」の「UI、API、DB…の詳細は後続文書へ委譲」は全体方針の委譲記述と禁止事項の設計詳細行の繰り返しであり、削除または禁止事項への参照に置き換えられる。`
- F004 \[minor/vp-qe-verifiability; line=97; anchor=`"- 業務アプリケーション以外では、文書体系、管理台帳、サンプル、補助ツール、公開基盤などを表で示してよいです。"`\]: `「粒度を揃えます」および禁止事項の「粒度不一致」に判定条件がないため、「対象システムの各行がいずれかの対象業務を支えることを示す」等の pass / fail を判定できる基準を記述すべきである。`
- F005 \[minor/vp-qe-omissions-consistency; line=141; anchor=`"| 項目     | 内容 |"`\]: `スコープ変更方針の記述ガイドは「影響を受ける成果物」を求めているが推奨表に該当行がなく template・sample にも反映されないため、推奨表に「影響成果物」行を追加するか箇条を影響評価に統合して整合させるべきである。`
- F006 \[minor/vp-qe-kata-conformance; line=68; anchor=`"各章は次の内容を満たすものとし、見出し順と記入欄は宣言済みの template を正本とします。"`\]: `template は H1 直下に導入文を要求するが rulebook の本文構成表に導入文の規定がなく sample にも導入文がないため、導入文の要否を rulebook に定めて template・sample と揃え、あわせて任意章（境界の判断基準・スコープ変更方針）の任意性を template に示すべきである。`
- F007 \[minor/vp-ux-language-consistency; line=9; anchor=`"- 対象は **プロジェクトスコープ**（対象範囲、対象外、境界判断、変更方針）です。"`\]: `「対象外」「スコープ外」「対象（Out）」が同一概念に混在しているため、章名「スコープ外」に統一するか、両者が同義であることを全体方針で定義すべきである。`

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
