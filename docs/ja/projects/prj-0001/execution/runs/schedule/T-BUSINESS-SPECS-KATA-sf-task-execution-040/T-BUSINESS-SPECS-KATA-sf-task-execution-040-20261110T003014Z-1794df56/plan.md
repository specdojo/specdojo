---
specdojo:
  id: prj-0001:xep-t-business-specs-kata-sf-task-execution-040-20261110t003014z-1794df56
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-KATA-sf-task-execution-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: rulebook-maintenance
  targets:
    - sf-task-execution
    - specdojo:sf-rulebook
---

# Edit Plan: T-BUSINESS-SPECS-KATA-sf-task-execution-040

## 1. このフェーズで行うこと

代表成果物の実績から sf-rulebook・cdt-rulebook・ccd-mermaid-rulebook・bdd-rulebook・ifx-cmd-rulebook のうち対応する rulebook を手入れする。成果物本体は変更しない。sample の完成例は後続の sample-maintenance で整備する。ifx-cmd の recipe・template は後続の専用段で同期する。他の系統で新たに必要と判断した recipe・template は対応結果に次の作業案を残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: システム化機能（タスク実行）
- `depends_on`:
  - [[sf-index]]
  - [[bps-task-selection-preparation]]
- `overview`: タスク実行機能（タスク選択・claim・agent実行・検証・完了処理・worktree隔離と統合）の入出力、処理要件、外部連携を定義する
- `path`: `docs/ja/product/010-business-specs/050-system-functions/sf-task-execution.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-KATA-sf-task-execution-040/T-BUSINESS-SPECS-KATA-sf-task-execution-040-20261110T003014Z-1794df56/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/sf-rulebook.md`
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

- F001 \[major/vp-po-purpose-alignment; line=4; anchor=`""`\]: `ドキュメントには、プロジェクトの目的、必要性、SFLの期待される効果、および要件などの上位ドキュメントとの関係についての明確な定義が不足しています。`
- F002 \[major/vp-po-decision-readiness; line=4; anchor=`""`\]: `POによる承認基準、未解決事項の扱い、またはSFLの影響範囲が定義されていません。`
- F003 \[major/vp-po-publication-accountability; line=4; anchor=`""`\]: `公開の責任、対象読者、および機密情報やプライベートな情報の取り扱いに関するポリシーが記載されていません。`
- F004 \[major/vp-pm-plan-feasibility; line=27; anchor=`"- 機能名・概要は業務観点で記述し、実装技術や画面遷移手順など実装詳細は含めない。"`\]: `ルールブックには、各機能定義を管理可能なタスクに変換するための、ロールコード、done criteria、またはスケジュールのマイルストーンが提供されていません。`
- F005 \[major/vp-pm-dependency-risk; line=27; anchor=`"- 機能名・概要は業務観点で記述し、実装技術や画面遷移手順など実装詳細は含めない。"`\]: `依存関係、下流への影響（UIやDBの設計など）、およびリスク管理ポリシーが特定されていません。`
- F006 \[major/vp-pm-control-reporting; line=27; anchor=`"- 機能名・概要は業務観点で記述し、実装技術や画面遷移手順など実装詳細は含めない。"`\]: `進捗報告、課題の追跡、および変更要求の処理プロセスが分離または定義されていません。`
- F007 \[major/vp-ba-business-value; line=4; anchor=`""`\]: `機能と、特定のビジネス上の課題、期待される価値、またはビジネスの成功基準との接続が欠落しています。`
- F008 \[major/vp-ba-requirements-completeness; line=27; anchor=`"- 機能名・概要は業務観点で記述し、実装技術や画面遷移手順など実装詳細は含めない。"`\]: `スコープの境界（インスコープとアウトオブスコープ）およびユーザー中心の受け入れ基準が、十分な粒度で定義されていません。`
- F009 \[major/vp-ba-stakeholder-clarity; line=27; anchor=`"- 機能名・概要は業務観点で記述し、実装技術や画面遷移手順など実装詳細は含めない。"`\]: `ステークホルダー、ユーザー、レビュアー、および合意を必要とする特定の事項が明確に述べられていません。`
- F010 \[major/vp-arc-technical-constraints; line=31; anchor=`""`\]: `技術的な制約、外部システムへの依存関係、またはアーキテクチャのガイドラインを定義する明確な構造がありません。`
- F011 \[minor/vp-arc-conciseness; line=22; anchor=``"一覧ハブには `sf-index`、個別機能には `sf-<機能名>` を付与してください（例: `sf-product-register`）。"``\]: `IDの正規表現定義が 17 行目と重複しているため、統合して簡潔に記述すべきである。`
- F012 \[major/vp-dev-implementation-readiness; line=31; anchor=`""`\]: `詳細設計や実装を開始するために必要な入力要件、制約、およびDone Criteriaが指定されていません。`
- F013 \[major/vp-dev-change-impact; line=31; anchor=`""`\]: `ルールブックには、SFLの変更が下流の成果物や既存のシステムに与える影響を特定する方法が定義されていません。`
- F014 \[major/vp-dev-testability; line=74; anchor=`""`\]: `SFLの一貫性やフォーマット（例：lintコマンド）を検証するための手順や、期待されるテスト結果が欠落しています。`
- F015 \[major/vp-qe-verifiability; line=31; anchor=`""`\]: `各機能が品質基準や受け入れ条件を満たしているかどうかを検証するための、客観的な合否基準がありません。`
- F016 \[major/vp-qe-omissions-consistency; line=11; anchor=`"| title      | 機能一覧名                    | ○    |"`\]: `メタデータ定義（10行目）の domain 固定という指定と、本行およびサンプルでの data という記述が矛盾している。`
- F017 \[major/vp-qe-kata-conformance; line=2; anchor=`""`\]: `指定サンプル sf-sample.md が, 本ルールで定義されている「1行1機能の表形式」に従わず, 個別機能の詳細定義文書となっており矛盾している。`
- F018 \[major/vp-qe-kata-conformance; line=2; anchor=`""`\]: `指定サンプル sf-sample.md の構成が本ルールの定義（機能一覧表の作成）と完全に乖離しており、適用方法が不明確である。`
- F019 \[major/vp-ux-readability; line=2; anchor=`""`\]: `type 値の矛盾および指定サンプルの不整合により、正しくどのような成果物を作成すべきか判断できず、読者を混乱させる。`
- F020 \[major/vp-ux-language-consistency; line=11; anchor=`"| title      | 機能一覧名                    | ○    |"`\]: `メタデータの type フィールドにおいて, 定義値 (domain) と解説・サンプル値 (data) が統一されていない。`
- F021 \[major/vp-ops-release-readiness; line=6; anchor=`""`\]: `SFLを準備完了状態に移行するための前提条件と、リリース承認の基準が指定されていません。`
- F022 \[major/vp-ops-operability; line=74; anchor=`""`\]: `継続的なアップデート、変更管理、およびプロジェクト期間中の連絡先に関する運用ガイドラインが欠落しています。`

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
