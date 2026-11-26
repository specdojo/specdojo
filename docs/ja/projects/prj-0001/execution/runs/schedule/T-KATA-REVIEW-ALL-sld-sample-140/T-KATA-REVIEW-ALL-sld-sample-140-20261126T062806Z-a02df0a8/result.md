---
specdojo:
  id: prj-0001:xer-t-kata-review-all-sld-sample-140-20261126t062806z-a02df0a8
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-sld-sample-140
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-sld-sample-140/T-KATA-REVIEW-ALL-sld-sample-140-20261126T062806Z-a02df0a8/plan.md
  started_at: "2026-11-26T06:28:17.095Z"
  completed_at: "2026-11-26T06:38:12.918Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:sld-sample
    - specdojo:sld-sample
---

# Edit Result

## 1. 実施内容

- R4（正しさ）として `sld-sample.md` の事実を CLIS・CDSD・STSD・CDFD・`pm-members-sample`・`sld-rulebook` と突き合わせ、不一致 3 件を直した。紙の媒体名「商品台帳」を「商品ノート」に、「顧客・つけ台帳」を「常連客ノート（顧客欄・つけ欄）」に揃え、4.1 の STSD の行に抜けていた返品済み（`returned`）を足した。
- 確かめは 14 項目を行った。12 項目は一致、1 項目は不一致から直して一致、2 項目（再印刷の作り直し可否、退避媒体からの復元挙動）は正本に定めがなく確かめられなかった。確かめの表は executor の handoff にある。
- 月次報告の扱い（CDFD では未作成、sample では作成済みの紙として置いている）は、完成例として許容できるかを executor が判断できず、要判断として残した。
- plan に展開された grade の finding F001〜F005 のうち、F005（`vp-ops-operability`）は kata-guide で R4 の観点に使わないため扱っていない。F001〜F004 の扱いは evidence に記録がない。
- prettier、markdownlint、runner の `lint:md:changed`・`lint:fm:changed`・`lint:mermaid`・`lint:d2`・`test:docs`・`validate:schema` は通過した。それ以外の runner 検査は変更種別により非適用。

| No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 |
| --- | --- | --- | --- | --- | --- | --- |
| R4-1 | R4 正しさ | 2.1. 店舗内・母屋の物理保管場所（店頭台帳保管棚の行） | 置くものの「商品台帳」が、CDFD で決めた紙の媒体名「商品ノート」と合わない。 | 「商品ノート」に直した。 | `vp-arc-technical-constraints`。`docs/ja/specdojo/samples/cdfd-overview-sample.md` の商品台帳の保管先「商品ノート（現行）」。 | - |
| R4-2 | R4 正しさ | 2.1. 店頭台帳保管棚・仮メモ挟みの行、4.1. 隣接仕様の記録・状態と保管場所の対応（CDFD の行） | 「顧客・つけ台帳」が、CDFD の紙の媒体名「常連客ノート（顧客欄・つけ欄）」と合わない。 | 保管棚の行を「常連客ノート（顧客欄・つけ欄）」、仮メモの処分条件を「常連客ノートのつけ欄への転記」、対応表を「顧客台帳・つけ台帳（常連客ノート）」に直した。 | `vp-arc-technical-constraints`。`cdfd-overview-sample.md` の顧客台帳・つけ台帳の保管先と、媒体の共有を説明する段落。 | - |
| R4-3 | R4 正しさ | 4.1. 隣接仕様の記録・状態と保管場所の対応（STSD の行） | STSD の返品済み（`returned`、記録先は仕入記録）が載っておらず、4.2 の「STSD の全状態を一覧と照合する」と合わない。 | 「返品済み（`returned`）は商品が店を出るため、返品日と数量が仕入ノートに残る」を足した。 | `vp-qe-verifiability`。`docs/ja/specdojo/samples/stsd-sample.md` の状態一覧の `returned` の行。 | - |
| R4-4 | R4 正しさ | 2.1. 店舗内・母屋の物理保管場所（店頭台帳保管棚・母屋書庫の行） | CDFD では月次報告が「未作成（現行）」だが、sample では作成済みの紙として保管棚と母屋書庫に置いている。 | - | `vp-arc-technical-constraints`。将来の置き場所を示す完成例としては矛盾しないとも読める。選ばなかった案は、「月次報告（作成後）」と書き添えるか、確認事項の表に足すこと。 | 要判断 |

## 2. 変更ファイル

- `docs/ja/specdojo/samples/sld-sample.md`: 事実の照合に基づく修正。店頭台帳保管棚と仮メモ挟みの行の媒体名を CDFD に合わせて「商品ノート」「常連客ノート（顧客欄・つけ欄）」に直した。仮メモの処分条件は「常連客ノートのつけ欄への転記」にした。4.1 の CDFD の行は「顧客台帳・つけ台帳（常連客ノート）」に直した。STSD の行に返済済み（`returned`）の記録先（仕入ノート）を足した。差分は 20 行追加・20 行削除で、prettier による表の列幅の揃え直しを含む。

## 3. 申し送り

- R4-4（月次報告）は要判断。CDFD では「未作成（現行）」だが、sample は保管棚と母屋書庫に作成済みの紙として置いている。将来の置き場所を示す完成例としては矛盾しないとも読める。案は、「月次報告（作成後）」と書き添えるか、確認事項の表に足すこと。
- R4-5: grade の F005（取引セッションの消失・破損時の対処）は R4 の観点外のため未対応。足すなら CLIS の 107 行目と 109 行目を根拠に、ファイル削除や `sales cancel` で初期化せず店主代表と開発担当が照合する、という 1 行にする。
- R4-1: R4 / 2.1. 店舗内・母屋の物理保管場所（店頭台帳保管棚の行） / 置くものの「商品台帳」が、CDFD で決めた紙の媒体名「商品ノート」と合わない / 「商品ノート」に直した / `vp-arc-technical-constraints`。`docs/ja/specdojo/samples/cdfd-overview-sample.md` の商品台帳の保管先「商品ノート（現行）」 / -
- R4-2: R4 / 2.1. 店舗内・母屋の物理保管場所（店頭台帳保管棚・仮メモ挟みの行）、4.1. 隣接仕様の記録・状態と保管場所の対応（CDFD の行） / 「顧客・つけ台帳」が、CDFD の紙の媒体名「常連客ノート（顧客欄・つけ欄）」と合わない / 保管棚の行を「常連客ノート（顧客欄・つけ欄）」、仮メモの処分条件を「常連客ノートのつけ欄への転記」、対応表を「顧客台帳・つけ台帳（常連客ノート）」に直した / `vp-arc-technical-constraints`。`cdfd-overview-sample.md` の顧客台帳・つけ台帳の保管先と、媒体の共有を説明する段落 / -
- R4-3: R4 / 4.1. 隣接仕様の記録・状態と保管場所の対応（STSD の行） / STSD の返品済み（`returned`、記録先は仕入記録）が載っておらず、4.2 の「STSD の全状態を一覧と照合する」と合わない / 「返品済み（`returned`）は商品が店を出るため、返品日と数量が仕入ノートに残る」を足した / `vp-qe-verifiability`。`docs/ja/specdojo/samples/stsd-sample.md` の状態一覧の `returned` の行 / -
- R4-4: R4 / 2.1. 店舗内・母屋の物理保管場所（店頭台帳保管棚・母屋書庫の行） / CDFD では月次報告が「未作成（現行）」だが、sample では作成済みの紙として保管棚と母屋書庫に置いている / - / `vp-arc-technical-constraints`。将来の置き場所を示す完成例としては矛盾しないとも読めるので迷った。選ばなかった案は「月次報告（作成後）」と書き添えるか、確認事項の表に足すこと / 要判断
- R4-5: R4 / 3.2. 場面別の対処と復旧手順 / grade の F005（取引セッションが消えた・壊れたときの対処が無い）は `vp-ops-operability` で、kata-guide では kata の段のレビューに使わない観点のため扱わなかった / - / kata-guide の「kata の観点の組」。足すなら CLIS の107行目と109行目を根拠に、ファイル削除や `sales cancel` で初期化せず店主代表と開発担当が照合する、という1行にする / -
- 確かめの表 1: `.session/current-tx.json` の関連操作 start・add・total・complete・cancel と、CLI が終了させる場合に限る / CLIS の59〜78行目 / 読み取り / 一致 / 62行目と74行目（会計完了か取消で終える）
- 確かめの表 2: 店舗設定ファイルが無いときは CLI が既定設定で動く。構造の正本 `kinuya-store-config-schema` は同梱されていない参照名 / CLIS の59行目と123行目 / 読み取り / 一致 / 「欠落時は既定設定で進む」「各 schema は未同梱の架空参照名」
- 確かめの表 3: `data/sales/TX-YYYYMMDD-NNNN.json` は現金販売の実績と受付結果。つけ販売は CLIS の対象外 / CLIS の25行目と77行目 / 読み取り / 一致 / 対象は現金販売で、つけ販売は別の機能に渡す
- 確かめの表 4: `receipts/receipt-YYYYMMDD-NNNN.txt` は再印刷に使い、再出力できない / CLIS の78行目と125行目 / 読み取り / 確かめられない / 再印刷は保存済みレシートに限ると書かれているが、作り直しの手段の有無を直接示す記述は無い
- 確かめの表 5: 会計前の中断は `sales total` で確かめて `sales cancel`、会計後で受付結果が不明なら照合して保留 / CLIS の37行目と110行目 / 読み取り / 一致 / 受付済みなら回復、未受付と確かめた場合だけ再送
- 確かめの表 6: `data/summary/` と `tmp/` は CLIS に無い / `grep summary\|tmp/ clis-sample.md` / 実行 / 一致 / 該当なし
- 確かめの表 7: CDSD の管理単位は5つ。照合例は現金108円・つけ216円で、販売2件・合計324円 / CDSD の23〜31行目と88行目 / 読み取り / 一致 / 表の5行と照合例の行
- 確かめの表 8: 日次集計は OPS が作り QE が確かめる。販売記録は PO と QE が確かめる / CDSD の44〜45行目 / 読み取り / 一致 / 正本区分の表
- 確かめの表 9: 担当欄の割り当て（PO・OPS は店主代表、DEV は開発担当、QE は同行レビュー担当） / `pm-members-sample.yaml` / 読み取り / 一致 / 各 member の roles
- 確かめの表 10: STSD の各状態の置き場所（`received`・`inspected` は検品場所、`sellable` は売場棚、`sold` は販売記録、`return-pending` は返品保管箱、`returned` は仕入記録） / STSD の39〜44行目 / 読み取り / 不一致から直して一致 / `returned` が抜けていたため R4-3 で足した
- 確かめの表 11: 在庫記録は今は店主の記憶にしかない。販売ノートには販売明細欄と日次締め欄がある / CDFD の90〜94行目 / 読み取り / 一致 / 保管先の列
- 確かめの表 12: 削除区分の値（`削除不可`・`条件付き削除可`・`削除可`・`処分不可`・`条件付き処分可`） / `sld-rulebook.md` の96行目 / 読み取り / 一致 / `即時処分可` は使っていない
- 確かめの表 13: 販売記録の正本の保存先と保持期間は CDSD で未決 / CDSD の101行目 / 読み取り / 一致 / システム化後の保存・保持・復旧方式は `_UNDECIDED_`
- 確かめの表 14: 退避媒体から復元したときの具体的な挙動 / 該当する正本なし / - / 確かめられない / CLIS にも CDSD にも定めが無い。確かめるには CLI リファレンスか運用手順が要る
- 適用外の検証: `npm run validate:history-links`（変更は `docs/ja/specdojo/samples/sld-sample.md` だけで、plan・result・個票を変えていないため）

## 4. 進め方と実践の型の適用

sample-maintenance の R4（正しさ）として、sample の事実（媒体名、状態、担当、削除区分、コマンドと既定の挙動）を CLIS・CDSD・STSD・CDFD・`pm-members-sample`・`sld-rulebook` と照合した。正本と食い違う箇所だけを直し、一致する記述は維持した。根拠のない箇所は推測で改訂していない。確かめられなかった 2 件は確かめの表に残し、月次報告の扱いは要判断として申し送った。
