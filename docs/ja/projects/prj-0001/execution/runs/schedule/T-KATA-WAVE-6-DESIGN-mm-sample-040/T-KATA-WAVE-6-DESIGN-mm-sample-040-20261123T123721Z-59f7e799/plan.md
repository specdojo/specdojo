---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-mm-sample-040-20261123t123721z-59f7e799
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-mm-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: rulebook-maintenance
  targets:
    - specdojo:mm-sample
    - specdojo:mm-rulebook
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-mm-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 議事録の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、議事録の完成例を示す
- `path`: `docs/ja/specdojo/samples/mm-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-mm-sample-040/T-KATA-WAVE-6-DESIGN-mm-sample-040-20261123T123721Z-59f7e799/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/mm-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PM（Project Manager）**
- 責務: 参考資料整備と成果物作成の計画・進捗・課題・リスクを管理する。小規模運用では専任化せず、実行主体は pm-members.yaml で管理する。

このロールが重視するレビュー観点:

- 計画化可能性: 成果物の内容がタスク化、順序付け、所要時間見積もり、進捗確認に使える粒度になっているか。
- 依存関係・リスク・課題化: 後続成果物、Schedule、PJR に影響する依存、リスク、課題、変更要求が識別されているか。
- 管理・報告への接続: 進捗、課題、リスク、変更要求、決定記録へ転記すべき事項が分離されているか。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=12; anchor=`"## 2. 位置づけ"`\]: `「位置づけ」の記述が不十分であり、プロジェクト全体の成果物体系やトラックにおける役割が明示されていない。`
- F002 \[minor/vp-po-decision-readiness; line=1; anchor=`"# 議事録 作成ルール"`\]: `draft 状態であるが、PO が承認を判断するための未決事項や影響範囲が明示されていない。`
- F003 \[minor/vp-po-publication-accountability; line=32; anchor=`"## 5. 記述ガイド"`\]: `議事録に記載すべきでない情報（非公開情報や個人情報）の扱いや公開方針に関する記述がない。`
- F004 \[minor/vp-pm-plan-feasibility; line=35; anchor=`"- アクションには担当者と期限を必ず付与する。"`\]: `アクションアイテムに担当者・期限以外の完了条件や状態（未着手・完了など）の記録項目が定義されておらず、「追跡可能に記録する」方針に対して進捗確認で完了を判定できない。担当者を人名と Role code のどちらで記すかも定めるべきである。`
- F005 \[minor/vp-pm-dependency-risk; line=1; anchor=`"# 議事録 作成ルール"`\]: `後続成果物への影響や依存関係、および導入時のリスクが識別されていない。`
- F006 \[minor/vp-pm-control-reporting; line=12; anchor=`"## 2. 位置づけ"`\]: `議事録から進捗報告や課題管理表（PJRなど）へ転記すべき事項の分離基準が示されていない。`
- F007 \[minor/vp-ba-business-value; line=5; anchor=`"## 1. 全体方針"`\]: `誰のどのような課題を解決するためにこの議事録ルールが存在するのか（業務課題や期待効果）が明記されていない。`
- F008 \[minor/vp-ba-requirements-completeness; line=5; anchor=`"## 1. 全体方針"`\]: `対象範囲（どのような会議でこの議事録が必須となるか）や対象外の会議の定義がない。`
- F009 \[minor/vp-ba-stakeholder-clarity; line=32; anchor=`"## 5. 記述ガイド"`\]: `議事録の確認者や承認者、および合意事項に関する記述が不足している。`
- F010 \[minor/vp-arc-technical-constraints; line=17; anchor=`"## 3. ファイル命名・ID規則"`\]: `Markdown 以外のフォーマットの使用可否や技術的な制約が明示されていない。`
- F011 \[minor/vp-dev-implementation-readiness; line=23; anchor=`"## 4. 本文構成（標準テンプレ）"`\]: `自動生成やツール連携を行う場合に必要な、入力・出力の制約や作業対象が読み取れない。`
- F012 \[minor/vp-dev-change-impact; line=17; anchor=`"## 3. ファイル命名・ID規則"`\]: `ファイル命名規則やID規則を変更した場合の既存成果物への影響が識別されていない。`
- F013 \[minor/vp-dev-testability; line=32; anchor=`"## 5. 記述ガイド"`\]: `作成された議事録がルールに準拠しているかを検証する手段（lint、検証コマンドなど）が示されていません。`
- F014 \[minor/vp-qe-verifiability; line=38; anchor=`"## 6. 禁止事項"`\]: `「結論不明の議論のみを羅列しない」「過度に記載しない」といった禁止事項が主観的で、客観的に判定しづらい。`
- F015 \[minor/vp-qe-verifiability; line=19; anchor=``"- 推奨: `mm-<yyyy-mm-dd>-<nn>.md`"``\]: ``ファイル名規則が「推奨」とされ、21行目の文書 ID 形式（必須）との関係も不明なため、`mm-＜yyyy-mm-dd＞-＜nn＞.md` に従わないファイル名が違反か否かを pass / fail で判定できない。必須か任意かを明記すべきである。``
- F016 \[minor/vp-qe-omissions-consistency; line=23; anchor=`"## 4. 本文構成（標準テンプレ）"`\]: `` `template: not-needed` の系統だが本文構成の表が見出しと必須の印だけで、会議情報の項目（会議名・日時・参加者）、決定事項・アクションアイテムの表の列などの本文要件が定義されておらず、sample にしか現れていない。 ``
- F017 \[minor/vp-qe-kata-conformance; line=23; anchor=`"## 4. 本文構成（標準テンプレ）"`\]: `rulebook-authoring-standard の要件（第4章を「本文要件」として各章の目的を記載、必須章ごとに3項目以上、推奨表のカラム定義の提示、自系統の改訂追従対象と担当 Role code）を満たしていない。`
- F018 \[minor/vp-ux-readability; line=32; anchor=`"## 5. 記述ガイド"`\]: `「記述ガイド」の内容が簡潔すぎるため、具体的にどのような記述が「良い/悪い」のかを判断するための例示や詳細な基準が不足している。`
- F019 \[minor/vp-ux-readability; line=3; anchor=`"Meeting Minutes Documentation Rulebook"`\]: `H1 直下に本書の対象と目的を一文で示す導入文がなく、初見の読者が本書の役割を把握しにくい。`
- F020 \[minor/vp-ux-language-consistency; line=32; anchor=`"## 5. 記述ガイド"`\]: `「記述ガイド」で言及されている「保留事項」が、本文構成の標準テンプレには含まれておらず、一貫性がない。`
- F021 \[minor/vp-ops-operability; line=1; anchor=`"# 議事録 作成ルール"`\]: `ルールブック自体の継続更新手順や、記述内容に関する問い合わせ先（担当 Role code など）が読み取れない。`

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
