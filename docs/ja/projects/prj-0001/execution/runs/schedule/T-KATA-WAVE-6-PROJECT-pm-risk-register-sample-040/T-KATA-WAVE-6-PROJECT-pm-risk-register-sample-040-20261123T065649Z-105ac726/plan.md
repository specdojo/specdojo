---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-pm-risk-register-sample-040-20261123t065649z-105ac726
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: rulebook-maintenance
  targets:
    - specdojo:pm-risk-register-sample
    - specdojo:pm-risk-register-rulebook
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: リスク登録簿の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、リスク登録簿の完成例を示す
- `path`: `docs/ja/specdojo/samples/pm-risk-register-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-040/T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-040-20261123T065649Z-105ac726/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/pm-risk-register-rulebook.md`
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

- F001 \[major/vp-po-publication-accountability; line=46; anchor=`"- リスクID、内容、発生確率、影響度、優先度、対応策、担当、ステータスを一覧にする。"`\]: `承認責任はドキュメントメタ情報標準に任せることで解消したが、担当列を必須にしながら個人名・連絡先・非公開のリスク内容（要員や取引先に関する情報など）を書かない制限も、担当を Role code で書く指定もないため、公開リポジトリに不適切な情報が載るおそれがある。禁止事項か記述ガイドに公開してよい情報の範囲を加える必要がある。`
- F002 \[minor/vp-pm-dependency-risk; line=51; anchor=`"- 発生確率と影響度の段階ごとの判定条件と、その組み合わせから優先度を決める対応表を書く。"`\]: `導入文で抑えるべき影響に納期を挙げているが、影響度の判定条件にスケジュールや後続成果物への影響を観点として含める指定がなく、リスクのスケジュールへの影響を一貫して識別できない。判定観点の例として明記する必要がある。`
- F003 \[minor/vp-pm-control-reporting; line=57; anchor=`"- 受容する場合は、受容を判断した者と、許容する残存影響を書く。"`\]: `受容の判断を決定記録へ転記するかと、課題・変更要求へ移したあとの元のリスクの扱い（ステータスをクローズにするか継続監視するか）が定義されておらず、リスクと決定・課題の記録が重複したり宙に浮いたりするおそれがある。`
- F004 \[minor/vp-ba-requirements-completeness; line=15; anchor=`"- 本書の判断基準は、個票と、登録簿を使わない単独のリスク登録簿の両方に適用する。"`\]: `判断基準を個票にも適用するとしながら、本文構成 6 章（とくに共通の評価基準・モニタリング・概要）を個票運用ではどこに書くかの対応が示されておらず、個票運用の利用者が満たすべき要件を確認できない。`
- F005 \[minor/vp-dev-implementation-readiness; line=14; anchor=``"- プロジェクト登録簿を使うプロジェクトでは、リスク 1 件を `item_type: risk` の個票に書き、`controls/generated/pm-risk-register.md` は `register build` が個票から生成する。生成物の Frontmatter は `rulebook: specdojo:pjr-rulebook` とし、直接編集しない（[[specdojo:pjr-rulebook|プロジェクト登録簿 作成ルール]] に従う）。"``\]: `個票で発生確率・影響度・対応策・期限・完了条件・受容判断者を、どの Frontmatter フィールドまたは本文の章に書くかが示されておらず、pjr-rulebook への参照だけでは個票作成時の入力先を特定できない。`
- F006 \[minor/vp-dev-change-impact; line=21; anchor=``"- リスク ID は登録簿では `PJR-XXXX`、単独の登録簿では `RK-NNN` とし、再利用しない。"``\]: ``単独の登録簿（`RK-NNN`）からプロジェクト登録簿（`PJR-XXXX`）へ移るときの ID の対応付け、既存の `pm-risk-register.md` と生成ビューの衝突の扱いが定義されておらず、運用を切り替える際の影響を判断できない。``
- F007 \[minor/vp-dev-testability; line=14; anchor=``"- プロジェクト登録簿を使うプロジェクトでは、リスク 1 件を `item_type: risk` の個票に書き、`controls/generated/pm-risk-register.md` は `register build` が個票から生成する。生成物の Frontmatter は `rulebook: specdojo:pjr-rulebook` とし、直接編集しない（[[specdojo:pjr-rulebook|プロジェクト登録簿 作成ルール]] に従う）。"``\]: ``文書の lint はリポジトリの検証に任せて解消したが、個票を変えたあとに `register build` を再実行して生成物の差分がないことを確認する手順と、`item_type`・`priority`・`item_status` の値を検証するコマンドと期待結果が示されていない。``
- F008 \[major/vp-qe-omissions-consistency; line=1; anchor=`"# リスク登録簿 作成ルール"`\]: `テンプレートに、本節で定義されている必須本文構成（概要〜関連ドキュメント）が含まれておらず、整合性が取れていない。`
- F009 \[major/vp-qe-kata-conformance; line=14; anchor=``"- プロジェクト登録簿を使うプロジェクトでは、リスク 1 件を `item_type: risk` の個票に書き、`controls/generated/pm-risk-register.md` は `register build` が個票から生成する。生成物の Frontmatter は `rulebook: specdojo:pjr-rulebook` とし、直接編集しない（[[specdojo:pjr-rulebook|プロジェクト登録簿 作成ルール]] に従う）。"``\]: ``14〜15 行目で 2 つの運用（生成ビューと単独の登録簿）を説明したため前回の blocker の根本的な矛盾は解消したが、Frontmatter の `template` が pjr-rulebook に従う生成ビューを指したままで、6 章構成の単独の登録簿に対応するテンプレートがなく、rulebook とテンプレートの対応がまだ一致していない。``
- F010 \[major/vp-qe-kata-conformance; line=51; anchor=`"- 発生確率と影響度の段階ごとの判定条件と、その組み合わせから優先度を決める対応表を書く。"`\]: ``sample が改訂後のルールを満たしていない（評価基準の対応表と判定条件、再評価の条件と判断者、確認の手段と合格の基準を備えた完了条件、`item_status` の値によるステータス、見直しが行われなかったときの連絡先、文書 ID による関連ドキュメントと影響を受ける成果物がない）ため、完成例として rulebook と整合していない。``
- F011 \[minor/vp-ux-language-consistency; line=74; anchor=`"| 対応責任者を未記載にする                     | 対応遅延が発生するため           |"`\]: `禁止事項の「対応責任者」と一覧の必須列の「担当」が同じ責務を指しているのに表記が異なり、さらに「リスクID」と「リスク ID」も混在しているため、用語を統一する必要がある。`
- F012 \[minor/vp-ops-operability; line=62; anchor=`"- 見直しが行われなかったときの連絡先を書く。"`\]: `見直しが行われなかったときの連絡先は求めるようになったが、期限超過や見直し漏れのあとに取る是正（再評価の実施、担当の再割り当て、ステータスの更新）が規定されておらず、連絡を受けた側の対応が決まらない。`
- F013 \[minor/vp-ops-agent-boundary; line=57; anchor=`"- 受容する場合は、受容を判断した者と、許容する残存影響を書く。"`\]: `受容の判断者と評価変更の判断者を人間の役割（PO や PM など）に限る規定がなく、agent が残存リスクの受容を判断して記録する余地が残っているため、受容の最終判断は人間が担うと明記する必要がある。`

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

- 2026-11-23T05:30:22.861Z: `T-KATA-WAVE-6-PROJECT-pm-risk-register-sample-040` は `T-KATA-WAVE-6-PROJECT-prj-overview-sample-040` の統合を待った。重複: `project:cause.location <> project:cause.location`。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
