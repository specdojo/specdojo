---
specdojo:
  id: prj-0001:xep-t-kata-wave-5-opr-sample-040-20261123t100213z-559b3fd6
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-5-opr-sample-040
  name: "rulebook を簡潔にする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: OPS
  approach: rulebook-maintenance
  targets:
    - specdojo:opr-sample
    - specdojo:opr-rulebook
---

# Edit Plan: T-KATA-WAVE-5-opr-sample-040

## 1. このフェーズで行うこと

対象の sample が従う rulebook を、grade のし直しの指摘（run id regrade-kata-2026-11-21 と、その後の最新の grade）と成果物の done_criteria に沿って簡潔に整える。rulebook に完成例の章を置かず、完成例は sample に任せる。見出しは H4 までにする。sample・recipe・template はこの段で変更しない。
[[specdojo:rulebook-authoring-standard|Rulebook 記述標準]]（docs/ja/specdojo/standards/rulebook-authoring-standard.md）の章立てに合わせ、記述ガイドには章ごとの判断の基準と良い例・悪い例を書く。実装・schema・リファレンスと同じことを書かない方針（PJR-2GD6）を保ち、値・構文・構造の詳細は正本を参照する。rulebook が frontmatter の includes で記法の rulebook（`<name>-mermaid-rulebook` など）を取り込む場合は、記法の rulebook もこの段で簡潔にする。
grade が pass の型は、grade の指摘、冗長な記述、ほかの型との重なりのように理由のある箇所だけを直し、理由のない書き換えはしない。直さなかった箇所と理由を result に書く。
PJR-76N9 の決まりに従い、rulebook の「誰がどの利用場面で何を判断するか」は「どの利用場面で何を判断するための文書か」に直し、成果物の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を求めない。承認と留保は登録簿の個票で追う。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 運用手順の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、運用手順の完成例を示す
- `path`: `docs/ja/specdojo/samples/opr-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-5-opr-sample-040/T-KATA-WAVE-5-opr-sample-040-20261123T100213Z-559b3fd6/result.md`

編集対象（成果物カタログの rulebook 宣言から解決）:

- `kind`: rulebook
- `path`: `docs/ja/specdojo/rulebooks/opr-rulebook.md`
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

- F001 \[minor/vp-arc-conciseness; line=131; anchor=`"推奨フォーマット（表）:"`\]: `6.11 の推奨フォーマット表は template の「証跡」章と同じ列構成の再掲であり、列は template を正本とする第5章・第6章冒頭の方針と重複するため、表を削除して template 参照と必須識別子の指示に置き換えるべきである。`
- F002 \[minor/vp-qe-verifiability; line=146; anchor=`"### 6.13. 運用作業の受入確認"`\]: `6.13 の合格条件「完了条件と OPD の基準を満たせば合格」は照合する OPD の項目と結果の記録先が未定義で pass / fail を判定しにくいため、照合対象（優先度・RTO/RPO・承認基準など）と記録先の章（証跡など）を明記すべきである。`
- F003 \[minor/vp-qe-omissions-consistency; line=41; anchor=``"- `<term>` は用語集(GL)の論理名キー（英小文字kebab-case）を用いる（表示名は title / ファイル名で日本語を使用してよい）。"``\]: ``「表示名は title / ファイル名で日本語を使用してよい」は Frontmatter に `title:` を書かない規約と矛盾して誤読を招くため、「表示名は H1 / ファイル名」に改めるべきである。``
- F004 \[minor/vp-qe-omissions-consistency; line=37; anchor=``"- `id` は `opr-index` または `opr-<term>`（kebab-case。例: `opr-incident`）。"``\]: `` `id` 規則が `opr-index` / `opr-＜term＞` のみで project 修飾 ID（例: `＜project-id＞:opr-index`）に触れておらず、他の rulebook の ID 規則と粒度が揃わないため、修飾形を明記すべきである。 ``
- F005 \[major/vp-qe-kata-conformance; line=1; anchor=`"# 運用手順 作成ルール"`\]: ``Frontmatter で宣言した sample のうち 7 件が `rulebook: specdojo:opd-rulebook` を宣言して対応が一致せず、`opr-incident-sample` は template と異なる列名「初動SLA」、`opr-sample` は template の章構成と異なる独自構成になっているため、sample の `rulebook` と構成を opr-rulebook・opr-template に揃えるか宣言を見直すべきである。``
- F006 \[minor/vp-qe-kata-conformance; line=146; anchor=`"### 6.13. 運用作業の受入確認"`\]: `6.13「運用作業の受入確認」は記述ガイド内にあるが第5章の必須章にも template の章にもなく、成果物に章として書くのか運用上の確認手順なのかが曖昧なため、記述ガイドから分離するか template・必須章との関係を明記すべきである。`
- F007 \[minor/vp-ux-readability; line=139; anchor=``"### 6.12. 関連ドキュメント導線（`opd` 参照、`mip` / `otp` / `cop` 連携）"``\]: ``6.12 の `mip-*` / `otp-*` / `cop-*` は本書のどこにも成果物名や役割の説明がなく初見の読者が連携先を判断できないため、2.1 の位置づけに成果物名と関係を追記すべきである。``
- F008 \[minor/vp-ux-language-consistency; line=20; anchor=``"- `opr-index` を入口とし、証跡・作業承認・優先度・エスカレーション・手順テンプレの共通規約を置く"``\]: ``1.1 の「手順テンプレの共通規約」は Kata の template（`specdojo:opr-template`）と語が衝突して意味が曖昧なため、「手順の記述書式」など別の語に改めるか、どちらを指すか明記すべきである。``

### 成果物から届いた Kata が原因の finding

- source=condense; result=`prj-0001:xer-pjr-df38-20261104t143905z-e48dd61f`; document=`opr-agent-cli-update`; location=`## 12. 関連ドキュメント導線（128行目）「| 技術スタック | tsd-home-mac-dev-server | SSH・tmux・devcontainer構成 |」`; category=`repetition`; action=`retain`; reason=`第2節の前提表の記述と重複するが、第12節はrulebookで必須とされている関連ドキュメント一覧であり、文書間の導線・トレーサビリティを維持するため保持する。`; cause=kata:rulebook; location=`docs/ja/specdojo/rulebooks/opr-rulebook.md:6.12（## 12. 関連ドキュメント導線の必須化）`

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

- 2026-11-23T05:30:31.390Z: `T-KATA-WAVE-5-opr-sample-040` は `T-KATA-WAVE-6-PROJECT-prj-overview-sample-040` の統合を待った。重複: `project:cause.location <> project:cause.location`。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
