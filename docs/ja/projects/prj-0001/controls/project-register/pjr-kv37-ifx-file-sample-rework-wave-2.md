---
specdojo:
  id: prj-0001:pjr-kv37-ifx-file-sample-rework-wave-2
  type: project
  status: draft
  rulebook: specdojo:pjr-rulebook
  part_of:
    - prj-0001:pjr-index
  item_type: todo
  item_status: review
  priority: medium
  difficulty: medium
  owner: ARC
  registered_at: "2026-11-15T12:22:20Z"
  commit_type: docs
  commit_scope: kata
  approach: sample-maintenance
  targets:
    - specdojo:ifx-file-sample
---

# PJR-KV37 ifx-file の sample を grade の指摘で手直しする（kata-wave-2 の 2 回目）

## 1. 概要

外部ファイル連携の sample を最新の grade の指摘で直す

## 2. 入力

- T-KATA-WAVE-2-ifx-file-agent-evidence-140 で差し戻し（indie が 2026-11-15 に判断、PJR-TN43）。型の rulebook は pass、sample は needs-work
- 最新の grade（specdojo.ifx-file-sample）の major の指摘を取り込む。rulebook は変えない
- 2026-11-16 の再 grade は needs-work だった（結果は対応結果と `docs/ja/projects/prj-0001/execution/grade/results/specdojo.ifx-file-sample.yaml`）。利用者は、close せず同じ項目に次の回の完了条件を足し、0.8.0 のリリースの後に流し直すことを選んだ（2026-11-16）。配る型のため、同じ日に orchestrator が 0.8.0 の前へ前倒しした（利用者が 0.8.0 に足す todo の選定と実行を依頼）

## 3. 完了条件

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- YAML の書き方の誤り（コロンと空白を含む値の引用符の欠け）を直し、sample が YAML として読める。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。
- 次の回（2026-11-16 の再 grade の指摘を取り込む回、0.8.0 の前に流す）: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.ifx-file-sample.yaml` の未解消の指摘（major を優先）と未達の完了条件を取り込んで直し、作業内容の表を実績に合わせる。再 grade（`grade run --target kata`）は orchestrator が流すため、executor は理由をメモに書いてその行を open のまま残す。
- その次の回（2026-11-16 午後、0.8.0 の前）: `docs/ja/projects/prj-0001/execution/grade/results/specdojo.ifx-file-sample.yaml` の 09:50 の指摘をすべて取り込んで直し、作業内容の表を実績に合わせる。再 grade は orchestrator が流す。

## 4. 作業内容

| No  | 作業                                                   | 担当 | 状態 | メモ                                                                              |
| --- | ------------------------------------------------------ | ---- | ---- | --------------------------------------------------------------------------------- |
| 1   | 最新の grade の指摘を取り込んで直す                    | ARC  | done | executor が実施（対応結果を参照）                                                 |
| 2   | grade し直して結果を書く                               | ARC  | done | 2026-11-16 orchestrator が grade（ifx-file-sample は needs-work 83 点）           |
| 3   | 2026-11-16 の再 grade の指摘を取り込んで直す（次の回） | ARC  | done | executor が F001〜F007 を取り込んだ（対応結果の 2 回目を参照）                    |
| 4   | 直した後に grade し直して結果を書く（次の回）          | ARC  | done | 2026-11-16 orchestrator が型の grade（needs-work 81 点（前回 83 点）・指摘 7 件） |
| 5   | 09:50 の再 grade の指摘を取り込んで直す（その次の回）  | ARC  | done | executor が F001〜F007 を取り込んだ（対応結果の 3 回目を参照）                    |
| 6   | 直した後に grade し直して結果を書く（その次の回）      | ARC  | open | orchestrator が流す                                                               |

## 5. 対応結果

- 実施内容: [[specdojo:ifx-file-sample]] を最新の grade の指摘 F001〜F012 で直した。rulebook は変えていない。
  - YAML: `location` の「転送先: …」を除いて YAML として読めるようにした（転送先は `transport.endpoint` に既出）。2 つの YAML ブロックを YAML パーサで個別に読み、エラーがないことを確認した。
  - 週次発注 CSV: `order_unit`（`BALL` / `BOX`、商品マスタの発注単位と一致必須）を追加し、`store_code` の `pattern` を `^KINUYA-01$` に固定した。生成完了は `.tmp` からリネームされた確定ファイルの存在とし、別の完了フラグは置かない。
  - 取引状態・販売実績控え: `schema_ref` / `schema.references` を `schemas/kinuya-*.schema.json` のパスにし、新設の「参照する正本スキーマの例と検証」に JSON Schema 2020-12 の内容例、状態値の定義と組み合わせ、受入ケース（正常・不正・未解決）を示した。ajv で 8 ケースが期待どおりの合否になることを確認した。
  - 異常時の表: 発注 CSV の未生成と転送失敗、取引状態の欠落と二重開始をそれぞれ別の行に分け、YAML の `error_handling` と期限・手順をそろえた。
- 迷った点と決めた内容:
  - 正本スキーマ（F003・F004・F010）: sample の外に schema ファイルを新設せず、sample 内に内容例として示した。sample 群の範囲を広げず、完成例単体で型・状態・検証結果を読めるようにするため。配置先パスは店舗アプリ側の `schemas/` とした。
  - ifx-index との関係（F011）: [[specdojo:ifx-index-sample]] は CLI 内部の取引記録を外部 I/F から除くと定めているので、`based_on` から外した。本契約へは CLI 仕様の入出力表から辿るという登録の境界を YAML コメントに書いた。
  - `current-tx.json` の `status` は `open` / `payment_requested` の 2 値とした。会計確定と取消の時点でファイルを削除する既存の記述に合わせた。
- 残課題: `grade run --target kata` での再 grade は agent CLI の起動が要るため executor の sandbox では実行していない。runner または人間が再 grade し、結果をここに追記する。[[specdojo:clis-sample]] は今も 2 つのスキーマを「未同梱の架空参照名」としているので、表記をそろえるかは別の手直しで判断する。

再 grade の結果（2026-11-16、orchestrator が実行）: ifx-file-sample は needs-work 83 点。結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/` の `specdojo.ifx-file-sample.yaml`。

2 回目の対応（2026-11-16 の再 grade の F001〜F007、executor が実施）:

- 実施内容: [[specdojo:ifx-file-sample]] を直した。rulebook は変えていない。
  - 販売実績控え（F001・F003・F005）: `kinuya-sales-record-schema` と `required_fields` に `line_items`・`subtotal_yen`・`tax_yen` を足し、`description` に「`current-tx.json` の削除後も明細の正本として残し、会計確定後に削除・上書きしない」を書いた。受入ケースに「不正（控えの明細）」を足した。
  - 会計確定の書き込み順序（F002・F004・F006）: `transport.atomic_write` に fsync と (1) 控えを `pending` で保存 → (2) `status: payment_requested` → (3) 本部へ送信 → (4) 印字 → (5) `current-tx.json` 削除の順を書き、新設の「会計確定の書き込み順序と再開判定」に途中で止まったファイルの組み合わせごとの扱いを表で示した。`payment_requested` の意味は「送信前に書く」に改めた。
  - 週次発注 CSV（F007）: 未着の確定と届いたか不明を分け、不明のときは PO が問屋へ受領有無を確かめ、未受領か取消済みのときだけ電話発注するようにした。受領済みの CSV は `data/outbound/orders/sent/` へ移す。異常時の表の未生成・転送失敗の行もそろえた。
- 迷った点と決めた内容:
  - 書き込み順序は「控え → 状態 → 送信」とした。`status` が `open` なら未送信と判定でき、送信済みの可能性がある取引を取消・追加できる状態に見せないため。
  - `open` と `pending` の控えが残った場合は、未送信が確定しているので控えを作り直すか削除して進めるとした。
  - `payment_requested` からの取消は従来どおり不可とし、`rejected` は原因を直して同じ `tx_id` で再送するとした。取消を許すと、状態ファイルがなく `rejected` の控えだけが残る組み合わせが生まれるため。
  - 受領確認の手段は、ACK 方式が未確定（`_UNDECIDED_`）のため、SFTP の一覧取得と問屋への電話確認にした。
- 残課題: `grade run --target kata` の再 grade は agent CLI の起動が要るため executor では流していない。orchestrator が流して結果をここに追記する。

次の回の再 grade の結果（2026-11-16 09:50、orchestrator が `grade run --target kata` で実行）: needs-work 81 点（前回 83 点）・指摘 7 件。指摘は日本語で記録された（PJR-YYDS の後）。結果の正本は `docs/ja/projects/prj-0001/execution/grade/results/specdojo.ifx-file-sample.yaml`。

3 回目の対応（09:50 の再 grade の F001〜F007、executor が実施）:

- 実施内容: [[specdojo:ifx-file-sample]] を直した。rulebook は変えていない。
  - 会計確定の書き込み順序（F001・F002・F004）: `atomic_write` の (3) に、`rejected` は「売上登録失敗（exit code 3）」、`unknown` は「売上登録結果不明（exit code 3）」で停止し、`current-tx.json` と控えを保持して (4)・(5) へ進まない分岐を足した。(5) の削除は控えが `accepted` で永続化されている場合だけとした。
  - 取引状態の欠落（F003・F005）: `missing.current_tx_json` の `sales start` を、生成前に `data/sales/` の控えを検査し、`pending` / `unknown` / `rejected` があれば生成せず exit code 3 で照合へ引き継ぐ条件にした。異常時の表の「取引状態の欠落」の行もそろえた。
  - 週次発注 CSV（F006・F007）: 一覧に確定名がないことを未着の根拠にしないようにした。問屋は確定名だけを取り込む契約を `reader` に書き、確定名は rename でだけ現れるので、rename 要求前の失敗を未着の確定、rename 要求後に応答がない場合を不明とした。不明では自動再送を止め、PO が問屋の受領有無か取消を確かめてから電話発注する。異常時の表の転送失敗の行もそろえた。
- 迷った点と決めた内容:
  - F006 は「確定ファイルの保持・移動禁止を受信側に課す」か「不明として扱う」かの二択だった。問屋側の契約は `_UNDECIDED_` で店側から課せないため、受信側の保持には頼らず、rename 要求の前後で未着の確定と不明を分ける方を選んだ。
  - `rejected` の終了コードは [[specdojo:clis-sample]] の「売上登録失敗」（`3`）に合わせた。
  - `sales start` が未解決の控えで停止するときの区分は、本部受付の照合が要る点が同じなので「売上登録結果不明（exit code 3）」とした。
- 残課題: 再 grade（`grade run --target kata`）は agent CLI の起動が要るため executor では流していない。orchestrator が流して結果をここに追記する（作業内容の 6 は open のまま）。

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
