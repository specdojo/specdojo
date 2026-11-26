---
specdojo:
  id: prj-0001:xer-t-kata-review-all-cdfd-overview-sample-150-20261125t044235z-f0ef10c8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-cdfd-overview-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-cdfd-overview-sample-150/T-KATA-REVIEW-ALL-cdfd-overview-sample-150-20261125T044235Z-f0ef10c8/plan.md
  started_at: "2026-11-25T04:42:44.786Z"
  completed_at: "2026-11-25T04:55:20.662Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:cdfd-overview-sample
    - specdojo:cdfd-overview-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、cdfd-overview-sample を同じ接頭辞の個別 sample（cdfd-sample、cdfd-uc-sample）、wikilink 参照先、用語集、共通サンプル文脈と突き合わせた。
- 全体概要の図に、仕入から販売へ渡す「入荷数量・受入結果」の線を 1 行足した。cdfd-sample と cdfd-uc-sample は、この受け渡しを記述している。
- 相手側を直す案 2 件と、要判断 1 件を handoff に記録した。相手側の sample は変更していない。
- grade の F001 と F002 は、前の段で解消済みだった。R5 の観点ではないので、追加の変更はしていない。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/cdfd-overview-sample.md`: 「5. 概念データフロー（概要）」の D2 図に、`purchasing -&gt; sales: "入荷数量・受入結果"` を 1 行足した。個別 sample 2 件が示す仕入から販売への受け渡しに揃えた。ノード数は 14 のままで、ほかの記述は変えていない。

## 3. 申し送り

- 指摘一覧（R5 の指摘は executor の handoff の R5-1 から R5-4 に 1 件ずつ記載されている。reporter はそれを実施内容の表として 1 回だけ示す。ここでは重ねない）。
- 要判断: R5-4 は、例外時の戻りの線（E-01-01 や 5.2. の戻り）を全体概要の図に置くかを、人が判断する。
- R5-1: 段=R5 / 箇所=5. 概念データフロー（概要） / 指摘=cdfd-sample（P-02-04 → 販売グループ）と cdfd-uc-sample（purchasing -&gt; sales）は仕入から販売へ「入荷数量・受入結果」を渡すが、全体概要の図にこの線がなく、グループ間の受け渡しの正本である図に欠けがある / 直した案=図に `purchasing -&gt; sales: "入荷数量・受入結果"` を 1 行足した（ノード数は 14 で変わらない） / 根拠=vp-qe-kata-conformance。rulebook cdfd-overview-rulebook が受け渡しとグループ間の要求の正本を図とし、確認手順 4 で受け渡しに欠落がないことを求めている。選ばなかった案は、個別 sample 2 件から直接の線を消して仕入記録経由にする案で、個別 sample 2 件の記述が一致しているため採らなかった / 印=-
- R5-2: 段=R5 / 箇所=3. プロセス領域（相手側: cdfd-uc-sample の 3.1. 在庫と 5.1. の図） / 指摘=cdfd-uc-sample は在庫グループが「発注単位に合う数量を確定」し、商品台帳から在庫へ「補充基準・発注単位」を渡す。全体概要（P-01 が補充対象と数量を発注単位に合わせて確定し、商品台帳から仕入へ「仕入先・発注単位」を渡す）と cdfd-sample（P-01-01 が補充依頼の数量を発注単位に合わせて確定する）とは、発注単位を扱うグループが食い違う / 直した案=- / 根拠=vp-qe-kata-conformance。相手側の docs/ja/specdojo/samples/cdfd-uc-sample.md で、3.1. の役割を「商品台帳の補充基準で補充対象と数量を判断し、店主代表が承認した補充依頼を仕入へ渡す」に、図の線を `item_master -&gt; inventory: "補充基準"` に、4.1. の利用を「補充基準を参照し、補充対象を特定する」に直す案 / 印=-
- R5-3: 段=R5 / 箇所=2. 適用範囲（相手側: cdfd-uc-sample の 2. 適用範囲） / 指摘=cdfd-uc-sample の「店主代表・店番担当・システムの責任分担」の「店番担当」は、共通サンプル文脈の共通登場人物の役割名と全体概要の「家族利用者代表」と合わない / 直した案=- / 根拠=vp-qe-kata-conformance、sample-authoring-standard の共通登場人物（本文には役割名を使う）。相手側の docs/ja/specdojo/samples/cdfd-uc-sample.md で「店番担当」を「家族利用者代表」に直す案 / 印=-
- R5-4: 段=R5 / 箇所=5. 概念データフロー（概要） / 指摘=cdfd-sample の例外 E-01-01（受注不可のとき在庫グループへ再検討が必要な数量を戻す）と cdfd-uc-sample の 5.2. の戻り（仕入 → 在庫の不足項目、販売 → 仕入の差異）に当たる線が全体概要の図にない / 直した案=-（足していない） / 根拠=vp-qe-kata-conformance。例外時の戻りは、グループ間の順序と引き渡し条件を持つユースケース別 CDFD の責務と判断し、全体概要には業務成果に要る通常の受け渡しだけを置いた。選ばなかった案は、全体概要に `inventory &lt;- purchasing: "再検討の数量"` を足す案。rulebook が例外の戻りを全体概要に求めるかを読み切れなかったため、人の判断に回す / 印=要判断
- 補足: grade の F001（vp-arc-conciseness、役割分担の 2 項目の再掲）と F002（vp-qe-kata-conformance、担当から直接受け取る入力を省く注記）は、前の段で直っている。6. 詳細 CDFD 一覧の冒頭は 1 文の要約になっており、5. の図の直後に省略の注記がある。R5 の観点ではないので追加の変更はしていない。用語集（gl-common の tm-data-store。マスタ・構成データとトランザクションデータの 2 区分）と共通サンプル文脈（単一店舗、店主が最終判断、システムは記録と確認を支援）に食い違いはない。wikilink の参照先 prj-overview-sample の責任分担（店主が最終判断し、仕入れ数量やつけの扱いをシステムは自動で決めない）とも合っている。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/cdfd-overview-sample.md だけで、plan・result・個票を変更していない）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルは Markdown だけで、`*.yaml` / `*.yml` を変更していない）
- 適用外の検証: `npm run validate:catalog`（変更は docs/ja/specdojo/samples/ 配下だけで、docs/ja/projects/ 配下の成果物に及んでいない）

## 4. 進め方と実践の型の適用

根拠とした規範は、rulebook の cdfd-overview-rulebook、sample-authoring-standard、kata-guide の R5 の観点、用語集（tm-data-store）、共通サンプル文脈である。成果物の側は、cdfd-sample、cdfd-uc-sample、prj-overview-sample を照合した。構造や必須項目が食い違う場合は rulebook を正とした。維持した記述は、用語集と共通サンプル文脈に食い違いがなかった箇所である。直したのは、仕入から販売への受け渡しの線だけである。grade の F001 と F002 は、前の段で解消済みだったことを確かめた。未解消の指摘はない。R5-2 と R5-3 は、相手側の cdfd-uc-sample を直す案として残した。R5-4 は、rulebook が例外の戻りを全体概要に求めるかを読み切れなかったため、要判断にした。
