---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-imp-operations-sample-040-20261123t123604z-cf73596c
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-imp-operations-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: rulebook-maintenance
  targets:
    - specdojo:imp-operations-sample
    - specdojo:imp-operations-rulebook
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-imp-operations-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用への影響調査の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、運用への影響調査の完成例を示す
- `path`: `docs/ja/specdojo/samples/imp-operations-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-imp-operations-sample-040/T-KATA-WAVE-6-DESIGN-imp-operations-sample-040-20261123T123604Z-cf73596c/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/imp-operations-rulebook.md`
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

- F001 \[minor/vp-po-decision-readiness; line=52; anchor=`"運用品質・障害対応力・継続運用性・利用者影響の評価観点と高・中・低の尺度を先に示し、件数と優先対象をまとめる。監視体制、障害初動、運用負荷、統制・監査への影響を検討する。"`\]: `影響分析サマリまたは対応方針に、変更要求全体に対する運用面の結論（受入・条件付き受入・見送りの推奨）と判断者（Role code）を記載する要件を加え、承認・差し戻しの判断対象を明確にすべきである。`
- F002 \[minor/vp-po-publication-accountability; line=69; anchor=`"- 重要度が高い項目から順に、実施時期、担当、前提条件を記載する。"`\]: `対応方針の「担当」は Role code（適用先のメンバー定義の役割）で記載し、個人名・連絡先など公開に適さない情報を載せないことを記述ガイドまたは禁止事項に明記すべきである。`
- F003 \[minor/vp-pm-dependency-risk; line=16; anchor=``"波及の概要と判断は本書に残し、詳細はデータ仕様（`bdd-*`）、I/F 仕様（`ifx-*`）、テスト戦略・方針（`tsp-index`）などへ委譲する。「備考」に適用先カタログの対応する成果物 ID を示す。"``\]: ``同一変更要求に対する他の影響調査（`imp-business`・`imp-data`・`imp-interface`・`imp-test`）との分担と相互参照の方法を位置づけに示し、領域横断の依存を識別できるようにすべきである。``
- F004 \[minor/vp-pm-control-reporting; line=74; anchor=`"論点、不足情報、運用判断への影響と当面の扱いを記載する。"`\]: `未解決事項に決定期限・担当 Role code と、課題・リスクとして PJR へ登録するかどうかの記載を求め、管理記録への転記対象を分離すべきである。`
- F005 \[minor/vp-dev-change-impact; line=12; anchor=``"- **共通の運用**: 役割は適用先のメンバー定義、`status`・承認・改訂と廃止・未決事項の引き継ぎは [[specdojo:document-metadata-standard|ドキュメントメタ情報標準]] に従う。文書の整形・lint はリポジトリの検証で扱う。"``\]: ``標準が求める自系統の追従対象（変更要求の改訂時に見直す影響詳細・対応方針、関連する `imp-*` や委譲先文書）と担当 Role code を定義すべきである。``
- F006 \[minor/vp-qe-verifiability; line=9; anchor=`"- 運用責任者とプロジェクト管理者が合意できる粒度で、影響と判断根拠を記載する。"`\]: `「合意できる粒度」を、影響対象運用ごとに判定・根拠・対応方針が一対一で記載されているなど、判定できる条件に置き換えるべきである。`
- F007 \[minor/vp-qe-omissions-consistency; line=76; anchor=`"## 7. 禁止事項"`\]: `禁止事項が2項目のみで、標準の「各必須章に最低3つ以上の具体項目」を満たしていないため、見送り時の再評価条件の欠落や実運用手順の詳細の記載などを禁止事項に追加すべきである。`
- F008 \[major/vp-qe-kata-conformance; line=52; anchor=`"運用品質・障害対応力・継続運用性・利用者影響の評価観点と高・中・低の尺度を先に示し、件数と優先対象をまとめる。監視体制、障害初動、運用負荷、統制・監査への影響を検討する。"`\]: `sample の影響分析サマリが高・中・低の尺度を定義しておらず、rulebook の記述ガイドと禁止事項（尺度を定義せずに高・中・低を混在させない）に反しているため、rulebook と sample を整合させるべきである。`
- F009 \[minor/vp-qe-kata-conformance; line=52; anchor=`"運用品質・障害対応力・継続運用性・利用者影響の評価観点と高・中・低の尺度を先に示し、件数と優先対象をまとめる。監視体制、障害初動、運用負荷、統制・監査への影響を検討する。"`\]: `rulebook の評価観点（運用品質・障害対応力・継続運用性・利用者影響）と sample の評価観点（運用品質、障害対応力、運用負荷）が一致していないため、どちらかに統一すべきである。`
- F010 \[minor/vp-qe-kata-conformance; line=44; anchor=`"変更要求の識別子、対象運用領域、対象期間、判断目的を示す。"`\]: `rulebook が求める対象期間（目的と適用範囲）・成功条件（変更要求の概要）・運用判断への影響（未解決事項）が sample に記載されておらず、記述ガイドと完成例が対応していない。`
- F011 \[minor/vp-ux-language-consistency; line=69; anchor=`"- 重要度が高い項目から順に、実施時期、担当、前提条件を記載する。"`\]: `対応方針の「重要度が高い項目から順に」は影響詳細一覧の「影響度」と表記が揺れているため、「影響度」に統一するか、別の尺度であれば定義を示すべきである。`

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
