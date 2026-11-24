---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-bps-sample-050-20261123t174623z-aaf3f30f
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-bps-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: BA
  approach: sample-maintenance
  targets:
    - specdojo:bps-sample
    - specdojo:bps-sample
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-bps-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 業務プロセス仕様の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、業務プロセス仕様の完成例を示す
- `path`: `docs/ja/specdojo/samples/bps-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-bps-sample-050/T-KATA-WAVE-6-DESIGN-bps-sample-050-20261123T174623Z-aaf3f30f/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/bps-sample.md`
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

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-ba-requirements-completeness; line=59; anchor=``"| `E-02`  | `S-02`       | 同じ商品に未完了依頼がある | 新規依頼の確定 | 店主代表 | 既存依頼へ数量を反映するか決める               | 再承認、または重複不要記録で終了 |"``\]: `E-02 の「再承認」は、既存依頼へ数量を反映した後にどのステップ（S-03 / S-04）へ合流し、修正済み補充依頼を仕入グループへ渡し直すのかが示されておらず、出力にも修正済み依頼の成果がないため、合流先と確定する成果を明示する必要がある。`
- F002 \[minor/vp-qe-verifiability; line=71; anchor=``"| 保留と再開     | `E-01`、`E-03`〜`E-05` の検出条件      | 処置の記録が残り、再開後に補充依頼へ至る     | 保留記録、補充依頼     |"``\]: `「保留と再開」は E-01、E-04 からの再開も一律に「補充依頼へ至る」としているが、情報補完後に販売停止・基準以上や既存依頼が判明すれば補充不要記録・重複不要記録で終了できるため、補充依頼に至る追加条件を示すか、再開後の判定に応じた各成果を期待結果に含める必要がある。`
- F003 \[minor/vp-qe-verifiability; line=62; anchor=``"| `E-05`  | `S-04`       | 仕入グループへ引き渡せない | 引き渡し       | 店主代表 | 確定済み・未受領のまま状況を保留記録に残す     | 可能になり次第 `S-04` から再開   |"``\]: `E-05 の再開条件「可能になり次第」は何がそろえば S-04 を再開できるかを判定できないため、仕入グループが補充依頼を参照できる状態に戻ったことなど、確認可能な事実で再開条件を記述する必要がある。`
- F004 \[minor/vp-qe-omissions-consistency; line=50; anchor=``"| 補充依頼     | 仕入グループ | `S-03` の完了条件を満たす                  | 補充依頼 | `H-01` で `P-01-01` 発注内容確定へ |"``\]: `概要は出力の確定を終了点とする一方、補充依頼の確定条件は S-03 の完了だけであり、S-04 の引渡し前や E-05 の保留中にも終了条件を満たすため、正常終了には仕入グループが参照できることを含め、承認済みと引渡し完了を区別する必要がある。`
- F005 \[minor/vp-qe-omissions-consistency; line=51; anchor=`"| 補充不要記録 | 店主代表     | 対象商品、理由、確認時刻があり、依頼がない | 在庫記録 | 次回の販売・入荷後に再判定         |"`\]: `補充不要記録の確定条件を「依頼がない」としているが、S-01・S-02 の補充不要分岐は既存依頼がある商品も除外しておらず、その依頼を取り消す処置もないため、「新規依頼を作らない」という条件に限定するか、既存依頼がある場合の処置と分岐優先関係を明示する必要がある。`
- F006 \[minor/vp-qe-kata-conformance; line=8; anchor=``"- プロセス領域: 在庫グループの補充判断（`P-06`）"``\]: ``プロセス領域は「在庫グループの補充判断（P-06）」とするだけで、在庫グループの CDFD 正本 `cdfd-inventory` への参照と、同じ領域の P-05（在庫数の算出）との境界説明がなく、業務目的も参照でなく再記述しているため、rulebook の「導入文と概要」と recipe のコツに沿って CDFD を参照し領域内の境界を示す必要がある。``

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
