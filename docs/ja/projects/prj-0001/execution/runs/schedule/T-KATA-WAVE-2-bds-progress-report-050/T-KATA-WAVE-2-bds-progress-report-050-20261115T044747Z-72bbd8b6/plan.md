---
specdojo:
  id: prj-0001:xep-t-kata-wave-2-bds-progress-report-050-20261115t044747z-72bbd8b6
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-2-bds-progress-report-050
  name: "sample の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: UX
  approach: sample-maintenance
  targets:
    - bds-progress-report
    - specdojo:bds-sample
---

# Edit Plan: T-KATA-WAVE-2-bds-progress-report-050

## 1. このフェーズで行うこと

改訂した rulebook に沿って sample を完成例として手入れする。共通サンプル文脈を用い、代表成果物を単純に複写せず、判断に要る場面・例外を拾う。成果物本体はこの段で変更しない。実行時に対象が not-needed なら変更せず、その旨を result に記録して完了する。

[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]の章立てに合わせ、rulebook に完成例の章を置かず sample へ外出しする。Markdown の第2〜第4階層の見出しに階層ごとの連番を付け、記述ガイドには章ごとの判断基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]程度の厚さとし、YAML は対象形式に合わせて内容を充実させる。recipe と template の要否を判断し、rulebook frontmatter に対応する ID または not-needed を宣言して理由を result に残す。実装・schema・リファレンスの値・構文・構造の詳細を再掲せず、正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 帳票仕様（週次進捗報告）
- `depends_on`:
  - [[bds-index]]
  - [[sysd-job-execution]]
- `overview`: routine が週ごとに作る進捗報告（reporting/progress-reports/）の利用目的・読み手・表示項目・出力の時期と、元にする記録を定義する
- `path`: `docs/ja/product/010-business-specs/040-user-interface-model/bds-progress-report.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-2-bds-progress-report-050/T-KATA-WAVE-2-bds-progress-report-050-20261115T044747Z-72bbd8b6/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/bds-sample.md`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-po-purpose-alignment; line=5; anchor=`"本書は、業務ユーザー視点の帳票の利用目的や表示項目を定義するための最小サンプルである。"`\]: `完成例として扱う具体的な帳票、その業務課題、対象範囲、上位成果物との対応を示し、主要な定義を採用する理由を説明する必要がある。`
- F002 \[major/vp-po-decision-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `「実案件適用時に具体化する」だけでは判断できないため、未決事項ごとに判断者、選択肢、影響範囲、判断時期、次アクションを明記する必要がある。`
- F003 \[major/vp-po-publication-accountability; line=26; anchor=`"## 5. 未解決事項"`\]: `draft から公開可能な状態へ移す条件として、公開対象、機密・個人情報の有無、確認事項、人間の承認者を明記する必要がある。`
- F004 \[major/vp-pm-plan-feasibility; line=15; anchor=`"- 主な内容: 帳票概要、利用目的、表示項目、出力タイミング など"`\]: `記載項目の名称だけでなく、仕様確定に必要な作業単位、依存関係、担当 Role code、完了条件、判断タイミングを具体化する必要がある。`
- F005 \[major/vp-pm-dependency-risk; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: `参照先が特定できない handbook への依存を解消し、based_on による根拠仕様、後続成果物、未決事項の影響と PJR 登録候補を明記する必要がある。`
- F006 \[major/vp-pm-control-reporting; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項を課題・リスク・変更要求・決定待ちに分類し、PJR 転記要否、報告先、担当 Role code、対応方針を示す必要がある。`
- F007 \[major/vp-ba-business-value; line=5; anchor=`"本書は、業務ユーザー視点の帳票の利用目的や表示項目を定義するための最小サンプルである。"`\]: `具体的な利用者、業務課題、放置時の影響、期待価値、成功基準、および帳票の主要項目との対応を記述する必要がある。`
- F008 \[blocker/vp-ba-requirements-completeness; line=18; anchor=`"## 4. 最小記述例"`\]: `実在する一つの帳票を題材に、利用者視点の要件、受入条件、対象範囲、除外範囲、用語定義を備えた完成例へ置き換える必要がある。`
- F009 \[major/vp-ba-stakeholder-clarity; line=5; anchor=`"本書は、業務ユーザー視点の帳票の利用目的や表示項目を定義するための最小サンプルである。"`\]: `店主や経理担当などの具体的な利用者、利用場面、運用者、仕様確認者、合意対象を明記する必要がある。`
- F010 \[major/vp-arc-technical-constraints; line=15; anchor=`"- 主な内容: 帳票概要、利用目的、表示項目、出力タイミング など"`\]: `実装詳細には踏み込まず、出力形式、文字コード等の業務上必要な制約、外部依存、準拠 schema と検証方法を明記する必要がある。`
- F011 \[minor/vp-arc-conciseness; line=24; anchor=`"| 主な内容     | 帳票概要、利用目的、表示項目、出力タイミング など    | 要点のみ記載                         |"`\]: `「帳票概要、利用目的、表示項目、出力タイミング など」は line 15 の反復で判断情報を追加していないため、一方へ統合する必要がある。`
- F012 \[blocker/vp-dev-implementation-readiness; line=18; anchor=`"## 4. 最小記述例"`\]: `実装可能な完成例とするため、入力、表示項目、抽出・除外条件、算出規則、出力形式、制約、完了条件を具体値で記述する必要がある。`
- F013 \[major/vp-dev-change-impact; line=7; anchor=`"## 2. 入力情報"`\]: `based_on と関連成果物を特定し、帳票変更が schema、生成処理、出力形式、運用手順、既存利用者へ与える影響を明記する必要がある。`
- F014 \[major/vp-dev-testability; line=11; anchor=``"- 参照: `../rulebooks/bds-rulebook.md`"``\]: `対象ファイルに対する lint、Frontmatter schema 検証、生成確認のコマンドと期待結果、エラー時の対応を示す必要がある。`
- F015 \[major/vp-qe-verifiability; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `目的の記述例が抽象的であり、具体的かつ検証可能な判定基準を提示するサンプルとしての機能が不十分である。`
- F016 \[blocker/vp-qe-omissions-consistency; line=3; anchor=`"## 1. 目的と適用範囲"`\]: ``Frontmatter の `type: project` がルールブック指定の `domain` / `data` と矛盾している。``
- F017 \[blocker/vp-qe-omissions-consistency; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: `ルールブックで定義された必須構成（概要、利用者/利用目的、出力タイミング等）がすべて省略されており、BDS としての形式を成していない。`
- F018 \[blocker/vp-qe-kata-conformance; line=1; anchor=`"# [帳票仕様](../rulebooks/bds-rulebook.md) サンプル"`\]: `本文書は BDS のサンプルとして定義されているが、BDS ルールブックの構成案および命名規則に一切準拠していない。`
- F019 \[major/vp-qe-kata-conformance; line=1; anchor=`"# [帳票仕様](../rulebooks/bds-rulebook.md) サンプル"`\]: ``ID `specdojo:bds-sample` がルールブックで規定された命名形式（bds-xxx）に準拠していない。``
- F020 \[major/vp-ux-readability; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: `ルールブックの標準構成に従わない独自の見出し構成となっており、正しい BDS の記述方法を理解させるためのガイドとして機能していない。`
- F021 \[major/vp-ux-language-consistency; line=3; anchor=`"## 1. 目的と適用範囲"`\]: ``Frontmatter の `type` に、ルールブックで定義されていない `project` が使用されており、表記が統一されていない。``
- F022 \[minor/vp-ux-language-consistency; line=10; anchor=`"- 前提: プロジェクト文脈は handbook の共通方針に準拠する"`\]: `` `handbook` と `specdojo:deliverables-reference` の正式名称やリンクがなく参照先を特定できないため、成果物名と参照形式を統一する必要がある。 ``
- F023 \[major/vp-ops-release-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `ready 化に必要な必須章の充足条件、未解決事項の解消基準、公開対象、人間の承認者、公開前確認を明記する必要がある。`
- F024 \[major/vp-ops-operability; line=26; anchor=`"## 5. 未解決事項"`\]: `帳票仕様の更新契機、変更管理先、再生成・再検証手順、問い合わせ導線、障害時対応、担当 Role code を記述する必要がある。`

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

`共通規約 sha256:7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b` `docs/ja/projects/prj-0001/execution/conventions/7359b2d13ebba15c496a8ab5d932f1529d48aaf84a9e96b7fa4a00fa51c91a7b.txt`
