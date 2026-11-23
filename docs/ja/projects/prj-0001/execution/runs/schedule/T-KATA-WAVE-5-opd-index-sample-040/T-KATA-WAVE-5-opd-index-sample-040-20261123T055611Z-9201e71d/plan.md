---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-opd-index-sample-040-20261123t055611z-9201e71d
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-opd-index-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: rulebook-maintenance
  targets:
    - specdojo:opd-index-sample
    - specdojo:opd-index-rulebook
---

# Edit Plan: T-KATA-WAVE-5-opd-index-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用方針・設計（全体構成）の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、運用方針・設計の全体構成の完成例を示す
- `path`: `docs/ja/specdojo/samples/opd-index-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-opd-index-sample-040/T-KATA-WAVE-5-opd-index-sample-040-20261123T055611Z-9201e71d/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/opd-index-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **OPS（Operations / Release Manager）**
- 責務: 文書群とツールのリリース・公開・配布・変更管理を担う。公開可否の最終判断は PO に残し、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- リリース・公開準備: 公開、配布、ready 化、リリース判断に必要な前提や未解決事項が明示されているか。
- 運用しやすさ: 継続更新、再生成、変更管理、問い合わせ対応、障害時対応に必要な情報が読み取れるか。
- agent 委任境界: agent に最終承認、公開可否判断、説明責任を委ねる記述になっていないか。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-publication-accountability; line=47; anchor=`"- 体制は RACI・当番・優先度別エスカレーション条件、監視・障害・変更管理は条件・判断者・通知先を示す。"`\]: `体制・当番・通知先の記述で個人名・個人連絡先を載せず Role や窓口名で書く旨の制約がなく、公開リポジトリへ個人情報が記載されるおそれがあるため、禁止事項または記述ガイドに明記する。`
- F002 \[minor/vp-ba-requirements-completeness; line=15; anchor=``"`opd-index` を入口・方針の正本とし、`opd-<term>` は差分（補足・具体化・例外）、`opr-*` は実行手順と証跡を担う。"``\]: ``章名が「位置づけと用語定義」なのに SLO・SLA・KPI・RACI・RTO/RPO などの用語定義がなく、移行期文書（`otp-*`）との対象外境界も示されていないため、用語の定義と対象外を追記する。``
- F003 \[minor/vp-dev-implementation-readiness; line=48; anchor=``"- 復旧は RTO/RPO・検証頻度、関連導線は `opr-index` を含める。"``\]: `必須章の「運用の範囲・前提」「権限・アカウント運用」「定期運用方針」「問い合わせ運用方針」に記述ガイドがなく記入基準が定まらないため、各章で最低限書く項目（棚卸し頻度、監査ログ保管、点検周期、窓口・分類・応答 SLA 等）を追記する。`
- F004 \[minor/vp-dev-testability; line=11; anchor=``"- **共通の運用**: 役割は適用先のメンバー定義、`status`・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。整形・lint はリポジトリの検証で扱う。"``\]: `「整形・lint はリポジトリの検証で扱う」だけでは作成後に通すべき検証が特定できないため、Markdown lint と Frontmatter スキーマ検証など確認対象の検証を明記する。`
- F005 \[minor/vp-qe-verifiability; line=52; anchor=`"- コマンド列・逐次チェックリストを大量記載しない。"`\]: ``禁止事項「大量記載しない」の「大量」は判定基準がなく pass/fail を決められないため、「手順は `opr-*` へ委譲し本書には記載しない」など判定可能な表現にする。``
- F006 \[minor/vp-qe-omissions-consistency; line=15; anchor=``"`opd-index` を入口・方針の正本とし、`opd-<term>` は差分（補足・具体化・例外）、`opr-*` は実行手順と証跡を担う。"``\]: `見出し「位置づけと用語定義」に対し用語定義の内容が欠落しており、見出しと中身が一致しないため、用語定義を追加するか見出しを実態に合わせる。`
- F007 \[minor/vp-qe-omissions-consistency; line=51; anchor=`""`\]: `禁止事項に理由が記載されておらず、例外判断やレビュー時の根拠にできないため、各項目に理由を添える（表形式を推奨）。`
- F008 \[major/vp-qe-kata-conformance; line=42; anchor=``"| 12  | 関連ドキュメント導線（`opr-index` 等）             | ○    |"``\]: `本ルールで12章すべてを必須としているが、対応するサンプルに実装されておらず、実効性に欠ける。`
- F009 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 運用方針・設計 全体構成 作成ルール"`\]: `サンプルとしての整合性がなく、rulebook としての機能（ exemplification ）を果たしていない。`
- F010 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 運用方針・設計 全体構成 作成ルール"`\]: ``サンプル `specdojo:opd-index-sample` における rulebook 参照 ID と本ルールの ID が不整合である。``
- F011 \[minor/vp-ux-language-consistency; line=46; anchor=`"- SLO/SLA/KPI の標準列は「指標・数値目標・測定期間・測定方法・証跡・判定者」とする。"`\]: `「SLO/SLA/KPI」と本文構成表の「SLO・SLA・KPI」で表記が揺れ、標準列「数値目標」もサンプルの「目標値」と不一致のため、章名・列名の表記を統一する。`

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

## 変更範囲による実行待ち

- 2026-11-23T05:30:14.229Z: `T-KATA-WAVE-5-opd-index-sample-040` は `T-KATA-WAVE-6-PROJECT-prj-overview-sample-040` の統合を待った。重複: `project:cause.location <> project:cause.location`。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
