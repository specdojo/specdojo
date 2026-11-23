---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-imp-business-sample-040-20261123t122808z-99bbaad6
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-imp-business-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: rulebook-maintenance
  targets:
    - specdojo:imp-business-sample
    - specdojo:imp-business-rulebook
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-imp-business-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 業務への影響調査の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、業務への影響調査の完成例を示す
- `path`: `docs/ja/specdojo/samples/imp-business-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-imp-business-sample-040/T-KATA-WAVE-6-DESIGN-imp-business-sample-040-20261123T122808Z-99bbaad6/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/imp-business-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **BA（Business Analyst）**
- 責務: 仕様を書く人と読む人の利用者視点から、文書体系への要求、利用場面、受入条件を整理する。

このロールが重視するレビュー観点:

- 業務価値との対応: 主要な定義・判断がどの対象者のどの業務課題・期待価値に応えるかを説明でき、主要な成果・方針がその目的に対応しているか。
- 要件・受入条件の充足: 要件、受入条件、対象範囲、対象外が利用者視点で確認できる粒度になっているか。
- 関係者・利用場面の明確性: 関係者、利用場面、合意対象が読み取れるか。文書を確かめる・承認する役割の割り当ては本文に求めない。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=78; anchor=`"- 論点、不足情報、判断・対応への影響と当面の扱いを記載する。未解決事項がなければ「なし」とする。"`\]: `未解決事項の記述項目に判断者（Role code）と決定期限が含まれず、承認・保留・差し戻しを誰がいつ判断するかが読み取れないため、6.6 に判断者と決定期限を必須項目として追加する必要がある。`
- F002 \[minor/vp-po-publication-accountability; line=73; anchor=`"- 影響度が高い項目から順に、実施時期、担当、前提条件を記載する。"`\]: `対応方針の「担当」を Role code で記載するか個人名で記載するかが規定されておらず、sample が個人名を記載しているため、メンバー定義の Role code で記載し個人名を書かないことを記述ガイドまたは禁止事項に明記する必要がある。`
- F003 \[minor/vp-pm-plan-feasibility; line=73; anchor=`"- 影響度が高い項目から順に、実施時期、担当、前提条件を記載する。"`\]: `対応方針に実施時期・担当・前提条件はあるが完了条件の記載が求められておらず、タスク化後の進捗確認で完了を判定できないため、対応項目ごとの完了条件を記載項目に加える必要がある。`
- F004 \[minor/vp-pm-dependency-risk; line=26; anchor=``"共通項目・必須性・型制約は [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。`type` は `project`、`rulebook` は `specdojo:imp-business-rulebook` とする。"``\]: ``上流の変更要求との依存を Frontmatter の `based_on` で宣言する規定がなく、本文の識別子記載だけでは変更要求との依存を機械的に追跡できないため、`based_on` に変更要求 ID を列挙する推奨を追加する必要がある。``
- F005 \[minor/vp-pm-control-reporting; line=78; anchor=`"- 論点、不足情報、判断・対応への影響と当面の扱いを記載する。未解決事項がなければ「なし」とする。"`\]: `未解決事項や見送り判断を PJR の課題・リスク・決定記録へ転記するかどうかと報告先が規定されていないため、転記対象と報告先の扱いを 6.5 または 6.6 に追記する必要がある。`
- F006 \[minor/vp-qe-verifiability; line=67; anchor=`"| 対応方針     | 実施・代替・見送りなどの方針         |"`\]: ``対応方針列の値が「実施・代替・見送りなど」と開いた列挙になっており、6.5 の見送り時規定の適用対象を pass / fail で判定できないため、値を `実施` / `代替` / `見送り` に限定するか追加値の扱いを定める必要がある。``
- F007 \[minor/vp-qe-kata-conformance; line=84; anchor=`"- 影響度の尺度を定義せずに高・中・低を混在させない。"`\]: `Frontmatter で参照する sample が、禁止事項で要求した影響度尺度を定義せずに高・中・低を使用しているため、完成例として rulebook の適用方法を完全には示せていない。`
- F008 \[minor/vp-qe-kata-conformance; line=78; anchor=`"- 論点、不足情報、判断・対応への影響と当面の扱いを記載する。未解決事項がなければ「なし」とする。"`\]: `6.6 は未解決事項に「判断・対応への影響」の記載を求めているが、参照する sample の未解決事項表には影響の列がなく、完成例が rulebook の記述ガイドと一致していないため、sample に影響の記載を加えるか 6.6 の項目を見直す必要がある。`
- F009 \[minor/vp-ux-language-consistency; line=73; anchor=`"- 影響度が高い項目から順に、実施時期、担当、前提条件を記載する。"`\]: `対応方針の並び順は「影響度」、構成表と 6.3 は「優先順位」「優先対応対象」と表現し両者の関係が定義されておらず、sample が「優先度」列を用いているため、影響度と優先度の関係を定義するか用語を統一する必要がある。`
- F010 \[minor/vp-ops-release-readiness; line=1; anchor=`"# 影響調査（業務）作成ルール"`\]: ``Frontmatter の `recipe` と `template` が `undecided` のままで要否判断が未了のため、ready 化の前に `not-needed` か整備対象かを判断して宣言する必要がある。``

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
