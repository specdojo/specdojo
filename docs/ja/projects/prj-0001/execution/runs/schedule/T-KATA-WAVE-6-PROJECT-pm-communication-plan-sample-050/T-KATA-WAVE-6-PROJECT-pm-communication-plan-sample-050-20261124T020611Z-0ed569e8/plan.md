---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-project-pm-communication-plan-sample-050-20261124t020611z-0ed569e8
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-PROJECT-pm-communication-plan-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: PM
  approach: sample-maintenance
  targets:
    - specdojo:pm-communication-plan-sample
    - specdojo:pm-communication-plan-sample
---

# Edit Plan: T-KATA-WAVE-6-PROJECT-pm-communication-plan-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: コミュニケーション計画の完成例
- `depends_on`:
  - [[specdojo:prj-stakeholder-register-sample]]
- `overview`: 駄菓子屋の販売管理システムを題材に、コミュニケーション計画の完成例を示す
- `path`: `docs/ja/specdojo/samples/pm-communication-plan-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-PROJECT-pm-communication-plan-sample-050/T-KATA-WAVE-6-PROJECT-pm-communication-plan-sample-050-20261124T020611Z-0ed569e8/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/pm-communication-plan-sample.md`
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

- F001 \[minor/vp-pm-plan-feasibility; line=12; anchor=``"| `STH-SHOP-OWNER` への進捗共有                      | 完了、次の作業、ブロック、必要な判断      | 節目、ブロック発生時                                             | Schedule と Issue コメント | `PM`  | `kinuya-schedule`、課題ログ  |"``\]: `進捗共有の行のタイミング「節目」が何を指すか（管理計画のマイルストーン名や Schedule 上の完了単位など）を示し、共有の実施時期を判定・タスク化できるようにする。`
- F002 \[minor/vp-ba-stakeholder-clarity; line=16; anchor=``"| `STH-SHOP-OWNER` の受入確認                        | 受入条件、試験結果、未解決事項            | 初期リリース前                                                   | Pull Request のレビュー    | `QE`  | `kinuya-acceptance-record`   |"``\]: ``店主の受入確認の手段を「Pull Request のレビュー」とすると店主の利用場面と合わないため、店主が実際に確認する形式（試験結果の要約を Issue で示す、対面で確認した結果を `QE` が Pull Request に転記するなど）を示す。``
- F003 \[minor/vp-qe-omissions-consistency; line=11; anchor=``"| `STH-SHOP-OWNER` への判断依頼                      | 範囲・優先機能・UI の変更、費用・時間上限 | 準備着手前、管理計画の判断ゲート「重大変更・再開」に当たる変更時 | Issue（対面の結果も転記）  | `PM`  | Issue、変更要求ログの変更 ID |"``\]: `方針の「対面は試用の準備と結果の聞き取りに限る」と判断依頼の手段「Issue（対面の結果も転記）」が矛盾するため、判断依頼で対面を使う場合を方針に含めるか、手段から対面を外す。`
- F004 \[minor/vp-qe-omissions-consistency; line=42; anchor=``"- _UNDECIDED_: 営業時間外の緊急連絡手段。決まるまで営業時間外の停止連絡の伝達先が定まらない。店頭試用の開始前に `PO` が決定する。"``\]: `未決事項が影響するとする「営業時間外の停止連絡」に対応する機会やエスカレーション条件が表にないため、停止連絡の行を機会またはエスカレーションに置き、未決事項がその行の伝達先を変えると分かるようにする。`
- F005 \[minor/vp-qe-kata-conformance; line=1; anchor=`"# コミュニケーション計画: 駄菓子屋きぬや 販売管理システム"`\]: ``template の `frontmatter_template` が `supersedes: []` を含むのに sample の Frontmatter には `supersedes` がないため、完成例として template と同じ項目構成にそろえる。``
- F006 \[minor/vp-ux-language-consistency; line=23; anchor=``"| 利用者価値または受入条件を登録簿・成功条件から判定できない                                           | `BA` が事実と選択肢を整理する                                          | `PO`     | 課題ログ     |"``\]: ``機会の表の判断依頼先 `STH-SHOP-OWNER` とエスカレーションの最終判断 `PO` の対応が読み取れないため、店主が `PO` を担うことを方針で一言示すか、どちらかの表記にそろえる。``

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

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
