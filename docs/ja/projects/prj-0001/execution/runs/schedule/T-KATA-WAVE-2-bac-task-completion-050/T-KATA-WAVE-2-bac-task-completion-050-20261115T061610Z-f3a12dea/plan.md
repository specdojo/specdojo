---
specdojo:
  id: prj-0001:xep-t-kata-wave-2-bac-task-completion-050-20261115t061610z-f3a12dea
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-2-bac-task-completion-050
  name: "sample の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: sample-maintenance
  targets:
    - bac-task-completion
    - specdojo:bac-sample
---

# Edit Plan: T-KATA-WAVE-2-bac-task-completion-050

## 1. このフェーズで行うこと

改訂した rulebook に沿って sample を完成例として手入れする。共通サンプル文脈を用い、代表成果物を単純に複写せず、判断に要る場面・例外を拾う。成果物本体はこの段で変更しない。実行時に対象が not-needed なら変更せず、その旨を result に記録して完了する。

[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]の章立てに合わせ、rulebook に完成例の章を置かず sample へ外出しする。Markdown の第2〜第4階層の見出しに階層ごとの連番を付け、記述ガイドには章ごとの判断基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]程度の厚さとし、YAML は対象形式に合わせて内容を充実させる。recipe と template の要否を判断し、rulebook frontmatter に対応する ID または not-needed を宣言して理由を result に残す。実装・schema・リファレンスの値・構文・構造の詳細を再掲せず、正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 業務受入条件（タスクの評価と完了）
- `depends_on`:
  - [[bps-deliverable-evaluation]]
  - [[bps-task-completion]]
  - [[prj-0001:prj-success-criteria-and-acceptance-criteria]]
- `overview`: 成果物の評価（grade・finding の確定）から、完了条件との照合と完了の記録までが業務として成立することを確認する
- `path`: `docs/ja/product/050-business-acceptance-criteria/bac-task-completion.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-2-bac-task-completion-050/T-KATA-WAVE-2-bac-task-completion-050-20261115T061610Z-f3a12dea/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/bac-sample.md`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `「最小サンプル」の位置づけだけでなく、この sample が kata においてどのような完成例を示す目的なのか（例: rulebook 第5章の構成に従った BAC 完成例の提示）を概要に補足すべき。`
- F002 \[minor/vp-po-decision-readiness; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項の「処理方針」がごく簡素であり、PO が判断するための影響範囲や次アクションの記述があるとよい。`
- F003 \[minor/vp-pm-plan-feasibility; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項「要件詳細の補強」の完了条件・担当・タイミングが不明確であり、タスク化しにくい。`
- F004 \[minor/vp-pm-dependency-risk; line=23; anchor=`"| 目的         | 業務として受け入れ可能であることを示す条件を定義する | specdojo:deliverables-reference 準拠 |"`\]: `§4 表中の「specdojo:deliverables-reference 準拠」が参照先不明であり、依存関係として明示的に識別されていない。`
- F005 \[minor/vp-pm-control-reporting; line=30; anchor=`"| 要件詳細の補強 | 実案件適用時に具体化する |"`\]: `未解決事項に対応方針の担当ロールが記載されていない。`
- F006 \[major/vp-ba-business-value; line=15; anchor=`"- 主な内容: 業務シナリオ、受入条件、前提、操作、期待結果 など"`\]: `「業務シナリオ、受入条件、前提、操作、期待結果 など」が列挙のみで、具体的な業務シナリオ（前提・操作・期待結果のセット）が記述されていないため、BAC sample としての業務価値を果たしていない。`
- F007 \[major/vp-ba-requirements-completeness; line=15; anchor=`"- 主な内容: 業務シナリオ、受入条件、前提、操作、期待結果 など"`\]: `rulebook §6.2 の標準テンプレに従った具体的な受入条件シナリオ（前提・操作・期待結果）が記述されておらず、要件の完備性が不足している。`
- F008 \[minor/vp-ba-stakeholder-clarity; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `対象読者（例: BAC を初めて作成するチームメンバー）や利用場面の明示がない。`
- F009 \[minor/vp-arc-technical-constraints; line=23; anchor=`"| 目的         | 業務として受け入れ可能であることを示す条件を定義する | specdojo:deliverables-reference 準拠 |"`\]: `「specdojo:deliverables-reference 準拠」の参照先パスが不明であり、技術制約としての schema 参照が不完全。`
- F010 \[major/vp-arc-conciseness; line=15; anchor=`"- 主な内容: 業務シナリオ、受入条件、前提、操作、期待結果 など"`\]: `§3「記述内容」と §4「最小記述例」の表で「主な内容」が重複しており、統合しても判断情報を失わないため、冗長性を解消すべき。`
- F011 \[minor/vp-arc-single-responsibility; line=13; anchor=`"## 3. 記述内容"`\]: `§3「記述内容」が BAC の記述方法の解説に傾いており、sample の責務（完成例の提示）から逸脱気味であるが、この節を rulebook への参照に置き換えることで責務境界を明確にできる。`
- F012 \[minor/vp-dev-implementation-readiness; line=15; anchor=`"- 主な内容: 業務シナリオ、受入条件、前提、操作、期待結果 など"`\]: `具体的なシナリオ例がなく、この sample だけでは BAC 作成の入力として不十分であり、rulebook §9 のサンプルを参照する必要がある。`
- F013 \[minor/vp-dev-testability; line=1; anchor=`"# [業務受入条件](../rulebooks/bac-rulebook.md) サンプル"`\]: `Frontmatter を検証するための lint コマンドや schema 検証手順が記載されていない。`
- F014 \[major/vp-qe-verifiability; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `sample 自体の品質判定基準（例: rulebook §5 の構成に従った完成例であること）が明示されておらず、pass/fail 判定ができない。`
- F015 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# [業務受入条件](../rulebooks/bac-rulebook.md) サンプル"`\]: `Frontmatter の type は rulebook の定義に従い project ではなく test としてください。`
- F016 \[major/vp-qe-omissions-consistency; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `rulebook §5 で定義された必須構成（概要、受入条件、メモ/将来課題）に従っておらず、§3「記述内容」や §4「最小記述例」は rulebook に定義されていない独自の章立てとなっている。`
- F017 \[major/vp-qe-kata-conformance; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `rulebook §5 で定義された必須構成（概要、受入条件、メモ/将来課題）に従っておらず、実際の BAC 成果物の完成例として提示されていないため、kata への適合性が低い。`
- F018 \[major/vp-qe-kata-conformance; line=15; anchor=`"- 主な内容: 業務シナリオ、受入条件、前提、操作、期待結果 など"`\]: `具体的な受入条件シナリオ（前提・操作・期待結果のセット）がなく、BAC sample として kata の責務（完成例の提示）を果たしていない。`
- F019 \[major/vp-ux-readability; line=15; anchor=`"- 主な内容: 業務シナリオ、受入条件、前提、操作、期待結果 など"`\]: `BAC の記述方法の解説に留まっており、具体的な受入条件の記述例（シナリオや期待結果）が示されていないため、参照サンプルとしての有用性が低い。`
- F020 \[minor/vp-ux-language-consistency; line=1; anchor=`"# [業務受入条件](../rulebooks/bac-rulebook.md) サンプル"`\]: `Frontmatter の type が「project」となっているが、rulebook では「test」固定と定義されており、用語・ラベルの不整合がある。`
- F021 \[minor/vp-ops-release-readiness; line=5; anchor=`"本書は、業務として受け入れ可能であることを示す条件を定義するための最小サンプルである。"`\]: `draft から ready への遷移条件が明示されていない。`
- F022 \[minor/vp-ops-operability; line=11; anchor=``"- 参照: `../rulebooks/bac-rulebook.md`"``\]: `sample の更新タイミング（例: rulebook 更新時に追従する）や再生成手順の記載がない。`

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
