---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-index-sample-130-20261126t003756z-96ad4ffd
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-index-sample-130
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-index-sample-130/T-KATA-REVIEW-ALL-ifx-index-sample-130-20261126T003756Z-96ad4ffd/plan.md
  started_at: "2026-11-26T00:38:07.029Z"
  completed_at: "2026-11-26T00:46:38.585Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-index-sample
    - specdojo:ifx-index-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R3（読みやすさ）として、`docs/ja/specdojo/samples/ifx-index-sample.yaml` の文を直した。主語の欠落の補完、長い文の分割、指示語や「該当コメント」の言い換え、用語のぶれの解消、略語の初出での正式名の補記を行った。
- schema 検査と prettier は通過した。runner の `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` も通過した。
- grade の F001 は観点が `vp-qe-kata-conformance`（R5）のため、R3 では扱わず R5 に任せた。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R3-1 | R3 | interfaces 本部商品マスタの照会 `error_handling` | 「コードを訂正する」「明細を追加せず停止する」「同じ取引へ追加する」の主語がない。 | 店番担当（訂正・追加）と CLI（停止）を主語に補った。 | W1 | - |
| R3-2 | R3 | interfaces 本部商品マスタの照会 `_TODO_` コメント | 「契約と期待結果をそろえて実在する ID へ接続する」の主語と、何を接続するのかが読めない。 | 「DEV は…そろえ、`spec_ref` を契約の ID へ付け替える」にした。作業登録の依頼の文は別の文にし、「末尾のコメント」と言い切った。 | W1・W4 | - |
| R3-3 | R3 | interfaces 本部への売上登録 `error_handling` | 保持・保留・繰り返さないの主語と、保留する対象がない。 | CLI（保持）と店番担当（繰り返さない）を主語に補い、「取引を保留する」と目的語を補った。最後の文を2文に分けた。 | W1・W3 | - |
| R3-4 | R3 | interfaces 本部への売上登録 `_UNDECIDED_` コメント | 確認の分担の文に読点が多く、3つの主体が並んでいる。「合意を記録して実在する ID へ接続するまで」は主語がなく、`spec_ref` が既存の契約を指すため、何を接続するのかが読めない。 | 分担を「確認の分担は次のとおり」の後で文ごとに分けた。後半を「DEV が…合意を同契約へ記録し、このコメントを記録の ID へ付け替える。それまで…保留する」に直した。 | W1・W3・W4。迷った理由は、「実在する ID へ接続」を末尾コメントの「付け替え」と同じ意味と読んだが、`spec_ref` の付け替えと読む案も残ること。`spec_ref` はすでに実在するため、その案は採らなかった。 | 要判断 |
| R3-5 | R3 | interfaces 確定済みレシートの印字 `format` コメントと `error_handling` | 同じ契約を「印刷契約」「詳細仕様」と呼んでいて、他の連携の「詳細契約」とそろっていない。「詳細仕様の送信前失敗の識別条件」は「の」が続き、係りが読みにくい。 | 両方を「詳細契約」にそろえ、「詳細契約が定める送信前失敗の識別条件」にした。 | `vp-ux-language-consistency`・W5 | - |
| R3-6 | R3 | interfaces 確定済みレシートの印字 `error_handling` | 「会計を維持し、未印字の警告と控えを残す」の主語がない。 | 「CLI は会計を維持し…」にした。 | W1 | - |
| R3-7 | R3 | interfaces 確定済みレシートの印字 `_TODO_` コメント | 「QE が…確認した記録を、…PO へ渡す」は修飾が長い。「採否は保留する」は保留する主体が消えている。 | 確認と受け渡しを2文に分け、「それまで PO は…採否を保留する」にした。 | W3・W5・W6 | - |
| R3-8 | R3 | 末尾コメント（残作業の登録） | 「上記3連携」は指示語で、PJR は初出で正式名がなく、依頼する人も書かれていない。「同じ時点で」の文は、依頼の中身なのか別の行動なのかが読めない。「該当コメント」は指す先が決まらない。 | 「3連携」「プロジェクト登録簿（PJR）」にした。「ARC は…PM（開発担当）へ次の2点を依頼する」とし、1点目（Schedule への登録）と2点目（PJR への登録と PO への報告）に分けた。「各連携の残作業のコメント」と言い切った。 | W1・W4・W8（用語集 `tm-register` の「登録簿」）。迷った理由は、依頼する人を冒頭コメントの「ARC が連携名と詳細契約の対応を整理し、DEV と QE へ…渡す」から ARC と補ったこと。主語を補わない案は W1 を満たさないため採らなかった。 | 要判断 |
| R3-9 | R3 | interfaces 本部への売上登録 `spec_ref`（grade F001） | 観点が `vp-qe-kata-conformance`（R5）のため、R3 では扱わない。 | R1-5 と同じく R5 に任せる。`specdojo:clis-sample` の入出力表の参照を `specdojo:ifx-api-sample` にそろえる案がある。 | - | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-index-sample.yaml`: 本部商品マスタの照会、本部への売上登録、確定済みレシートの印字の各連携にある `error_handling` と `_TODO_`・`_UNDECIDED_` コメントで、主語を補い長文を分割した。「印刷契約」「詳細仕様」を「詳細契約」にそろえた。末尾コメントの「上記3連携」「PJR」「該当コメント」を言い換え、依頼する人と依頼の2点を明示した。

## 3. 申し送り

- R3-4 と R3-8 は迷った指摘のため、「要判断」の印を付けた。R3-4 は、原文の「実在する ID へ接続」を末尾コメントの「付け替え」と同じ意味と読んだ。`spec_ref` の付け替えと読む案も残る。R3-8 は、依頼する人を冒頭コメントから ARC と補った。
- F001（`specdojo:clis-sample` と `specdojo:ifx-api-sample` の参照のずれ）は R5 で扱う。executor は、`clis-sample` の入出力表の参照を `specdojo:ifx-api-sample` にそろえる案を挙げている。
- R3-1: R3 / interfaces 本部商品マスタの照会 `error_handling` / 「コードを訂正する」「明細を追加せず停止する」「同じ取引へ追加する」の主語がない / 店番担当（訂正・追加）と CLI（停止）を主語に補った / W1 / -
- R3-2: R3 / interfaces 本部商品マスタの照会 `_TODO_` コメント / 「契約と期待結果をそろえて実在する ID へ接続する」の主語と、何を接続するのかが読めない / 「DEV は…そろえ、`spec_ref` を契約の ID へ付け替える」にした。作業登録の依頼の文は別の文にし、「末尾のコメント」と言い切った / W1・W4 / -
- R3-3: R3 / interfaces 本部への売上登録 `error_handling` / 保持・保留・繰り返さないの主語と、保留する対象がない / CLI（保持）・店番担当（繰り返さない）を主語に補い、「取引を保留する」と目的語を補った。最後の文を 2 文に分けた / W1・W3 / -
- R3-4: R3 / interfaces 本部への売上登録 `_UNDECIDED_` コメント / 確認の分担の文に読点が多く 3 つの主体が並んでいる。「合意を記録して実在する ID へ接続するまで」は主語がなく、`spec_ref` が既存の契約を指すため、何を接続するのかが読めない / 分担を「確認の分担は次のとおり」の後で文ごとに分けた。後半を「DEV が…合意を同契約へ記録し、このコメントを記録の ID へ付け替える。それまで…保留する」に直した / W1・W3・W4。迷った理由: 原文の「実在する ID へ接続」は末尾コメントの「実在する作業・管理レコードの参照へ付け替え」と同じ意味と読んだが、`spec_ref` の付け替えと読む案も残る。`spec_ref` はすでに実在するため、その案は採らなかった / 要判断
- R3-5: R3 / interfaces 確定済みレシートの印字の `format` コメントと `error_handling` / 同じ契約を「印刷契約」「詳細仕様」と呼んでいて、他の連携の「詳細契約」とそろっていない。「詳細仕様の送信前失敗の識別条件」は「の」が続き、係りが読みにくい / 両方を「詳細契約」にそろえ、「詳細契約が定める送信前失敗の識別条件」にした / `vp-ux-language-consistency`・W5 / -
- R3-6: R3 / interfaces 確定済みレシートの印字 `error_handling` / 「会計を維持し、未印字の警告と控えを残す」の主語がない / 「CLI は会計を維持し…」にした / W1 / -
- R3-7: R3 / interfaces 確定済みレシートの印字 `_TODO_` コメント / 「QE が…確認した記録を、…PO へ渡す」は修飾が長い。「採否は保留する」は保留する主体が消えている / 確認と受け渡しを 2 文に分け、「それまで PO は…採否を保留する」にした / W3・W5・W6 / -
- R3-8: R3 / 末尾コメント（残作業の登録） / 「上記3連携」は指示語、PJR は初出で正式名がない、依頼する人が書かれていない。「同じ時点で」の文は、依頼の中身なのか別の行動なのかが読めない。「該当コメント」は指す先が決まらない / 「3連携」「プロジェクト登録簿（PJR）」にした。「ARC は…PM（開発担当）へ次の2点を依頼する」とし、1点目（Schedule への登録）と 2点目（PJR への登録と PO への報告）に分けた。「各連携の残作業のコメント」と言い切った / W1・W4・W8（用語集 `tm-register` の「登録簿」） / 迷った理由: 依頼する人を、冒頭コメントの「ARC が連携名と詳細契約の対応を整理し、DEV と QE へ…渡す」から ARC と補った。主語を補わない案は W1 を満たさないため採らなかった / 要判断
- R3-9: R3 / interfaces 本部への売上登録 `spec_ref`（grade F001） / 観点が `vp-qe-kata-conformance`（R5）のため R3 では扱わない / - / R1-5 と同じく R5 に任せる。`specdojo:clis-sample` の入出力表の参照を `specdojo:ifx-api-sample` にそろえる案 / -
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ifx-index-sample.yaml だけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

plan の「進め方」と、plan が指す kata-guide の「文章のチェック項目」（W1〜W10）に従い、R3 の観点に当たる箇所だけを直した。意味と判断に要る背景・例外・制約は変えていない。F001 は観点が `vp-qe-kata-conformance`（R5）のため見送った。
