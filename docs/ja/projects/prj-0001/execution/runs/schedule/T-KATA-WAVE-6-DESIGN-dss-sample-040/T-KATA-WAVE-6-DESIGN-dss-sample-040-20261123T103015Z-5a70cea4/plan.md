---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-dss-sample-040-20261123t103015z-5a70cea4
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-dss-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: UX
  approach: rulebook-maintenance
  targets:
    - specdojo:dss-sample
    - specdojo:dss-rulebook
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-dss-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: デザインシステムの完成例
- `depends_on`:
  - [[specdojo:uis-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、デザインシステムの完成例を示す
- `path`: `docs/ja/specdojo/samples/dss-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-dss-sample-040/T-KATA-WAVE-6-DESIGN-dss-sample-040-20261123T103015Z-5a70cea4/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/dss-rulebook.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **UX（UX / Documentation Designer）**
- 責務: 仕様作成者が迷わず使える導線、説明、文書体験を担う。小規模運用では BA 観点と合わせて扱い、必要時に専任化を検討する。

このロールが重視するレビュー観点:

- 読みやすさ・理解しやすさ: 初見の読者が、成果物固有の目的または上位文書への参照、名称、メタデータから、なぜ扱うか、役割、利用先、対象、主要な判断、次に見る文書を理解できるか。主旨または主要な判断点を読み取れない箇所を特定できる場合は major とする。同一主張の反復や正本の過剰な再掲など冗長性の判定は vp-arc-conciseness で行い、この観点では扱わない。
- 利用者導線: 利用者や将来貢献者が迷わず必要情報へ到達できる構成になっているか。目次から必要な章を見つけられるか、関連成果物への参照が適切な位置にあるか、前提から結論への説明順序が守られているかのいずれかの基準に照らして判定し、情報を見失う箇所を具体的に特定できる場合のみ不備とする。
- 用語・表現の一貫性: 用語、Role code、成果物名、状態、ラベルが読み手を混乱させない形で統一されているか。

## 4. 進め方

参照の向きを「成果物 → rulebook」に切り替え、対象成果物に紐づく rulebook を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=141; anchor=`"- 変更時はトークン・部品・適用画面・検証への影響を示します。例外には対象規則、理由、影響範囲、検証結果、期限、判断記録と失効時の扱いを残します。"`\]: `例外や設計採用について判断記録は求めているが、承認・却下を担う判断者（Role code）の明記を求めていないため、記述ガイドの例外の項目に判断者を加え、採用判断の責任者を読み取れるようにする。`
- F002 \[minor/vp-pm-control-reporting; line=141; anchor=`"- 変更時はトークン・部品・適用画面・検証への影響を示します。例外には対象規則、理由、影響範囲、検証結果、期限、判断記録と失効時の扱いを残します。"`\]: `変更時の影響と例外の記録は求めているが、検証不適合・規則変更・例外をそれぞれ登録簿の課題・変更要求・決定のどれへ転記するかの区別を求めていないため、転記先と担当を書く要求を加える。`
- F003 \[minor/vp-dev-implementation-readiness; line=31; anchor=``"- プロダクト成果物は `docs/ja/product/040-system-design/`、プロジェクト限定なら設計ドメイン配下に置き、ID は `<project-id>:dss-<term>` とします。分冊時は共通定義を参照します。"``\]: `プロジェクト限定の DSS の配置先が「設計ドメイン配下」とだけ書かれ、docs-structure-guide に定義のない語のため具体的なディレクトリを決められないので、プロジェクト配下の章ディレクトリを明記するか、配置規則の正本を参照する。`
- F004 \[minor/vp-qe-kata-conformance; line=139; anchor=`"- 推奨列: 対象の規則・正本キー / 対応する要求 / 確認方法 / 合格条件 / 担当。トークンの静的確認・部品表示・試作操作・利用者評価を使い分け、規則への適合と操作性目標の達成を別に確かめます。"`\]: `検証の推奨列に合格条件を挙げているが、sample の検証の表に合格条件の列がなく型と完成例が対応していないため、合格条件を規則の表の確認条件で代替してよいかを rulebook に明記するか、sample の検証の表に合格条件を加えて整合させる。`
- F005 \[minor/vp-ux-language-consistency; line=10; anchor=`"- 各決まりに適用条件・必須または禁止する内容・検証方法を示します。"`\]: `DSS で定める対象を「決まり」と「規則」（規則 ID）で混在して呼んでおり、同じ概念か読み手が迷うため、どちらかに統一するか、「決まり」と「規則」の関係を定義する。`

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
