---
specdojo:
  id: prj-0001:xer-t-kata-review-all-opr-access-control-sample-150-20261125t111222z-50069c6a
  type: exec-result
  task_id: T-KATA-REVIEW-ALL-opr-access-control-sample-150
  mode: edit
  status: complete
  project_id: prj-0001
  plan_ref: runs/schedule/T-KATA-REVIEW-ALL-opr-access-control-sample-150/T-KATA-REVIEW-ALL-opr-access-control-sample-150-20261125T111222Z-50069c6a/plan.md
  started_at: "2026-11-25T11:12:31.525Z"
  completed_at: "2026-11-25T11:27:27.426Z"
  agent: opus-executor
  execution: agent
  approach: sample-maintenance
  targets:
    - specdojo:opr-access-control-sample
    - specdojo:opr-sample
---

# Edit Result

## 1. 実施内容

- R5（整合）として、opr-access-control-sample と opr-sample を、兄弟の分冊・差分元・opd-access-control-sample と照合し、食い違い 3 件を sample 側で直した。
- 直した内容は、`based_on` への opr-sample の追加、模擬結果の記録先を月次点検の記録へそろえたこと、opr-sample の監査ログの識別子に変更前と変更後の値を足したことの 3 点。
- 相手側（opd-access-control-sample）を直すべき 1 件は変更せず、直す案を申し送りに残した。この 1 件は要判断。
- plan に展開された grade finding の F001〜F004 は、R5 の観点に当たらないか、すでに解消済みだった。理由は申し送りの R5-5 に書いた。
- 用語集と共通サンプル文脈との食い違いはなかった。
- 検査は、executor の prettier と markdownlint、runner の lint:md:changed、lint:fm:changed、lint:mermaid、lint:d2、test:docs、validate:schema が通った。TypeScript 系など変更の種類に当たらない検査は `not_applicable` になった。

## 2. 変更ファイル

- `docs/ja/specdojo/samples/opr-access-control-sample.md`: frontmatter の `based_on` に opr-sample を追加した。「証跡」の最後の段落は、手順の模擬の結果を棚卸し記録ではなく月次点検の記録に残す内容へ改めた。残す項目は、確認日、確認環境、対象手順、権限変更記録の `ticket_id`、各章の完了条件の合否。
- `docs/ja/specdojo/samples/opr-sample.md`: 「証跡」の表の監査ログの行で、最低限残す識別子に変更前と変更後の値を足した。opd-access-control-sample の「監査ログ」の節と、opr-access-control-sample の証跡の表に合わせた変更。prettier で表の列幅も整えた。

## 3. 申し送り

- R5-4 は要判断。箇所は opd-access-control-sample.md の「関連ドキュメント導線（`opr` 等）」の表にある opr-index-sample の行。目的を「月次点検の手順の入口」としているが、月次点検の手順を持つのは opr-sample。本タスクでは相手側を変更していない。案は 2 つある。1 つ目は、行の参照先を opr-sample に替える。2 つ目は、opr-index-sample を手順群の入口として残し、目的を「手順群の入口」に改めて opr-sample の行を足す。どちらを採るかは決められなかった。
- F001・F004（`vp-po-decision-readiness`・`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点なので、R5 では扱わなかった。F002（`vp-qe-verifiability`）は R4 の観点で、opr-sample の概要の未決事項の表に保管期間の行があり解消済み。F003 は opr-sample の関連導線の表が分冊をすべて作成済として列挙しており解消済み。
- R5-1: 段 R5 / 箇所: opr-access-control-sample.md の frontmatter の `based_on` / 指摘: 本文で [[specdojo:opr-sample|運用手順]]（`opr-index`）を差分元としているのに `based_on` に specdojo:opr-sample がなく、ほかの分冊（support・change・batch・backup-restore・incident）と食い違う / 直した案: `based_on` に specdojo:opr-sample を足した / 根拠: `vp-qe-kata-conformance`、opr-support-sample.md・opr-change-sample.md の `based_on`、T-KATA-REVIEW-ALL-opr-incident-sample-150 の No: 6 / 印: -
- R5-2: 段 R5 / 箇所: opr-access-control-sample.md の「証跡」の最後の段落 / 指摘: 手順の模擬の結果を棚卸し記録に残すとしていたが、差分元の opr-sample の証跡と兄弟の分冊（monitoring・batch・backup-restore・support・incident）はすべて月次点検の記録に残している / 直した案: 「模擬の結果は `opr-index` の証跡のとおり月次点検の記録に、確認日・確認環境・対象手順・権限変更記録の `ticket_id`・各章の完了条件の合否を残す」に改めた / 根拠: `vp-qe-kata-conformance`、opr-sample.md の「証跡」の最後の段落、opr-monitoring-sample.md の「証跡」 / 印: -
- R5-3: 段 R5 / 箇所: opr-sample.md の「証跡」の表の監査ログの行 / 指摘: 最低限残す識別子が「操作日時、アカウント、操作の種類」だけで、opd-access-control-sample の「監査ログ」の節（各記録に変更前と変更後の値を残す）と opr-access-control-sample の証跡の表に食い違う / 直した案: 識別子に「変更前と変更後の値」を足した / 根拠: `vp-qe-kata-conformance`、`vp-dev-change-impact`、opd-access-control-sample.md の「監査ログ」 / 印: -
- R5-4: 段 R5 / 箇所: opd-access-control-sample.md の「関連ドキュメント導線（`opr` 等）」の表の opr-index-sample の行 / 指摘: 目的を「月次点検の手順の入口」としているが、月次点検の手順（日次・週次・月次点検手順、棚卸し）を持つのは opr-sample であり、opr-access-control-sample も opr-sample を共通規約と月次点検の入口としている / 直した案: -（別 kata のため変えていない）。相手側の案は、行の参照先を [[specdojo:opr-sample\|運用手順]] に替える。または opr-index-sample を手順群の入口として残し、目的を「手順群の入口」に改めて opr-sample の行を足す / 根拠: `vp-qe-kata-conformance`、opr-sample.md の「日次・週次・月次点検手順」と「アカウント付与・剥奪手順」。要判断の理由: opr-index-sample を手順群の入口とする読み方もあり、どちらの案を採るか決められなかった / 印: 要判断
- R5-5: 段 R5 / 箇所: plan の grade finding F001〜F004 / 指摘: F001・F004（`vp-po-decision-readiness`・`vp-ops-release-readiness`）は、kata-guide の「kata の観点の組」で kata の段のレビューに使わない観点とされている。F002（`vp-qe-verifiability`）は R4 の観点で、opr-sample の概要の未決事項の表に「監査ログ以外の証跡の保管期間」の行があり解消済み。F003 は opr-sample の関連導線の表が分冊をすべて作成済として列挙しており解消済み / 直した案: -（R5 では扱わない） / 根拠: docs/ja/specdojo/guides/kata-guide.md の「kata の観点の組」 / 印: -
- 用語集（docs/ja/product/010-business-specs/060-glossary/）に権限・アカウント・棚卸し・監査ログの用語はなく、食い違いはなかった。共通サンプル文脈（店主代表・家族利用者代表の店番、タブレット 1 台）とも整合している。
- 適用外の検証: `npm run validate:history-links`（変更は docs/ja/specdojo/samples/ 配下の sample 2 ファイルだけで、plan・result・個票を変更していない）

## 4. 進め方と実践の型の適用

sample-maintenance の R5（整合）として実施した。読んだ範囲は、同じ接頭辞の sample（index と分冊）、`based_on` と wikilink の参照先、用語集、共通サンプル文脈。食い違いは sample 側を直し、相手側の opd-access-control-sample は変更せず直す案を申し送りに残した。根拠は `vp-qe-kata-conformance` と `vp-dev-change-impact`。指摘は次の表にまとめた。 | No | 段 | 箇所 | 指摘 | 直した案 | 根拠 | 印 | | --- | --- | --- | --- | --- | --- | --- | | R5-1 | R5 | opr-access-control-sample の frontmatter `based_on` | 本文は opr-sample を差分元としているが `based_on` になく、ほかの分冊と食い違う | `based_on` に opr-sample を追加した | `vp-qe-kata-conformance`、opr-support-sample と opr-change-sample の `based_on` | - | | R5-2 | R5 | opr-access-control-sample の「証跡」の最後の段落 | 模擬の結果を棚卸し記録に残すとしていたが、差分元と兄弟の分冊は月次点検の記録に残している | 月次点検の記録に、確認日・確認環境・対象手順・権限変更記録の `ticket_id`・各章の完了条件の合否を残す内容に改めた | `vp-qe-kata-conformance`、opr-sample と opr-monitoring-sample の「証跡」 | - | | R5-3 | R5 | opr-sample の「証跡」の表の監査ログの行 | 識別子が「操作日時、アカウント、操作の種類」だけで、opd-access-control-sample の「監査ログ」と食い違う | 識別子に変更前と変更後の値を足した | `vp-qe-kata-conformance`、`vp-dev-change-impact`、opd-access-control-sample の「監査ログ」 | - | | R5-4 | R5 | opd-access-control-sample の関連導線の表の opr-index-sample の行 | 目的を「月次点検の手順の入口」としているが、その手順を持つのは opr-sample | 変更なし（別 kata のため）。案は申し送りに記載 | `vp-qe-kata-conformance`、opr-sample の「日次・週次・月次点検手順」 | 要判断 | plan の grade finding F001〜F004 は、R5 の観点に当たらないか解消済みで、改訂は不要と判断した。理由は申し送りに書いた。用語集に権限・アカウント・棚卸し・監査ログの用語はなく、共通サンプル文脈（店主代表・家族利用者代表の店番、タブレット 1 台）とも整合している。rulebook と矛盾する記述はなく、frontmatter の `status` は変更していない。
