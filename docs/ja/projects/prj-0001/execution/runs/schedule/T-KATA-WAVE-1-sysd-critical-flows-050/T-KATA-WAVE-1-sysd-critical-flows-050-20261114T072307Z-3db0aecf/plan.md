---
specdojo:
  id: prj-0001:xep-t-kata-wave-1-sysd-critical-flows-050-20261114t072307z-3db0aecf
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-1-sysd-critical-flows-050
  name: "sample の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - sysd-critical-flows
    - specdojo:sysd-critical-flows-sample
---

# Edit Plan: T-KATA-WAVE-1-sysd-critical-flows-050

## 1. このフェーズで行うこと

新しく作った型の文書（rulebook・recipe・sample・template）は、packages/docs-site/.vitepress/sidebar-config.ts の型のメニューにも足す（tests/packages/docs-site/sidebar-kata.test.ts が確かめる）。
改訂した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として手入れする。代表（prj-0001）の内容を写さず、判断に要る場面・例外を拾う。成果物本体は変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: システム設計（重要フロー）
- `depends_on`:
  - [[sysd-index]]
  - [[prj-0001:cdfd-task-execution]]
  - [[prj-0001:cdfd-register-lifecycle]]
  - [[prj-0001:cdfd-multi-project]]
- `overview`: 事故や仕様誤解の原因になりやすい重要フローのみを可視化する（最大5フロー）
- `path`: `docs/ja/product/040-system-design/sysd-critical-flows.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-1-sysd-critical-flows-050/T-KATA-WAVE-1-sysd-critical-flows-050-20261114T072307Z-3db0aecf/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/sysd-critical-flows-sample.md`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-po-purpose-alignment; line=1; anchor=`"# 重要フロー サンプル"`\]: `文書には抽象的な目的文は定義されていますが、対象となるキャンディショップの販売管理システムに関する具体的なクリティカルフローやアーキテクチャ上の決定事項が記述されていないため、その必要性や目的との整合性が満たされていません。`
- F002 \[major/vp-po-decision-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `具体的な決定ポイント、前提条件、ビジネスへの影響、および意思決定者が、一般的な未解決事項として示されているだけで特定されておらず、プロダクトオーナーが承認や準備状況を判断することが不可能です。`
- F003 \[minor/vp-po-publication-accountability; line=1; anchor=`"# 重要フロー サンプル"`\]: `文書には、サンプル成果物に対する人間の承認責任や公開の責任が明記されていません。`
- F004 \[major/vp-pm-plan-feasibility; line=13; anchor=`"## 3. 記述内容"`\]: `文書には抽象的な説明しかなく、プロジェクトのスケジューリングやタスク分解に必要な具体的なワークフローのステップ、作業単位、完了基準、またはロールコードが提供されていません。`
- F005 \[major/vp-pm-dependency-risk; line=26; anchor=`"## 5. 未解決事項"`\]: `テスト仕様書や運用手順書などの後続の成果物への依存関係、およびリスクやプロジェクトの課題が特定されていません。`
- F006 \[minor/vp-pm-control-reporting; line=26; anchor=`"## 5. 未解決事項"`\]: `未解決事項には、報告先、具体的なアクションポリシー、および進捗管理のための割り当てられたロールコードといった追跡用メタデータが不足しています。`
- F007 \[major/vp-ba-business-value; line=7; anchor=`"## 2. 入力情報"`\]: `文書には、キャンディショップの販売管理システムにおける具体的なビジネス上の問題、ユーザーペルソナ、期待される価値、または失敗時の運用への影響が記述されていません。`
- F008 \[major/vp-ba-requirements-completeness; line=7; anchor=`"## 2. 入力情報"`\]: `クリティカルフローに関する要件、受け入れ基準、および明示的なインスコープとアウトオブスコープの境界が完全に欠落しています。`
- F009 \[minor/vp-ba-stakeholder-clarity; line=1; anchor=`"# 重要フロー サンプル"`\]: `特定のステークホルダー、ユーザーペルソナ、運用ロール、および承認者が、一般的な部署名以外に明確に特定されていません。`
- F010 \[major/vp-arc-technical-constraints; line=13; anchor=`"## 3. 記述内容"`\]: `クリティカルフローに必要な技術的制約、永続化ポイント、外部依存関係、および一貫性モデルが指定されていません。`
- F011 \[minor/vp-arc-conciseness; line=18; anchor=`"## 4. 最小記述例"`\]: `セクション3とセクション4の表は、目的と主な内容に関して同一の文章を重複して記載しており、追加の意思決定価値を提供していません。`
- F012 \[major/vp-arc-single-responsibility; line=1; anchor=`"# 重要フロー サンプル"`\]: `成果物の完成例（sample）としての責務ではなく、書き方のガイドとしての記述になっており、役割が不適切である。`
- F013 \[major/vp-dev-implementation-readiness; line=13; anchor=`"## 3. 記述内容"`\]: `文書には、開発者がフローを実装するために必要な具体的な入力、出力、スキーマ、永続化トリガー、および完了基準が不足しています。`
- F014 \[minor/vp-dev-change-impact; line=13; anchor=`"## 3. 記述内容"`\]: `フローに関する既存のシステム、スキーマ、インターフェース、および後方互換性への影響範囲が特定されていません。`
- F015 \[major/vp-dev-testability; line=13; anchor=`"## 3. 記述内容"`\]: `テストの観点、期待される結果、検証コマンド、およびエラーハンドリングの検証が完全に欠落しています。`
- F016 \[major/vp-qe-verifiability; line=21; anchor=`"| ------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |"`\]: `冪等性や失敗時挙動など, pass/fail を判定可能な具体的な設定値や基準の例が記載されていない。`
- F017 \[blocker/vp-qe-omissions-consistency; line=3; anchor=`"## 1. 目的と適用範囲"`\]: `rulebook で順序固定とされている5章構成（概要、一覧、詳細、観測性、導線）を無視し、必須項目がほぼすべて欠落している。`
- F018 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# 重要フロー サンプル"`\]: `rulebook で必須とされている「5. 関連ドキュメント導線」章が欠落しており、他成果物との整合性を確認できない。`
- F019 \[blocker/vp-qe-kata-conformance; line=1; anchor=`"# 重要フロー サンプル"`\]: `rulebook が定義する構成に従っておらず、具体的な完成例として機能していないため, sample として不適格である。`
- F020 \[major/vp-ux-readability; line=21; anchor=`"| ------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |"`\]: `「最小記述例」の内容がドキュメントのメタ情報に留まっており、初見の読者が重要フローの書き方を理解できる具体例になっていない。`
- F021 \[minor/vp-ux-language-consistency; line=15; anchor=`"- 主な内容: 最大5フロー（冪等/補償/非同期/順序/整合性/外部I/F障害など）について、境界・永続化点・再実行性・失敗時挙動を図または箇条書きで定義"`\]: `Standard terms and naming conventions defined in the rulebook (such as flow ID prefix 'scf-xxx', persistence points, and compensation) are not concretely utilized.`
- F022 \[minor/vp-ops-release-readiness; line=26; anchor=`"## 5. 未解決事項"`\]: `ドラフトから準備完了への移行基準、リリース前のレビューチェックリスト、および承認ロールが指定されていません。`
- F023 \[major/vp-ops-operability; line=1; anchor=`"# 重要フロー サンプル"`\]: `Operational monitoring requirements, trace_id propagation, alerting conditions, and maintenance escalation procedures required by the rulebook are completely missing.`

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
