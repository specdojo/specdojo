---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-otp-sample-040-20261123t075705z-da540b58
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-otp-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: rulebook-maintenance
  targets:
    - specdojo:otp-sample
    - specdojo:otp-rulebook
---

# Edit Plan: T-KATA-WAVE-5-otp-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用切替計画（対象別）の完成例
- `depends_on`:
  - [[specdojo:otp-index-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、運用切替計画の対象別の完成例を示す
- `path`: `docs/ja/specdojo/samples/otp-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-otp-sample-040/T-KATA-WAVE-5-otp-sample-040-20261123T075705Z-da540b58/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/otp-rulebook.md`
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

- F001 \[minor/vp-po-publication-accountability; line=115; anchor=`"- ハイパーケア期間、当番体制、SLA（一次応答/暫定復旧など）を明記する"`\]: `当番・窓口・指揮系統・責任者の記載を求めているのに、個人名・電話番号・個人の連絡先を書かず Role code や公開可能なチャネル名で書く制約がないため、禁止事項に「個人名・連絡先等の公開不適切情報」を追加すべきである。`
- F002 \[minor/vp-ba-requirements-completeness; line=66; anchor=`"- 対象範囲（どの運用領域/チーム/サービスが対象か）を明記する"`\]: ``概要で対象範囲の明記だけを求め、対象外（当日手順の `cop-*`、共通方針の `otp-index` などへ委ねる範囲）の明記を求めていないため、term 間や関連文書との境界を確認できるよう「対象外」も必須項目に加えるべきである。``
- F003 \[minor/vp-dev-testability; line=35; anchor=``"許可キー・必須項目・型制約は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] と `docs/specdojo/schemas/v1/deliverable-frontmatter.schema.yaml` を正本とする。"``\]: ``Frontmatter の正本は示されているが、作成後に実行する検証（`npm run lint:fm` による `type: operations` と rulebook 宣言の照合、`npm run lint:md`、必須 11 章の順序確認）が示されていないため、確認手順を追記すべきである。``
- F004 \[minor/vp-qe-verifiability; line=131; anchor=`"- 完了条件（重大障害未発生期間、問い合わせ収束、運用手順整備完了等）を列挙する"`\]: `クローズ条件の列挙だけを求め、未発生期間の日数や問い合わせ件数などを定量的な閾値として書く要件がないため、収束を判定できるよう判定値と測定方法の記載を必須にすべきである。`
- F005 \[minor/vp-qe-verifiability; line=30; anchor=``"- ファイル名は `otp-020-運用切替計画-<term>.md` 等、プロジェクト内で一意になるように命名する。"``\]: ``ファイル名を「`otp-020-運用切替計画-＜term＞.md` 等」としており命名の合否を判定できないため、許容する命名パターンを確定して記載すべきである。``
- F006 \[major/vp-qe-omissions-consistency; line=115; anchor=`"- ハイパーケア期間、当番体制、SLA（一次応答/暫定復旧など）を明記する"`\]: ``全体方針と禁止事項は期間・SLA・優先度分類・クローズ基準を `otp-index` の共通方針として重複記載を禁じているのに、6.6・6.8・6.10 はそれらの明記を求めており矛盾するため、「`otp-index` を参照し、term 固有の差分・上書きだけを記載する」と各節に明示すべきである。``
- F007 \[major/vp-qe-kata-conformance; line=124; anchor=`"### 6.9. 旧システムの停止/参照方針"`\]: `対応する otp-sample が、9 章の停止時期・データ保持/アーカイブ方針、3 章の保管先・完了基準、6 章の優先度分類・エスカレーション条件、7 章の判断基準、10 章のクローズ判断者・最終報告物など、rulebook が明記を求める項目を欠いており、11 章の見出しも rulebook と異なるため、sample を rulebook の必須項目に合わせて補うべきである。`
- F008 \[minor/vp-qe-kata-conformance; line=42; anchor=``"`otp-<term>` は以下の見出し構成を **順序固定** で配置します。"``\]: `rulebook-authoring-standard の「本文要件」は各章の目的と必須・任意の明示を求めるが、本文構成の表には目的の列がなく見出しの羅列になっているため、章ごとの目的（要点）の列を追加すべきである。`
- F009 \[minor/vp-ux-language-consistency; line=101; anchor=`"### 6.6. 問合せ窓口/一次対応"`\]: `「問合せ」と「問い合わせ」、「クローズ基準」と「クローズ条件」の表記が混在し、同じ概念か別の概念かが読み手に分からないため、どちらかに統一すべきである。`

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
