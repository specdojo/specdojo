---
specdojo:
  id: prj-0001:xep-pjr-kv37-20261115t165135z-0d09573c
  type: exec-plan
  rulebook: none
  task_id: PJR-KV37
  name: "ifx-file の sample を grade の指摘で手直しする（kata-wave-2 の 2 回目）"
  mode: edit
  status: ready
  project_id: prj-0001
  origin: register
  owner: ARC
  approach: sample-maintenance
  targets:
    - specdojo:ifx-file-sample
---

# Edit Plan: PJR-KV37

## 1. このフェーズで行うこと

外部ファイル連携の sample を最新の grade の指摘で直す

## 2. 根拠となる成果物と編集対象

根拠となる成果物:

- `name`: 外部ファイル連携仕様（agent の evidence）
- `depends_on`:
  - [[ifx-index]]
- `overview`: executor の agent が書き runner が読む evidence.json と pipeline-state.json の受け渡しについて、置き場所・命名・形式・必須項目・書き手と読み手・失敗時の扱いを定義する
- `path`: `docs/ja/product/020-external-interface-specs/ifx-file-agent-evidence.yaml`
- `result`: `docs/ja/projects/prj-0001/execution/runs/register/PJR-KV37/pjr-kv37-20261115T165135Z-0d09573c/result.md`

編集対象（rulebook frontmatter の sample 宣言から解決）:

- `kind`: sample
- `path`: `docs/ja/specdojo/samples/ifx-file-sample.md`
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

- F001 \[major/vp-ba-requirements-completeness; line=108; anchor=`"description: 発注数量（ボールまたは箱単位）"`\]: `order_quantity is described as using either balls or boxes, but the contract defines neither a unit field nor a referenced product-to-ordering-unit mapping. Specify how the unit is determined for each product_code so that a quantity such as 5 cannot produce different order volumes for the sender and recipient.`
- F002 \[major/vp-dev-implementation-readiness; line=47; anchor=`"location: data/outbound/orders/orders_YYYYMMDD.csv（転送先: /inbound/orders/orders_YYYYMMDD.csv）"`\]: `The unquoted location value contains a colon followed by a space in 転送先: /inbound/orders/, which causes YAML parsing to fail with "Nested mappings are not allowed in compact mappings." Quote the scalar or move the destination explanation into a separate field or comment so the example can be loaded.`
- F003 \[major/vp-dev-implementation-readiness; line=165; anchor=`"schema_ref: kinuya-session-schema#CurrentTransactionSession"`\]: `The JSON contract delegates its structures to explicitly undelivered fictional schemas. required_fields supplies names but not types, nested structures, or allowed states. Provide resolvable illustrative schema definitions so developers can implement compatible readers and writers from the completed example.`
- F004 \[major/vp-dev-testability; line=219; anchor=`"session_schema: kinuya-session-schema"`\]: `schema.references names undelivered fictional schemas, so readers cannot perform the rulebook's canonical-schema checks or reproduce type-validation results. Supply accessible example schemas and identify the validation procedure and expected valid/invalid outcomes for both JSON files.`
- F005 \[major/vp-qe-verifiability; line=170; anchor=`"- status"`\]: `status, api_sync_status, and print_status are required, but their permitted values and valid combinations are neither defined here nor available through the fictional schema references. Provide canonical state definitions and acceptance cases so QE can distinguish valid, invalid, and unresolved transaction records.`
- F006 \[minor/vp-qe-verifiability; line=121; anchor=`"日曜 21:45 までに生成完了フラグが確認できない場合、店舗端末へ未生成警告を表示し、"`\]: `The missing-file rule depends on a generation-complete flag without defining its name, location, writer, or success condition. Define that signal or explicitly use the atomically published final CSV as the completion condition.`
- F007 \[minor/vp-qe-verifiability; line=81; anchor=`"pattern: \"^KINUYA-\\\\d{2}$\""`\]: `The description requires the fixed store code KINUYA-01, while the pattern also accepts values such as KINUYA-99. Express the fixed value as an enforceable constraint so the declared requirement and validation result agree.`
- F008 \[major/vp-qe-omissions-consistency; line=261; anchor=``"| 週次発注 CSV の未生成・転送失敗（`missing` / `transport_failure`） | 締め切り（日曜 22:00）前は再試行を待ち、超過時は自動送信を止めて手動へ切り替える | 店主代表（`PO`）が Wi-Fi 通信状態を確認し、22:00 までに送信完了しない場合は控えをもとに問屋へ電話発注して二重発注を防ぐ  |"``\]: `This row combines missing generation with transfer failure and instructs users to wait until 22:00, whereas lines 121–122 require manual rerun or telephone fallback when generation is incomplete at 21:45. Separate the two conditions and align their deadlines and permitted actions so operators receive one consistent recovery rule.`
- F009 \[major/vp-qe-kata-conformance; line=47; anchor=`"location: data/outbound/orders/orders_YYYYMMDD.csv（転送先: /inbound/orders/orders_YYYYMMDD.csv）"`\]: `The first advertised YAML completion example is syntactically invalid because location contains an unquoted colon-space sequence. Correct the scalar and verify that both fenced contracts parse independently, as required by rulebook section 8.1.`
- F010 \[major/vp-qe-kata-conformance; line=165; anchor=`"schema_ref: kinuya-session-schema#CurrentTransactionSession"`\]: `Rulebook sections 5.6, 6.2, and 8.1 require canonical schema paths and reference verification, but this completed example substitutes explicitly undelivered fictional names. Include resolvable example schemas or provide complete inline definitions rather than leaving the demonstrated reference contract incomplete.`
- F011 \[minor/vp-qe-kata-conformance; line=147; anchor=`"- specdojo:ifx-index-sample"`\]: `The cited ifx-index-sample explicitly excludes internal CLI transaction files and contains no spec_ref matching this contract ID. Explain the alternative CLI-to-file-contract relationship and its registration boundary, or align the index mapping with rulebook section 2.1.`
- F012 \[major/vp-ops-operability; line=263; anchor=``"| 取引状態の欠落・二重開始（`current_tx_json` の状態不整合）         | 未解決の会計がある間は新規取引を開始せず、既存取引の確定状態を先に確認する       | 店番担当が `sales total` で既存明細を確認し、会計要求後なら店主代表が本部受付と `data/sales/` の控えを照合する           |"``\]: `The row groups missing current-tx.json with duplicate-start conditions and directs the operator to sales total, but lines 227–228 require sales total to stop when that file is missing. Separate missing-state recovery from existing-state inspection and identify the surviving evidence and PO/DEV reconciliation path to use before another transaction is started.`

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

## 個票の入力（前提）

次の入力を作業の前提として参照する。完了条件は別節に従う。

- T-KATA-WAVE-2-ifx-file-agent-evidence-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。型の rulebook は pass、sample は needs-work
- 最新の grade（specdojo.ifx-file-sample）の major の指摘を取り込む。rulebook は変えない

## 個票の追加完了条件

成果物カタログの `done_criteria` に加え、登録簿の個票が定める次の条件も満たす。

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- YAML の書き方の誤り（コロンと空白を含む値の引用符の欠け）を直し、sample が YAML として読める。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

`共通規約 sha256:e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e` `docs/ja/projects/prj-0001/execution/conventions/e7dd6ff2a0dec2f12ed4ffc905cd185aca2d6f9c3922c56a249c88cb45b2a14e.txt`
