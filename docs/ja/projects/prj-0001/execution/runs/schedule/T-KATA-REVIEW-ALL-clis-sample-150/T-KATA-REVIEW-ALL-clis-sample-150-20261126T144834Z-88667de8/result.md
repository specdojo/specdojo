---
specdojo:
  id: prj-0001:xer-t-kata-review-all-clis-sample-150-20261126t144834z-88667de8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-clis-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-clis-sample-150/T-KATA-REVIEW-ALL-clis-sample-150-20261126T144834Z-88667de8/plan.md
  started_at: "2026-11-26T14:48:45.512Z"
  completed_at: "2026-11-26T14:55:42.543Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:clis-sample
    - specdojo:clis-sample
---

# Edit Result

## 1. 実施内容

- kata レビューの段 R5（整合）を実施した。clis-sample を ifx-index-sample、ifx-api-sample、ifx-cmd-sample、sysd 系 sample、共通サンプル文脈と照合し、食い違い 2 点を sample 側で直した。
- grade の F003・F004 は前の段で解消済みと確認した。F001・F002 は kata レビューで使わない観点であり、本文に担当や管理先を足すと記述標準の禁止に触れるため、変更しなかった。
- runner 検査では `lint:md:changed`、`lint:fm:changed`、`lint:mermaid`、`lint:d2`、`test:docs`、`validate:schema` が通った。executor が `npm run lint:md` を実行しなかったのは、親 runner の検査と重複するためである。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R5-1 | R5 | 5. 入力と出力の要点 / I/F 一覧（`ifx-index-sample`） | `ifx-index-sample` は `ifx-api-sample` を `ifx-api-kinuya-sales.yaml` の完成例としている。しかし clis-sample は印字の契約例 `ifx-cmd-sample` しか参照していなかった。 | 冒頭の文に、売上登録の契約例として `[[specdojo:ifx-api-sample\|本部売上登録API]]` を足した。 | `vp-qe-kata-conformance`（kata 相互）。`ifx-index-sample.yaml` の「本部への売上登録」の `spec_ref` とコメント。 | - |
| R5-2 | R5 | 7. メモ / 将来課題 / 本部との契約・障害回復 | 重複排除を未決の論点に入れていた。しかし `ifx-api-sample` は取引 ID（`transaction_id`）による重複排除（再送に 409）を決めていた。 | 「契約例は取引 ID による重複排除までを示す」と書き、未決を受付照会と保存失敗後の回復に絞った。 | `vp-qe-kata-conformance`、`vp-dev-change-impact`。`ifx-api-sample.yaml` の `info.description` の冪等性と未決事項。 | - |
| R5-3 | R5 | 6.2. 代表的な表示と利用者の次の手（取引セッション保存失敗） | grade の F003・F004 は、開始の保存失敗では取引未開始を確かめて `sales start` をやり直す手順と回復の条件を求めていた。前の段が行を「開始」と「追加・取消」に分けて直していた。 | - | 前の段の指摘を繰り返さない（kata ガイドの「段と渡す材料」）。現行の本文で解消を確かめた。 | - |
| R5-4 | R5 | 7. メモ / 将来課題 | grade の F001・F002 は担当役割・確認の時期・管理先の追記を求めている。これらは `vp-pm-plan-feasibility`・`vp-pm-control-reporting` の指摘で、kata の段のレビューには使わない観点である。Sample 記述標準も、文書を確かめる役割の割り当てを本文に書かないとしている。 | 担当や管理先を足すと記述標準の禁止に触れるため、本文は変更しなかった。追跡が要るなら、本文ではなく登録簿の個票で扱う案を残す。 | kata ガイドの「kata の観点の組」と Sample 記述標準。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/clis-sample.md`: 冒頭の文に売上登録の契約例 `ifx-api-sample` への参照を足した。「7. メモ / 将来課題」の「本部との契約・障害回復」行では、重複排除を未決から外した。契約例は取引 ID による重複排除までを示すと明記し、未決を受付照会と保存失敗後の回復に絞った。変更後に prettier で表を整形した。

## 3. 申し送り

- R5-1: R5 / 5. 入力と出力の要点 / I/F 一覧（`ifx-index-sample`）は `ifx-api-sample` を `ifx-api-kinuya-sales.yaml` の完成例としているが、clis-sample は印字の契約例 `ifx-cmd-sample` しか参照していなかった / 冒頭の文に、売上登録の契約例として `[[specdojo:ifx-api-sample|本部売上登録API]]` を足した / `vp-qe-kata-conformance`（kata 相互）。`ifx-index-sample.yaml` の「本部への売上登録」の `spec_ref` とコメント / -
- R5-2: R5 / 7. メモ / 将来課題 / 「本部との契約・障害回復」の行が重複排除を未決の論点に入れていたが、`ifx-api-sample` は取引 ID（`transaction_id`）による重複排除（再送に 409）を決めていた / 「契約例は取引 ID による重複排除までを示す」と書き、未決を受付照会と保存失敗後の回復に絞った / `vp-qe-kata-conformance`、`vp-dev-change-impact`。`ifx-api-sample.yaml` の `info.description` の冪等性と未決事項 / -
- R5-3: R5 / 6.2. 代表的な表示と利用者の次の手（取引セッション保存失敗）/ grade の F003・F004（開始の保存失敗では取引未開始を確かめて `sales start` をやり直す手順と回復の条件）は、前の段が行を「開始」と「追加・取消」に分けて直していた / - / 前の段の指摘を繰り返さない（kata ガイドの「段と渡す材料」）。現行の本文で解消を確かめた / -
- R5-4: R5 / 7. メモ / 将来課題 / grade の F001・F002（担当役割・確認の時期・管理先を足す）は `vp-pm-plan-feasibility`・`vp-pm-control-reporting` の指摘で、kata ガイドの「kata の観点の組」では kata の段のレビューに使わない。Sample 記述標準も、文書を確かめる役割の割り当てを本文に書かないとしている / - / 担当や管理先を足すと記述標準の禁止に触れる。追跡が要るなら、本文ではなく登録簿の個票で扱う案を残す / 要判断
- 照合して食い違いがなかったもの: `ifx-cmd-sample`（印字失敗時の会計維持、保存済みレシートだけの再印刷、送信前ビジーに限る自動再試行）、`sysd-index-sample`・`sysd-critical-flows-sample`・`sysd-cross-cutting-policy-sample`（`KINUYA_API_KEY`、`config/store-config.yaml`、各 schema の参照名、紙面確認の後の再印刷）、共通サンプル文脈（単一店舗・端末 1 台、役割名の使い方）。用語集（`docs/ja/product/010-business-specs/060-glossary/`）には駄菓子屋の業務の用語がなく、照らす対象がなかった。相手側を直す案はない。

## 4. 進め方と実践の型の適用

参照の向きを成果物から sample へ切り替え、clis-sample を相手側 sample と共通サンプル文脈に照合した。食い違いは sample の側だけを直した。F003・F004 は前の段が「開始」と「追加・取消」に分けて直した現行の本文で解消を確かめた。F001・F002 は `vp-pm-plan-feasibility` と `vp-pm-control-reporting` の指摘で、kata ガイドの観点の組に含まれない。担当や管理先は本文に書かず、必要なら登録簿の個票で追跡する案を残した。この判断は要判断とした。用語集には駄菓子屋の業務用語がなく、照合する対象がなかった。
