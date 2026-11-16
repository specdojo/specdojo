---
specdojo:
  id: prj-0001:xep-t-kata-wave-1-cpd-specdojo-cli-040-20261114t000527z-3a241f91
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-cpd-specdojo-cli-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - cpd-specdojo-cli
    - specdojo:cpd-rulebook
---

# Edit Plan: T-KATA-WAVE-1-cpd-specdojo-cli-040

## 1. このフェーズで行うこと

新しく作った型の文書（rulebook・recipe・sample・template）は、packages/docs-site/.vitepress/sidebar-config.ts の型のメニューにも足す（tests/packages/docs-site/sidebar-kata.test.ts が確かめる）。
初期整備した代表の実績から rulebook を手入れする。成果物本体は変更しない。sample・recipe・template の整合は後続の段で行う。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: C4コンポーネント図（SpecDojo CLI）
- `depends_on`:
  - [[cnd-specdojo]]
- `overview`: SpecDojo CLI内部の主要コンポーネント（catalog／schedule／exec／register／routine／index等のエンジン）と依存関係を定義する
- `path`: `docs/ja/product/030-architecture/010-c4/cpd-specdojo-cli.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-cpd-specdojo-cli-040/T-KATA-WAVE-1-cpd-specdojo-cli-040-20261114T000527Z-3a241f91/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/cpd-rulebook.md`
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

- F001 \[major/vp-po-decision-readiness; line=167; anchor=`"### 7.4. 補足"`\]: `「補足」に未確定論点を列挙することだけを定め、各論点の判断者、判断タイミング、影響、次アクション、承認・保留・差し戻しとの関係を定義していないため、POが判断できる状態を保証できない。`
- F002 \[major/vp-po-publication-accountability; line=38; anchor=``"| status     | `draft`/`ready`/`deprecated`                   | ○    |"``\]: `` `status` の列挙だけで、CPDに含まれる構成情報の公開対象、非公開情報の確認方法、公開可否を最終判断する人間のPOまたは承認者を定義していない。 ``
- F003 \[minor/vp-pm-plan-feasibility; line=133; anchor=`"## 6. 本文構成（標準テンプレ）"`\]: `標準章順と作業単位は示されているが、各作業またはレビューを担うRole codeと判断タイミングがなく、担当割当てと所要時間見積もりには別途補完が必要である。`
- F004 \[major/vp-pm-dependency-risk; line=40; anchor=`"| based_on   | 根拠となる定義（用語集、外部IF、上位方針など） | 任意 |"`\]: `` `based_on` を任意とし、CND・外部IF・用語定義などの必須依存、依存変更時の影響、後続成果物やScheduleへの波及、PJR登録候補を記録する規則を定めていない。 ``
- F005 \[major/vp-pm-control-reporting; line=167; anchor=`"### 7.4. 補足"`\]: `境界や外部連携の未確定論点を一括して「補足」に列挙させるだけで、リスク・課題・変更要求・決定事項の区分、PJRへの転記条件、報告先、担当Role codeを定義していない。`
- F006 \[major/vp-ba-business-value; line=50; anchor=`"## 4. CPDで合意すること（スコープ）"`\]: `合意対象をコンテナ、コンポーネント、DB、外部連携、関係に限定し、対象者の業務課題、放置時の影響、期待価値、成功基準、各構成判断を採用した理由または上位文書への必須参照を求めていない。`
- F007 \[major/vp-ba-stakeholder-clarity; line=52; anchor=`"### 4.1. 合意したいこと"`\]: `「合意したいこと」は列挙されているが、作成者、アーキテクチャ確認者、業務確認者、最終合意者と、それぞれが確認する対象を定義していない。`
- F008 \[minor/vp-arc-conciseness; line=198; anchor=`"## 11. サンプル（簡易）"`\]: `Frontmatterで外部sampleを宣言している一方、「サンプル（簡易）」以降に完成例をほぼ丸ごと再掲しており、外部sampleを正本として削除または最小輪郭へ縮約しても規則上の判断情報を失わない。`
- F009 \[major/vp-dev-change-impact; line=41; anchor=`"| supersedes | 置き換え関係（古い図→新しい図）                | 任意 |"`\]: `` `supersedes` の任意記載以外に、コンポーネントや関係を変更した際のCND、外部IF、データ設計、Mermaid図、sampleなどへの影響確認と更新方針を定義していない。 ``
- F010 \[major/vp-dev-testability; line=189; anchor=`"## 10. レビュー観点（チェックリスト）"`\]: `レビューチェックリストだけで、Frontmatter検証、リンク検査、Mermaid構文・描画確認に使用するコマンド、対象ファイル、期待結果、エラー時対応を示していない。`
- F011 \[minor/vp-qe-verifiability; line=189; anchor=`"## 10. レビュー観点（チェックリスト）"`\]: `「過不足なく」「必要十分」「意味が解釈一致する」とする項目に、合格と判定する具体条件または確認方法がなく、レビュー担当者によって判定が揺れる。`
- F012 \[major/vp-qe-omissions-consistency; line=211; anchor=`"## 12. 概要"`\]: `標準構成を「概要」「C4コンポーネント図」「要素の説明」「補足」の4章と定義しているのに、埋め込み例は第12〜15章に加えて第16章「参照」を持ち、必須の章構成を一意に判定できない。`
- F013 \[major/vp-qe-kata-conformance; line=1; anchor=`"# C4コンポーネント図 ドキュメント作成ルール"`\]: ``Frontmatter で指定されているサンプル (`specdojo:cpd-sample`) の構成と type が、本書の定義する標準構成 (`architecture` 固定、4章構成) と矛盾している。``
- F014 \[major/vp-qe-kata-conformance; line=1; anchor=`"# C4コンポーネント図 ドキュメント作成ルール"`\]: ``Frontmatterで指定した `specdojo:cpd-sample` の `rulebook` が `specdojo:cpd-mermaid-rulebook` を指しており、評価対象 `specdojo:cpd-rulebook` の完成例として関連付いていない。``
- F015 \[minor/vp-ux-readability; line=198; anchor=`"## 11. サンプル（簡易）"`\]: `「サンプル（簡易）」ではFrontmatterだけがコードブロック内にあり、「概要」以降が同階層の第12〜16章として続くため、例示範囲と規範本文の境界を初見の読者が判別しづらい。`
- F016 \[major/vp-ops-release-readiness; line=38; anchor=``"| status     | `draft`/`ready`/`deprecated`                   | ○    |"``\]: `` `status` の値だけを列挙し、`draft` から `ready` へ移す完了条件、未解決事項の許容基準、承認者、公開前確認を定義していない。 ``
- F017 \[major/vp-ops-operability; line=41; anchor=`"| supersedes | 置き換え関係（古い図→新しい図）                | 任意 |"`\]: `` `based_on` と `supersedes` の項目説明だけで、CPDの更新契機、再描画・再検証手順、変更履歴、問い合わせ導線、保守担当Role codeを定義していない。 ``

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
