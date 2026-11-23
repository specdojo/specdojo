---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-dct-sample-050-20261123t140733z-8d35405d
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-dct-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: sample-maintenance
  targets:
    - prj-0001:dct-sample
    - specdojo:dct-sample
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-dct-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 成果物カタログ（ドメイン別）の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、成果物カタログ（ドメイン別）の完成例を示す
- `path`: `docs/ja/specdojo/samples/dct-sample.yaml`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-dct-sample-050/T-KATA-WAVE-6-PROJECT-dct-sample-050-20261123T140733Z-8d35405d/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/dct-sample.yaml`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-purpose-alignment; line=26; anchor=`"- POS 端末および在庫管理端末はタブレット Web アプリケーションとする"`\]: `共有 brief の「POS 端末および在庫管理端末」は端末が複数あるように読め、prj-overview-sample の前提「操作端末は店内のタブレット 1 台」と食い違って見えるため、「店内のタブレット 1 台で動く Web アプリケーションとする」など上位の前提と同じ表現にそろえる。`
- F002 \[minor/vp-arc-conciseness; line=86; anchor=`"note: 統制文書のためスケジュール展開対象外。work ではないため done_criteria は持たない"`\]: `note の「work ではないため done_criteria は持たない」は rulebook の kind 規則の再掲で、構造化フィールドで表せない補足という note の役割から外れるため、統制文書である理由など成果物固有の補足だけを残す。`
- F003 \[minor/vp-qe-verifiability; line=39; anchor=`"- text: 成功判定の輪郭が確認できること"`\]: `「成功判定の輪郭が確認できること」は「輪郭」の範囲が曖昧で合否を判定できないため、「成功基準の観点と測定方法が識別できること」など確かめる対象を具体的に書く。`
- F004 \[minor/vp-qe-omissions-consistency; line=79; anchor=`"- local_id: prj-glossary"`\]: `prj-glossary は rulebook を省いており、rulebook の規則では「必要だが未整備」と読めるため、完成例として意図した状態に合わせて undecided か not-needed を明示するか、省いた意図をコメントで示す。`
- F005 \[minor/vp-qe-kata-conformance; line=13; anchor=`"- prj-0001:dct-index"`\]: `part_of が SpecDojo 本体の prj-0001:dct-index を指し、dct-sample を参照する同梱の specdojo:dct-index-sample と対応していないため、sample 間の親子関係を specdojo:dct-index-sample にそろえる。`
- F006 \[minor/vp-ux-readability; line=4; anchor=`"# 駄菓子屋きぬや販売管理システム構築プロジェクトのプロジェクト定義ドメインを題材とする。"`\]: `project_id と part_of の prj-0001 が例示値で SpecDojo 本体のプロジェクトを指さないことや、共通サンプル文脈への参照がなく実在プロジェクトと誤読されうるため、dct-index-sample と同様の _ASSUMPTION_ コメントと参照を加える。`

### 成果物から届いた Kata が原因の finding

- なし

各記録の `source=grade` / `source=condense` を確認する。grade は成果物・行・viewpoint・内容、condense は result・修正前の場所・種類・直し方・理由を読み、`cause.location` と照合して、見直し対象の Kata の該当箇所を確認する。この節の condense の記録も Kata の見直しの根拠とし、判定は `vp-arc-conciseness` を参照する。以下の手順は、この節と Kata そのものの grade の finding に適用する。

1. 見直し対象の sample を読み込み、現状の粒度・文体・表の書き方を把握する。
2. plan に展開された finding は severity にかかわらず、message と同じ viewpoint ID の判定根拠を修正要件として読み取る。message と判定根拠から指摘の根拠となる規範を特定し、対象 sample の frontmatter から辿れる rulebook と recipe、該当する執筆標準のうち必要な文書を読み、指摘された問題を解消するよう該当箇所を修正する。rulebook との構成不整合を指摘する finding では、成果物の有無にかかわらず rulebook を正として照合する。
3. 修正後、各 finding の問題が判定根拠に照らして解消したことを確認する。未解消、根拠不足、または判断不能の finding は、理由と次のアクションを result の `進め方と実践の型の適用` セクションに記録する。grade result サイドカーは再評価時に更新されるため、本タスクでは直接編集しない。
4. 複数の成果物・review result・対象領域の慣行を根拠に、それらが完成例として適切かを見直す。
5. rulebook の必須項目・禁止事項を満たす最小の記述例になるよう再構成し、実成果物の丸写しを避ける。
6. 既存記述のうち、根拠と整合しない・陳腐化したものは見直し、整合するものは維持する。

finding の修正後は、再評価で構造・整合性が劣化していないことを確認する。

見直した sample は [[specdojo:sample-authoring-standard]]（構成・記述ルール・禁止事項の正本）に従う。rulebook / recipe と記述が矛盾しないように更新する（構造・必須項目・禁止事項は rulebook を正とする）。

approach 全体の定義は [[specdojo:ryu-guide]] の「実践の型メンテナンスの進め方」を参照する。本タスクの実行に必要な sample メンテナンスの進め方は、このセクションで完結する。

### 4.1. 見直しの根拠が不足する場合

- finding の message と判定根拠、対象 sample から辿れる rulebook / recipe、該当する執筆標準、利用可能な成果物・review result・対象領域の慣行を確認しても改訂を判断できない場合に限り、根拠不足として見送る。成果物または review result がないことだけを理由に見送らない。
- 見送る場合は、確認した資料、判断できなかった理由、不足している根拠、次のアクションを result の `進め方と実践の型の適用` セクションに記録する。
- 根拠不足のまま推測で sample を改訂しない。確証が得られた範囲に改訂を限定し、残りは申し送りに残す。
- 見直し対象の sample が存在しない場合は、根拠とした成果物群から新規に作成する。

### 4.2. 判断根拠の記録

見直しの根拠とした規範・成果物・review result と判断根拠を result に残す。記録先は次のとおり。

- 根拠とした規範・成果物・review result、改訂・維持した記述とその根拠、矛盾時に rulebook を正とした箇所: result の `進め方と実践の型の適用` セクション。

## 5. 完了手順

1. 「このフェーズで行うこと」に従って sample を更新する。
2. 共通規約に従って、必要な整形・静的検査を実行する。
3. result の `実施内容`・`変更ファイル`・`進め方と実践の型の適用` セクションを記入する。これはタスク完了に必須であり、_TODO_ を残したまま終了しない（詳細は共通規約を参照）。

## 6. 異常終了の条件

- 依存未解決・対象ファイル不明・lint/test 未解消の場合は異常終了する（終了コード 1）。
- 標準エラー出力に理由を出力する（例: `blocked: <reason>; need=<next action>; ref=<path>`）。
- agent 自身は claim / complete / reopen / block を記録せず、終了コードと標準エラー出力で runner に結果を返す。

`共通規約 sha256:fb401f4fcbb176e7a7f6ffc23acbe037f544ca2691698ad0ac611ee34fe27715` `docs/ja/projects/prj-0001/execution/conventions/fb401f4fcbb176e7a7f6ffc23acbe037f544ca2691698ad0ac611ee34fe27715.txt`
