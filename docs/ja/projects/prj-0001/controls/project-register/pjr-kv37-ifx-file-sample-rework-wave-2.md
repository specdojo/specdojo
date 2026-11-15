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

## 3. 完了条件

- 最新の grade（`specdojo.<型>-sample`）の blocker・major の指摘を取り込み、sample を完成例として直す。rulebook は変えない。共通サンプル文脈（駄菓子屋）を保つ。
- 直した後に `grade run --target kata` で rulebook と sample を grade し直し、sample が pass になる。結果を対応結果に書く。
- YAML の書き方の誤り（コロンと空白を含む値の引用符の欠け）を直し、sample が YAML として読める。
- 迷った点は executor が決め、決めた内容と理由を個票の対応結果に書いている。pipeline では報告の `handoff` にも書く。
- `npm run lint:md`・`npm run lint:fm`・`npm run validate:schema`・`npm run validate:catalog` と親の検証が通っている。

## 4. 作業内容

| No  | 作業                                | 担当 | 状態 | メモ                                                                    |
| --- | ----------------------------------- | ---- | ---- | ----------------------------------------------------------------------- |
| 1   | 最新の grade の指摘を取り込んで直す | ARC  | done | executor が実施（対応結果を参照）                                       |
| 2   | grade し直して結果を書く            | ARC  | done | 2026-11-16 orchestrator が grade（ifx-file-sample は needs-work 83 点） |

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

## 6. 関連ドキュメント

- [[prj-0001:pjr-tn43-user-decisions-pending]]
