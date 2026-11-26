---
specdojo:
  id: prj-0001:xer-t-kata-review-all-imp-interface-sample-150-20261126t203229z-911d933a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-imp-interface-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-imp-interface-sample-150/T-KATA-REVIEW-ALL-imp-interface-sample-150-20261126T203229Z-911d933a/plan.md
  started_at: "2026-11-26T20:32:42.844Z"
  completed_at: "2026-11-26T20:36:00.473Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:imp-interface-sample
    - specdojo:imp-interface-sample
---

# Edit Result

## 1. 実施内容

- `imp-interface-sample` に対して R5（整合）の段を実施した。F001（`based_on` の個票 ID 形式）は前の段で `PJR-C4A1` / `pjr-c4a1` に解消済みで、rulebook の `based_on` の規定と姉妹サンプルに一致することを確かめた。
- R4 で保留だった 2 件を sample 側で直した。1 件目は本部商品マスタ照会の障害波及と `ifx-index-sample` の `error_handling` の食い違い、2 件目は在庫の I/F の呼び名である。あわせて成功条件の表記を影響調査（業務）にそろえた。
- 他の sample との突き合わせでは、ID・期限・担当・数値に食い違いはなかった。
- 検証は、executor の prettier と markdownlint、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` がいずれも passed だった。その他の検査は変更種別により `not_applicable` である。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 4. 影響詳細一覧（本部商品マスタの照会）・6. 未解決事項（バーコード照会の応答時間） | 障害波及を「中（商品コードの手入力で会計を続けられる）」としていた。しかし `ifx-index-sample` の `error_handling` は、接続不能・時間切れ・認証拒否のとき CLI が明細を追加せず停止すると定める。商品コードの照会も同じ API を使うため、手入力でも会計を続けられない。 | 障害波及を「高（照会 API が止まると、一覧の扱いどおり明細を追加できず会計が止まる。バーコード値が未登録・読み取れない場合は商品コードの手入力で会計を続けられる）」にした。未解決事項の影響と当面の扱いも一覧の扱いに合わせた。I/F の影響度（高）と件数は変わらない。選ばなかった案は、相手側の `ifx-index-sample` の `error_handling` を、接続不能でも手入力で続けられる形に見直す案である。 | vp-qe-kata-conformance（適用先の `ifx-index-sample` との整合）、vp-dev-change-impact。I/F 一覧は status: ready の正本で、照会 API 停止時の停止は二重登録や誤った単価を防ぐための扱いと読めるため、sample 側を合わせた。 | 要判断 |
| R5-2 | R5 | 1. 目的と適用範囲・3. 影響分析サマリ・4. 影響詳細一覧・5. 対応方針 | 「在庫変更イベント」は `ifx-msg-sample` の仕様名（info.title）である。同仕様の description は `ifx-index` での連携名を「本部への在庫変更通知」としている。ほかの 3 I/F は連携名で書いているため、呼び名がそろっていなかった。 | 5 か所すべてを「本部への在庫変更通知」にした。対象の I/F の初出に `ifx-msg-sample` の wikilink を添えた。 | `ifx-msg-sample` の info.description、`ifx-index-sample` の `interfaces[].name`。 | - |
| R5-3 | R5 | 2. 変更要求の概要（狙い） | 成功条件を「混雑時の 1 会計あたり平均 90 秒以内」と書いていた。`imp-business-sample` の成功条件と `imp-data-sample` の引用は「平日 16:00-18:00 の 1 会計あたり平均処理時間 90 秒以内」である。 | 「平日 16:00-18:00 の 1 会計あたり平均処理時間 90 秒以内」にそろえた。 | vp-qe-kata-conformance（同じ系列の sample との整合） | - |
| R5-4 | R5 | 4. 影響詳細一覧（確定済みレシートの印字の備考） | 波及先 `ifx-cmd-receipt-printer` は、`ifx-index-sample` が架空正本の名前を示していない I/F に付けた仮の ID である。売上登録の `ifx-api-kinuya-sales` や商品照会の `ifx-api-kinuya-products` は一覧のコメントに名前があるが、印字の I/F は `spec_ref: specdojo:ifx-cmd-sample` だけを示す。 | 相手側の `ifx-index-sample` の「確定済みレシートの印字」のコメントに、`ifx-cmd-sample` が完成例にあたる架空正本の名前（例: `ifx-cmd-receipt-printer.yaml`）を足す案。または本書の波及先を `ifx-cmd-sample` の参照に寄せる案。どちらにするかは人が決める。本タスクでは変更していない。 | vp-qe-kata-conformance | 要判断 |
| R5-5 | R5 | 4. 影響詳細一覧・5. 対応方針・6. 未解決事項 | `imp-data-sample`・`imp-test-sample`・`imp-business-sample`・`imp-operations-sample`・`ifx-index-sample` と、ID・期限・担当・数値を突き合わせた。値引き理由 `PJR-D4Q1`（2026-05-08・BA）、上位 30 品目のバーコード値の登録 2026-05-15、切替日 2026-06-01、定額・定率の各 1 件、結果不明時の保留の扱い、印字失敗時に会計を保つ扱いは一致し、食い違いはない。 | - | vp-qe-kata-conformance | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/imp-interface-sample.md`: 本部商品マスタ照会の障害波及を「高」にし、未解決事項の影響と当面の扱いを `ifx-index-sample` の `error_handling` に合わせた。在庫の I/F の呼び名を「本部への在庫変更通知」に統一し、初出に `ifx-msg-sample` への wikilink を添えた。成功条件の表記を影響調査（業務）の「平日 16:00-18:00 の 1 会計あたり平均処理時間 90 秒以内」にそろえた。表の列幅は prettier で整形した。

## 3. 申し送り

- R5-4 は相手側（`ifx-index-sample`）を直す案か、本書の波及先を `ifx-cmd-sample` の参照に寄せる案かを人が決める必要がある。本タスクでは相手側を変更していない。
- R5-1 は `ifx-index-sample` の `error_handling` を正とした。逆に相手側を見直す案もあるため、ARC の判断を確認してほしい。
- R5-1: R5 / 4. 影響詳細一覧（本部商品マスタの照会）・6. 未解決事項（バーコード照会の応答時間） / 障害波及を「中（照会できなくても商品コードの手入力で会計を続けられる）」としていたが、ifx-index-sample の `error_handling` は接続不能・時間切れ・認証拒否で CLI が明細を追加せず停止すると定める。商品コードの照会も同じ API を使うため、手入力でも会計を続けられない（R4 で ARC 判断待ちとして残っていた指摘） / 障害波及を「高（照会 API が止まると、一覧の扱いどおり明細を追加できず会計が止まる。バーコード値が未登録・読み取れない場合は商品コードの手入力で会計を続けられる）」にした。未解決事項の影響を「時間切れで止まるまでの待ち時間が 1 会計 90 秒の成功条件を崩すかを判定できない」に、当面の扱いを「一覧の扱いどおり明細を追加せず止め、復旧後に同じ取引へ商品を追加し直す前提で判定する」にした。I/F の影響度（高）と件数は変わらない / vp-qe-kata-conformance（適用先の ifx-index-sample との整合）、vp-dev-change-impact。選ばなかった案は、相手側の ifx-index-sample の `error_handling` を接続不能でも手入力で続けられる形に見直す案。I/F 一覧は status: ready の正本で、照会 API 停止時の停止は二重登録や誤った単価を防ぐための扱いと読めるため、sample 側を合わせた / 要判断
- R5-2: R5 / 1. 目的と適用範囲・3. 影響分析サマリ・4. 影響詳細一覧・5. 対応方針 / 「在庫変更イベント」は ifx-msg-sample の仕様名（info.title）であり、同仕様の description は ifx-index での連携名を「本部への在庫変更通知」（一覧に未掲載）としている。ほかの 3 I/F は連携名で書いているため、呼び名がそろっていない（R4 で判断待ちとして残っていた指摘） / 全 5 か所を「本部への在庫変更通知」にした。対象の I/F の初出に [[specdojo:ifx-msg-sample|在庫変更イベント仕様]] を添えた / ifx-msg-sample の info.description、ifx-index-sample の interfaces[].name / -
- R5-3: R5 / 2. 変更要求の概要（狙い） / 影響調査（業務）の成功条件を「混雑時の 1 会計あたり平均 90 秒以内」と書いていたが、imp-business-sample の成功条件と imp-data-sample の引用は「平日 16:00-18:00 の 1 会計あたり平均処理時間 90 秒以内」 / 「平日 16:00-18:00 の 1 会計あたり平均処理時間 90 秒以内」にそろえた / vp-qe-kata-conformance（同じ系列の sample との整合） / -
- R5-4: R5 / 4. 影響詳細一覧（確定済みレシートの印字の備考） / 波及先 `ifx-cmd-receipt-printer` は、ifx-index-sample が架空正本の名前を示していない I/F に付けた仮の ID である。売上登録の `ifx-api-kinuya-sales` や商品照会の `ifx-api-kinuya-products` は一覧のコメントに名前があるが、印字の I/F は `spec_ref: specdojo:ifx-cmd-sample` だけを示す / - / 相手側の ifx-index-sample の「確定済みレシートの印字」のコメントに、ifx-cmd-sample が完成例にあたる架空正本の名前（例: `ifx-cmd-receipt-printer.yaml`）を足す案。または本書の波及先を `ifx-cmd-sample` の参照に寄せる案。どちらにするかは人が決める / -
- R5-5: R5 / 4. 影響詳細一覧・5. 対応方針・6. 未解決事項 / imp-data-sample・imp-test-sample・imp-business-sample・imp-operations-sample・ifx-index-sample と、ID・期限・担当・数値を突き合わせた。値引き理由 `PJR-D4Q1`（2026-05-08・BA）、上位 30 品目のバーコード値の登録 2026-05-15、切替日 2026-06-01、定額・定率の各 1 件、結果不明時の保留の扱い、印字失敗時に会計を保つ扱いは一致し、食い違いはない / - / vp-qe-kata-conformance / -
- 適用外の検証: `npm run validate:history-links`（変更したのは docs/ja/specdojo/samples/imp-interface-sample.md だけで、plan・result・個票を変更していないため）
- 適用外の検証: `npm run validate:schema:file`（変更したファイルに `*.yaml` / `*.yml` がないため）
- 適用外の検証: `specdojo catalog validate`（変更は docs/ja/specdojo/samples/ 配下だけで、docs/ja/projects/ に及ばないため）

## 4. 進め方と実践の型の適用

根拠にしたのは、rulebook の `based_on` の規定、`ifx-index-sample`・`ifx-msg-sample`・`ifx-cmd-sample`、影響調査の姉妹サンプル（業務・データ・テスト・運用）である。構造や必須項目で矛盾する場合は rulebook を正とし、sample 側だけを直した。相手側を直すべき点（R5-4）は変更せず、案を handoff に残した。F001 は前の段で解消済みで、再確認の結果、問題は残っていない。
