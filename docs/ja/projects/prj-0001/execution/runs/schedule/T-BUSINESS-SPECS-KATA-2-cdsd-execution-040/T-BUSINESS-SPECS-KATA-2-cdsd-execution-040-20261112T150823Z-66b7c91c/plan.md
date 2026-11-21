---
specdojo:
  id: prj-0001:xep-t-business-specs-kata-2-cdsd-execution-040-20261112t150823z-66b7c91c
  type: exec-plan
  rulebook: none
  task_id: T-BUSINESS-SPECS-KATA-2-cdsd-execution-040
  name: "rulebook の見直し"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: rulebook-maintenance
  targets:
    - cdsd-execution
    - specdojo:cdsd-rulebook
---

# Edit Plan: T-BUSINESS-SPECS-KATA-2-cdsd-execution-040

## 1. このフェーズで行うこと

代表成果物の実績から stsd-rulebook・cdsd-rulebook・cdfd-uc-rulebook・clis-rulebook・ifx-cmd-rulebook のうち対応する rulebook を手入れする。成果物本体は変更しない。sample の完成例は後続の sample-maintenance で整備する。ifx-cmd の recipe・template は、rulebook の改訂に合わせて同じ段で同期する。他に必要と判断した recipe・template は対応結果に次の作業案を残す。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、rulebook にサンプルの章を置かず完成例を sample に外出しする。Markdown の ##〜#### の見出しに階層ごとの連番を付ける。記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さの完成例にする（YAML の sample は対象形式に合わせて内容を充実させる）。recipe と template の要否を決め、rulebook frontmatter に対応する ID または not-needed を宣言し、判断理由を result に残す。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 概念データストア定義（プロジェクト実行）
- `depends_on`:
  - [[bdd-exec-event]]
  - [[bdd-exec-state]]
  - [[bdd-exec-plan-result]]
  - [[bdd-exec-evidence]]
  - [[bdd-worktree-branch]]
  - [[bdd-routine-definition]]
  - [[bdd-job-run]]
- `overview`: プロジェクト実行で扱うデータストア（実行イベント・状態、plan/result、worktree、定期処理、Job Run等）を一覧で定義する
- `path`: `docs/ja/product/010-business-specs/020-data-model/cdsd-execution.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-BUSINESS-SPECS-KATA-2-cdsd-execution-040/T-BUSINESS-SPECS-KATA-2-cdsd-execution-040-20261112T150823Z-66b7c91c/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/cdsd-rulebook.md`
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

- F001 \[major/vp-po-purpose-alignment; line=1; anchor=`"# 概念データストア定義 作成ルール"`\]: `成果物の主要な目的と上位文書への参照、主要な定義と上位根拠との対応が不足しており、目的を果たすための具体的な基準が不十分である。`
- F002 \[major/vp-po-decision-readiness; line=1; anchor=`"# 概念データストア定義 作成ルール"`\]: `` `status: draft`、`recipe: undecided`、`template: undecided` の解消に必要な判断事項、判断者、影響範囲、次アクションを明示しないと、PO が ready 化の可否を判断できない。 ``
- F003 \[minor/vp-po-publication-accountability; line=1; anchor=`"# 概念データストア定義 作成ルール"`\]: `公開対象、公開前確認、および最終承認を担う人間の Role code がないため, draft 文書を誰が公開可能と判断するか明示する必要がある。`
- F004 \[major/vp-pm-plan-feasibility; line=12; anchor=`"## 1. メタデータ"`\]: `` `type` メタデータの値の不整合は解決されましたが、ドキュメントには完了チェックリスト、受け入れ基準、作業単位、および割り当てられた Role コードが不足しており、検証可能な完了条件を伴うタスクの分解ができない状態です。 ``
- F005 \[minor/vp-pm-dependency-risk; line=30; anchor=`"- 仕様間（BDD／SLL／CCD／用語集）で名称の整合性を保つ。"`\]: `BDD、SLL、CCD、用語集との整合を要求しているが、文書識別子、参照先、変更時に確認する項目がなく、依存先への影響を追跡できない。`
- F006 \[major/vp-pm-control-reporting; line=1; anchor=`"# 概念データストア定義 作成ルール"`\]: `進捗、課題、リスク、変更要求、決定記録へ転記すべき事項の分離、PJR 転記候補、報告先、担当 Role code が記述されていない。`
- F007 \[major/vp-ba-business-value; line=1; anchor=`"# 概念データストア定義 作成ルール"`\]: `主要な定義がどの対象者のどの業務課題や期待価値に応えるか、放置時の影響、成功基準や判断理由の記述が不足している。`
- F008 \[major/vp-ba-requirements-completeness; line=12; anchor=`"## 1. メタデータ"`\]: `` `type` 値の競合は `data` に統一されましたが、ルールブックには依然として明示的な受け入れ基準、明確なスコープ境界（スコープ内 vs スコープ外）、および適切に構造化されたテーブルが不足しており、ユーザーが要件を曖昧さなく検証することを妨げています。 ``
- F009 \[minor/vp-ba-stakeholder-clarity; line=5; anchor=`"本ドキュメントは、業務分析・要求定義・システム設計のために **概念データストア定義を記述する標準ルール** です。"`\]: `利用工程だけでなく、概念データストア定義の作成者、業務確認者、最終合意者を Role code で明示する必要がある。`
- F010 \[minor/vp-arc-technical-constraints; line=12; anchor=`"## 1. メタデータ"`\]: `` `type` メタデータにおける `domain` と `data` の競合は解消されましたが、スキーマ参照、外部依存関係、および検証手順などの技術的な制約がまだ不足しています。 ``
- F011 \[minor/vp-dev-implementation-readiness; line=12; anchor=`"## 1. メタデータ"`\]: `` `type: data` に関する競合は解消され、フロントマターの実装が可能になりましたが、実装に必要な特定の入力、ファイルの配置パス、および完了条件が未規定のままです。 ``
- F012 \[major/vp-dev-change-impact; line=30; anchor=`"- 仕様間（BDD／SLL／CCD／用語集）で名称の整合性を保つ。"`\]: `ルール変更時に BDD、SLL、CCD、用語集、指定サンプル、schema・生成処理のどれを同期更新するか定義されておらず、既存成果物への変更影響を管理できない。`
- F013 \[major/vp-dev-testability; line=12; anchor=`"## 1. メタデータ"`\]: ``競合する `type` 値は解消されましたが、適合性をテストするための検証手順、検証コマンド（lint, schema）、または期待される結果がまだ指定されていません。``
- F014 \[major/vp-qe-verifiability; line=12; anchor=`"## 1. メタデータ"`\]: `メタデータ表と標準列表がそれぞれ空行で分断され、Markdown の表として成立しないため、必須項目と標準列を表に基づいて検証できない。`
- F015 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# 概念データストア定義 作成ルール"`\]: `「位置づけ」節および「禁止事項」節が欠落しており、成果物の役割定義と制約事項の提示が不十分である。`
- F016 \[major/vp-qe-omissions-consistency; line=12; anchor=`"## 1. メタデータ"`\]: ``空行により `title`、`status`、`supersedes` がメタデータ表から外れ、同様に標準列の5項目も表から外れているため、必須キーと必須列の定義が構造上欠落している。``
- F017 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 概念データストア定義 作成ルール"`\]: ``指定されているサンプル `specdojo:cdsd-sample` が、本ルールで定義した標準列（データストア名、対応プロセス等）を一切使用しておらず、整合性が完全に欠如している。``
- F018 \[minor/vp-ux-readability; line=1; anchor=`"# 概念データストア定義 作成ルール"`\]: `「位置づけ」の記述がないため、初見の読者がプロジェクトのどのタイミングで、どのような目的で本書を扱うべきか把握しにくい。`
- F019 \[minor/vp-ux-readability; line=12; anchor=`"## 1. メタデータ"`\]: `メタデータ表と標準列表の途中に空行があり、後半の行が表として表示されないため, 項目同士の対応関係を読み取りにくい。`
- F020 \[major/vp-ops-release-readiness; line=1; anchor=`"# 概念データストア定義 作成ルール"`\]: `` `draft` から `ready` へ移行する条件、`undecided` の recipe・template を確定する手順、承認者、公開前確認項目がなく、リリース可否を判断できない。 ``
- F021 \[minor/vp-ops-operability; line=20; anchor=``"| status | `draft`/`ready`/`deprecated` | ○ |"``\]: `` `status` と `supersedes` の値だけで、ルール変更時のサンプル同期、履歴記録、問い合わせ先、非互換変更への対応手順が定義されていない。 ``

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
