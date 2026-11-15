---
specdojo:
  id: prj-0001:xep-t-kata-wave-2-bds-progress-report-040-20261115t042822z-84089a2b
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-2-bds-progress-report-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: UX
  approach: rulebook-maintenance
  targets:
    - bds-progress-report
    - specdojo:bds-rulebook
---

# Edit Plan: T-KATA-WAVE-2-bds-progress-report-040

## 1. このフェーズで行うこと

代表成果物の実績から rulebook の規則・判断基準を見直す。後続の段で recipe・sample・template を同期する。成果物本体はこの段で変更しない。実行時に対象が not-needed なら変更せず、その旨を result に記録して完了する。

[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]の章立てに合わせ、rulebook に完成例の章を置かず sample へ外出しする。Markdown の第2〜第4階層の見出しに階層ごとの連番を付け、記述ガイドには章ごとの判断基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]程度の厚さとし、YAML は対象形式に合わせて内容を充実させる。recipe と template の要否を判断し、rulebook frontmatter に対応する ID または not-needed を宣言して理由を result に残す。実装・schema・リファレンスの値・構文・構造の詳細を再掲せず、正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 帳票仕様（週次進捗報告）
- `depends_on`:
  - [[bds-index]]
  - [[sysd-job-execution]]
- `overview`: routine が週ごとに作る進捗報告（reporting/progress-reports/）の利用目的・読み手・表示項目・出力の時期と、元にする記録を定義する
- `path`: `docs/ja/product/010-business-specs/040-user-interface-model/bds-progress-report.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-2-bds-progress-report-040/T-KATA-WAVE-2-bds-progress-report-040-20261115T042822Z-84089a2b/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/bds-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **UX（UX / Documentation Designer）**
- 責務: 仕様作成者が迷わず使える導線、説明、文書体験を担う。小規模運用では BA 観点と合わせて扱い、必要時に専任化を検討する。

このロールが重視するレビュー観点:

- 読みやすさ・理解しやすさ: 初見の読者が、成果物固有の目的または上位文書への参照、名称、メタデータから、なぜ扱うか、役割、利用先、対象、主要な判断、次に見る文書を理解できるか。主旨または主要な判断点を読み取れない箇所を特定できる場合は major とする。同一主張の反復や正本の過剰な再掲など冗長性の判定は vp-arc-conciseness で行い、この観点では扱わない。
- 利用者導線: 利用者や将来貢献者が迷わず必要情報へ到達できる構成になっているか。目次から必要な章を見つけられるか、関連成果物への参照が適切な位置にあるか、前提から結論への説明順序が守られているかのいずれかの基準に照らして判定し、情報を見失う箇所を具体的に特定できる場合のみ不備とする。
- 用語・表現の一貫性: 用語、Role code、成果物名、状態、ラベルが読み手を混乱させない形で統一されているか。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=15; anchor=`"## 2. 用語定義"`\]: ``上位文書（成果物リファレンス等）への参照と、schema 上 `ui`（画面・帳票仕様）とされる UIS との分担が書かれていないため、BDS を独立した成果物とする必要性を上位の根拠から説明できない。``
- F002 \[minor/vp-po-decision-readiness; line=11; anchor=`"- 帳票は **業務ユーザー視点**で、目的・出力タイミング・表示項目・集計/算出を明確にします。"`\]: ``Frontmatter の `recipe` / `template` が `undecided` のままだが、判断に必要な論点・判断タイミング・影響が本文に _UNDECIDED_ などで示されておらず、PO が承認・保留を判断する材料が不足している。``
- F003 \[minor/vp-pm-plan-feasibility; line=63; anchor=`"7. 集計/算出ルール"`\]: `本文構成の各章に必須/任意の区別や完了条件がないため、BDS 作成タスクの完了判定と進捗確認の粒度に使いにくい。`
- F004 \[minor/vp-pm-dependency-risk; line=55; anchor=`"各 BDS ファイルは以下見出しを順番に並べます。"`\]: `` `based_on` に BPS/UIS/BR/BES を挙げるだけで、BDS 作成に先行して必要な成果物や、根拠文書が未確定の場合の扱い（依存・リスク）が示されていない。 ``
- F005 \[minor/vp-pm-control-reporting; line=75; anchor=`"- 利用者（例: 店主、経理担当、バイヤー）"`\]: `「メモ / 将来課題」章の記述ガイドがなく、PJR へ転記すべき課題・変更要求と、文書内のメモに留める事項の区別が示されていない。`
- F006 \[minor/vp-ba-requirements-completeness; line=63; anchor=`"7. 集計/算出ルール"`\]: `本文構成に帳票の受入条件（検収観点・確認方法）を記述する章や項目がなく、要件を利用者が受入判定できる粒度まで落とす指示が不足している。`
- F007 \[minor/vp-ba-stakeholder-clarity; line=61; anchor=`"5. 抽出条件/対象範囲"`\]: `「業務側の合意対象」とするだけで、帳票仕様をレビュー・合意する確認者（Role）と合意事項が本文構成・記述ガイドのどこにも定義されていない。`
- F008 \[major/vp-arc-technical-constraints; line=45; anchor=`"| based_on | 根拠となる仕様ID（BPS/UIS/BR/BES 等） | 任意 |"`\]: ``参照先の deliverable-frontmatter schema は `specdojo:` 名前空間・`rulebook` 必須・`title` 不許可・`type` enum に `domain` なし（帳票は `ui`）であり、本書の Frontmatter 指示（`type: domain` 固定、`title` 必須、トップレベル配置）と矛盾する。``
- F009 \[minor/vp-arc-conciseness; line=25; anchor=`""`\]: `用語定義の「表示項目」「抽出条件」「集計/算出」「出力形式」は本文構成の見出しと記述ガイドの言い換えにとどまり、削除しても判断情報を失わない重複になっている。`
- F010 \[major/vp-dev-implementation-readiness; line=47; anchor=`""`\]: ``推奨 Frontmatter 項目の表が空行で分断されて `type`/`title`/`status` 等の行が表として描画されず、しかも指示に従うと schema 検証に失敗する（`specdojo:` 名前空間・`rulebook` 必須の欠落）。``
- F011 \[minor/vp-dev-change-impact; line=56; anchor=`""`\]: `` `supersedes` の記載だけで、帳票仕様の変更時に `based_on` 先や用語集 `tm-...` との整合をどう確認・更新するかが示されていない。 ``
- F012 \[minor/vp-dev-testability; line=45; anchor=`"| based_on | 根拠となる仕様ID（BPS/UIS/BR/BES 等） | 任意 |"`\]: ``BDS 作成・更新後に実行すべき検証コマンド（`npm run lint:md`、`npm run lint:fm`、schema 検証）と期待結果が記載されていない。``
- F013 \[minor/vp-qe-verifiability; line=97; anchor=`"表示項目は表（Markdown table）で列挙します。レイアウト指定はせず、**何が出力されるか**を記述します。"`\]: `CSV エクスポート時の必須記載事項（文字コード・ヘッダ行の有無・区切り文字）が1行に連結された崩れた箇条書きになっており、項目ごとにチェックできない。`
- F014 \[major/vp-qe-omissions-consistency; line=41; anchor=``"| type | `ui` 固定 | ○ |"``\]: ``Frontmatter に `title` を書くよう指示しているが、Markdown 規約（Frontmatter に `title:` を書かない）と deliverable schema（`unevaluatedProperties: false`）に矛盾する。``
- F015 \[major/vp-qe-kata-conformance; line=11; anchor=`"- 帳票は **業務ユーザー視点**で、目的・出力タイミング・表示項目・集計/算出を明確にします。"`\]: `参照されているサンプル（specdojo:bds-sample）の内容が, 本書の「5. 本文構成（標準テンプレ）」に従っておらず, 実例としての機能が不十分である。`
- F016 \[minor/vp-qe-kata-conformance; line=63; anchor=`"7. 集計/算出ルール"`\]: `rulebook-authoring-standard は template 未整備系統の本文要件に各章の必須・任意の明示を求めるが、「本文構成（標準テンプレ）」には必須・任意の区別がない。`
- F017 \[minor/vp-ux-readability; line=47; anchor=`""`\]: `推奨 Frontmatter 項目の表が空行で分断され、2行目以降が表として描画されないため、必須項目の一覧を一目で読み取れない。`
- F018 \[minor/vp-ops-release-readiness; line=11; anchor=`"- 帳票は **業務ユーザー視点**で、目的・出力タイミング・表示項目・集計/算出を明確にします。"`\]: ``ready 化の条件と未解決事項（`recipe`/`template` の `undecided`、sample 未整備）、承認者が本文に示されておらず、ready 判断の前提が読み取れない。``
- F019 \[minor/vp-ops-operability; line=56; anchor=`""`\]: ``帳票仕様の改版・廃止時の運用（`deprecated` 化の条件、`supersedes` の付け方、更新担当 Role）が示されておらず、継続更新の手順が読み取れない。``

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

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
