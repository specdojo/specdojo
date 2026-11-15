---
specdojo:
  id: prj-0001:xep-t-kata-wave-2-bac-task-completion-040-20261115t050920z-28fd311a
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-2-bac-task-completion-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: rulebook-maintenance
  targets:
    - bac-task-completion
    - specdojo:bac-rulebook
---

# Edit Plan: T-KATA-WAVE-2-bac-task-completion-040

## 1. このフェーズで行うこと

代表成果物の実績から rulebook の規則・判断基準を見直す。後続の段で recipe・sample・template を同期する。成果物本体はこの段で変更しない。実行時に対象が not-needed なら変更せず、その旨を result に記録して完了する。

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
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-2-bac-task-completion-040/T-KATA-WAVE-2-bac-task-completion-040-20261115T050920Z-28fd311a/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/bac-rulebook.md`
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

- F001 \[minor/vp-po-purpose-alignment; line=9; anchor=`"## 1. 全体方針"`\]: `全体方針に、成果物リファレンスや要求定義系成果物（BPS/BR/UIS/BES）の中で BAC が担う目的・必要性を上位根拠への参照付きで追記してください。`
- F002 \[minor/vp-po-decision-readiness; line=118; anchor=`"### 6.3 メモ / 将来課題"`\]: `メモ / 将来課題に、未確定事項を _UNDECIDED_ / _TODO_ ラベルで記録し、判断者と判断タイミングを添える規約を追加してください。`
- F003 \[minor/vp-pm-plan-feasibility; line=54; anchor=`"## 5. 本文構成（標準テンプレ）"`\]: `本文構成に、BAC を ready とする完了条件（全シナリオに観測可能な期待結果があり based_on が解決できる等）と作成・確認の担当 Role code を追記してください。`
- F004 \[minor/vp-pm-dependency-risk; line=118; anchor=`"### 6.3 メモ / 将来課題"`\]: `メモ / 将来課題に、上流仕様（based_on 先）変更時の追従手順と, 受入に影響する未確定事項を PJR 登録候補として扱う方針を追記してください。`
- F005 \[minor/vp-pm-control-reporting; line=118; anchor=`"### 6.3 メモ / 将来課題"`\]: `メモ / 将来課題で、将来追加シナリオ（BAC 内に残す）と課題・リスク・変更要求（PJR へ転記する）を区別する記述規約を追加してください。`
- F006 \[minor/vp-ba-business-value; line=64; anchor=`"### 6.1 概要"`\]: `概要の記述ガイドで、受入対象が応える業務課題・期待価値（誰の何のためか）を任意ではなく推奨以上とし、シナリオとの対応を確認できるようにしてください。`
- F007 \[minor/vp-ba-requirements-completeness; line=64; anchor=`"### 6.1 概要"`\]: `概要または受入条件に、受入対象の対象範囲と対象外（別 BAC で扱うもの）を明記する規定を追加してください。`
- F008 \[minor/vp-ba-stakeholder-clarity; line=64; anchor=`"### 6.1 概要"`\]: `概要の記述ガイドで、受入判断を行う確認者・合意者（業務側ロール）を明記する項目を追加してください。`
- F009 \[major/vp-arc-technical-constraints; line=38; anchor=`"| 項目 | 説明 | 必須 |"`\]: `推奨 Frontmatter 項目を deliverable-frontmatter.schema.yaml に合わせ、specdojo 名前空間配下に置き、title を削除し、必須の rulebook を追加し、関係項目のキー位置を schema と一致させてください。`
- F010 \[major/vp-dev-implementation-readiness; line=38; anchor=`"| 項目 | 説明 | 必須 |"`\]: `推奨 Frontmatter 項目の表で区切り行直後の空行により表が分断されているため、空行を削除して一つの表として描画されるよう修正してください。`
- F011 \[minor/vp-dev-implementation-readiness; line=27; anchor=`"## 3. ファイル命名・ID規則"`\]: `ファイル名の番号・日本語名と id の対応規則、および id の authority（project 修飾）形式を明記してください。`
- F012 \[minor/vp-dev-change-impact; line=49; anchor=`"推奨:"`\]: `ID 変更や受入条件変更時に影響する参照元（BR/BPS の tests、テスト仕様等）と更新手順を追記してください。`
- F013 \[minor/vp-dev-testability; line=36; anchor=``"Frontmatter は `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` の制約に従います。"``\]: `作成した BAC の検証手順として npm run lint:md / lint:fm 等の実行コマンドと期待結果を追記してください。`
- F014 \[minor/vp-qe-verifiability; line=74; anchor=`"### 6.2 受入条件"`\]: `判定方法を任意ではなく推奨以上とし、期待結果ごとに合否を判定する観測先（記録・画面・帳票等）を示す規約にしてください。`
- F015 \[minor/vp-qe-omissions-consistency; line=1; anchor=`"# 業務受入条件 作成ルール"`\]: `成果物の役割やライフサイクル上の位置づけ（トラック設計ガイドや成果物リファレンスとの関係）を明記する「位置づけ」節を追加してください。`
- F016 \[minor/vp-qe-omissions-consistency; line=54; anchor=`"## 5. 本文構成（標準テンプレ）"`\]: `標準章構成に合わせ章名を「本文要件」とし、各章の目的と必須・任意を明示してください。`
- F017 \[minor/vp-qe-omissions-consistency; line=98; anchor=`"#### 6.2.1 ケース表"`\]: `6.1/6.2/6.3の末尾ドットは修正済みですが、6.2.1 の見出し番号末尾に「.」がない問題が残っているため、n.m. 形式に修正してください。`
- F018 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# 業務受入条件 作成ルール"`\]: `recipe が undecided となっているため、作成手順を定義した recipe ファイルを整備し指定してください。`
- F019 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# 業務受入条件 作成ルール"`\]: `template が undecided となっているため、標準骨組みを定義した template ファイルを整備し指定してください。`
- F020 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 業務受入条件 作成ルール"`\]: `bac-sample が rulebook の本文構成（概要/受入条件/メモ、シナリオの前提・操作・期待結果）や type: test に従っておらず、rulebook 内サンプルが完成例を担っているため、完成例を bac-sample へ移し rulebook と整合させてください。`
- F021 \[minor/vp-ux-language-consistency; line=118; anchor=`"### 6.3 メモ / 将来課題"`\]: `「Scenario」と「シナリオ」の表記ゆれを「シナリオ」に統一し、見出しラベル（判定方法）の表記も統一してください。`
- F022 \[minor/vp-ops-release-readiness; line=1; anchor=`"# 業務受入条件 作成ルール"`\]: `rulebook を ready 化する前提として、recipe/template の要否判断と schema 不整合解消を未解決事項として明示してください。`
- F023 \[minor/vp-ops-operability; line=49; anchor=`"推奨:"`\]: `BAC の改訂・廃止（deprecated 化）手順と上流仕様変更時の見直し契機を追記してください。`

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
