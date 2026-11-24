---
specdojo:
  id: prj-0001:xep-t-kata-wave-6-design-imp-interface-sample-050-20261123t140155z-8b387d4e
  type: exec-plan
  rulebook: none
  task_id: T-KATA-WAVE-6-DESIGN-imp-interface-sample-050
  name: "sample を厚くする"
  mode: edit
  status: ready
  project_id: prj-0001
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:imp-interface-sample
    - specdojo:imp-interface-sample
---

# Edit Plan: T-KATA-WAVE-6-DESIGN-imp-interface-sample-050

## 1. このフェーズで行うこと

直した rulebook に沿い、sample を共通サンプル文脈（駄菓子屋のプロジェクト）の完成例として厚くする。この sample が成果物そのものなので、成果物の done_criteria と sample の grade の指摘をこの段で満たす。何を書くかの説明ではなく、値で埋めた成果物の実例にする。rulebook はこの段で変更せず、合わせて直すべき点は変更案として result に書く。
sample は [[specdojo:clis-sample|CLI仕様の完成例]]（docs/ja/specdojo/samples/clis-sample.md）程度の厚さにし、[[specdojo:sample-authoring-standard|Sample 記述標準]]（docs/ja/specdojo/standards/sample-authoring-standard.md）に従う。性能や可用性の目標、移行の対象、切替の日程など、利用者が決める値は推測で埋めず `_UNDECIDED_` で残し、決める必要のある値を result に書く。grade が pass の型は、理由のある箇所だけを直す。
PJR-76N9 の決まりに従い、sample の本文に文書の役割の割り当て（作る・確かめる・承認する役割）と承認の範囲・留保・差し戻しの進み具合を書かない。grade の指摘や done_criteria がそれを求めても足さず、合わせて直すべき点として result に書く。RACI・体制など、文書の中身として役割を扱う型は対象外とする。

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: I/F への影響調査の完成例
- `depends_on`:  -
- `overview`: 駄菓子屋の販売管理システムを題材に、I/F への影響調査の完成例を示す
- `path`: `docs/ja/specdojo/samples/imp-interface-sample.md`
- `result`: `docs/ja/projects/prj-0001/execution/runs/schedule/T-KATA-WAVE-6-DESIGN-imp-interface-sample-050/T-KATA-WAVE-6-DESIGN-imp-interface-sample-050-20261123T140155Z-8b387d4e/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/imp-interface-sample.md`
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
- 文書責務の単一性: 文書の中心主題と責務境界が一つに定まり、各章がその責務に直接寄与しているか。独立して参照・更新できる主題が複数あり、対象読者・利用時点が異なる、または別々の sample・recipe・template に対応する場合は分割を検討する。分量や対応する実践の型の数だけでは不備としない。同一主張の反復や正本の過剰な再掲は vp-arc-conciseness で判定し、この観点では扱わない。

## 4. 進め方

参照の向きを「成果物 → sample」に切り替え、対象成果物に紐づく sample を「見直す対象」として編集する。根拠となる成果物・review result・対象領域の慣行に加え、finding が指す規範も実際に読み込んだうえで判断する。読み込まずに記憶や推測で代替しない。

### grade result から展開された finding

- F001 \[minor/vp-po-decision-readiness; line=5; anchor=``"本書は、変更要求 `cr-2026-004` が駄菓子屋の販売管理システムのインターフェースへ与える影響を判断するための文書である。"``\]: `本書が何を判断する文書かは示されているが、影響判定と対応方針を誰がいつ合意・承認するか（例: I/F 責任者と PM の合意時期）が書かれていないため、目的と適用範囲に承認者と判断タイミングを追記すべきである。`
- F002 \[minor/vp-pm-dependency-risk; line=44; anchor=`"| 論点                     | 不足情報                         | 決定期限   | 担当             | 処理方針                                           |"`\]: `未解決事項の表に、期限までに決まらなかった場合の判断・対応への影響（第5章の実施時期への波及など）と当面の扱いがなく、rulebook の記述ガイド「未解決事項」の要求を満たしていないため、影響列を追加すべきである。`
- F003 \[minor/vp-ba-requirements-completeness; line=12; anchor=`"- 狙い: 既存連携停止を避けながら、必要な項目を段階的に導入する。"`\]: `変更要求の概要に rulebook が求める成功条件がない（例: 既存クライアントが改修なしで動き続けること、日次締めで値引き内訳が一致すること）ため、受入を判断できる成功条件を追記すべきである。`
- F004 \[minor/vp-dev-change-impact; line=26; anchor=`"| 影響対象I/F       | 変更要否 | 影響度 | 対応方針 | 判断根拠                                                                 | 備考                                   |"`\]: `影響詳細一覧の備考に、データ仕様・テスト仕様・運用手順など波及の詳細を委ねる関連文書が書かれておらず（「再実行手順を併記」の記載先も不明）、rulebook の全体方針に沿って委ねる先を示すべきである。`
- F005 \[minor/vp-qe-verifiability; line=40; anchor=`"| 低     | Webhook 見送り再評価     | 2026-07-31      | PM（中村）             | 障害件数推移の確認           |"`\]: `通知 Webhook の再評価条件が第4章（監視アラート増加時）と第5章（障害件数推移の確認）で食い違い、閾値もないため、再評価を始める条件を一つに統一し、件数などで判定できる形にすべきである。`
- F006 \[minor/vp-qe-omissions-consistency; line=6; anchor=`"対象は「POS 連携 API」「商品マスタ連携 CSV」「通知 Webhook」「売上集計バッチ連携」の 4 I/F とする。"`\]: `「目的と適用範囲」において、ルールブックで求められている「対象期間」の記載が不足している。`
- F007 \[minor/vp-qe-kata-conformance; line=16; anchor=`"評価観点は、契約互換性、障害波及、運用調整負荷の 3 点とする。"`\]: `ルールブックの禁止事項に基づき、影響度（高・中・低）を判定するための尺度定義を明記すべきである。`
- F008 \[minor/vp-ux-language-consistency; line=30; anchor=`"| 商品マスタ連携CSV | 要       | 中     | 代替     | 全取引先への即時通知は負荷が高いため、先行対象のみ適用して段階拡張する。 | 先行対象は主要取引先 2 社。            |"`\]: `I/F 名の表記が章によって揃っていない（「商品マスタ連携 CSV」と「商品マスタ連携CSV」、「売上集計バッチ連携」「売上集計バッチ」「集計バッチ連携」）うえ、担当名も「連携運用担当（山本）」と「連携運用（山本）」で揺れているため、一つの名称に統一すべきである。`

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
