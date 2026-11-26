---
specdojo:
  id: prj-0001:xer-t-kata-review-all-ifx-api-sample-150-20261126t151423z-59076ae4
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-ifx-api-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-ifx-api-sample-150/T-KATA-REVIEW-ALL-ifx-api-sample-150-20261126T151423Z-59076ae4/plan.md
  started_at: "2026-11-26T15:14:34.661Z"
  completed_at: "2026-11-26T15:22:03.622Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - prj-0001:ifx-api-sample
    - specdojo:ifx-api-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として `ifx-api-sample.yaml` を、同じ系列の sample（ifx-index-sample、ifx-file-sample、sysd-cross-cutting-policy-sample、bdd-sample、pm-members-sample）、用語集、共通サンプル文脈と突き合わせた。
- 預かり金の扱い（`_ASSUMPTION_` と `SaleLine.description` の 2 か所）と、429・500 応答の再送の記述（2 か所）を関連 sample に合わせて直した。
- 外部 I/F 一覧側（ifx-index-sample）の未決範囲の食い違いは、相手側のため変更せず、直す案を findings に残した。
- 検証は prettier の確認と YAML の読み込み、runner の lint・schema 検査が通った。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | R5 | docs/ja/specdojo/samples/ifx-api-sample.yaml 4 行目の `_ASSUMPTION_` と `SaleLine.description` | 預かり金を「本部が商品マスタから計算する」と書いていた。ifx-file-sample の `TX-*.json` は預かり金・釣銭を店舗側の記録とし、ifx-index-sample の timing でも店番担当が店舗で確かめる値としており、本部が計算できる値ではない。 | 「税区分・税額・合計は送らず本部が計算する。預かり金・釣銭は店舗端末の記録だけに残して送らない」に分けた。 | [[specdojo:ifx-file-sample]] の `TX-YYYYMMDD-NNNN.json` の description と `required_fields`、[[specdojo:ifx-index-sample]] の「本部への売上登録」の timing | 反映済み |
| 2 | R5 | docs/ja/specdojo/samples/ifx-api-sample.yaml の 429 と 500 の応答の description | 「同じ取引 ID で送り直す」とだけあり、自動で再送するように読めた。`scp-IDM-001`、`scp-RET-001`、ifx-file-sample の `_UNDECIDED_`（自動再送せず店頭で保留する）と食い違う。 | 429 は「未受付。自動では送り直さず、`Retry-After` の秒数が過ぎた後に店番担当の操作で同じ取引 ID を送り直す」とした。500 は「自動では送り直さない。PO（店主代表）と DEV が本部受付とローカル記録を照合し、未受付と確かめた場合だけ同じ取引 ID で送り直す」とした。 | [[specdojo:sysd-cross-cutting-policy-sample]] の `scp-IDM-001`・`scp-RET-001`、[[specdojo:ifx-file-sample]] の 183〜184 行目、[[specdojo:ifx-index-sample]] の `error_handling` | 反映済み |
| 3 | R5 | docs/ja/specdojo/samples/ifx-index-sample.yaml 57 行目の `_UNDECIDED_`（相手側。変更していない） | 一覧側は「結果不明時の受付照会と保存失敗後の回復方式が未決」としている。詳細契約は 409 で既存の `sale_id` を返すため、保存失敗後も同じ取引 ID の再送で受付済みを回復できる。契約の未決は受付照会だけで、両者の未決の範囲が食い違う。 | ifx-index-sample の 57 行目を「結果不明時の受付照会が未決（保存失敗後の回復は同契約の 409 による既存 `sale_id` の返却で扱う）」へ狭める。回復の手順を未決として残すなら、ifx-api-sample の `_UNDECIDED_` に「保存失敗後の回復手順」を足して両者をそろえる。 | [[specdojo:ifx-api-sample]] の 409 の応答と info.description の冪等性、[[specdojo:ifx-index-sample]] の 57 行目 | 要判断 |
| 4 | R5 | 確かめて食い違いがなかった項目 | 取引 ID の形式 `TX-YYYYMMDD-NNNN` と `maxLength: 16`、201 で `sale_id` を保存してから会計を確定する順序、409 を受付済みとして扱うこと、bdd-sample の `schema_ref`、開発担当の表記、用語集、共通サンプル文脈（単一店舗・現金販売）は食い違いがなく、変更していない。 | - | 各 sample の該当箇所と docs/ja/product/010-business-specs/060-glossary/ の grep | - |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/ifx-api-sample.yaml`: 預かり金・釣銭を本部が計算する値とする記述を改め、税区分・税額・合計は本部が計算し、預かり金・釣銭は店舗端末の記録だけに残して送らないと分けた。429 は店番担当の操作による再送、500 は PO（店主代表）と DEV が未受付を確かめた場合だけ同じ取引 ID で再送、と自動再送しない記述にした。

## 3. 申し送り

- F005（`generated/ifx-api-sample.md` が古い）は R5 の観点の外で、git 管理外の生成物のため扱っていない。yaml-pages での再生成が必要。
- No: 1 / 段: R5 / 箇所: docs/ja/specdojo/samples/ifx-api-sample.yaml 4 行目の `_ASSUMPTION_` と `SaleLine.description` / 指摘: 預かり金を「本部が商品マスタから計算する」と書いていた。ifx-file-sample の `TX-*.json` は預かり金・釣銭（`tendered_yen`・`change_yen`）を店舗側の記録とし、ifx-index-sample の timing でも店番担当が店舗で確かめる値としており、本部が計算できる値ではない / 直した案: 「税区分・税額・合計は送らず本部が計算する。預かり金・釣銭は店舗端末の記録だけに残して送らない」に分けた（反映済み） / 根拠: [[specdojo:ifx-file-sample]] の `TX-YYYYMMDD-NNNN.json` の description と `required_fields`、[[specdojo:ifx-index-sample]] の「本部への売上登録」の timing / 印: 反映済み
- No: 2 / 段: R5 / 箇所: docs/ja/specdojo/samples/ifx-api-sample.yaml の 429 と 500 の応答の description / 指摘: 「同じ取引 ID で送り直す」とだけあり自動で再送するように読めた。sysd-cross-cutting-policy-sample の `scp-IDM-001`（重複排除が保証されても自動再送を追加しない、未受付を確かめた場合だけ同じ取引で再開する）、`scp-RET-001`（会計登録は自動 retry しない）、ifx-file-sample の `_UNDECIDED_`（自動再送せず店頭で保留する）と食い違う / 直した案: 429 は「未受付。自動では送り直さず、`Retry-After` の秒数が過ぎた後に店番担当の操作で同じ取引 ID を送り直す」、500 は「自動では送り直さない。PO（店主代表）と DEV が本部受付とローカル記録を照合し、未受付と確かめた場合だけ同じ取引 ID で送り直す」とした（反映済み） / 根拠: [[specdojo:sysd-cross-cutting-policy-sample]] の `scp-IDM-001`・`scp-RET-001`、[[specdojo:ifx-file-sample]] の 183〜184 行目、[[specdojo:ifx-index-sample]] の `error_handling`（店主代表と開発担当が照合する） / 印: 反映済み
- No: 3 / 段: R5 / 箇所: docs/ja/specdojo/samples/ifx-index-sample.yaml 57 行目の `_UNDECIDED_`（相手側。変更していない） / 指摘: 一覧側は「結果不明時の受付照会と保存失敗後の回復方式が未決」としている。詳細契約の ifx-api-sample は 409 で既存の `sale_id` を返すため、ローカル保存に失敗した後でも同じ取引 ID の再送で受付済みを回復できる。契約の未決は受付照会だけ（ifx-api-sample 3 行目）で、両者の未決の範囲が食い違う / 直す案: ifx-index-sample の 57 行目を「結果不明時の受付照会が未決（保存失敗後の回復は同契約の 409 による既存 `sale_id` の返却で扱う）」へ狭める。回復の手順（いつ再送してよいか）を未決として残すなら、ifx-api-sample の `_UNDECIDED_` に「保存失敗後の回復手順」を足して両者をそろえる / 根拠: [[specdojo:ifx-api-sample]] の 409 の応答と info.description の冪等性、[[specdojo:ifx-index-sample]] の 57 行目 / 印: 要判断
- No: 4 / 段: R5 / 箇所: 確かめて食い違いがなかった項目 / 指摘: 次は食い違いがなく変更していない。取引 ID の形式 `TX-YYYYMMDD-NNNN` と `maxLength: 16`（ifx-file-sample のファイル名と一致）、201 で `sale_id` を保存してから会計を確定する順序（`scp-ERR-001` と一致）、409 を受付済みとして扱うこと（ifx-file-sample の `api_sync_status` が accepted）、bdd-sample の `schema_ref`（`CreateSaleResponse` は存在し `sale_id` と `status: ACCEPTED` が一致）、開発担当の表記（pm-members-sample の developer は PM・BA・DEV を兼ねる）、用語集（取引・冪等などの kata 固有の項目なし）、共通サンプル文脈（単一店舗・現金販売） / 直した案: なし / 根拠: 各 sample の該当箇所と docs/ja/product/010-business-specs/060-glossary/ の grep / 印: なし
- grade の指摘 F001〜F006 は前の段の版で解消済み（`_ASSUMPTION_` の分離、Role code、`details` の構造、コメントの重複の削除）で、R5 では繰り返していない。F005（docs/ja/specdojo/samples/generated/ifx-api-sample.md が古い）は R5 の観点の外で、git 管理外の生成物のため作業の対象外とした。yaml-pages で作り直す必要がある。
- 適用外の検証: `npm run validate:schema:file`（sample の先頭に `specdojo-schema: none reason=external-openapi` の宣言があり、照合する SpecDojo の schema がない）

## 4. 進め方と実践の型の適用

sample-maintenance の R5（整合）として、ifx-index-sample、ifx-file-sample、sysd-cross-cutting-policy-sample、bdd-sample、pm-members-sample、用語集、共通サンプル文脈を読み、食い違う箇所だけを sample 側で直した。相手側を直すべき点は変更せず案として残した。grade の F001〜F006 は前の段で解消済みのため繰り返していない。
