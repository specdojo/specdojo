---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-prj-stakeholder-register-sample-045-20261123t202542z-66a915d8
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-045
  name: "recipe を rulebook に合わせる"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PO
  approach: recipe-maintenance
  targets:
    - specdojo:prj-stakeholder-register-sample
    - specdojo:prj-stakeholder-register-recipe
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-045

## 1. このフェーズで行うこと

直した rulebook に沿って recipe を同期する。問いと作成手順に責務を絞り、rulebook の規則を言い直さない。rulebook と sample はこの段で変更しない。recipe が not-needed・undecided なら変更せず、その旨を result に書いて完了する。
PJR-76N9 の決まりに従い、文書の役割の割り当てと承認の進み具合を書かせる問いや手順を残さない。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: ステークホルダー登録簿の完成例
- `depends_on`:
  - [[specdojo:prj-overview-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、ステークホルダー登録簿の完成例を示す
- `path`: `docs/ja/specdojo/samples/prj-stakeholder-register-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-045/T-KATA-WAVE-6-PROJECT-prj-stakeholder-register-sample-045-20261123T202542Z-66a915d8/result.md`

編集対象（rulebook frontmatter の recipe 宣言から解決）:

- `kind`: recipe
- `path`: `docs/ja/specdojo/recipes/prj-stakeholder-register-recipe.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **PO（Project Owner）**
- 責務: 公開可能な SpecDojo 文書基盤としての目的・スコープ・優先順位・公開方針を最終判断する。

このロールが重視するレビュー観点:

- 目的・スコープとの整合: 成果物の主要な定義・判断が、プロジェクト目的、スコープ、優先順位、公開方針と矛盾せず、成果物固有の目的または上位文書への参照から必要性を説明できるか。対応する目的・成果のない手段を目的として扱っていないか。
- 承認判断に必要な情報: PO が承認、保留、差し戻しを判断するための論点、未決事項、影響範囲が明示されているか。文書の役割の割り当てと承認の進み具合は登録簿で追うため、本文に求めない。
- 公開可否と説明責任: 公開してよい情報だけで構成され、最終判断と説明責任を人間の PO が担う前提になっているか。

## 4. 進め方

参照の向きを「成果物 → recipe」に切り替え、対象成果物に紐づく recipe を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[major/vp-qe-kata-conformance; line=60; anchor=`"- その行動は、必要な合意を取る時点に間に合うか。"`\]: ``期待、懸念、必要な合意を対応させる手順に対し, sample の `STH-FAMILY-USER` は「リリース前の試利用」への参加を必要としながらエンゲージメント方針を「リリース後に試利用」としており, リリース判断前に操作性を確認できないため, 試利用の実施時点と合意取得順序を統一する必要がある。``
- F002 \[minor/vp-qe-kata-conformance; line=64; anchor=`"- 期限は「週次」のような会議の頻度ではなく、初期公開前などの判断の節目で書く。会議の日時や頻度はコミュニケーション計画へ渡す。"`\]: `会議日時や配信頻度を重複管理しない方針に対し, 対応 sample は「週次相談」を関係者一覧・エンゲージメント方針・コミュニケーション計画への反映へ重複記載しているため, 期限条件として許容する範囲を明示するか sample と方針を統一する必要がある。`
- F003 \[minor/vp-qe-kata-conformance; line=87; anchor=`"- 承認者を空欄や「-」にしない。見直し責任者が自分で承認してよい場合は、その役割名を承認者に書く。"`\]: `変更時と定期確認時の見直し条件に承認者を定める手順に対し, sample はプロジェクトの目的・スコープ変更行の承認者を「-」としているため, 自己承認を許容する条件を明示するか承認者を記載して統一する必要がある。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の recipe を読み込み、現状の問い・観点・深掘り手順・レビュー観点を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 recipe の frontmatter から辿れる rulebook、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが良い内容の作成に役立っているかを見直す。
5. 成果物で繰り返し不足する内容や review で繰り返し指摘される箇所があれば、それを引き出す問い・観点を recipe に追加する。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した recipe は [[specdojo:recipe-authoring-standard]]（章立て・記述ルール・禁止事項の正本）に従う。rulebook と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な recipe メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 recipe から辿れる rulebook、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で recipe を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の recipe が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って recipe を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
