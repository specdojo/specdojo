---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-cdfd-overview-sample-050-20261123t063432z-1b072ed4
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-cdfd-overview-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:cdfd-overview-sample
    - specdojo:cdfd-overview-sample
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-cdfd-overview-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 概念データフロー図（全体概要）の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、概念データフロー図の全体概要の完成例を示す
- `path`: `docs/ja/specdojo/samples/cdfd-overview-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-cdfd-overview-sample-050/T-KATA-WAVE-6-DESIGN-cdfd-overview-sample-050-20261123T063432Z-1b072ed4/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/cdfd-overview-sample.md`
- `state`: `existing`

`existing` は既存文書を編集し、`missing` は宣言されたパスへ新規作成する。`unresolved` は宣言からパスを解決できない状態であり、命名規則から推測して作成せず異常終了する。

## 3. owner ロールとしての記述ポイント

frontmatter の `owner` に記載された role の視点で成果物を記述する。owner ロールの責務と、そのロールが重視するレビュー観点は次のとおり。

- owner role: **ARC（Architect）**
- 責務: rulebook、recipe、sample、template、成果物カタログの構造整合と技術制約を整理する。

このロールが重視するレビュー観点:

- 文書構造・配置・命名: frontmatter、ID、ファイル名、配置、見出し、リンクがプロジェクトの文書体系と整合しているか。
- 成果物間整合: 成果物について、成果物カタログ、Schedule、RACI、組織定義、メンバー定義、生成物と矛盾していないか。不整合の finding は突き合わせ先の文書 ID またはパスと、双方の相反する記述を特定する。rulebook、recipe、sample、template の内部・相互・適用先との整合は vp-qe-kata-conformance で判定し、この観点では扱わない。
- 技術前提・制約の明確性: 技術的な前提、制約、外部依存、構成判断が必要な範囲で明示されているか。
- 冗長性・簡潔性: 各節が固有の判断または手順に寄与し、同じ主張の繰り返し、表と本文の二重の説明、図をなぞる文、目的に要らない背景、正本の再掲がないか。判断に要る背景・制約・例外・完了条件が残されていれば下限を満たしているとする。長さだけでは fail にせず、削る・まとめる・参照に置き換えることで判断情報を失わない箇所を具体的に特定できる場合のみ minor とする。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-ba-stakeholder-clarity; line=14; anchor=`"- 店主と家族の店番担当、およびシステムの責任分担は [[specdojo:prj-overview-sample|プロジェクト概要]] に従う。補充の判断、つけの承認、締めの確定は店主が担い、システムは記録と確認を支援する。"`\]: `共通 sample 文脈と参照先のプロジェクト概要では家族の店番利用者を「家族利用者代表」としているが、本書は未定義の「店番担当」を使用しているため、正式な役割名へ統一するか両者の対応を明記する必要がある。`
- F002 \[major/vp-dev-implementation-readiness; line=41; anchor=``"| `P-05` | 在庫確認 | 販売と入荷を在庫記録へ反映し、現在庫を確認できる状態に保つ。 | 店番担当（管理責任: 店主代表） | 販売または入荷が記録された |"``\]: ``仕入側の `P-02` が在庫記録へ入荷数量を直接反映する一方、`P-05` も販売と入荷を同じ在庫記録へ反映するとされ、実装担当が入荷更新の単一責務・呼出順・重複更新防止条件を確定できない。``
- F003 \[major/vp-qe-verifiability; line=41; anchor=``"| `P-05` | 在庫確認 | 販売と入荷を在庫記録へ反映し、現在庫を確認できる状態に保つ。 | 店番担当（管理責任: 店主代表） | 販売または入荷が記録された |"``\]: ``仕入の `P-02` と在庫の `P-05` がともに入荷数量を在庫記録へ反映すると定義されているため、入荷時の更新責務を一方へ定め、他方を受け渡しまたは参照として表現しなければ更新の成否を一意に判定できない。``
- F004 \[minor/vp-qe-verifiability; line=33; anchor=``"| `P-03` | 店頭販売 | 現金販売を記録し、商品を顧客へ渡す。 | 店番担当（管理責任: 店主代表） | 顧客が商品を購入した |"``\]: `` `P-03` の起点イベントを「顧客が商品を購入した」と完了後の表現にしているため、主要入力の「購入依頼と支払」のどの時点で店頭販売が開始したかを判定できるイベントへ修正する必要がある。 ``
- F005 \[major/vp-qe-omissions-consistency; line=206; anchor=`"purchasing -> inventory_record: \"入荷数量\""`\]: ``主要入力の「仕入からの入荷数量」に対応する図のエッジが在庫グループへ到達せず `仕入 → 在庫記録` となり、さらに在庫グループも同じ在庫記録を更新しているため、単一の更新責務とそれに対応する受け渡し経路へ修正する必要がある。``
- F006 \[minor/vp-qe-omissions-consistency; line=83; anchor=`"| 売場棚 | 店頭に陳列した商品の現物 | 店内の売場棚（物理保管） |"`\]: `「売場棚」をトランザクションデータ表へ配置している一方、凡例では物理保管はいずれのデータストア区分にも属さないと定義しているため、物理保管用の区分を設けるかトランザクションデータ表へ置く例外規則を明記する必要がある。`
- F007 \[major/vp-qe-kata-conformance; line=26; anchor=``"| `P-02` | 入荷検品 | 納品された商品を検品し、売場棚へ出して仕入記録と在庫記録を更新する。 | 店番担当（管理責任: 店主代表） | 仕入先から商品が納品された |"``\]: ``下位の `cdfd-sample` は `P-02-03` が入荷数量を在庫記録へ直接反映する正本になっている一方、本書は `P-05` にも入荷反映を割り当てているため、概要とプロセスグループ別 CDFD で更新責務を一方へ統一する必要がある。``
- F008 \[minor/vp-qe-kata-conformance; line=373; anchor=`"データストアの色分けは、大分類「データストア」の中の業務上のサブ分類を表す。マスタ・構成データは、他のプロセスから参照される比較的安定した基準情報（商品台帳、顧客台帳）を指す。トランザクションデータは、業務活動に伴い都度更新される記録（販売記録、仕入記録、在庫記録、つけ台帳、締めの記録）を指す。物理保管は現物の保管先であり、いずれの区分にも属さないため、便宜上トランザクションデータと同じ色を用いる。"`\]: `完成例が「売場棚」をトランザクションデータ表へ置きながら凡例で同区分に属さないと説明しているため、rulebook・template と合わせて物理保管の配置規則を確定し、その規則に従う完成例へ修正する必要がある。`
- F009 \[minor/vp-qe-kata-conformance; line=380; anchor=`"| 論点 | 影響 | 決定者 | 決定時期 | 状態 |"`\]: `rulebook の「未決事項」記述ガイドは表を「論点」「影響」の2列と定めているが、sample と template は決定者・決定時期・状態を加えた5列で示しているため、rulebook の列定義と sample・template の表構成を一致させる必要がある。`
- F010 \[minor/vp-qe-kata-conformance; line=26; anchor=``"| `P-02` | 入荷検品 | 納品された商品を検品し、売場棚へ出して仕入記録と在庫記録を更新する。 | 店番担当（管理責任: 店主代表） | 仕入先から商品が納品された |"``\]: ``下位の `cdfd-sample` が担当を「家族利用者代表（管理責任: 店主代表）」としている一方、本書は同じ仕入の領域を「店番担当（管理責任: 店主代表）」としており、全体概要と詳細 CDFD で領域の担当名を引き継ぐ規則に合わせて役割名を統一する必要がある。``
- F011 \[minor/vp-ux-language-consistency; line=14; anchor=`"- 店主と家族の店番担当、およびシステムの責任分担は [[specdojo:prj-overview-sample|プロジェクト概要]] に従う。補充の判断、つけの承認、締めの確定は店主が担い、システムは記録と確認を支援する。"`\]: `「店主代表」「家族利用者代表」を用いる共通 sample 文脈に対して「店主」「店番担当」を併用しているため、正式な役割名へ統一するか用語の対応を定義する必要がある。`
- F012 \[minor/vp-ux-language-consistency; line=373; anchor=`"データストアの色分けは、大分類「データストア」の中の業務上のサブ分類を表す。マスタ・構成データは、他のプロセスから参照される比較的安定した基準情報（商品台帳、顧客台帳）を指す。トランザクションデータは、業務活動に伴い都度更新される記録（販売記録、仕入記録、在庫記録、つけ台帳、締めの記録）を指す。物理保管は現物の保管先であり、いずれの区分にも属さないため、便宜上トランザクションデータと同じ色を用いる。"`\]: `第4章では売場棚を「トランザクションデータ」に含めている一方、本段落では物理保管を「いずれの区分にも属さない」と定義しており、売場棚の分類を読み手が一意に識別できないため表現を統一する必要がある。`

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
